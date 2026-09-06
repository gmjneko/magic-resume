import { CSSProperties } from "react";
import { BasicLayout } from "@/types/resume";

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  layout: string;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  spacing: {
    sectionGap: number;
    itemGap: number;
    contentPadding: number;
  };
  basic: {
    layout?: BasicLayout;
  };
  availableSections?: string[];
}

export interface TemplateConfig {
  sectionTitle: {
    className?: string;
    styles: CSSProperties;
  };
}
