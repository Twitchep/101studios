import { useTheme } from "@/hooks/useTheme";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className="navbar-button group relative text-[0.78rem] sm:text-base h-[3em] w-[6em] rounded-full bg-[hsl(0,0%,7%)] shadow-[0px_2px_4px_0px_rgb(18,18,18,0.25),0px_4px_8px_0px_rgb(18,18,18,0.35)]"
    >
      <span className="absolute inset-[0.1em] rounded-full border-[1px] border-[hsl(0,0%,25%)]" />

      <div className="absolute left-[0.5em] top-1/2 flex h-[2em] w-[2em] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[inset_0px_2px_2px_0px_hsl(0,0%,85%)]">
        <div className="h-[1.5em] w-[1.5em] rounded-full bg-[hsl(0,0%,7%)] shadow-[0px_2px_2px_0px_hsl(0,0%,85%)]" />
      </div>

      <div className="absolute right-[0.5em] top-1/2 flex h-[2em] -translate-y-1/2 items-center justify-center text-[0.9em] text-[hsl(0,0%,72%)]">
        {isDark ? "🌙" : "☀️"}
      </div>

      <span className={`absolute left-[0.25em] top-1/2 flex h-[2.5em] w-[2.5em] -translate-y-1/2 items-center justify-center rounded-full bg-[rgb(26,26,26)] shadow-[inset_4px_4px_4px_0px_rgba(64,64,64,0.25),inset_-4px_-4px_4px_0px_rgba(16,16,16,0.5)] duration-300 ${isDark ? "left-[calc(100%-2.75em)]" : "left-[0.25em]"}`}>
        <span className="relative h-full w-full rounded-full">
          <span className="absolute inset-[0.1em] rounded-full border-[1px] border-[hsl(0,0%,50%)]" />
        </span>
      </span>
    </button>
  );
}