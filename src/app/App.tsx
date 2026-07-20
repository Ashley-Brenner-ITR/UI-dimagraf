import { Suspense, lazy, useEffect, useMemo, useState, type ComponentType } from 'react';
import { Layout, type AccessRole, type NotificationAnchorRect } from './components/Layout';
import { NotificationPanel } from './components/NotificationPanel';
import { LoginScreen } from './components/LoginScreen';
import { PasswordRecoveryPage } from './components/PasswordRecoveryPage';
import { AppLoaderSkeleton } from './components/LoadingState';
import { ErrorStatePage } from './components/ErrorStatePage';
import type { MailReportConfig, VisualTheme } from './components/AccountSettingsPage';
import { CARPETAS, INITIAL_NOTIFICATIONS, USERS, type Carpeta, type EstadoCarpeta, type AppNotification, type AuditEntry, type AppUser } from './components/mockData';
import type { Role } from './components/mockData';

const lazyNamed = <TModule, TKey extends keyof TModule>(
  loadModule: () => Promise<TModule>,
  exportName: TKey,
) => lazy(async () => {
  const module = await loadModule();
  return { default: module[exportName] as ComponentType<any> };
});

const OperatorDashboard = lazyNamed(() => import('./components/OperatorDashboard'), 'OperatorDashboard');
const CarpetaDetail = lazyNamed(() => import('./components/CarpetaDetail'), 'CarpetaDetail');
const DirectorDashboard = lazyNamed(() => import('./components/DirectorDashboard'), 'DirectorDashboard');
const CommercialArrivals = lazyNamed(() => import('./components/CommercialArrivals'), 'CommercialArrivals');
const TreasuryCashFlow = lazyNamed(() => import('./components/TreasuryCashFlow'), 'TreasuryCashFlow');
const WarehouseReception = lazyNamed(() => import('./components/WarehouseReception'), 'WarehouseReception');
const AdminDashboard = lazyNamed(() => import('./components/AdminDashboard'), 'AdminDashboard');
const DesignSystemPage = lazyNamed(() => import('./components/DesignSystemPage'), 'DesignSystemPage');
const DispatcherDashboard = lazyNamed(() => import('./components/DispatcherDashboard'), 'DispatcherDashboard');
const AccountSettingsPage = lazyNamed(() => import('./components/AccountSettingsPage'), 'AccountSettingsPage');
const VencimientosPage = lazyNamed(() => import('./components/VencimientosPage'), 'VencimientosPage');
const SubcarpetaDetail = lazyNamed(() => import('./components/SubcarpetaDetail'), 'SubcarpetaDetail');

type View = 'carpetas' | 'carpeta-detail' | 'subcarpeta-detail' | 'arrivals' | 'cashflow' | 'reception' | 'audit' | 'dashboard' | 'vencimientos'
          | 'admin-users' | 'admin-audit' | 'admin-articles' | 'admin-providers' | 'admin-design-system' | 'settings';
type DetailTabTarget = 'general' | 'articulos';
type SubDetailTabTarget = 'general' | 'articulos' | 'aduana' | 'costeo' | 'documentos' | 'recepcion';

type SessionState =
  | { kind: 'abm'; userId: string; activeRole: Role }
  | { kind: 'design-system'; activeRole: 'design-system' }
  | null;

const DESIGN_SYSTEM_ACCESS = {
  username: 'design-system',
  label: 'Design System · Usuario de prueba',
} as const;

const TESTING_PREVIEW_USERNAME = 'testing';

const INITIAL_VIEWS: Record<Role, View> = {
  operator:   'carpetas',
  director:   'dashboard',
  commercial: 'arrivals',
  treasury:   'cashflow',
  warehouse:  'reception',
  dispatcher: 'carpetas',
  admin:      'admin-users',
};

const DEFAULT_MAIL_CONFIG: MailReportConfig = {
  enabled: false,
  recipients: '',
  frequency: 'Semanal',
  sendTime: '08:00',
  selectedReports: ['arrivals', 'vencimientos'],
};

const DEFAULT_CARPETA_ESTADO: EstadoCarpeta = 'Pendiente de embarque';
const LEGACY_DEMO_OBSERVACION = 'Carpeta de demo preparada para mostrar validación documental, seguimiento de producción y aperturas parciales.';
const VISUAL_THEME_STORAGE_KEY = 'dimagraf-visual-theme';

