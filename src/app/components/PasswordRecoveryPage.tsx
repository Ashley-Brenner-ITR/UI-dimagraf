import { useMemo, useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import type { AppUser } from './mockData';
import { AppButton } from './AppButton';
import { normalizeSearchTerm } from './SearchField';
import { color } from './theme';
import fondoBackground from '../../styles/fondo.svg';

const { ink: INK, muted: MUTED, hairline: HAIRLINE, surface: CANVAS, brand: GREEN, danger: RED } = color;

interface PasswordRecoveryPageProps {
  users: AppUser[];
}

export function PasswordRecoveryPage({ users }: PasswordRecoveryPageProps) {
  const params = new URLSearchParams(window.location.search);
  const initialUsername = params.get('username') ?? '';

  const [username, setUsername] = useState(initialUsername);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<'success' | 'error'>('success');

  const matchedUser = useMemo(
    () => users.find(user => normalizeSearchTerm(user.username) === normalizeSearchTerm(username)),
    [users, username],
  );

  const handleRecoverySend = () => {
    const normalizedUsername = username.trim();
    if (!normalizedUsername) {
      setMessageTone('error');
      setMessage('Ingresá un usuario para enviar la recuperación.');
      return;
    }

    if (matchedUser) {
      setMessageTone('success');
      setMessage(`Se envió un mail de recuperación a ${matchedUser.email}.`);
      return;
    }

    setMessageTone('success');
    setMessage(`Se envió un mail de recuperación a ${normalizedUsername}@dimagraf.com.`);
  };

  const handleBack = () => {
    if (window.opener && !window.opener.closed) {
      window.opener.focus();
      window.close();
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = window.location.pathname;
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      backgroundColor: color.mintWash || '#eef8f4',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'var(--font-ui)',
    }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${fondoBackground})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '760px auto',
          backgroundPosition: 'left top',
          opacity: 0.62,
          filter: 'contrast(1.12) brightness(0.92) saturate(1.02)',
          pointerEvents: 'none',
        }}
      />
      {message && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 4,
            maxWidth: 320,
            padding: '12px 14px',
            borderRadius: 14,
            border: messageTone === 'success' ? '1px solid rgba(26,92,56,0.18)' : '1px solid rgba(159,18,57,0.20)',
            background: 'rgba(255,255,255,0.96)',
            boxShadow: '0 12px 24px rgba(16,24,40,0.12)',
            color: messageTone === 'success' ? GREEN : RED,
            fontSize: 13,
            lineHeight: 1.4,
            backdropFilter: 'blur(10px)',
          }}
        >
          {message}
        </div>
      )}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: 460,
        background: 'rgba(255,255,255,0.96)',
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(16,24,40,0.08)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ padding: '24px 28px 18px', borderBottom: `1px solid ${HAIRLINE}`, background: CANVAS }}>
          <button
            type="button"
            onClick={handleBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: 0,
              border: 'none',
              background: 'transparent',
              color: MUTED,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 14,
            }}
          >
            <ArrowLeft size={14} />
            Volver
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(26,92,56,0.10)', color: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={19} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, color: INK, letterSpacing: '-0.03em' }}>Recuperar contraseña</h1>
            </div>
          </div>
        </div>

        <form onSubmit={event => { event.preventDefault(); handleRecoverySend(); }} style={{ padding: 28, background: CANVAS }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: MUTED, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
              USUARIO
            </label>
            <input
              value={username}
              onChange={e => {
                setUsername(e.target.value);
                if (message) setMessage(null);
              }}
              placeholder="Ingresá tu usuario"
              autoFocus
              style={{ width: '100%', padding: '13px 15px', borderRadius: 14, border: `1px solid ${HAIRLINE}`, background: CANVAS, color: INK, fontSize: 14, outline: 'none', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}
            />
          </div>
          <AppButton
            type="submit"
            size="xl"
            style={{ width: '100%', marginTop: 20 }}
          >
            Enviar mail
          </AppButton>
        </form>
      </div>
    </div>
  );
}
