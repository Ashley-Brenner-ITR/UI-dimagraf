import { useState, useMemo } from 'react';
import { Download, CheckCircle, Clock, AlertTriangle, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { pageShell, tableShell } from './chromeStyles';
import { MetricCardGrid } from './MetricCardGrid';
import { OBLIGACIONES_PAGO, CARPETAS, type ObligacionPago } from './mockData';
import { NeonBadge } from './NeonBadge';
import { useIsMobile } from './ui/use-mobile';
import { normalizeSearchTerm } from './SearchField';
import { color, radius } from './theme';
import { FilterToolbar } from './FilterToolbar';
import { AppButton } from './AppButton';
import { WelcomeBanner } from './WelcomeBanner';
import { SurfaceCard } from './SurfaceCard';

const INK = color.ink;
const MUTED = color.muted;
const PARCHMENT = color.parchment;
const HAIRLINE = color.hairline;
const GREEN = color.brand;
const VIOLET = '#5b21b6';
const CANVAS = color.canvas;

export function TreasuryCashFlow() {
  const [horizonte, setHorizonte] = useState(30);
  const [pagos, setPagos] = useState<ObligacionPago[]>(OBLIGACIONES_PAGO);
  const [search, setSearch] = useState('');
  const [collapsedSubs, setCollapsedSubs] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  const TODAY = new Date('2026-05-28');

  const daysLeft = (fecha: string) =>
    Math.ceil((new Date(fecha).getTime() - TODAY.getTime()) / 86400000);

  const byHorizonte = pagos.filter(p => daysLeft(p.vencimiento) <= horizonte);

  const filtered = byHorizonte.filter(p => {
    if (!search) return true;
    const q = normalizeSearchTerm(search);
    return (
      normalizeSearchTerm(p.carpetaNumero).includes(q) ||
      normalizeSearchTerm(p.subcarpetaNumero || '').includes(q) ||
      normalizeSearchTerm(p.proveedor).includes(q)
    );
  });

  const pendientes = filtered.filter(p => p.estado === 'Pendiente de Pago');
  const criticos = pendientes.filter(p => daysLeft(p.vencimiento) <= 7);
  const total = pendientes.reduce((s, p) => s + p.importeARS, 0);

  const toggleEstado = (id: string) => {
    setPagos(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              estado:
                p.estado === 'Pendiente de Pago'
                  ? 'Transferencia Emitida'
                  : 'Pendiente de Pago',
            }
          : p
      )
    );
  };

  const getCarpetaEstado = (carpetaNumero: string) => {
    return CARPETAS.find(c => c.numero === carpetaNumero)?.estado ?? null;
  };

  // Grouped by Carpeta and then by Subcarpeta/Embarque
  const groupedCarpetas = useMemo(() => {
    const map = new Map<
      string,
      {
        carpetaNumero: string;
        proveedor: string;
        subMap: Map<
          string,
          {
            subcarpetaNumero: string;
            rows: ObligacionPago[];
          }
        >;
      }
    >();

    for (const p of filtered) {
      if (!map.has(p.carpetaNumero)) {
        map.set(p.carpetaNumero, {
          carpetaNumero: p.carpetaNumero,
          proveedor: p.proveedor,
          subMap: new Map(),
        });
      }
      const cEntry = map.get(p.carpetaNumero)!;
      const subKey = p.subcarpetaNumero || 'General';
      if (!cEntry.subMap.has(subKey)) {
        cEntry.subMap.set(subKey, {
          subcarpetaNumero: p.subcarpetaNumero || '',
          rows: [],
        });
      }
      cEntry.subMap.get(subKey)!.rows.push(p);
    }

    return Array.from(map.values()).map(c => ({
      carpetaNumero: c.carpetaNumero,
      proveedor: c.proveedor,
      subcarpetas: Array.from(c.subMap.values()),
    }));
  }, [filtered]);

  const toggleSubCollapse = (subNo: string) => {
    setCollapsedSubs(prev => ({ ...prev, [subNo]: !prev[subNo] }));
  };

  return (
    <div style={{ ...pageShell, padding: '12px clamp(14px, 2.5vw, 24px) 24px' }}>
      {/* ── Page header ───────────────────────────────────────── */}
      <WelcomeBanner
        title="Flujo de caja"
        subtitle="Proyección de pagos de importaciones"
        actions={<AppButton size="md" icon={<Download size={13} />}>Exportar</AppButton>}
      />

      {/* ── KPI strip ────────────────────────────────────────── */}
      <MetricCardGrid
        marginBottom={16}
        items={[
          { label: `Vencimientos en ${horizonte}d`, value: byHorizonte.length, color: INK, icon: <Clock size={16} /> },
          { label: 'Pendientes de pago', value: pendientes.length, color: '#b45309', icon: <DollarSign size={16} /> },
          { label: 'Críticos (≤ 7 días)', value: criticos.length, color: '#c4001a', icon: <AlertTriangle size={16} /> },
          { label: 'Total comprometido ARS', value: `$${(total / 1e6).toFixed(1)}M`, color: VIOLET, icon: <DollarSign size={16} /> },
        ]}
      />

      {/* ── Table & Grouped List ──────────────────────────────── */}
      <div style={{ display: 'grid', gap: 10, width: '100%' }}>
        {/* Filters bar styled standard */}
        <div
          style={{
            ...tableShell,
            background: CANVAS,
            borderRadius: radius.lg,
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          <div style={{ padding: '10px 12px' }}>
            <FilterToolbar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Buscar por carpeta, subcarpeta, proveedor..."
              searchAriaLabel="Buscar pagos"
              options={[
                { value: 7, label: '7 días' },
                { value: 15, label: '15 días' },
                { value: 30, label: '30 días' },
              ]}
              value={horizonte}
              onValueChange={setHorizonte}
            />
          </div>
        </div>

        {/* Grouped Folders (Mother -> Daughter -> Payments) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {groupedCarpetas.map(c => {
            const carpetaEstado = getCarpetaEstado(c.carpetaNumero);
            return (
              <SurfaceCard
                key={c.carpetaNumero}
                style={{
                  borderColor: 'rgba(26, 92, 56, 0.12)',
                  boxShadow: 'none',
                  borderRadius: 12,
                  background: CANVAS,
                  overflow: 'hidden',
                }}
              >
                {/* Mother Carpeta Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '10px 14px',
                    background: 'rgba(26, 92, 56, 0.03)',
                    borderBottom: `1px solid ${HAIRLINE}`,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'grid', gap: 2 }}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', color: MUTED, textTransform: 'uppercase' }}>
                        Carpeta Madre
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: INK }}>
                        {c.carpetaNumero}
                      </span>
                    </div>
                    <div style={{ width: 1, height: 24, background: HAIRLINE }} />
                    <div style={{ display: 'grid', gap: 2 }}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', color: MUTED, textTransform: 'uppercase' }}>
                        Proveedor
                      </span>
                      <span style={{ fontSize: 13, color: INK, fontWeight: 500 }}>{c.proveedor}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {carpetaEstado && <NeonBadge estado={carpetaEstado} size="sm" />}
                  </div>
                </div>

                {/* Daughter Subcarpetas inside Mother Card */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {c.subcarpetas.map((sub, sIdx) => {
                    const subKey = sub.subcarpetaNumero || 'General';
                    const isCollapsed = collapsedSubs[subKey] ?? false;

                    return (
                      <div
                        key={subKey}
                        style={{
                          borderTop: sIdx > 0 ? `1px solid ${HAIRLINE}` : 'none',
                          background: CANVAS,
                        }}
                      >
                        {/* Subcarpeta (Daughter) Header */}
                        <div
                          onClick={() => toggleSubCollapse(subKey)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            cursor: 'pointer',
                            background: isCollapsed ? 'transparent' : '#fafefd',
                            transition: 'background 0.15s ease',
                            flexWrap: 'wrap',
                            gap: 12,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>
                              {sub.subcarpetaNumero ? `Embarque ${sub.subcarpetaNumero}` : 'Gastos Generales'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <span style={{ fontSize: 11.5, color: MUTED, fontWeight: 600 }}>
                              {sub.rows.length} Compromiso{sub.rows.length > 1 ? 's' : ''} de pago
                            </span>
                            {isCollapsed ? <ChevronDown size={15} style={{ color: MUTED }} /> : <ChevronUp size={15} style={{ color: MUTED }} />}
                          </div>
                        </div>

                        {/* Nested payments list for this Shipment */}
                        {!isCollapsed && (
                          <div
                            style={{
                              padding: '4px 14px 12px 14px',
                              background: '#fafefd',
                              borderTop: `1px solid rgba(26, 92, 56, 0.05)`,
                            }}
                          >
                            <div style={{ overflowX: 'auto', border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: CANVAS }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                                <thead>
                                  <tr style={{ background: PARCHMENT, borderBottom: `1px solid ${HAIRLINE}` }}>
                                    <th style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 600, color: MUTED, fontSize: 11 }}>Concepto / Tipo</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 600, color: MUTED, fontSize: 11 }}>Vencimiento</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 600, color: MUTED, fontSize: 11 }}>Importe</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 600, color: MUTED, fontSize: 11 }}>Equiv. ARS</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'center', fontWeight: 600, color: MUTED, fontSize: 11 }}>Estado</th>
                                    <th style={{ padding: '6px 12px', textAlign: 'center', fontWeight: 600, color: MUTED, fontSize: 11 }}>Acción</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sub.rows.map((p, rIdx) => {
                                    const dl = daysLeft(p.vencimiento);
                                    const isPaid = p.estado === 'Transferencia Emitida';
                                    const isCrit = !isPaid && dl <= 7;

                                    return (
                                      <tr
                                        key={p.id}
                                        style={{
                                          borderBottom: rIdx < sub.rows.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                                          background: isCrit ? 'rgba(196,0,26,0.02)' : isPaid ? 'rgba(26,122,74,0.01)' : CANVAS,
                                        }}
                                      >
                                        <td style={{ padding: '8px 12px', color: INK, fontWeight: 500 }}>{p.tipo}</td>
                                        <td style={{ padding: '8px 12px' }}>
                                          <span style={{ fontWeight: isCrit ? 600 : 400, color: isCrit ? '#c4001a' : INK }}>
                                            {p.vencimiento}
                                          </span>
                                          <span style={{ display: 'block', fontSize: 11, color: isCrit ? '#c4001a' : MUTED, marginTop: 1 }}>
                                            {dl > 0 ? `en ${dl} días` : dl === 0 ? 'HOY' : `vencido ${Math.abs(dl)}d`}
                                          </span>
                                        </td>
                                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: INK, fontVariantNumeric: 'tabular-nums' }}>
                                          {p.importe.toLocaleString()} <span style={{ fontSize: 11, color: MUTED, fontWeight: 400, marginLeft: 2 }}>{p.moneda}</span>
                                        </td>
                                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: INK, fontVariantNumeric: 'tabular-nums' }}>
                                          $ {p.importeARS.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                          {isPaid ? (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: '#1a7a4a', fontWeight: 600 }}>
                                              Emitido
                                            </span>
                                          ) : (
                                            <span style={{ fontSize: 11.5, color: isCrit ? '#c4001a' : '#b45309', fontWeight: 600 }}>
                                              Pendiente
                                            </span>
                                          )}
                                        </td>
                                        <td style={{ padding: '6px 12px', textAlign: 'center' }}>
                                          {isPaid ? (
                                            <span style={{ fontSize: 12, color: '#1a7a4a', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                              <CheckCircle size={13} /> TRF OK
                                            </span>
                                          ) : (
                                            <AppButton onClick={() => toggleEstado(p.id)} size="xs" variant="success-soft" style={{ fontSize: 11, padding: '2px 8px', minHeight: 24 }}>
                                              Marcar emitida
                                            </AppButton>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </SurfaceCard>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '64px',
              color: MUTED,
              fontSize: 15,
              background: CANVAS,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: radius.lg,
            }}
          >
            Sin vencimientos en el horizonte seleccionado.
          </div>
        )}
      </div>
    </div>
  );
}
