import type { ReactNode } from 'react';
import { color } from './theme';

const INK = color.ink;
const MUTED = color.muted;
const CANVAS = color.canvas;

type ToggleOption<T extends string> = {
  value: T;
  label: string;
  icon: ReactNode;
};

type Props<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: ToggleOption<T>[];
  fullWidth?: boolean;
};

export function ViewModeToggle<T extends string>({
  value,
  onValueChange,
  options,
  fullWidth = false,
}: Props<T>) {
  return (
    <div style={{ display: 'flex', background: '#f2f4f7', borderRadius: 8, padding: 3, width: fullWidth ? '100%' : 'auto' }}>
      {options.map(option => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onValueChange(option.value)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: active ? CANVAS : 'transparent',
              color: active ? INK : MUTED,
              boxShadow: active ? '0 1px 3px rgba(16,24,40,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}