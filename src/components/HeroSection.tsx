import { ArrowDown, ShoppingBag } from "lucide-react";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden section-padding pt-24"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p
          className="text-sm font-medium tracking-widest uppercase text-primary mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          Graphic Designer · Tech Enthusiast
        </p>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-balance mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          Crafting Visual
          <br />
          <span className="gradient-text">Experiences</span>
        </h1>
        <p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty opacity-0 animate-fade-up"
          style={{ animationDelay: "350ms" }}
        >
          Blending creative design with cutting-edge technology to build
          stunning visuals and curate the best tech gadgets.
        </p>
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
          style={{ animationDelay: "500ms" }}
        >
          <button
            onClick={() => scrollTo("portfolio")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <ArrowDown size={16} />
            View My Work
          </button>
          <button
            onClick={() => scrollTo("shop")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <ShoppingBag size={16} />
            Shop Tech Gadgets
          </button>
        </div>
      </div>
    </section>
  );
}
