import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

// 1. Run the regular vite build
console.log("▶ Running vite build...");
execSync("npx vite build", { stdio: "inherit" });

// 2. Prepare .vercel/output directory structure
const OUTPUT = join(process.cwd(), ".vercel", "output");
const STATIC = join(OUTPUT, "static");
const FN_DIR = join(OUTPUT, "functions", "ssr.func");

// Clean previous output
if (existsSync(OUTPUT)) {
  cpSync(OUTPUT, OUTPUT + "_bak", { recursive: true, force: true });
}

mkdirSync(STATIC, { recursive: true });
mkdirSync(FN_DIR, { recursive: true });

// 3. Write the config
writeFileSync(
  join(OUTPUT, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        // Serve static assets from client build
        {
          src: "/assets/(.*)",
          headers: { "Cache-Control": "public, max-age=31536000, immutable" },
        },
        {
          src: "/awards/(.*)",
          headers: { "Cache-Control": "public, max-age=86400" },
        },
        {
          src: "/gallery/(.*)",
          headers: { "Cache-Control": "public, max-age=86400" },
        },
        {
          src: "/houses/(.*)",
          headers: { "Cache-Control": "public, max-age=86400" },
        },
        // Try static files first, then SSR
        { handle: "filesystem" },
        // All other routes go to SSR function
        { src: "/(.*)", dest: "/ssr" },
      ],
    },
    null,
    2
  )
);

// 4. Copy client assets to static directory
console.log("▶ Copying client assets to static/...");
cpSync(join(process.cwd(), "dist", "client"), STATIC, { recursive: true });

// Also copy public directory assets if they exist
if (existsSync(join(process.cwd(), "public"))) {
  cpSync(join(process.cwd(), "public"), STATIC, { recursive: true, force: true });
}

// 5. Copy server to the function directory
console.log("▶ Setting up serverless function...");
cpSync(join(process.cwd(), "dist", "server"), join(FN_DIR, "dist", "server"), {
  recursive: true,
});

// 6. Create the Node.js function entry point
writeFileSync(
  join(FN_DIR, "index.mjs"),
  `
import server from "./dist/server/server.js";

export default async function handler(request, context) {
  try {
    const response = await server.fetch(request);
    return response;
  } catch (error) {
    console.error("SSR Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
`.trim()
);

// 7. Write the function config
writeFileSync(
  join(FN_DIR, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs22.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      supportsResponseStreaming: true,
    },
    null,
    2
  )
);

// 8. Copy necessary node_modules that the server needs
// Check what the server imports
const serverCode = readFileSync(
  join(process.cwd(), "dist", "server", "server.js"),
  "utf-8"
);

// Find external imports (from node_modules)
const importPattern = /from\s+["']([^"'./][^"']*)["']/g;
const externalDeps = new Set();
let match;
while ((match = importPattern.exec(serverCode)) !== null) {
  // Get the package name (handle scoped packages)
  const parts = match[1].split("/");
  const pkgName = match[1].startsWith("@")
    ? parts.slice(0, 2).join("/")
    : parts[0];
  // Skip node: built-in modules
  if (!pkgName.startsWith("node:")) {
    externalDeps.add(pkgName);
  }
}

// Also scan server assets for external deps
const serverAssetsDir = join(process.cwd(), "dist", "server", "assets");
if (existsSync(serverAssetsDir)) {
  for (const file of readdirSync(serverAssetsDir)) {
    if (file.endsWith(".js")) {
      const code = readFileSync(join(serverAssetsDir, file), "utf-8");
      let assetMatch;
      const assetPattern = /from\s+["']([^"'./][^"']*)["']/g;
      while ((assetMatch = assetPattern.exec(code)) !== null) {
        const parts = assetMatch[1].split("/");
        const pkgName = assetMatch[1].startsWith("@")
          ? parts.slice(0, 2).join("/")
          : parts[0];
        if (!pkgName.startsWith("node:")) {
          externalDeps.add(pkgName);
        }
      }
    }
  }
}

console.log("▶ External dependencies:", [...externalDeps]);

// Copy external deps to function node_modules
for (const dep of externalDeps) {
  const depPath = join(process.cwd(), "node_modules", dep);
  const destPath = join(FN_DIR, "node_modules", dep);
  if (existsSync(depPath)) {
    mkdirSync(join(FN_DIR, "node_modules"), { recursive: true });
    cpSync(depPath, destPath, { recursive: true });
    console.log(`  ✓ Copied ${dep}`);

    // Also check for the dep's own dependencies
    const depPkgPath = join(depPath, "package.json");
    if (existsSync(depPkgPath)) {
      const depPkg = JSON.parse(readFileSync(depPkgPath, "utf-8"));
      const subDeps = {
        ...depPkg.dependencies,
        ...depPkg.peerDependencies,
      };
      for (const subDep of Object.keys(subDeps || {})) {
        if (subDep.startsWith("node:")) continue;
        const subDepPath = join(process.cwd(), "node_modules", subDep);
        const subDestPath = join(FN_DIR, "node_modules", subDep);
        if (existsSync(subDepPath) && !existsSync(subDestPath)) {
          cpSync(subDepPath, subDestPath, { recursive: true });
          console.log(`  ✓ Copied ${subDep} (transitive)`);
        }
      }
    }
  } else {
    console.warn(`  ⚠ ${dep} not found in node_modules`);
  }
}

// Clean backup
if (existsSync(OUTPUT + "_bak")) {
  try { rmSync(OUTPUT + "_bak", { recursive: true, force: true }); } catch {}
}

console.log("✅ Vercel Build Output ready at .vercel/output/");
