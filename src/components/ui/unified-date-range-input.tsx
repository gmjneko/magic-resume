import { DateInput } from "@heroui/date-input";
import { HeroUIProvider } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { useEffect, useState } from "react";
import { isPresentToken, splitDateRange } from "@/lib/date-range";
import { cn } from "@/lib/utils";

interface UnifiedDateRangeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const SEPARATOR = " - ";

const parsePart = (part: string): CalendarDate | null => {
  if (!part) return null;
  const cleanPart = part.trim();
  if (isPresentToken(cleanPart)) return null;

  try {
    let isoStr = cleanPart.replace(/[./]/g, "-");
    if (isoStr.length === 7) isoStr += "-01";
    if (isoStr.length === 4) isoStr += "-01-01";
    return parseDate(isoStr);
  } catch {
    return null;
  }
};

const parseRange = (rangeValue: string) => {
  if (!rangeValue) return { start: null, end: null };

  const parts = splitDateRange(rangeValue);
  if (!parts) {
    return { start: parsePart(rangeValue), end: null };
  }

  return {
    start: parsePart(parts.start),
    end: isPresentToken(parts.end) ? null : parsePart(parts.end),
  };
};

const sameDate = (left: CalendarDate | null, right: CalendarDate | null) => {
  if (left === right) return true;
  if (!left || !right) return false;
  return left.year === right.year && left.month === right.month && left.day === right.day;
};

const presentLabelFrom = (rangeValue: string) => {
  const parts = splitDateRange(rangeValue);
  if (parts && isPresentToken(parts.end)) return parts.end.trim();
  if (isPresentToken(rangeValue)) return rangeValue.trim();
  return "至今";
};

export function UnifiedDateRangeInput({
  value,
  onChange,
  className,
}: UnifiedDateRangeInputProps) {
  const [range, setRange] = useState<{ start: CalendarDate | null; end: CalendarDate | null }>(
    () => parseRange(value)
  );

  useEffect(() => {
    const next = parseRange(value);
    setRange((prev) =>
      sameDate(prev.start, next.start) && sameDate(prev.end, next.end) ? prev : next
    );
  }, [value]);

  const isPresent = isPresentToken(splitDateRange(value)?.end) || isPresentToken(value);
  const presentLabel = presentLabelFrom(value);

  const updateValue = (
    newStart: CalendarDate | null,
    newEnd: CalendarDate | null
  ) => {
    const format = (d: CalendarDate) =>
      `${d.year}/${d.month.toString().padStart(2, "0")}`;

    const startStr = newStart ? format(newStart) : "";
    const endStr = isPresent ? presentLabel : (newEnd ? format(newEnd) : "");

    if (!startStr && !endStr) {
      onChange("");
      return;
    }

    if (startStr && !endStr) {
      onChange(startStr);
      return;
    }

    onChange(`${startStr}${SEPARATOR}${endStr}`);
  };

  const handleStartChange = (newStart: CalendarDate | null) => {
    setRange((prev) => {
      const next = { start: newStart, end: prev.end };
      updateValue(next.start, next.end);
      return next;
    });
  };

  const handleEndChange = (newEnd: CalendarDate | null) => {
    setRange((prev) => {
      const next = { start: prev.start, end: newEnd };
      updateValue(next.start, next.end);
      return next;
    });
  };

  return (
    <div className={cn("w-full", className)}>
      <HeroUIProvider locale="ja-JP">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <DateInput
              value={range.start}
              onChange={handleStartChange}
              variant="bordered"
              granularity={"month" as any}
              shouldForceLeadingZeros
              aria-label="Start Date"
              classNames={{
                inputWrapper:
                  "bg-background hover:bg-muted/20 h-9 min-h-0 py-0 px-3 shadow-sm ring-1 ring-inset ring-input border-0",
                innerWrapper: "pb-0",
              }}
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="flex-1 relative">
            {isPresent ? (
              <div
                aria-label="End Date"
                className="flex h-9 items-center rounded-md bg-background px-3 text-sm text-foreground shadow-sm ring-1 ring-inset ring-input"
              >
                {presentLabel}
              </div>
            ) : (
              <DateInput
                value={range.end}
                onChange={handleEndChange}
                variant="bordered"
                granularity={"month" as any}
                shouldForceLeadingZeros
                aria-label="End Date"
                classNames={{
                  inputWrapper:
                    "bg-background hover:bg-muted/20 h-9 min-h-0 py-0 px-3 shadow-sm ring-1 ring-inset ring-input border-0",
                  innerWrapper: "pb-0",
                }}
              />
            )}
          </div>
        </div>
      </HeroUIProvider>
    </div>
  );
}
