import type { ReactNode } from 'react';
import { color } from './theme';

interface WelcomeBannerProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function WelcomeBanner({ title, subtitle, actions }: WelcomeBannerProps) {
  return (
    <div style={{
      marginBottom: 14,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 800, color: color.ink, lineHeight: 1.15, letterSpacing: '-0.03em' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#3b7859', fontWeight: 600, letterSpacing: '0.01em' }}>
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
    </div>
  );
}
