import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Ship, FileText, DollarSign, Package, AlertTriangle, CheckCircle, Upload, Pencil } from 'lucide-react';
import type { Subcarpeta, Carpeta, Documento } from './mockData';
import { getDespachante } from './mockData';
import { NeonBadge, CanalBadge } from './NeonBadge';
import { useIsMobile } from './ui/use-mobile';
import { AppButton } from './AppButton';
import { AppDialog } from './AppDialog';
import { InfoField as Field } from './InfoField';
import { SectionCard as Card } from './SectionCard';
import { color } from './theme';

const INK = color.ink;
const MUTED = color.muted;
const HAIRLINE = color.hairline;
const PARCHMENT = color.parchment;
const GREEN = color.brand;
const CANVAS = color.canvas;

type SubTab = 'general' | 'articulos' | 'aduana' | 'costeo' | 'documentos' | 'recepcion';

function getInitialSubTab(sub: Subcarpeta, hideImportes: boolean): SubTab {
  return 'general';
}

function getLoadModeLabel(sub: Subcarpeta) {
  if (sub.transporte !== 'Marítimo') {
    return sub.transporte === 'Terrestre' ? 'Carga terrestre' : 'Carga aérea';
  }
  return sub.contenedores > 0 ? 'FCL · Contenedor completo' : 'LCL · Carga consolidada';
}

function getShipmentArticles(sub: Subcarpeta, carpeta: Carpeta) {
  return sub.articulosEmbarque.map(item => {
    const articulo = carpeta.articulos.find(candidate => candidate.id === item.articuloId);
    return {
      articuloId: item.articuloId,
      codigoSAP: articulo?.codigoSAP || item.articuloId,
      descripcion: articulo?.descripcion || 'Artículo no encontrado',
      linea: articulo?.linea || '—',
      cantidad: item.cantidad,
      um: articulo?.um || '—',
      contenedores: item.contenedores?.length ? item.contenedores : [],
    };
  });
}

interface Props {
  subcarpeta: Subcarpeta;
  carpeta: Carpeta;
  onBack: () => void;
  onAddDocumento?: (doc: any) => void;
  onUpdateSubcarpeta?: (patch: Partial<Subcarpeta>) => void;
  readonly?: boolean;
  hideImportes?: boolean;
  initialTab?: SubTab;
}

