import { useState, useMemo } from "react";
import { Plus, Shield, ShieldAlert, ShieldX, AlertTriangle, Search, X, ChevronDown, Eye, Edit2, Trash2 } from "lucide-react";
import { Modal } from "../../components/Modal";
import { Pagination } from "../../components/Pagination";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { toast } from "sonner";

type ReportType = "Acceso No Autorizado" | "Ataque al Sistema" | "Fallo de Seguridad" | "Acceso Sospechoso" | "Intento de Intrusión" | "Filtración de Datos";
type SystemStatus = "Activo" | "En Revisión" | "En Cuarentena";

interface Report {
  id: string;
  title: string;
  date: string;
  type: ReportType;
  description: string;
  measures: string;
  systemStatus: SystemStatus;
}

const initialReports: Report[] = [
  {
    id: "1",
    title: "Múltiples intentos de acceso fallidos al módulo de pagos",
    date: "2026-03-15",
    type: "Acceso No Autorizado",
    description: "Se registraron 47 intentos fallidos de autenticación desde una IP externa (45.33.32.156) en un lapso de 12 minutos, dirigidos al módulo de gestión de pagos judiciales.",
    measures: "IP bloqueada de forma permanente en el firewall perimetral. Se reforzó la política de bloqueo de cuentas tras 3 intentos fallidos. Se notificó al equipo de seguridad y al administrador afectado.",
    systemStatus: "Activo",
  },
  {
    id: "2",
    title: "Ataque de fuerza bruta detectado en servidor de base de datos",
    date: "2026-03-10",
    type: "Ataque al Sistema",
    description: "El sistema de detección de intrusiones (IDS) identificó un ataque de fuerza bruta sobre el puerto 5432 del servidor de base de datos principal entre las 02:14 y las 03:47 horas.",
    measures: "Aislamiento temporal del servidor. Cambio de credenciales de todos los accesos a BD. Actualización de reglas de firewall para restringir acceso externo al puerto 5432. Análisis forense en curso.",
    systemStatus: "En Revisión",
  },
  {
    id: "3",
    title: "Credenciales de administrador comprometidas",
    date: "2026-03-05",
    type: "Fallo de Seguridad",
    description: "Se detectó inicio de sesión con credenciales del administrador gustavo.camacho desde una ubicación geográfica no habitual (dirección IP de Bogotá D.C.) fuera del horario laboral establecido.",
    measures: "Cuenta suspendida de forma inmediata. Restablecimiento forzado de contraseña con verificación de dos pasos. Revisión de todos los registros de actividad asociados al usuario en las últimas 72 horas.",
    systemStatus: "Activo",
  },
  {
    id: "4",
    title: "Tráfico anómalo detectado desde red interna – Sec. Hacienda",
    date: "2026-02-28",
    type: "Acceso Sospechoso",
    description: "Se identificó tráfico inusualmente elevado (380 MB en 4 minutos) desde un equipo de la red interna de la Secretaría de Hacienda hacia un servidor externo no registrado en la lista blanca.",
    measures: "Equipo desconectado de la red. Escaneo completo de malware en curso. Análisis del tráfico capturado. Se preservaron logs para proceso de investigación interno.",
    systemStatus: "En Cuarentena",
  },
  {
    id: "5",
    title: "Intento de inyección SQL en módulo de búsqueda de sentencias",
    date: "2026-02-20",
    type: "Intento de Intrusión",
    description: "El WAF (Web Application Firewall) bloqueó 12 peticiones maliciosas con patrones de inyección SQL dirigidas al módulo de búsqueda de sentencias judiciales. Las peticiones provenían de la red TOR.",
    measures: "Peticiones bloqueadas automáticamente por el WAF. Actualización de reglas de filtrado. Se revisó el código del módulo afectado y se aplicó parametrización de consultas SQL en dos endpoints vulnerables.",
    systemStatus: "Activo",
  },
  {
    id: "6",
    title: "Posible filtración de datos de sentencias – revisión en proceso",
    date: "2026-02-14",
    type: "Filtración de Datos",
    description: "Un funcionario reportó la recepción de un correo externo que incluía metadatos de sentencias reservadas. Se presume acceso indebido a la carpeta compartida del módulo de liquidaciones.",
    measures: "Permisos de la carpeta compartida revocados temporalmente. Auditoría de accesos a los archivos afectados. Notificación a la Oficina Jurídica. Sistema en monitoreo intensivo.",
    systemStatus: "En Revisión",
  },
  {
    id: "7",
    title: "Escaneo masivo de puertos sobre infraestructura SILTGOV",
    date: "2026-02-08",
    type: "Ataque al Sistema",
    description: "Se registró un escaneo sistemático de puertos (Nmap SYN scan) sobre toda la subred del sistema SILTGOV desde una dirección IP externa. El escaneo cubrió los rangos 1–65535 en 22 minutos.",
    measures: "IDS configurado para bloquear automáticamente direcciones que realicen más de 500 solicitudes SYN por minuto. IP origen reportada a CERT-CO. Actualización del inventario de superficies de ataque.",
    systemStatus: "Activo",
  },
];

