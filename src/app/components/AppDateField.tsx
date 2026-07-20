import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { color, radius } from './theme';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { AppCalendarPopoverPanel } from './AppCalendarPopoverPanel';

const { brand: GREEN, controlBorder: CONTROL_BORDER, ink: INK, muted: MUTED, surface: SURFACE } = color;

function parseStoredDate(value: string) {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function formatStoredDate(value: string) {
  const parsed = parseStoredDate(value);
  if (!parsed) return '';
  const day = `${parsed.getDate()}`.padStart(2, '0');
  const month = `${parsed.getMonth() + 1}`.padStart(2, '0');
  const year = parsed.getFullYear();
  return `${day}/${month}/${year}`;
}

function toStoredDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseManualDate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const parsed = new Date(`${trimmed}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : trimmed;
  }

  const localMatch = trimmed.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/);
  if (!localMatch) return null;

  const [, dayText, monthText, yearText] = localMatch;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const parsed = new Date(year, month - 1, day);

  if (
    Number.isNaN(parsed.getTime())
    || parsed.getFullYear() !== year
    || parsed.getMonth() !== month - 1
    || parsed.getDate() !== day
  ) {
    return null;
  }

  return toStoredDate(parsed);
}

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  minYear?: number;
  maxYear?: number;
};

export function AppDateField({
  value,
  onValueChange,
  ariaLabel,
  placeholder = 'DD/MM/AAAA',
  minYear,
  maxYear,
}: Props) {
  const selectedDate = useMemo(() => parseStoredDate(value), [value]);
  const today = useMemo(() => new Date(), []);
  const resolvedMinYear = minYear ?? today.getFullYear() - 10;
  const resolvedMaxYear = maxYear ?? today.getFullYear() + 10;

  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [draftValue, setDraftValue] = useState(formatStoredDate(value));
  const [visibleMonth, setVisibleMonth] = useState<Date>(selectedDate ?? today);

  useEffect(() => {
    setDraftValue(formatStoredDate(value));
  }, [value]);

  useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(selectedDate);
    }
  }, [selectedDate]);

  const commitDraftValue = () => {
    const parsed = parseManualDate(draftValue);
    if (parsed === null) {
      setDraftValue(formatStoredDate(value));
      return;
    }
    onValueChange(parsed);
    if (parsed) {
      const nextDate = parseStoredDate(parsed);
      if (nextDate) setVisibleMonth(nextDate);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          height: 42,
          padding: '0 12px',
          borderRadius: radius.md,
          border: '1px solid transparent',
          background: SURFACE,
          overflow: 'hidden',
          boxShadow: `inset 0 0 0 1px ${isFocused || open ? GREEN : CONTROL_BORDER}`,
          transition: 'box-shadow .18s ease, background-color .18s ease',
        }}
      >
        <CalendarDays size={15} color={isFocused || open ? GREEN : MUTED} />
        <input
          className="app-date-field__input"
          aria-label={ariaLabel}
          value={draftValue}
          placeholder={placeholder}
          onChange={event => setDraftValue(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            commitDraftValue();
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commitDraftValue();
            }
          }}
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            padding: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '20px',
            letterSpacing: 'normal',
            color: INK,
            boxShadow: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
          }}
        />
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`Abrir calendario de ${ariaLabel}`}
            style={{
              width: 26,
              height: 26,
              border: 'none',
              background: 'transparent',
              color: isFocused || open ? GREEN : MUTED,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ChevronDown size={14} />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent align="end" sideOffset={8} className="w-auto rounded-2xl border-[#eaecf0] bg-white p-0 shadow-xl" style={{ minWidth: 300 }}>
        <AppCalendarPopoverPanel
          visibleMonth={visibleMonth}
          onVisibleMonthChange={setVisibleMonth}
          selectedDate={selectedDate}
          onSelect={date => {
            onValueChange(date ? toStoredDate(date) : '');
            setOpen(false);
          }}
          minYear={resolvedMinYear}
          maxYear={resolvedMaxYear}
        />
      </PopoverContent>
    </Popover>
  );
}