export function SubcarpetaDetail({ subcarpeta, carpeta, onBack, onAddDocumento, onUpdateSubcarpeta, readonly = false, hideImportes = false, initialTab }: Props) {
  const [tab, setTab] = useState<SubTab>(() => initialTab ?? getInitialSubTab(subcarpeta, hideImportes));
  const isMobile = useIsMobile();
  const despachante = getDespachante(subcarpeta.despachante || '');

  useEffect(() => {
    setTab(initialTab ?? getInitialSubTab(subcarpeta, hideImportes));
  }, [initialTab, subcarpeta.id, hideImportes]);

  const allTabs: { id: SubTab; label: string }[] = [
    { id: 'general',    label: 'General' },
    { id: 'articulos',  label: 'Artículos' },
    { id: 'aduana',     label: 'Aduana' },
    { id: 'costeo',     label: 'Costeo' },
    { id: 'documentos', label: 'Anexos' },
    { id: 'recepcion',  label: 'Recepción' },
  ];
  const tabs = hideImportes ? allTabs.filter(t => t.id !== 'costeo') : allTabs;

  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: 'clamp(20px, 4vw, 48px) clamp(14px, 3vw, 32px)' }}>
      {/* Back */}
      <AppButton variant="tertiary" size="md" onClick={onBack} icon={<ArrowLeft size={14} />} style={{ padding: '5px 0', marginBottom: 16, fontWeight: 400 }}>
        Volver a {carpeta.numero}
      </AppButton>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(22px, 2.6vw, 28px)', fontWeight: 700, color: INK }}>{subcarpeta.numero}</h1>
            <NeonBadge estado={subcarpeta.estado as any} size="sm" />
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#4b5563' }}>
            Embarque de {carpeta.numero} · {subcarpeta.transporte} · ETA {subcarpeta.eta || '—'}
          </p>
        </div>
      </div>

      {/* ── Consistent Observaciones / Reclamos / Incidencias Banner ── */}
      {subcarpeta.incidencias && subcarpeta.incidencias.filter(inc => !inc.resuelta).map(inc => (
        <div key={inc.id} style={{
          marginBottom: 16,
          padding: '14px 18px',
          background: '#fff5f5',
          border: '1px solid #feb2b2',
          borderRadius: 14,
          display: 'flex',
          gap: 12,
          alignItems: 'start',
          boxShadow: '0 2px 8px rgba(220,38,38,0.05)',
        }}>
          <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9b1c1c', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Incidencia / Reclamo de Recepción: {inc.tipo}
            </div>
            <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.45 }}>
              {inc.comentario} · {inc.cantidadAfectada} unidades afectadas · {inc.fecha}
            </div>
          </div>
        </div>
      ))}

      <div style={{
        background: CANVAS,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 4px 18px rgba(16,24,40,0.03)',
      }}>
        {/* Tabs */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          borderBottom: `1px solid ${HAIRLINE}`,
          background: '#fbfcfb',
          padding: isMobile ? '0 10px' : '0 14px',
        }}>
          {tabs.map(t => {
            const active = tab === t.id;
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 'none',
                  minHeight: 42,
                  padding: isMobile ? '10px 12px 9px' : '10px 14px 9px',
                  fontSize: 12.5,
                  fontWeight: active ? 600 : 500,
                  color: active ? GREEN : MUTED,
                  background: 'transparent',
                  border: 'none',
                  borderBottom: active ? `2px solid ${GREEN}` : '2px solid transparent',
                  borderRadius: 0,
                  marginBottom: -1,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div>
          {tab === 'general' && <GeneralSection sub={subcarpeta} readonly={readonly} onOpenAttachments={() => setTab('documentos')} />}
          {tab === 'articulos' && <ArticulosSection sub={subcarpeta} carpeta={carpeta} />}
          {tab === 'aduana' && <AduanaSection sub={subcarpeta} despachante={despachante} readonly={readonly} onUpdateSubcarpeta={onUpdateSubcarpeta} />}
          {tab === 'costeo' && <CosteoSection sub={subcarpeta} carpeta={carpeta} readonly={readonly} onUpdateSubcarpeta={onUpdateSubcarpeta} />}
          {tab === 'documentos' && <DocumentosSectionV2 sub={subcarpeta} carpeta={carpeta} readonly={readonly} onAddDocumento={onAddDocumento} onUpdateSubcarpeta={onUpdateSubcarpeta} />}
          {tab === 'recepcion' && <RecepcionSection sub={subcarpeta} />}
        </div>
      </div>
    </div>
  );
}

interface ValProposalItem {
  articuloId: string;
  codigoSAP: string;
  descripcion: string;
  cantidadOC: number;
  saldoDisponible: number;
  cantidadFactura: number;
  um: string;
  resultado: 'Coincide' | 'Parcial' | 'Excede saldo';
}

interface InvoiceValProposal {
  documento: Documento;
  facturaNum: string;
  fechaFactura: string;
  importeTotal: number;
  items: ValProposalItem[];
}

function parseNumericValue(value: string) {
  return Number(value.replace(/,/g, ''));
}

function buildInvoiceProposal(file: File, content: string, carpeta: Carpeta, sub: Subcarpeta): InvoiceValProposal {
  const lines = content.split(/\r?\n/);
  const items = carpeta.articulos.flatMap(articulo => {
    const line = lines.find(candidate => candidate.includes(articulo.codigoSAP));
    if (!line) return [];
    const currentAllocation = sub.articulosEmbarque.find(item => item.articuloId === articulo.id)?.cantidad ?? 0;
    const assignedToOtherShipments = Math.max(0, articulo.cantidadAsignada - currentAllocation);
    const saldoDisponible = Math.max(0, articulo.cantidadSolicitada - assignedToOtherShipments);
    const descriptionIndex = line.indexOf(articulo.descripcion);
    const quantitySource = descriptionIndex >= 0
      ? line.slice(descriptionIndex + articulo.descripcion.length)
      : line.slice(line.indexOf(articulo.codigoSAP) + articulo.codigoSAP.length);
    const candidates = (quantitySource.match(/\d+(?:[.,]\d+)?/g) ?? [])
      .map(parseNumericValue)
      .filter(value => Number.isFinite(value) && value > 0);
    const cantidadFactura = descriptionIndex >= 0
      ? (candidates[0] ?? 0)
      : (candidates.filter(value => value <= saldoDisponible).sort((left, right) => right - left)[0] ?? 0);
    if (!cantidadFactura) return [];
    const resultado = cantidadFactura > saldoDisponible
      ? 'Excede saldo'
      : cantidadFactura < saldoDisponible
        ? 'Parcial'
        : 'Coincide';
    return [{
      articuloId: articulo.id,
      codigoSAP: articulo.codigoSAP,
      descripcion: articulo.descripcion,
      cantidadOC: articulo.cantidadSolicitada,
      saldoDisponible,
      cantidadFactura,
      um: articulo.um,
      resultado,
    } satisfies ValProposalItem];
  });
  const facturaNum = content.match(/Invoice No\.:\s*([^\r\n]+)/i)?.[1]?.trim() ?? file.name.replace(/\.[^.]+$/, '');
  const fechaFactura = content.match(/Invoice Date:\s*(\d{4}-\d{2}-\d{2})/i)?.[1] ?? new Date().toISOString().split('T')[0];
  const importeTotal = parseNumericValue(content.match(/Total Invoice Amount:\s*[A-Z]{3}\s*([\d.,]+)/i)?.[1] ?? '0');
  return {
    documento: {
      id: `doc-${Date.now()}`,
      nombre: file.name,
      referencia: facturaNum,
      tipo: 'Factura Comercial',
      tamano: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      fecha: new Date().toISOString().split('T')[0],
      visibilidad: 'Solo Importaciones y Dirección',
      estadoValidacion: 'Pendiente',
    },
    facturaNum,
    fechaFactura,
    importeTotal,
    items,
  };
}

function InvoiceValPanel({ sub, carpeta, readonly, onUpdateSubcarpeta }: { sub: Subcarpeta; carpeta: Carpeta; readonly: boolean; onUpdateSubcarpeta?: (patch: Partial<Subcarpeta>) => void }) {
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [proposal, setProposal] = useState<InvoiceValProposal | null>(null);
  const [processingError, setProcessingError] = useState('');
  const invoices = sub.documentos.filter(documento => documento.tipo === 'Factura Comercial');
  const currentInvoice = invoices[invoices.length - 1];
  const canApprove = Boolean(proposal?.items.length) && proposal!.items.every(item => item.resultado !== 'Excede saldo');

  const handleInvoice = async (file: File | null) => {
    if (!file) return;
    setProcessingError('');
    const content = await file.text();
    const nextProposal = buildInvoiceProposal(file, content, carpeta, sub);
    if (nextProposal.items.length === 0) {
      setProposal(null);
      setProcessingError('VAL no pudo extraer artículos reconocibles de esta factura. Revisá el archivo antes de continuar.');
    } else {
      setProposal(nextProposal);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const approveProposal = () => {
    if (!proposal || !canApprove || !onUpdateSubcarpeta) return;
    const hasPartialQuantities = proposal.items.some(item => item.resultado === 'Parcial');
    onUpdateSubcarpeta({
      facturaNum: proposal.facturaNum,
      fechaFactura: proposal.fechaFactura,
      importeTotal: proposal.importeTotal,
      documentos: [...sub.documentos, { ...proposal.documento, estadoValidacion: hasPartialQuantities ? 'Aprobado con diferencias' : 'Aprobado' }],
    });
    setProposal(null);
  };

  if (currentInvoice && !proposal && !processingError) return null;

  return (
    <section style={{ padding: 16, border: `1px solid ${HAIRLINE}`, borderRadius: 14, background: PARCHMENT, display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Validación VAL de artículos</div>
          <div style={{ marginTop: 4, fontSize: 13, color: currentInvoice ? GREEN : MUTED, fontWeight: 600 }}>
            {currentInvoice ? `Asignación aprobada · Fuente: ${currentInvoice.nombre}` : 'Pendiente de factura y validación'}
          </div>
        </div>
        {!readonly && (
          <>
            <input ref={inputRef} type="file" accept=".pdf,.xlsx,.xls,.txt" onChange={event => handleInvoice(event.target.files?.[0] ?? null)} style={{ display: 'none' }} />
            <AppButton type="button" variant="secondary" size="md" icon={<Upload size={14} />} onClick={() => inputRef.current?.click()}>
              {currentInvoice ? 'Cargar nueva versión' : 'Cargar y validar factura'}
            </AppButton>
          </>
        )}
      </div>

      {!proposal && !currentInvoice && !processingError && (
        <div style={{ padding: '10px 12px', border: '1px solid rgba(26,92,56,0.18)', borderRadius: 10, background: 'rgba(26,92,56,0.04)', fontSize: 12, lineHeight: 1.5, color: INK }}>
          <strong>Archivo → Procesamiento VAL → Resultado y decisión.</strong> Se extraen los artículos, se recupera la OC y se comparan SKU, descripción y cantidad antes de presentar la decisión.
        </div>
      )}

      {processingError && (
        <div style={{ padding: '10px 12px', border: '1px solid rgba(196,0,26,0.20)', borderRadius: 10, background: 'rgba(196,0,26,0.05)', color: '#9f0712', fontSize: 12 }}>{processingError}</div>
      )}

      {proposal && (
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ padding: '10px 12px', border: `1px solid ${canApprove ? 'rgba(26,92,56,0.20)' : 'rgba(196,0,26,0.20)'}`, borderRadius: 10, background: CANVAS, fontSize: 12, color: canApprove ? GREEN : '#9f0712' }}>
            VAL analizó <strong>{proposal.documento.nombre}</strong>. La factura se compara con la OC sin modificar los artículos extraídos de la BL.
          </div>
          <div style={{ overflowX: 'auto', border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: CANVAS }}>
            <div style={{ minWidth: 680 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px minmax(220px, 1fr) 120px 130px 110px', padding: '9px 12px', background: '#f7f8f7', borderBottom: `1px solid ${HAIRLINE}` }}>
                {['SKU', 'Artículo', 'Saldo OC', 'Cantidad factura', 'Resultado'].map(label => <span key={label} style={{ fontSize: 10.5, fontWeight: 700, color: MUTED }}>{label}</span>)}
              </div>
              {proposal.items.map(item => (
                <div key={item.articuloId} style={{ display: 'grid', gridTemplateColumns: '120px minmax(220px, 1fr) 120px 130px 110px', padding: '11px 12px', borderTop: `1px solid ${HAIRLINE}`, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: INK }}>{item.codigoSAP}</span>
                  <span style={{ fontSize: 12, color: INK }}>{item.descripcion}</span>
                  <span style={{ fontSize: 12, color: MUTED }}>{item.saldoDisponible.toLocaleString()} {item.um}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: INK }}>{item.cantidadFactura.toLocaleString()} {item.um}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: item.resultado === 'Excede saldo' ? '#c4001a' : item.resultado === 'Parcial' ? '#b45309' : GREEN }}>{item.resultado}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
            <AppButton type="button" variant="secondary" onClick={() => setProposal(null)}>Cancelar</AppButton>
            <AppButton type="button" disabled={!canApprove} icon={<CheckCircle size={14} />} onClick={approveProposal}>Aprobar validación</AppButton>
          </div>
        </div>
      )}

      {!proposal && !currentInvoice && !processingError && (
        <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>Cargá la Factura Comercial para iniciar la validación. Los artículos y contenedores del embarque permanecen vinculados a la BL.</div>
      )}
    </section>
  );
}

interface ShipmentDepartureProposal {
  documento: Documento;
  numeroDocumento: string;
  fechaEmbarqueReal: string;
  eta: string;
  buqueForwarder: string;
  contenedores: string[];
  items: {
    codigoSAP: string;
    descripcion: string;
    cantidad: number;
    um: string;
    contenedor: string;
    resultado: 'Coincide' | 'Diferencia' | 'No reconocido';
  }[];
}

function buildShipmentDepartureProposal(file: File, content: string, sub: Subcarpeta, carpeta: Carpeta): ShipmentDepartureProposal {
  const numeroDocumento = content.match(/(?:Bill of Lading No\.|CRT No\.|AWB No\.):\s*([^\r\n]+)/i)?.[1]?.trim() ?? file.name.replace(/\.[^.]+$/, '');
  const fechaEmbarqueReal = content.match(/(?:On Board Date|Departure Date|Border Crossing Date):\s*(\d{4}-\d{2}-\d{2})/i)?.[1] ?? '';
  const eta = content.match(/(?:ETA Buenos Aires|Estimated Arrival):\s*(\d{4}-\d{2}-\d{2})/i)?.[1] ?? '';
  const buqueForwarder = content.match(/Vessel \/ Voyage:\s*([^\r\n]+)/i)?.[1]?.trim()
    ?? content.match(/(?:Carrier|Forwarder):\s*([^\r\n]+)/i)?.[1]?.trim()
    ?? '';
  const contenedores = [...content.matchAll(/Container No\.:\s*([^\r\n]+)/gi)].map(match => match[1].trim());
  let currentContainer = '';
  const items = content.split(/\r?\n/).flatMap(line => {
    const containerMatch = line.match(/Container No\.:\s*(.+)/i);
    if (containerMatch) {
      currentContainer = containerMatch[1].trim();
      return [];
    }
    const articleMatch = line.match(/SAP\s+(\d+)\s*\/\s*([\d.,]+)\s+([A-Za-z0-9]+)/i);
    if (!articleMatch) return [];
    const codigoSAP = articleMatch[1];
    const cantidad = parseLocalizedNumber(articleMatch[2]);
    const articulo = carpeta.articulos.find(item => item.codigoSAP === codigoSAP);
    const asignacion = articulo ? sub.articulosEmbarque.find(item => item.articuloId === articulo.id) : undefined;
    return [{
      codigoSAP,
      descripcion: articulo?.descripcion || 'Artículo no encontrado en la OC',
      cantidad,
      um: articleMatch[3].toUpperCase(),
      contenedor: currentContainer,
      resultado: !articulo || !asignacion ? 'No reconocido' as const : asignacion.cantidad === cantidad ? 'Coincide' as const : 'Diferencia' as const,
    }];
  });
  return {
    documento: {
      id: `doc-${Date.now()}`,
      nombre: file.name,
      referencia: numeroDocumento,
      tipo: 'Bill of Lading / CRT',
      tamano: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      fecha: new Date().toISOString().split('T')[0],
      visibilidad: 'Importaciones, Dirección y Despachante',
    },
    numeroDocumento,
    fechaEmbarqueReal,
    eta,
    buqueForwarder,
    contenedores,
    items,
  };
}

function ShipmentDeparturePanel({ sub, readonly, onOpenAttachments }: { sub: Subcarpeta; readonly: boolean; onOpenAttachments: () => void }) {
  const isPending = sub.estado === 'Pendiente de embarque';
  if (!isPending || sub.articulosEmbarque.length === 0) return null;

  return (
    <section style={{ padding: 16, border: `1px solid ${HAIRLINE}`, borderRadius: 14, background: PARCHMENT, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Salida del embarque</div>
        <div style={{ marginTop: 4, fontSize: 12, color: MUTED }}>Pendiente de documento de transporte y confirmación de salida.</div>
      </div>
      {!readonly && <AppButton type="button" size="md" icon={<Ship size={14} />} onClick={onOpenAttachments}>Cargar documento en Anexos</AppButton>}
    </section>
  );
}

function GeneralSection({ sub, readonly, onOpenAttachments }: { sub: Subcarpeta; readonly: boolean; onOpenAttachments: () => void }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: 16, display: 'grid', gap: 18 }}>
      <ShipmentDeparturePanel sub={sub} readonly={readonly} onOpenAttachments={onOpenAttachments} />
      <section>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Datos generales del embarque</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', columnGap: 20, rowGap: 16 }}>
          <Field label="Factura" value={sub.facturaNum || '—'} />
          <Field label="Fecha factura" value={sub.fechaFactura || '—'} />
          <Field label="Importe total" value={sub.importeTotal ? `USD ${sub.importeTotal.toLocaleString()}` : '—'} />
          <Field label="Transporte" value={sub.transporte} />
          <Field label="Buque / Forwarder" value={sub.buqueForwarder || '—'} />
          <Field label="BL / CRT / AWB" value={sub.blCrtAwb || '—'} />
          <Field label="Contenedores" value={String(sub.contenedores || 0)} />
          <Field label="Modalidad de carga" value={getLoadModeLabel(sub)} />
          <Field label="ETA" value={sub.eta || '—'} />
          <Field label="Fecha embarque real" value={sub.fechaEmbarqueReal || '—'} />
          <Field label="Peso neto (kg)" value={sub.pesoNeto ? sub.pesoNeto.toLocaleString() : '—'} />
          <Field label="Peso bruto (kg)" value={sub.pesoBruto ? sub.pesoBruto.toLocaleString() : '—'} />
          <Field label="UME" value={sub.ume ? `${sub.ume} ${sub.umeUnidad || ''}` : '—'} />
        </div>
      </section>
    </div>
  );
}

function ArticulosSection({ sub, carpeta }: { sub: Subcarpeta; carpeta: Carpeta }) {
  const isMobile = useIsMobile();
  const shipmentArticles = getShipmentArticles(sub, carpeta);
  const totalUnits = shipmentArticles.reduce((total, item) => total + item.cantidad, 0);
  const hasBillOfLading = Boolean(sub.blCrtAwb);

  return (
    <div style={{ padding: 16, display: 'grid', gap: 12 }}>
      <div style={{ fontSize: 13, color: MUTED }}>
        {shipmentArticles.length} artículo{shipmentArticles.length === 1 ? '' : 's'} asignado{shipmentArticles.length === 1 ? '' : 's'} · {totalUnits.toLocaleString()} unidades embarcadas
      </div>
      {shipmentArticles.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: MUTED, fontSize: 13, background: PARCHMENT, borderRadius: 12 }}>Sin artículos asignados a este embarque.</div>
      ) : (
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 14, overflow: 'hidden', background: CANVAS }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : hasBillOfLading ? '160px minmax(0, 1.8fr) 110px 120px 90px 180px' : '160px minmax(0, 1.8fr) 110px 120px 90px', padding: isMobile ? '10px 12px' : '10px 14px', background: PARCHMENT, borderBottom: `1px solid ${HAIRLINE}` }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: MUTED }}>CÓDIGO SAP</span>
            {!isMobile && <span style={{ fontSize: 10.5, fontWeight: 700, color: MUTED }}>ARTÍCULO</span>}
            {!isMobile && <span style={{ fontSize: 10.5, fontWeight: 700, color: MUTED }}>LÍNEA</span>}
            {!isMobile && <span style={{ fontSize: 10.5, fontWeight: 700, color: MUTED }}>CANTIDAD</span>}
            {!isMobile && <span style={{ fontSize: 10.5, fontWeight: 700, color: MUTED }}>UM</span>}
            {!isMobile && hasBillOfLading && <span style={{ fontSize: 10.5, fontWeight: 700, color: MUTED }}>CONTENEDOR</span>}
          </div>
          {shipmentArticles.map((item, index) => (
            <div key={`${sub.id}-${item.articuloId}-${index}`} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : hasBillOfLading ? '160px minmax(0, 1.8fr) 110px 120px 90px 180px' : '160px minmax(0, 1.8fr) 110px 120px 90px', gap: isMobile ? 8 : 0, padding: isMobile ? 12 : '12px 14px', borderTop: index > 0 ? `1px solid ${HAIRLINE}` : 'none', alignItems: 'start' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: INK }}>{item.codigoSAP}</div>
                {isMobile && <div style={{ fontSize: 11.5, color: INK, marginTop: 4 }}>{item.descripcion}</div>}
                {isMobile && <div style={{ fontSize: 10.5, color: MUTED, marginTop: 4 }}>{item.linea} · {item.cantidad.toLocaleString()} {item.um}</div>}
                {isMobile && hasBillOfLading && <div style={{ fontSize: 10.5, color: MUTED, marginTop: 4 }}>{item.contenedores.length ? item.contenedores.join(' · ') : 'Contenedor pendiente'}</div>}
              </div>
              {!isMobile && <div style={{ minWidth: 0, fontSize: 11.5, color: INK }}>{item.descripcion}</div>}
              {!isMobile && <div style={{ fontSize: 11.5, color: INK }}>{item.linea}</div>}
              {!isMobile && <div style={{ fontSize: 11.5, color: INK }}>{item.cantidad.toLocaleString()}</div>}
              {!isMobile && <div style={{ fontSize: 11.5, color: INK }}>{item.um}</div>}
              {!isMobile && hasBillOfLading && <div style={{ fontSize: 11, color: item.contenedores.length ? INK : MUTED }}>{item.contenedores.length ? item.contenedores.join(' · ') : 'Pendiente BL'}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TransitoSection({ sub }: { sub: Subcarpeta }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Card title="Datos del embarque">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 16 }}>
          <Field label="Factura" value={sub.facturaNum || '—'} />
          <Field label="Fecha factura" value={sub.fechaFactura || '—'} />
          <Field label="Importe total" value={sub.importeTotal ? `USD ${sub.importeTotal.toLocaleString()}` : '—'} />
          <Field label="Transporte" value={sub.transporte} />
          <Field label="Buque / Forwarder" value={sub.buqueForwarder || '—'} />
          <Field label="BL / CRT / AWB" value={sub.blCrtAwb || '—'} />
          <Field label="Contenedores" value={String(sub.contenedores || 0)} />
          <Field label="ETA" value={sub.eta || '—'} />
          <Field label="Fecha embarque real" value={sub.fechaEmbarqueReal || '—'} />
          <Field label="Peso neto (kg)" value={sub.pesoNeto ? sub.pesoNeto.toLocaleString() : '—'} />
          <Field label="Peso bruto (kg)" value={sub.pesoBruto ? sub.pesoBruto.toLocaleString() : '—'} />
          <Field label="UME" value={sub.ume ? `${sub.ume} ${sub.umeUnidad || ''}` : '—'} />
        </div>
      </Card>
      <Card title="Artículos del embarque">
        {sub.articulosEmbarque.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: MUTED, fontSize: 13 }}>Sin artículos asignados a este embarque.</div>
        ) : (
          <div style={{ fontSize: 13, color: MUTED }}>{sub.articulosEmbarque.length} artículo{sub.articulosEmbarque.length > 1 ? 's' : ''} asignados</div>
        )}
      </Card>
    </div>
  );
}

