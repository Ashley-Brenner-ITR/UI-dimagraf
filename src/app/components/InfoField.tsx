import type { ReactNode } from 'react';
import { color as themeColor, shipmentTypography } from './theme';

const SHIPMENT_TYPE = shipmentTypography;

export function InfoField({ label, value, children, color }: { label: string; value?: ReactNode; children?: ReactNode; color?: string }) {
  return (
    <div style={{ minWidth: 0, display: 'grid', gap: 3 }}>
      <div style={{ fontSize: SHIPMENT_TYPE.tableHead, lineHeight: 1.1, fontWeight: 500, color: themeColor.muted }}>{label}</div>
      <div style={{ fontSize: SHIPMENT_TYPE.title, fontWeight: 500, color: color || themeColor.ink, lineHeight: '16px', fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>{value ?? children ?? '—'}</div>
    </div>
  );
}
