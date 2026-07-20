import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Clock, AlertTriangle, X, CalendarX2, CalendarDays, List } from 'lucide-react';
import type { ObligacionPago } from './mockData';
import { color, radius } from './theme';
import { useIsMobile } from './ui/use-mobile';
import { AppButton } from './AppButton';
import { AppCalendarPopoverPanel } from './AppCalendarPopoverPanel';
import { FilterToolbar } from './FilterToolbar';
import { ViewModeToggle } from './ViewModeToggle';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { AppSelectContent, AppSelectItem, AppSelectTrigger, Select, SelectValue } from './ui/select';

const INK = color.ink;
const MUTED = color.muted;
const HAIRLINE = color.hairline;
const PARCHMENT = color.parchment;
const GREEN = color.brand;
const CANVAS = color.canvas;

type ViewMode = 'calendar' | 'list';

interface Props {
  pagos: ObligacionPago[];
  today?: Date;
  onToggleEstado?: (id: string) => void;
}

const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const STATUS_FILTER_OPTIONS = [
  { value: 'Todos', label: 'Todos los estados' },
  { value: 'Pendiente de Pago', label: 'Pendiente de pago', color: '#b45309' },
  { value: 'Transferencia Emitida', label: 'Transferencia emitida', color: '#1a7a4a' },
] as const;

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function getStatusColor(pago: ObligacionPago, today: Date) {
  if (pago.estado === 'Transferencia Emitida') return '#1a7a4a';
  const dl = Math.ceil((new Date(pago.vencimiento).getTime() - today.getTime()) / 86400000);
  if (dl < 0) return '#c4001a';
  if (dl <= 7) return '#b45309';
  return '#5b21b6';
}

function getDaysLeft(vencimiento: string, today: Date) {
  return Math.ceil((new Date(vencimiento).getTime() - today.getTime()) / 86400000);
}

