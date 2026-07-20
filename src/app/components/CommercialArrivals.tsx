import { useEffect, useMemo, useState } from 'react';
import { Download, AlertTriangle, Ship, ChevronLeft, ChevronRight, FolderOpen, Layers, SlidersHorizontal } from 'lucide-react';
import { getResponsiveTableStyle, pageShell, tableHeadCell, tableScrollArea, tableShell } from './chromeStyles';
import { X } from 'lucide-react';
import { CARPETAS, PROVEEDORES } from './mockData';
import { useIsMobile } from './ui/use-mobile';
import { TransportModeIcon } from './TransportModeIcon';
import { normalizeSearchTerm } from './SearchField';
import { color, radius, shipmentTypography } from './theme';
import { FilterToolbar } from './FilterToolbar';
import { WelcomeBanner } from './WelcomeBanner';
import { AppButton } from './AppButton';
import { AppDateField } from './AppDateField';
import { SurfaceCard } from './SurfaceCard';
import { FormField } from './FormField';
import { AppSelectContent, AppSelectItem, AppSelectTrigger, Select, SelectValue } from './ui/select';

const INK = color.ink;
const MUTED = color.muted;
const PARCHMENT = color.parchment;
const HAIRLINE = color.hairline;
const GREEN = color.brand;
const CANVAS = color.canvas;
const MINT_WASH = color.mintWash;
const GREEN_HAIRLINE = color.borderTint;
const GREEN_HAIRLINE_SOFT = color.borderTintSoft;
const SHIPMENT_TYPE = shipmentTypography;
const ARRIVALS_PAGE_SIZE = 8;
const FILTER_FIELD_STYLE: React.CSSProperties = {
  width: '100%',
  minHeight: 40,
  padding: '9px 13px',
  fontSize: 14,
  color: INK,
  background: color.surface,
  border: `1px solid ${color.controlBorder}`,
  borderRadius: radius.md,
  outline: 'none',
};

interface ArrivalRow {
  carpetaId: string;
  codigoSAP: string;
  descripcion: string;
  linea: string;
  importador: string;
  carpetaNumero: string;
  subcarpetaId: string;
  subcarpetaNumero: string;
  proveedor: string;
  cantidadViaje: number;
  um: string;
  eta: string;
  transporte: string;
  estado: string;
}

interface GroupedArrivalSub {
  subcarpetaId: string;
  subcarpetaNumero: string;
  transporte: string;
  eta: string;
  rows: ArrivalRow[];
}

interface Props {
  onSelectSubcarpeta?: (carpetaId: string, subcarpetaId: string) => void;
}

type ArrivalStatusFilter = 'Todos' | 'En tránsito' | 'Arribando / arribado';
type EtaSortOption = 'eta-asc' | 'eta-desc';

function getArrivalStatusLabel(estado: string) {
  return estado === 'En Tránsito' ? 'En tránsito' : 'Arribando / arribado';
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
          carpetaId: carpeta.id,
          codigoSAP: art.codigoSAP,
          descripcion: art.descripcion,
          linea: art.linea,
          importador: 'Dimagraf',
          carpetaNumero: carpeta.numero,
          subcarpetaId: sub.id,
          subcarpetaNumero: sub.numero,
          proveedor: prov?.nombre || '—',
          cantidadViaje: ae.cantidad,
          um: art.um,
          eta: sub.eta,
          transporte: sub.transporte,
          estado: sub.estado,
        });
      }
    }
  }
  return rows.sort((a, b) => a.eta.localeCompare(b.eta));
}

