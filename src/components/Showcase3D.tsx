import { Crown, Medal, Sparkles, Trophy } from "lucide-react";
import { SectionHeader } from "./Dashboard";
import { Tilt3D } from "./Tilt3D";

const orbs = [
  {
    image: "/awards/overall_winner.png",
    label: "Overall Winner",
    glow: "#ffd700", // Golden glow
  },
  {
    image: "/awards/overall_runner.png",
    label: "Overall Runner",
    glow: "#e0e0e0", // Silver/White glow
  },
  {
    image: "/awards/best_tech.png",
    label: "Best Tech Team",
    glow: "#00e5ff", // Blue/Cyan glow
  },
  {
    image: "/awards/best_nontech.png",
    label: "Best Non-Tech Team",
    glow: "#ff9100", // Orange glow
  },
  {
    image: "/awards/cultural.png",
    label: "Best Cultural Team",
    glow: "#b300ff", // Purple/Violet glow
  },
  {
    image: "/awards/enthusiastic_team.png",
    label: "Best Enthusiastic Team",
    glow: "#ff1744", // Red glow
  },
  {
    image: "/awards/best_sports.png",
    label: "Best Sports Team",
    glow: "#00e676", // Green glow
  },
  {
    image: "/awards/best_student.jpeg",
    label: "Best Student Activity Team",
    glow: "#d500f9", // Magenta/Purple glow
  },
  {
    image: "/awards/max_participation.jpeg",
    label: "Maximum Participation Team",
    glow: "#ffea00", // Yellow glow
  },
  {
    image: "/awards/active_dept.jpeg",
    label: "Most Active Department Team",
    glow: "#1de9b6", // Teal glow
  },
];

export function Showcase3D() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Layered depth backdrops */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[80vh] rounded-full opacity-40"
          style={{
            background:
              "conic-gradient(from 0deg, oklch(0.55 0.22 27 / 0.3), oklch(0.78 0.16 80 / 0.3), oklch(0.55 0.22 27 / 0.3))",
            filter: "blur(120px)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader
          eyebrow="The Trophies"
          title="Forged in Gold. Earned on Stage."
          subtitle="Hover to feel the weight. Each award represents a season of brilliance."
        />

        {/* Grid wrapper for perfect alignment */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 items-stretch auto-rows-fr">
          {orbs.map((o, i) => (
            <Tilt3D key={o.label} max={15} className="h-full">
              {/* Award Card Container */}
              <div 
                className="group relative glass-strong rounded-3xl p-6 flex flex-col justify-between items-center text-center overflow-hidden h-full transition-all duration-500 hover:scale-[1.02]"
                style={{
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 10px 30px -10px ${o.glow}30`,
                }}
              >
                {/* Glowing portal border (intensifies/pulsates on hover) */}
                <div 
                  className="absolute inset-0 rounded-3xl border-2 opacity-30 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500 pointer-events-none"
                  style={{
                    borderColor: o.glow,
                    boxShadow: `inset 0 0 20px ${o.glow}40, 0 0 20px ${o.glow}40`,
                  }}
                />

                {/* Corner Sparkle Glow */}
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
                  style={{ background: o.glow }}
                />
                
                {/* Image Container with 250px explicit height and object-fit contain */}
                <div
                  className="relative mx-auto mb-6 w-full flex items-center justify-center pointer-events-none"
                  style={{
                    transform: "translateZ(60px)",
                    animationDelay: `${i * 0.2}s`,
                    height: "250px"
                  }}
                >
                  <img 
                    src={o.image} 
                    alt={o.label} 
                    className="w-full h-full object-contain mix-blend-screen opacity-90 transition-transform duration-500 group-hover:scale-110" 
                    style={{ filter: `drop-shadow(0 0 15px ${o.glow}60)` }}
                  />
                </div>

                {/* Label */}
                <div
                  className="font-display text-lg font-bold mt-auto leading-tight transition-colors duration-300 w-full"
                  style={{ 
                    transform: "translateZ(30px)",
                    color: "white",
                    textShadow: `0 0 20px ${o.glow}80`
                  }}
                >
                  {o.label}
                </div>
              </div>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  );
}
