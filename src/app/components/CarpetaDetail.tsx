import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, FileText, DollarSign, Upload, Eye, Download, ChevronRight, ChevronDown, Plus, CheckCircle, Landmark, AlertTriangle, X, Pencil, Trash2, Info, Ship, CreditCard, Truck, Plane, Calendar, Package } from 'lucide-react';
import { read, utils, writeFileXLSX } from 'xlsx';
import { getAutoFitGridStyle, getModalPrimaryButtonStyle, getModalSecondaryButtonStyle, getResponsiveTableStyle, getModalShellStyle, modalFooter, modalOverlay, pageActions, pageHeader, pageShell, tableHeadCell, tableHeadRow, tableScrollArea } from './chromeStyles';
import { ARTICULOS_CATALOGO, CARPETAS, DESPACHANTES, getProveedor, getDespachante, getEstadoColor, shouldShowMotherPendingState, type Documento, type Subcarpeta, type Carpeta } from './mockData';
import { NeonBadge, CanalBadge } from './NeonBadge';
import { useIsMobile } from './ui/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AppSelectContent, AppSelectItem, AppSelectTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AppButton } from './AppButton';
import { AppDialog } from './AppDialog';
import { AppInput, FormField } from './FormField';
import { normalizeSearchTerm } from './SearchField';
import { InfoField as Field } from './InfoField';
import { SectionCard as Card } from './SectionCard';
import { FilterToolbar } from './FilterToolbar';
import { WelcomeBanner } from './WelcomeBanner';
import { TransportModeIcon } from './TransportModeIcon';
import { AppPagination } from './AppPagination';
import { color, radius, shipmentTypography } from './theme';

const INK      = '#1d1d1f';
const MUTED    = '#6e6e73';
const PARCHMENT= '#f8fafc';
const HAIRLINE = '#d2d2d7';
const GREEN    = '#1a5c38';
const GREEN_HAIRLINE = 'rgba(26,92,56,0.26)';
const GREEN_HAIRLINE_SOFT = 'rgba(26,92,56,0.16)';
const VIOLET   = '#5b21b6';
const CANVAS   = '#ffffff';
const SHIPMENT_TYPE = shipmentTypography;
const TAB_CONTENT_PADDING = 22;
const DETAIL_TAB_PANEL_PADDING_MOBILE = '14px 12px 18px';
const DETAIL_TAB_PANEL_PADDING_DESKTOP = `16px ${TAB_CONTENT_PADDING}px 20px`;
const DETAIL_TAB_PANEL_GAP = 8;
const DETAIL_TAB_SECTION_GAP = 14;
const DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP = 16;
const DETAIL_TABS_TRIGGER_TONE_STYLE = {
  '--detail-tab-muted': color.ink,
  '--detail-tab-active-bg': color.mintWash,
  '--detail-tab-active-text': color.brand,
} as CSSProperties;
const DETAIL_SECTION_LABEL_STYLE = {
  fontSize: SHIPMENT_TYPE.label,
  lineHeight: 1,
  fontWeight: 700,
  color: MUTED,
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
};
const DETAIL_META_LABEL_STYLE = {
  fontSize: SHIPMENT_TYPE.tableHead,
  lineHeight: 1.1,
  color: MUTED,
  marginBottom: 4,
};
const DETAIL_META_VALUE_STYLE = {
  fontSize: SHIPMENT_TYPE.title,
  lineHeight: '16px',
  fontWeight: 600,
  color: INK,
  fontVariantNumeric: 'tabular-nums' as const,
  whiteSpace: 'nowrap' as const,
};
// Typography contract for this screen:
// h1: page title handled by WelcomeBanner
// h2: modal/dialog titles and dominant success states
// h3: empty states and item-level titles inside sections
// section label: uppercase divider titles between tab blocks
// meta label/value: compact field captions and their values
const DETAIL_TYPE_SCALE = {
  h2: { fontSize: 18, fontWeight: 600, color: INK },
  h3: { fontSize: 16, fontWeight: 600, color: INK },
  itemTitle: { fontSize: 12.5, fontWeight: 600, color: INK },
} as const;
const DESPACHO_TIPO_OPTIONS = ['Despacho Directo', 'ZFI', 'ZFE'] as const;

const CURRENCY_SYMBOLS: Record<string, string> = { USD: 'US$', EUR: '€', ARS: '$' };
function formatMoney(value: number, currency: string) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${symbol} ${value.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
}

function getCanalInlineStyle(canal: 'Pendiente' | 'Verde' | 'Rojo') {
  const tone = canal === 'Rojo' ? '#c4001a' : canal === 'Verde' ? '#1a7a4a' : MUTED;
  return { color: tone, dot: tone, label: canal === 'Pendiente' ? 'Pendiente' : `Canal ${canal}` };
}

function TabEditModal({ title, children, onClose, onSave, saveLabel = 'Guardar cambios' }: { title: string; children: ReactNode; onClose: () => void; onSave: () => void; saveLabel?: string }) {
  return (
    <AppDialog
      open
      onOpenChange={open => { if (!open) onClose(); }}
      title={title}
      onSubmit={event => {
        event.preventDefault();
        onSave();
      }}
      footer={(
        <>
          <AppButton type="button" variant="secondary" onClick={onClose}>Cancelar</AppButton>
          <AppButton type="submit">{saveLabel}</AppButton>
        </>
      )}
    >
      <div style={{ display: 'grid', gap: 14 }}>{children}</div>
    </AppDialog>
  );
}

type Tab = 'general' | 'articulos' | 'produccion' | 'subcarpetas' | 'documentos' | 'aduana' | 'costeo' | 'pagos';
type CarpetaDetailRole = 'operator' | 'director' | 'commercial' | 'treasury' | 'warehouse' | 'dispatcher' | 'admin';
type RolePermissions = {
  canEditOriginalOc: boolean;
  canEditProduccion: boolean;
  canEditAduana: boolean;
  canEditCosteo: boolean;
  canEditPagos: boolean;
  canViewProduccion: boolean;
  canViewCosteo: boolean;
  canViewPagos: boolean;
  canViewImportes: boolean;
};

const SUB_LETTERS = ['A', 'B', 'C'] as const;
type SubLetter = typeof SUB_LETTERS[number];

const ROLE_PERMISSIONS: Record<CarpetaDetailRole, RolePermissions> = {
  operator:   { canEditOriginalOc: true,  canEditProduccion: true,  canEditAduana: true,  canEditCosteo: true,  canEditPagos: false, canViewProduccion: true,  canViewCosteo: true,  canViewPagos: true,  canViewImportes: true },
  director:   { canEditOriginalOc: false, canEditProduccion: false, canEditAduana: false, canEditCosteo: false, canEditPagos: false, canViewProduccion: true,  canViewCosteo: true,  canViewPagos: true,  canViewImportes: true },
  commercial: { canEditOriginalOc: false, canEditProduccion: false, canEditAduana: false, canEditCosteo: false, canEditPagos: false, canViewProduccion: true,  canViewCosteo: false, canViewPagos: false, canViewImportes: false },
  treasury:   { canEditOriginalOc: false, canEditProduccion: false, canEditAduana: false, canEditCosteo: false, canEditPagos: true,  canViewProduccion: true,  canViewCosteo: true,  canViewPagos: true,  canViewImportes: true },
  warehouse:  { canEditOriginalOc: false, canEditProduccion: false, canEditAduana: false, canEditCosteo: false, canEditPagos: false, canViewProduccion: true,  canViewCosteo: false, canViewPagos: false, canViewImportes: false },
  dispatcher: { canEditOriginalOc: false, canEditProduccion: false, canEditAduana: true,  canEditCosteo: false, canEditPagos: false, canViewProduccion: false, canViewCosteo: false, canViewPagos: false, canViewImportes: false },
  admin:      { canEditOriginalOc: false, canEditProduccion: false, canEditAduana: false, canEditCosteo: false, canEditPagos: false, canViewProduccion: true,  canViewCosteo: true,  canViewPagos: true,  canViewImportes: true },
};

function assignedFromSubcarpetas(articuloId: string, subcarpetas: Subcarpeta[]) {
  return subcarpetas.reduce((total, subcarpeta) => total + subcarpeta.articulosEmbarque.reduce((subTotal, articulo) => articulo.articuloId === articuloId ? subTotal + articulo.cantidad : subTotal, 0), 0);
}

function normalizeCarpetaState(carpeta: Carpeta): Carpeta {
  const articulos = carpeta.articulos.map(articulo => ({
    ...articulo,
    cantidadAsignada: assignedFromSubcarpetas(articulo.id, carpeta.subcarpetas),
  }));

  return {
    ...carpeta,
    articulos,
  };
}

