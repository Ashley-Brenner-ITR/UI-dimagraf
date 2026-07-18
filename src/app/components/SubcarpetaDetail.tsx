import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Ship, FileText, DollarSign, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Subcarpeta, Carpeta } from './mockData';
import { getDespachante } from './mockData';
import { NeonBadge, CanalBadge } from './NeonBadge';
import { useIsMobile } from './ui/use-mobile';
import { AppButton } from './AppButton';
import { InfoField as Field } from './InfoField';
import { SectionCard as Card } from './SectionCard';
import { color } from './theme';

const INK = color.ink;
const MUTED = color.muted;
const HAIRLINE = color.hairline;
const PARCHMENT = color.parchment;
const GREEN = color.brand;
const CANVAS = color.canvas;

type SubTab = 'transito' | 'aduana' | 'costeo' | 'documentos' | 'recepcion';

function getInitialSubTab(sub: Subcarpeta, hideImportes: boolean): SubTab {
  return 'transito';
}

function statusText(ready: boolean) {
  return ready ? 'Cargado' : 'Pendiente';
}

interface Props {
  subcarpeta: Subcarpeta;
  carpeta: Carpeta;
  onBack: () => void;
  onAddDocumento?: (doc: any) => void;
  readonly?: boolean;
  hideImportes?: boolean;
  initialTab?: SubTab;
}

export function SubcarpetaDetail({ subcarpeta, carpeta, onBack, onAddDocumento, readonly = false, hideImportes = false, initialTab }: Props) {
  const [tab, setTab] = useState<SubTab>(() => initialTab ?? getInitialSubTab(subcarpeta, hideImportes));
  const isMobile = useIsMobile();
  const despachante = getDespachante(subcarpeta.despachante || '');

  useEffect(() => {
    setTab(initialTab ?? getInitialSubTab(subcarpeta, hideImportes));
  }, [initialTab, subcarpeta.id, hideImportes]);

  const allTabs: { id: SubTab; label: string }[] = [
    { id: 'transito',   label: 'Tránsito' },
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
            <CanalBadge canal={subcarpeta.canalAduana} />
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
          {tab === 'transito' && <TransitoSectionFlat sub={subcarpeta} />}
          {tab === 'aduana' && <AduanaSection sub={subcarpeta} despachante={despachante} />}
          {tab === 'costeo' && <CosteoSection sub={subcarpeta} carpeta={carpeta} />}
          {tab === 'documentos' && <DocumentosSectionV2 sub={subcarpeta} readonly={readonly} onAddDocumento={onAddDocumento} />}
          {tab === 'recepcion' && <RecepcionSection sub={subcarpeta} />}
        </div>
      </div>
    </div>
  );
}

/* ── Tránsito ─────────────────────────────────────────────── */
function SubcarpetaLoadSummary({ sub, hideImportes }: { sub: Subcarpeta; hideImportes: boolean }) {
  const items = [
    {
      label: 'Tránsito',
      ready: Boolean(sub.facturaNum || sub.blCrtAwb || sub.fechaEmbarqueReal || sub.eta),
      detail: sub.estado === 'Pendiente de embarque' ? 'Se completa al crear/confirmar el embarque.' : 'Factura, BL/CRT/AWB, transporte y ETA.',
    },
    {
      label: 'Aduana',
      ready: Boolean(sub.duaNum || sub.fechaOficializacion || sub.canalAduana !== 'Pendiente'),
      detail: sub.estado === 'En Tránsito' ? 'Se carga al arribo y oficialización.' : 'Canal, DUA, despachante y SAP 55/18.',
    },
    ...(!hideImportes ? [{
      label: 'Costeo',
      ready: Boolean(sub.gastosARS || sub.vepUSD || sub.importeTotal),
      detail: 'Importe del embarque, gastos ARS, VEP y desvíos.',
    }] : []),
    {
      label: 'Anexos',
      ready: sub.documentos.length > 0,
      detail: `${sub.documentos.length} archivo${sub.documentos.length === 1 ? '' : 's'} cargado${sub.documentos.length === 1 ? '' : 's'}.`,
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginBottom: 16 }}>
      {items.map(item => (
        <div key={item.label} style={{ padding: '10px 12px', border: `1px solid ${item.ready ? 'rgba(26,92,56,0.20)' : HAIRLINE}`, borderRadius: 12, background: item.ready ? 'rgba(26,92,56,0.04)' : PARCHMENT }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.label}</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: item.ready ? GREEN : MUTED }}>{statusText(item.ready)}</span>
          </div>
          <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.35 }}>{item.detail}</div>
        </div>
      ))}
    </div>
  );
}

