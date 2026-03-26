import { useEffect, useState } from "react";

interface StitchHtmlRendererProps {
  src: string;
  className?: string;
}

const STITCH_HEAD_ATTR = "data-stitch-head";

export default function StitchHtmlRenderer({ src, className }: StitchHtmlRendererProps) {
  const [bodyHtml, setBodyHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    const removeManagedHeadNodes = () => {
      document.head.querySelectorAll(`[${STITCH_HEAD_ATTR}]`).forEach((node) => node.remove());
    };

    const loadHtml = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to load Stitch page: ${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        if (isCancelled) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        removeManagedHeadNodes();

        Array.from(doc.head.children).forEach((child) => {
          const tag = child.tagName.toLowerCase();
          if (tag !== "script" && tag !== "style" && tag !== "link") {
            return;
          }

          if (tag === "link") {
            const rel = child.getAttribute("rel");
            const href = child.getAttribute("href");
            if (rel !== "stylesheet" || !href) {
              return;
            }

            const link = document.createElement("link");
            link.rel = rel;
            link.href = href;
            link.setAttribute(STITCH_HEAD_ATTR, "true");
            document.head.appendChild(link);
            return;
          }

          if (tag === "style") {
            const style = document.createElement("style");
            style.textContent = child.textContent || "";
            style.setAttribute(STITCH_HEAD_ATTR, "true");
            document.head.appendChild(style);
            return;
          }

          const script = document.createElement("script");
          const source = child.getAttribute("src");
          if (source) {
            script.src = source;
          }
          script.textContent = child.textContent || "";
          script.setAttribute(STITCH_HEAD_ATTR, "true");
          document.head.appendChild(script);
        });

        document.title = doc.title || "Stitch Page";
        setBodyHtml(doc.body.innerHTML);
      } catch (loadError) {
        if (!isCancelled) {
          const message = loadError instanceof Error ? loadError.message : "Unknown error loading Stitch page";
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadHtml();

    return () => {
      isCancelled = true;
      controller.abort();
      removeManagedHeadNodes();
    };
  }, [src]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Stitch page...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
