import { Plane, Ship, Truck } from 'lucide-react';
import { color, radius } from './theme';

interface Props {
  transporte?: string;
  size?: number;
  compact?: boolean;
  minimal?: boolean;
}

export function TransportModeIcon({ transporte, size = 16, compact = false, minimal = false }: Props) {
  const normalized = transporte?.toLocaleLowerCase('es') ?? '';
  const isLand = normalized.includes('terrestre') || normalized.includes('camion') || normalized.includes('camión');
  const isAir = normalized.includes('aéreo') || normalized.includes('aereo') || normalized.includes('air');
  const isSea = normalized.includes('marít') || normalized.includes('marit') || normalized.includes('sea') || normalized.includes('ocean');

  const Icon = isLand ? Truck : isAir ? Plane : Ship;
  const tone = isLand
    ? { icon: '#8a4b12', background: 'rgba(180, 83, 9, 0.06)', border: 'rgba(180, 83, 9, 0.10)' }
    : isAir
      ? { icon: '#5d3b99', background: 'rgba(91, 33, 182, 0.06)', border: 'rgba(91, 33, 182, 0.10)' }
      : isSea
        ? { icon: '#245a96', background: 'rgba(0, 102, 204, 0.06)', border: 'rgba(0, 102, 204, 0.10)' }
        : { icon: '#35624c', background: `${color.brand}08`, border: `${color.brand}14` };

  if (minimal) {
    return (
      <span
        role="img"
        aria-label={`Transporte ${transporte || 'no informado'}`}
        title={transporte || 'Transporte no informado'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: tone.icon,
        }}
      >
        <Icon size={size} aria-hidden="true" />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={`Transporte ${transporte || 'no informado'}`}
      title={transporte || 'Transporte no informado'}
      style={{
        width: compact ? 26 : 36,
        height: compact ? 26 : 36,
        display: 'inline-grid',
        placeItems: 'center',
        flexShrink: 0,
        borderRadius: compact ? radius.sm : radius.md,
        color: tone.icon,
        background: tone.background,
        border: `1px solid ${tone.border}`,
        boxSizing: 'border-box',
      }}
    >
      <Icon size={size} aria-hidden="true" />
    </span>
  );
}
