import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useCart } from "@/contexts/CartContext";
import { Link, useLocation } from "react-router-dom";
import { ThemeSwitcher } from "./ThemeSwitcher";
import LazyImage from "./LazyImage";

const navLinks = [
  { label: "Home", href: "/#hero" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Shop", href: "/#shop" },
  { label: "Updates", href: "/#updates" },
  { label: "Videos", href: "/#videos" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const { theme } = useTheme();
  const { cart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-[0.22em] text-orange-500 uppercase font-orbitron">101 STUDIOS</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-lg hover:bg-white/20"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick("/#shop")}
              className="relative p-2 text-white transition-colors duration-200 rounded-lg hover:bg-white/20"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cart.length}
                </span>
              )}
            </button>
            <ThemeSwitcher />
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick("/#shop")}
              className="relative p-2 text-white transition-colors duration-200 rounded-lg hover:bg-white/20"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cart.length}
                </span>
              )}
            </button>
            <ThemeSwitcher />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors" aria-label="Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-nav border-t border-glass-border animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-3 py-2 text-sm text-white rounded-lg hover:bg-white/20 transition-colors"
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
