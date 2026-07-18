import { useState, useMemo } from 'react';
import { Download, Package, Clock3, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { pageActions, pageHeader, pageShell, tableShell } from './chromeStyles';
import { MetricCardGrid } from './MetricCardGrid';
import { CARPETAS, PROVEEDORES } from './mockData';
import { useIsMobile } from './ui/use-mobile';
import { TransportModeIcon } from './TransportModeIcon';
import { normalizeSearchTerm } from './SearchField';
import { color, radius } from './theme';
import { FilterToolbar } from './FilterToolbar';
import { WelcomeBanner } from './WelcomeBanner';
import { AppButton } from './AppButton';
import { SurfaceCard } from './SurfaceCard';

const INK = color.ink;
const MUTED = color.muted;
const PARCHMENT = color.parchment;
const HAIRLINE = color.hairline;
const GREEN = color.brand;
const CANVAS = color.canvas;

interface ArrivalRow {
  codigoSAP: string;
  descripcion: string;
  linea: string;
  carpetaNumero: string;
  subcarpetaNumero: string;
  proveedor: string;
  cantidadViaje: number;
  um: string;
  eta: string;
  transporte: string;
}

function buildArrivals(): ArrivalRow[] {
  const rows: ArrivalRow[] = [];
  for (const carpeta of CARPETAS) {
    const prov = PROVEEDORES.find(p => p.id === carpeta.proveedorId);
    for (const sub of carpeta.subcarpetas) {
      if (sub.id.includes('empty') || sub.estado === 'En Stock' || sub.estado === 'Recibida') continue;
      for (const ae of sub.articulosEmbarque) {
        const art = carpeta.articulos.find(a => a.id === ae.articuloId);
        if (!art) continue;
        rows.push({
          codigoSAP: art.codigoSAP,
          descripcion: art.descripcion,
          linea: art.linea,
          carpetaNumero: carpeta.numero,
          subcarpetaNumero: sub.numero,
          proveedor: prov?.nombre || '—',
          cantidadViaje: ae.cantidad,
          um: art.um,
          eta: sub.eta,
          transporte: sub.transporte,
        });
      }
    }
  }
  return rows.sort((a, b) => a.eta.localeCompare(b.eta));
}

export function CommercialArrivals() {
  const [lineaFilter, setLineaFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [collapsedSubs, setCollapsedSubs] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  const arrivals = buildArrivals();
  const TODAY = '2026-05-28';

  const filtered = arrivals.filter(r => {
    const matchLinea = lineaFilter === 'Todos' || r.linea === lineaFilter;
    const query = normalizeSearchTerm(search);
    const matchSearch =
      !query ||
      [r.codigoSAP, r.descripcion, r.proveedor, r.carpetaNumero, r.subcarpetaNumero].some(value =>
        normalizeSearchTerm(value).includes(query)
      );
    return matchLinea && matchSearch;
  });

  const daysLeft = (eta: string) =>
    Math.ceil((new Date(eta).getTime() - new Date(TODAY).getTime()) / 86400000);

  // Grouped by Carpeta (Mother) and then by Subcarpeta (Daughter)
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
            transporte: string;
            eta: string;
            rows: ArrivalRow[];
          }
        >;
      }
    >();

    for (const r of filtered) {
      if (!map.has(r.carpetaNumero)) {
        map.set(r.carpetaNumero, {
          carpetaNumero: r.carpetaNumero,
          proveedor: r.proveedor,
          subMap: new Map(),
        });
      }
      const cEntry = map.get(r.carpetaNumero)!;
      if (!cEntry.subMap.has(r.subcarpetaNumero)) {
        cEntry.subMap.set(r.subcarpetaNumero, {
          subcarpetaNumero: r.subcarpetaNumero,
          transporte: r.transporte,
          eta: r.eta,
          rows: [],
        });
      }
      cEntry.subMap.get(r.subcarpetaNumero)!.rows.push(r);
    }

    return Array.from(map.values()).map(c => ({
      carpetaNumero: c.carpetaNumero,
      proveedor: c.proveedor,
      subcarpetas: Array.from(c.subMap.values()).sort((a, b) => a.eta.localeCompare(b.eta)),
    }));
  }, [filtered]);

  const toggleSubCollapse = (subNo: string) => {
    setCollapsedSubs(prev => ({ ...prev, [subNo]: !prev[subNo] }));
  };

  return (
    <div style={{ ...pageShell, padding: '12px clamp(14px, 2.5vw, 24px) 24px' }}>
      {/* ── Page header ───────────────────────────────────────── */}
      <WelcomeBanner
        title="Arrivals"
        subtitle="Cargas entrantes · Solo lectura"
        actions={
          <AppButton style={{ flexShrink: 0 }} icon={<Download size={14} />}>
            Exportar (.xlsx)
          </AppButton>
        }
      />

      {/* ── KPI strip ────────────────────────────────────────── */}
      <MetricCardGrid
        marginBottom={16}
        items={[
          { label: 'Artículos en viaje', value: filtered.length, color: '#5b21b6', icon: <Package size={16} /> },
          {
            label: 'Arrivals en ≤ 30 días',
            value: filtered.filter(r => daysLeft(r.eta) <= 30 && daysLeft(r.eta) >= 0).length,
            color: '#b45309',
            icon: <Clock3 size={16} />,
          },
          {
            label: 'Proveedores activos',
            value: new Set(filtered.map(r => r.proveedor)).size,
            color: '#1a5c38',
            icon: <Users size={16} />,
          },
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
              searchPlaceholder="Buscar por código SAP, descripción, carpeta..."
              searchAriaLabel="Buscar arrivals"
              options={[
                { value: 'Todos', label: 'Todos' },
                { value: 'LCA', label: 'LCA' },
                { value: 'LDA', label: 'LDA' },
              ]}
              value={lineaFilter}
              onValueChange={setLineaFilter}
            />
          </div>
        </div>

        {/* Grouped Folders (Mother -> Daughter -> Articles) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {groupedCarpetas.map(c => (
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
                  <div
                    style={{
                      width: 1,
                      height: 24,
                      background: HAIRLINE,
                    }}
                  />
                  <div style={{ display: 'grid', gap: 2 }}>
                    <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', color: MUTED, textTransform: 'uppercase' }}>
                      Proveedor
                    </span>
                    <span style={{ fontSize: 13, color: INK, fontWeight: 500 }}>{c.proveedor}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: MUTED, fontWeight: 600, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 9999, padding: '2px 8px' }}>
                    {c.subcarpetas.length} Embarque{c.subcarpetas.length > 1 ? 's' : ''} activo{c.subcarpetas.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Daughter Subcarpetas inside Mother Card */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {c.subcarpetas.map((sub, sIdx) => {
                  const dl = daysLeft(sub.eta);
                  const isOverdue = dl <= 0;
                  const isNear = dl > 0 && dl <= 7;
                  const isCollapsed = collapsedSubs[sub.subcarpetaNumero] ?? false;

                  return (
                    <div
                      key={sub.subcarpetaNumero}
                      style={{
                        borderTop: sIdx > 0 ? `1px solid ${HAIRLINE}` : 'none',
                        background: CANVAS,
                      }}
                    >
                      {/* Subcarpeta (Daughter) Row Header */}
                      <div
                        onClick={() => toggleSubCollapse(sub.subcarpetaNumero)}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <TransportModeIcon transporte={sub.transporte} size={14} compact />
                            <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>
                              {sub.subcarpetaNumero}
                            </span>
                          </span>
                          <span style={{ fontSize: 12, color: MUTED }}>
                            {sub.transporte}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span style={{ fontSize: 12, fontWeight: 500 }}>
                            <span style={{ color: MUTED, marginRight: 6 }}>ETA:</span>
                            <span style={{ color: isOverdue ? '#c4001a' : isNear ? '#b45309' : INK, fontWeight: isOverdue || isNear ? 600 : 400 }}>{sub.eta}</span>
                            {isOverdue && <span style={{ color: '#c4001a', fontWeight: 700, marginLeft: 6 }}>Vencido</span>}
                            {isNear && <span style={{ color: '#b45309', fontWeight: 600, marginLeft: 6 }}>en {dl}d</span>}
                          </span>
                          {isCollapsed ? <ChevronDown size={15} style={{ color: MUTED }} /> : <ChevronUp size={15} style={{ color: MUTED }} />}
                        </div>
                      </div>

                      {/* Nested articles list for this Shipment */}
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
                                  <th style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 600, color: MUTED, fontSize: 11 }}>Cód. SAP</th>
                                  <th style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 600, color: MUTED, fontSize: 11 }}>Descripción / Producto</th>
                                  <th style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 600, color: MUTED, fontSize: 11 }}>Línea</th>
                                  <th style={{ padding: '6px 12px', textAlign: 'right', fontWeight: 600, color: MUTED, fontSize: 11 }}>Cant. en Viaje</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sub.rows.map((row, rIdx) => (
                                  <tr
                                    key={`${row.codigoSAP}-${rIdx}`}
                                    style={{
                                      borderBottom: rIdx < sub.rows.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                                    }}
                                  >
                                    <td style={{ padding: '7px 12px', fontWeight: 700, color: INK }}>{row.codigoSAP}</td>
                                    <td style={{ padding: '7px 12px', color: INK }}>{row.descripcion}</td>
                                    <td style={{ padding: '7px 12px' }}>
                                      <span style={{ fontSize: 11, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 4, padding: '1px 5px', color: MUTED }}>{row.linea}</span>
                                    </td>
                                    <td style={{ padding: '7px 12px', textAlign: 'right', fontWeight: 600, color: INK, fontVariantNumeric: 'tabular-nums' }}>
                                      {row.cantidadViaje.toLocaleString()} <span style={{ fontSize: 11, color: MUTED, fontWeight: 400, marginLeft: 2 }}>{row.um}</span>
                                    </td>
                                  </tr>
                                ))}
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
          ))}
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
            No hay arrivals con los filtros aplicados.
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: MUTED }}>
        {filtered.length} ítem(s) en viaje
      </div>
    </div>
  );
}