const ITEMS_PER_PAGE = 5;

const TYPE_CONFIG: Record<ReportType, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  "Acceso No Autorizado": { color: "text-red-700",    bg: "bg-red-50",    border: "border-red-200",    icon: ShieldX      },
  "Ataque al Sistema":    { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: ShieldAlert  },
  "Fallo de Seguridad":   { color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", icon: AlertTriangle},
  "Acceso Sospechoso":    { color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: Shield       },
  "Intento de Intrusión": { color: "text-rose-700",   bg: "bg-rose-50",   border: "border-rose-200",   icon: ShieldAlert  },
  "Filtración de Datos":  { color: "text-red-800",    bg: "bg-red-100",   border: "border-red-300",    icon: ShieldX      },
};

const STATUS_CONFIG: Record<SystemStatus, { color: string; bg: string; border: string }> = {
  "Activo":        { color: "text-[#34A853]", bg: "bg-green-50",  border: "border-green-200"  },
  "En Revisión":   { color: "text-amber-700", bg: "bg-amber-50",  border: "border-amber-200"  },
  "En Cuarentena": { color: "text-red-700",   bg: "bg-red-50",    border: "border-red-200"    },
};

const REPORT_TYPES: ReportType[] = [
  "Acceso No Autorizado", "Ataque al Sistema", "Fallo de Seguridad",
  "Acceso Sospechoso", "Intento de Intrusión", "Filtración de Datos",
];
const SYSTEM_STATUSES: SystemStatus[] = ["Activo", "En Revisión", "En Cuarentena"];

const emptyForm = {
  title: "", date: "", type: "Acceso No Autorizado" as ReportType,
  description: "", measures: "", systemStatus: "Activo" as SystemStatus,
};

function showUndoToast(message: string, onUndo: () => void) {
  toast.custom(
    (t) => (
      <div className="flex items-center gap-3 bg-gray-900 text-white rounded-xl px-4 py-2.5 shadow-xl min-w-[300px]">
        <span className="text-xs flex-1">{message}</span>
        <button onClick={() => { onUndo(); toast.dismiss(t); }}
          className="text-[#FBBC05] text-xs font-bold hover:text-yellow-300 transition-colors whitespace-nowrap">
          Deshacer
        </button>
        <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-white ml-1 transition-colors">
          <X size={12} />
        </button>
      </div>
    ),
    { duration: 5000 }
  );
}

