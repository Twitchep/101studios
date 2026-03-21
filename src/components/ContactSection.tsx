import { Mail, MessageCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const WHATSAPP_NUMBER = "+233548656980";
const EMAIL = "josephsakyi247@gmail.com";

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="max-w-2xl mx-auto text-center">
        <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">Let's Work Together</h2>
          <p className="text-muted-foreground mb-10 text-pretty">
            Have a project in mind or want to grab a gadget? Reach out anytime.
          </p>
        </div>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "200ms" }}
        >
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <Mail size={18} />
            Send an Email
          </a>
        </div>
      </div>
    </section>
  );
}
