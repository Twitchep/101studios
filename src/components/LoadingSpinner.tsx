import LazyImage from "./LazyImage";

export default function LoadingSpinner() {
  return (
    <div className="relative h-24 w-24 rounded-full border-4 border-white/20 border-t-orange-500 animate-spin flex items-center justify-center bg-black/20">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-black/50 via-orange-500/30 to-white/20" />
      <div className="relative z-10 overflow-hidden rounded-full h-14 w-14 flex items-center justify-center bg-white">
        <LazyImage src="/images/logo.png" alt="logo" className="h-10 w-10" />
      </div>
    </div>
  );
}
