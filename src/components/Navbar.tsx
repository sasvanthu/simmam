import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import simats from "@/assets/simats-logo.png";
import { LionEmblem } from "./LionEmblem";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#dashboard", label: "Dashboard" },
  { href: "/#teams", label: "Houses" },
  { href: "/#leaderboard", label: "2025 Results" },
  { href: "/#archive", label: "Archive" },
  { href: "/#events", label: "Events" },
  { href: "/captains", label: "Captains" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#live", label: "Live Scores" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div
        className={`mx-auto max-w-[1400px] px-4 md:px-8 transition-all duration-500 ${
          scrolled
            ? "glass-strong rounded-2xl mx-3 md:mx-6 border border-[var(--glass-border)]"
            : ""
        }`}
      >
        <div className="flex items-center justify-between gap-4 h-16 md:h-20">
          {/* Left - SIMATS */}
          <a href="#home" className="flex items-center group shrink-0">
            <img
              src={simats}
              alt="SIMATS Engineering"
              className="relative h-12 md:h-16 w-auto object-contain transition group-hover:scale-105"
            />
          </a>

          {/* Center - SIMMAM */}
          <a
            href="#home"
            className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center group"
          >
            <LionEmblem size={scrolled ? 64 : 84} />
            <span className="font-display text-[10px] tracking-[0.4em] text-gradient-gold mt-1">
              SIMMAM • 2026
            </span>
          </a>

          {/* Right nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative px-3 py-2 text-foreground/80 hover:text-gold transition group"
              >
                <span>{l.label}</span>
                <span className="absolute left-3 right-3 bottom-1 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform" />
              </a>
            ))}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-md glass"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden glass-strong rounded-2xl mt-2 p-3 grid grid-cols-2 gap-1 animate-rise-in">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm text-foreground/85 hover:text-gold rounded-lg hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
