import { useState } from 'react';
import { Download } from 'lucide-react';
import { pageShell } from './chromeStyles';
import { OBLIGACIONES_PAGO, type ObligacionPago } from './mockData';
import { VencimientosCalendar } from './VencimientosCalendar';
import { WelcomeBanner } from './WelcomeBanner';
import { AppButton } from './AppButton';

const TODAY = new Date('2026-05-28');

interface Props {
  /** If true, user can mark payments as emitted */
  canManagePayments?: boolean;
}

export function VencimientosPage({ canManagePayments = false }: Props) {
  const [pagos, setPagos] = useState<ObligacionPago[]>(OBLIGACIONES_PAGO);

  const toggleEstado = (id: string) => {
    setPagos(prev => prev.map(p => p.id === id ? { ...p, estado: p.estado === 'Pendiente de Pago' ? 'Transferencia Emitida' : 'Pendiente de Pago' } : p));
  };

  return (
    <div style={pageShell}>
      <WelcomeBanner
        title="Vencimientos"
        actions={
          <AppButton variant="secondary" style={{ flexShrink: 0 }} icon={<Download size={14} />}>
            Exportar
          </AppButton>
        }
      />
      <VencimientosCalendar
        pagos={pagos}
        today={TODAY}
        onToggleEstado={canManagePayments ? toggleEstado : undefined}
      />
    </div>
  );
}
