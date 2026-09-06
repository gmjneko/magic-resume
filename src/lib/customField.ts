import { CustomFieldType } from "@/types/resume";
import { getProjectLinkHref } from "@/lib/projectLink";
import { shouldShowFieldLabel } from "@/lib/fieldDisplay";

const trim = (value?: string) => value?.trim() || "";

const LOOKS_LIKE_URL = /^(https?:\/\/|www\.)/i;
const LOOKS_LIKE_DOMAIN = /^[\w-]+(\.[\w-]+)+([\/?#].*)?$/i;

export const getCustomFieldDisplayText = (
  field: Pick<CustomFieldType, "label" | "value" | "displayLabel">
) => trim(field.value);

export const shouldShowCustomFieldLabelPrefix = (
  field: Pick<CustomFieldType, "label" | "displayLabel">,
  useIconMode = false
) => Boolean(trim(field.label)) && shouldShowFieldLabel(field.displayLabel, useIconMode);

export const getCustomFieldHref = (
  field: Pick<CustomFieldType, "value" | "displayLabel">
) => {
  const value = trim(field.value);
  if (!value || value.includes("@") || /\s/.test(value)) return null;
  if (LOOKS_LIKE_URL.test(value) || LOOKS_LIKE_DOMAIN.test(value)) {
    return getProjectLinkHref(value);
  }
  return null;
};
