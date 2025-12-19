import { useEffect } from "react";

interface CaptureEyeProps {
  nid: string;
  src: string;
  width?: string;
  className?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "capture-eye": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { nid: string },
        HTMLElement
      >;
      "media-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { src: string; width?: string },
        HTMLElement
      >;
    }
  }
}

export const CaptureEye = ({ nid, src, width = "100%", className }: CaptureEyeProps) => {
  useEffect(() => {
    // Load Capture Eye script if not already loaded
    const scriptId = "capture-eye-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "module";
      script.src = "https://cdn.jsdelivr.net/npm/@numbersprotocol/capture-eye@latest/dist/capture-eye.bundled.js";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className={className}>
      <capture-eye nid={nid}>
        <media-viewer width={width} src={src} />
      </capture-eye>
    </div>
  );
};
