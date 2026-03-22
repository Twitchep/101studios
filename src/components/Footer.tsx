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
    <footer className="border-t border-border py-8 px-4 text-center">
      <div className="flex justify-center gap-4 mb-4">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={social.name}
          >
            <social.icon size={20} />
          </a>
        ))}
      </div>
      <p className="text-sm text-muted-foreground uppercase tracking-[0.16em] font-orbitron">
        © {new Date().getFullYear()} 101 STUDIOS. Built with passion.
      </p>
    </footer>
  );
}
