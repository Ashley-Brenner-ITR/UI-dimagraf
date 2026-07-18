import { useState } from 'react';
import { Search } from 'lucide-react';
import { color, radius } from './theme';
export const normalizeSearchTerm = (value: unknown) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleLowerCase('es');
export function SearchField({ value, onChange, placeholder = 'Buscar…', ariaLabel = 'Buscar', size = 'default' }: { value: string; onChange: (value: string) => void; placeholder?: string; ariaLabel?: string; size?: 'default' | 'compact' }) {
  const [focused, setFocused] = useState(false);
  const isCompact = size === 'compact';

  return <label style={{ position: 'relative', display: 'block', flex: 1, minWidth: 0, width: '100%', background: color.canvas, border: 'none', borderRadius: radius.pill, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${focused ? color.brand : color.controlBorder}`, transition: 'box-shadow .18s ease' }}><Search aria-hidden="true" size={isCompact ? 13 : 15} style={{ position: 'absolute', left: isCompact ? 12 : 15, top: '50%', transform: 'translateY(-50%)', color: focused ? color.brand : color.muted, transition: 'color .18s ease' }} /><span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{ariaLabel}</span><input aria-label={ariaLabel} value={value} onChange={event => onChange(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} style={{ width: '100%', minHeight: isCompact ? 38 : 44, padding: isCompact ? '9px 14px 9px 35px' : '13px 15px 13px 42px', fontSize: isCompact ? 12.5 : 14, color: color.ink, background: 'transparent', border: 'none', borderRadius: radius.pill, outline: 'none', boxShadow: 'none', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }} /></label>;
}