interface Props { carpetaId: string; onBack: () => void; readonly?: boolean; carpetasList?: Carpeta[]; hideImportes?: boolean; initialTab?: Tab; onUpdateCarpeta?: (carpeta: Carpeta) => void; role?: CarpetaDetailRole; onSelectSubcarpeta?: (subId: string, detailTab?: 'transito' | 'aduana' | 'costeo' | 'documentos' | 'recepcion') => void; }
export function CarpetaDetail({ carpetaId, onBack, readonly = false, carpetasList, hideImportes = false, initialTab = 'general', onUpdateCarpeta, role = 'operator', onSelectSubcarpeta }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [draftCarpeta, setDraftCarpeta] = useState<Carpeta | null>(null);
  const isMobile = useIsMobile();

  const sourceCarpeta = (carpetasList ?? CARPETAS).find(c => c.id === carpetaId);
  if (!sourceCarpeta) return <div style={{ padding: 64, textAlign: 'center', color: MUTED }}>Carpeta no encontrada.</div>;

  const carpeta = normalizeCarpetaState(draftCarpeta ?? sourceCarpeta);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, carpetaId]);

  useEffect(() => {
    setDraftCarpeta(normalizeCarpetaState(sourceCarpeta));
  }, [sourceCarpeta, carpetaId]);

  const commitCarpeta = (updater: (current: Carpeta) => Carpeta) => {
    setDraftCarpeta(previous => {
      const base = normalizeCarpetaState(previous ?? sourceCarpeta);
      const next = normalizeCarpetaState(updater(base));
      onUpdateCarpeta?.(next);
      return next;
    });
  };

  const subs = carpeta.subcarpetas;
  const proveedor = getProveedor(carpeta.proveedorId);
  const hasShipments = subs.length > 0;
  const isClosed = hasShipments && subs.every(sub => sub.estado === 'En Stock');
  const permissions = ROLE_PERMISSIONS[role];
  const canEditOriginalOc = !readonly && permissions.canEditOriginalOc && !hasShipments && !isClosed;
  const canEditProduccion = !readonly && permissions.canEditProduccion;
  const canEditAduana = !readonly && permissions.canEditAduana;
  const canEditCosteo = !readonly && permissions.canEditCosteo;
  const canEditPagos = !readonly && permissions.canEditPagos;
  const effectiveHideImportes = hideImportes || !permissions.canViewImportes;
  const confirmationDocuments = (carpeta.documentos ?? []).filter(documento => documento.tipo === 'Confirmación de Pedido');
  const currentConfirmation = confirmationDocuments[confirmationDocuments.length - 1];
  const shipmentCreationAllowed = currentConfirmation?.estadoValidacion === 'Aprobado';
  const shipmentBlockReason = !currentConfirmation
    ? 'Todavía no hay una confirmación de pedido adjunta.'
    : currentConfirmation.estadoValidacion !== 'Aprobado'
      ? `El anexo ${currentConfirmation.nombre} tiene diferencias. Cuando recibas la versión corregida, cargala desde Anexos como nueva versión.`
      : '';
  const ocLockReason = readonly
    ? 'Perfil en solo lectura.'
    : !permissions.canEditOriginalOc
      ? 'Solo Importaciones puede editar la OC original.'
      : hasShipments
        ? 'La OC original queda bloqueada desde la creación del primer embarque.'
      : isClosed
        ? 'La carpeta ya fue recibida en depósito.'
        : null;

  const usedLetters = subs.map(s => s.numero.split('-').pop() as SubLetter);
  const nextLetter = SUB_LETTERS.find(l => !usedLetters.includes(l)) ?? null;
  const allTabs: { id: Tab; label: string }[] = [
    { id: 'general',     label: 'General'                    },
    { id: 'articulos',   label: `Artículos (${carpeta.articulos.length})` },
    { id: 'produccion',  label: 'Proveedor'                  },
    { id: 'subcarpetas', label: `Embarques (${subs.length})` },
    { id: 'aduana',      label: 'Aduana'                     },
    { id: 'costeo',      label: 'Costeo'                     },
    { id: 'documentos',  label: 'Anexos'                     },
    { id: 'pagos',       label: 'Pagos'                      },
  ];
  const tabs = allTabs.filter(t => {
    if (t.id === 'produccion' && !permissions.canViewProduccion) return false;
    if (t.id === 'costeo' && !permissions.canViewCosteo) return false;
    if (t.id === 'pagos' && !permissions.canViewPagos) return false;
    return true;
  });
  const activeTab = tabs.some(item => item.id === tab) ? tab : tabs[0]?.id ?? 'general';

  return (
    <div style={pageShell}>

      {/* ── Back button ──────────────────────────────────────── */}
      <AppButton variant="tertiary" size="md" onClick={onBack} icon={<ArrowLeft size={14} />} style={{ padding: '5px 0', marginBottom: 16, fontWeight: 400 }}>
        Volver al Dashboard
      </AppButton>

      {/* ── Welcome Banner header ─────────────────────────── */}
      <WelcomeBanner
        title={carpeta.numero}
        subtitle={proveedor?.nombre || '—'}
        actions={
          <>
            {!readonly && <AppButton variant="secondary" icon={<Download size={13} />}>Exportar SAP</AppButton>}
          </>
        }
      />

      <Tabs value={activeTab} onValueChange={value => setTab(value as Tab)} className="gap-3">
        <div style={{ position: 'sticky', top: 0, zIndex: 50, marginBottom: 12 }}>
          <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-[16px] border bg-white p-[8px] shadow-none" style={{ borderColor: color.controlBorder, paddingInline: isMobile ? 10 : TAB_CONTENT_PADDING }}>
            {tabs.map(t => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="h-10 flex-none rounded-[10px] border-none px-5 text-[12px] font-semibold whitespace-nowrap text-[var(--detail-tab-muted)] shadow-none data-[state=active]:border-none data-[state=active]:bg-[var(--detail-tab-active-bg)] data-[state=active]:text-[var(--detail-tab-active-text)] data-[state=active]:shadow-none"
                style={DETAIL_TABS_TRIGGER_TONE_STYLE}
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div style={{
          background: CANVAS,
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 4px 18px rgba(16,24,40,0.03)',
        }}>
          <TabsContent value="general">
            <GeneralTab carpeta={carpeta} subs={subs} proveedor={proveedor} hideImportes={effectiveHideImportes} canEditGeneral={canEditOriginalOc} ocLockReason={ocLockReason} onUpdateGeneral={(patch: Partial<Carpeta>) => commitCarpeta(current => ({ ...current, ...patch }))} onSelectSubcarpeta={(subId: string) => { setTab('subcarpetas'); setActiveSub(subId); }} />
          </TabsContent>
          <TabsContent value="articulos">
            <ArticulosTab carpeta={carpeta} hideImportes={effectiveHideImportes} readonly={readonly} canEditOriginalOc={canEditOriginalOc} onUpdateArticulos={(articulos: Carpeta['articulos']) => commitCarpeta(current => ({ ...current, articulos }))} />
          </TabsContent>
          <TabsContent value="subcarpetas">
            <SubcarpetasTab carpeta={carpeta} subs={subs} nextLetter={nextLetter} activeSub={activeSub} setActiveSub={setActiveSub} readonly={readonly} hideImportes={effectiveHideImportes} shipmentCreationAllowed={shipmentCreationAllowed} shipmentBlockReason={shipmentBlockReason} onCreateSubcarpeta={(subcarpeta: Subcarpeta) => commitCarpeta(current => ({ ...current, subcarpetas: [...current.subcarpetas, subcarpeta] }))} onSelectSubcarpeta={onSelectSubcarpeta} />
          </TabsContent>
          <TabsContent value="produccion">
            <ProduccionTab carpeta={carpeta} proveedor={proveedor} editable={canEditProduccion} onUpdateProduccion={(patch: Partial<Carpeta>) => commitCarpeta(current => ({ ...current, ...patch }))} />
          </TabsContent>
          <TabsContent value="aduana">
            <AduanaTab carpeta={carpeta} subs={subs} editable={canEditAduana} hideImportes={effectiveHideImportes} onUpdateSubcarpeta={(subId: string, patch: Partial<Subcarpeta>) => commitCarpeta(current => ({ ...current, subcarpetas: current.subcarpetas.map(sub => sub.id === subId ? { ...sub, ...patch } : sub) }))} onUpdateCarpeta={(patch: Partial<Carpeta>) => commitCarpeta(current => ({ ...current, ...patch }))} onSelectSubcarpeta={onSelectSubcarpeta} />
          </TabsContent>
          <TabsContent value="costeo">
            <CosteoTab carpeta={carpeta} subs={subs} editable={canEditCosteo} hideImportes={effectiveHideImportes} onUpdateSubcarpeta={(subId: string, patch: Partial<Subcarpeta>) => commitCarpeta(current => ({ ...current, subcarpetas: current.subcarpetas.map(sub => sub.id === subId ? { ...sub, ...patch } : sub) }))} onUpdateCosteo={(patch: Partial<Carpeta>) => commitCarpeta(current => ({ ...current, ...patch }))} onSelectSubcarpeta={onSelectSubcarpeta} />
          </TabsContent>
          <TabsContent value="documentos">
            <DocumentosTabV2 carpeta={carpeta} subs={subs} readonly={readonly} role={role} onAddDocumento={(doc: Documento, subId: string | 'madre') => commitCarpeta(current => subId === 'madre' ? ({ ...current, documentos: [...(current.documentos ?? []), doc] }) : ({ ...current, subcarpetas: current.subcarpetas.map(sub => sub.id === subId ? ({ ...sub, documentos: [...sub.documentos, doc] }) : sub) }))} onUpdateCarpeta={onUpdateCarpeta} />
          </TabsContent>
          <TabsContent value="pagos">
            <PagosTab carpeta={carpeta} editable={canEditPagos} onUpdatePagos={(pagosList: any[]) => commitCarpeta(current => ({ ...current, pagos: pagosList }))} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

/* ── Shared primitives ─────────────────────────────────────────────── */

function Input({ label, defaultValue, type = 'text', placeholder, color }: { label: string; defaultValue?: string | number; type?: string; placeholder?: string; color?: string }) {
  return (
    <FormField label={label}>
      <AppInput
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        style={{ width: '100%', padding: '10px 14px', fontSize: 17, fontWeight: 400, color: color || INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 9999, outline: 'none' }}
      />
    </FormField>
  );
}

function TabEmptyPlaceholder({
  title,
  description,
  padding = '4px 16px 16px',
  action,
}: {
  title: string;
  description: ReactNode;
  padding?: string;
  action?: ReactNode;
}) {
  return (
    <div style={{ padding }}>
      <div style={{
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 14,
        background: CANVAS,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
      }}>
        <div style={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: PARCHMENT,
          border: `1px solid ${HAIRLINE}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Info aria-hidden="true" size={20} color={MUTED} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 4px', ...DETAIL_TYPE_SCALE.h3 }}>{title}</h3>
          <p style={{ margin: 0, fontSize: 13.5, color: MUTED, lineHeight: 1.5, maxWidth: 560 }}>{description}</p>
        </div>
        {action ? <div style={{ display: 'flex', justifyContent: 'center' }}>{action}</div> : null}
      </div>
    </div>
  );
}

function TabIntro({
  title,
  subtitle,
  actions,
  overlayActions = false,
}: {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  overlayActions?: boolean;
}) {
  const hasTitle = Boolean(title);
  const hasActions = Boolean(actions);

  if (!hasTitle && !hasActions) return null;

  if (overlayActions && hasTitle && hasActions) {
    return (
      <div style={{ position: 'relative', padding: '2px 0 8px', minHeight: subtitle ? 44 : 22, background: CANVAS }}>
        <div style={{ display: 'grid', gap: 4, paddingRight: 180 }}>
          <span style={DETAIL_SECTION_LABEL_STYLE}>{title}</span>
          {subtitle && <span style={{ fontSize: 12, lineHeight: 1.45, color: MUTED }}>{subtitle}</span>}
        </div>
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          {actions}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2px 0 8px', display: 'flex', alignItems: 'center', justifyContent: hasTitle ? 'space-between' : 'flex-end', gap: 12, flexWrap: 'wrap', background: CANVAS }}>
      {hasTitle && (
        <div style={{ display: 'grid', gap: 4 }}>
          <span style={DETAIL_SECTION_LABEL_STYLE}>{title}</span>
          {subtitle && <span style={{ fontSize: 12, lineHeight: 1.45, color: MUTED }}>{subtitle}</span>}
        </div>
      )}
      {actions}
    </div>
  );
}

function GeneralTab({ carpeta, subs, proveedor, hideImportes, canEditGeneral, ocLockReason, onUpdateGeneral, onSelectSubcarpeta }: any) {
  const isMobile = useIsMobile();
  const [showGeneralEditModal, setShowGeneralEditModal] = useState(false);
  const [generalForm, setGeneralForm] = useState({
    pedidoSAP45: carpeta.pedidoSAP45 || '',
    referenciaProveedor: carpeta.referenciaProveedor || '',
    fechaEmbarqueEst: carpeta.fechaEmbarqueEst || '',
    observaciones: carpeta.observaciones || '',
  });

  useEffect(() => {
    setGeneralForm({
      pedidoSAP45: carpeta.pedidoSAP45 || '',
      referenciaProveedor: carpeta.referenciaProveedor || '',
      fechaEmbarqueEst: carpeta.fechaEmbarqueEst || '',
      observaciones: carpeta.observaciones || '',
    });
  }, [carpeta.id, carpeta.pedidoSAP45, carpeta.referenciaProveedor, carpeta.fechaEmbarqueEst, carpeta.observaciones]);

  const setGeneralField = (field: 'pedidoSAP45' | 'referenciaProveedor' | 'fechaEmbarqueEst' | 'observaciones') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setGeneralForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSaveGeneral = () => {
    if (!canEditGeneral) return;
    onUpdateGeneral({
      pedidoSAP45: generalForm.pedidoSAP45.trim(),
      referenciaProveedor: generalForm.referenciaProveedor.trim(),
      fechaEmbarqueEst: generalForm.fechaEmbarqueEst,
      observaciones: generalForm.observaciones.trim(),
    });
    setShowGeneralEditModal(false);
  };

  return (
    <div style={{ display: 'grid', gap: DETAIL_TAB_PANEL_GAP, padding: isMobile ? DETAIL_TAB_PANEL_PADDING_MOBILE : DETAIL_TAB_PANEL_PADDING_DESKTOP }}>
      <TabIntro
        title="Datos generales"
        subtitle="Cabecera comercial, referencia y datos base de la carpeta"
        overlayActions
        actions={canEditGeneral ? (
          <AppButton
            type="button"
            size="md"
            icon={<Pencil size={13} />}
            onClick={() => setShowGeneralEditModal(true)}
          >
            Editar
          </AppButton>
        ) : undefined}
      />
      <div style={{ display: 'grid', gap: 8 }}>
        {!canEditGeneral && ocLockReason && (
          <div style={{ marginBottom: 12, fontSize: 12, color: MUTED }}>
            {ocLockReason}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))', columnGap: 24, rowGap: 18, alignItems: 'start' }}>
          <Field label="N° Carpeta" value={carpeta.numero} />
          {shouldShowMotherPendingState(carpeta) && <Field label="Estado" value="Pendiente de embarque" />}
          <Field label="Fecha O/C" value={carpeta.fechaOC} />
          <Field label="Proveedor" value={proveedor?.nombre || '—'} />
          <Field label="País Origen" value={proveedor?.pais || '—'} />
          <Field label="Pedido SAP Tx.45" value={carpeta.pedidoSAP45 || '—'} />
          <Field label="Incoterm" value={carpeta.incoterm} />
          <Field label="Condición de Pago" value={carpeta.condPago} />
          <Field label="Moneda" value={carpeta.moneda} />
        </div>
      </div>

      <div style={{ display: 'grid', gap: DETAIL_TAB_SECTION_GAP, paddingTop: DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP, borderTop: `1px solid ${GREEN_HAIRLINE_SOFT}` }}>
        <span style={DETAIL_SECTION_LABEL_STYLE}>{hideImportes ? 'Referencia' : 'Montos y referencia'}</span>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))', columnGap: 24, rowGap: 18, alignItems: 'start' }}>
          <Field label="Fecha Embarque Est." value={carpeta.fechaEmbarqueEst || '—'} />
          <Field label="Ref. Proveedor" value={carpeta.referenciaProveedor || '—'} />
          <Field label="Despachante Habitual" value={getDespachante(proveedor?.despachante || '')?.nombre || '—'} />
          {!hideImportes && (
            <div style={{ justifySelf: 'stretch' }}>
              <div style={DETAIL_META_LABEL_STYLE}>Monto Total OC</div>
              <div style={DETAIL_META_VALUE_STYLE}>{carpeta.moneda} {carpeta.montoTotal.toLocaleString('en-US')}</div>
            </div>
          )}
        </div>
        {!hideImportes && subs.length > 0 && (
          <div style={{ marginTop: 18, paddingTop: DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP, borderTop: `1px solid ${HAIRLINE}` }}>
            <div style={{ ...DETAIL_SECTION_LABEL_STYLE, marginBottom: 12 }}>Coeficientes de costo por Apertura</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {subs.map((sub: any) => (
                <div key={sub.id} style={{ padding: '10px 12px', background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10 }}>
                  <div style={{ fontSize: SHIPMENT_TYPE.title, lineHeight: '16px', fontWeight: 600, color: INK, marginBottom: 6 }}>{sub.numero}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Field label="Estimado" value={sub.coeficienteEst ? sub.coeficienteEst.toFixed(2) : '—'} />
                    <Field label="Real" value={sub.coeficienteReal ? sub.coeficienteReal.toFixed(2) : '—'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>



      {showGeneralEditModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 320, background: 'rgba(15, 23, 42, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: 'min(560px, 100%)', maxHeight: '90vh', background: '#fff', border: `1px solid ${HAIRLINE}`, borderRadius: 16, boxShadow: '0 22px 50px rgba(15, 23, 42, 0.22)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${HAIRLINE}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <h2 style={{ margin: 0, ...DETAIL_TYPE_SCALE.h2 }}>Editar datos de cabecera</h2>
              <AppButton type="button" aria-label="Cerrar" title="Cerrar" variant="tertiary" size="sm" onClick={() => setShowGeneralEditModal(false)} icon={<X size={14} color={MUTED} />} style={{ borderRadius: 9999 }} />
            </div>

            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                <FormField label="Pedido SAP Tx.45">
                  <input value={generalForm.pedidoSAP45} onChange={setGeneralField('pedidoSAP45')} placeholder="Ej. 4500012345" style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
                </FormField>
                <FormField label="Referencia proveedor">
                  <input value={generalForm.referenciaProveedor} onChange={setGeneralField('referenciaProveedor')} placeholder="Referencia interna" style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
                </FormField>
              </div>
              <FormField label="Fecha embarque estimada">
                <input type="date" value={generalForm.fechaEmbarqueEst} onChange={setGeneralField('fechaEmbarqueEst')} style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
              </FormField>
              <FormField label="Observaciones">
                <textarea value={generalForm.observaciones} onChange={setGeneralField('observaciones')} rows={4} style={{ width: '100%', padding: '10px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none', resize: 'vertical', lineHeight: 1.5 }} />
              </FormField>
            </div>

            <div style={{ padding: '12px 16px', borderTop: `1px solid ${HAIRLINE}`, display: 'flex', justifyContent: 'flex-end', gap: 8, background: '#fff' }}>
              <AppButton type="button" variant="secondary" size="md" onClick={() => setShowGeneralEditModal(false)}>
                Cancelar
              </AppButton>
              <AppButton type="button" size="md" onClick={handleSaveGeneral}>
                Guardar cambios
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const EMPTY_ART_FORM = { codigoSAP: '', descripcion: '', linea: 'LCA', cantidadSolicitada: '', um: 'Kg', precioUnitario: '' };

function ArticulosTab({ carpeta, readonly, hideImportes, canEditOriginalOc, onUpdateArticulos }: any) {
  const isMobile = useIsMobile();
  const articleCodeInputRef = useRef<HTMLInputElement>(null);
  const [articulos, setArticulos] = useState<any[]>(carpeta.articulos);
  const [showModal, setShowModal] = useState(false);
  const [showMassiveModal, setShowMassiveModal] = useState(false);
  const [massiveText, setMassiveText] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [massiveFileName, setMassiveFileName] = useState('');
  const [form, setForm] = useState(EMPTY_ART_FORM);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'todos' | 'saldo' | 'error'>('todos');
  const [articlePage, setArticlePage] = useState(1);
  const [articlePageSize, setArticlePageSize] = useState(12);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const hasExtendedFields = articulos.some((art: any) => art.ume || art.equivalencia || art.origenCarga || art.estadoValidacion);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  useEffect(() => {
    setArticulos(carpeta.articulos);
  }, [carpeta.articulos]);

  useEffect(() => {
    setArticlePage(1);
  }, [query, filter]);

  const handleDownloadTemplate = () => {
    const worksheet = utils.aoa_to_sheet([
      ['codigoSAP', 'descripcion', 'cantidad', 'um', 'ume', 'equivalencia', 'linea', 'precioUnitario', 'observaciones'],
      ['1000234', 'Papel Estucado Brillante 115g/m2', 50000, 'Kg', 'Kg', 1, 'LCA', 1.42, 'OC completa'],
      ['1000235', 'Papel Estucado Mate 130g/m2', 30000, 'Kg', 'Kg', 1, 'LCA', 1.58, 'Entrega parcial permitida'],
      ['2000118', 'Vinilo Transparente Gloss 100µm', 8000, 'M2', 'Bobina', 125, 'LCA', 4.10, 'Revisar equivalencia logística'],
    ]);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Artículos');
    writeFileXLSX(workbook, 'plantilla-articulos.xlsx');
  };

  const handleProcessFile = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = utils.sheet_to_json<(string | number)[]>(firstSheet, { header: 1, defval: '' });
      const text = rows.map(row => row.map(cell => String(cell ?? '')).join('\t')).join('\n');
      setMassiveText(text);
      setMassiveFileName(file.name);
    } catch (err) {
      console.error(err);
    }
  };

  const parseTextToRows = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return [];

    const firstLineLower = lines[0].toLowerCase();
    const body = (firstLineLower.includes('codigosap') || firstLineLower.includes('codigo') || firstLineLower.includes('descrip'))
      ? lines.slice(1)
      : lines;

    return body.map((line, idx) => {
      const cells = line.split(/\t|;/).map(cell => cell.trim());
      const [codigoSAP = '', descripcion = '', cantidad = '', um = '', ume = '', equivalencia = '', linea = '', precioUnitario = '', observaciones = ''] = cells;
      const cantidadVal = Number(cantidad) || 0;
      const equivVal = Number(equivalencia) || 1;
      const precioVal = Number(precioUnitario) || 0;

      return {
        id: `art_imp_${Date.now()}_${idx}`,
        codigoSAP: codigoSAP || `GEN-${1000 + idx}`,
        descripcion: descripcion || `Artículo importado ${idx + 1}`,
        cantidadSolicitada: cantidadVal > 0 ? cantidadVal : 1000,
        um: um || 'Kg',
        ume: ume || um || 'Kg',
        equivalencia: equivVal,
        linea: linea || 'LCA',
        precioUnitario: precioVal,
        cantidadAsignada: 0,
        origenCarga: 'Masivo',
        estadoValidacion: (codigoSAP && descripcion && cantidadVal > 0) ? 'Válido' : 'Con error',
        observacionesImportacion: observaciones || undefined
      };
    });
  };

  const filteredArticulos = articulos.filter((articulo: any) => {
    const searchText = normalizeSearchTerm(`${articulo.codigoSAP} ${articulo.descripcion}`);
    const matchesQuery = searchText.includes(normalizeSearchTerm(query));
    const saldo = articulo.cantidadSolicitada - articulo.cantidadAsignada;
    const hasError = articulo.estadoValidacion === 'Con error' || articulo.estadoValidacion === 'Duplicado' || articulo.estadoValidacion === 'No se encuentra en el sistema';
    return matchesQuery && (filter === 'todos' || (filter === 'saldo' && saldo !== 0) || (filter === 'error' && hasError));
  });
  const totalArticlePages = Math.max(1, Math.ceil(filteredArticulos.length / articlePageSize));
  const currentArticlePage = Math.min(articlePage, totalArticlePages);
  const articleRangeStart = filteredArticulos.length === 0 ? 0 : (currentArticlePage - 1) * articlePageSize + 1;
  const articleRangeEnd = Math.min(currentArticlePage * articlePageSize, filteredArticulos.length);
  const displayedArticulos = filteredArticulos.slice((currentArticlePage - 1) * articlePageSize, currentArticlePage * articlePageSize);
  useEffect(() => {
    if (articlePage > totalArticlePages) setArticlePage(totalArticlePages);
  }, [articlePage, totalArticlePages]);

  const cols = [
    'Cód. SAP',
    'Descripción',
    'Línea',
    'Cant. Solicitada',
    'U.M.',
    ...(hasExtendedFields ? ['UME', 'Equiv.'] : []),
    ...(hideImportes ? [] : ['Precio Unit.', 'Importe']),
    'Asignado',
    'Saldo Pendiente',
    ...(hasExtendedFields ? ['Origen', 'Validación'] : []),
    ...(canEditOriginalOc ? [''] : []),
  ];

  const canSave = form.codigoSAP.trim() && form.descripcion.trim() && Number(form.cantidadSolicitada) > 0;

  const resetForm = () => {
    setForm(EMPTY_ART_FORM);
    setEditingArticleId(null);
    setShowModal(false);
  };

  const handleSaveArticle = () => {
    const qtyVal = Number(form.cantidadSolicitada);
    const codigoSAP = form.codigoSAP.trim();
    if (!ARTICULOS_CATALOGO.some(articulo => articulo.codigoSAP === codigoSAP)) {
      setToastMessage(`El código SAP ${codigoSAP} no existe en el catálogo de artículos.`);
      return;
    }
    if (articulos.some((articulo: any) => articulo.codigoSAP === codigoSAP && articulo.id !== editingArticleId)) {
      setToastMessage(`El artículo ${codigoSAP} ya está agregado en esta carpeta.`);
      return;
    }
    if (editingArticleId) {
      const art = articulos.find((a: any) => a.id === editingArticleId);
      if (art && qtyVal < art.cantidadAsignada) {
        setToastMessage(`No se puede reducir la cantidad por debajo de lo ya asignado (${art.cantidadAsignada.toLocaleString()}) para el artículo ${art.codigoSAP}.`);
        return;
      }
    }

    const articlePayload = {
      id: editingArticleId ?? `art_${Date.now()}`,
      codigoSAP,
      descripcion: form.descripcion.trim(),
      linea: form.linea,
      cantidadSolicitada: qtyVal,
      um: form.um,
      precioUnitario: Number(form.precioUnitario) || 0,
      cantidadAsignada: editingArticleId ? (articulos.find((a: any) => a.id === editingArticleId)?.cantidadAsignada ?? 0) : 0,
    };

    const nextArticulos = editingArticleId
      ? articulos.map((articulo: any) => articulo.id === editingArticleId ? { ...articulo, ...articlePayload } : articulo)
      : [...articulos, articlePayload];

    setArticulos(nextArticulos);
    onUpdateArticulos(nextArticulos);
    if (editingArticleId) {
      resetForm();
      return;
    }

    setForm(EMPTY_ART_FORM);
    setToastMessage(`Artículo ${articlePayload.codigoSAP} agregado. Podés continuar con el siguiente.`);
    requestAnimationFrame(() => articleCodeInputRef.current?.focus());
  };

  const handleEditArticle = (articulo: any) => {
    setShowMassiveModal(false);
    setEditingArticleId(articulo.id);
    setForm({
      codigoSAP: articulo.codigoSAP,
      descripcion: articulo.descripcion,
      linea: articulo.linea,
      cantidadSolicitada: String(articulo.cantidadSolicitada),
      um: articulo.um,
      precioUnitario: String(articulo.precioUnitario ?? ''),
    });
    setShowModal(true);
  };

  const handleDeleteArticle = (articleId: string) => {
    const art = articulos.find((a: any) => a.id === articleId);
    if (art && art.cantidadAsignada > 0) {
      setToastMessage(`No se puede eliminar el artículo ${art.codigoSAP} porque tiene ${art.cantidadAsignada.toLocaleString()} unidades asignadas a embarques.`);
      return;
    }
    const nextArticulos = articulos.filter((articulo: any) => articulo.id !== articleId);
    setArticulos(nextArticulos);
    onUpdateArticulos(nextArticulos);
  };

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  const articlePanelPadding = isMobile ? 16 : 22;
  const articleHeaderPadding = isMobile ? `18px ${articlePanelPadding}px 18px` : `20px ${articlePanelPadding}px 18px`;
  const articleFooterPadding = isMobile ? `14px ${articlePanelPadding}px 22px` : `14px ${articlePanelPadding}px 24px`;

  return (
    <div style={{ background: CANVAS, display: 'flex', flexDirection: 'column' }}>
      {/* Empty state */}
      {articulos.length === 0 ? (
        <div style={{ padding: '64px 32px', textAlign: 'center', background: CANVAS }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <Package size={32} style={{ color: MUTED }} />
          </div>
          <div style={{ ...DETAIL_TYPE_SCALE.h3, marginBottom: 6 }}>Sin artículos cargados</div>
          <div style={{ fontSize: 14, color: MUTED, marginBottom: 24 }}>Esta carpeta aún no tiene artículos asociados.</div>
          {canEditOriginalOc && (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <AppButton variant="secondary" onClick={() => { setShowModal(false); setEditingArticleId(null); setMassiveText(''); setMassiveFileName(''); setShowMassiveModal(true); }} icon={<Upload aria-hidden="true" size={14} />}>
                Carga masiva
              </AppButton>
              <AppButton onClick={() => { setShowMassiveModal(false); setForm(EMPTY_ART_FORM); setEditingArticleId(null); setShowModal(true); }} icon={<Plus aria-hidden="true" size={14} />}>
                Agregar primer ítem
              </AppButton>
            </div>
          )}
        </div>
      ) : (
        <>
          <div style={{ overflow: 'hidden', background: CANVAS }}>
            <div style={{ padding: articleHeaderPadding, borderBottom: `1px solid ${HAIRLINE}`, background: CANVAS, display: 'grid', gap: DETAIL_TAB_PANEL_GAP }}>
              <TabIntro title="Artículos" />
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) auto', alignItems: 'center', gap: 12 }}>
                <div style={{ minWidth: 0, maxWidth: isMobile ? '100%' : 620, opacity: 0.9 }}>
                  <FilterToolbar search={query} onSearchChange={setQuery} searchPlaceholder="Buscar por código o descripción" searchAriaLabel="Buscar artículos" options={[{ value: 'todos', label: 'Todos' }, { value: 'saldo', label: 'Con saldo' }, { value: 'error', label: 'Con error' }]} value={filter} onValueChange={setFilter} />
                </div>
                {canEditOriginalOc && (
                  <div style={{ display: 'flex', gap: 8, justifyContent: isMobile ? 'stretch' : 'flex-end', flexWrap: 'wrap' }}>
                    <AppButton size="md" variant="secondary" onClick={() => { setShowModal(false); setEditingArticleId(null); setMassiveText(''); setMassiveFileName(''); setShowMassiveModal(true); }} icon={<Upload aria-hidden="true" size={14} />}>
                      Carga masiva
                    </AppButton>
                    <AppButton size="md" onClick={() => { setShowMassiveModal(false); setForm(EMPTY_ART_FORM); setEditingArticleId(null); setShowModal(true); }} icon={<Plus aria-hidden="true" size={14} />}>
                      Agregar ítem
                    </AppButton>
                  </div>
                )}
              </div>
            </div>

            {filteredArticulos.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 14 }}>No hay artículos que coincidan con la búsqueda.</div>
            ) : isMobile ? (
              <div>
                {displayedArticulos.map((a: any, i: number) => {
                  const saldo = a.cantidadSolicitada - a.cantidadAsignada;
                  const pct = a.cantidadSolicitada > 0 ? Math.min(100, (a.cantidadAsignada / a.cantidadSolicitada) * 100) : 0;
                  const expanded = expandedArticleId === a.id;
                  const missingInSap = a.estadoValidacion === 'No se encuentra en el sistema';
                  return (
                    <article key={a.id} style={{ borderBottom: i < displayedArticulos.length - 1 ? `1px solid ${HAIRLINE}` : 'none', borderLeft: missingInSap ? '3px solid #b45309' : '3px solid transparent' }}>
                      <button onClick={() => setExpandedArticleId(expanded ? null : a.id)} aria-expanded={expanded} style={{ width: '100%', minHeight: 48, padding: `16px ${articlePanelPadding}px`, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 12, textAlign: 'left', background: missingInSap ? '#fff7ed' : CANVAS, border: 'none', cursor: 'pointer' }}>
                        <span style={{ minWidth: 0 }}>
                          <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: INK }}>{a.codigoSAP}</span>
                          <span style={{ display: 'block', marginTop: 2, fontSize: 14, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.descripcion}</span>
                          {missingInSap && <span style={{ display: 'block', marginTop: 5, fontSize: 11, fontWeight: 700, color: '#b45309' }}>No se encuentra en el sistema</span>}
                          <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                            <span><span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: MUTED }}>SOLICITADO</span><span style={{ display: 'block', marginTop: 2, fontSize: 13, color: INK }}>{a.cantidadSolicitada.toLocaleString()} {a.um}</span></span>
                            <span><span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: MUTED }}>PENDIENTE</span><span style={{ display: 'block', marginTop: 2, fontSize: 13, fontWeight: 700, color: saldo === 0 ? '#1a7a4a' : '#b45309' }}>{saldo.toLocaleString()} {a.um}</span></span>
                          </span>
                          <span style={{ display: 'block', height: 4, marginTop: 12, borderRadius: 9999, background: HAIRLINE, overflow: 'hidden' }}><span style={{ display: 'block', width: `${pct}%`, height: '100%', background: pct === 100 ? '#1a7a4a' : '#b45309' }} /></span>
                        </span>
                        <ChevronDown aria-hidden="true" size={18} style={{ color: MUTED, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
                      </button>
                      {expanded && (
                        <div style={{ padding: `0 ${articlePanelPadding}px 16px`, background: '#fafbfd' }}>
                          <div style={{ paddingTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, borderTop: `1px solid ${HAIRLINE}` }}>
                            <Field label="Línea" value={a.linea || '—'} /><Field label="Asignado" value={`${a.cantidadAsignada.toLocaleString()} ${a.um}`} />
                            {a.ume && <Field label="UME" value={a.ume} />}{a.equivalencia && <Field label="Equivalencia" value={a.equivalencia} />}
                            {!hideImportes && <><Field label="Precio unitario" value={a.precioUnitario.toFixed(2)} /><Field label="Importe" value={(a.cantidadSolicitada * a.precioUnitario).toLocaleString()} /></>}
                            {a.origenCarga && <Field label="Origen" value={a.origenCarga} />}{a.estadoValidacion && <Field label="Validación" value={a.estadoValidacion} />}
                          </div>
                          {a.observacionesImportacion && <div style={{ marginTop: 12, fontSize: 13, color: '#b45309' }}>{a.observacionesImportacion}</div>}
                          {canEditOriginalOc && (
                            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                              <AppButton variant="secondary" size="sm" onClick={() => handleEditArticle(a)} icon={<Pencil aria-hidden="true" size={12} />}>
                                Editar
                              </AppButton>
                              <AppButton variant="danger-soft" size="sm" onClick={() => handleDeleteArticle(a.id)} icon={<Trash2 aria-hidden="true" size={12} />}>
                                Eliminar
                              </AppButton>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div>
                {displayedArticulos.map((a: any, i: number) => {
                  const saldo = a.cantidadSolicitada - a.cantidadAsignada;
                  const pct = a.cantidadSolicitada > 0 ? Math.min(100, (a.cantidadAsignada / a.cantidadSolicitada) * 100) : 0;
                  const expanded = expandedArticleId === a.id;
                  const missingInSap = a.estadoValidacion === 'No se encuentra en el sistema';
                  return (
                    <article key={a.id} style={{ borderBottom: i < displayedArticulos.length - 1 ? `1px solid ${HAIRLINE}` : 'none', borderLeft: missingInSap ? '3px solid #b45309' : '3px solid transparent', background: missingInSap ? '#fff7ed' : CANVAS }}>
                      <button onClick={() => setExpandedArticleId(expanded ? null : a.id)} aria-expanded={expanded} style={{ width: '100%', padding: `14px ${articlePanelPadding}px`, display: 'grid', gridTemplateColumns: 'minmax(220px, 1.4fr) minmax(0, 1fr) auto', gap: 18, alignItems: 'center', textAlign: 'left', background: missingInSap ? '#fff7ed' : CANVAS, border: 'none', cursor: 'pointer' }}>
                        <span style={{ minWidth: 0 }}>
                          <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: INK }}>{a.codigoSAP}</span>
                          <span style={{ display: 'block', marginTop: 2, fontSize: 13, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.descripcion}</span>
                        </span>
                        <span style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, minWidth: 0 }}>
                          <span><span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.04em' }}>SOLICITADO</span><span style={{ display: 'block', marginTop: 3, fontSize: 13, color: INK, fontVariantNumeric: 'tabular-nums' }}>{a.cantidadSolicitada.toLocaleString()} {a.um}</span></span>
                          <span><span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.04em' }}>ASIGNADO</span><span style={{ display: 'block', marginTop: 3, fontSize: 13, color: INK, fontVariantNumeric: 'tabular-nums' }}>{a.cantidadAsignada.toLocaleString()} {a.um}</span></span>
                          <span><span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.04em' }}>SALDO</span><span style={{ display: 'block', marginTop: 3, fontSize: 13, fontWeight: 700, color: saldo === 0 ? '#1a7a4a' : saldo > 0 ? '#b45309' : '#c4001a', fontVariantNumeric: 'tabular-nums' }}>{saldo.toLocaleString()} {a.um}</span></span>
                          <span><span style={{ display: 'block', fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.04em' }}>VALIDACIÓN</span><span style={{ display: 'block', marginTop: 3, fontSize: 12, fontWeight: missingInSap ? 700 : 400, color: a.estadoValidacion === 'Con error' ? '#c4001a' : missingInSap ? '#b45309' : MUTED }}>{a.estadoValidacion || '—'}</span></span>
                        </span>
                        <ChevronDown aria-hidden="true" size={18} style={{ color: MUTED, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
                      </button>
                      {expanded && (
                        <div style={{ padding: `0 ${articlePanelPadding}px 16px`, background: '#fafbfd' }}>
                          <div style={{ height: 4, borderRadius: 9999, background: HAIRLINE, overflow: 'hidden', marginBottom: 14 }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#1a7a4a' : '#b45309' }} />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14, borderTop: `1px solid ${HAIRLINE}`, paddingTop: 14 }}>
                            <Field label="Línea" value={a.linea || '—'} />
                            <Field label="Asignado" value={`${a.cantidadAsignada.toLocaleString()} ${a.um}`} />
                            {a.ume ? <Field label="UME" value={a.ume} /> : <div />}
                            {a.equivalencia ? <Field label="Equivalencia" value={a.equivalencia} /> : <div />}
                            {!hideImportes ? <Field label="Precio unitario" value={a.precioUnitario.toFixed(2)} /> : <div />}
                            {!hideImportes ? <Field label="Importe" value={(a.cantidadSolicitada * a.precioUnitario).toLocaleString()} /> : <div />}
                            {a.origenCarga ? <Field label="Origen" value={a.origenCarga} /> : <div />}
                            {a.estadoValidacion ? <Field label="Validación" value={a.estadoValidacion} /> : <div />}
                          </div>
                          {a.observacionesImportacion && <div style={{ marginTop: 12, fontSize: 13, color: '#b45309' }}>{a.observacionesImportacion}</div>}
                          {canEditOriginalOc && (
                            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                              <AppButton variant="secondary" size="sm" onClick={() => handleEditArticle(a)} icon={<Pencil aria-hidden="true" size={12} />}>
                                Editar
                              </AppButton>
                              <AppButton variant="danger-soft" size="sm" onClick={() => handleDeleteArticle(a.id)} icon={<Trash2 aria-hidden="true" size={12} />}>
                                Eliminar
                              </AppButton>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
          <div style={{ minHeight: 48, padding: articleFooterPadding, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontSize: 12, color: MUTED }}>
            <span>Mostrando {articleRangeStart}-{articleRangeEnd} de {filteredArticulos.length} artículos</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span>Filas</span>
                <select value={articlePageSize} onChange={event => { setArticlePageSize(Number(event.target.value)); setArticlePage(1); }} aria-label="Artículos por página" style={{ minHeight: 32, padding: '5px 26px 5px 8px', border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: CANVAS, color: INK, fontSize: 12 }}>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </label>
              <div style={{ margin: '-16px 0' }}>
                <AppPagination page={currentArticlePage} pageCount={totalArticlePages} onChange={setArticlePage} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && createPortal(
        <div role="dialog" aria-modal="true" aria-labelledby="article-dialog-title" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', boxSizing: 'border-box' }}>
          <div style={{ background: CANVAS, borderRadius: 20, width: 'calc(100% - 32px)', maxWidth: 500, maxHeight: 'calc(100dvh - 32px)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px 18px', borderBottom: `1px solid ${HAIRLINE}` }}>
              <div>
                <h2 id="article-dialog-title" style={{ margin: 0, ...DETAIL_TYPE_SCALE.h2 }}>{editingArticleId ? 'Editar artículo' : 'Carga manual de artículos'}</h2>
                {!editingArticleId && <div style={{ marginTop: 4, fontSize: 12, color: MUTED }}>{articulos.length} artículos cargados · agregá todos los ítems sin cerrar esta ventana</div>}
              </div>
              <AppButton aria-label="Cerrar" title="Cerrar" variant="tertiary" size="sm" onClick={resetForm} icon={<X size={14} color={MUTED} />} style={{ borderRadius: 9999 }} />
            </div>
            <div style={{ padding: '24px 28px 30px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* SAP + Descripcion */}
              <div style={getAutoFitGridStyle(220, 14)}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5, letterSpacing: '0.04em' }}>CÓD. SAP *</label>
                  <input ref={articleCodeInputRef} autoFocus value={form.codigoSAP} onChange={f('codigoSAP')} placeholder="1000XXX"
                    style={{ width: '100%', padding: '10px 14px', fontSize: 13, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5, letterSpacing: '0.04em' }}>DESCRIPCIÓN *</label>
                  <input value={form.descripcion} onChange={f('descripcion')} placeholder="Papel Offset 80g..."
                    style={{ width: '100%', padding: '10px 14px', fontSize: 13, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
                </div>
              </div>
              {/* Linea + UM + Cantidad + Precio */}
              <div style={getAutoFitGridStyle(hideImportes ? 130 : 120, 12)}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5, letterSpacing: '0.04em' }}>LÍNEA</label>
                  <Select value={form.linea} onValueChange={value => setForm(prev => ({ ...prev, linea: value }))}>
                    <AppSelectTrigger style={{ width: '100%' }}>
                      <SelectValue />
                    </AppSelectTrigger>
                    <AppSelectContent style={{ zIndex: 400 }}>
                      <AppSelectItem value="LCA">LCA</AppSelectItem>
                      <AppSelectItem value="LDA">LDA</AppSelectItem>
                    </AppSelectContent>
                  </Select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5, letterSpacing: '0.04em' }}>U.M.</label>
                  <Select value={form.um} onValueChange={value => setForm(prev => ({ ...prev, um: value }))}>
                    <AppSelectTrigger style={{ width: '100%' }}>
                      <SelectValue />
                    </AppSelectTrigger>
                    <AppSelectContent style={{ zIndex: 400 }}>
                      {['Kg', 'Mill.', 'Unid.', 'Resma', 'm²'].map(u => <AppSelectItem key={u} value={u}>{u}</AppSelectItem>)}
                    </AppSelectContent>
                  </Select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5, letterSpacing: '0.04em' }}>CANTIDAD *</label>
                  <input type="number" value={form.cantidadSolicitada} onChange={f('cantidadSolicitada')} placeholder="0"
                    style={{ width: '100%', padding: '10px 10px', fontSize: 13, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
                </div>
                {!hideImportes && (
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5, letterSpacing: '0.04em' }}>P. UNIT.</label>
                    <input type="number" value={form.precioUnitario} onChange={f('precioUnitario')} placeholder="0.00"
                      style={{ width: '100%', padding: '10px 10px', fontSize: 13, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 12 }}>
                <AppButton onClick={resetForm} variant="secondary" size="md" style={{ flex: 1 }}>{editingArticleId ? 'Cancelar' : 'Finalizar carga'}</AppButton>
                <AppButton onClick={handleSaveArticle} disabled={!canSave} size="md" style={{ flex: 2 }}>
                  {editingArticleId ? 'Guardar cambios' : 'Agregar y continuar'}
                </AppButton>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showMassiveModal && createPortal(
        <div role="dialog" aria-modal="true" aria-labelledby="massive-article-dialog-title" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', boxSizing: 'border-box' }}>
          <div style={{ background: CANVAS, borderRadius: 20, width: 'calc(100% - 32px)', maxWidth: 760, maxHeight: 'calc(100dvh - 32px)', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: isMobile ? '18px 18px 14px' : '20px 24px 16px', borderBottom: `1px solid ${HAIRLINE}`, flexShrink: 0 }}>
              <div>
                <h2 id="massive-article-dialog-title" style={{ margin: 0, ...DETAIL_TYPE_SCALE.h2 }}>Carga masiva de artículos</h2>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>Importá múltiples ítems copiando y pegando desde Excel o subiendo una planilla</p>
              </div>
              <AppButton aria-label="Cerrar" title="Cerrar" variant="tertiary" size="sm" onClick={() => setShowMassiveModal(false)} icon={<X size={14} color={MUTED} />} style={{ borderRadius: 9999 }} />
            </div>

            <div style={{ padding: isMobile ? 18 : 24, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', minHeight: 0 }}>
              {/* Plantilla Download */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '10px 14px', background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10 }}>
                <span style={{ fontSize: 13, color: INK }}>¿No tenés la plantilla? Descargá nuestro modelo Excel.</span>
                <AppButton variant="secondary" size="sm" onClick={handleDownloadTemplate} icon={<Download size={13} />}>
                  Descargar plantilla
                </AppButton>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragActive(true); }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={async e => {
                  e.preventDefault();
                  setIsDragActive(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleProcessFile(file);
                }}
                style={{
                  border: `2px dashed ${isDragActive ? GREEN : HAIRLINE}`,
                  borderRadius: 12,
                  padding: '24px 16px',
                  textAlign: 'center',
                  background: isDragActive ? 'rgba(26,92,56,0.02)' : 'transparent',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.xlsx, .xls, .csv';
                  input.onchange = e => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleProcessFile(file);
                  };
                  input.click();
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  <Upload size={24} style={{ color: isDragActive ? GREEN : MUTED }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>
                  {massiveFileName ? `Archivo cargado: ${massiveFileName}` : 'Arrastrá tu archivo Excel aquí o hacé clic para buscar'}
                </div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Formatos admitidos: .xlsx, .xls, .csv</div>
              </div>

              {/* Textarea for Excel pasting */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 5, letterSpacing: '0.04em' }}>
                  O PEGÁ LAS FILAS DESDE EXCEL / TSV AQUÍ
                </label>
                <textarea
                  value={massiveText}
                  onChange={e => setMassiveText(e.target.value)}
                  placeholder="codigoSAP&#9;descripcion&#9;cantidad&#9;um&#9;linea&#9;precioUnitario&#10;1000234&#9;Papel Estucado&#9;50000&#9;Kg&#9;LCA&#9;1.42"
                  rows={6}
                  style={{ width: '100%', padding: '10px 12px', fontSize: 12, fontFamily: 'monospace', color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* Rows Preview */}
              {massiveText.trim() && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Vista previa de ítems a importar ({parseTextToRows(massiveText).length})
                  </div>
                  <div style={{ maxHeight: 160, overflow: 'auto', border: `1px solid ${HAIRLINE}`, borderRadius: 10 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
                      <thead style={{ background: '#f8fafc', borderBottom: `1px solid ${HAIRLINE}`, position: 'sticky', top: 0 }}>
                        <tr>
                          <th style={{ padding: '6px 12px' }}>Cód. SAP</th>
                          <th style={{ padding: '6px 12px' }}>Descripción</th>
                          <th style={{ padding: '6px 12px', textAlign: 'right' }}>Cantidad</th>
                          <th style={{ padding: '6px 12px' }}>Línea</th>
                          <th style={{ padding: '6px 12px', textAlign: 'right' }}>Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseTextToRows(massiveText).map((row, rIdx) => (
                          <tr key={row.id} style={{ borderBottom: rIdx < parseTextToRows(massiveText).length - 1 ? `1px solid ${HAIRLINE}` : 'none' }}>
                            <td style={{ padding: '6px 12px', fontWeight: 600 }}>{row.codigoSAP}</td>
                            <td style={{ padding: '6px 12px', color: MUTED, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.descripcion}</td>
                            <td style={{ padding: '6px 12px', textAlign: 'right' }}>{row.cantidadSolicitada.toLocaleString()} {row.um}</td>
                            <td style={{ padding: '6px 12px' }}>{row.linea}</td>
                            <td style={{ padding: '6px 12px', textAlign: 'right' }}>${row.precioUnitario.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: isMobile ? '14px 18px' : '16px 24px', borderTop: `1px solid ${HAIRLINE}`, display: 'flex', gap: 10, justifyContent: 'flex-end', background: '#fff', flexShrink: 0 }}>
              <AppButton variant="secondary" size="md" onClick={() => setShowMassiveModal(false)}>
                Cancelar
              </AppButton>
              <AppButton
                size="md"
                disabled={!massiveText.trim() || parseTextToRows(massiveText).length === 0}
                onClick={() => {
                  const rows = parseTextToRows(massiveText);
                  if (rows.length > 0) {
                    const updatedArticulos = [...articulos, ...rows];
                    setArticulos(updatedArticulos);
                    onUpdateArticulos(updatedArticulos);
                    setShowMassiveModal(false);
                  }
                }}
              >
                Confirmar Importación
              </AppButton>
            </div>
          </div>
        </div>,
        document.body
      )}

      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: '#1d1d1f',
          color: '#ffffff',
          padding: '12px 16px',
          borderRadius: 14,
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          maxWidth: 'min(450px, 90vw)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <AlertTriangle size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#98a2b3', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function SubcarpetasTab({ carpeta, subs, nextLetter, activeSub, setActiveSub, readonly, hideImportes, shipmentCreationAllowed, shipmentBlockReason, onCreateSubcarpeta, onSelectSubcarpeta }: any) {
  const isMobile = useIsMobile();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ facturaNum: '', fechaFactura: '', transporte: 'Marítimo', buqueForwarder: '', blCrtAwb: '', contenedores: '1', eta: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  const usedLetters = subs.map((s: Subcarpeta) => s.numero.split('-').pop());
  const isFull = !nextLetter;
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  const availableArticulos = carpeta.articulos
    .map((articulo: any) => ({ ...articulo, saldoPendiente: articulo.cantidadSolicitada - articulo.cantidadAsignada }))
    .filter((articulo: any) => articulo.saldoPendiente > 0);
  const canCreate = Boolean(form.transporte);
  const creationDisabled = !shipmentCreationAllowed || isFull || availableArticulos.length === 0;
  const activeSubcarpeta = subs.find((sub: Subcarpeta) => sub.id === activeSub) ?? null;
  const createEmbarqueAction = !readonly ? (
    <AppButton
      size="md"
      disabled={creationDisabled}
      onClick={() => {
        if (!shipmentCreationAllowed) {
          setToastMessage(shipmentBlockReason);
          return;
        }
        if (isFull) {
          setToastMessage('Límite de embarques alcanzado: Esta carpeta ya tiene los tres parciales permitidos (A, B y C).');
          return;
        }
        if (availableArticulos.length === 0) {
          setToastMessage('Sin saldo disponible: Todos los artículos de la orden ya están asignados.');
          return;
        }
        setShowModal(true);
      }}
      icon={<Plus aria-hidden="true" size={13} />}
      style={creationDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
    >
      Crear embarque
    </AppButton>
  ) : undefined;

  const resetModal = () => {
    setShowModal(false);
    setForm({ facturaNum: '', fechaFactura: '', transporte: 'Marítimo', buqueForwarder: '', blCrtAwb: '', contenedores: '1', eta: '' });
  };

  const handleCreate = () => {
    if (!nextLetter || !shipmentCreationAllowed) return;

    const newSub: Subcarpeta = {
      id: `s_${Date.now()}`,
      numero: `${carpeta.numero}-${nextLetter}`,
      facturaNum: form.facturaNum,
      fechaFactura: form.fechaFactura,
      importeTotal: 0,
      pesoNeto: 0, pesoBruto: 0, ume: 0, umeUnidad: 'Kg',
      transporte: form.transporte as any,
      buqueForwarder: form.buqueForwarder,
      blCrtAwb: form.blCrtAwb,
      contenedores: parseInt(form.contenedores) || 1,
      despachante: '',
      estado: 'Pendiente de embarque',
      canalAduana: 'Pendiente',
      duaNum: '', eta: form.eta, fechaEmbarqueReal: '',
      pedidoSAP55: '', ingresoSAP18: '',
      documentos: [], articulosEmbarque: [], incidencias: [],
    };
    onCreateSubcarpeta(newSub);
    resetModal();
  };

  return (
    <>
      <div style={{ padding: isMobile ? DETAIL_TAB_PANEL_PADDING_MOBILE : DETAIL_TAB_PANEL_PADDING_DESKTOP, display: 'flex', flexDirection: 'column', gap: DETAIL_TAB_PANEL_GAP, background: CANVAS }}>
        {subs.length > 0 ? (
          <TabIntro
            title="Embarques parciales"
            subtitle="Registros de embarques activos de la carpeta"
            overlayActions={!isMobile}
            actions={createEmbarqueAction}
          />
        ) : null}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: '#1d1d1f',
            color: '#ffffff',
            padding: '12px 16px',
            borderRadius: 14,
            boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            maxWidth: 'min(450px, 90vw)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <AlertTriangle size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              style={{ background: 'none', border: 'none', color: '#98a2b3', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={14} />
            </button>
          </div>
        )}
        {subs.length === 0 && (
          <TabEmptyPlaceholder
            title="Sin embarques parciales"
            description={!shipmentCreationAllowed ? shipmentBlockReason : availableArticulos.length > 0 ? 'Creá el primer embarque para asignar cantidades de la orden.' : 'No hay saldo pendiente disponible para crear uno.'}
            action={createEmbarqueAction}
          />
        )}
        {subs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', background: CANVAS }}>
              {subs.map((sub: Subcarpeta, index: number) => {
                const isActive = activeSub === sub.id;
                return (
                  <div key={sub.id} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <div
                      onClick={() => {
                        if (onSelectSubcarpeta) {
                          onSelectSubcarpeta(sub.id, 'transito');
                          return;
                        }
                        setActiveSub(activeSub === sub.id ? null : sub.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        background: isActive ? 'rgba(26,92,56,0.02)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.1s ease',
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#fafbfa'; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <TransportModeIcon transporte={sub.transporte} size={15} compact />
                        <div>
                          <div style={{ fontSize: SHIPMENT_TYPE.title, fontWeight: 600, color: INK }}>{sub.numero}</div>
                          <div style={{ fontSize: SHIPMENT_TYPE.companion, color: MUTED }}>{sub.transporte} · ETA {sub.eta || '—'}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ textTransform: 'uppercase', fontSize: SHIPMENT_TYPE.companion, color: MUTED, fontWeight: 500 }}>{sub.contenedores || 0} cont.</div>
                        <NeonBadge estado={sub.estado as any} size="xs" />
                        {onSelectSubcarpeta ? <ChevronRight size={14} style={{ color: '#98a2b3' }} /> : (isActive ? <ChevronDown size={14} style={{ color: GREEN }} /> : <ChevronRight size={14} style={{ color: '#98a2b3' }} />)}
                      </div>
                    </div>
                    {!onSelectSubcarpeta && isActive && (
                      <div style={{ background: '#fcfcfd' }}>
                        <SubcarpetaExpandedPanel sub={sub} carpeta={carpeta} hideImportes={hideImportes} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Crear Subcarpeta ──────────────────────────── */}
      {showModal && nextLetter && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: CANVAS, borderRadius: 20, width: '100%', maxWidth: 900, maxHeight: 'calc(100vh - 32px)', boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px 0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px 18px', borderBottom: `1px solid ${HAIRLINE}` }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ ...DETAIL_TYPE_SCALE.h2, fontSize: 20, margin: 0, letterSpacing: '-0.374px' }}>Nuevo embarque borrador</h2>
                  <span style={{ fontSize: 13, fontWeight: 700, color: GREEN, background: 'rgba(26,92,56,0.10)', border: '1px solid rgba(26,92,56,0.25)', borderRadius: 9999, padding: '3px 12px' }}>
                    {carpeta.numero}-{nextLetter}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED }}>La factura y los artículos se incorporan después desde la subcarpeta mediante VAL.</p>
              </div>
              <AppButton aria-label="Cerrar" title="Cerrar" variant="tertiary" size="sm" onClick={resetModal} icon={<X size={15} style={{ color: MUTED }} />} style={{ borderRadius: 9999, flexShrink: 0 }} />
            </div>

            <div style={{ padding: '24px 28px 30px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
              <div style={getAutoFitGridStyle(220, 14)}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>TRANSPORTE</label>
                  <Select value={form.transporte} onValueChange={value => setForm(prev => ({ ...prev, transporte: value }))}>
                    <AppSelectTrigger style={{ width: '100%' }}>
                      <SelectValue />
                    </AppSelectTrigger>
                    <AppSelectContent style={{ zIndex: 400 }}>
                      <AppSelectItem value="Marítimo">Marítimo</AppSelectItem>
                      <AppSelectItem value="Terrestre">Terrestre</AppSelectItem>
                      <AppSelectItem value="Aéreo">Aéreo</AppSelectItem>
                    </AppSelectContent>
                  </Select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>CONTENEDORES ESTIMADOS</label>
                  <input type="number" min="1" value={form.contenedores} onChange={set('contenedores')} style={{ width: '100%', padding: '10px 14px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 11, outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>BUQUE / FORWARDER (OPCIONAL)</label>
                <input value={form.buqueForwarder} onChange={set('buqueForwarder')} placeholder="Ej. MSC AURORA / Trans Andino Cargo" style={{ width: '100%', padding: '10px 14px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 11, outline: 'none' }} />
              </div>

              <div style={getAutoFitGridStyle(220, 14)}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: MUTED, display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>ETA ESTIMADA (OPCIONAL)</label>
                  <input type="date" value={form.eta} onChange={set('eta')} style={{ width: '100%', padding: '10px 14px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 11, outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 12 }}>
                <AppButton onClick={resetModal} variant="secondary" style={{ flex: 1 }}>
                  Cancelar
                </AppButton>
                <AppButton disabled={!canCreate} onClick={handleCreate} style={{ flex: 2 }}>
                  Crear borrador
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SubcarpetaBentoCard({
  sub,
  carpeta,
  isActive,
  onClick,
  hideImportes
}: {
  sub: Subcarpeta;
  carpeta: Carpeta;
  isActive: boolean;
  onClick: () => void;
  hideImportes: boolean;
}) {
  const isMobile = useIsMobile();
  const hasInc = sub.incidencias?.length > 0;

  return (
    <div
      style={{
        background: CANVAS,
        border: isActive ? `2px solid ${GREEN}` : `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: '16px 18px',
        boxShadow: isActive ? '0 12px 28px rgba(26,92,56,0.08)' : '0 2px 8px rgba(16,24,40,0.03)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        boxSizing: 'border-box',
      }}
      onClick={onClick}
    >
      {/* Active state top glow bar */}
      {isActive && (
        <div style={{ position: 'absolute', top: -1, left: 16, right: 16, height: 3, background: GREEN, borderRadius: '99px 99px 0 0' }} />
      )}

      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TransportModeIcon transporte={sub.transporte} size={15} compact />
          <div>
            <div style={{ fontSize: SHIPMENT_TYPE.title, fontWeight: 700, color: INK }}>{sub.numero}</div>
            <div style={{ fontSize: SHIPMENT_TYPE.companion, color: MUTED }}>{sub.transporte}</div>
          </div>
        </div>
        <NeonBadge estado={sub.estado as any} size="sm" />
      </div>

      {/* Main Info Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '10px 12px', background: PARCHMENT, borderRadius: 12, border: `1px solid ${HAIRLINE}` }}>
        <div>
          <div style={{ fontSize: SHIPMENT_TYPE.label, fontWeight: 700, color: MUTED, letterSpacing: '0.04em', textTransform: 'uppercase' }}>ETA / Arribo</div>
          <div style={{ fontSize: SHIPMENT_TYPE.value, fontWeight: 600, color: INK, marginTop: 2 }}>{sub.eta || '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: SHIPMENT_TYPE.label, fontWeight: 700, color: MUTED, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Contenedores</div>
          <div style={{ fontSize: SHIPMENT_TYPE.value, fontWeight: 600, color: INK, marginTop: 2 }}>{sub.contenedores || 0} cont.</div>
        </div>
      </div>

      {/* Secondary Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, color: MUTED }}>
          <span style={{ fontSize: SHIPMENT_TYPE.label, fontWeight: 600, color: MUTED }}>N° FACTURA:</span>
          <strong style={{ color: INK }}>{sub.facturaNum || '—'}</strong>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, color: MUTED }}>
          <span style={{ fontSize: SHIPMENT_TYPE.label, fontWeight: 600, color: MUTED }}>BL / CRT:</span>
          <strong style={{ color: INK, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.blCrtAwb || '—'}</strong>
        </div>
        {!hideImportes && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: MUTED, gridColumn: 'span 2', borderTop: `1px dashed ${HAIRLINE}`, paddingTop: 8, marginTop: 4 }}>
            <span>Importe del embarque:</span>
            <strong style={{ color: GREEN }}>{formatMoney(sub.importeTotal, carpeta.moneda)}</strong>
          </div>
        )}
      </div>

      {/* Article count indicator */}
      <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: MUTED }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <FileText size={12} /> {sub.articulosEmbarque.length} artículo{sub.articulosEmbarque.length !== 1 ? 's' : ''} asignado{sub.articulosEmbarque.length !== 1 ? 's' : ''}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 600, color: GREEN }}>
          {isActive ? 'Ocultar detalle' : 'Ver detalle'} {isActive ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </div>

      {/* Incidences alert indicator */}
      {hasInc && (
        <div style={{ background: 'rgba(196,0,26,0.05)', border: '1px solid rgba(196,0,26,0.15)', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#c4001a' }}>
          <AlertTriangle size={12} />
          <strong>Incidencias registradas ({sub.incidencias.length})</strong>
        </div>
      )}
    </div>
  );
}

function SubcarpetaTableLine({ sub, onClick, showDivider = false, showMobileDivider = false, fullWidth = false, mobileStacked = false }: { sub: Subcarpeta; onClick: () => void; showDivider?: boolean; showMobileDivider?: boolean; fullWidth?: boolean; mobileStacked?: boolean }) {
  const desktopSingleWidth = fullWidth && !mobileStacked;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: mobileStacked ? 56 : 36,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto 20px',
        gridTemplateRows: mobileStacked ? 'auto auto' : undefined,
        alignItems: 'center',
        columnGap: mobileStacked ? 12 : 10,
        rowGap: mobileStacked ? 4 : 2,
        padding: mobileStacked ? '10px 16px 10px 12px' : (desktopSingleWidth ? '10px 16px' : '10px 16px 10px 12px'),
        position: 'relative',
        border: 'none',
        borderRadius: 0,
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        appearance: 'none',
        WebkitAppearance: 'none',
        boxShadow: 'none',
      }}
    >
      {showDivider && <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: HAIRLINE, borderRadius: 0 }} />}
      {showMobileDivider && <span aria-hidden="true" style={{ position: 'absolute', left: 12, right: 12, top: 0, height: 1, background: GREEN_HAIRLINE_SOFT }} />}
      <span style={{ minWidth: 0, display: 'grid', gap: mobileStacked ? 4 : 2, gridColumn: mobileStacked ? '1 / 2' : undefined, gridRow: mobileStacked ? '1 / 3' : undefined }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: INK, whiteSpace: mobileStacked ? 'normal' : 'nowrap', overflow: 'hidden', textOverflow: mobileStacked ? 'clip' : 'ellipsis', overflowWrap: 'anywhere', minWidth: 0 }}>{sub.numero}</span>
        <span style={{ fontSize: 11, color: MUTED, overflow: 'hidden', textOverflow: mobileStacked ? 'clip' : 'ellipsis', whiteSpace: mobileStacked ? 'normal' : 'nowrap', lineHeight: mobileStacked ? 1.35 : 1.2 }}>ETA {sub.eta || '-'} · {sub.contenedores || 0} cont.</span>
      </span>
      <span style={{ gridColumn: mobileStacked ? '2 / 3' : undefined, gridRow: mobileStacked ? '1 / 3' : undefined, alignSelf: 'center', justifySelf: 'end', display: 'inline-flex', alignItems: 'center' }}>
        <NeonBadge estado={sub.estado as any} size="xs" />
      </span>
      <span style={{ gridColumn: mobileStacked ? '3 / 4' : undefined, gridRow: mobileStacked ? '1 / 3' : undefined, width: 20, alignSelf: 'center', justifySelf: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <ChevronRight size={12} style={{ color: '#98a2b3', flexShrink: 0 }} />
      </span>
    </button>
  );
}

