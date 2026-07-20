import type { ReactNode } from 'react';
import { useIsMobile } from './ui/use-mobile';

const MUTED = '#667085';
const CANVAS = '#ffffff';

export interface MetricCardItem {
  label: string;
  value: ReactNode;
  color: string;
  icon: ReactNode;
}

interface MetricCardGridProps {
  items: MetricCardItem[];
  marginBottom?: number;
  minCardWidth?: number;
  compact?: boolean;
  hideIcons?: boolean;
}

export function MetricCardGrid({ items, marginBottom = 28, minCardWidth = 190, compact = false, hideIcons = false }: MetricCardGridProps) {
  const isMobile = useIsMobile();
  const isThreeCardMobile = isMobile && items.length === 3;
  const effectiveMinCardWidth = isMobile ? Math.min(minCardWidth, 156) : minCardWidth;
  const useCompactLayout = compact;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile
          ? `repeat(${isThreeCardMobile ? 3 : 2}, minmax(0, 1fr))`
          : `repeat(auto-fit, minmax(min(100%, ${effectiveMinCardWidth}px), 1fr))`,
        gap: isThreeCardMobile ? 6 : isMobile ? 10 : 12,
        marginBottom: isMobile ? Math.min(marginBottom, 20) : marginBottom,
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            border: `1px solid ${item.color}33`,
            borderRadius: compact ? (isMobile ? 14 : 18) : isThreeCardMobile ? 14 : isMobile ? 18 : 22,
            padding: compact ? (isMobile ? '6px 10px' : '7px 12px') : isThreeCardMobile ? '10px 8px 9px' : isMobile ? '12px 12px 11px' : '18px 18px 17px',
            background: CANVAS,
            minWidth: 0,
            boxShadow: '0 4px 14px rgba(16,24,40,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: useCompactLayout ? 10 : compact ? 8 : isThreeCardMobile ? 4 : isMobile ? 8 : 12 }}>
            <div style={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'baseline', gap: useCompactLayout ? 8 : 0, flexWrap: useCompactLayout ? 'nowrap' : 'wrap' }}>
              <div style={{ fontSize: compact ? (isMobile ? 18 : 22) : isThreeCardMobile ? 20 : isMobile ? 24 : 30, fontWeight: 700, color: item.color, lineHeight: 1, letterSpacing: isMobile ? '-0.03em' : '-0.04em', minWidth: 0, flexShrink: 0 }}>
                {item.value}
              </div>
              <div style={{ fontSize: compact ? 10.5 : isThreeCardMobile ? 10 : isMobile ? 11 : 12, fontWeight: 500, color: MUTED, lineHeight: 1.1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
            </div>
            {!hideIcons && (
              <span
                style={{
                  width: compact ? (isMobile ? 20 : 22) : isThreeCardMobile ? 24 : isMobile ? 28 : 34,
                  height: compact ? (isMobile ? 20 : 22) : isThreeCardMobile ? 24 : isMobile ? 28 : 34,
                  borderRadius: compact ? 6 : 9999,
                  background: `${item.color}10`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
