import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  // Add your social media links here
  const socialLinks = [
    { name: "Instagram", url: "https://instagram.com/yourusername", icon: Instagram },
    { name: "Facebook", url: "https://facebook.com/yourpage", icon: Facebook },
    { name: "Twitter", url: "https://twitter.com/yourusername", icon: Twitter },
    { name: "YouTube", url: "https://youtube.com/yourchannel", icon: Youtube },
  ];

  return (
    <footer className="w-full mt-20 rounded-t-[2.5rem] border-t border-white/10 bg-black/55 backdrop-blur-xl px-6 py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div>
          <h3 className="text-lg font-black text-primary font-orbitron tracking-[0.18em] uppercase">101 Studios</h3>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm font-rajdhani">
            Premium portfolio and commerce experiences crafted with editorial visuals and high-performance frontend systems.
          </p>
          <div className="flex gap-4 mt-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                aria-label={social.name}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-orbitron">Build with us</p>
          <p className="mt-3 text-sm text-foreground font-rajdhani">Contact for design, branding, web, and storefront collaborations.</p>
          <div className="mt-5 flex md:justify-end gap-3">
            <a href="/portfolio" className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-xs uppercase tracking-[0.14em] hover:border-primary/40 hover:text-primary transition">Portfolio</a>
            <a href="/shop" className="px-4 py-2 rounded-xl border border-primary/35 bg-primary/10 text-xs uppercase tracking-[0.14em] text-primary hover:bg-primary/20 transition">Shop</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 items-center">
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-space-mono">
          © {new Date().getFullYear()} 101 STUDIOS. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-space-mono">
          <span>Terms</span>
          <span>Privacy</span>
        </div>
      </div>
    </footer>
  );
}
