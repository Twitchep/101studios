import { Mail, MessageCircle, Send } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState } from "react";

const WHATSAPP_NUMBER = "+233548656980";
const EMAIL = "josephsakyi247@gmail.com";

export default function ContactSection() {
  const { ref, isVisible } = useScrollReveal();
  const [complaint, setComplaint] = useState("");

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaint.trim()) {
      const subject = encodeURIComponent("Customer Complaint");
      const body = encodeURIComponent(`Complaint:\n\n${complaint}`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      setComplaint("");
    }
  };

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="max-w-2xl mx-auto text-center">
        <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">Let's Work Together</h2>
          <p className="text-muted-foreground mb-10 text-pretty">
            Have a project in mind, want to grab a gadget, or have a complaint? Reach out anytime.
          </p>
        </div>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
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

        <div
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.18)] p-6 sm:p-8 text-left">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <h3 className="text-xl font-semibold mb-2 text-center">Submit a Complaint</h3>
            <p className="text-sm text-muted-foreground mb-5 text-center">
              Tell us what went wrong and your mail app will open with the message ready to send.
            </p>
            <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Describe your complaint here..."
              className="min-h-[170px] w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-4 text-foreground placeholder:text-muted-foreground/80 shadow-inner shadow-black/10 outline-none transition-all duration-300 focus:border-primary/60 focus:bg-black/30 focus:ring-4 focus:ring-primary/15 resize-y"
              rows={6}
              required
            />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-orange-400 px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/40 active:scale-[0.97]"
                >
                  <Send size={18} />
                  Send Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