/* ── Detail Panel (shared between desktop side panel and mobile bottom sheet) ── */
function DetailPanel({ pagos, selectedDate, today, onToggleEstado, onClose }: {
  pagos: ObligacionPago[];
  selectedDate: string;
  today: Date;
  onToggleEstado?: (id: string) => void;
  onClose: () => void;
}) {
  const dl = getDaysLeft(selectedDate, today);
  const isOverdue = dl < 0;
  const isCritical = dl >= 0 && dl <= 7;

  if (pagos.length === 0) {
    return (
      <div style={{ position: 'relative', flex: 1, minHeight: 300, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <button onClick={onClose} aria-label="Cerrar detalle" style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: CANVAS, color: MUTED, display: 'grid', placeItems: 'center', cursor: 'pointer' }}><X size={14} /></button>
        <span style={{ width: 48, height: 48, borderRadius: 14, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, display: 'grid', placeItems: 'center', color: MUTED, marginBottom: 14 }}><CalendarX2 size={22} /></span>
        <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>Sin vencimientos este día</div>
        <div style={{ maxWidth: 220, marginTop: 5, fontSize: 12, color: MUTED, lineHeight: 1.5 }}>No hay obligaciones que coincidan con los filtros activos para esta fecha.</div>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${HAIRLINE}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: isOverdue ? '#c4001a' : isCritical ? '#b45309' : '#5b21b6',
          }}>
            {isOverdue ? `Vencido hace ${Math.abs(dl)} días` : dl === 0 ? 'Hoy' : `En ${dl} días`}
          </span>
        </div>
        <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: CANVAS, color: MUTED, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={14} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {pagos.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 13 }}>Sin pagos para esta fecha.</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {pagos.map(p => {
              const isPaid = p.estado === 'Transferencia Emitida';
              return (
                <div key={p.id} style={{
                  padding: '12px 14px', borderRadius: radius.md,
                  background: isPaid ? 'rgba(26,122,74,0.03)' : PARCHMENT,
                  border: `1px solid ${isPaid ? 'rgba(26,122,74,0.15)' : HAIRLINE}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: getStatusColor(p, today), flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{p.carpetaNumero}</span>
                      </div>
                      {p.subcarpetaNumero && <div style={{ fontSize: 11, color: MUTED, marginBottom: 4, paddingLeft: 14 }}>{p.subcarpetaNumero}</div>}
                      <div style={{ fontSize: 12, color: MUTED, paddingLeft: 14 }}>{p.proveedor}</div>
                      <div style={{ fontSize: 11, color: MUTED, paddingLeft: 14, marginTop: 2 }}>{p.tipo}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: INK, fontVariantNumeric: 'tabular-nums' }}>
                        {p.moneda} {p.importe.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                        ≈ ARS {(p.importeARS / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${HAIRLINE}`, display: 'flex', justifyContent: 'flex-end' }}>
                    {isPaid ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#1a7a4a', fontWeight: 600 }}>
                        <CheckCircle size={13} /> Transferencia emitida
                      </span>
                    ) : onToggleEstado ? (
                      <AppButton onClick={() => onToggleEstado(p.id)} size="xs" variant="success-soft">
                        Marcar como pagado
                      </AppButton>
                    ) : (
                      <span style={{ fontSize: 12, color: '#b45309', fontWeight: 600 }}>Pendiente de pago</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function SidebarStatePanel({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <>
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${HAIRLINE}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{title}</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        <div style={{ minHeight: 248, borderRadius: radius.md, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ width: 48, height: 48, borderRadius: 14, background: CANVAS, border: `1px solid ${HAIRLINE}`, display: 'grid', placeItems: 'center', color: MUTED, marginBottom: 14 }}>{icon}</span>
          <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{title}</div>
          <div style={{ maxWidth: 220, marginTop: 5, fontSize: 12, color: MUTED, lineHeight: 1.5 }}>{description}</div>
        </div>
      </div>
    </>
  );
}

export function VencimientosCalendar({ pagos, today = new Date('2026-05-28'), onToggleEstado }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | ObligacionPago['estado']>('Todos');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [listPage, setListPage] = useState(1);
  const [availableHeight, setAvailableHeight] = useState(720);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  const types = useMemo(() => ['Todos', ...Array.from(new Set(pagos.map(p => p.tipo)))], [pagos]);
  const filteredPagos = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('es');
    return pagos.filter(p => {
      const matchesSearch = !term || [p.carpetaNumero, p.subcarpetaNumero, p.proveedor, p.tipo].some(value => value?.toLocaleLowerCase('es').includes(term));
      return matchesSearch && (statusFilter === 'Todos' || p.estado === statusFilter) && (typeFilter === 'Todos' || p.tipo === typeFilter);
    });
  }, [pagos, search, statusFilter, typeFilter]);

  useEffect(() => {
    const measure = () => {
      const top = rootRef.current?.getBoundingClientRect().top ?? 0;
      setAvailableHeight(Math.max(420, window.innerHeight - top - 24));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => setListPage(1), [search, statusFilter, typeFilter, viewMode]);

  const pagosByDate = useMemo(() => {
    const map: Record<string, ObligacionPago[]> = {};
    filteredPagos.forEach(p => {
      if (!map[p.vencimiento]) map[p.vencimiento] = [];
      map[p.vencimiento].push(p);
    });
    return map;
  }, [filteredPagos]);

  useEffect(() => {
    if (selectedDate && !pagosByDate[selectedDate]) {
      setSelectedDate(null);
      setMobileSheetOpen(false);
    }
  }, [pagosByDate, selectedDate]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
  const calendarWeeks = Math.ceil((firstDay + daysInMonth) / 7);
  const todayStr = formatDate(today);
  const currentCalendarDate = useMemo(() => new Date(currentYear, currentMonth, 1), [currentMonth, currentYear]);
  const minCalendarYear = today.getFullYear() - 3;
  const maxCalendarYear = today.getFullYear() + 3;
  const rootPanelHeight = Math.max(isMobile ? 420 : 520, availableHeight);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };
  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleSelectDate = (dateStr: string) => {
    if (selectedDate === dateStr) {
      setSelectedDate(null);
      setMobileSheetOpen(false);
    } else {
      setSelectedDate(dateStr);
      if (isMobile) setMobileSheetOpen(true);
    }
  };

  const handleCloseDetail = () => {
    setSelectedDate(null);
    setMobileSheetOpen(false);
  };

  const sortedPagos = useMemo(() => {
    return [...filteredPagos].sort((a, b) => new Date(a.vencimiento).getTime() - new Date(b.vencimiento).getTime());
  }, [filteredPagos]);

  const groupedPagos = useMemo(() => {
    const groups: Array<{ date: string; items: ObligacionPago[] }> = [];
    let currentGroup: { date: string; items: ObligacionPago[] } | null = null;
    sortedPagos.forEach(p => {
      if (!currentGroup || currentGroup.date !== p.vencimiento) {
        currentGroup = { date: p.vencimiento, items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push(p);
    });
    return groups;
  }, [sortedPagos]);

  const selectedDayPagos = selectedDate ? (pagosByDate[selectedDate] || []) : [];
  const showDesktopSidebar = !isMobile && (filteredPagos.length === 0 || selectedDate !== null);

  const listItemsPerPage = Math.max(4, Math.floor((availableHeight - 210) / 72));
  const listPageCount = Math.max(1, Math.ceil(groupedPagos.length / listItemsPerPage));
  const safeListPage = Math.min(listPage, listPageCount);
  const visibleGroups = groupedPagos.slice((safeListPage - 1) * listItemsPerPage, safeListPage * listItemsPerPage);

  return (
    <div ref={rootRef} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: radius.lg, overflow: 'hidden', background: CANVAS, position: 'relative', display: 'flex', flexDirection: 'column', height: viewMode === 'calendar' ? rootPanelHeight : undefined, minHeight: viewMode === 'calendar' ? rootPanelHeight : undefined }}>
      <div style={{ padding: isMobile ? '10px 12px' : '12px 14px', display: 'grid', gap: 10 }}>
        <FilterToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={isMobile ? 'Buscar carpeta, proveedor o concepto' : 'Buscar por Carpeta, Proveedor o Concepto'}
          searchAriaLabel="Buscar vencimientos"
          searchSize={isMobile ? 'compact' : 'default'}
          options={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          onValueChange={value => setStatusFilter(value as typeof statusFilter)}
          expanded={filtersExpanded}
          onExpandedChange={setFiltersExpanded}
          trailingActions={
            <ViewModeToggle
              value={viewMode}
              onValueChange={setViewMode}
              fullWidth={isMobile}
              options={[
                { value: 'calendar', label: 'Calendario', icon: <CalendarDays size={13} /> },
                { value: 'list', label: 'Lista', icon: <List size={13} /> },
              ]}
            />
          }
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap', width: '100%' }}>
            <label style={{ display: 'grid', gap: 6, minWidth: 0, width: isMobile ? '100%' : undefined, flex: isMobile ? '1 1 100%' : '1 1 220px' }}><span style={{ paddingLeft: 2, fontSize: 11, fontWeight: 600, color: MUTED }}>Concepto de pago</span><Select value={typeFilter} onValueChange={setTypeFilter}><AppSelectTrigger style={{ width: '100%' }}><SelectValue /></AppSelectTrigger><AppSelectContent style={{ zIndex: 400 }}>{types.map(type => <AppSelectItem key={type} value={type}>{type === 'Todos' ? 'Todos los conceptos' : type}</AppSelectItem>)}</AppSelectContent></Select></label>
            {(search || statusFilter !== 'Todos' || typeFilter !== 'Todos') && <button onClick={() => { setSearch(''); setStatusFilter('Todos'); setTypeFilter('Todos'); }} style={{ minHeight: 40, padding: '9px 12px', borderRadius: 9999, border: `1px solid ${HAIRLINE}`, background: CANVAS, color: GREEN, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Limpiar</button>}
          </div>
        </FilterToolbar>
      </div>

      {viewMode === 'calendar' ? (
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Calendar grid (left side) */}
          <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Month navigation */}
            <div style={{
              display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr) 32px', alignItems: 'center',
              gap: isMobile ? 8 : 12, padding: isMobile ? '10px 12px' : '12px 16px', borderBottom: `1px solid ${HAIRLINE}`,
            }}>
              <button onClick={prevMonth} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${HAIRLINE}`, borderRadius: radius.sm, background: CANVAS, cursor: 'pointer', color: INK }}>
                <ChevronLeft size={16} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minWidth: 0, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                <Popover open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" aria-label="Seleccionar mes y año" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0, border: 'none', background: 'transparent', minWidth: 0, cursor: 'pointer', color: INK }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: INK, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{MONTHS_ES[currentMonth]} {currentYear}</span>
                      <ChevronDown size={14} color={monthPickerOpen ? GREEN : MUTED} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align={isMobile ? 'start' : 'center'} className="w-auto rounded-2xl border-[#eaecf0] bg-white p-0 shadow-xl">
                    <AppCalendarPopoverPanel
                      visibleMonth={currentCalendarDate}
                      onVisibleMonthChange={date => {
                        setCurrentMonth(date.getMonth());
                        setCurrentYear(date.getFullYear());
                      }}
                      selectedDate={currentCalendarDate}
                      onSelect={date => {
                        if (!date) return;
                        setCurrentMonth(date.getMonth());
                        setCurrentYear(date.getFullYear());
                        setMonthPickerOpen(false);
                      }}
                      minYear={minCalendarYear}
                      maxYear={maxCalendarYear}
                    />
                  </PopoverContent>
                </Popover>
                <button onClick={goToToday} style={{ minHeight: 32, padding: '6px 12px', borderRadius: 9999, border: `1px solid ${HAIRLINE}`, background: CANVAS, color: GREEN, fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                  Hoy
                </button>
              </div>
              <button onClick={nextMonth} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${HAIRLINE}`, borderRadius: radius.sm, background: CANVAS, cursor: 'pointer', color: INK }}>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Grid */}
            <div style={{ padding: isMobile ? '8px' : '0', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              {filteredPagos.length === 0 ? (
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '28px 20px' }}>
                  <span style={{ width: 48, height: 48, borderRadius: 14, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, display: 'grid', placeItems: 'center', color: MUTED, marginBottom: 14 }}><CalendarX2 size={22} /></span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>Sin resultados para los filtros activos</div>
                  <div style={{ maxWidth: 280, marginTop: 5, fontSize: 12, color: MUTED, lineHeight: 1.5 }}>Ajustá la búsqueda o los filtros para volver a ver vencimientos en el calendario.</div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0, marginBottom: 4 }}>
                    {DAYS_ES.map(day => (
                      <div key={day} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: MUTED, padding: '6px 0' }}>
                        {day}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: `repeat(${calendarWeeks}, minmax(0, 1fr))`, gridAutoRows: '1fr', gap: 2, flex: 1, minHeight: 0 }}>
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} style={{ minHeight: 0, height: '100%', borderTop: `1px solid ${HAIRLINE}`, borderRight: `1px solid ${HAIRLINE}`, background: '#fafbfd' }} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                      const dayPagos = pagosByDate[dateStr] || [];
                      const isToday = dateStr === todayStr;
                      const isSelected = dateStr === selectedDate;
                      const hasPagos = dayPagos.length > 0;

                      return (
                        <button
                          key={dayNum}
                          onClick={() => handleSelectDate(dateStr)}
                          style={{
                            minHeight: 0,
                            height: '100%',
                            padding: isMobile ? '4px 2px' : '7px 6px',
                            border: isSelected ? `2px solid ${GREEN}` : `1px solid ${HAIRLINE}`,
                            borderRadius: 0,
                            background: isSelected ? 'rgba(26,92,56,0.06)' : isToday ? 'rgba(26,92,56,0.02)' : 'transparent',
                            cursor: hasPagos ? 'pointer' : 'default',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMobile ? 'center' : 'stretch',
                            justifyContent: 'flex-start',
                            gap: 3,
                            transition: 'all 0.12s ease',
                            overflow: 'hidden',
                          }}
                        >
                          <span style={{
                            fontSize: 13,
                            fontWeight: isToday ? 700 : 400,
                            color: isToday ? GREEN : hasPagos ? INK : MUTED,
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isToday ? 'rgba(26,92,56,0.12)' : 'transparent',
                          }}>
                            {dayNum}
                          </span>

                          {hasPagos && (
                            <div style={{ display: 'grid', gap: isMobile ? 3 : 4, minHeight: 0 }}>
                              {dayPagos.slice(0, isMobile ? 1 : 2).map(p => (
                                <span key={p.id} style={{ minWidth: 0, padding: isMobile ? '2px 3px' : '3px 5px', borderRadius: 5, background: getStatusColor(p, today), color: '#fff', fontSize: isMobile ? 8 : 10, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
                                  {isMobile ? p.carpetaNumero : `${p.carpetaNumero} · ${p.moneda} ${p.importe.toLocaleString()}`}
                                </span>
                              ))}
                              {dayPagos.length > (isMobile ? 1 : 2) && <span style={{ fontSize: 9, color: MUTED, textAlign: 'left' }}>+{dayPagos.length - (isMobile ? 1 : 2)} más</span>}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 8, padding: '10px 16px', borderTop: `1px solid ${HAIRLINE}`, background: '#fafbfd' }}>
                    {[
                      { color: '#c4001a', label: 'Vencido' },
                      { color: '#b45309', label: '≤7 días' },
                      { color: '#5b21b6', label: 'Pendiente' },
                      { color: '#1a7a4a', label: 'Pagado' },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.color }} />
                        <span style={{ fontSize: 10, color: MUTED }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {showDesktopSidebar && (
            <div style={{
              width: 320, minWidth: 320, borderLeft: `1px solid ${HAIRLINE}`,
              background: CANVAS, display: 'flex', flexDirection: 'column',
              animation: 'fadeIn 0.15s ease',
            }}>
              {filteredPagos.length === 0 ? (
                <SidebarStatePanel
                  title="Sin resultados"
                  description="No hay vencimientos que coincidan con los filtros activos para esta vista."
                  icon={<CalendarX2 size={22} />}
                />
              ) : selectedDate ? <DetailPanel pagos={selectedDayPagos} selectedDate={selectedDate} today={today} onToggleEstado={onToggleEstado} onClose={handleCloseDetail} /> : null}
            </div>
          )}
        </div>
      ) : (
        /* ── LIST VIEW ──────────────────────────────────────────── */
        <div style={{ maxHeight: Math.max(360, availableHeight - 120), overflowY: 'auto' }}>
          {groupedPagos.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', color: MUTED }}>Sin vencimientos registrados.</div>
          )}
          {visibleGroups.map(group => {
            const dl = getDaysLeft(group.date, today);
            const dateObj = new Date(group.date + 'T12:00:00');
            const isOverdue = dl < 0;
            const isCritical = dl >= 0 && dl <= 7;
            const isToday = dl === 0;

            return (
              <div key={group.date} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <div style={{
                  padding: '10px 16px',
                  background: isOverdue ? 'rgba(196,0,26,0.04)' : isCritical ? 'rgba(180,83,9,0.04)' : '#fafbfd',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                  position: 'sticky', top: 0, zIndex: 2,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isOverdue && <AlertTriangle size={13} color="#c4001a" />}
                    {isCritical && !isOverdue && <Clock size={13} color="#b45309" />}
                    <span style={{ fontSize: 13, fontWeight: 700, color: isOverdue ? '#c4001a' : isCritical ? '#b45309' : INK }}>
                      {isToday ? 'Hoy' : dateObj.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 9999,
                    background: isOverdue ? 'rgba(196,0,26,0.1)' : isCritical ? 'rgba(180,83,9,0.1)' : 'rgba(91,33,182,0.08)',
                    color: isOverdue ? '#c4001a' : isCritical ? '#b45309' : '#5b21b6',
                  }}>
                    {isOverdue ? `Vencido ${Math.abs(dl)}d` : isToday ? 'Hoy' : `en ${dl} días`}
                  </span>
                </div>
                {group.items.map(p => {
                  const isPaid = p.estado === 'Transferencia Emitida';
                  return (
                    <div key={p.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      padding: '10px 16px 10px 28px',
                      background: isPaid ? 'rgba(26,122,74,0.02)' : CANVAS,
                      borderTop: `1px solid ${HAIRLINE}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: getStatusColor(p, today), flexShrink: 0 }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{p.carpetaNumero}</span>
                            {p.subcarpetaNumero && <span style={{ fontSize: 11, color: MUTED }}>({p.subcarpetaNumero})</span>}
                          </div>
                          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{p.proveedor} · {p.tipo}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: INK, fontVariantNumeric: 'tabular-nums' }}>
                          {p.moneda} {p.importe.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>≈ ARS {(p.importeARS / 1000).toFixed(0)}K</div>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        {isPaid ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#1a7a4a', fontWeight: 600 }}>
                            <CheckCircle size={12} /> Pagado
                          </span>
                        ) : onToggleEstado ? (
                          <AppButton onClick={() => onToggleEstado(p.id)} size="xs" variant="success-soft">Pagar</AppButton>
                        ) : (
                          <span style={{ fontSize: 11, color: '#b45309', fontWeight: 600 }}>Pendiente</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {groupedPagos.length > 0 && (
            <div style={{ position: 'sticky', bottom: 0, padding: '10px 16px', borderTop: `1px solid ${HAIRLINE}`, background: '#fafbfd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontSize: 11, color: MUTED }}>{groupedPagos.length} fecha(s) · {filteredPagos.length} vencimiento(s)</span>
              {listPageCount > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => setListPage(page => Math.max(1, page - 1))} disabled={safeListPage === 1} aria-label="Página anterior" style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: CANVAS, color: MUTED, display: 'grid', placeItems: 'center', cursor: safeListPage === 1 ? 'default' : 'pointer', opacity: safeListPage === 1 ? 0.45 : 1 }}><ChevronLeft size={14} /></button>
                  <span style={{ minWidth: 54, textAlign: 'center', fontSize: 11, fontWeight: 600, color: INK }}>{safeListPage} / {listPageCount}</span>
                  <button onClick={() => setListPage(page => Math.min(listPageCount, page + 1))} disabled={safeListPage === listPageCount} aria-label="Página siguiente" style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: CANVAS, color: MUTED, display: 'grid', placeItems: 'center', cursor: safeListPage === listPageCount ? 'default' : 'pointer', opacity: safeListPage === listPageCount ? 0.45 : 1 }}><ChevronRight size={14} /></button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile: Bottom sheet (Google Maps style) */}
      {isMobile && mobileSheetOpen && selectedDate && (
        <>
          <div
            onClick={handleCloseDetail}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 300 }}
          />
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '70vh',
            background: CANVAS,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            boxShadow: '0 -8px 32px rgba(16,24,40,0.12)',
            zIndex: 301,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideUp 0.25s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 9999, background: '#d1d5db' }} />
            </div>
            <DetailPanel
              pagos={selectedDayPagos}
              selectedDate={selectedDate}
              today={today}
              onToggleEstado={onToggleEstado}
              onClose={handleCloseDetail}
            />
          </div>
        </>
      )}
    </div>
  );
}
