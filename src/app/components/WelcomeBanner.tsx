import type { ReactNode } from 'react';
import { color, radius } from './theme';

interface WelcomeBannerProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function WelcomeBanner({ title, subtitle, actions }: WelcomeBannerProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
      marginBottom: 12,
      padding: '0 2px',
    }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(18px, 2.2vw, 22px)', fontWeight: 700, color: color.ink, lineHeight: 1.15 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#4b5563', fontWeight: 400 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
}