function SubcarpetaExpandedPanel({ sub, carpeta, hideImportes }: { sub: Subcarpeta; carpeta: Carpeta; hideImportes: boolean }) {
  const hasInc = sub.incidencias?.length > 0;
  const despachanteNombre = getDespachante(sub.despachante)?.nombre || '—';
  const coefEst = sub.coeficienteEst ?? null;
  const coefReal = sub.coeficienteReal ?? null;
  const desvPct = coefEst && coefReal ? ((coefReal - coefEst) / coefEst) * 100 : null;
  const desvioColor = desvPct !== null && Math.abs(desvPct) > 5 ? '#b45309' : '#1a7a4a';

  return (
    <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${HAIRLINE}`, background: '#fafbfd' }}>
      <div style={{ paddingTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
        <Field label="Factura N°" value={sub.facturaNum} />
        <Field label="Fecha Factura" value={sub.fechaFactura} />
        {!hideImportes && <Field label="Importe Total" value={formatMoney(sub.importeTotal, carpeta.moneda)} />}
        <Field label="Contenedores" value={sub.contenedores} />
        <Field label="Peso Neto (Kg)" value={sub.pesoNeto.toLocaleString()} />
        <Field label="Peso Bruto (Kg)" value={sub.pesoBruto.toLocaleString()} />
        <Field label="UME" value={`${sub.ume.toLocaleString()} ${sub.umeUnidad}`} />
      </div>

      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <div style={{ background: CANVAS, border: `1px solid ${HAIRLINE}`, borderRadius: 14, padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Aduana</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
            <Field label="Despachante" value={despachanteNombre} />
            <Field label="DUA N°" value={sub.duaNum || '—'} color={sub.duaNum ? INK : MUTED} />
            <div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Canal aduanero</div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                color: sub.canalAduana === 'Rojo' ? '#c4001a' : sub.canalAduana === 'Verde' ? '#1a7a4a' : MUTED,
                background: sub.canalAduana === 'Rojo' ? 'rgba(196,0,26,0.06)' : sub.canalAduana === 'Verde' ? 'rgba(26,92,56,0.08)' : 'rgba(15,23,42,0.04)',
                border: `1px solid ${sub.canalAduana === 'Rojo' ? 'rgba(196,0,26,0.16)' : sub.canalAduana === 'Verde' ? 'rgba(26,92,56,0.18)' : 'rgba(15,23,42,0.08)'}`
              }}>
                {sub.canalAduana || 'Pendiente'}
              </span>
            </div>
            <Field label="Pago aduana" value={(sub as any).pagoAduana || 'Pendiente'} color={(sub as any).pagoAduana ? INK : MUTED} />
            <Field label="Pago marítima" value={(sub as any).pagoMaritima || 'Pendiente'} color={(sub as any).pagoMaritima ? INK : MUTED} />
            <Field label="SAP Tx.55" value={sub.pedidoSAP55 || '—'} color={sub.pedidoSAP55 ? INK : MUTED} />
            <Field label="SAP Tx.18" value={sub.ingresoSAP18 || '—'} color={sub.ingresoSAP18 ? '#1a7a4a' : MUTED} />
          </div>
        </div>

        <div style={{ background: CANVAS, border: `1px solid ${HAIRLINE}`, borderRadius: 14, padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Costeo</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
            <Field label="Coeficiente estimado" value={coefEst !== null ? coefEst.toFixed(2) : '—'} color={coefEst !== null ? INK : MUTED} />
            <Field label="Coeficiente real" value={coefReal !== null ? coefReal.toFixed(2) : '—'} color={coefReal !== null ? INK : MUTED} />
            <Field label="Gastos terminal" value={!hideImportes ? `$ ${carpeta.gastosTerminal.toLocaleString()}` : 'Oculto'} color={!hideImportes ? INK : MUTED} />
            <Field label="Honorarios despachante" value={!hideImportes ? `$ ${carpeta.honorariosDespachante.toLocaleString()}` : 'Oculto'} color={!hideImportes ? INK : MUTED} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 2, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 12, color: MUTED }}>
              {desvPct !== null ? 'Desvío del embarque' : 'Sin desvío calculado todavía'}
            </div>
            {desvPct !== null && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
                color: desvioColor,
                background: `${desvioColor}12`,
                border: `1px solid ${desvioColor}2b`
              }}>
                {desvPct > 0 ? '+' : ''}{desvPct.toFixed(1)}%
              </span>
            )}
          </div>
          {carpeta.observaciones && (
            <div style={{ fontSize: 12.5, color: INK, lineHeight: 1.5, padding: '10px 12px', borderRadius: 10, background: PARCHMENT, border: `1px solid ${HAIRLINE}` }}>
              {carpeta.observaciones}
            </div>
          )}
        </div>
      </div>

      {sub.articulosEmbarque.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Artículos asignados</div>
          <div style={{ display: 'flex', flexDirection: 'column', border: `1px solid ${HAIRLINE}`, borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8faf9', borderBottom: `1px solid ${HAIRLINE}` }}>
                  <th style={{ padding: '8px 12px', fontWeight: 600, color: MUTED }}>Código</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, color: MUTED }}>Descripción</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, color: MUTED, textAlign: 'right' }}>Cantidad</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, color: MUTED, textAlign: 'right' }}>Saldo Restante</th>
                </tr>
              </thead>
              <tbody>
                {sub.articulosEmbarque.map((ae: any, idx: number) => {
                  const art = carpeta.articulos.find((a: any) => a.id === ae.articuloId);
                  if (!art) return null;
                  const saldoPosterior = art.cantidadSolicitada - art.cantidadAsignada;
                  return (
                    <tr key={ae.articuloId} style={{ borderBottom: idx < sub.articulosEmbarque.length - 1 ? `1px solid ${HAIRLINE}` : 'none' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: INK }}>{art.codigoSAP}</td>
                      <td style={{ padding: '10px 12px', color: INK }}>{art.descripcion}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: INK }}>{ae.cantidad.toLocaleString()} {art.um}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 500, color: saldoPosterior === 0 ? '#1a7a4a' : '#b45309' }}>
                        {saldoPosterior.toLocaleString()} {art.um}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hasInc && (
        <Alert variant="destructive" className="mt-4 bg-red-50">
          <AlertTriangle aria-hidden="true" />
          <AlertTitle>Incidencias del embarque</AlertTitle>
          <AlertDescription>
          {sub.incidencias.map((inc: any) => (
            <div key={inc.id}>
              <strong>{inc.tipo}</strong> — {inc.cantidadAfectada} unidades — {inc.comentario}
            </div>
          ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function ProduccionTab({ carpeta, proveedor, editable, onUpdateProduccion }: any) {
  const isMobile = useIsMobile();
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({
    referenciaProveedor: carpeta.referenciaProveedor || '',
    fechaEmbarqueEst: carpeta.fechaEmbarqueEst || '',
    observaciones: carpeta.observaciones || '',
  });
  const fechaCalc = proveedor && carpeta.fechaOC
    ? new Date(new Date(carpeta.fechaOC).getTime() + proveedor.diasProd * 86400000).toISOString().split('T')[0]
    : '—';
  const confirmationDocuments = ((carpeta.documentos ?? []) as Documento[]).filter(documento => documento.tipo === 'Confirmación de Pedido');
  const currentConfirmation = confirmationDocuments[confirmationDocuments.length - 1];
  const confirmationStatus = !currentConfirmation
    ? 'Sin documento'
    : currentConfirmation.estadoValidacion === 'Aprobado'
      ? 'Conforme'
      : currentConfirmation.estadoValidacion === 'Aprobado con diferencias' || currentConfirmation.estadoValidacion === 'Reclamo abierto'
        ? 'Con diferencias'
        : 'Pendiente de control';
  const confirmationStatusColor = confirmationStatus === 'Conforme' ? '#1a7a4a' : confirmationStatus === 'Con diferencias' ? '#c4001a' : '#b45309';

  useEffect(() => {
    setForm({
      referenciaProveedor: carpeta.referenciaProveedor || '',
      fechaEmbarqueEst: carpeta.fechaEmbarqueEst || '',
      observaciones: carpeta.observaciones || '',
    });
  }, [carpeta.referenciaProveedor, carpeta.fechaEmbarqueEst, carpeta.observaciones]);

  const saveProduccion = () => {
    onUpdateProduccion({
      referenciaProveedor: form.referenciaProveedor.trim(),
      fechaEmbarqueEst: form.fechaEmbarqueEst,
      observaciones: form.observaciones.trim(),
    });
    setShowEditModal(false);
  };

  return (
    <>
    <div style={{ display: 'grid', gap: DETAIL_TAB_PANEL_GAP, padding: isMobile ? DETAIL_TAB_PANEL_PADDING_MOBILE : DETAIL_TAB_PANEL_PADDING_DESKTOP }}>
      <TabIntro
        title="Producción y pre-embarque"
        subtitle="Confirmación del proveedor y seguimiento en origen"
        overlayActions={!isMobile}
        actions={editable ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <AppButton type="button" size="md" icon={<Pencil size={13} />} onClick={() => setShowEditModal(true)}>
              Editar seguimiento
            </AppButton>
          </div>
        ) : undefined}
      />
      <div style={{ display: 'grid', gap: 10, paddingBottom: DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP, borderBottom: `1px solid ${HAIRLINE}` }}>
        <span style={DETAIL_SECTION_LABEL_STYLE}>Confirmación de pedido</span>
        {currentConfirmation ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.5fr) repeat(2, minmax(110px, 0.6fr))', gap: 14, alignItems: 'center', padding: '12px 14px', background: PARCHMENT }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentConfirmation.nombre}</div>
                <div style={{ marginTop: 3, fontSize: 11, color: MUTED }}>Versión {confirmationDocuments.length}</div>
              </div>
              <Field label="Fecha de carga" value={currentConfirmation.fecha} />
              <Field label="Tamaño" value={currentConfirmation.tamano} />
            </div>
            <div style={{ padding: '12px 14px', background: confirmationStatus === 'Conforme' ? 'rgba(26,122,74,0.05)' : confirmationStatus === 'Con diferencias' ? 'rgba(196,0,26,0.05)' : 'rgba(180,83,9,0.06)', border: `1px solid ${confirmationStatus === 'Conforme' ? 'rgba(26,122,74,0.2)' : confirmationStatus === 'Con diferencias' ? 'rgba(196,0,26,0.18)' : 'rgba(180,83,9,0.2)'}`, borderRadius: 8, color: confirmationStatusColor, fontSize: 12, fontWeight: confirmationStatus === 'Conforme' ? 700 : 400, lineHeight: '18px' }}>
              {confirmationStatus === 'Conforme' ? (
                'Pasó el chequeo.'
              ) : confirmationStatus === 'Con diferencias' ? (
                <>El anexo <strong>{currentConfirmation.nombre}</strong> tiene diferencias. Cuando recibas la versión corregida del proveedor, cargala desde <strong>Anexos</strong> como nueva versión.</>
              ) : (
                'Pendiente de chequeo.'
              )}
            </div>
            {currentConfirmation.comparacionConfirmacion && (
              <div style={{ display: 'grid', gap: 12, border: `1px solid ${HAIRLINE}`, borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 12, padding: '12px 14px', background: PARCHMENT }}>
                  {[
                    ['Carpeta', currentConfirmation.comparacionConfirmacion.carpetaDocumento || 'No identificada', currentConfirmation.comparacionConfirmacion.carpetaCoincide],
                    ['Incoterm', currentConfirmation.comparacionConfirmacion.incotermDocumento || 'No identificado', currentConfirmation.comparacionConfirmacion.incotermCoincide],
                    ['Moneda', currentConfirmation.comparacionConfirmacion.monedaDocumento || 'No identificada', currentConfirmation.comparacionConfirmacion.monedaCoincide],
                  ].map(([label, value, matches]) => (
                    <div key={String(label)}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: MUTED, textTransform: 'uppercase' }}>{label}</div>
                      <div style={{ marginTop: 4, fontSize: 12, fontWeight: 700, color: matches ? GREEN : '#c4001a' }}>{String(value)} · {matches ? 'Coincide' : 'Diferencia'}</div>
                    </div>
                  ))}
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <div style={{ minWidth: 680 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '100px minmax(210px, 1fr) 125px 145px 115px', gap: 10, padding: '9px 12px', background: '#f7f8f7', borderTop: `1px solid ${HAIRLINE}` }}>
                      {['SKU', 'Artículo', 'Cantidad OC', 'Confirmada', 'Resultado'].map(label => <span key={label} style={{ fontSize: 10.5, fontWeight: 700, color: MUTED }}>{label}</span>)}
                    </div>
                    {currentConfirmation.comparacionConfirmacion.articulos.map(item => (
                      <div key={item.codigoSAP} style={{ display: 'grid', gridTemplateColumns: '100px minmax(210px, 1fr) 125px 145px 115px', gap: 10, padding: '10px 12px', borderTop: `1px solid ${HAIRLINE}`, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{item.codigoSAP}</span>
                        <span style={{ fontSize: 12 }}>{item.descripcion}</span>
                        <span style={{ fontSize: 12 }}>{item.cantidadOC.toLocaleString()} {item.umOC}</span>
                        <span style={{ fontSize: 12 }}>{item.cantidadConfirmada === null ? 'No informada' : `${item.cantidadConfirmada.toLocaleString()} ${item.umConfirmada}`}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: item.resultado === 'Coincide' ? GREEN : '#c4001a' }}>{item.resultado}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: '#8a4b08', fontSize: 12, lineHeight: '18px' }}>
            Todavía no hay una confirmación de pedido adjunta.
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gap: DETAIL_TAB_SECTION_GAP }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', columnGap: 24, rowGap: 18, alignItems: 'start' }}>
          <Field label="Referencia Proveedor" value={carpeta.referenciaProveedor || '—'} />
          <div>
            <div style={DETAIL_META_LABEL_STYLE}>Control artículo por artículo</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 22 }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${confirmationStatus === 'Conforme' ? '#1a7a4a' : HAIRLINE}`, background: confirmationStatus === 'Conforme' ? '#1a7a4a' : CANVAS, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {confirmationStatus === 'Conforme' && <CheckCircle size={11} color="#fff" />}
              </div>
              <span style={{ fontSize: SHIPMENT_TYPE.title, lineHeight: '16px', color: confirmationStatusColor }}>{confirmationStatus === 'Sin documento' ? 'Pendiente de documento' : confirmationStatus}</span>
            </div>
          </div>
          <Field label="Fecha Embarque Est." value={carpeta.fechaEmbarqueEst || '—'} />
        </div>
      </div>

      <div style={{ display: 'grid', gap: DETAIL_TAB_SECTION_GAP, paddingTop: DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP, borderTop: `1px solid ${HAIRLINE}` }}>
        <span style={DETAIL_SECTION_LABEL_STYLE}>Seguimiento de producción en origen</span>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', columnGap: 24, rowGap: 18, alignItems: 'start' }}>
          <Field label="Proveedor" value={proveedor?.nombre || '—'} />
          <Field label="País Origen" value={proveedor?.pais || '—'} />
          <Field label="Días de Producción (Maestro)" value={`${proveedor?.diasProd || '—'} días`} />
          <Field label="Fecha O/C" value={carpeta.fechaOC} />
          <Field
            label="Fecha Embarque Est. (Calculada)"
            value={
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: GREEN, fontWeight: 600 }}>
                <Calendar size={15} />
                <span>{fechaCalc}</span>
                <span style={{ fontSize: SHIPMENT_TYPE.companion, lineHeight: 1.2, color: MUTED, fontWeight: 400 }}>(O/C + {proveedor?.diasProd} días)</span>
              </div>
            }
          />
          {carpeta.fechaEmbarqueEst !== fechaCalc && (
            <div style={{ gridColumn: isMobile ? 'span 1' : 'span 3', marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(180,83,9,0.05)', border: '1px solid rgba(180,83,9,0.15)', borderRadius: 8, color: '#b45309', fontSize: 12 }}>
                <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                <span><strong>Desvío detectado:</strong> El embarque estimado registrado ({carpeta.fechaEmbarqueEst || '—'}) difiere de la fecha calculada por el maestro ({fechaCalc}).</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    {showEditModal && (
      <TabEditModal title="Editar seguimiento del proveedor" onClose={() => setShowEditModal(false)} onSave={saveProduccion}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          <FormField label="Referencia proveedor">
            <input value={form.referenciaProveedor} onChange={event => setForm(prev => ({ ...prev, referenciaProveedor: event.target.value }))} placeholder="Referencia interna" style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
          </FormField>
          <FormField label="Fecha embarque estimada">
            <input type="date" value={form.fechaEmbarqueEst} onChange={event => setForm(prev => ({ ...prev, fechaEmbarqueEst: event.target.value }))} style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
          </FormField>
        </div>
        <FormField label="Observaciones / reclamos">
          <textarea value={form.observaciones} onChange={event => setForm(prev => ({ ...prev, observaciones: event.target.value }))} rows={4} style={{ width: '100%', padding: '10px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none', resize: 'vertical', lineHeight: 1.5 }} />
        </FormField>
      </TabEditModal>
    )}
    </>
  );
}

function DocumentosTab({ carpeta, subs, readonly }: any) {
  const isMobile = useIsMobile();
  const allDocs = (subs as Subcarpeta[]).flatMap(s =>
    s.documentos.map((d: any) => ({ ...d, subcarpeta: s.numero }))
  );

  const tipoColors: Record<string, string> = {
    'Factura Comercial':       '#5b21b6',
    'Bill of Lading / CRT':    '#5e5ce6',
    'Packing List':             '#b45309',
    'Certificado de Origen':   '#0066cc',
  };

  return (
    <div style={{ padding: isMobile ? DETAIL_TAB_PANEL_PADDING_MOBILE : DETAIL_TAB_PANEL_PADDING_DESKTOP, display: 'flex', flexDirection: 'column', gap: DETAIL_TAB_PANEL_GAP, background: CANVAS }}>
      {!readonly && (
        <div style={{ padding: '2px 2px 14px', borderBottom: `1px solid ${HAIRLINE}`, background: CANVAS }}>
          <div style={{ border: `1px dashed ${HAIRLINE}`, borderRadius: 12, padding: '28px 24px', textAlign: 'center', background: '#fafbfd', cursor: 'pointer' }}>
            <Upload size={22} style={{ color: MUTED, margin: '0 auto 8px' }} />
            <div style={{ ...DETAIL_TYPE_SCALE.itemTitle, marginBottom: 3 }}>Agregar documentos</div>
            <div style={{ fontSize: 12, color: MUTED }}>PDF hasta 20 MB · Factura · BL/CRT · Packing List · Certificado</div>
          </div>
        </div>
      )}
      {allDocs.length > 0 && (
        <div style={{ overflow: 'hidden', background: CANVAS }}>
          {isMobile ? (
            <div>
              {allDocs.map((doc: any, i: number) => {
                const color = tipoColors[doc.tipo] || MUTED;
                return (
                  <div key={doc.id} style={{ padding: '16px', borderBottom: i < allDocs.length - 1 ? `1px solid ${HAIRLINE}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{doc.nombre}</div>
                        <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{doc.subcarpeta}</div>
                      </div>
                      <AppButton size="sm" variant="tertiary" style={{ flexShrink: 0 }}>Ver documento</AppButton>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <span style={{ fontSize: 12, color, background: `${color}14`, border: `1px solid ${color}33`, borderRadius: 9999, padding: '3px 8px' }}>{doc.tipo}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.04em' }}>TAMAÑO</div>
                        <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{doc.tamano}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: '0.04em' }}>FECHA</div>
                        <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{doc.fecha}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={tableHeadRow}>
                  {['Subcarpeta', 'Tipo', 'Archivo', 'Tamaño', 'Fecha', ''].map(col => (
                    <th key={col} style={tableHeadCell}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allDocs.map((doc: any, i: number) => {
                  const color = tipoColors[doc.tipo] || MUTED;
                  return (
                    <tr key={doc.id} style={{ borderBottom: i < allDocs.length - 1 ? `1px solid ${HAIRLINE}` : 'none' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: INK }}>{doc.subcarpeta}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 12, color, background: `${color}14`, border: `1px solid ${color}33`, borderRadius: 9999, padding: '3px 8px' }}>{doc.tipo}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: INK }}>{doc.nombre}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: MUTED }}>{doc.tamano}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: MUTED }}>{doc.fecha}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <AppButton size="sm" variant="tertiary">Ver documento</AppButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
      {allDocs.length === 0 && <div style={{ textAlign: 'center', color: MUTED, fontSize: 15, padding: '32px 0' }}>Sin documentos adjuntos.</div>}
    </div>
  );
}

interface TransportAttachmentItem {
  articuloId: string;
  codigoSAP: string;
  descripcion: string;
  cantidad: number;
  um: string;
  contenedor: string;
}

interface TransportAttachmentDraft {
  autoRecognized: boolean;
  carpetaReferencia: string;
  numeroDocumento: string;
  fechaEmbarqueReal: string;
  eta: string;
  buqueForwarder: string;
  transporte: 'Marítimo' | 'Terrestre' | 'Aéreo';
  items: TransportAttachmentItem[];
}

function parseSupplierConfirmation(carpeta: Carpeta, content: string): NonNullable<Documento['comparacionConfirmacion']> {
  const carpetaDocumento = content.match(/(?:Purchase Order \/ Folder|Customer Reference):\s*(?:Dimagraf\s*\/\s*)?(\d{4}\s*\/\s*\d+)/i)?.[1]?.replace(/\s/g, '') ?? '';
  const incotermDocumento = content.match(/Incoterm:\s*([^\r\n]+)/i)?.[1]?.trim().split(/\s+/)[0].toUpperCase() ?? '';
  const monedaDocumento = content.match(/Currency:\s*([A-Z]{3})/i)?.[1]?.toUpperCase() ?? '';
  const parsedItems = new Map<string, { descripcion: string; cantidad: number; um: string }>();

  content.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*\d+\s+(\d{6,})\s+(.+?)\s+([\d.,]+)\s+([A-Za-z0-9.²]+)\s*$/);
    if (!match) return;
    const rawQuantity = match[3].replace(/\s/g, '');
    const normalizedQuantity = rawQuantity.includes(',') && rawQuantity.includes('.')
      ? rawQuantity.replace(/,/g, '')
      : rawQuantity.replace(',', '.');
    parsedItems.set(match[1], { descripcion: match[2].trim(), cantidad: Number(normalizedQuantity), um: match[4].toUpperCase() });
  });

  const articulos: NonNullable<Documento['comparacionConfirmacion']>['articulos'] = carpeta.articulos.map(articulo => {
    const confirmed = parsedItems.get(articulo.codigoSAP);
    return {
      codigoSAP: articulo.codigoSAP,
      descripcion: articulo.descripcion,
      cantidadOC: articulo.cantidadSolicitada,
      cantidadConfirmada: confirmed?.cantidad ?? null,
      umOC: articulo.um,
      umConfirmada: confirmed?.um ?? '',
      resultado: !confirmed
        ? 'No informado'
        : confirmed.cantidad === articulo.cantidadSolicitada && confirmed.um === articulo.um.toUpperCase()
          ? 'Coincide'
          : 'Diferencia',
    };
  });

  parsedItems.forEach((item, codigoSAP) => {
    if (carpeta.articulos.some(articulo => articulo.codigoSAP === codigoSAP)) return;
    articulos.push({
      codigoSAP,
      descripcion: item.descripcion,
      cantidadOC: 0,
      cantidadConfirmada: item.cantidad,
      umOC: '',
      umConfirmada: item.um,
      resultado: 'No pertenece a la OC',
    });
  });

  return {
    carpetaDocumento,
    carpetaCoincide: carpetaDocumento === carpeta.numero,
    incotermDocumento,
    incotermCoincide: incotermDocumento === carpeta.incoterm.toUpperCase(),
    monedaDocumento,
    monedaCoincide: monedaDocumento === carpeta.moneda.toUpperCase(),
    articulos,
  };
}

function supplierConfirmationMatches(comparison: NonNullable<Documento['comparacionConfirmacion']>) {
  return comparison.carpetaCoincide
    && comparison.incotermCoincide
    && comparison.monedaCoincide
    && comparison.articulos.length > 0
    && comparison.articulos.every(item => item.resultado === 'Coincide');
}

function DocumentosTabV2({
  carpeta,
  subs,
  readonly,
  role,
  onAddDocumento,
  onUpdateCarpeta
}: {
  carpeta: Carpeta;
  subs: Subcarpeta[];
  readonly: boolean;
  role: string;
  onAddDocumento: (doc: Documento, subId: string | 'madre') => void;
  onUpdateCarpeta?: (updated: Carpeta) => void;
}) {
  const isMobile = useIsMobile();
  const [referencia, setReferencia] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tipo, setTipo] = useState<Documento['tipo']>('Packing List');
  const [tipoSugerido, setTipoSugerido] = useState<Documento['tipo'] | null>(null);
  const [target, setTarget] = useState<string | 'madre'>('madre');
  const [visibilidad, setVisibilidad] = useState<string>('Todos');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [transportDraft, setTransportDraft] = useState<TransportAttachmentDraft | null>(null);
  const [confirmationComparison, setConfirmationComparison] = useState<Documento['comparacionConfirmacion']>();

  // Interactive Validation Modal States
  const [showValidationWizard, setShowValidationWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<'loading' | 'comparison'>('loading');
  const [validationResult, setValidationResult] = useState<any[]>([]);
  const validationTimerRef = useRef<number | null>(null);

  const subcarpetas = subs as Subcarpeta[];
  const allDocs = [
    ...((carpeta.documentos ?? []).map((d: Documento) => ({ ...d, origen: 'Carpeta madre', targetId: 'madre' }))),
    ...subcarpetas.flatMap(s => s.documentos.map((d: Documento) => ({ ...d, origen: s.numero, targetId: s.id }))),
  ];

  const tipoColors: Record<string, string> = {
    'Factura Comercial': '#5b21b6',
    'Bill of Lading / CRT': '#5e5ce6',
    'Packing List': '#b45309',
    'Certificado de Origen': '#0066cc',
    'Confirmación de Pedido': '#059669',
  };

  const visibilidadOptions = [
    'Todos',
    'Solo Importaciones y Dirección',
    'Solo Tesorería',
    'Solo Depósito',
  ];
  const getReferenceFromFileName = (fileName: string) => fileName.replace(/\.[^.]+$/, '');
  const resolveDocumentDefaults = (documentType: Documento['tipo']) => {
    const belongsToMother = documentType === 'Confirmación de Pedido' || documentType === 'Factura Comercial' || documentType === 'Bill of Lading / CRT';
    const defaultTarget = belongsToMother ? 'madre' : (subcarpetas[0]?.id ?? 'madre');

    if (documentType === 'Packing List') {
      return { target: defaultTarget, visibilidad: 'Solo Depósito', belongsToMother };
    }

    if (documentType === 'Factura Comercial') {
      return { target: defaultTarget, visibilidad: 'Solo Importaciones y Dirección', belongsToMother };
    }

    return { target: defaultTarget, visibilidad: 'Solo Importaciones y Dirección', belongsToMother };
  };

  // Filtering documents by profile (RF-044, RF-045)
  const filteredDocs = allDocs.filter((doc: any) => {
    const docVis = doc.visibilidad || 'Todos';
    if (docVis === 'Todos') return true;
    if (role === 'operator' || role === 'director' || role === 'admin') return true;
    if (docVis === 'Solo Tesorería' && role === 'treasury') return true;
    if (docVis === 'Solo Depósito' && role === 'warehouse') return true;
    if (docVis === 'Solo Importaciones y Dirección' && (role === 'dispatcher' || role === 'operator' || role === 'director')) return true;
    return false;
  });
  const getDocumentVersionKey = (doc: any) => `${doc.targetId ?? 'madre'}::${doc.tipo}`;
  const getDocumentSequence = (doc: any, index: number) => {
    if (typeof doc.id === 'string' && doc.id.startsWith('doc-')) {
      const parsedTimestamp = Number(doc.id.slice(4));
      if (Number.isFinite(parsedTimestamp)) {
        return parsedTimestamp;
      }
    }

    return index;
  };
  const documentGroupLatestSequence = filteredDocs.reduce<Record<string, number>>((acc, doc, index) => {
    const key = getDocumentVersionKey(doc);
    const sequence = getDocumentSequence(doc, index);
    acc[key] = Math.max(acc[key] ?? 0, sequence);
    return acc;
  }, {});
  const documentGroupCounts = filteredDocs.reduce<Record<string, number>>((acc, doc) => {
    const key = getDocumentVersionKey(doc);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const visibleDocs = filteredDocs
    .map((doc, index) => {
      const versionKey = getDocumentVersionKey(doc);
      const sequence = getDocumentSequence(doc, index);
      const latestSequence = documentGroupLatestSequence[versionKey] ?? sequence;

      return {
        ...doc,
        versionKey,
        sequence,
        latestSequence,
        isCurrentVersion: sequence === latestSequence,
        hasVersionHistory: (documentGroupCounts[versionKey] ?? 0) > 1,
      };
    })
    .sort((a, b) => {
      if (b.latestSequence !== a.latestSequence) {
        return b.latestSequence - a.latestSequence;
      }

      return b.sequence - a.sequence;
    });

  const canAttach = Boolean(selectedFile);
  const inferDocumentType = (fileName: string): Documento['tipo'] | null => {
    const normalizedName = fileName.toLowerCase();
    const uploadedFileName = normalizedName.split(/\r?\n/, 1)[0];
    if (/bill[_\s-]*of[_\s-]*lading|\b(?:bl|b\/l|crt|awb)[_\s-]/i.test(uploadedFileName)) return 'Bill of Lading / CRT';
    if (/invoice|factura/i.test(uploadedFileName)) return 'Factura Comercial';
    if (/confirm|pedido|order/i.test(uploadedFileName)) return 'Confirmación de Pedido';
    if (/packing/i.test(uploadedFileName)) return 'Packing List';
    if (/origen|origin|certificate/i.test(uploadedFileName)) return 'Certificado de Origen';
    const hasStrongTransportIdentifier = /bill of lading\s*(?:no\.?|number|#|:)|bill_of_lading|\b(?:crt|awb)\s*(?:no\.?|number|#|:)/i.test(normalizedName);
    if (hasStrongTransportIdentifier) return 'Bill of Lading / CRT';
    if (normalizedName.includes('invoice') || normalizedName.includes('factura')) return 'Factura Comercial';
    if (normalizedName.includes('confirm') || normalizedName.includes('pedido') || normalizedName.includes('order')) return 'Confirmación de Pedido';
    if (normalizedName.includes('packing')) return 'Packing List';
    if (/\b(?:bill|bl|b\/l|crt|awb)\b/i.test(normalizedName)) return 'Bill of Lading / CRT';
    if (normalizedName.includes('origen') || normalizedName.includes('origin') || normalizedName.includes('certificate')) return 'Certificado de Origen';
    return null;
  };

  const createTransportDraft = (content = '', fileName = ''): TransportAttachmentDraft => {
    const carpetaReferencia = content.match(/(?:Internal Folder Reference|Folder Reference|Carpeta):\s*(\d{4}\s*\/\s*\d+)/i)?.[1]?.replace(/\s/g, '') ?? '';
    const numeroDocumento = content.match(/(?:Bill of Lading No\.|CRT No\.|AWB No\.):\s*([^\r\n]+)/i)?.[1]?.trim() ?? '';
    const fechaEmbarqueReal = content.match(/(?:On Board Date|Departure Date|Border Crossing Date):\s*(\d{4}-\d{2}-\d{2})/i)?.[1] ?? '';
    const eta = content.match(/(?:ETA Buenos Aires|Estimated Arrival):\s*(\d{4}-\d{2}-\d{2})/i)?.[1] ?? '';
    const buqueForwarder = content.match(/Vessel \/ Voyage:\s*([^\r\n]+)/i)?.[1]?.trim()
      ?? content.match(/(?:Carrier|Forwarder):\s*([^\r\n]+)/i)?.[1]?.trim()
      ?? '';
    const source = `${fileName}\n${content}`;
    const transporte: TransportAttachmentDraft['transporte'] = /\bAWB\b|air waybill/i.test(source)
      ? 'Aéreo'
      : /\bCRT\b|border crossing/i.test(source)
        ? 'Terrestre'
        : 'Marítimo';
    let currentContainer = '';
    const extractedByCode = new Map<string, { cantidad: number; um: string; contenedor: string }>();
    content.split(/\r?\n/).forEach(line => {
      const containerMatch = line.match(/Container No\.:\s*(.+)/i);
      if (containerMatch) {
        currentContainer = containerMatch[1].trim();
        return;
      }
      const articleMatch = line.match(/SAP\s+(\d+)\s*\/\s*([\d.,]+)\s+([A-Za-z0-9]+)/i);
      if (!articleMatch) return;
      const rawQuantity = articleMatch[2].replace(/\s/g, '');
      const normalizedQuantity = rawQuantity.includes(',') && rawQuantity.includes('.')
        ? rawQuantity.replace(/,/g, '')
        : rawQuantity.replace(',', '.');
      extractedByCode.set(articleMatch[1], {
        cantidad: Number(normalizedQuantity),
        um: articleMatch[3].toUpperCase(),
        contenedor: currentContainer,
      });
    });
    const items = carpeta.articulos.map(articulo => {
      const extracted = extractedByCode.get(articulo.codigoSAP);
      return {
        articuloId: articulo.id,
        codigoSAP: articulo.codigoSAP,
        descripcion: articulo.descripcion,
        cantidad: extracted?.cantidad ?? 0,
        um: extracted?.um ?? articulo.um,
        contenedor: extracted?.contenedor ?? '',
      };
    });
    const recognizedItems = items.filter(item => item.cantidad > 0);
    return {
      autoRecognized: Boolean(numeroDocumento && fechaEmbarqueReal && recognizedItems.length > 0 && (!carpetaReferencia || carpetaReferencia === carpeta.numero)),
      carpetaReferencia,
      numeroDocumento,
      fechaEmbarqueReal,
      eta,
      buqueForwarder,
      transporte,
      items,
    };
  };

  const handleSelectedFile = async (file: File | null) => {
    setSelectedFile(file);
    setTransportDraft(null);
    setConfirmationComparison(undefined);
    if (!file) {
      setReferencia('');
      setTipoSugerido(null);
      return;
    }

    setReferencia(getReferenceFromFileName(file.name));
    const content = await file.text();
    const inferredType = inferDocumentType(`${file.name}\n${content}`) ?? 'Packing List';
    setTipoSugerido(inferredType);
    setTipo(inferredType);
    const defaults = resolveDocumentDefaults(inferredType);
    setTarget(defaults.target);
    setVisibilidad(defaults.visibilidad);
    if (inferredType === 'Bill of Lading / CRT') {
      const draft = createTransportDraft(content, file.name);
      setTransportDraft(draft);
      if (draft.numeroDocumento) setReferencia(draft.numeroDocumento);
    }
    if (inferredType === 'Confirmación de Pedido') {
      setConfirmationComparison(parseSupplierConfirmation(carpeta, content));
    }
  };

  useEffect(() => {
    if (!selectedFile || tipo !== 'Bill of Lading / CRT' || transportDraft) return;
    setTransportDraft(createTransportDraft('', selectedFile.name));
  }, [tipo, selectedFile, transportDraft]);

  useEffect(() => {
    if (!selectedFile) return;
    const defaults = resolveDocumentDefaults(tipo);
    setTarget(current => current === defaults.target ? current : defaults.target);
    setVisibilidad(current => current === defaults.visibilidad ? current : defaults.visibilidad);
  }, [tipo, selectedFile, subcarpetas]);

  const startValidation = () => {
    if (!selectedFile) return;
    setShowValidationWizard(true);
    runAnalysisSimulation();
  };

  const runAnalysisSimulation = () => {
    setWizardStep('loading');
    if (validationTimerRef.current !== null) {
      window.clearTimeout(validationTimerRef.current);
    }
    validationTimerRef.current = window.setTimeout(() => {
      if (tipo === 'Confirmación de Pedido' && confirmationComparison) {
        setValidationResult(confirmationComparison.articulos.map(item => ({
          articuloId: carpeta.articulos.find(articulo => articulo.codigoSAP === item.codigoSAP)?.id ?? `extra-${item.codigoSAP}`,
          codigoSAP: item.codigoSAP,
          descripcionOC: item.descripcion,
          descripcionDoc: item.descripcion,
          cantOC: item.cantidadOC,
          cantDoc: item.cantidadConfirmada ?? 0,
          precioOC: 0,
          precioDoc: 0,
          um: item.umConfirmada || item.umOC,
          status: item.resultado,
        })));
        setWizardStep('comparison');
        validationTimerRef.current = null;
        return;
      }
      const isInvoice = tipo === 'Factura Comercial';
      const normalizedFileName = selectedFile?.name.toLowerCase() ?? '';
      const forceMatch = normalizedFileName.includes('_ok') || normalizedFileName.includes('-ok') || normalizedFileName.includes('coincide');
      const items = generateComparisonItems(carpeta.articulos, isInvoice, forceMatch);
      setValidationResult(items);
      setWizardStep('comparison');
      validationTimerRef.current = null;
    }, 1200);
  };

  const closeValidationWizard = () => {
    if (validationTimerRef.current !== null) {
      window.clearTimeout(validationTimerRef.current);
      validationTimerRef.current = null;
    }
    setShowValidationWizard(false);
    setWizardStep('loading');
  };

  const closeUploadFlow = () => {
    closeValidationWizard();
    setTransportDraft(null);
    setShowUploadModal(false);
  };

  const transportItemsToAssign = transportDraft?.items.filter(item => item.cantidad > 0) ?? [];
  const transportExistingSubcarpeta = transportDraft
    ? subcarpetas.find(sub => sub.blCrtAwb === transportDraft.numeroDocumento.trim())
    : undefined;
  const transportBalanceRows = (transportDraft?.items ?? []).map(item => {
    const articulo = carpeta.articulos.find(candidate => candidate.id === item.articuloId);
    const existingQuantity = transportExistingSubcarpeta?.articulosEmbarque.find(candidate => candidate.articuloId === item.articuloId)?.cantidad ?? 0;
    const assignedInOtherShipments = Math.max(0, (articulo?.cantidadAsignada ?? 0) - existingQuantity);
    const saldoDisponible = Math.max(0, (articulo?.cantidadSolicitada ?? 0) - assignedInOtherShipments);
    return {
      ...item,
      cantidadSolicitada: articulo?.cantidadSolicitada ?? 0,
      cantidadAsignada: assignedInOtherShipments,
      saldoDisponible,
      saldoPosterior: saldoDisponible - item.cantidad,
      excedeSaldo: item.cantidad > saldoDisponible,
    };
  });
  const transportExceptionRows = transportBalanceRows.filter(item => item.excedeSaldo);
  const transportContainerCount = new Set(transportItemsToAssign.map(item => item.contenedor).filter(Boolean)).size;
  const transportFolderMatches = !transportDraft?.carpetaReferencia || transportDraft.carpetaReferencia === carpeta.numero;
  const canReviewTransport = Boolean(
    transportFolderMatches
    &&
    transportDraft?.numeroDocumento.trim()
    && transportDraft?.fechaEmbarqueReal
    && transportItemsToAssign.length > 0
    && transportItemsToAssign.every(item => item.cantidad > 0)
    && transportBalanceRows.every(item => !item.excedeSaldo),
  );
  const transportIssueMessages = [
    !transportFolderMatches && `corresponde a la carpeta ${transportDraft?.carpetaReferencia}, no a ${carpeta.numero}`,
    !transportDraft?.numeroDocumento.trim() && 'no se identificó el número de BL',
    !transportDraft?.fechaEmbarqueReal && 'no se identificó la fecha de salida',
    transportItemsToAssign.length === 0 && 'no se identificaron artículos',
    transportExceptionRows.length > 0 && `${transportExceptionRows.length} artículo${transportExceptionRows.length === 1 ? '' : 's'} excede${transportExceptionRows.length === 1 ? '' : 'n'} el saldo disponible`,
  ].filter(Boolean).join('; ');

  const confirmTransportAttachment = () => {
    if (!selectedFile || !transportDraft || !canReviewTransport || !onUpdateCarpeta) return;
    const existingSubcarpeta = subcarpetas.find(sub => sub.blCrtAwb === transportDraft.numeroDocumento.trim());
    const usedLetters = subcarpetas.map(sub => sub.numero.split('-').pop() as SubLetter);
    const nextTransportLetter = SUB_LETTERS.find(letter => !usedLetters.includes(letter));
    if (!existingSubcarpeta && !nextTransportLetter) return;
    const subcarpetaId = existingSubcarpeta?.id ?? `s_${Date.now()}`;
    const uniqueContainers = [...new Set(transportItemsToAssign.map(item => item.contenedor).filter(Boolean))];
    const document: Documento = {
      id: (carpeta.documentos ?? []).find(candidate => candidate.tipo === 'Bill of Lading / CRT' && candidate.referencia === transportDraft.numeroDocumento.trim())?.id ?? `doc-${Date.now()}`,
      nombre: selectedFile.name,
      referencia: transportDraft.numeroDocumento.trim(),
      subcarpetaIds: [subcarpetaId],
      tipo: 'Bill of Lading / CRT',
      tamano: `${Math.max(1, Math.round(selectedFile.size / 1024))} KB`,
      fecha: new Date().toISOString().split('T')[0],
      visibilidad: 'Solo Importaciones y Dirección',
      estadoValidacion: 'Aprobado',
    };
    const articulosEmbarque = transportItemsToAssign.map(item => ({
      articuloId: item.articuloId,
      cantidad: item.cantidad,
      contenedores: item.contenedor ? [item.contenedor] : [],
    }));
    const nextSubcarpeta: Subcarpeta = existingSubcarpeta ? {
      ...existingSubcarpeta,
      transporte: transportDraft.transporte,
      buqueForwarder: transportDraft.buqueForwarder,
      blCrtAwb: transportDraft.numeroDocumento.trim(),
      contenedores: uniqueContainers.length,
      estado: 'En Tránsito',
      eta: transportDraft.eta,
      fechaEmbarqueReal: transportDraft.fechaEmbarqueReal,
      articulosEmbarque,
    } : {
      id: subcarpetaId,
      numero: `${carpeta.numero}-${nextTransportLetter}`,
      facturaNum: '',
      fechaFactura: '',
      importeTotal: 0,
      pesoNeto: 0,
      pesoBruto: 0,
      ume: 0,
      umeUnidad: 'Kg',
      transporte: transportDraft.transporte,
      buqueForwarder: transportDraft.buqueForwarder,
      blCrtAwb: transportDraft.numeroDocumento.trim(),
      contenedores: uniqueContainers.length,
      despachante: '',
      estado: 'En Tránsito',
      canalAduana: 'Pendiente',
      duaNum: '',
      eta: transportDraft.eta,
      fechaEmbarqueReal: transportDraft.fechaEmbarqueReal,
      documentos: [],
      articulosEmbarque,
      incidencias: [],
      pedidoSAP55: '',
      ingresoSAP18: '',
    };
    const existingDocument = (carpeta.documentos ?? []).find(candidate => candidate.id === document.id);
    onUpdateCarpeta({
      ...carpeta,
      documentos: existingDocument
        ? (carpeta.documentos ?? []).map(candidate => candidate.id === existingDocument.id ? document : candidate)
        : [...(carpeta.documentos ?? []), document],
      subcarpetas: existingSubcarpeta
        ? subcarpetas.map(sub => sub.id === existingSubcarpeta.id ? nextSubcarpeta : sub)
        : [...subcarpetas, nextSubcarpeta],
      ultimoHito: `Documento ${transportDraft.numeroDocumento.trim()} revisado. Embarque ${nextSubcarpeta.numero} ${existingSubcarpeta ? 'actualizado' : 'creado'} y en tránsito.`,
    });
    closeUploadFlow();
  };

  const reportTransportDifference = () => {
    if (!selectedFile || !transportDraft || !onUpdateCarpeta) return;
    const document: Documento = {
      id: `doc-${Date.now()}`,
      nombre: selectedFile.name,
      referencia: transportDraft.numeroDocumento.trim() || referencia.trim() || undefined,
      tipo: 'Bill of Lading / CRT',
      tamano: `${Math.max(1, Math.round(selectedFile.size / 1024))} KB`,
      fecha: new Date().toISOString().split('T')[0],
      visibilidad: 'Solo Importaciones y Dirección',
      estadoValidacion: 'Reclamo abierto',
    };
    onUpdateCarpeta({
      ...carpeta,
      documentos: [...(carpeta.documentos ?? []), document],
      ultimoHito: `Reclamo abierto por diferencias detectadas en ${selectedFile.name}.`,
    });
    closeUploadFlow();
  };

  const returnToUploadModal = () => {
    closeValidationWizard();
  };

  const generateComparisonItems = (articulos: any[], isInvoice: boolean, forceMatch = false) => {
    return articulos.map((art, idx) => {
      // translation simulation
      let docDesc = art.descripcion;
      if (docDesc.toLowerCase().includes('estucado')) docDesc = 'Coated Fine Paper 115g/m2';
      else if (docDesc.toLowerCase().includes('offset')) docDesc = 'Uncoated Woodfree Offset Paper';
      else if (docDesc.toLowerCase().includes('vinilo')) docDesc = 'Self-Adhesive White Vinyl Matte';
      else if (docDesc.toLowerCase().includes('film')) docDesc = 'Metalized Polyester Film';
      else docDesc = art.descripcion + ' (English translation)';

      // Mock behavior: allow explicit "OK" retries to simulate a clean match.
      const hasDiscrepancy = !forceMatch && idx === 0;
      const docCant = hasDiscrepancy ? Math.round(art.cantidadSolicitada * 0.95) : art.cantidadSolicitada;
      const docPrecio = art.precioUnitario;

      return {
        articuloId: art.id,
        codigoSAP: art.codigoSAP,
        descripcionOC: art.descripcion,
        descripcionDoc: docDesc,
        cantOC: art.cantidadSolicitada,
        cantDoc: docCant,
        precioOC: art.precioUnitario,
        precioDoc: docPrecio,
        um: art.um,
        status: hasDiscrepancy ? 'Diferencia Cantidad' : 'Coincide'
      };
    });
  };

  const handleValidationFinish = (action: 'accept' | 'report') => {
    if (!selectedFile) return;

    const confirmationIsConforme = tipo === 'Confirmación de Pedido' && confirmationComparison
      ? supplierConfirmationMatches(confirmationComparison)
      : undefined;
    const hasDifferences = confirmationIsConforme === undefined
      ? validationResult.some(item => item.status !== 'Coincide')
      : !confirmationIsConforme;
    if (action === 'accept' && hasDifferences) return;

    const docId = `doc-${Date.now()}`;
    const resolvedValidationState = action === 'accept' ? 'Aprobado' : 'Reclamo abierto';
    const newDoc: Documento = {
      id: docId,
      nombre: selectedFile.name,
      referencia: referencia.trim() || undefined,
      tipo,
      tamano: `${Math.max(1, Math.round(selectedFile.size / 1024))} KB`,
      fecha: new Date().toISOString().split('T')[0],
      visibilidad,
      estadoValidacion: resolvedValidationState,
      comparacionConfirmacion: tipo === 'Confirmación de Pedido' ? confirmationComparison : undefined,
    };

    if (onUpdateCarpeta) {
      const firstArticleId = validationResult[0]?.articuloId;
      const updatedArticulos = carpeta.articulos.map(art => {
        if (action === 'accept') {
          return {
            ...art,
            estadoValidacion: 'Válido' as const,
          };
        }

        return {
          ...art,
          estadoValidacion: art.estadoValidacion === 'Válido' ? art.estadoValidacion : 'Con advertencia' as const,
        };
      });

      const ultimoHito = action === 'accept'
        ? `Documento ${selectedFile.name} validado automáticamente sin diferencias.`
        : `Se registró un reclamo por diferencias detectadas en ${selectedFile.name}.`;

      const documentosMadreBase = (carpeta.documentos ?? []).map((doc: Documento) => (
        action === 'accept' && target === 'madre' && doc.tipo === tipo && doc.estadoValidacion === 'Reclamo abierto'
          ? { ...doc, estadoValidacion: 'Reclamo resuelto' }
          : doc
      ));

      const documentosMadre = target === 'madre'
        ? [...documentosMadreBase, newDoc]
        : documentosMadreBase;

      const subcarpetasActualizadas = carpeta.subcarpetas.map(sub => {
        if (sub.id !== target) {
          return sub;
        }

        const documentosActualizados = sub.documentos.map((doc: Documento) => (
          action === 'accept' && doc.tipo === tipo && doc.estadoValidacion === 'Reclamo abierto'
            ? { ...doc, estadoValidacion: 'Reclamo resuelto' }
            : doc
        ));

        return {
          ...sub,
          documentos: [...documentosActualizados, newDoc],
        };
      });

      onUpdateCarpeta({
        ...carpeta,
        documentos: documentosMadre,
        subcarpetas: subcarpetasActualizadas,
        articulos: updatedArticulos,
        controlConforme: tipo === 'Confirmación de Pedido' ? action === 'accept' : carpeta.controlConforme,
        ultimoHito,
      });
    } else {
      onAddDocumento(newDoc, target);
    }

    // Reset wizard
    closeValidationWizard();
    setReferencia('');
    setSelectedFile(null);
    setConfirmationComparison(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowUploadModal(false);
  };

  const handleAttach = () => {
    if (!canAttach) return;
    onAddDocumento({
      id: `doc-${Date.now()}`,
      nombre: selectedFile!.name,
      referencia: referencia.trim() || undefined,
      tipo,
      tamano: `${Math.max(1, Math.round(selectedFile!.size / 1024))} KB`,
      fecha: new Date().toISOString().split('T')[0],
      visibilidad: visibilidad as any,
      estadoValidacion: 'Pendiente',
    } as any, target);
    setReferencia('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowUploadModal(false);
  };

  const qualifiesForValidation = tipo === 'Confirmación de Pedido' || tipo === 'Factura Comercial';
  const isTransportDocument = tipo === 'Bill of Lading / CRT';
  const documentDefaults = resolveDocumentDefaults(tipo);
  const showUploadTargetField = subcarpetas.length > 1 && !documentDefaults.belongsToMother;
  const validationWizardSteps = [
    { id: 'loading', label: 'Análisis' },
    { id: 'comparison', label: 'Resultado' },
  ] as const;
  const validationDifferences = validationResult.filter(item => item.status !== 'Coincide');
  const confirmationMetadataDifferences = tipo === 'Confirmación de Pedido' && confirmationComparison
    ? [
        !confirmationComparison.carpetaCoincide && 'carpeta',
        !confirmationComparison.incotermCoincide && 'Incoterm',
        !confirmationComparison.monedaCoincide && 'moneda',
      ].filter(Boolean) as string[]
    : [];
  const hasValidationDifferences = validationDifferences.length > 0 || confirmationMetadataDifferences.length > 0;
  const validationMatchesCount = validationResult.length - validationDifferences.length;
  const validationStepIndex = validationWizardSteps.findIndex(step => step.id === wizardStep) + 1;
  const validationStepLabel = validationWizardSteps.find(step => step.id === wizardStep)?.label ?? 'Resultado';
  const uploadWizardSteps = [
    { id: 1, label: 'Archivo' },
    { id: 2, label: isTransportDocument ? 'Validación' : 'Clasificación' },
    ...(!isTransportDocument ? [{ id: 3, label: 'Análisis' }] : []),
  ];
  const uploadStepIndex = !selectedFile ? 1 : showValidationWizard ? 3 : 2;
  const uploadStepLabel = uploadWizardSteps.find(step => step.id === uploadStepIndex)?.label ?? 'Archivo';
  const getStepperTemplateColumns = (steps: readonly { id: string | number; label: string }[]) => (
    steps.map((_, index) => index < steps.length - 1 ? '22px minmax(24px, 1fr)' : '22px').join(' ')
  );
  const validationStepperColumns = getStepperTemplateColumns(validationWizardSteps);
  const uploadStepperColumns = getStepperTemplateColumns(uploadWizardSteps);
  const uploadHasDenseContent = showValidationWizard;
  const uploadModalWidth = isMobile
    ? '100vw'
    : uploadHasDenseContent
      ? 'min(1440px, calc(100vw - 48px))'
      : isTransportDocument
        ? 'min(900px, calc(100vw - 48px))'
        : 'min(760px, calc(100vw - 48px))';
  const uploadModalHeight = isMobile
    ? '100dvh'
    : uploadHasDenseContent
      ? 'calc(100dvh - 48px)'
      : isTransportDocument
        ? 'auto'
        : 'min(860px, calc(100dvh - 48px))';
  const renderWizardStepper = (
    steps: readonly { id: string | number; label: string }[],
    activeStep: string | number,
    activeIndex: number,
    templateColumns: string,
  ) => (
    <div style={{ display: 'grid', gridTemplateColumns: templateColumns, rowGap: 8, columnGap: 0, alignItems: 'center', width: '100%', boxSizing: 'border-box', padding: isMobile ? '0 22px' : 0 }}>
      {steps.map((step, index) => {
        const active = step.id === activeStep;
        const completed = index < activeIndex - 1;
        const connectorCompleted = index < activeIndex - 1;

        return (
          <Fragment key={step.id}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: completed || active ? GREEN : CANVAS, color: completed || active ? '#fff' : MUTED, border: completed || active ? 'none' : `1px solid ${HAIRLINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
              {index + 1}
            </div>
            {index < steps.length - 1 && <div style={{ height: 2, background: connectorCompleted ? GREEN : HAIRLINE }} />}
          </Fragment>
        );
      })}
      {steps.map((step, index) => {
        const active = step.id === activeStep;
        const completed = index < activeIndex - 1;

        return (
          <Fragment key={`${step.id}-label`}>
            <div style={{ width: isMobile ? 64 : 72, marginLeft: isMobile ? -21 : -25, fontSize: 10, lineHeight: 1.2, fontWeight: active ? 700 : 500, color: active || completed ? INK : MUTED, textAlign: 'center' }}>{step.label}</div>
            {index < steps.length - 1 && <div />}
          </Fragment>
        );
      })}
    </div>
  );
  const validationDifferenceSummary = confirmationMetadataDifferences.length > 0
    ? `No coincide: ${confirmationMetadataDifferences.join(', ')}.`
    : validationDifferences[0]
    ? (() => {
        const item = validationDifferences[0];
        const desvioCantidad = item.cantOC - item.cantDoc;
        const desvioPct = item.cantOC > 0 ? ` (${((desvioCantidad / item.cantOC) * 100).toFixed(0)}%)` : '';
        return `${item.codigoSAP} · ${item.descripcionOC}: OC ${item.cantOC.toLocaleString()} ${item.um} vs. documento ${item.cantDoc.toLocaleString()} ${item.um}. Desvío: ${desvioCantidad.toLocaleString()} ${item.um}${desvioPct}.`;
      })()
    : `${validationMatchesCount} artículo${validationMatchesCount === 1 ? '' : 's'} coincide${validationMatchesCount === 1 ? '' : 'n'} con la OC.`;
  const validationResultTitle = hasValidationDifferences
    ? 'Se detecto una diferencia'
    : 'Documento listo para aprobar';
  const validationResultTone = hasValidationDifferences
    ? {
        border: 'rgba(180,83,9,0.24)',
        background: 'rgba(180,83,9,0.06)',
        iconBackground: 'rgba(180,83,9,0.14)',
        iconColor: '#b45309',
        titleColor: '#8a4b08',
      }
    : {
        border: 'rgba(26,92,56,0.18)',
        background: 'rgba(26,92,56,0.04)',
        iconBackground: 'rgba(26,92,56,0.10)',
        iconColor: GREEN,
        titleColor: GREEN,
      };
  const validationResultNextStep = hasValidationDifferences
    ? 'No se puede aprobar. Si hay reclamo, se espera una nueva version para volver a comparar.'
    : 'Podes aprobar este documento y seguir con la carpeta.';
  const uploadAnexoAction = !readonly ? (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
      <AppButton
        type="button"
        variant="primary"
        size="md"
        onClick={() => {
          setSelectedFile(null);
          setReferencia('');
          setTipo('Packing List');
          setTipoSugerido(null);
          setTarget('madre');
          setVisibilidad('Todos');
          setTransportDraft(null);
          setShowUploadModal(true);
        }}
        icon={<Upload size={14} />}
      >
        Adjuntar anexo
      </AppButton>
    </div>
  ) : undefined;

  return (
    <div style={{ padding: isMobile ? DETAIL_TAB_PANEL_PADDING_MOBILE : DETAIL_TAB_PANEL_PADDING_DESKTOP, display: 'flex', flexDirection: 'column', gap: DETAIL_TAB_PANEL_GAP, background: CANVAS }}>
      {allDocs.length > 0 ? (
        <TabIntro
          title="Anexos de la carpeta"
          subtitle="Confirmaciones y facturas se validan contra la OC. Los demás anexos siguen controles documentales propios."
          overlayActions={!isMobile}
          actions={uploadAnexoAction}
        />
      ) : null}

      {filteredDocs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', background: CANVAS }}>
          {visibleDocs.map((doc: any, i: number) => {
            const color = tipoColors[doc.tipo] || MUTED;
            return (
              <div key={doc.id} style={{ padding: isMobile ? '14px 16px' : '14px 18px', borderBottom: i < visibleDocs.length - 1 ? `1px solid ${HAIRLINE}` : 'none', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.4fr) auto', gap: isMobile ? 10 : 16, alignItems: 'center', background: 'transparent' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.nombre}</div>
                  {doc.referencia && <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Ref. {doc.referencia}</div>}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {doc.hasVersionHistory && (
                      <span style={{ fontSize: 11, color: doc.isCurrentVersion ? '#1d4ed8' : '#475569', background: doc.isCurrentVersion ? '#eff6ff' : '#f8fafc', border: `1px solid ${doc.isCurrentVersion ? '#bfdbfe' : '#cbd5e1'}`, borderRadius: 9999, padding: '3px 8px' }}>
                        {doc.isCurrentVersion ? 'Anexo vigente' : 'Versión anterior'}
                      </span>
                    )}
                    <span style={{ fontSize: 11, color, background: `${color}14`, border: `1px solid ${color}33`, borderRadius: 9999, padding: '3px 8px' }}>{doc.tipo}</span>
                    <span style={{ fontSize: 11, color: GREEN, background: 'rgba(26,92,56,0.08)', border: '1px solid rgba(26,92,56,0.18)', borderRadius: 9999, padding: '3px 8px' }}>{doc.origen}</span>
                    {doc.visibilidad && doc.visibilidad !== 'Todos' && (
                      <span style={{ fontSize: 11, color: '#d97706', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 9999, padding: '3px 8px' }}>{doc.visibilidad}</span>
                    )}
                    {doc.estadoValidacion && (() => {
                      const validationStyles = doc.estadoValidacion === 'Reclamo abierto'
                        ? { color: '#b91c1c', background: '#fef2f2', border: '#fecaca' }
                        : doc.estadoValidacion === 'Reclamo resuelto'
                          ? { color: '#0369a1', background: '#f0f9ff', border: '#bae6fd' }
                          : doc.estadoValidacion === 'Aprobado'
                            ? { color: '#059669', background: '#ecfdf5', border: '#a7f3d0' }
                          : doc.estadoValidacion === 'Aprobado con diferencias'
                            ? { color: '#b45309', background: '#fffbeb', border: '#fde68a' }
                            : { color: '#059669', background: '#ecfdf5', border: '#a7f3d0' };

                      return (
                        <span style={{ fontSize: 11, color: validationStyles.color, background: validationStyles.background, border: `1px solid ${validationStyles.border}`, borderRadius: 9999, padding: '3px 8px' }}>{doc.estadoValidacion}</span>
                      );
                    })()}
                  </div>
                </div>
                <div style={{ display: 'grid', justifyItems: isMobile ? 'start' : 'end', gap: 8 }}>
                  <div style={{ fontSize: 12, color: MUTED }}>{doc.tamano} · {doc.fecha}</div>
                  <AppButton size="sm" variant="tertiary">Ver</AppButton>
                </div>
              </div>
            );
          })}
        </div>
      ) : allDocs.length === 0 ? (
        <TabEmptyPlaceholder
          title="Sin anexos cargados"
          description="Todavía no hay documentación adjunta para esta carpeta ni sus embarques."
          padding="8px 0 0"
          action={uploadAnexoAction}
        />
      ) : (
        <TabEmptyPlaceholder
          title="Sin anexos visibles"
          description="No hay anexos disponibles para tu perfil con la configuración de visibilidad actual."
          padding="8px 0 0"
        />
      )}

      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 350, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 0 : 24 }}>
          <div role="dialog" aria-modal="true" aria-labelledby="attachment-wizard-title" style={{ width: uploadModalWidth, height: uploadModalHeight, maxHeight: isMobile ? '100dvh' : 'calc(100dvh - 48px)', background: CANVAS, border: isMobile ? 'none' : `1px solid ${HAIRLINE}`, borderRadius: isMobile ? 0 : 16, boxShadow: isMobile ? 'none' : '0 25px 60px rgba(15, 23, 42, 0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: isMobile ? '14px 16px' : '16px 28px', borderBottom: `1px solid ${HAIRLINE}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
              <div>
                <h2 id="attachment-wizard-title" style={{ margin: 0, ...DETAIL_TYPE_SCALE.h3, fontWeight: 700 }}>
                  Adjuntar anexo
                </h2>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{`Paso ${uploadStepIndex} · ${uploadStepLabel}`}</div>
              </div>
              <AppButton type="button" aria-label="Cerrar" title="Cerrar" variant="tertiary" size="sm" onClick={closeUploadFlow} icon={<X size={14} color={MUTED} />} style={{ borderRadius: 9999 }} />
            </div>

            <div style={{ padding: isMobile ? '12px 20px 0' : '16px 28px 0', flexShrink: 0 }}>
              {renderWizardStepper(uploadWizardSteps, uploadStepIndex, uploadStepIndex, uploadStepperColumns)}
            </div>

            {/* Modal Body / Scrollable Content */}
            <div style={{ padding: isMobile ? '16px' : '20px 28px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, flex: '1 1 auto', minHeight: 0 }}>
              {showValidationWizard ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: '1 1 auto', minHeight: 0 }}>
                  <button
                    type="button"
                    onClick={returnToUploadModal}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 0',
                      border: 'none',
                      background: 'transparent',
                      color: GREEN,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                    }}
                  >
                    <ArrowLeft size={14} /> Volver
                  </button>

                  {wizardStep === 'loading' && (
                    <div style={{ textAlign: 'center', padding: '48px 16px', flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ width: 44, height: 44, border: '3px solid #e2e8f0', borderTopColor: '#059669', borderRadius: 9999, animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: INK }}>Analizando {selectedFile?.name}...</h4>
                      <p style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>
                        Comparando artículos y cantidades contra la OC.
                      </p>
                    </div>
                  )}

                  {wizardStep === 'comparison' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: '1 1 auto', minHeight: 0 }}>
                      <div style={{ border: `1px solid ${validationResultTone.border}`, borderRadius: 12, background: validationResultTone.background, padding: isMobile ? 14 : '16px 18px', display: 'flex', gap: 14, alignItems: isMobile ? 'flex-start' : 'center' }}>
                        <div style={{ width: 42, height: 42, borderRadius: '50%', background: validationResultTone.iconBackground, color: validationResultTone.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {hasValidationDifferences ? <AlertTriangle size={22} strokeWidth={2.4} /> : <CheckCircle size={22} strokeWidth={2.4} />}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: validationResultTone.titleColor }}>{validationResultTitle}</div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#0e7490', background: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: 9999, padding: '3px 8px' }}>Confianza {hasValidationDifferences ? '87%' : '96%'}</span>
                          </div>
                          <div style={{ marginTop: 4, fontSize: 12, color: INK, lineHeight: 1.4 }}>{validationDifferenceSummary}</div>
                          <div style={{ marginTop: 2, fontSize: 11.5, color: MUTED, lineHeight: 1.4 }}>{validationResultNextStep}</div>
                        </div>
                      </div>
                      <div style={{ flex: '1 1 auto', minHeight: 220, overflow: 'auto', border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: CANVAS }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '86px minmax(180px, 1fr) 110px 110px 110px' : '110px minmax(260px, 1fr) 140px 140px 130px', gap: 10, padding: '10px 12px', minWidth: isMobile ? 640 : 820, background: '#f7f8f7', position: 'sticky', top: 0, zIndex: 1, borderBottom: `1px solid ${HAIRLINE}` }}>
                          {['SKU', 'Artículo', 'Cantidad OC', 'Documento', 'Resultado'].map(label => <span key={label} style={{ fontSize: 10.5, fontWeight: 700, color: MUTED }}>{label}</span>)}
                        </div>
                        {validationResult.map(item => (
                          <div key={item.articuloId} style={{ display: 'grid', gridTemplateColumns: isMobile ? '86px minmax(180px, 1fr) 110px 110px 110px' : '110px minmax(260px, 1fr) 140px 140px 130px', gap: 10, padding: '11px 12px', minWidth: isMobile ? 640 : 820, alignItems: 'center', borderBottom: `1px solid ${HAIRLINE}` }}>
                            <span style={{ fontSize: 12, fontWeight: 700 }}>{item.codigoSAP}</span>
                            <span style={{ fontSize: 12 }}>{item.descripcionOC}</span>
                            <span style={{ fontSize: 12 }}>{item.cantOC.toLocaleString()} {item.um}</span>
                            <span style={{ fontSize: 12 }}>{item.cantDoc.toLocaleString()} {item.um}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: item.status === 'Coincide' ? GREEN : '#c4001a' }}>{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: '1 1 auto', minHeight: 0 }}>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 0',
                        border: 'none',
                        background: 'transparent',
                        color: GREEN,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        alignSelf: 'flex-start',
                      }}
                    >
                      <ArrowLeft size={14} /> Volver
                    </button>
                  )}
                  <div
                    onDragOver={event => { event.preventDefault(); setIsDragActive(true); }}
                    onDragEnter={event => { event.preventDefault(); setIsDragActive(true); }}
                    onDragLeave={event => {
                      event.preventDefault();
                      const nextTarget = event.relatedTarget as Node | null;
                      if (!nextTarget || !event.currentTarget.contains(nextTarget)) setIsDragActive(false);
                    }}
                    onDrop={event => {
                      event.preventDefault();
                      setIsDragActive(false);
                      const file = event.dataTransfer.files?.[0];
                      if (file) handleSelectedFile(file);
                    }}
                    style={{ border: `2px dashed ${isDragActive ? GREEN : HAIRLINE}`, borderRadius: 18, background: isDragActive ? 'rgba(26,92,56,0.06)' : PARCHMENT, padding: 14, transition: 'border-color 0.15s, background 0.15s', flex: selectedFile ? '0 0 auto' : '1 1 auto', display: 'flex', alignItems: selectedFile ? 'stretch' : 'center' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input ref={fileInputRef} type="file" onChange={event => handleSelectedFile(event.target.files?.[0] ?? null)} style={{ display: 'none' }} />
                    <div style={{ display: 'flex', flexDirection: selectedFile ? 'row' : 'column', alignItems: selectedFile ? 'center' : 'center', justifyContent: selectedFile ? 'space-between' : 'center', gap: selectedFile ? 12 : 14, flexWrap: 'wrap', width: '100%', textAlign: selectedFile ? 'left' : 'center' }}>
                      <div style={{ minWidth: 0 }}>
                        {selectedFile ? (
                          <>
                            <div style={{ fontSize: 13, fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile.name}</div>
                            <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{Math.max(1, Math.round(selectedFile.size / 1024))} KB · Tipo sugerido: <strong>{tipoSugerido ?? tipo}</strong></div>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>Sin archivo adjunto</div>
                            <div style={{ fontSize: 11, color: MUTED, marginTop: 4, maxWidth: 240 }}>Arrastrá un archivo o adjuntalo desde tu equipo.</div>
                          </>
                        )}
                      </div>
                      {!selectedFile ? (
                        <button type="button" onClick={event => { event.stopPropagation(); fileInputRef.current?.click(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 38, padding: '8px 12px', borderRadius: 9999, border: `1px solid ${GREEN}`, background: CANVAS, color: GREEN, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          <Upload size={14} /> Adjuntar anexo
                        </button>
                      ) : (
                        <button type="button" onClick={(event) => { event.stopPropagation(); handleSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, padding: 0, borderRadius: 9999, border: 'none', background: 'rgba(196,0,26,0.06)', color: '#c4001a', cursor: 'pointer' }}>
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedFile && (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {showUploadTargetField ? (
                          <FormField label="Referencia o Nombre descriptivo">
                            <input value={referencia} onChange={event => setReferencia(event.target.value)} placeholder="Ej. Packing List de embarque A" style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 13, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
                          </FormField>
                        ) : null}

                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                          {!showUploadTargetField && (
                            <FormField label="Referencia o Nombre descriptivo">
                              <input value={referencia} onChange={event => setReferencia(event.target.value)} placeholder="Ej. Packing List de embarque A" style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 13, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
                            </FormField>
                          )}

                          <FormField label="Tipo de documento">
                            <Select value={tipo} onValueChange={(v) => setTipo(v as any)}>
                              <AppSelectTrigger>
                                <SelectValue />
                              </AppSelectTrigger>
                              <AppSelectContent style={{ zIndex: 400 }}>
                                {Object.keys(tipoColors).map(item => <AppSelectItem key={item} value={item}>{item}</AppSelectItem>)}
                              </AppSelectContent>
                            </Select>
                          </FormField>

                          {showUploadTargetField ? (
                            <FormField label="Embarque">
                              <Select value={target} onValueChange={setTarget}>
                                <AppSelectTrigger>
                                  <SelectValue />
                                </AppSelectTrigger>
                                <AppSelectContent style={{ zIndex: 400 }}>
                                  {subcarpetas.map(sub => <AppSelectItem key={sub.id} value={sub.id}>{sub.numero}</AppSelectItem>)}
                                </AppSelectContent>
                              </Select>
                            </FormField>
                          ) : null}
                        </div>
                        <div style={{ padding: '10px 12px', border: `1px solid ${qualifiesForValidation ? 'rgba(26,92,56,0.18)' : HAIRLINE}`, borderRadius: 10, background: qualifiesForValidation ? 'rgba(26,92,56,0.04)' : '#f7f8f7', fontSize: 12, lineHeight: 1.5, color: INK }}>
                          {qualifiesForValidation ? (
                            <>
                              <strong>Validación VAL contra la OC.</strong> El sistema procesa el archivo, extrae artículos y confianza, recupera la OC y compara SKU, descripción y cantidad. Luego muestra el resultado para aprobar, cancelar o registrar un reclamo.
                            </>
                          ) : isTransportDocument ? (
                            <>
                              <strong>Validación logística.</strong> El sistema verifica la referencia, fechas, artículos y contenedores antes de crear el embarque. Este documento no utiliza VAL contra la OC.
                            </>
                          ) : (
                            <>
                              <strong>Anexo documental.</strong> Se clasifica y vincula a la carpeta o al embarque, sin comparación VAL contra la OC.
                            </>
                          )}
                        </div>
                        {isTransportDocument && transportDraft && (
                          canReviewTransport ? (
                            <div style={{ display: 'grid', gap: 16 }}>
                              <div style={{ padding: isMobile ? 16 : 20, border: '1px solid rgba(26,92,56,0.20)', borderRadius: 12, background: 'rgba(26,92,56,0.04)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(26,92,56,0.12)', color: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckCircle size={20} /></div>
                                <div>
                                  <div style={{ fontSize: 15, fontWeight: 700, color: GREEN }}>BL lista para revisar</div>
                                  <div style={{ marginTop: 4, fontSize: 12.5, color: INK, lineHeight: 1.45 }}>No se detectaron diferencias. Verificá los datos principales antes de continuar.</div>
                                </div>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
                                <Field label="BL / CRT / AWB" value={transportDraft.numeroDocumento} />
                                <Field label="Carpeta" value={transportDraft.carpetaReferencia || carpeta.numero} />
                                <Field label="Salida" value={transportDraft.fechaEmbarqueReal} />
                                <Field label="ETA" value={transportDraft.eta || 'No informada'} />
                                <Field label="Artículos detectados" value={transportItemsToAssign.length} />
                                <Field label="Contenedores" value={transportContainerCount || 'No informados'} />
                              </div>
                            </div>
                          ) : (
                            <div style={{ padding: isMobile ? 16 : 20, border: '1px solid rgba(196,0,26,0.20)', borderRadius: 12, background: 'rgba(196,0,26,0.04)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(196,0,26,0.10)', color: '#c4001a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AlertTriangle size={20} /></div>
                              <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#9f0712' }}>No se puede crear el embarque</div>
                                <div style={{ marginTop: 4, fontSize: 12.5, color: INK, lineHeight: 1.45 }}>La BL {transportIssueMessages}. Registrá el reclamo y adjuntá una nueva versión corregida.</div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 'auto', paddingTop: 18 }}>
                    <button type="button" onClick={closeUploadFlow} style={{ ...getModalSecondaryButtonStyle(), flex: '0 0 auto', width: 'auto', minWidth: 'max-content', whiteSpace: 'nowrap', padding: '10px 12px', fontSize: 13 }}>
                      Cancelar
                    </button>
                    {selectedFile && (
                      <AppButton
                        type="button"
                        variant={isTransportDocument && !canReviewTransport ? 'danger-soft' : 'primary'}
                        onClick={() => {
                          if (isTransportDocument) {
                            if (canReviewTransport) confirmTransportAttachment();
                            else reportTransportDifference();
                            return;
                          }
                          if (qualifiesForValidation) {
                            startValidation();
                            return;
                          }
                          handleAttach();
                        }}
                      >
                        {isTransportDocument ? canReviewTransport ? 'Aceptar y crear embarque' : 'Registrar reclamo' : qualifiesForValidation ? 'Analizar documento' : 'Adjuntar anexo'}
                      </AppButton>
                    )}
                  </div>
                </div>
              )}

              {showValidationWizard && (
                <div style={{ paddingTop: 14, borderTop: `1px solid ${HAIRLINE}`, background: '#fafbfd', position: 'sticky', bottom: 0, zIndex: 2 }}>
                  <div style={{ ...modalFooter, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button type="button" onClick={closeUploadFlow} style={{ ...getModalSecondaryButtonStyle(), flex: '0 0 auto', width: 'auto', minWidth: 'max-content', whiteSpace: 'nowrap', padding: '10px 12px', fontSize: 13 }}>
                      Cancelar
                    </button>

                    {wizardStep === 'comparison' && (
                      <>
                        {hasValidationDifferences && (
                          <button type="button" onClick={() => handleValidationFinish('report')} style={{ ...getModalSecondaryButtonStyle(), flex: '0 0 auto', padding: '10px 12px', fontSize: 13, borderColor: '#f87171', color: '#dc2626', background: '#fef2f2' }}>
                            Registrar reclamo
                          </button>
                        )}
                        {!hasValidationDifferences && (
                          <button type="button" onClick={() => handleValidationFinish('accept')} style={{ ...getModalPrimaryButtonStyle(true), flex: '0 0 auto', padding: '10px 14px', fontSize: 13 }}>
                            Aprobar resultado
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AduanaTab({ carpeta, subs, editable, hideImportes, onUpdateSubcarpeta, onUpdateCarpeta, onSelectSubcarpeta }: any) {
  const isMobile = useIsMobile();
  const subcarpetas = subs as Subcarpeta[];
  const [selectedSubId, setSelectedSubId] = useState<string>(subcarpetas[0]?.id ?? '');
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({
    despachante: '',
    duaNum: '',
    canalAduana: 'Pendiente',
    despachoTipo: '',
    gastosARS: '',
    vepUSD: '',
    fechaOficializacion: '',
    fechaSalidaPuerto: '',
    pedidoSAP55: '',
    pagoAduana: '',
    pagoMaritima: ''
  });

  // Despachantes reactive state
  const [despachantesList, setDespachantesList] = useState<any[]>(() => [...DESPACHANTES]);

  // Balance application modal state
  const [showSaldoModal, setShowSaldoModal] = useState(false);
  const [selectedDespachante, setSelectedDespachante] = useState<any>(null);
  const [saldoForm, setSaldoForm] = useState({
    monto: '',
    rendicion: 'REND-2026-0042',
    destino: subcarpetas[0]?.numero ?? '',
  });
  const [saldoSuccess, setSaldoSuccess] = useState(false);

  useEffect(() => {
    if (subcarpetas.length > 0 && !subcarpetas.some(item => item.id === selectedSubId)) setSelectedSubId(subcarpetas[0].id);
  }, [subcarpetas, selectedSubId]);

  const sub = subcarpetas.find(item => item.id === selectedSubId) ?? subcarpetas[0];
  if (!sub) {
    return (
      <TabEmptyPlaceholder
        title="Sin embarques para gestionar aduana"
        description="La carpeta todavía no tiene aperturas asociadas para cargar DUA, canal o pagos aduaneros."
        padding="16px"
      />
    );
  }

  useEffect(() => {
    setForm({
      despachante: sub.despachante || '',
      duaNum: sub.duaNum || '',
      canalAduana: sub.canalAduana || 'Pendiente',
      despachoTipo: sub.despachoTipo || '',
      gastosARS: sub.gastosARS ? String(sub.gastosARS) : '',
      vepUSD: sub.vepUSD ? String(sub.vepUSD) : '',
      fechaOficializacion: sub.fechaOficializacion || '',
      fechaSalidaPuerto: sub.fechaSalidaPuerto || '',
      pedidoSAP55: sub.pedidoSAP55 || '',
      pagoAduana: (sub as any).pagoAduana || '',
      pagoMaritima: (sub as any).pagoMaritima || '',
    });
  }, [sub.id, sub.despachante, sub.duaNum, sub.canalAduana, sub.despachoTipo, sub.gastosARS, sub.vepUSD, sub.fechaOficializacion, sub.fechaSalidaPuerto, sub.pedidoSAP55, (sub as any).pagoAduana, (sub as any).pagoMaritima]);

  if (onSelectSubcarpeta) {
    return (
      <div style={{ padding: isMobile ? DETAIL_TAB_PANEL_PADDING_MOBILE : DETAIL_TAB_PANEL_PADDING_DESKTOP, display: 'flex', flexDirection: 'column', background: CANVAS }}>
        <div style={{ display: 'flex', flexDirection: 'column', background: '#fafefd' }}>
          {subcarpetas.map((item, index) => {
            const canalMeta = getCanalInlineStyle(item.canalAduana);

            return (
              <div key={item.id} style={{ borderBottom: index < subcarpetas.length - 1 ? `1px solid ${GREEN_HAIRLINE_SOFT}` : 'none' }}>
                <div
                  onClick={() => onSelectSubcarpeta(item.id, 'aduana')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px 12px',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fafbfa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <TransportModeIcon transporte={item.transporte} size={15} compact />
                    <div>
                      <div style={{ fontSize: SHIPMENT_TYPE.title, fontWeight: 600, color: INK }}>{item.numero}</div>
                      <div style={{ fontSize: SHIPMENT_TYPE.companion, color: MUTED }}>{item.transporte} · ETA {item.eta || '—'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textTransform: 'uppercase', fontSize: SHIPMENT_TYPE.companion, color: MUTED, fontWeight: 500 }}>{item.contenedores || 0} cont.</div>
                    <NeonBadge estado={item.estado as any} size="xs" />
                    <ChevronRight size={14} style={{ color: '#98a2b3' }} />
                  </div>
                </div>
                <div style={{ padding: '2px 16px 16px 60px', background: 'transparent' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1.1fr 1fr 1fr 1fr', gap: 18, alignItems: 'start' }}>
                    <Field label="Despachante" value={getDespachante(item.despachante)?.nombre || '—'} />
                    <Field label="DUA" value={item.duaNum || '—'} color={item.duaNum ? INK : MUTED} />
                    <Field label="Pago aduana" value={(item as any).pagoAduana || 'Pendiente'} color={(item as any).pagoAduana ? INK : MUTED} />
                    <div>
                      <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Canal</div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 600, color: canalMeta.color, fontSize: 12.5 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: canalMeta.dot }} />
                        {canalMeta.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const saveAduana = () => {
    onUpdateSubcarpeta(sub.id, {
      despachante: form.despachante,
      duaNum: form.duaNum.trim(),
      canalAduana: form.canalAduana,
      despachoTipo: form.despachoTipo || undefined,
      gastosARS: form.gastosARS ? Number(form.gastosARS) : undefined,
      vepUSD: form.vepUSD ? Number(form.vepUSD) : undefined,
      fechaOficializacion: form.fechaOficializacion,
      fechaSalidaPuerto: form.fechaSalidaPuerto,
      pedidoSAP55: form.pedidoSAP55.trim(),
      pagoAduana: form.pagoAduana.trim() || undefined,
      pagoMaritima: form.pagoMaritima.trim() || undefined,
    } as any);
    setShowEditModal(false);
  };

  const handleExportSAP = (s: Subcarpeta) => {
    const headers = ['Tipo Transaccion', 'Nro Carpeta', 'Nro Embarque', 'Proveedor', 'DUA', 'Canal', 'Pedido Tx45', 'Pedido Tx55', 'Ingreso Tx18'];
    const rows = [
      ['AFIP-ADUANA', carpeta.numero, s.numero, getProveedor(carpeta.proveedorId)?.nombre || '', s.duaNum || '', s.canalAduana, carpeta.pedidoSAP45 || '', s.pedidoSAP55 || '', s.ingresoSAP18 || '']
    ];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SAP_EXPORT_${s.numero.replace('/', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openApplySaldo = (d: any) => {
    setSelectedDespachante(d);
    setSaldoForm({
      monto: String(Math.min(d.saldoFavor, 50000)),
      rendicion: `REND-2026-${Math.floor(Math.random() * 900) + 100}`,
      destino: sub.numero,
    });
    setSaldoSuccess(false);
    setShowSaldoModal(true);
  };

  const confirmApplySaldo = () => {
    const applyAmount = Number(saldoForm.monto);
    if (isNaN(applyAmount) || applyAmount <= 0 || applyAmount > selectedDespachante.saldoFavor) return;

    // 1. Mutate the local state and write back to mockData exported variable DESPACHANTES
    const updated = despachantesList.map(item => {
      if (item.id === selectedDespachante.id) {
        const newSaldo = item.saldoFavor - applyAmount;
        // Keep mutable state in sync
        const mainRef = DESPACHANTES.find(dm => dm.id === item.id);
        if (mainRef) mainRef.saldoFavor = newSaldo;
        return { ...item, saldoFavor: newSaldo };
      }
      return item;
    });

    setDespachantesList(updated);

    // 2. Mark the AFIP / VEP payment as compensated / HAY FONDOS
    const defaultPagos = [
      { id: '1', concepto: 'Factura Proveedor Exterior', monto: carpeta.montoTotal * 0.5, moneda: carpeta.moneda, vencimiento: '2026-04-10', estado: 'Pagado', fechaPago: '2026-04-10' },
      { id: '2', concepto: 'Factura Proveedor Exterior (saldo)', monto: carpeta.montoTotal * 0.5, moneda: carpeta.moneda, vencimiento: '2026-05-10', estado: 'Pendiente' },
      { id: '3', concepto: 'Flete Internacional', monto: 3200, moneda: 'USD', vencimiento: '2026-04-25', estado: 'Pagado', fechaPago: '2026-04-25' },
      { id: '4', concepto: 'Impuestos AFIP / VEP', monto: carpeta.vep || 1250000, moneda: 'ARS', vencimiento: '2026-05-28', estado: 'Pendiente' },
      { id: '5', concepto: 'Gastos Terminal', monto: carpeta.gastosTerminal || 680000, moneda: 'ARS', vencimiento: '2026-06-01', estado: 'Pendiente' },
    ];
    const currentPagos = carpeta.pagos || defaultPagos;
    const updatedPagos = currentPagos.map((p: any) => {
      if (p.id === '4' || p.concepto.includes('AFIP') || p.concepto.includes('VEP')) {
        return {
          ...p,
          estado: 'Pagado',
          fechaPago: new Date().toISOString().split('T')[0],
          concepto: `${p.concepto} (HAY FONDOS Aplicado)`,
        };
      }
      return p;
    });

    // 3. Update the subcarpeta to record pagoAduana as "HAY FONDOS"
    onUpdateSubcarpeta(sub.id, {
      pagoAduana: 'HAY FONDOS',
      pagoMaritima: (sub as any).pagoMaritima || 'W24'
    });

    if (onUpdateCarpeta) {
      onUpdateCarpeta({
        pagos: updatedPagos
      });
    }

    setSaldoSuccess(true);
  };

  return (
    <div style={{ padding: isMobile ? DETAIL_TAB_PANEL_PADDING_MOBILE : DETAIL_TAB_PANEL_PADDING_DESKTOP, display: 'grid', gap: DETAIL_TAB_PANEL_GAP, background: CANVAS }}>
        <TabIntro
          title="Gestión aduanera"
          subtitle="Estado aduanero, costos e imputaciones por embarque"
          actions={<div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
          {subcarpetas.length > 1 && (
            <Select value={selectedSubId} onValueChange={setSelectedSubId}>
              <SelectTrigger aria-label="Seleccionar embarque" style={{ width: isMobile ? '100%' : 220, minHeight: 38, borderRadius: 10, background: CANVAS }}><SelectValue placeholder="Seleccionar embarque" /></SelectTrigger>
              <SelectContent>{subcarpetas.map(item => <SelectItem key={item.id} value={item.id}>{item.numero} · {item.estado}</SelectItem>)}</SelectContent>
            </Select>
          )}
          
          <AppButton type="button" variant="secondary" icon={<Download size={13} />} onClick={() => handleExportSAP(sub)}>
            Exportar a SAP
          </AppButton>
          
          {editable && <AppButton type="button" icon={<Pencil size={13} />} onClick={() => setShowEditModal(true)}>Editar</AppButton>}
        </div>}
        />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Section 1: Estado Aduanero AFIP */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: DETAIL_TAB_SECTION_GAP }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, minmax(0, 1fr))', gap: 16 }}>
            <Field label="Despachante Aduanero" value={getDespachante(sub.despachante)?.nombre || '—'} />
            <Field label="N° Declaración Detallada (DUA)" value={sub.duaNum || '—'} color={sub.duaNum ? INK : MUTED} />
            <div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Canal Aduanero</div>
              <div style={{ display: 'inline-flex', gap: 6 }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: sub.canalAduana === 'Verde' ? '#1a7a4a' : sub.canalAduana === 'Rojo' ? '#c4001a' : MUTED,
                  background: sub.canalAduana === 'Verde' ? 'rgba(26,92,56,0.08)' : sub.canalAduana === 'Rojo' ? 'rgba(196,0,26,0.05)' : 'rgba(0,0,0,0.04)',
                  padding: '4px 12px',
                  borderRadius: 8,
                  border: `1px solid ${sub.canalAduana === 'Verde' ? 'rgba(26,92,56,0.18)' : sub.canalAduana === 'Rojo' ? 'rgba(196,0,26,0.15)' : 'rgba(0,0,0,0.08)'}`
                }}>
                  {sub.canalAduana || 'Pendiente'}
                </span>
              </div>
            </div>
            <Field label="Pago Aduana (AFIP/VEP)" value={
              (sub as any).pagoAduana === 'HAY FONDOS' ? (
                <span style={{ color: '#1a7a4a', fontWeight: 600, background: 'rgba(26,122,74,0.08)', padding: '2px 8px', borderRadius: 6 }}>HAY FONDOS</span>
              ) : (sub as any).pagoAduana || 'Pendiente'
            } />
            <Field label="Pago Marítima (Flete)" value={(sub as any).pagoMaritima || 'Pendiente'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1a7a4a', fontSize: 13, fontWeight: 500, marginTop: 4 }}>
            <CheckCircle size={15} />
            <span>OK Documental Despachante verificado para este parcial</span>
          </div>
        </div>

        {/* Section 2: Costos e Impuestos */}
        {!hideImportes && (
          <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP, display: 'flex', flexDirection: 'column', gap: DETAIL_TAB_SECTION_GAP }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Costos e Impuestos</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
              <Field label="Gastos de Terminal Portuaria (AR$)" value={`$ ${carpeta.gastosTerminal.toLocaleString()}`} />
              <Field label="Honorarios Despachante (AR$)" value={`$ ${carpeta.honorariosDespachante.toLocaleString()}`} />
              <Field label="Total Costos Locales (AR$)" value={<strong>$ {(carpeta.gastosTerminal + carpeta.honorariosDespachante).toLocaleString()}</strong>} />
            </div>
          </div>
        )}

        {/* Section 3: Gestión de Fondos Despachantes */}
        {!hideImportes && (
          <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP, display: 'flex', flexDirection: 'column', gap: DETAIL_TAB_SECTION_GAP }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Gestión de Fondos de Despachantes</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
              {despachantesList.map(d => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: INK }}>{d.nombre}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: d.saldoFavor > 0 ? '#1a7a4a' : MUTED }}>$ {d.saldoFavor.toLocaleString()}</span>
                    {d.saldoFavor > 0 && (
                      <AppButton size="sm" variant="secondary" onClick={() => openApplySaldo(d)}>
                        Aplicar saldo
                      </AppButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Referencias Cruzadas SAP */}
        <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP, display: 'flex', flexDirection: 'column', gap: DETAIL_TAB_SECTION_GAP }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Referencias Cruzadas SAP</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
            <Field label="Tx.45 — N° Pedido OC" value={carpeta.pedidoSAP45 || '—'} color={carpeta.pedidoSAP45 ? INK : MUTED} />
            <Field label="Tx.55 — En Tránsito" value={sub.pedidoSAP55 || '—'} color={sub.pedidoSAP55 ? INK : MUTED} />
            <Field label="Tx.18 — Ingreso Mercadería" value={sub.ingresoSAP18 || '—'} color={sub.ingresoSAP18 ? '#1a7a4a' : MUTED} />
          </div>
        </div>
      </div>

      {showEditModal && (
        <TabEditModal title={`Editar aduana · ${sub.numero}`} onClose={() => setShowEditModal(false)} onSave={saveAduana}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <FormField label="Despachante aduanero">
              <Select value={form.despachante} onValueChange={value => setForm(prev => ({ ...prev, despachante: value }))}>
                <SelectTrigger style={{ width: '100%', minHeight: 40, borderRadius: 10, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, padding: '0 12px' }}>
                  <SelectValue placeholder="Seleccionar despachante..." />
                </SelectTrigger>
                <SelectContent>
                  {despachantesList.map(d => <SelectItem key={d.id} value={d.id}>{d.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="N° Declaración Detallada (DUA)">
              <input value={form.duaNum} onChange={event => setForm(prev => ({ ...prev, duaNum: event.target.value }))} placeholder="26001-CUSBA-2026-XXXXXX" style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
            </FormField>
          </div>
          <FormField label="Canal aduanero">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['Pendiente', 'Verde', 'Rojo'] as const).map(option => (
                <AppButton key={option} type="button" size="md" variant={form.canalAduana === option ? (option === 'Rojo' ? 'danger-soft' : option === 'Verde' ? 'success-soft' : 'secondary') : 'secondary'} onClick={() => setForm(prev => ({ ...prev, canalAduana: option }))}>
                  {option}
                </AppButton>
              ))}
            </div>
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <FormField label="Despacho / ZFI / ZFE">
              <Select value={form.despachoTipo} onValueChange={value => setForm(prev => ({ ...prev, despachoTipo: value }))}>
                <SelectTrigger style={{ width: '100%', minHeight: 40, borderRadius: 10, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, padding: '0 12px' }}>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {DESPACHO_TIPO_OPTIONS.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Tx.55 — En tránsito">
              <input value={form.pedidoSAP55} onChange={event => setForm(prev => ({ ...prev, pedidoSAP55: event.target.value }))} placeholder="5500009321" style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <FormField label="Monto gastos AR$">
              <input type="number" value={form.gastosARS} onChange={event => setForm(prev => ({ ...prev, gastosARS: event.target.value }))} placeholder="0" style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
            </FormField>
            <FormField label="Monto VEP USD">
              <input type="number" value={form.vepUSD} onChange={event => setForm(prev => ({ ...prev, vepUSD: event.target.value }))} placeholder="0" style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <FormField label="Fecha oficialización">
              <input type="date" value={form.fechaOficializacion} onChange={event => setForm(prev => ({ ...prev, fechaOficializacion: event.target.value }))} style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
            </FormField>
            <FormField label="Fecha salida puerto">
              <input type="date" value={form.fechaSalidaPuerto} onChange={event => setForm(prev => ({ ...prev, fechaSalidaPuerto: event.target.value }))} style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
            </FormField>
          </div>
        </TabEditModal>
      )}

      {/* ── Modal Aplicar Saldo (Contabilidad de Fondos Despachante) ── */}
      {showSaldoModal && selectedDespachante && (
        <div style={modalOverlay}>
          <div style={getModalShellStyle(isMobile ? 'calc(100vw - 32px)' : 560)}>

            {saldoSuccess ? (
              <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(26,92,56,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={28} color={GREEN} />
                </div>
                <div>
                  <h3 style={{ ...DETAIL_TYPE_SCALE.h3, margin: '0 0 4px' }}>¡Saldo Aplicado con Éxito!</h3>
                  <p style={{ fontSize: 13.5, color: MUTED, margin: 0, lineHeight: 1.5 }}>
                    Se han imputado <strong>$ {Number(saldoForm.monto).toLocaleString()}</strong> del saldo a favor de <strong>{selectedDespachante.nombre}</strong> para cubrir costos del embarque <strong>{saldoForm.destino}</strong>. El pago aduanero ha sido registrado como "HAY FONDOS".
                  </p>
                </div>
                <div style={{ background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, padding: '12px 16px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left', fontSize: 13 }}>
                  <div>
                    <span style={{ color: MUTED, display: 'block', fontSize: 11, fontWeight: 600 }}>N° RENDICIÓN</span>
                    <span style={{ color: INK, fontWeight: 500 }}>{saldoForm.rendicion}</span>
                  </div>
                  <div>
                    <span style={{ color: MUTED, display: 'block', fontSize: 11, fontWeight: 600 }}>NUEVO SALDO A FAVOR</span>
                    <span style={{ color: GREEN, fontWeight: 700 }}>$ {(selectedDespachante.saldoFavor - Number(saldoForm.monto)).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ width: '100%', marginTop: 8 }}>
                  <AppButton style={{ width: '100%' }} onClick={() => setShowSaldoModal(false)}>Aceptar y Cerrar</AppButton>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '18px 18px 26px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'calc(90vh - 120px)' }}>
                  
                  {/* Departamento Responsable */}
                  <div style={{ padding: '10px 14px', background: 'rgba(26,92,56,0.04)', borderRadius: 12, border: `1px solid ${GREEN_HAIRLINE_SOFT}`, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Área Responsable del Registro</div>
                    <div style={{ fontSize: 13, color: INK }}>Este saldo aplicado es gestionado y registrado por: <strong>Tesorería / Cuentas a Pagar</strong></div>
                  </div>

                  <div style={{ fontSize: 13, color: INK }}>
                    Despachante: <strong>{selectedDespachante.nombre}</strong> (Saldo actual: <span style={{ color: GREEN, fontWeight: 600 }}>$ {selectedDespachante.saldoFavor.toLocaleString()}</span>)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                    <FormField label="Monto a Imputar (AR$)">
                      <input
                        type="number"
                        value={saldoForm.monto}
                        onChange={e => setSaldoForm(prev => ({ ...prev, monto: e.target.value }))}
                        max={selectedDespachante.saldoFavor}
                        placeholder="Ej. 50000"
                        style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }}
                      />
                    </FormField>
                    <FormField label="Documento de Rendición / NC">
                      <input
                        value={saldoForm.rendicion}
                        onChange={e => setSaldoForm(prev => ({ ...prev, rendicion: e.target.value }))}
                        placeholder="Ej. REND-2026-0042"
                        style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }}
                      />
                    </FormField>
                  </div>

                  <FormField label="Embarque Parcial de Aplicación">
                    <Select value={saldoForm.destino} onValueChange={val => setSaldoForm(prev => ({ ...prev, destino: val }))}>
                      <SelectTrigger style={{ width: '100%', minHeight: 40, borderRadius: 10, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, padding: '0 12px' }}>
                        <SelectValue placeholder="Seleccionar embarque destino" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcarpetas.map(item => (
                          <SelectItem key={item.id} value={item.numero}>
                            {item.numero} ({item.estado})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  {Number(saldoForm.monto) > selectedDespachante.saldoFavor && (
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#c4001a', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertTriangle size={14} /> El monto excede el saldo a favor disponible.
                    </div>
                  )}
                </div>

                <div style={{ padding: '12px 16px', borderTop: `1px solid ${HAIRLINE}`, display: 'flex', justifyContent: 'flex-end', gap: 8, background: '#fff' }}>
                  <AppButton type="button" variant="secondary" size="md" onClick={() => setShowSaldoModal(false)}>
                    Cancelar
                  </AppButton>
                  <AppButton
                    type="button"
                    size="md"
                    disabled={!saldoForm.monto || isNaN(Number(saldoForm.monto)) || Number(saldoForm.monto) <= 0 || Number(saldoForm.monto) > selectedDespachante.saldoFavor}
                    onClick={confirmApplySaldo}
                  >
                    Confirmar Imputación
                  </AppButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CosteoTab({ carpeta, subs = [], editable, hideImportes, onUpdateSubcarpeta, onUpdateCosteo, onSelectSubcarpeta }: any) {
  const isMobile = useIsMobile();
  const subcarpetas = subs as Subcarpeta[];
  const [selectedSubId, setSelectedSubId] = useState<string>(subcarpetas[0]?.id ?? '');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (subcarpetas.length > 0 && !subcarpetas.some(item => item.id === selectedSubId)) {
      setSelectedSubId(subcarpetas[0].id);
    }
  }, [subcarpetas, selectedSubId]);

  const sub = subcarpetas.find(item => item.id === selectedSubId) ?? subcarpetas[0];

  const [form, setForm] = useState({
    coeficienteEst: '',
    coeficienteReal: '',
    observaciones: '',
  });

  useEffect(() => {
    if (sub) {
      setForm({
        coeficienteEst: sub.coeficienteEst?.toString() || '',
        coeficienteReal: sub.coeficienteReal?.toString() || '',
        observaciones: carpeta.observaciones || '',
      });
    } else {
      setForm({
        coeficienteEst: '',
        coeficienteReal: '',
        observaciones: carpeta.observaciones || '',
      });
    }
  }, [sub?.id, sub?.coeficienteEst, sub?.coeficienteReal, carpeta.observaciones]);

  if (subcarpetas.length === 0) {
    return (
      <TabEmptyPlaceholder
        title="Coeficiente por apertura"
        description="Esta carpeta no tiene embarques asociados, por lo que no registra coeficientes de costo. El costeo pertenece a cada apertura individual y no a la carpeta madre sin aperturas."
        padding="24px"
      />
    );
  }

  const coefEst = sub.coeficienteEst ?? 0;
  const coefReal = sub.coeficienteReal ?? null;
  const desv = coefReal ? coefReal - coefEst : null;
  const desvPct = desv && coefEst ? (desv / coefEst) * 100 : null;
  const alertColor = desvPct !== null && Math.abs(desvPct) > 5 ? '#b84800' : '#1a7a4a';

  const saveCosteo = () => {
    onUpdateSubcarpeta(sub.id, {
      coeficienteEst: form.coeficienteEst ? Number(form.coeficienteEst) : undefined,
      coeficienteReal: form.coeficienteReal ? Number(form.coeficienteReal) : null,
    });
    onUpdateCosteo({
      observaciones: form.observaciones.trim(),
    });
    setShowEditModal(false);
  };

  if (onSelectSubcarpeta) {
    return (
      <div style={{ padding: isMobile ? DETAIL_TAB_PANEL_PADDING_MOBILE : DETAIL_TAB_PANEL_PADDING_DESKTOP, display: 'flex', flexDirection: 'column', background: CANVAS }}>
        <div style={{ display: 'flex', flexDirection: 'column', background: '#fafefd' }}>
          {subcarpetas.map((item, index) => {
            const itemCoefEst = item.coeficienteEst ?? null;
            const itemCoefReal = item.coeficienteReal ?? null;
            const itemDesvPct = itemCoefEst && itemCoefReal ? ((itemCoefReal - itemCoefEst) / itemCoefEst) * 100 : null;
            const itemAlertColor = itemDesvPct !== null && Math.abs(itemDesvPct) > 5 ? '#b45309' : '#1a7a4a';

            return (
              <div key={item.id} style={{ borderBottom: index < subcarpetas.length - 1 ? `1px solid ${GREEN_HAIRLINE_SOFT}` : 'none' }}>
                <div
                  onClick={() => onSelectSubcarpeta(item.id, 'costeo')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px 12px',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fafbfa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <TransportModeIcon transporte={item.transporte} size={15} compact />
                    <div>
                      <div style={{ fontSize: SHIPMENT_TYPE.title, fontWeight: 600, color: INK }}>{item.numero}</div>
                      <div style={{ fontSize: SHIPMENT_TYPE.companion, color: MUTED }}>{item.transporte} · ETA {item.eta || '—'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textTransform: 'uppercase', fontSize: SHIPMENT_TYPE.companion, color: MUTED, fontWeight: 500 }}>{item.contenedores || 0} cont.</div>
                    <NeonBadge estado={item.estado as any} size="xs" />
                    <ChevronRight size={14} style={{ color: '#98a2b3' }} />
                  </div>
                </div>
                <div style={{ padding: '2px 16px 16px 60px', background: 'transparent' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, minmax(0, 1fr))', gap: 18, alignItems: 'start' }}>
                    <Field label="Coeficiente estimado" value={itemCoefEst !== null ? itemCoefEst.toFixed(2) : '—'} color={itemCoefEst !== null ? INK : MUTED} />
                    <Field label="Coeficiente real" value={itemCoefReal !== null ? itemCoefReal.toFixed(2) : '—'} color={itemCoefReal !== null ? INK : MUTED} />
                    <Field label="Importe embarque" value={!hideImportes ? formatMoney(item.importeTotal, carpeta.moneda) : 'Oculto'} color={!hideImportes ? INK : MUTED} />
                    <Field label="Desvío" value={itemDesvPct !== null ? `${itemDesvPct > 0 ? '+' : ''}${itemDesvPct.toFixed(1)}%` : 'Pendiente'} color={itemDesvPct !== null ? itemAlertColor : MUTED} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? DETAIL_TAB_PANEL_PADDING_MOBILE : DETAIL_TAB_PANEL_PADDING_DESKTOP, display: 'grid', gap: DETAIL_TAB_PANEL_GAP, background: CANVAS }}>
      <TabIntro
        title="Costeo de importación"
        subtitle="Coeficientes, costos locales y observaciones por embarque"
        actions={<div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
        {subcarpetas.length > 1 && (
          <Select value={selectedSubId} onValueChange={setSelectedSubId}>
            <SelectTrigger aria-label="Seleccionar embarque" style={{ width: isMobile ? '100%' : 220, minHeight: 38, borderRadius: 10, background: CANVAS }}>
              <SelectValue placeholder="Seleccionar embarque" />
            </SelectTrigger>
            <SelectContent>
              {subcarpetas.map(item => <SelectItem key={item.id} value={item.id}>{item.numero} · {item.estado}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {editable && (
          <AppButton type="button" icon={<Pencil size={13} />} onClick={() => setShowEditModal(true)}>
            Editar
          </AppButton>
        )}
      </div>}
      />

    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Section 1: Coeficientes de Costo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: DETAIL_TAB_SECTION_GAP }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
          <Field label="Coeficiente Estimado" value={coefEst.toFixed(2)} />
          <Field label="Coeficiente Real" value={coefReal ? coefReal.toFixed(2) : '—'} color={coefReal ? alertColor : MUTED} />
          {desvPct !== null && (
            <div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Estado Desvío</div>
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: alertColor,
                background: `${alertColor}0d`,
                padding: '4px 10px',
                borderRadius: 8,
                border: `1px solid ${alertColor}2b`
              }}>
                {desv! > 0 ? '+' : ''}{desv!.toFixed(2)} ({desvPct.toFixed(1)}% var.)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Desglose de Costos Locales */}
      <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP, display: 'flex', flexDirection: 'column', gap: DETAIL_TAB_SECTION_GAP }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Desglose de Costos Locales</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
          <Field label="Gastos de Terminal" value={`$ ${carpeta.gastosTerminal.toLocaleString()}`} />
          <Field label="Honorarios Despachante" value={`$ ${carpeta.honorariosDespachante.toLocaleString()}`} />
          <Field label="Total Costos Consolidados" value={<strong>$ {(carpeta.gastosTerminal + carpeta.honorariosDespachante).toLocaleString()}</strong>} />
        </div>
      </div>

      {/* Section 3: Observaciones de Costeo */}
      <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP, display: 'flex', flexDirection: 'column', gap: DETAIL_TAB_SECTION_GAP }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Observaciones de Costeo</div>
        <div style={{ fontSize: 13.5, color: carpeta.observaciones ? INK : MUTED, lineHeight: 1.5 }}>
          {carpeta.observaciones || 'Sin observaciones registradas para esta liquidación.'}
        </div>
      </div>
    </div>

      {showEditModal && (
        <TabEditModal title={`Editar costeo · ${sub.numero}`} onClose={() => setShowEditModal(false)} onSave={saveCosteo}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          <FormField label="Coeficiente estimado">
            <input type="number" step="0.01" value={form.coeficienteEst} onChange={event => setForm(prev => ({ ...prev, coeficienteEst: event.target.value }))} placeholder="0.00" style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
          </FormField>
          <FormField label="Coeficiente real">
            <input type="number" step="0.01" value={form.coeficienteReal} onChange={event => setForm(prev => ({ ...prev, coeficienteReal: event.target.value }))} placeholder="0.00" style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
          </FormField>
        </div>
        <FormField label="Observaciones de costeo">
          <textarea value={form.observaciones} onChange={event => setForm(prev => ({ ...prev, observaciones: event.target.value }))} rows={5} placeholder="Notas sobre el costeo, desvíos o warnings" style={{ width: '100%', padding: '10px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none', resize: 'vertical', lineHeight: 1.5 }} />
        </FormField>
        </TabEditModal>
      )}
    </div>
  );
}

/* ── Pagos Tab ─────────────────────────────────────────────────────── */

function PagosTab({
  carpeta,
  editable,
  onUpdatePagos
}: {
  carpeta: Carpeta;
  editable: boolean;
  onUpdatePagos?: (pagos: any[]) => void;
}) {
  const isMobile = useIsMobile();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
  const [selectedPagoId, setSelectedPagoId] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState({ fechaPago: '', montoPago: '' });

  // Form states for creating a new payment
  const [newPaymentForm, setNewPaymentForm] = useState({
    concepto: 'Factura Proveedor Exterior',
    otroConcepto: '',
    moneda: 'USD',
    monto: '',
    vencimiento: '',
    estado: 'Pendiente' as 'Pendiente' | 'Pagado'
  });

  const pagos = (carpeta as any).pagos ?? [];
  const hasPaidPayments = pagos.some((pago: any) => pago.estado === 'Pagado');
  const nextPendingPago = pagos
    .filter((p: any) => p.estado === 'Pendiente')
    .sort((a: any, b: any) => String(a.vencimiento).localeCompare(String(b.vencimiento)))[0] ?? null;

  const handleUpdatePagosList = (newList: any[]) => {
    if (onUpdatePagos) {
      onUpdatePagos(newList);
    }
  };

  const selectedPago = pagos.find((p: any) => p.id === selectedPagoId) ?? null;

  const openPaymentModal = (pagoId: string) => {
    const pago = pagos.find((item: any) => item.id === pagoId);
    if (!pago) return;
    setSelectedPagoId(pago.id);
    setPaymentForm({ fechaPago: pago.vencimiento, montoPago: String(pago.monto) });
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (!selectedPago) return;
    const updated = pagos.map((pago: any) =>
      pago.id === selectedPago.id
        ? {
            ...pago,
            estado: 'Pagado',
            fechaPago: paymentForm.fechaPago || new Date().toISOString().split('T')[0],
            monto: Number(paymentForm.montoPago || pago.monto)
          }
        : pago
    );
    handleUpdatePagosList(updated);
    setShowPaymentModal(false);
    setSelectedPagoId(null);
  };

  const handleAddPayment = () => {
    if (!newPaymentForm.monto || !newPaymentForm.vencimiento) return;

    const conceptoFinal = newPaymentForm.concepto === 'Otros' && newPaymentForm.otroConcepto.trim()
      ? newPaymentForm.otroConcepto.trim()
      : newPaymentForm.concepto;

    const newPago = {
      id: `pago-${Date.now()}`,
      concepto: conceptoFinal,
      monto: Number(newPaymentForm.monto),
      moneda: newPaymentForm.moneda,
      vencimiento: newPaymentForm.vencimiento,
      estado: newPaymentForm.estado,
      fechaPago: newPaymentForm.estado === 'Pagado' ? new Date().toISOString().split('T')[0] : undefined
    };

    handleUpdatePagosList([...pagos, newPago]);
    setShowNewPaymentModal(false);
    // Reset form
    setNewPaymentForm({
      concepto: 'Factura Proveedor Exterior',
      otroConcepto: '',
      moneda: 'USD',
      monto: '',
      vencimiento: '',
      estado: 'Pendiente'
    });
  };

  const handleDeletePayment = (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este registro de pago?')) return;
    const filtered = pagos.filter((p: any) => p.id !== id);
    handleUpdatePagosList(filtered);
  };

  // Group totals by currency for a professional multi-currency dashboard (RF-023 to RF-026)
  const currencies = ['USD', 'ARS', 'EUR'];
  const totalsByCurrency = currencies.reduce((acc, curr) => {
    const paid = pagos.filter((p: any) => p.moneda === curr && p.estado === 'Pagado').reduce((sum: number, p: any) => sum + p.monto, 0);
    const pending = pagos.filter((p: any) => p.moneda === curr && p.estado === 'Pendiente').reduce((sum: number, p: any) => sum + p.monto, 0);
    acc[curr] = { paid, pending };
    return acc;
  }, {} as Record<string, { paid: number; pending: number }>);
  const paymentSectionTitleStyle: CSSProperties = {
    ...DETAIL_SECTION_LABEL_STYLE,
    marginBottom: 2,
  };
  const paymentSectionBlockStyle: CSSProperties = {
    display: 'grid',
    gap: DETAIL_TAB_SECTION_GAP,
  };
  const paymentInfoBlockStyle: CSSProperties = {
    padding: isMobile ? '4px 0' : '6px 0',
    display: 'grid',
    gap: 10,
    alignContent: 'start',
  };
  const paymentCurrencyRowStyle: CSSProperties = {
    display: 'grid',
    gap: 12,
    alignContent: 'start',
    padding: isMobile ? '12px 0' : '14px 0',
  };
  return (
    <div style={{ display: 'grid', gap: DETAIL_TAB_PANEL_GAP, padding: isMobile ? DETAIL_TAB_PANEL_PADDING_MOBILE : DETAIL_TAB_PANEL_PADDING_DESKTOP }}>
      <TabIntro
        title="Pagos de la carpeta"
        subtitle="Fondos proyectados, compromisos y registro de pagos"
        overlayActions={!isMobile}
        actions={editable ? (
          <AppButton
            type="button"
            size="md"
            onClick={() => setShowNewPaymentModal(true)}
            icon={<Plus size={14} />}
          >
            Registrar pago
          </AppButton>
        ) : undefined}
      />
      <div style={paymentSectionBlockStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', columnGap: 24, rowGap: 12, alignItems: 'start' }}>
          <div style={paymentInfoBlockStyle}>
            <div style={DETAIL_META_LABEL_STYLE}>Estado de fondos</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: SHIPMENT_TYPE.title, lineHeight: '16px', fontWeight: 600, color: hasPaidPayments ? '#1a7a4a' : MUTED }}>
              {hasPaidPayments ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
              {hasPaidPayments ? 'Con pagos registrados' : 'Sin pagos ejecutados'}
            </span>
          </div>
          <div style={paymentInfoBlockStyle}>
            <div style={DETAIL_META_LABEL_STYLE}>Condición de pago</div>
            <div style={{ ...DETAIL_TYPE_SCALE.itemTitle, fontSize: 13.5 }}>{carpeta.condPago || 'Giro 30 días'}</div>
          </div>
          <div style={paymentInfoBlockStyle}>
            <div style={DETAIL_META_LABEL_STYLE}>Próximo vencimiento</div>
            <div style={{ ...DETAIL_TYPE_SCALE.itemTitle, fontSize: 13.5, color: nextPendingPago ? INK : MUTED }}>
              {nextPendingPago ? `${nextPendingPago.vencimiento} · ${nextPendingPago.concepto}` : 'Sin vencimientos registrados'}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Resumen de Compromisos por Divisa */}
      <div style={{ ...paymentSectionBlockStyle, borderTop: `1px solid ${HAIRLINE}`, paddingTop: DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP }}>
        <div style={paymentSectionTitleStyle}>Resumen de compromisos por divisa</div>
        {pagos.length === 0 ? (
          <div style={{ padding: '8px 0 0', fontSize: 13, color: MUTED }}>Sin compromisos registrados.</div>
        ) : <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', alignItems: 'stretch' }}>
          {currencies.map(curr => {
            const { paid, pending } = totalsByCurrency[curr];
            const hasActivity = paid > 0 || pending > 0;
            if (!hasActivity) return null;
            return (
              <div key={curr} style={{ ...paymentCurrencyRowStyle, padding: isMobile ? '14px 0' : '0 18px', borderLeft: !isMobile && curr !== currencies[0] ? `1px solid ${HAIRLINE}` : 'none', borderTop: isMobile && curr !== currencies[0] ? `1px solid ${HAIRLINE}` : 'none' }}>
                <div style={{ display: 'grid', gap: 4 }}>
                  <div style={DETAIL_META_LABEL_STYLE}>Divisa</div>
                  <div style={{ ...DETAIL_TYPE_SCALE.itemTitle, fontSize: 16 }}>{curr}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, alignItems: 'start' }}>
                  <div style={{ display: 'grid', gap: 6 }}>
                    <div style={DETAIL_META_LABEL_STYLE}>Pagado</div>
                    <div style={{ ...DETAIL_TYPE_SCALE.itemTitle, fontSize: 13.5, color: INK, fontVariantNumeric: 'tabular-nums' }}>{curr} {paid.toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'grid', gap: 6 }}>
                    <div style={DETAIL_META_LABEL_STYLE}>Pendiente</div>
                    <div style={{ ...DETAIL_TYPE_SCALE.itemTitle, fontSize: 13.5, color: pending > 0 ? INK : MUTED, fontVariantNumeric: 'tabular-nums' }}>{curr} {pending.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>}
      </div>

      {/* Section 3: Detalle y Registro de Pagos */}
      <div style={{ ...paymentSectionBlockStyle, borderTop: `1px solid ${HAIRLINE}`, paddingTop: DETAIL_TAB_SECTION_DIVIDER_PADDING_TOP }}>
        <div style={paymentSectionTitleStyle}>Detalle y registro de pagos</div>
        {pagos.length === 0 ? (
          <TabEmptyPlaceholder
            title="Sin registros de pagos"
            description="Todavía no hay compromisos ni pagos cargados para esta carpeta."
            padding="8px 0 0"
            action={editable ? (
              <AppButton
                type="button"
                size="md"
                onClick={() => setShowNewPaymentModal(true)}
                icon={<Plus size={14} />}
              >
                Registrar pago
              </AppButton>
            ) : undefined}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pagos.map((pago: any, index: number) => (
              <div key={pago.id} style={{ padding: isMobile ? '14px 0' : '16px 0', borderTop: index > 0 ? `1px solid ${HAIRLINE}` : 'none', display: 'grid', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) auto', gap: 16, alignItems: 'start' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={DETAIL_TYPE_SCALE.itemTitle}>{pago.concepto}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{pago.vencimiento ? `Vence ${pago.vencimiento}` : 'Sin vencimiento definido'}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 180px))', gap: 16, marginTop: 12, alignItems: 'start' }}>
                      <div style={{ minHeight: 34 }}>
                        <div style={DETAIL_META_LABEL_STYLE}>Fecha pago real</div>
                        <div style={{ fontSize: 13, color: pago.fechaPago ? '#1a7a4a' : MUTED, fontWeight: pago.fechaPago ? 600 : 500 }}>{pago.fechaPago || 'Pendiente de giro'}</div>
                      </div>
                      <div style={{ minHeight: 34 }}>
                        <div style={DETAIL_META_LABEL_STYLE}>Condición</div>
                        <div style={{ fontSize: 13, color: INK }}>{pago.estado === 'Pagado' ? 'Pago confirmado' : 'Esperando giro'}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: 10, justifyItems: isMobile ? 'start' : 'end', minWidth: isMobile ? 'auto' : 170 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: INK, fontVariantNumeric: 'tabular-nums' }}>{pago.moneda} {pago.monto.toLocaleString()}</div>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 9999,
                        background: pago.estado === 'Pagado' ? 'rgba(26,122,74,0.1)' : 'rgba(180,83,9,0.1)',
                        color: pago.estado === 'Pagado' ? '#1a7a4a' : '#b45309',
                        whiteSpace: 'nowrap',
                      }}>{pago.estado}</span>
                    </div>
                    {editable ? (
                      <div style={{ display: 'flex', gap: 8, justifyContent: isMobile ? 'flex-start' : 'flex-end', flexWrap: 'wrap' }}>
                        {pago.estado === 'Pendiente' && (
                          <AppButton type="button" size="sm" onClick={() => openPaymentModal(pago.id)}>
                            Confirmar pago
                          </AppButton>
                        )}
                        <AppButton
                          type="button"
                          variant="danger-soft"
                          size="sm"
                          onClick={() => handleDeletePayment(pago.id)}
                          icon={<Trash2 size={13} />}
                          style={{ width: 28, height: 28, padding: 0, minHeight: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          aria-label="Eliminar pago"
                          title="Eliminar pago"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: Confirm payment */}
      {showPaymentModal && selectedPago && (
        <TabEditModal title={`Confirmar giro de fondos · ${selectedPago.concepto}`} onClose={() => setShowPaymentModal(false)} onSave={confirmPayment} saveLabel="Registrar Pago">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <FormField label="Fecha de pago real">
              <input type="date" value={paymentForm.fechaPago} onChange={event => setPaymentForm(prev => ({ ...prev, fechaPago: event.target.value }))} style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
            </FormField>
            <FormField label="Monto girado final">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: 12, fontSize: 14, color: MUTED, fontWeight: 600 }}>{selectedPago.moneda}</span>
                <input type="number" value={paymentForm.montoPago} onChange={event => setPaymentForm(prev => ({ ...prev, montoPago: event.target.value }))} style={{ width: '100%', minHeight: 40, padding: '9px 12px 9px 48px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
              </div>
            </FormField>
          </div>
        </TabEditModal>
      )}

      {/* MODAL 2: Create payment */}
      {showNewPaymentModal && (
        <TabEditModal title="Registrar Compromiso de Pago" onClose={() => setShowNewPaymentModal(false)} onSave={handleAddPayment} saveLabel="Registrar Compromiso">
          <FormField label="Concepto de pago">
            <Select value={newPaymentForm.concepto} onValueChange={value => setNewPaymentForm(prev => ({ ...prev, concepto: value }))}>
              <AppSelectTrigger>
                <SelectValue />
              </AppSelectTrigger>
              <AppSelectContent style={{ zIndex: 400 }}>
                <AppSelectItem value="Factura Proveedor Exterior">Factura Proveedor Exterior</AppSelectItem>
                <AppSelectItem value="Flete Internacional">Flete Internacional</AppSelectItem>
                <AppSelectItem value="Impuestos AFIP / VEP">Impuestos AFIP / VEP</AppSelectItem>
                <AppSelectItem value="Gastos Terminal">Gastos Terminal</AppSelectItem>
                <AppSelectItem value="Otros">Otros (especificar abajo)</AppSelectItem>
              </AppSelectContent>
            </Select>
          </FormField>

          {newPaymentForm.concepto === 'Otros' && (
            <FormField label="Especificar otro concepto">
              <input
                value={newPaymentForm.otroConcepto}
                onChange={event => setNewPaymentForm(prev => ({ ...prev, otroConcepto: event.target.value }))}
                placeholder="Escribí el concepto personalizado"
                style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }}
              />
            </FormField>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <FormField label="Moneda">
              <Select value={newPaymentForm.moneda} onValueChange={value => setNewPaymentForm(prev => ({ ...prev, moneda: value }))}>
                <AppSelectTrigger>
                  <SelectValue />
                </AppSelectTrigger>
                <AppSelectContent style={{ zIndex: 400 }}>
                  <AppSelectItem value="USD">USD ($ Exterior)</AppSelectItem>
                  <AppSelectItem value="ARS">ARS ($ Local)</AppSelectItem>
                  <AppSelectItem value="EUR">EUR (€ Europa)</AppSelectItem>
                </AppSelectContent>
              </Select>
            </FormField>

            <FormField label="Monto">
              <input
                type="number"
                value={newPaymentForm.monto}
                onChange={event => setNewPaymentForm(prev => ({ ...prev, monto: event.target.value }))}
                placeholder="0.00"
                style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }}
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            <FormField label="Fecha de Vencimiento">
              <input
                type="date"
                value={newPaymentForm.vencimiento}
                onChange={event => setNewPaymentForm(prev => ({ ...prev, vencimiento: event.target.value }))}
                style={{ width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 14, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }}
              />
            </FormField>

            <FormField label="Estado Inicial">
              <Select value={newPaymentForm.estado} onValueChange={value => setNewPaymentForm(prev => ({ ...prev, estado: value as any }))}>
                <AppSelectTrigger>
                  <SelectValue />
                </AppSelectTrigger>
                <AppSelectContent style={{ zIndex: 400 }}>
                  <AppSelectItem value="Pendiente">Pendiente de pago</AppSelectItem>
                  <AppSelectItem value="Pagado">Ya Pagado</AppSelectItem>
                </AppSelectContent>
              </Select>
            </FormField>
          </div>
        </TabEditModal>
      )}
    </div>
  );
}
