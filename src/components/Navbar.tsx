import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Shop", href: "/shop" },
  { label: "Updates", href: "/updates" },
  { label: "Videos", href: "/videos" },
  { label: "Contact", href: "/contact" },
];

const primaryNavLinks = navLinks.filter(({ label }) => ["Home", "About", "Shop", "Contact"].includes(label));
const secondaryNavLinks = navLinks.filter(({ label }) => ["Portfolio", "Updates", "Videos"].includes(label));

export default function Navbar() {
  const { theme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setMoreOpen(false);
    if (href === "/" && location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(href);
  };

  return (
    <nav className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="rounded-full border border-white/15 bg-black/55 dark:bg-black/55 backdrop-blur-xl shadow-[0_20px_50px_rgba(249,115,22,0.12)] px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-[0.72rem] sm:text-xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-primary uppercase font-orbitron">101 STUDIOS</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {primaryNavLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="navbar-button px-3 py-2 text-xs sm:text-sm uppercase tracking-wide font-medium text-white/85 transition-colors duration-200 rounded-lg hover:bg-white/15 hover:text-primary"
              >
                {link.label}
              </button>
            ))}
            <div className="relative">
              <button
                onClick={() => setMoreOpen((open) => !open)}
                className="navbar-button inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm uppercase tracking-wide font-medium text-white/85 transition-colors duration-200 rounded-lg hover:bg-white/15 hover:text-primary"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
              >
                More
                <ChevronDown size={16} className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full mt-2 min-w-40 rounded-2xl border border-white/15 bg-black/75 p-2 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                  {secondaryNavLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link.href)}
                      className="navbar-button block w-full rounded-xl px-3 py-2 text-left text-xs uppercase tracking-wide text-white/90 transition-colors duration-200 hover:bg-white/15 hover:text-primary"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ThemeSwitcher />
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeSwitcher />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="navbar-button p-2 rounded-lg text-white hover:bg-white/15 transition-colors" aria-label="Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl animate-fade-in">
          <div className="px-4 py-3 space-y-1.5">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="navbar-button block w-full text-left px-3 py-2 text-sm uppercase tracking-wide text-white/90 rounded-lg hover:bg-white/15 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
