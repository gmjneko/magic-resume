const PRESENT_TOKENS = ["至今", "present", "now", "to present"];

const DATE_LIKE_PATTERN =
  /^(\d{4})(?:[./-]\d{1,2})?(?:[./-]\d{1,2})?$/;

export interface DateRangeParts {
  start: string;
  end: string;
}

export function isPresentToken(value?: string | null): boolean {
  if (!value) return false;
  return PRESENT_TOKENS.includes(value.trim().toLowerCase());
}

function isDateLike(value: string): boolean {
  return DATE_LIKE_PATTERN.test(value.trim());
}

/**
 * Split a date range, including open-ended forms such as "2020-至今",
 * "2024/09-至今" and "2020 - Present". A single date like "2024-09" stays intact.
 */
export function splitDateRange(value?: string | null): DateRangeParts | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;

  const presentMatch = trimmed.match(
    /^(.+?)\s*[-–—]\s*(至今|to present|present|now)$/i
  );
  if (presentMatch) {
    const start = presentMatch[1].trim();
    if (start && isDateLike(start)) {
      return { start, end: presentMatch[2].trim() };
    }
  }

  const spaced = trimmed.match(/^(.+?)\s+[-–—]\s+(.+)$/);
  if (spaced) {
    const start = spaced[1].trim();
    const end = spaced[2].trim();
    if (isDateLike(start) && (isDateLike(end) || isPresentToken(end))) {
      return { start, end };
    }
  }

  const compact = trimmed.match(
    /^(\d{4}(?:[./]\d{1,2})?)\s*[-–—]\s*(\d{4}(?:[./]\d{1,2})?)$/
  );
  if (compact) {
    return { start: compact[1], end: compact[2] };
  }

  const monthDash = trimmed.match(
    /^(\d{4}-\d{1,2})\s*[-–—]\s*(\d{4}-\d{1,2})$/
  );
  if (monthDash) {
    return { start: monthDash[1], end: monthDash[2] };
  }

  return null;
}

export function formatPresentLabel(locale: string = "zh"): string {
  return locale.toLowerCase().startsWith("zh") ? "至今" : "Present";
}
