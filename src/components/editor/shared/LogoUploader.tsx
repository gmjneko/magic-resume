import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "@/i18n/compat/client";
import { compressImage, estimateBase64Size } from "@/utils/imageUtils";
import { cn } from "@/lib/utils";

interface LogoUploaderProps {
  value?: string;
  onChange: (value: string) => void;
}

const LogoUploader = ({ value, onChange }: LogoUploaderProps) => {
  const t = useTranslations("workbench.logo");
  const uploadT = useTranslations("photoConfig.upload");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(uploadT("typeLimit"));
      return;
    }

    try {
      let imageData = await compressImage(file, 256, 256, 0.85);
      if (estimateBase64Size(imageData) > 512 * 1024) {
        imageData = await compressImage(file, 192, 192, 0.7);
      }
      onChange(imageData);
    } catch {
      toast.error(uploadT("loadError"));
    }
  };

  return (
    <div className="relative h-10 w-10 shrink-0">
      <div
        className={cn(
          "flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-md",
          "bg-background shadow-sm ring-1 ring-inset ring-input",
          "hover:bg-muted/50",
          isDragging && "ring-2 ring-inset ring-primary"
        )}
        title={value ? t("change") : t("hint")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) {
            void handleFile(file);
          }
        }}
      >
        {value ? (
          <img
            src={value}
            alt=""
            className="h-full w-full object-contain p-0.5"
          />
        ) : (
          <ImagePlus className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      {value ? (
        <button
          type="button"
          className="absolute -right-1.5 -top-1.5 z-10 rounded-full bg-background p-0.5 text-muted-foreground shadow-sm ring-1 ring-inset ring-input hover:bg-destructive hover:text-destructive-foreground hover:ring-destructive"
          title={t("remove")}
          onClick={(event) => {
            event.stopPropagation();
            onChange("");
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleFile(file);
          }
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        }}
      />
    </div>
  );
};

export default LogoUploader;