function TransitoSectionFlat({ sub }: { sub: Subcarpeta }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: 16, display: 'grid', gap: 18 }}>
      <section>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Datos de tránsito del embarque</div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', columnGap: 20, rowGap: 16 }}>
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
      </section>
      <section style={{ paddingTop: 16, borderTop: `1px solid ${HAIRLINE}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Artículos del embarque</div>
        {sub.articulosEmbarque.length === 0 ? (
          <div style={{ padding: 18, textAlign: 'center', color: MUTED, fontSize: 13, background: PARCHMENT, borderRadius: 12 }}>Sin artículos asignados a este embarque.</div>
        ) : (
          <div style={{ fontSize: 13, color: MUTED }}>{sub.articulosEmbarque.length} artículo{sub.articulosEmbarque.length > 1 ? 's' : ''} asignados</div>
        )}
      </section>
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
function AduanaSection({ sub, despachante }: { sub: Subcarpeta; despachante: any }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Card title="Despacho aduanero">
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
      </Card>
      <Card title="Gastos de nacionalización">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
          <Field label="Gastos ARS" value={sub.gastosARS ? `$ ${sub.gastosARS.toLocaleString()}` : '—'} />
          <Field label="VEP (USD)" value={sub.vepUSD ? `USD ${sub.vepUSD.toLocaleString()}` : '—'} />
          <Field label="Estado" value={sub.estado} />
        </div>
      </Card>
      {sub.incidencias.length > 0 && (
        <Card title="Incidencias">
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
        </Card>
      )}
    </div>
  );
}

/* ── Costeo (particular de la sub-carpeta) ─────────────────── */
function CosteoSection({ sub, carpeta }: { sub: Subcarpeta; carpeta: Carpeta }) {
  const isMobile = useIsMobile();
  const gastosNacionalizacion = sub.gastosARS ?? 0;
  const vepUSD = sub.vepUSD ?? 0;
  const totalArticulos = sub.articulosEmbarque.reduce((total, item) => total + item.cantidad, 0);
  const coefEst = carpeta.coeficienteEst;
  const coefReal = carpeta.coeficienteReal;
  const desv = coefReal ? coefReal - coefEst : null;
  const desvPct = desv ? (desv / coefEst) * 100 : null;
  const alertColor = desvPct !== null && Math.abs(desvPct) > 5 ? '#b84800' : '#1a7a4a';

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Card title="Costeo específico del embarque">
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
      </Card>
      <Card title="Coeficiente OC de referencia">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ padding: 16, background: PARCHMENT, borderRadius: 10, border: `1px solid ${HAIRLINE}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', marginBottom: 6 }}>Estimado</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: INK }}>{coefEst.toFixed(2)}</div>
          </div>
          <div style={{ padding: 16, background: coefReal ? `${alertColor}08` : PARCHMENT, borderRadius: 10, border: `1px solid ${coefReal ? alertColor + '22' : HAIRLINE}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', marginBottom: 6 }}>Real</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: coefReal ? alertColor : MUTED }}>{coefReal?.toFixed(2) || '—'}</div>
          </div>
          {desvPct !== null && (
            <div style={{ padding: 16, background: `${alertColor}08`, borderRadius: 10, border: `1px solid ${alertColor}22`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', marginBottom: 6 }}>Desvío</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: alertColor }}>
                {desv! > 0 ? '+' : ''}{desv!.toFixed(2)} ({desvPct.toFixed(1)}%)
              </div>
            </div>
          )}
        </div>
      </Card>
      <Card title="Tipo de cambio">
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
          <Field label="Moneda origen" value={carpeta.moneda} />
          <Field label="TC al momento de oficialización" value="—" />
          <Field label="TC al momento de pago" value="—" />
        </div>
        <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(180,83,9,0.04)', borderRadius: 8, border: '1px solid rgba(180,83,9,0.12)' }}>
          <div style={{ fontSize: 12, color: '#b45309' }}>
            El tipo de cambio puede afectar el coeficiente real. Se recalcula automáticamente al registrar el TC de oficialización.
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ── Documentos del embarque ──────────────────────────────── */
function DocumentosSectionV2({ sub, readonly, onAddDocumento }: { sub: Subcarpeta; readonly: boolean; onAddDocumento?: (doc: any) => void }) {
  const isMobile = useIsMobile();
  const [referencia, setReferencia] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tipo, setTipo] = useState('Factura Comercial');
  const tipoColors: Record<string, string> = {
    'Factura Comercial': '#5b21b6',
    'Bill of Lading / CRT': '#5e5ce6',
    'Packing List': '#b45309',
    'Certificado de Origen': '#0066cc',
  };
  const canAttach = Boolean(selectedFile) && Boolean(onAddDocumento);
  const handleAttach = () => {
    if (!canAttach) return;
    onAddDocumento?.({
      id: `doc-${Date.now()}`,
      nombre: selectedFile!.name,
      referencia: referencia.trim() || undefined,
      tipo,
      tamano: `${Math.max(1, Math.round(selectedFile!.size / 1024))} KB`,
      fecha: new Date().toISOString().split('T')[0],
    });
    setReferencia('');
    setSelectedFile(null);
    setIsComposerOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ padding: 16, display: 'grid', gap: 12 }}>
      {!readonly && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AppButton
            type="button"
            variant={isComposerOpen ? 'tertiary' : 'secondary'}
            size="md"
            onClick={() => {
              setIsComposerOpen(open => {
                const next = !open;
                if (!next) {
                  setSelectedFile(null);
                  setReferencia('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }
                return next;
              });
            }}
          >
            {isComposerOpen ? 'Cancelar carga' : 'Adjuntar anexo'}
          </AppButton>
        </div>
      )}
      <div style={{ overflow: 'hidden', background: CANVAS, border: `1px solid ${HAIRLINE}`, borderRadius: 12 }}>
        {!readonly && isComposerOpen && (
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${HAIRLINE}`, background: '#fcfcfd', display: 'grid', gap: 12 }}>
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
                if (file) setSelectedFile(file);
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
                  <button type="button" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, padding: 0, borderRadius: 9999, border: 'none', background: 'rgba(196,0,26,0.06)', color: '#c4001a', cursor: 'pointer' }}>
                    ×
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" onChange={event => setSelectedFile(event.target.files?.[0] ?? null)} style={{ display: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(180px, 1fr) minmax(160px, 0.5fr) auto', gap: 10, alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Referencia</label>
                <input value={referencia} onChange={event => setReferencia(event.target.value)} placeholder="Nombre de referencia" style={{ width: '100%', minHeight: 38, padding: '9px 12px', fontSize: 13, color: INK, background: CANVAS, border: `1px solid ${HAIRLINE}`, borderRadius: 10, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Tipo</label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger style={{ width: '100%', minHeight: 38, borderRadius: 10, background: CANVAS, border: `1px solid ${HAIRLINE}`, padding: '0 12px' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(tipoColors).map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <AppButton type="button" size="md" disabled={!canAttach} onClick={handleAttach} style={{ minHeight: 38 }}>Adjuntar anexo</AppButton>
            </div>
          </div>
        )}
        {sub.documentos.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 13 }}>Sin anexos cargados para este embarque.</div>
        ) : (
          sub.documentos.map((doc, index) => {
            const itemColor = tipoColors[doc.tipo] || MUTED;
            return (
              <div key={doc.id} style={{ padding: isMobile ? '14px 16px' : '14px 18px', borderBottom: index < sub.documentos.length - 1 ? `1px solid ${HAIRLINE}` : 'none', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.35fr) auto', gap: isMobile ? 10 : 16, alignItems: 'center' }}>
                <div style={{ minWidth: 0, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <FileText size={16} color={MUTED} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.nombre}</div>
                    {doc.referencia && <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>Ref. {doc.referencia}</div>}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      <span style={{ fontSize: 11, color: itemColor, background: `${itemColor}14`, border: `1px solid ${itemColor}33`, borderRadius: 9999, padding: '3px 8px' }}>{doc.tipo}</span>
                      <span style={{ fontSize: 11, color: GREEN, background: 'rgba(26,92,56,0.08)', border: '1px solid rgba(26,92,56,0.18)', borderRadius: 9999, padding: '3px 8px' }}>{sub.numero}</span>
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
        <div style={{ padding: 32, textAlign: 'center', color: MUTED, fontSize: 13 }}>Sin anexos cargados para este embarque.</div>
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
