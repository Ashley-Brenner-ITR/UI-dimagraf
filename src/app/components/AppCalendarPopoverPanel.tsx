import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { color, radius } from './theme';
import { Calendar } from './ui/calendar';
import { AppSelectContent, AppSelectItem, Select, SelectTrigger, SelectValue } from './ui/select';

const { canvas: CANVAS, hairline: HAIRLINE, ink: INK } = color;

const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

type Props = {
  visibleMonth: Date;
  onVisibleMonthChange: (date: Date) => void;
  selectedDate?: Date;
  onSelect: (date: Date | undefined) => void;
  minYear: number;
  maxYear: number;
};

export function AppCalendarPopoverPanel({
  visibleMonth,
  onVisibleMonthChange,
  selectedDate,
  onSelect,
  minYear,
  maxYear,
}: Props) {
  const years = useMemo(() => {
    const items: number[] = [];
    for (let year = minYear; year <= maxYear; year += 1) items.push(year);
    return items;
  }, [maxYear, minYear]);

  return (
    <div style={{ display: 'grid', gap: 0, padding: '10px 10px 8px' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 32, marginBottom: 6 }}>
        <button
          type="button"
          onClick={() => onVisibleMonthChange(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
          style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${HAIRLINE}`, borderRadius: radius.sm, background: CANVAS, color: INK, cursor: 'pointer' }}
        >
          <ChevronLeft size={15} />
        </button>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, minWidth: 0, height: 32, pointerEvents: 'none' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: INK, whiteSpace: 'nowrap', pointerEvents: 'auto' }}>{MONTHS_ES[visibleMonth.getMonth()]}</span>
          <Select value={`${visibleMonth.getFullYear()}`} onValueChange={value => onVisibleMonthChange(new Date(Number(value), visibleMonth.getMonth(), 1))}>
            <SelectTrigger
              className="h-auto min-w-0 rounded-none border-transparent bg-transparent px-0 text-center text-[15px] font-semibold text-[#1d1d1f] shadow-none focus-visible:border-transparent focus-visible:ring-0 data-[state=open]:border-transparent data-[state=open]:ring-0"
              style={{ justifyContent: 'center', gap: 2, pointerEvents: 'auto' }}
              aria-label="Seleccionar año"
            >
              <SelectValue />
            </SelectTrigger>
            <AppSelectContent>
              {years.map(year => (
                <AppSelectItem key={year} value={`${year}`}>{year}</AppSelectItem>
              ))}
            </AppSelectContent>
          </Select>
        </div>
        <button
          type="button"
          onClick={() => onVisibleMonthChange(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
          style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${HAIRLINE}`, borderRadius: radius.sm, background: CANVAS, color: INK, cursor: 'pointer' }}
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <Calendar
        mode="single"
        month={visibleMonth}
        selected={selectedDate}
        onMonthChange={onVisibleMonthChange}
        onSelect={onSelect}
        disableNavigation
        captionLayout="buttons"
        fromYear={minYear}
        toYear={maxYear}
        className="p-0"
        classNames={{ caption: 'hidden', month: 'flex flex-col gap-2' }}
      />
    </div>
  );
}