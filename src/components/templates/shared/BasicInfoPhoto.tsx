import { getBorderRadiusValue, PhotoConfig } from "@/types/resume";

interface BasicInfoPhotoProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  config?: PhotoConfig;
  /** Keep the photo inside the neighboring personal-info block. */
  fitBlock?: boolean;
}

export function BasicInfoPhoto({
  src,
  alt,
  width,
  height,
  config,
  fitBlock = false,
}: BasicInfoPhotoProps) {
  if (!src || config?.visible === false) return null;

  const radius = getBorderRadiusValue(config);

  if (!fitBlock) {
    return (
      <div className="shrink-0 overflow-hidden" style={{ width, height, borderRadius: radius }}>
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="relative shrink-0 self-stretch" style={{ width }}>
      <div className="absolute inset-0 flex items-start justify-end">
        <div
          className="overflow-hidden"
          style={{
            height: `min(${height}px, 100%)`,
            aspectRatio: `${width} / ${height}`,
            width: "auto",
            maxWidth: "100%",
            borderRadius: radius,
          }}
        >
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
