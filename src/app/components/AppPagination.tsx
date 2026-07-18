import { ChevronLeft, ChevronRight } from 'lucide-react';

export function AppPagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  if (pageCount <= 1) return null;

  const btnStyle = (disabled: boolean) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 8,
    border: `1px solid ${disabled ? '#e4e7ec' : '#d0d5dd'}`,
    background: disabled ? '#f9fafb' : '#ffffff',
    color: disabled ? '#98a2b3' : '#344054',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
  });

  return (
    <nav
      aria-label="Paginación"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '6px 12px',
        background: '#ffffff',
        border: '1px solid #eaecf0',
        borderRadius: 10,
        width: 'fit-content',
        margin: '16px auto',
        boxShadow: '0 1px 3px rgba(16,24,40,0.05)',
      }}
    >
      <button
        type="button"
        aria-label="Página anterior"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        style={btnStyle(page <= 1)}
      >
        <ChevronLeft size={16} />
      </button>

      <span
        aria-live="polite"
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#344054',
          minWidth: 100,
          textAlign: 'center',
        }}
      >
        Pág. {page} de {pageCount}
      </span>

      <button
        type="button"
        aria-label="Página siguiente"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        style={btnStyle(page >= pageCount)}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