/* ── Aduana ────────────────────────────────────────────────── */
function AduanaSection({ sub, despachante, readonly, onUpdateSubcarpeta }: { sub: Subcarpeta; despachante: any; readonly: boolean; onUpdateSubcarpeta?: (patch: Partial<Subcarpeta>) => void }) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ canalAduana: 'Pendiente', duaNum: '', despachante: '', despachoTipo: '', fechaOficializacion: '', fechaSalidaPuerto: '', gastosARS: '', vepUSD: '' });
  const openEditor = () => {
    setForm({
      canalAduana: sub.canalAduana,
      duaNum: sub.duaNum,
      despachante: sub.despachante,
      despachoTipo: sub.despachoTipo || '',
      fechaOficializacion: sub.fechaOficializacion || '',
      fechaSalidaPuerto: sub.fechaSalidaPuerto || '',
      gastosARS: sub.gastosARS ? String(sub.gastosARS) : '',
      vepUSD: sub.vepUSD ? String(sub.vepUSD) : '',
    });
    setIsEditing(true);
  };
  const saveCustoms = () => {
    onUpdateSubcarpeta?.({
      canalAduana: form.canalAduana as Subcarpeta['canalAduana'],
      duaNum: form.duaNum.trim(),
      despachante: form.despachante.trim(),
      despachoTipo: form.despachoTipo as Subcarpeta['despachoTipo'] || undefined,
      fechaOficializacion: form.fechaOficializacion,
      fechaSalidaPuerto: form.fechaSalidaPuerto,
      gastosARS: Number(form.gastosARS) || 0,
      vepUSD: Number(form.vepUSD) || 0,
    });
    setIsEditing(false);
  };
  const inputStyle: React.CSSProperties = { width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 13, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Despacho aduanero</div>
          {!readonly && <AppButton type="button" size="md" icon={<Pencil size={13} />} onClick={openEditor}>Editar</AppButton>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 16 }}>
          <Field label="Canal">
            <CanalBadge canal={sub.canalAduana} />
          </Field>
          <Field label="DUA" value={sub.duaNum || '—'} />
          <Field label="Despachante" value={despachante?.nombre || sub.despachante || '—'} />
          <Field label="Tipo de despacho" value={sub.despachoTipo || '—'} />
          <Field label="Fecha oficialización" value={sub.fechaOficializacion || '—'} />
          <Field label="Fecha salida puerto" value={sub.fechaSalidaPuerto || '—'} />
          <Field label="Pedido SAP Tx.55" value={sub.pedidoSAP55 || '—'} />
          <Field label="Ingreso SAP Tx.18" value={sub.ingresoSAP18 || '—'} />
        </div>
      </section>
      <section style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Gastos de nacionalización</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
          <Field label="Gastos ARS" value={sub.gastosARS ? `$ ${sub.gastosARS.toLocaleString()}` : '—'} />
          <Field label="VEP (USD)" value={sub.vepUSD ? `USD ${sub.vepUSD.toLocaleString()}` : '—'} />
          <Field label="Estado" value={sub.estado} />
        </div>
      </section>
      {sub.incidencias.length > 0 && (
        <section style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Incidencias</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {sub.incidencias.map(inc => (
              <div key={inc.id} style={{ padding: '10px 12px', borderRadius: 8, background: inc.resuelta ? 'rgba(26,122,74,0.04)' : 'rgba(196,0,26,0.04)', border: `1px solid ${inc.resuelta ? 'rgba(26,122,74,0.15)' : 'rgba(196,0,26,0.15)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  {inc.resuelta ? <CheckCircle size={13} color="#1a7a4a" /> : <AlertTriangle size={13} color="#c4001a" />}
                  <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{inc.tipo}</span>
                </div>
                <div style={{ fontSize: 12, color: MUTED }}>{inc.comentario} · {inc.cantidadAfectada} unidades · {inc.fecha}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      <AppDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        title={`Editar aduana · ${sub.numero}`}
        description="Datos del despacho y gastos de nacionalización"
        maxWidth={680}
        footer={<><AppButton type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</AppButton><AppButton type="button" onClick={saveCustoms}>Guardar cambios</AppButton></>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 14, paddingTop: 8 }}>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>CANAL<select value={form.canalAduana} onChange={event => setForm(current => ({ ...current, canalAduana: event.target.value }))} style={inputStyle}><option value="Pendiente">Pendiente</option><option value="Verde">Verde</option><option value="Rojo">Rojo</option></select></label>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>DUA<input value={form.duaNum} onChange={event => setForm(current => ({ ...current, duaNum: event.target.value }))} style={inputStyle} /></label>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>DESPACHANTE<input value={form.despachante} onChange={event => setForm(current => ({ ...current, despachante: event.target.value }))} style={inputStyle} /></label>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>TIPO DE DESPACHO<select value={form.despachoTipo} onChange={event => setForm(current => ({ ...current, despachoTipo: event.target.value }))} style={inputStyle}><option value="">Sin definir</option><option value="Despacho Directo">Despacho Directo</option><option value="ZFI">ZFI</option><option value="ZFE">ZFE</option></select></label>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>FECHA OFICIALIZACIÓN<input type="date" value={form.fechaOficializacion} onChange={event => setForm(current => ({ ...current, fechaOficializacion: event.target.value }))} style={inputStyle} /></label>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>FECHA SALIDA PUERTO<input type="date" value={form.fechaSalidaPuerto} onChange={event => setForm(current => ({ ...current, fechaSalidaPuerto: event.target.value }))} style={inputStyle} /></label>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>GASTOS ARS<input type="number" value={form.gastosARS} onChange={event => setForm(current => ({ ...current, gastosARS: event.target.value }))} style={inputStyle} /></label>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>VEP USD<input type="number" value={form.vepUSD} onChange={event => setForm(current => ({ ...current, vepUSD: event.target.value }))} style={inputStyle} /></label>
        </div>
      </AppDialog>
    </div>
  );
}

/* ── Costeo (particular de la sub-carpeta) ─────────────────── */
function CosteoSection({ sub, carpeta, readonly, onUpdateSubcarpeta }: { sub: Subcarpeta; carpeta: Carpeta; readonly: boolean; onUpdateSubcarpeta?: (patch: Partial<Subcarpeta>) => void }) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ importeTotal: '', coeficienteReal: '', pedidoSAP55: '', ingresoSAP18: '' });
  const gastosNacionalizacion = sub.gastosARS ?? 0;
  const vepUSD = sub.vepUSD ?? 0;
  const totalArticulos = sub.articulosEmbarque.reduce((total, item) => total + item.cantidad, 0);
  const coefEst = sub.coeficienteEst ?? carpeta.coeficienteEst;
  const coefReal = sub.coeficienteReal ?? null;
  const desv = coefReal ? coefReal - coefEst : null;
  const desvPct = desv ? (desv / coefEst) * 100 : null;
  const alertColor = desvPct !== null && Math.abs(desvPct) > 5 ? '#b84800' : '#1a7a4a';
  const openEditor = () => {
    setForm({
      importeTotal: sub.importeTotal ? String(sub.importeTotal) : '',
      coeficienteReal: coefReal ? String(coefReal) : '',
      pedidoSAP55: sub.pedidoSAP55,
      ingresoSAP18: sub.ingresoSAP18,
    });
    setIsEditing(true);
  };
  const saveCosting = () => {
    onUpdateSubcarpeta?.({
      importeTotal: Number(form.importeTotal) || 0,
      coeficienteReal: form.coeficienteReal ? Number(form.coeficienteReal) : null,
      pedidoSAP55: form.pedidoSAP55.trim(),
      ingresoSAP18: form.ingresoSAP18.trim(),
    });
    setIsEditing(false);
  };
  const inputStyle: React.CSSProperties = { width: '100%', minHeight: 40, padding: '9px 12px', fontSize: 13, color: INK, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Costeo del embarque</div>
          {!readonly && sub.estado === 'En Stock' && (
            <AppButton type="button" size="md" icon={<Pencil size={13} />} onClick={openEditor}>Editar</AppButton>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 16 }}>
          <Field label="Importe factura" value={sub.importeTotal ? `${carpeta.moneda} ${sub.importeTotal.toLocaleString()}` : '—'} />
          <Field label="Gastos nacionalización" value={gastosNacionalizacion ? `$ ${gastosNacionalizacion.toLocaleString()}` : 'Pendiente'} />
          <Field label="VEP" value={vepUSD ? `USD ${vepUSD.toLocaleString()}` : 'Pendiente'} />
          <Field label="Artículos asignados" value={totalArticulos ? totalArticulos.toLocaleString() : '—'} />
          <Field label="Peso neto" value={sub.pesoNeto ? `${sub.pesoNeto.toLocaleString()} kg` : '—'} />
          <Field label="Peso bruto" value={sub.pesoBruto ? `${sub.pesoBruto.toLocaleString()} kg` : '—'} />
          <Field label="Contenedores" value={String(sub.contenedores || 0)} />
          <Field label="Moneda OC" value={carpeta.moneda} />
        </div>
        {!gastosNacionalizacion && !vepUSD && (
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(180,83,9,0.04)', borderRadius: 8, border: '1px solid rgba(180,83,9,0.12)', fontSize: 12, color: '#b45309' }}>
            Los gastos y VEP se cargan cuando el embarque entra en etapa aduanera/oficialización.
          </div>
        )}
      </section>

      <section style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Coeficientes</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
          <Field label="Coeficiente estimado" value={coefEst.toFixed(2)} />
          <Field label="Coeficiente real" value={coefReal?.toFixed(2) || '—'} color={coefReal ? alertColor : MUTED} />
          <Field label="Desvío" value={desvPct !== null ? `${desv! > 0 ? '+' : ''}${desv!.toFixed(2)} (${desvPct.toFixed(1)}%)` : 'Pendiente'} color={desvPct !== null ? alertColor : MUTED} />
        </div>
      </section>

      <section style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tipo de cambio</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
          <Field label="Moneda origen" value={carpeta.moneda} />
          <Field label="TC al momento de oficialización" value="—" />
          <Field label="TC al momento de pago" value="—" />
        </div>
        <div style={{ padding: '10px 12px', background: 'rgba(180,83,9,0.04)', borderRadius: 8, border: '1px solid rgba(180,83,9,0.12)' }}>
          <div style={{ fontSize: 12, color: '#b45309' }}>
            El tipo de cambio puede afectar el coeficiente real. Se recalcula automáticamente al registrar el TC de oficialización.
          </div>
        </div>
      </section>

      <AppDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        title={`Editar costeo · ${sub.numero}`}
        description="Importe, coeficiente final y referencias SAP del embarque"
        maxWidth={620}
        footer={(
          <>
            <AppButton type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</AppButton>
            <AppButton type="button" onClick={saveCosting}>Guardar cambios</AppButton>
          </>
        )}
      >
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 14, paddingTop: 8 }}>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>IMPORTE FACTURA ({carpeta.moneda})<input type="number" value={form.importeTotal} onChange={event => setForm(current => ({ ...current, importeTotal: event.target.value }))} style={inputStyle} /></label>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>COEFICIENTE REAL<input type="number" step="0.01" value={form.coeficienteReal} onChange={event => setForm(current => ({ ...current, coeficienteReal: event.target.value }))} style={inputStyle} /></label>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>PEDIDO SAP TX.55<input value={form.pedidoSAP55} onChange={event => setForm(current => ({ ...current, pedidoSAP55: event.target.value }))} style={inputStyle} /></label>
          <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: MUTED }}>INGRESO SAP TX.18<input value={form.ingresoSAP18} onChange={event => setForm(current => ({ ...current, ingresoSAP18: event.target.value }))} style={inputStyle} /></label>
        </div>
      </AppDialog>
    </div>
  );
}

/* ── Documentos del embarque ──────────────────────────────── */
function DocumentosSectionV2({ sub, carpeta, readonly, onAddDocumento, onUpdateSubcarpeta }: { sub: Subcarpeta; carpeta: Carpeta; readonly: boolean; onAddDocumento?: (doc: any) => void; onUpdateSubcarpeta?: (patch: Partial<Subcarpeta>) => void }) {
  const isMobile = useIsMobile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<'identification' | 'review'>('identification');
  const [proposal, setProposal] = useState<ShipmentDepartureProposal | null>(null);
  const [processingError, setProcessingError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tipo, setTipo] = useState('Factura Comercial');
  const linkedMotherDocuments = (carpeta.documentos ?? []).filter(documento => documento.subcarpetaIds?.includes(sub.id));
  const visibleDocuments = [...linkedMotherDocuments, ...sub.documentos.filter(documento => !linkedMotherDocuments.some(linked => linked.id === documento.id))];
  const tipoColors: Record<string, string> = {
    'Factura Comercial': '#5b21b6',
    'Bill of Lading / CRT': '#5e5ce6',
    'Packing List': '#b45309',
    'Certificado de Origen': '#0066cc',
  };
  const isTransportDocument = tipo === 'Bill of Lading / CRT';
  const canReview = Boolean(selectedFile) && !processingError && (!isTransportDocument || Boolean(proposal));
  const canConfirm = canReview && (!proposal || proposal.items.length > 0 && proposal.items.every(item => item.resultado === 'Coincide'));
  const resetWizard = () => {
    setSelectedFile(null);
    setProposal(null);
    setProcessingError('');
    setWizardStep('identification');
    setIsComposerOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const analyzeFile = async (file: File | null) => {
    setSelectedFile(file);
    setProposal(null);
    setProcessingError('');
    if (!file) return;
    const content = await file.text();
    const source = `${file.name}\n${content}`;
    const inferredType = /bill of lading|bill_of_lading|\bcrt\b|\bawb\b/i.test(source) ? 'Bill of Lading / CRT'
      : /invoice|factura/i.test(source) ? 'Factura Comercial'
      : /packing/i.test(source) ? 'Packing List'
      : /origin|origen/i.test(source) ? 'Certificado de Origen'
      : 'Factura Comercial';
    setTipo(inferredType);
    if (inferredType === 'Bill of Lading / CRT') {
      const nextProposal = buildShipmentDepartureProposal(file, content, sub, carpeta);
      if (!nextProposal.numeroDocumento || !nextProposal.fechaEmbarqueReal || nextProposal.items.length === 0) {
        setProcessingError('No se pudieron identificar el embarque y sus artículos. Revisá el documento antes de continuar.');
      } else {
        setProposal(nextProposal);
      }
    }
  };
  const handleAttach = () => {
    if (!selectedFile || !canConfirm) return;
    if (proposal && onUpdateSubcarpeta) {
      const articulosEmbarque = sub.articulosEmbarque.map(item => {
        const article = carpeta.articulos.find(candidate => candidate.id === item.articuloId);
        const identified = proposal.items.find(candidate => candidate.codigoSAP === article?.codigoSAP);
        return { ...item, contenedores: identified?.contenedor ? [identified.contenedor] : item.contenedores };
      });
      onUpdateSubcarpeta({
        estado: 'En Tránsito',
        blCrtAwb: proposal.numeroDocumento,
        fechaEmbarqueReal: proposal.fechaEmbarqueReal,
        eta: proposal.eta || sub.eta,
        buqueForwarder: proposal.buqueForwarder || sub.buqueForwarder,
        contenedores: proposal.contenedores.length || sub.contenedores,
        documentos: [...sub.documentos, proposal.documento],
        articulosEmbarque,
      });
    } else {
      onAddDocumento?.({
        id: `doc-${Date.now()}`,
        nombre: selectedFile.name,
        tipo,
        tamano: `${Math.max(1, Math.round(selectedFile.size / 1024))} KB`,
        fecha: new Date().toISOString().split('T')[0],
      });
    }
    resetWizard();
  };

  return (
    <div style={{ padding: 16, display: 'grid', gap: 12 }}>
      <InvoiceValPanel sub={sub} carpeta={carpeta} readonly={readonly} onUpdateSubcarpeta={onUpdateSubcarpeta} />
      {!readonly && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AppButton
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setIsComposerOpen(true)}
          >
            Adjuntar anexo
          </AppButton>
        </div>
      )}
      <div style={{ overflow: 'hidden', background: CANVAS, border: `1px solid ${HAIRLINE}`, borderRadius: 12 }}>
        <AppDialog
          open={isComposerOpen}
          onOpenChange={open => { if (!open) resetWizard(); }}
          title="Adjuntar anexo al embarque"
          description={wizardStep === 'identification' ? 'Paso 1 de 2 · Identificación y clasificación' : 'Paso 2 de 2 · Revisión antes de confirmar'}
          maxWidth={900}
          footer={(
            <>
              <AppButton type="button" variant="secondary" onClick={wizardStep === 'review' ? () => setWizardStep('identification') : resetWizard}>{wizardStep === 'review' ? 'Volver' : 'Cancelar'}</AppButton>
              {wizardStep === 'identification'
                ? <AppButton type="button" disabled={!canReview} onClick={() => setWizardStep('review')}>Revisar identificación</AppButton>
                : <AppButton type="button" disabled={!canConfirm} onClick={handleAttach}>{proposal ? 'Confirmar salida' : 'Adjuntar anexo'}</AppButton>}
            </>
          )}
        >
          {wizardStep === 'identification' ? <div style={{ display: 'grid', gap: 14, paddingTop: 8 }}>
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
                if (file) void analyzeFile(file);
              }}
              style={{ border: `1px dashed ${isDragActive ? GREEN : HAIRLINE}`, borderRadius: 14, background: isDragActive ? 'rgba(26,92,56,0.06)' : CANVAS, padding: 14, transition: 'border-color 0.15s, background 0.15s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ minWidth: 0 }}>
                  {selectedFile ? (
                    <div style={{ fontSize: 13, fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile.name}</div>
                  ) : (
                    <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>Sin archivo adjunto</div>
                  )}
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Arrastrá un archivo o adjuntalo desde tu equipo.</div>
                </div>
                {!selectedFile ? (
                  <button type="button" onClick={() => fileInputRef.current?.click()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 36, padding: '8px 12px', borderRadius: 9999, border: `1px solid ${GREEN}`, background: CANVAS, color: GREEN, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Seleccionar archivo
                  </button>
                ) : (
                  <button type="button" onClick={() => void analyzeFile(null)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, padding: 0, borderRadius: 9999, border: 'none', background: 'rgba(196,0,26,0.06)', color: '#c4001a', cursor: 'pointer' }}>
                    ×
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf,.txt,.doc,.docx,.xlsx,.xls" onChange={event => void analyzeFile(event.target.files?.[0] ?? null)} style={{ display: 'none' }} />
            </div>
            {selectedFile && <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 16, padding: 14, border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: PARCHMENT }}>
              <Field label="Clasificación detectada" value={tipo} />
              <Field label="Embarque relacionado" value={sub.numero} />
              {proposal && <Field label="Documento" value={proposal.numeroDocumento} />}
              {proposal && <Field label="Artículos identificados" value={String(proposal.items.length)} />}
            </div>}
            {processingError && <div style={{ padding: '10px 12px', border: '1px solid rgba(196,0,26,0.20)', borderRadius: 10, background: 'rgba(196,0,26,0.05)', color: '#9f0712', fontSize: 12 }}>{processingError}</div>}
          </div> : proposal ? <div style={{ display: 'grid', gap: 16, paddingTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
              <Field label="BL / CRT / AWB" value={proposal.numeroDocumento} />
              <Field label="Fecha embarque real" value={proposal.fechaEmbarqueReal} />
              <Field label="ETA" value={proposal.eta || 'No informada'} />
              <Field label="Buque / Forwarder" value={proposal.buqueForwarder || 'No informado'} />
              <Field label="Embarque" value={sub.numero} />
              <Field label="Contenedores" value={String(proposal.contenedores.length)} />
            </div>
            <div style={{ overflowX: 'auto', border: `1px solid ${HAIRLINE}`, borderRadius: 12 }}>
              <div style={{ minWidth: 720 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '110px minmax(220px, 1fr) 120px 160px 110px', padding: '9px 12px', background: '#f7f8f7' }}>
                  {['SKU', 'Artículo', 'Cantidad', 'Contenedor', 'Resultado'].map(label => <span key={label} style={{ fontSize: 10.5, fontWeight: 700, color: MUTED }}>{label}</span>)}
                </div>
                {proposal.items.map(item => <div key={`${item.codigoSAP}-${item.contenedor}`} style={{ display: 'grid', gridTemplateColumns: '110px minmax(220px, 1fr) 120px 160px 110px', padding: '11px 12px', borderTop: `1px solid ${HAIRLINE}`, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{item.codigoSAP}</span>
                  <span style={{ fontSize: 12 }}>{item.descripcion}</span>
                  <span style={{ fontSize: 12 }}>{item.cantidad.toLocaleString()} {item.um}</span>
                  <span style={{ fontSize: 12 }}>{item.contenedor || '—'}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: item.resultado === 'Coincide' ? GREEN : '#c4001a' }}>{item.resultado}</span>
                </div>)}
              </div>
            </div>
            {!canConfirm && <div style={{ fontSize: 12, color: '#9f0712' }}>No se puede confirmar la salida hasta resolver las diferencias con la asignación VAL.</div>}
          </div> : <div style={{ paddingTop: 8, display: 'grid', gap: 16 }}>
            <Field label="Archivo" value={selectedFile?.name || '—'} />
            <Field label="Clasificación" value={tipo} />
            <Field label="Embarque relacionado" value={sub.numero} />
          </div>}
        </AppDialog>
        {visibleDocuments.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 13 }}>Sin anexos cargados.</div>
        ) : (
          visibleDocuments.map((doc, index) => {
            const itemColor = tipoColors[doc.tipo] || MUTED;
            const linkedFromMother = linkedMotherDocuments.some(linked => linked.id === doc.id);
            return (
              <div key={doc.id} style={{ padding: isMobile ? '14px 16px' : '14px 18px', borderBottom: index < visibleDocuments.length - 1 ? `1px solid ${HAIRLINE}` : 'none', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.35fr) auto', gap: isMobile ? 10 : 16, alignItems: 'center' }}>
                <div style={{ minWidth: 0, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <FileText size={16} color={MUTED} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.nombre}</div>
                    {doc.referencia && <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Ref. {doc.referencia}</div>}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      <span style={{ fontSize: 11, color: itemColor, background: `${itemColor}14`, border: `1px solid ${itemColor}33`, borderRadius: 9999, padding: '3px 8px' }}>{doc.tipo}</span>
                      <span style={{ fontSize: 11, color: GREEN, background: 'rgba(26,92,56,0.08)', border: '1px solid rgba(26,92,56,0.18)', borderRadius: 9999, padding: '3px 8px' }}>{sub.numero}</span>
                      {linkedFromMother && <span style={{ fontSize: 11, color: MUTED, background: PARCHMENT, border: `1px solid ${HAIRLINE}`, borderRadius: 9999, padding: '3px 8px' }}>Vinculado desde carpeta madre</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', justifyItems: isMobile ? 'start' : 'end', gap: 8 }}>
                  <div style={{ fontSize: 12, color: MUTED }}>{doc.tamano} · {doc.fecha}</div>
                  <AppButton size="sm" variant="tertiary">Ver</AppButton>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function DocumentosSection({ sub }: { sub: Subcarpeta }) {
  return (
    <Card title="Anexos del embarque">
      {sub.documentos.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 13 }}>Sin anexos cargados.</div>
      ) : (
        <div style={{ display: 'grid', gap: 6 }}>
          {sub.documentos.map(doc => (
            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: PARCHMENT, border: `1px solid ${HAIRLINE}` }}>
              <FileText size={16} color={MUTED} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.nombre}</div>
                {doc.referencia && <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Ref. {doc.referencia}</div>}
                <div style={{ fontSize: 11, color: MUTED }}>{doc.tipo} · {doc.tamano} · {doc.fecha}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── Recepción en depósito ─────────────────────────────────── */
function RecepcionSection({ sub }: { sub: Subcarpeta }) {
  const hasIncidencias = sub.incidencias.length > 0;
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Card title="Estado de recepción">
        <div style={{ padding: '14px 16px', background: sub.estado === 'En Stock' ? 'rgba(26,122,74,0.04)' : PARCHMENT, borderRadius: 10, border: `1px solid ${sub.estado === 'En Stock' ? 'rgba(26,122,74,0.15)' : HAIRLINE}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {sub.estado === 'En Stock' ? <CheckCircle size={16} color="#1a7a4a" /> : <Package size={16} color={MUTED} />}
            <span style={{ fontSize: 14, fontWeight: 600, color: sub.estado === 'En Stock' ? '#1a7a4a' : INK }}>
              {sub.estado === 'En Stock' ? 'Recibido en depósito' : 'Pendiente de recepción'}
            </span>
          </div>
          {sub.estado !== 'En Stock' && (
            <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>
              Depósito Garín recibirá notificación cuando el embarque esté oficializado.
            </div>
          )}
        </div>
      </Card>
      {hasIncidencias && (
        <Card title="Incidencias de recepción">
          <div style={{ display: 'grid', gap: 6 }}>
            {sub.incidencias.map(inc => (
              <div key={inc.id} style={{ padding: '10px 12px', borderRadius: 8, background: inc.resuelta ? 'rgba(26,122,74,0.04)' : 'rgba(196,0,26,0.04)', border: `1px solid ${inc.resuelta ? 'rgba(26,122,74,0.15)' : 'rgba(196,0,26,0.15)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  {inc.resuelta ? <CheckCircle size={13} color="#1a7a4a" /> : <AlertTriangle size={13} color="#c4001a" />}
                  <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{inc.tipo}</span>
                  <span style={{ fontSize: 11, color: MUTED, marginLeft: 'auto' }}>{inc.fecha}</span>
                </div>
                <div style={{ fontSize: 12, color: MUTED, paddingLeft: 19 }}>{inc.comentario} · {inc.cantidadAfectada} unid. afectadas</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