export function CommercialArrivals({ onSelectSubcarpeta }: Props) {
  const [lineaFilter, setLineaFilter] = useState('Todos');
  const [importadorFilter, setImportadorFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState<ArrivalStatusFilter>('Todos');
  const [etaSort, setEtaSort] = useState<EtaSortOption>('eta-asc');
  const [search, setSearch] = useState('');
  const [etaFrom, setEtaFrom] = useState('');
  const [etaTo, setEtaTo] = useState('');
  const [isFlatView, setIsFlatView] = useState(false);
  const [showViewOptions, setShowViewOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const arrivals = buildArrivals();
  const TODAY = '2026-05-28';

  const filtered = arrivals.filter(r => {
    const matchLinea = lineaFilter === 'Todos' || r.linea === lineaFilter;
    const matchImportador = importadorFilter === 'Todos' || r.importador === importadorFilter;
    const matchStatus = statusFilter === 'Todos' || getArrivalStatusLabel(r.estado) === statusFilter;
    const query = normalizeSearchTerm(search);
    const matchSearch =
      !query ||
      [r.codigoSAP, r.descripcion, r.proveedor, r.importador, r.carpetaNumero, r.subcarpetaNumero].some(value =>
        normalizeSearchTerm(value).includes(query)
      );
    const matchEtaFrom = !etaFrom || r.eta >= etaFrom;
    const matchEtaTo = !etaTo || r.eta <= etaTo;
    return matchLinea && matchImportador && matchStatus && matchSearch && matchEtaFrom && matchEtaTo;
  }).sort((left, right) => etaSort === 'eta-desc' ? right.eta.localeCompare(left.eta) : left.eta.localeCompare(right.eta));

  const daysLeft = (eta: string) =>
    Math.ceil((new Date(eta).getTime() - new Date(TODAY).getTime()) / 86400000);

  // Grouped by Carpeta (Mother) and then by Subcarpeta (Daughter)
  const groupedCarpetas = useMemo(() => {
    const map = new Map<
      string,
      {
        carpetaId: string;
        carpetaNumero: string;
        proveedor: string;
        subMap: Map<
          string,
          {
            subcarpetaId: string;
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
          carpetaId: r.carpetaId,
          carpetaNumero: r.carpetaNumero,
          proveedor: r.proveedor,
          subMap: new Map(),
        });
      }
      const cEntry = map.get(r.carpetaNumero)!;
      if (!cEntry.subMap.has(r.subcarpetaNumero)) {
        cEntry.subMap.set(r.subcarpetaNumero, {
          subcarpetaId: r.subcarpetaId,
          subcarpetaNumero: r.subcarpetaNumero,
          transporte: r.transporte,
          eta: r.eta,
          rows: [],
        });
      }
      cEntry.subMap.get(r.subcarpetaNumero)!.rows.push(r);
    }

    return Array.from(map.values()).map(c => ({
      carpetaId: c.carpetaId,
      carpetaNumero: c.carpetaNumero,
      proveedor: c.proveedor,
      subcarpetas: Array.from(c.subMap.values()).sort((a, b) => etaSort === 'eta-desc' ? b.eta.localeCompare(a.eta) : a.eta.localeCompare(b.eta)),
    }));
  }, [etaSort, filtered]);

  const flatShipments = useMemo(
    () => groupedCarpetas.flatMap(c => c.subcarpetas.map(sub => ({ carpetaId: c.carpetaId, carpetaNumero: c.carpetaNumero, proveedor: c.proveedor, sub }))),
    [groupedCarpetas]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [lineaFilter, importadorFilter, statusFilter, etaSort, search, etaFrom, etaTo]);

  const pageCount = Math.max(1, Math.ceil(flatShipments.length / ARRIVALS_PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const pageStart = (safePage - 1) * ARRIVALS_PAGE_SIZE;
  const visiblePageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1).filter(pageNumber => {
    if (pageCount <= 5) return true;
    if (pageNumber === 1 || pageNumber === pageCount) return true;
    return Math.abs(pageNumber - safePage) <= 1;
  });
  const paginatedShipments = useMemo(() => {
    const start = pageStart;
    return flatShipments.slice(start, start + ARRIVALS_PAGE_SIZE);
  }, [flatShipments, pageStart]);

  const getShipmentMetrics = (sub: GroupedArrivalSub) => {
    const totalCantidad = sub.rows.reduce((sum, row) => sum + row.cantidadViaje, 0);
    const uniqueProducts = new Set(sub.rows.map(row => row.codigoSAP)).size;
    const lineas = Array.from(new Set(sub.rows.map(row => row.linea)));
    const unidades = Array.from(new Set(sub.rows.map(row => row.um)));
    return { totalCantidad, uniqueProducts, lineas, unidades };
  };

  const compactRows = useMemo(
    () => paginatedShipments.map(item => {
      const { totalCantidad, uniqueProducts, lineas, unidades } = getShipmentMetrics(item.sub);
      const dl = daysLeft(item.sub.eta);
      const isOverdue = dl <= 0;
      const isNear = dl > 0 && dl <= 7;
      const etaStatus = isOverdue ? 'Vencido' : isNear ? `Arriba en ${dl} días` : 'En tránsito';
      return {
        ...item,
        totalCantidad,
        uniqueProducts,
        lineas,
        unidades,
        isOverdue,
        isNear,
        etaStatus,
      };
    }),
    [paginatedShipments]
  );

  const renderShipmentCard = (sub: GroupedArrivalSub, carpetaId: string, carpetaNumero: string, key: string, style?: React.CSSProperties) => {
    const dl = daysLeft(sub.eta);
    const isOverdue = dl <= 0;
    const isNear = dl > 0 && dl <= 7;
    const { totalCantidad, uniqueProducts, lineas, unidades } = getShipmentMetrics(sub);
    const etaStatus = isOverdue ? 'Vencido' : isNear ? `Arriba en ${dl} días` : 'En tránsito';

    return (
      <article key={key} style={{ flex: 1, margin: 0, borderTop: `1px solid ${GREEN_HAIRLINE_SOFT}`, ...style }}>
        <button
          type="button"
          onClick={() => onSelectSubcarpeta?.(carpetaId, sub.subcarpetaId)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto 20px',
            alignItems: 'center',
            gap: 6,
            width: '100%',
            padding: isMobile ? '10px 12px' : '9px 12px',
            border: 'none',
            background: 'transparent',
            textAlign: 'left',
            cursor: onSelectSubcarpeta ? 'pointer' : 'default',
          }}
        >
          <div style={{ minWidth: 0, display: 'grid', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: SHIPMENT_TYPE.title,
                  lineHeight: '16px',
                  fontWeight: 600,
                  color: INK,
                }}
              >
                {sub.subcarpetaNumero}
              </span>
              <span style={{ fontSize: SHIPMENT_TYPE.companion, lineHeight: 1.2, color: MUTED }}>de {carpetaNumero}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(5, minmax(0, 1fr))', gap: isMobile ? 6 : 8, minWidth: 0 }}>
              <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: SHIPMENT_TYPE.label, lineHeight: 1, fontWeight: 700, letterSpacing: '0.05em', color: MUTED, textTransform: 'uppercase' }}>ETA</span>
                <span style={{ fontSize: SHIPMENT_TYPE.companion, lineHeight: 1.2, color: isOverdue ? '#c4001a' : isNear ? '#b45309' : INK, fontWeight: isOverdue || isNear ? 600 : 400 }}>{sub.eta || '—'}</span>
              </div>
              <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: SHIPMENT_TYPE.label, lineHeight: 1, fontWeight: 700, letterSpacing: '0.05em', color: MUTED, textTransform: 'uppercase' }}>Modo</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0, fontSize: SHIPMENT_TYPE.companion, lineHeight: 1.2, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <TransportModeIcon transporte={sub.transporte} size={10} minimal />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.transporte}</span>
                </span>
              </div>
              <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: SHIPMENT_TYPE.label, lineHeight: 1, fontWeight: 700, letterSpacing: '0.05em', color: MUTED, textTransform: 'uppercase' }}>Productos</span>
                <span style={{ fontSize: SHIPMENT_TYPE.companion, lineHeight: 1.2, color: INK }}>{uniqueProducts}</span>
              </div>
              <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: SHIPMENT_TYPE.label, lineHeight: 1, fontWeight: 700, letterSpacing: '0.05em', color: MUTED, textTransform: 'uppercase' }}>Cantidad</span>
                <span style={{ fontSize: SHIPMENT_TYPE.companion, lineHeight: 1.2, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{totalCantidad.toLocaleString()}{unidades.length === 1 ? ` ${unidades[0]}` : ''}</span>
              </div>
              <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
                <span style={{ fontSize: SHIPMENT_TYPE.label, lineHeight: 1, fontWeight: 700, letterSpacing: '0.05em', color: MUTED, textTransform: 'uppercase' }}>Estado</span>
                <span style={{ fontSize: SHIPMENT_TYPE.companion, lineHeight: 1.2, color: isOverdue ? '#c4001a' : isNear ? '#b45309' : '#1a7a4a', fontWeight: 600, whiteSpace: 'nowrap' }}>{etaStatus}</span>
              </div>
            </div>
          </div>
          <span style={{ width: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={12} style={{ color: '#98a2b3', flexShrink: 0 }} />
          </span>
        </button>
      </article>
    );
  };

  return (
    <div style={{ ...pageShell, background: MINT_WASH, borderRadius: 24 }}>
      <div style={{ padding: isMobile ? '12px 12px 0' : '16px 14px 0' }}>
        <WelcomeBanner
          title="Arribos"
          actions={
            <AppButton variant="secondary" style={{ flexShrink: 0 }} icon={<Download size={14} />}>
              Exportar
            </AppButton>
          }
        />
      </div>

      <div style={{ ...tableShell, border: 'none', background: 'transparent', boxShadow: 'none', borderRadius: 0, overflow: 'visible' }}>
        <div
          style={{
            padding: isMobile ? '10px 12px' : '12px 14px',
            background: isMobile ? MINT_WASH : 'transparent',
            display: 'grid',
            gap: 10,
          }}
        >
          <FilterToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder={isMobile ? 'Buscar carpeta, proveedor o SAP' : 'Buscar por Carpeta, Proveedor o Código SAP'}
            searchAriaLabel="Buscar arribos"
            searchSize={isMobile ? 'compact' : 'default'}
            options={[]}
            value={statusFilter}
            onValueChange={setStatusFilter}
            showChildrenDivider={false}
            trailingActions={
              <button
                type="button"
                onClick={() => setShowViewOptions(current => !current)}
                aria-label="Ajustes de vista"
                title="Ajustes de vista"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: isMobile ? 38 : 40, height: isMobile ? 38 : 40, padding: 0, flexShrink: 0, background: showViewOptions ? GREEN : CANVAS, color: showViewOptions ? '#fff' : GREEN, border: `1px solid ${showViewOptions ? GREEN : HAIRLINE}`, borderRadius: 9999, cursor: 'pointer', boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}
              >
                <SlidersHorizontal size={isMobile ? 13 : 14} aria-hidden="true" />
              </button>
            }
          >
            <div style={{ display: 'grid', gap: 12, width: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))', gap: 10, alignItems: 'end' }}>
                <FormField label="Estado">
                  <Select value={statusFilter} onValueChange={value => setStatusFilter(value as ArrivalStatusFilter)}>
                    <AppSelectTrigger style={{ width: '100%' }}>
                      <SelectValue placeholder="Todos" />
                    </AppSelectTrigger>
                    <AppSelectContent style={{ zIndex: 400 }}>
                      <AppSelectItem value="Todos">Todos</AppSelectItem>
                      <AppSelectItem value="En tránsito">En tránsito</AppSelectItem>
                      <AppSelectItem value="Arribando / arribado">Arribando / arribado</AppSelectItem>
                    </AppSelectContent>
                  </Select>
                </FormField>
                <FormField label="Línea">
                  <Select value={lineaFilter} onValueChange={setLineaFilter}>
                    <AppSelectTrigger style={{ width: '100%' }}>
                      <SelectValue placeholder="Todas" />
                    </AppSelectTrigger>
                    <AppSelectContent style={{ zIndex: 400 }}>
                      <AppSelectItem value="Todos">Todas</AppSelectItem>
                      <AppSelectItem value="LCA">LCA</AppSelectItem>
                      <AppSelectItem value="LDA">LDA</AppSelectItem>
                    </AppSelectContent>
                  </Select>
                </FormField>
                <FormField label="Importador">
                  <Select value={importadorFilter} onValueChange={setImportadorFilter}>
                    <AppSelectTrigger style={{ width: '100%' }}>
                      <SelectValue placeholder="Todos" />
                    </AppSelectTrigger>
                    <AppSelectContent style={{ zIndex: 400 }}>
                      <AppSelectItem value="Todos">Todos</AppSelectItem>
                      <AppSelectItem value="Dimagraf">Dimagraf</AppSelectItem>
                    </AppSelectContent>
                  </Select>
                </FormField>
                <FormField label="Orden ETA">
                  <Select value={etaSort} onValueChange={value => setEtaSort(value as EtaSortOption)}>
                    <AppSelectTrigger style={{ width: '100%' }}>
                      <SelectValue />
                    </AppSelectTrigger>
                    <AppSelectContent style={{ zIndex: 400 }}>
                      <AppSelectItem value="eta-asc">Más próxima primero</AppSelectItem>
                      <AppSelectItem value="eta-desc">Más lejana primero</AppSelectItem>
                    </AppSelectContent>
                  </Select>
                </FormField>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 10, alignItems: 'end' }}>
                <FormField label="ETA desde">
                  <AppDateField value={etaFrom} onValueChange={setEtaFrom} ariaLabel="ETA desde" />
                </FormField>
                <FormField label="ETA hasta">
                  <AppDateField value={etaTo} onValueChange={setEtaTo} ariaLabel="ETA hasta" />
                </FormField>
              </div>
            </div>
          </FilterToolbar>
        </div>

        {isFlatView ? (
        <div style={{ ...tableScrollArea, padding: '6px 10px 0', overflowX: 'auto' }}>
          <table style={{ ...getResponsiveTableStyle(920), tableLayout: 'auto', borderCollapse: 'separate', borderSpacing: '0 2px' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeadCell, background: '#fafbfd', borderBottom: `1px solid ${HAIRLINE}` }}><span style={{ color: MUTED, fontSize: SHIPMENT_TYPE.tableHead, fontWeight: 700, letterSpacing: '0.06em' }}>EMBARQUE</span></th>
                <th style={{ ...tableHeadCell, background: '#fafbfd', borderBottom: `1px solid ${HAIRLINE}` }}><span style={{ color: MUTED, fontSize: SHIPMENT_TYPE.tableHead, fontWeight: 700, letterSpacing: '0.06em' }}>CARPETA</span></th>
                <th style={{ ...tableHeadCell, background: '#fafbfd', borderBottom: `1px solid ${HAIRLINE}` }}><span style={{ color: MUTED, fontSize: SHIPMENT_TYPE.tableHead, fontWeight: 700, letterSpacing: '0.06em' }}>PROVEEDOR</span></th>
                <th style={{ ...tableHeadCell, background: '#fafbfd', borderBottom: `1px solid ${HAIRLINE}` }}><span style={{ color: MUTED, fontSize: SHIPMENT_TYPE.tableHead, fontWeight: 700, letterSpacing: '0.06em' }}>TRANSPORTE</span></th>
                <th style={{ ...tableHeadCell, background: '#fafbfd', borderBottom: `1px solid ${HAIRLINE}` }}><span style={{ color: MUTED, fontSize: SHIPMENT_TYPE.tableHead, fontWeight: 700, letterSpacing: '0.06em' }}>ETA</span></th>
                <th style={{ ...tableHeadCell, background: '#fafbfd', borderBottom: `1px solid ${HAIRLINE}` }}><span style={{ color: MUTED, fontSize: SHIPMENT_TYPE.tableHead, fontWeight: 700, letterSpacing: '0.06em' }}>PRODUCTOS</span></th>
                <th style={{ ...tableHeadCell, background: '#fafbfd', borderBottom: `1px solid ${HAIRLINE}` }}><span style={{ color: MUTED, fontSize: SHIPMENT_TYPE.tableHead, fontWeight: 700, letterSpacing: '0.06em' }}>CANTIDAD</span></th>
                <th style={{ ...tableHeadCell, background: '#fafbfd', borderBottom: `1px solid ${HAIRLINE}` }}><span style={{ color: MUTED, fontSize: SHIPMENT_TYPE.tableHead, fontWeight: 700, letterSpacing: '0.06em' }}>LÍNEAS</span></th>
                <th style={{ ...tableHeadCell, background: '#fafbfd', borderBottom: `1px solid ${HAIRLINE}` }}><span style={{ color: MUTED, fontSize: SHIPMENT_TYPE.tableHead, fontWeight: 700, letterSpacing: '0.06em' }}>ESTADO</span></th>
                <th style={{ ...tableHeadCell, width: 32, background: '#fafbfd', borderBottom: `1px solid ${HAIRLINE}` }} />
              </tr>
            </thead>
            <tbody>
              {compactRows.map(item => (
                <tr key={`${item.carpetaNumero}-${item.sub.subcarpetaNumero}`} style={{ background: CANVAS }}>
                  <td style={{ padding: '10px 8px 10px 14px', verticalAlign: 'middle', borderBottom: `1px solid ${GREEN_HAIRLINE_SOFT}`, fontSize: 12 }}>
                    <button
                      type="button"
                      onClick={() => onSelectSubcarpeta?.(item.carpetaId, item.sub.subcarpetaId)}
                      style={{
                        padding: 0,
                        border: 'none',
                        background: 'transparent',
                        fontWeight: 600,
                        color: INK,
                        cursor: onSelectSubcarpeta ? 'pointer' : 'default',
                      }}
                    >
                      {item.sub.subcarpetaNumero}
                    </button>
                  </td>
                  <td style={{ padding: '10px 8px', verticalAlign: 'middle', borderBottom: `1px solid ${GREEN_HAIRLINE_SOFT}`, fontSize: 12, color: MUTED }}>
                    {item.carpetaNumero}
                  </td>
                  <td style={{ padding: '10px 8px', verticalAlign: 'middle', borderBottom: `1px solid ${GREEN_HAIRLINE_SOFT}`, fontSize: 12, color: INK, whiteSpace: 'nowrap' }}>
                    {item.proveedor}
                  </td>
                  <td style={{ padding: '10px 8px', verticalAlign: 'middle', borderBottom: `1px solid ${GREEN_HAIRLINE_SOFT}`, fontSize: 11.5, color: INK }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                      <TransportModeIcon transporte={item.sub.transporte} size={10} minimal />
                      <span>{item.sub.transporte}</span>
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', verticalAlign: 'middle', borderBottom: `1px solid ${GREEN_HAIRLINE_SOFT}`, fontSize: 11.5, color: item.isOverdue ? '#c4001a' : item.isNear ? '#b45309' : INK, fontWeight: item.isOverdue || item.isNear ? 600 : 400, whiteSpace: 'nowrap' }}>
                    {item.sub.eta || '—'}
                  </td>
                  <td style={{ padding: '10px 8px', verticalAlign: 'middle', borderBottom: `1px solid ${GREEN_HAIRLINE_SOFT}`, fontSize: 11.5, color: INK }}>
                    {item.uniqueProducts}
                  </td>
                  <td style={{ padding: '10px 8px', verticalAlign: 'middle', borderBottom: `1px solid ${GREEN_HAIRLINE_SOFT}`, fontSize: 11.5, color: INK, whiteSpace: 'nowrap' }}>
                    {item.totalCantidad.toLocaleString()}{item.unidades.length === 1 ? ` ${item.unidades[0]}` : ''}
                  </td>
                  <td style={{ padding: '10px 8px', verticalAlign: 'middle', borderBottom: `1px solid ${GREEN_HAIRLINE_SOFT}`, fontSize: 11.5, color: INK, whiteSpace: 'nowrap' }}>
                    {item.lineas.join(' · ') || '—'}
                  </td>
                  <td style={{ padding: '10px 8px', verticalAlign: 'middle', borderBottom: `1px solid ${GREEN_HAIRLINE_SOFT}`, fontSize: 11.5 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 600, color: item.isOverdue ? '#c4001a' : item.isNear ? '#b45309' : '#1a7a4a', whiteSpace: 'nowrap' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.isOverdue ? '#c4001a' : item.isNear ? '#b45309' : '#1a7a4a' }} />
                      {item.etaStatus}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px 10px 4px', verticalAlign: 'middle', borderBottom: `1px solid ${GREEN_HAIRLINE_SOFT}`, textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => onSelectSubcarpeta?.(item.carpetaId, item.sub.subcarpetaId)}
                      aria-label={`Abrir ${item.sub.subcarpetaNumero}`}
                      style={{ width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, border: 'none', background: 'transparent', cursor: onSelectSubcarpeta ? 'pointer' : 'default' }}
                    >
                      <ChevronRight size={14} style={{ color: '#98a2b3', flexShrink: 0 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : (
          <div style={{ display: 'grid', gap: 0, padding: '6px 10px 0' }}>
            {groupedCarpetas.map(c => (
              <section key={c.carpetaNumero} style={{ display: 'grid', gap: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                  {c.subcarpetas.map(sub => (
                    <div key={sub.subcarpetaNumero}>
                      {renderShipmentCard(sub, c.carpetaId, c.carpetaNumero, `${c.carpetaNumero}-${sub.subcarpetaNumero}-grouped`)}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <SurfaceCard style={{ margin: '8px 10px 2px', padding: '32px 24px', boxShadow: 'none', borderColor: GREEN_HAIRLINE, background: '#fcfdfd' }}>
            <div style={{ display: 'grid', justifyItems: 'center', gap: 10, textAlign: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 9999, background: 'rgba(29, 29, 31, 0.05)', color: MUTED }}>
                <AlertTriangle size={20} />
              </span>
              <div style={{ fontSize: 17, fontWeight: 600, color: INK }}>No se encontraron arribos</div>
              <div style={{ maxWidth: 420, fontSize: 12, lineHeight: 1.45, color: MUTED }}>
                Probá cambiando la búsqueda o ajustando los filtros para ampliar el resultado.
              </div>
            </div>
          </SurfaceCard>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(180px, 1fr) auto', alignItems: 'center', gap: isMobile ? 8 : 12, padding: isMobile ? '8px 12px 10px' : '10px 14px 12px', background: 'transparent' }}>
        <div style={{ fontSize: 12, color: MUTED }}>
          {groupedCarpetas.length} carpeta{groupedCarpetas.length === 1 ? '' : 's'} activas · {isFlatView ? `${flatShipments.length} embarque${flatShipments.length === 1 ? '' : 's'} en viaje · mostrando ${flatShipments.length === 0 ? 0 : pageStart + 1}-${Math.min(pageStart + paginatedShipments.length, flatShipments.length)}` : `${filtered.length} ítem${filtered.length === 1 ? '' : 's'} en viaje`}
        </div>
        {isFlatView && flatShipments.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? 4 : 6, flexWrap: 'wrap' }}>
            <AppButton
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={safePage === 1}
              aria-label="Página anterior"
              icon={!isMobile ? <ChevronLeft size={14} /> : undefined}
              style={{
                minWidth: isMobile ? 34 : 92,
                minHeight: isMobile ? 30 : 34,
                padding: isMobile ? '0 10px' : '0 12px',
                borderRadius: 8,
                color: safePage === 1 ? '#98a2b3' : INK,
              }}
            >
              {isMobile ? 'Ant.' : 'Anterior'}
            </AppButton>
            {visiblePageNumbers.map((pageNumber, index) => {
              const previous = visiblePageNumbers[index - 1];
              const showGap = previous && pageNumber - previous > 1;

              return (
                <span key={pageNumber} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {showGap && <span style={{ fontSize: 12, color: MUTED }}>...</span>}
                  <AppButton
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{
                      minWidth: isMobile ? 30 : 34,
                      minHeight: isMobile ? 30 : 34,
                      padding: isMobile ? '0 8px' : '0 10px',
                      borderRadius: 8,
                      background: safePage === pageNumber ? '#eef2f1' : CANVAS,
                      borderColor: safePage === pageNumber ? GREEN_HAIRLINE : color.borderTint,
                      color: safePage === pageNumber ? INK : MUTED,
                      fontWeight: safePage === pageNumber ? 700 : 600,
                    }}
                  >
                    {pageNumber}
                  </AppButton>
                </span>
              );
            })}
            <AppButton
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setCurrentPage(page => Math.min(pageCount, page + 1))}
              disabled={safePage === pageCount}
              aria-label="Página siguiente"
              icon={!isMobile ? <ChevronRight size={14} /> : undefined}
              style={{
                minWidth: isMobile ? 34 : 92,
                minHeight: isMobile ? 30 : 34,
                padding: isMobile ? '0 10px' : '0 12px',
                borderRadius: 8,
                color: safePage === pageCount ? '#98a2b3' : INK,
              }}
            >
              {isMobile ? 'Sig.' : 'Siguiente'}
            </AppButton>
          </div>
        )}
      </div>
      {showViewOptions && (
        <>
          <div onClick={() => setShowViewOptions(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 280 }} />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="arrivals-view-drawer-title"
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(320px, 85vw)',
              background: '#fbfbfc', boxShadow: '-8px 0 32px rgba(16,24,40,0.10)',
              zIndex: 281, display: 'flex', flexDirection: 'column',
              animation: 'slideInRight 0.2s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <div style={{ padding: '18px 20px', borderBottom: `1px solid ${HAIRLINE}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <h3 id="arrivals-view-drawer-title" style={{ margin: 0, fontSize: 15, fontWeight: 700, color: INK }}>Ajustes de vista</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: MUTED }}>Configurá el modo de vista de arribos.</p>
              </div>
              <AppButton aria-label="Cerrar" title="Cerrar" variant="secondary" size="sm" onClick={() => setShowViewOptions(false)} icon={<X size={14} />} />
            </div>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${HAIRLINE}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Modo de vista</div>
              <div style={{ display: 'flex', background: '#f2f4f7', borderRadius: 8, padding: 3 }}>
                <button
                  type="button"
                  onClick={() => setIsFlatView(false)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 12px', fontSize: 12, fontWeight: 600, borderRadius: 6,
                    border: 'none', cursor: 'pointer',
                    background: !isFlatView ? CANVAS : 'transparent',
                    color: !isFlatView ? INK : MUTED,
                    boxShadow: !isFlatView ? '0 1px 3px rgba(16,24,40,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <FolderOpen size={13} /> Agrupada
                </button>
                <button
                  type="button"
                  onClick={() => setIsFlatView(true)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 12px', fontSize: 12, fontWeight: 600, borderRadius: 6,
                    border: 'none', cursor: 'pointer',
                    background: isFlatView ? CANVAS : 'transparent',
                    color: isFlatView ? INK : MUTED,
                    boxShadow: isFlatView ? '0 1px 3px rgba(16,24,40,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Layers size={13} /> Plana
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