export function Audit() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [showModal, setShowModal] = useState(false);
  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [editItem, setEditItem] = useState<Report | null>(null);
  const [editData, setEditData] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Report | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"Todos" | ReportType>("Todos");
  const [statusFilter, setStatusFilter] = useState<"Todos" | SystemStatus>("Todos");
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = useMemo(() =>
    reports.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      const matchType = typeFilter === "Todos" || r.type === typeFilter;
      const matchStatus = statusFilter === "Todos" || r.systemStatus === statusFilter;
      return matchSearch && matchType && matchStatus;
    }), [reports, search, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const reset = () => setCurrentPage(1);

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-");
    const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    return `${day} ${months[parseInt(m)-1]}. ${y}`;
  };

  const handleCreate = () => {
    if (!formData.title || !formData.date || !formData.description || !formData.measures) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    setReports(prev => [{ id: String(Date.now()), ...formData }, ...prev]);
    toast.success("Reporte de auditoría registrado");
    setShowModal(false);
    setFormData(emptyForm);
  };

  const handleEditOpen = (item: Report) => {
    setEditItem(item);
    setEditData({ title: item.title, date: item.date, type: item.type, description: item.description, measures: item.measures, systemStatus: item.systemStatus });
    setViewReport(null);
  };

  const handleEditSave = () => {
    if (!editData.title || !editData.date || !editData.description || !editData.measures) {
      toast.error("Completa todos los campos obligatorios"); return;
    }
    setReports(prev => prev.map(r => r.id === editItem!.id ? { ...r, ...editData } : r));
    toast.success("Reporte actualizado exitosamente");
    setEditItem(null);
  };

  const handleDeleteRequest = (item: Report) => {
    setViewReport(null);
    setDeleteConfirm(item);
  };

  const handleDeleteConfirmed = () => {
    const item = deleteConfirm!;
    const originalIndex = reports.findIndex(r => r.id === item.id);
    setReports(prev => prev.filter(r => r.id !== item.id));
    setDeleteConfirm(null);
    showUndoToast(`Reporte "${item.title.slice(0, 40)}..." eliminado`, () => {
      setReports(prev => {
        const arr = [...prev];
        arr.splice(Math.min(originalIndex, arr.length), 0, item);
        return arr;
      });
    });
  };

  const renderFormFields = (data: typeof emptyForm, setData: (d: typeof emptyForm) => void) => (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Título del Reporte <span className="text-red-500">*</span></label>
        <input type="text" value={data.title} onChange={e => setData({ ...data, title: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
          placeholder="Descripción breve del incidente..." />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Fecha <span className="text-red-500">*</span></label>
          <input type="date" value={data.date} onChange={e => setData({ ...data, date: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Tipo de Incidente <span className="text-red-500">*</span></label>
          <select value={data.type} onChange={e => setData({ ...data, type: e.target.value as ReportType })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
            {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Estado del Sistema</label>
          <select value={data.systemStatus} onChange={e => setData({ ...data, systemStatus: e.target.value as SystemStatus })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
            {SYSTEM_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Descripción del Incidente <span className="text-red-500">*</span></label>
        <textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] resize-none"
          rows={3} placeholder="Describa detalladamente el incidente detectado..." />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Medidas Tomadas <span className="text-red-500">*</span></label>
        <textarea value={data.measures} onChange={e => setData({ ...data, measures: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] resize-none"
          rows={3} placeholder="Indique las acciones tomadas para mitigar el incidente..." />
      </div>
    </>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Auditoría de Seguridad</h1>
          <p className="text-sm text-gray-500 mt-0.5">Registro de incidentes y reportes de seguridad del sistema</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1C5BB8] text-white px-4 py-2 rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium shadow-sm">
          <Plus size={16} /> Nuevo Reporte
        </button>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Reportes", value: reports.length, color: "text-gray-900", bg: "bg-gray-50 border-gray-200" },
          { label: "En Revisión",    value: reports.filter(r => r.systemStatus === "En Revisión").length,   color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
          { label: "En Cuarentena",  value: reports.filter(r => r.systemStatus === "En Cuarentena").length, color: "text-red-700",   bg: "bg-red-50 border-red-200"   },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Filtros */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); reset(); }}
              placeholder="Buscar por título o descripción..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
            {search && <button onClick={() => { setSearch(""); reset(); }} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={12} className="text-gray-400" /></button>}
          </div>

          <div className="relative">
            <button onClick={() => { setShowTypeMenu(!showTypeMenu); setShowStatusMenu(false); }}
              className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-lg transition-colors ${
                typeFilter !== "Todos" ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}>
              <span>{typeFilter === "Todos" ? "Tipo de incidente" : typeFilter}</span><ChevronDown size={12} />
            </button>
            {showTypeMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTypeMenu(false)} />
                <div className="absolute left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button onClick={() => { setTypeFilter("Todos"); reset(); setShowTypeMenu(false); }}
                    className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${typeFilter === "Todos" ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}>
                    Todos los tipos
                  </button>
                  {REPORT_TYPES.map(t => (
                    <button key={t} onClick={() => { setTypeFilter(t); reset(); setShowTypeMenu(false); }}
                      className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${typeFilter === t ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { setShowStatusMenu(!showStatusMenu); setShowTypeMenu(false); }}
              className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-lg transition-colors ${
                statusFilter !== "Todos" ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}>
              <span>Estado sistema: {statusFilter}</span><ChevronDown size={12} />
            </button>
            {showStatusMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
                <div className="absolute left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button onClick={() => { setStatusFilter("Todos"); reset(); setShowStatusMenu(false); }}
                    className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${statusFilter === "Todos" ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}>
                    Todos los estados
                  </button>
                  {SYSTEM_STATUSES.map(s => (
                    <button key={s} onClick={() => { setStatusFilter(s); reset(); setShowStatusMenu(false); }}
                      className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${statusFilter === s ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} reportes</span>
        </div>

        {/* Lista de reportes */}
        <div className="divide-y divide-gray-50">
          {paginated.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-gray-400">No se encontraron reportes</div>
          ) : paginated.map(report => {
            const typeConf = TYPE_CONFIG[report.type];
            const statusConf = STATUS_CONFIG[report.systemStatus];
            const TypeIcon = typeConf.icon;
            return (
              <div key={report.id} className="px-5 py-4 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeConf.bg} border ${typeConf.border}`}>
                    <TypeIcon size={16} className={typeConf.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{report.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${typeConf.bg} ${typeConf.border} ${typeConf.color}`}>
                            {report.type}
                          </span>
                          <span className="text-xs text-gray-400">{formatDate(report.date)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${statusConf.bg} ${statusConf.border} ${statusConf.color}`}>
                          {report.systemStatus}
                        </span>
                        <button onClick={() => setViewReport(report)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Ver detalle">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleEditOpen(report)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Editar">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteRequest(report)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Eliminar">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{report.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
      </div>

      {/* Modal: Nuevo Reporte */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Reporte de Seguridad" size="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-red-50 rounded-lg border border-red-100">
            <ShieldAlert className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-xs text-gray-700">Registre incidentes de seguridad con toda la información disponible para facilitar el análisis y seguimiento</p>
          </div>
          {renderFormFields(formData, setFormData)}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleCreate} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Registrar Reporte</button>
          </div>
        </div>
      </Modal>

      {/* Modal: Editar Reporte */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Editar Reporte de Seguridad" size="lg">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-blue-50 rounded-lg border border-blue-100">
            <Shield className="text-[#1C5BB8] flex-shrink-0" size={20} />
            <p className="text-xs text-gray-700">Actualiza la información del reporte de seguridad</p>
          </div>
          {renderFormFields(editData, setEditData)}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => setEditItem(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleEditSave} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Guardar Cambios</button>
          </div>
        </div>
      </Modal>

      {/* Modal: Ver reporte */}
      {viewReport && (
        <Modal isOpen={!!viewReport} onClose={() => setViewReport(null)} title="Detalle del Reporte" size="lg">
          {(() => {
            const typeConf = TYPE_CONFIG[viewReport.type];
            const statusConf = STATUS_CONFIG[viewReport.systemStatus];
            return (
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeConf.bg} border ${typeConf.border}`}>
                    {(() => { const I = typeConf.icon; return <I size={18} className={typeConf.color} />; })()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{viewReport.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${typeConf.bg} ${typeConf.border} ${typeConf.color}`}>{viewReport.type}</span>
                      <span className="text-xs text-gray-400">{viewReport.date}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${statusConf.bg} ${statusConf.border} ${statusConf.color}`}>{viewReport.systemStatus}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Descripción del incidente</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{viewReport.description}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-xs font-semibold text-[#1C5BB8] mb-2 uppercase tracking-wide">Medidas tomadas</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{viewReport.measures}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditOpen(viewReport)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-[#1C5BB8] text-[#1C5BB8] rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors">
                      <Edit2 size={12} /> Editar
                    </button>
                    <button onClick={() => handleDeleteRequest(viewReport)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-red-300 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors">
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                  <button onClick={() => setViewReport(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cerrar</button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="¿Eliminar reporte?"
        message={`¿Estás seguro de eliminar este reporte de seguridad? Tendrás 5 segundos para deshacer esta acción.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
