interface StitchPageProps {
  src?: string;
}

import StitchHtmlRenderer from "@/components/StitchHtmlRenderer";

export default function StitchPage({ src = "/stitch/artifact.html" }: StitchPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <StitchHtmlRenderer src={src} className="min-h-screen" />
    </div>
  );
}