function normalizeCarpeta(carpeta: Carpeta): Carpeta {
  return {
    ...carpeta,
    estado: carpeta.estado || DEFAULT_CARPETA_ESTADO,
    observaciones: carpeta.observaciones === LEGACY_DEMO_OBSERVACION ? '' : carpeta.observaciones,
    ultimoHito: carpeta.ultimoHito || 'Carpeta creada · Pendiente de gestión operativa',
  };
}

export default function App() {
  const isRecoveryMode = new URLSearchParams(window.location.search).get('recovery') === '1';
  const forcedErrorParam = new URLSearchParams(window.location.search).get('error');
  const forcedErrorVariant = forcedErrorParam === '404' || forcedErrorParam === '500' ? forcedErrorParam : null;
  const [users, setUsers] = useState<AppUser[]>(USERS);
  const [session, setSession] = useState<SessionState>(null);
  const [loginError, setLoginError] = useState<string | undefined>();
  const [view, setView] = useState<View>('carpetas');
  const [selectedCarpetaId, setSelectedCarpetaId] = useState<string | null>(null);
  const [selectedSubcarpetaId, setSelectedSubcarpetaId] = useState<string | null>(null);
  const [selectedDetailTab, setSelectedDetailTab] = useState<DetailTabTarget>('general');
  const [selectedSubDetailTab, setSelectedSubDetailTab] = useState<SubDetailTabTarget | undefined>();
  const [subcarpetaBackView, setSubcarpetaBackView] = useState<View>('carpeta-detail');
  const [carpetasList, setCarpetasList] = useState<Carpeta[]>(() => CARPETAS.map(normalizeCarpeta));
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifAnchorRect, setNotifAnchorRect] = useState<NotificationAnchorRect | null>(null);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [mailConfigByUser, setMailConfigByUser] = useState<Record<string, MailReportConfig>>({});
  const [visualTheme, setVisualTheme] = useState<VisualTheme>(() => localStorage.getItem(VISUAL_THEME_STORAGE_KEY) === 'wireframe' ? 'wireframe' : 'normal');
  const [lastContentView, setLastContentView] = useState<View>('carpetas');
  const [isContentLoading, setIsContentLoading] = useState(false);

  useEffect(() => {
    setCarpetasList(prev => prev.map(normalizeCarpeta));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.previewTheme = visualTheme;
    localStorage.setItem(VISUAL_THEME_STORAGE_KEY, visualTheme);
  }, [visualTheme]);

  const currentUser = useMemo(
    () => session?.kind === 'abm' ? users.find(user => user.id === session.userId) ?? null : null,
    [session, users],
  );
  const role = session?.activeRole ?? 'operator';
  const canUseDesignSystemPreview = currentUser?.username.trim().toLowerCase() === TESTING_PREVIEW_USERNAME;
  const availableRoles: AccessRole[] = session?.kind === 'abm'
    ? [
        ...(currentUser?.roles ?? []),
        ...(canUseDesignSystemPreview ? ['design-system' as const] : []),
      ]
    : session?.kind === 'design-system'
      ? ['design-system']
      : [];

  useEffect(() => {
    if (!session || session.kind !== 'abm') return;
    if (!currentUser || currentUser.estado !== 'Activo') {
      setSession(null);
      setLoginError('Tu acceso fue deshabilitado. Ingresá nuevamente con un usuario activo.');
      setNotifOpen(false);
      return;
    }

    if (!availableRoles.includes(session.activeRole)) {
      const fallbackRole = currentUser.roles[0];
      if (!fallbackRole) {
        setSession(null);
        setLoginError('El usuario no tiene roles asignados en el ABM.');
        return;
      }
      setSession({ kind: 'abm', userId: currentUser.id, activeRole: fallbackRole });
      setView(INITIAL_VIEWS[fallbackRole]);
      setSelectedCarpetaId(null);
    }
  }, [availableRoles, currentUser, session]);

  useEffect(() => {
    setNotifOpen(false);
  }, [role, view, selectedCarpetaId]);

  useEffect(() => {
    if (!session || isRecoveryMode || forcedErrorVariant) {
      setIsContentLoading(false);
      return;
    }

    setIsContentLoading(true);
    const timer = window.setTimeout(() => setIsContentLoading(false), 320);
    return () => window.clearTimeout(timer);
  }, [session, role, view, selectedCarpetaId, isRecoveryMode, forcedErrorVariant]);

  const visibleNotifications = session?.kind === 'abm'
    ? notifications.filter(notification => !notification.role || notification.role === role)
    : [];

  const unreadCount = visibleNotifications.filter(notification => !notification.read).length;

  const addNotification = (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const entry: AppNotification = {
      ...n,
      id: `n_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [entry, ...prev]);
  };

  const addAuditEntry = (e: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    const entry: AuditEntry = { ...e, id: `al_${Date.now()}`, timestamp: new Date().toISOString() };
    setAuditEntries(prev => [entry, ...prev]);
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    const visibleIds = new Set(visibleNotifications.map(notification => notification.id));
    setNotifications(prev => prev.map(notification => visibleIds.has(notification.id) ? { ...notification, read: true } : notification));
  };

  const handleSetRole = (nextRole: AccessRole) => {
    if (nextRole === 'design-system') {
      setSession({ kind: 'design-system', activeRole: 'design-system' });
      setView('admin-design-system');
      setSelectedCarpetaId(null);
      setSelectedDetailTab('general');
      return;
    }
    if (!currentUser) return;
    setSession({ kind: 'abm', userId: currentUser.id, activeRole: nextRole });
    setView(INITIAL_VIEWS[nextRole]);
    setSelectedCarpetaId(null);
    setSelectedDetailTab('general');
  };

  const handleLogout = () => {
    setSession(null);
    setLoginError(undefined);
    setNotifOpen(false);
    setView('carpetas');
    setSelectedCarpetaId(null);
    setSelectedDetailTab('general');
  };

  const handleUpdateCurrentUser = (updates: { nombre: string; apellido: string; email: string; password?: string }) => {
    if (!currentUser) return;

    const nextUser = {
      ...currentUser,
      nombre: updates.nombre,
      apellido: updates.apellido,
      email: updates.email,
      ...(updates.password ? { password: updates.password } : {}),
    };

    setUsers(prevUsers => prevUsers.map(user => user.id === currentUser.id ? nextUser : user));

    addAuditEntry({
      userId: currentUser.id,
      userName: `${updates.nombre} ${updates.apellido}`.trim(),
      userRole: role === 'design-system' ? 'admin' : role,
      action: 'Editó su perfil',
      entity: 'Usuario',
      entityId: currentUser.username,
      detail: updates.password ? `${updates.email} · actualizó contraseña` : updates.email,
    });
  };

  const handleLogin = (username: string, _password: string) => {
    const normalizedUsername = username.trim().toLowerCase();
    if (!normalizedUsername) {
      setLoginError('Ingresá un usuario válido para continuar.');
      return;
    }

    if (normalizedUsername === DESIGN_SYSTEM_ACCESS.username) {
      setSession({ kind: 'design-system', activeRole: 'design-system' });
      setView('admin-design-system');
      setSelectedCarpetaId(null);
      setSelectedDetailTab('general');
      setLoginError(undefined);
      return;
    }

    const matchedUser = users.find(user => user.username.trim().toLowerCase() === normalizedUsername);
    if (!matchedUser) {
      setLoginError('Ese usuario no existe en el ABM ni corresponde al acceso de Design System.');
      return;
    }
    if (matchedUser.estado !== 'Activo') {
      setLoginError('El usuario está inactivo y no puede ingresar.');
      return;
    }
    if (matchedUser.password && matchedUser.password !== _password) {
      setLoginError('La contraseña ingresada no coincide con ese usuario.');
      return;
    }
    if (matchedUser.roles.length === 0) {
      setLoginError('El usuario no tiene roles asignados en el ABM.');
      return;
    }

    const initialRole = matchedUser.roles[0];
    setSession({ kind: 'abm', userId: matchedUser.id, activeRole: initialRole });
    setView(INITIAL_VIEWS[initialRole]);
    setSelectedCarpetaId(null);
    setSelectedDetailTab('general');
    setLoginError(undefined);
  };

  const handleSelectCarpeta = (id: string, detailTab: DetailTabTarget = 'general') => {
    setSelectedCarpetaId(id);
    setSelectedDetailTab(detailTab);
    setView('carpeta-detail');
  };

  const handleBack = () => {
    setSelectedCarpetaId(null);
    setSelectedDetailTab('general');
    setView(role === 'director' ? 'dashboard' : role === 'design-system' ? 'admin-design-system' : 'carpetas');
  };

  const handleSetView = (v: string) => {
    const nextView = v as View;
    if (nextView !== 'settings') {
      setLastContentView(nextView);
    }
    setView(nextView);
    if (nextView !== 'carpeta-detail') {
      setSelectedCarpetaId(null);
      setSelectedDetailTab('general');
    }
  };

  const handleOpenSettings = () => {
    setLastContentView(view === 'settings' ? lastContentView : view);
    setView('settings');
  };

  const handleCloseSettings = () => {
    setView(lastContentView);
  };

  const currentMailConfig = currentUser
    ? mailConfigByUser[currentUser.id] ?? DEFAULT_MAIL_CONFIG
    : DEFAULT_MAIL_CONFIG;

  const handleSaveSettings = (updates: { password?: string; mailConfig: MailReportConfig }) => {
    if (!currentUser) return;
    if (updates.password) {
      handleUpdateCurrentUser({
        nombre: currentUser.nombre,
        apellido: currentUser.apellido,
        email: currentUser.email,
        password: updates.password,
      });
    }

    setMailConfigByUser(prev => ({
      ...prev,
      [currentUser.id]: updates.mailConfig,
    }));

    addAuditEntry({
      userId: currentUser.id,
      userName: `${currentUser.nombre} ${currentUser.apellido}`.trim(),
      userRole: role === 'design-system' ? 'admin' : role,
      action: 'Actualizó configuración de reportes por correo',
      entity: 'Configuración',
      entityId: currentUser.username,
      detail: `${updates.mailConfig.selectedReports.length} reporte(s) · ${updates.mailConfig.frequency} ${updates.mailConfig.sendTime}`,
    });

    setView(lastContentView);
  };

  const handleCreateCarpeta = (carpeta: Carpeta) => {
    const normalizedCarpeta = normalizeCarpeta(carpeta);
    setCarpetasList(prev => [normalizedCarpeta, ...prev]);
    addNotification({
      type: 'success',
      title: 'Carpeta creada',
      message: `Carpeta ${normalizedCarpeta.numero} abierta · ${normalizedCarpeta.moneda} ${normalizedCarpeta.montoTotal.toLocaleString()}`,
      role: 'operator',
      entityId: normalizedCarpeta.id,
    });
    addAuditEntry({
      userId: 'u2', userName: 'Marcos Delgado', userRole: 'operator',
      action: 'Creó carpeta',
      entity: 'Carpeta', entityId: normalizedCarpeta.numero,
      detail: `${normalizedCarpeta.moneda} ${normalizedCarpeta.montoTotal.toLocaleString()} · ${normalizedCarpeta.estado}`,
    });
  };

  const handleUpdateCarpeta = (updatedCarpeta: Carpeta) => {
    const normalizedCarpeta = normalizeCarpeta(updatedCarpeta);
    setCarpetasList(prev => prev.map(carpeta => carpeta.id === normalizedCarpeta.id ? normalizedCarpeta : carpeta));
  };

  const handleSelectSubcarpeta = (carpetaId: string, subcarpetaId: string) => {
    setSelectedCarpetaId(carpetaId);
    setSelectedSubcarpetaId(subcarpetaId);
    setSelectedSubDetailTab(undefined);
    setSubcarpetaBackView('carpeta-detail');
    setView('subcarpeta-detail');
  };

  const handleSelectSubcarpetaFromArrivals = (carpetaId: string, subcarpetaId: string) => {
    setSelectedCarpetaId(carpetaId);
    setSelectedSubcarpetaId(subcarpetaId);
    setSelectedSubDetailTab('general');
    setSubcarpetaBackView('arrivals');
    setView('subcarpeta-detail');
  };

  const renderContent = () => {
    if (role === 'design-system') return <DesignSystemPage />;
    if (view === 'settings' && currentUser) {
      return (
        <AccountSettingsPage
          activeRole={role as any}
          currentUser={currentUser}
          mailConfig={currentMailConfig}
          visualTheme={visualTheme}
          onChangeVisualTheme={setVisualTheme}
          onChangeMailConfig={(next) => {
            setMailConfigByUser(prev => ({ ...prev, [currentUser.id]: next }));
          }}
          onSave={handleSaveSettings}
          onBack={handleCloseSettings}
          availableRoles={currentUser.roles}
          onChangeRole={(newRole) => {
            if (session?.kind === 'abm') {
              setSession({ ...session, activeRole: newRole });
              setView(view === 'settings' ? 'settings' : 'carpetas');
            }
          }}
          onLogout={handleLogout}
        />
      );
    }
    if (view === 'subcarpeta-detail' && selectedCarpetaId && selectedSubcarpetaId) {
      const carpeta = carpetasList.find(c => c.id === selectedCarpetaId);
      const sub = carpeta?.subcarpetas.find(s => s.id === selectedSubcarpetaId);
      if (carpeta && sub) {
        return (
          <SubcarpetaDetail
            subcarpeta={sub}
            carpeta={carpeta}
            readonly={role !== 'operator'}
            hideImportes={role === 'commercial'}
            initialTab={selectedSubDetailTab}
            onAddDocumento={(doc: any) => handleUpdateCarpeta({ ...carpeta, subcarpetas: carpeta.subcarpetas.map(item => item.id === sub.id ? ({ ...item, documentos: [...item.documentos, doc] }) : item) })}
            onUpdateSubcarpeta={(patch: any) => {
              const subcarpetas = carpeta.subcarpetas.map(item => item.id === sub.id ? ({ ...item, ...patch }) : item);
              const articulos = carpeta.articulos.map(articulo => ({
                ...articulo,
                cantidadAsignada: subcarpetas.reduce((total, shipment) => total + shipment.articulosEmbarque.reduce((shipmentTotal, item) => item.articuloId === articulo.id ? shipmentTotal + item.cantidad : shipmentTotal, 0), 0),
              }));
              handleUpdateCarpeta({ ...carpeta, subcarpetas, articulos });
            }}
            onBack={() => {
              setView(subcarpetaBackView);
              setSelectedSubcarpetaId(null);
              setSelectedSubDetailTab(undefined);
            }}
          />
        );
      }
    }
    if (role === 'operator') {
      if (view === 'subcarpeta-detail' && selectedCarpetaId && selectedSubcarpetaId) {
        const carpeta = carpetasList.find(c => c.id === selectedCarpetaId);
        const sub = carpeta?.subcarpetas.find(s => s.id === selectedSubcarpetaId);
        if (carpeta && sub) return <SubcarpetaDetail subcarpeta={sub} carpeta={carpeta} onAddDocumento={(doc: any) => handleUpdateCarpeta({ ...carpeta, subcarpetas: carpeta.subcarpetas.map(item => item.id === sub.id ? ({ ...item, documentos: [...item.documentos, doc] }) : item) })} onUpdateSubcarpeta={(patch: any) => { const subcarpetas = carpeta.subcarpetas.map(item => item.id === sub.id ? ({ ...item, ...patch }) : item); const articulos = carpeta.articulos.map(articulo => ({ ...articulo, cantidadAsignada: subcarpetas.reduce((total, shipment) => total + shipment.articulosEmbarque.reduce((shipmentTotal, item) => item.articuloId === articulo.id ? shipmentTotal + item.cantidad : shipmentTotal, 0), 0) })); handleUpdateCarpeta({ ...carpeta, subcarpetas, articulos }); }} onBack={() => { setView('carpeta-detail'); setSelectedSubcarpetaId(null); }} />;
      }
      if (view === 'carpeta-detail' && selectedCarpetaId)
        return <CarpetaDetail carpetaId={selectedCarpetaId} carpetasList={carpetasList} onBack={handleBack} onUpdateCarpeta={handleUpdateCarpeta} initialTab={selectedDetailTab} role={role} onSelectSubcarpeta={(subId: string) => { setSelectedSubcarpetaId(subId); setView('subcarpeta-detail' as View); }} />;
      if (view === 'arrivals') return <CommercialArrivals onSelectSubcarpeta={handleSelectSubcarpetaFromArrivals} />;
      if (view === 'vencimientos') return <VencimientosPage canManagePayments={false} />;
      if (view === 'cashflow') return <TreasuryCashFlow readonly />;
      return <OperatorDashboard carpetasList={carpetasList} onSelectCarpeta={handleSelectCarpeta} onSelectSubcarpeta={handleSelectSubcarpeta} onCreateCarpeta={handleCreateCarpeta} />;
    }
    if (role === 'director') {
      if (view === 'carpeta-detail' && selectedCarpetaId)
        return <CarpetaDetail carpetaId={selectedCarpetaId} carpetasList={carpetasList} onBack={handleBack} onUpdateCarpeta={handleUpdateCarpeta} readonly initialTab={selectedDetailTab} role={role} />;
      if (view === 'carpetas')
        return <OperatorDashboard carpetasList={carpetasList} onSelectCarpeta={handleSelectCarpeta} onSelectSubcarpeta={handleSelectSubcarpeta} onCreateCarpeta={handleCreateCarpeta} />;
      if (view === 'vencimientos') return <VencimientosPage canManagePayments={false} />;
      return (
        <DirectorDashboard
          onViewCarpeta={handleSelectCarpeta}
          carpetasList={carpetasList}
          section={view === 'audit' ? 'audit' : 'kpi'}
          onSectionChange={(nextSection) => setView(nextSection === 'audit' ? 'audit' : 'dashboard')}
        />
      );
    }
    if (role === 'commercial') {
      if (view === 'carpeta-detail' && selectedCarpetaId)
        return <CarpetaDetail carpetaId={selectedCarpetaId} carpetasList={carpetasList} onBack={handleBack} onUpdateCarpeta={handleUpdateCarpeta} readonly hideImportes initialTab={selectedDetailTab} role={role} />;
      if (view === 'carpetas')
        return <OperatorDashboard carpetasList={carpetasList} onSelectCarpeta={handleSelectCarpeta} onSelectSubcarpeta={handleSelectSubcarpeta} onCreateCarpeta={handleCreateCarpeta} hideImportes />;
      return <CommercialArrivals onSelectSubcarpeta={handleSelectSubcarpetaFromArrivals} />;
    }
    if (role === 'treasury') {
      if (view === 'vencimientos') return <VencimientosPage canManagePayments={true} />;
      return <TreasuryCashFlow />;
    }
    if (role === 'warehouse')   return <WarehouseReception carpetasList={carpetasList} onUpdateCarpeta={handleUpdateCarpeta} />;
    if (role === 'dispatcher')  return <DispatcherDashboard carpetasList={carpetasList} onUpdateCarpeta={handleUpdateCarpeta} />;
    if (role === 'admin') {
      return <AdminDashboard users={users} onUsersChange={setUsers} extraAuditEntries={auditEntries} activeTab={view} />;
    }
    return null;
  };

  if (isRecoveryMode) {
    return <PasswordRecoveryPage users={users} />;
  }

  if (!session) {
    return <LoginScreen error={loginError} onLogin={handleLogin} />;
  }

  const currentUserLabel = session.kind === 'design-system'
    ? DESIGN_SYSTEM_ACCESS.label
    : `${currentUser?.nombre ?? ''} ${currentUser?.apellido ?? ''}`.trim() || currentUser?.username || 'Usuario';

  const renderBody = () => {
    if (forcedErrorVariant) {
      return (
        <ErrorStatePage
          variant={forcedErrorVariant}
          onRetry={() => window.location.reload()}
          onGoHome={() => {
            window.history.replaceState({}, '', window.location.pathname);
            setView(INITIAL_VIEWS[role as Role] ?? 'carpetas');
            setSelectedCarpetaId(null);
            setSelectedDetailTab('general');
          }}
        />
      );
    }

    if (isContentLoading) {
      return <AppLoaderSkeleton />;
    }

    const content = renderContent();
    if (!content) {
      return (
        <ErrorStatePage
          variant="generic"
          onRetry={() => window.location.reload()}
          onGoHome={() => {
            setView(INITIAL_VIEWS[role as Role] ?? 'carpetas');
            setSelectedCarpetaId(null);
            setSelectedDetailTab('general');
          }}
        />
      );
    }

    return <Suspense fallback={<AppLoaderSkeleton />}>{content}</Suspense>;
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d2d2d7; border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: #b0b0b7; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input::placeholder, textarea::placeholder { color: #667085; opacity: 1; }
        button { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        select { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        select option { background: #ffffff; color: #1d1d1f; }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>

      <Layout
        role={role}
        availableRoles={availableRoles}
        setRole={handleSetRole}
        view={view}
        setView={handleSetView}
        unreadCount={unreadCount}
        onRequestCloseNotifications={() => setNotifOpen(false)}
        onBellClick={(anchorRect) => {
          setNotifAnchorRect(anchorRect);
          setNotifOpen(open => !open);
        }}
        currentUser={currentUser}
        currentUserLabel={currentUserLabel}
        onOpenSettings={session.kind === 'abm' ? handleOpenSettings : undefined}
        onLogout={handleLogout}
      >
        {renderBody()}
      </Layout>

      {notifOpen && (
        <NotificationPanel
          notifications={visibleNotifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onClose={() => setNotifOpen(false)}
          anchorRect={notifAnchorRect}
        />
      )}
    </>
  );
}
