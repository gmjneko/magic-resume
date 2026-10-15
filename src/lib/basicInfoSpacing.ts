export const DEFAULT_BASIC_INFO_LINE_HEIGHT = 1.5;

export function getBasicInfoSpacing(lineHeight?: number) {
  if (lineHeight == null || Number.isNaN(lineHeight)) return null;

  const normalized = Math.min(2, Math.max(1, lineHeight));
  return {
    lineHeight: normalized,
    rowGap: Math.max(0, Math.round((normalized - 1) * 16)),
  };
}

function getBasicInfoPhotoScale(lineHeight?: number) {
  if (lineHeight == null || Number.isNaN(lineHeight)) return 1;
  const normalized = Math.min(2, Math.max(1, lineHeight));
  return normalized / DEFAULT_BASIC_INFO_LINE_HEIGHT;
}

export function getBasicInfoPhotoSize(
  size: number | undefined,
  fallback: number,
  lineHeight?: number
) {
  return Math.max(1, Math.round((size || fallback) * getBasicInfoPhotoScale(lineHeight)));
}
