import React from "react";
import { cn } from "@/lib/utils";
import { BasicLayout } from "@/types/resume";
import { useTranslations } from "@/i18n/compat/client";

interface AlignSelectorProps {
  value: BasicLayout;
  onChange: (value: BasicLayout) => void;
}

const AlignSelector: React.FC<AlignSelectorProps> = ({ value, onChange }) => {
  const t = useTranslations("workbench.basicPanel");

  const layouts: { value: BasicLayout; icon: React.ReactElement; tooltip: string }[] = [
    {
      value: "left",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="15" cy="24" r="6" className="fill-current" />
          <rect x="27" y="21" width="15" height="2" className="fill-current" />
          <rect x="27" y="25" width="12" height="2" className="fill-current" />
          <rect x="27" y="29" width="13" height="2" className="fill-current" />
        </svg>
      ),
      tooltip: t("layoutLeft"),
    },
    {
      value: "center",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="24" cy="15" r="6" className="fill-current" />
          <rect
            x="16.5"
            y="27"
            width="15"
            height="2"
            className="fill-current"
          />
          <rect x="18" y="31" width="12" height="2" className="fill-current" />
          <rect x="17" y="35" width="14" height="2" className="fill-current" />
        </svg>
      ),
      tooltip: t("layoutCenter"),
    },
    {
      value: "right",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="33" cy="24" r="6" className="fill-current" />
          <rect x="6" y="21" width="15" height="2" className="fill-current" />
          <rect x="9" y="25" width="12" height="2" className="fill-current" />
          <rect x="8" y="29" width="13" height="2" className="fill-current" />
        </svg>
      ),
      tooltip: t("layoutRight"),
    },
    {
      value: "nameTop",
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="6" y="12" width="16" height="3" className="fill-current" />
          <rect x="6" y="19" width="20" height="2" className="fill-current" />
          <rect x="6" y="24" width="17" height="2" className="fill-current" />
          <rect x="6" y="29" width="19" height="2" className="fill-current" />
          <circle cx="38" cy="22" r="6" className="fill-current" />
        </svg>
      ),
      tooltip: t("layoutNameTop"),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {layouts.map((layout) => (
        <button
          key={layout.value}
          onClick={() => onChange(layout.value)}
          title={layout.tooltip}
          className={cn(
            "group relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200",
            "hover:scale-[1.02] active:scale-[0.98]",
            value === layout.value
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-transparent bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <div className="w-9 h-9 flex items-center justify-center">
            {React.cloneElement(layout.icon, {
              width: "100%",
              height: "100%",
              className: "fill-current"
            })}
          </div>

          {value === layout.value && (
            <div className="absolute inset-0 rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-background opacity-0 animate-in fade-in zoom-in-95 duration-200 fill-mode-forwards" />
          )}
        </button>
      ))}
    </div>
  );
};

export default AlignSelector;
