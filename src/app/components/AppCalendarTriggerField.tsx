import { CalendarDays, ChevronDown } from 'lucide-react';
import { color, radius } from './theme';

const { brand: GREEN, controlBorder: CONTROL_BORDER, ink: INK, muted: MUTED, surface: SURFACE } = color;

type Props = {
  value: string;
  open?: boolean;
  ariaLabel: string;
};

export function AppCalendarTriggerField({ value, open = false, ariaLabel }: Props) {
  return (
    <div
      aria-label={ariaLabel}
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
        boxShadow: `inset 0 0 0 1px ${open ? GREEN : CONTROL_BORDER}`,
        transition: 'box-shadow .18s ease, background-color .18s ease',
      }}
    >
      <CalendarDays size={15} color={open ? GREEN : MUTED} />
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '20px',
          letterSpacing: 'normal',
          color: INK,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </span>
      <span
        aria-hidden="true"
        style={{
          width: 26,
          height: 26,
          color: open ? GREEN : MUTED,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <ChevronDown size={14} />
      </span>
    </div>
  );
}