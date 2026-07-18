import { useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { color, radius } from './theme';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'danger-soft' | 'success-soft' | 'ghost-light' | 'solid-light';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size; icon?: ReactNode; }

const variants: Record<Variant, CSSProperties> = {
  primary: { background: color.brand, color: '#fff', border: `1px solid ${color.brand}` },
  secondary: { background: color.canvas, color: color.ink, border: `1px solid ${color.controlBorder}` },
  tertiary: { background: 'transparent', color: color.muted, border: 'none' },
  danger: { background: color.danger, color: '#fff', border: '1px solid transparent' },
  'danger-soft': { background: `${color.danger}0d`, color: color.danger, border: `1px solid ${color.danger}22` },
  'success-soft': { background: `${color.success}0d`, color: color.success, border: `1px solid ${color.success}22` },
  'ghost-light': { background: 'rgba(255,255,255,0.25)', color: '#fff', border: '1px solid rgba(255,255,255,0.5)', fontWeight: 600 },
  'solid-light': { background: 'rgba(255,255,255,0.85)', color: '#1a5c38', border: '1px solid rgba(255,255,255,0.6)', fontWeight: 700 },
};

const hoverVariants: Record<Variant, CSSProperties> = {
  primary: { background: '#154a2d', borderColor: '#154a2d' },
  secondary: { background: color.parchment, borderColor: color.controlBorder },
  tertiary: { background: 'rgba(26,92,56,0.06)', color: color.brand },
  danger: { background: '#a80016' },
  'danger-soft': { background: 'rgba(196,0,26,0.10)' },
  'success-soft': { background: 'rgba(23,112,68,0.10)' },
  'ghost-light': { background: 'rgba(255,255,255,0.30)', borderColor: 'rgba(255,255,255,0.5)' },
  'solid-light': { background: '#edf8f1', color: '#154a2d' },
};

const sizes: Record<Size, CSSProperties> = {
  sm: { minHeight: 28, padding: '5px 9px', fontSize: 11 },
  md: { minHeight: 34, padding: '7px 12px', fontSize: 12 },
  lg: { minHeight: 40, padding: '9px 16px', fontSize: 13 },
  xl: { minHeight: 50, padding: '14px 18px', fontSize: 14 },
};

export function AppButton({ variant = 'primary', size = 'lg', icon, children, style, type = 'button', onMouseEnter, onMouseLeave, ...props }: Props) {
  const [hovered, setHovered] = useState(false);
  const iconOnly = Boolean(icon) && !children;
  const iconOnlyStyle: CSSProperties = iconOnly
    ? { width: size === 'sm' ? 28 : size === 'md' ? 34 : size === 'lg' ? 40 : 50, padding: 0 }
    : {};

  return <button
    type={type}
    data-variant={variant}
    data-size={size}
    data-state={props.disabled ? 'disabled' : hovered ? 'hover' : 'default'}
    onMouseEnter={event => {
      if (!props.disabled) setHovered(true);
      onMouseEnter?.(event);
    }}
    onMouseLeave={event => {
      setHovered(false);
      onMouseLeave?.(event);
    }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: radius.pill,
      fontWeight: 600,
      cursor: props.disabled ? 'default' : 'pointer',
      opacity: props.disabled ? 0.5 : 1,
      whiteSpace: 'nowrap',
      transition: 'background-color .18s ease, border-color .18s ease, color .18s ease',
      ...variants[variant],
      ...(!props.disabled && hovered ? hoverVariants[variant] : {}),
      ...sizes[size],
      ...iconOnlyStyle,
      ...style,
    }}
    {...props}
  >{icon}{children}</button>;
}
