
import { DateInput } from "@heroui/date-input";
import { HeroUIProvider } from "@heroui/react";
import { CalendarDate, parseDate } from "@internationalized/date";
import { useState, useEffect } from "react";
import { isPresentToken } from "@/lib/date-range";

interface UnifiedDateInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
}

export function UnifiedDateInput({
  value,
  onChange,
  label,
  isRequired,
  className,
}: UnifiedDateInputProps) {
  const parseValue = (input: string): CalendarDate | null => {
    if (!input) return null;
    try {
      let normalized = input.replace(/[./]/g, "-");
      if (normalized.length === 7) normalized = `${normalized}-01`;
      return parseDate(normalized);
    } catch {
      return null;
    }
  };

  const isPresent = isPresentToken(value);

  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(() =>
    parseValue(value)
  );

  useEffect(() => {
    setSelectedDate(parseValue(value));
  }, [value]);

  const handleDateChange = (date: CalendarDate | null) => {
    setSelectedDate(date);
    if (!date) {
      onChange("");
      return;
    }
    const month = date.month.toString().padStart(2, "0");
    onChange(`${date.year}/${month}`);
  };

  if (isPresent) {
    return (
      <div className={className}>
        <div className="flex h-10 items-center rounded-md bg-background px-3 text-sm text-foreground shadow-sm ring-1 ring-inset ring-input">
          {value.trim()}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <HeroUIProvider locale="ja-JP">
        <DateInput
          value={selectedDate}
          onChange={handleDateChange}
          isRequired={isRequired}
          granularity={"month" as any}
          variant="bordered"
          labelPlacement="outside"
          shouldForceLeadingZeros
          classNames={{
            inputWrapper:
              "shadow-sm hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary bg-background",
          }}
        />
      </HeroUIProvider>
    </div>
  );
}
