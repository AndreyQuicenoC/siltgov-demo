import { useState } from "react";
import {
  MessageSquare, CheckCircle2, XCircle, Clock,
  Search, Filter, ChevronDown, Eye, X, User, Calendar, Hash, CreditCard,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "../../components/Pagination";

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface EditRequest {
  id: string;
  sentencia: string;
  liquidador: string;
  documento: string;
  fechaSolicitud: string;
  motivo: string;
  status: "Pendiente" | "Aprobada" | "Rechazada";
  entity: string;
  valueLiquidated: string;
}

interface PayerCorrectionRequest {
  id: string;
  sentencia: string;
  pagador: string;
  documento: string;
  fechaSolicitud: string;
  motivo: string;
  status: "Pendiente" | "Aprobada" | "Rechazada";
  entity: string;
  valuePayment: string;
}

const ITEMS_PER_PAGE = 8;

// ── Datos: Liquidadores ────────────────────────────────────────────────────────
const initialRequests: EditRequest[] = [
  { id: "1",  sentencia: "S-2026-002", liquidador: "María García",   documento: "12345678", fechaSolicitud: "2026-02-28", motivo: "Error en la tasa de interés moratorio aplicada. Se utilizó 1.5% cuando debía ser 1.8% según normativa vigente del periodo.", status: "Pendiente",  entity: "Secretaría de Salud",          valueLiquidated: "$38.450.000" },
  { id: "2",  sentencia: "S-2026-003", liquidador: "Carlos Sánchez", documento: "98765432", fechaSolicitud: "2026-02-27", motivo: "El capital base registrado no incluye las costas adicionales reconocidas en el fallo de segunda instancia.", status: "Pendiente",  entity: "Gobernación Valle del Cauca",  valueLiquidated: "$25.100.000" },
  { id: "3",  sentencia: "S-2025-089", liquidador: "Laura Díaz",     documento: "55512345", fechaSolicitud: "2026-02-25", motivo: "Solicitud de corrección de las fechas de causación. La fecha inicial debe ser 2020-03-15, no 2020-04-01.", status: "Aprobada",   entity: "Secretaría de Infraestructura",valueLiquidated: "$33.200.000" },
  { id: "4",  sentencia: "S-2025-082", liquidador: "María García",   documento: "12345678", fechaSolicitud: "2026-02-22", motivo: "Las retenciones aplicadas son incorrectas. El demandante tiene exención tributaria según resolución 0034/2024.", status: "Rechazada",  entity: "Gobernación Valle del Cauca",  valueLiquidated: "$19.250.000" },
  { id: "5",  sentencia: "S-2026-008", liquidador: "Pedro Jiménez",  documento: "11122334", fechaSolicitud: "2026-02-20", motivo: "Actualización monetaria calculada con IPC desactualizado. Debe usarse IPC de diciembre 2025 publicado por DANE.", status: "Pendiente",  entity: "Secretaría de Hacienda",       valueLiquidated: "$47.800.000" },
  { id: "6",  sentencia: "S-2025-075", liquidador: "Laura Díaz",     documento: "55512345", fechaSolicitud: "2026-02-18", motivo: "Costas no incluidas en la liquidación. El juzgado reconoció $2.5M en costas adicionales.", status: "Aprobada",   entity: "Secretaría de Educación",      valueLiquidated: "$84.600.000" },
  { id: "7",  sentencia: "S-2025-068", liquidador: "Carlos Sánchez", documento: "98765432", fechaSolicitud: "2026-02-15", motivo: "Error aritmético en el cálculo de intereses causados. La fórmula aplicada no corresponde al tipo de obligación.", status: "Rechazada",  entity: "Secretaría de Infraestructura",valueLiquidated: "$33.800.000" },
  { id: "8",  sentencia: "S-2026-010", liquidador: "Pedro Jiménez",  documento: "11122334", fechaSolicitud: "2026-02-10", motivo: "Actualización: el demandante cambió su número de documento. Requiere corrección de datos personales.", status: "Aprobada",   entity: "Secretaría de Infraestructura",valueLiquidated: "$15.900.000" },
  { id: "9",  sentencia: "S-2026-007", liquidador: "María García",   documento: "12345678", fechaSolicitud: "2026-02-08", motivo: "Embargo mal calculado. El auto de embargo establece el 30% del valor, no el 50% que se registró.", status: "Pendiente",  entity: "Secretaría de Educación",      valueLiquidated: "$53.200.000" },
  { id: "10", sentencia: "S-2025-060", liquidador: "Laura Díaz",     documento: "55512345", fechaSolicitud: "2026-02-05", motivo: "La periodicidad debe ser diaria según lo establecido en el fallo judicial, no mensual.", status: "Pendiente",  entity: "Secretaría de Educación",      valueLiquidated: "$19.250.000" },
];

// ── Datos: Pagadores ───────────────────────────────────────────────────────────
const initialPayerRequests: PayerCorrectionRequest[] = [
  {
    id: "p1", sentencia: "S-2026-011", pagador: "Carlos Torres", documento: "10.011.223",
    fechaSolicitud: "2026-03-01",
    motivo: "Se adjunta nuevo soporte de pago corregido. El comprobante anterior tenía un error en el número de cuenta bancaria del beneficiario. Se corrige con nueva transferencia al número de cuenta verificado con la entidad.",
    status: "Pendiente", entity: "Secretaría de Infraestructura", valuePayment: "$47.800.000",
  },
  {
    id: "p2", sentencia: "S-2026-004", pagador: "Ana Martínez", documento: "20.022.334",
    fechaSolicitud: "2026-02-28",
    motivo: "El monto del comprobante inicial tenía un error de digitación en el monto. Se adjunta nuevo comprobante verificado con el valor correcto de $21.800.000 correspondiente a la sentencia S-2026-004.",
    status: "Aprobada", entity: "Secretaría de Educación", valuePayment: "$21.800.000",
  },
  {
    id: "p3", sentencia: "S-2025-075", pagador: "Pedro Gómez", documento: "30.033.445",
    fechaSolicitud: "2026-02-20",
    motivo: "Soporte de pago adjuntado en formato incorrecto. Se reenvía en PDF con todos los datos bancarios requeridos por la tesorería de la entidad.",
    status: "Rechazada", entity: "Gobernación Valle del Cauca", valuePayment: "$43.100.000",
  },
];

const statusCfg = {
  "Pendiente":  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  "Aprobada":   { bg: "bg-green-50",  text: "text-[#34A853]",  border: "border-green-200",  dot: "bg-[#34A853]"  },
  "Rechazada":  { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-500"    },
};

// ── Sub-componente tabla liquidadores ──────────────────────────────────────────
function LiquidatorRequestsTable() {
  const [requests, setRequests]       = useState<EditRequest[]>(initialRequests);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [viewRequest, setViewRequest] = useState<EditRequest | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.sentencia.toLowerCase().includes(q) || r.liquidador.toLowerCase().includes(q) || r.documento.includes(q);
    const matchStatus = filterStatus === "Todos" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const counts = {
    pendientes: requests.filter(r => r.status === "Pendiente").length,
    aprobadas:  requests.filter(r => r.status === "Aprobada").length,
    rechazadas: requests.filter(r => r.status === "Rechazada").length,
  };

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Aprobada" } : r));
    setViewRequest(null);
    toast.success("Solicitud aprobada — el liquidador puede editar la liquidación");
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) { toast.error("Indica el motivo del rechazo"); return; }
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Rechazada" } : r));
    setViewRequest(null);
    setShowRejectInput(false);
    setRejectReason("");
    toast.success("Solicitud rechazada");
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-l-4 border-amber-400 border-gray-200 shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-amber-600">{counts.pendientes}</p>
        </div>
        <div className="bg-white rounded-xl border border-l-4 border-[#34A853] border-gray-200 shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Aprobadas</p>
          <p className="text-2xl font-bold text-[#34A853]">{counts.aprobadas}</p>
        </div>
        <div className="bg-white rounded-xl border border-l-4 border-red-500 border-gray-200 shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Rechazadas</p>
          <p className="text-2xl font-bold text-red-600">{counts.rechazadas}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Buscar por sentencia, liquidador o cédula..." className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
          </div>
          <div className="relative">
            <button onClick={() => setShowFilterMenu(!showFilterMenu)} className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs transition-colors ${filterStatus !== "Todos" ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
              <Filter size={13} /> {filterStatus} <ChevronDown size={11} />
            </button>
            {showFilterMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  {["Todos", "Pendiente", "Aprobada", "Rechazada"].map(opt => (
                    <button key={opt} onClick={() => { setFilterStatus(opt); setShowFilterMenu(false); setCurrentPage(1); }} className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${filterStatus === opt ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <span className="ml-auto text-xs text-gray-400">{filtered.length} solicitudes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Sentencia</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Liquidador</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Entidad</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Fecha</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No se encontraron solicitudes</td></tr>
              ) : paginated.map(req => {
                const sc = statusCfg[req.status];
                return (
                  <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-bold text-[#1C5BB8]">{req.sentencia}</p>
                      <p className="text-xs text-gray-400">{req.valueLiquidated}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-gray-900">{req.liquidador}</p>
                      <p className="text-xs text-gray-400">{req.documento}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-xs text-gray-500 max-w-[160px] truncate">{req.entity}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <p className="text-xs text-gray-500">{req.fechaSolicitud}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${sc.bg} ${sc.text} ${sc.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setViewRequest(req); setShowRejectInput(false); setRejectReason(""); }} className="p-1.5 text-gray-400 hover:text-[#1C5BB8] hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={14} />
                        </button>
                        {req.status === "Pendiente" && (
                          <>
                            <button onClick={() => handleApprove(req.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-[#34A853] text-white rounded-lg text-xs hover:bg-[#2d9247] transition-colors">
                              <CheckCircle2 size={12} /> Aprobar
                            </button>
                            <button onClick={() => { setViewRequest(req); setShowRejectInput(true); }} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors">
                              <XCircle size={12} /> Rechazar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
      </div>

      {/* Modal detalle liquidador */}
      {viewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewRequest(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="bg-[#1C5BB8] px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-white" />
                <h2 className="text-sm font-semibold text-white">Detalle de Solicitud — Liquidador</h2>
              </div>
              <button onClick={() => setViewRequest(null)} className="p-1.5 hover:bg-white/20 rounded-lg">
                <X size={16} className="text-white" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Hash,     label: "Sentencia",   value: viewRequest.sentencia },
                  { icon: User,     label: "Liquidador",  value: viewRequest.liquidador },
                  { icon: Calendar, label: "Solicitado",  value: viewRequest.fechaSolicitud },
                  { icon: Hash,     label: "Cédula",      value: viewRequest.documento },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-[#1C5BB8]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-xs font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Motivo de la solicitud</p>
                <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs text-gray-700 leading-relaxed">{viewRequest.motivo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Estado actual:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${statusCfg[viewRequest.status].bg} ${statusCfg[viewRequest.status].text} ${statusCfg[viewRequest.status].border}`}>
                  {viewRequest.status}
                </span>
              </div>
              {showRejectInput && viewRequest.status === "Pendiente" && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Motivo del rechazo <span className="text-red-500">*</span></label>
                  <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Indica por qué se rechaza la solicitud..." className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 resize-none" />
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setViewRequest(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">Cerrar</button>
              {viewRequest.status === "Pendiente" && (
                <>
                  {!showRejectInput ? (
                    <>
                      <button onClick={() => setShowRejectInput(true)} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs hover:bg-red-100">
                        <XCircle size={13} /> Rechazar
                      </button>
                      <button onClick={() => handleApprove(viewRequest.id)} className="flex items-center gap-1.5 px-4 py-2 bg-[#34A853] text-white rounded-lg text-xs hover:bg-[#2d9247]">
                        <CheckCircle2 size={13} /> Aprobar Solicitud
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setShowRejectInput(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">Cancelar</button>
                      <button onClick={() => handleReject(viewRequest.id)} className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700">
                        <XCircle size={13} /> Confirmar Rechazo
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Sub-componente tabla pagadores ─────────────────────────────────────────────
function PayerRequestsTable() {
  const [requests, setRequests]         = useState<PayerCorrectionRequest[]>(initialPayerRequests);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [viewRequest, setViewRequest]   = useState<PayerCorrectionRequest | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.sentencia.toLowerCase().includes(q) || r.pagador.toLowerCase().includes(q) || r.documento.includes(q);
    const matchStatus = filterStatus === "Todos" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const counts = {
    pendientes: requests.filter(r => r.status === "Pendiente").length,
    aprobadas:  requests.filter(r => r.status === "Aprobada").length,
    rechazadas: requests.filter(r => r.status === "Rechazada").length,
  };

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Aprobada" } : r));
    setViewRequest(null);
    toast.success("Corrección aprobada — el pago ha sido corregido exitosamente");
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) { toast.error("Indica el motivo del rechazo"); return; }
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Rechazada" } : r));
    setViewRequest(null);
    setShowRejectInput(false);
    setRejectReason("");
    toast.success("Corrección rechazada");
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-l-4 border-amber-400 border-gray-200 shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-amber-600">{counts.pendientes}</p>
        </div>
        <div className="bg-white rounded-xl border border-l-4 border-[#34A853] border-gray-200 shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Aprobadas</p>
          <p className="text-2xl font-bold text-[#34A853]">{counts.aprobadas}</p>
        </div>
        <div className="bg-white rounded-xl border border-l-4 border-red-500 border-gray-200 shadow-sm p-4">
          <p className="text-xs text-gray-500 mb-1">Rechazadas</p>
          <p className="text-2xl font-bold text-red-600">{counts.rechazadas}</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Buscar por sentencia, pagador o cédula..." className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
          </div>
          <div className="relative">
            <button onClick={() => setShowFilterMenu(!showFilterMenu)} className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs transition-colors ${filterStatus !== "Todos" ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
              <Filter size={13} /> {filterStatus} <ChevronDown size={11} />
            </button>
            {showFilterMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  {["Todos", "Pendiente", "Aprobada", "Rechazada"].map(opt => (
                    <button key={opt} onClick={() => { setFilterStatus(opt); setShowFilterMenu(false); setCurrentPage(1); }} className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${filterStatus === opt ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <span className="ml-auto text-xs text-gray-400">{filtered.length} correcciones</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Sentencia</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Pagador</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Entidad</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Fecha</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No se encontraron correcciones</td></tr>
              ) : paginated.map(req => {
                const sc = statusCfg[req.status];
                return (
                  <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-bold text-[#1C5BB8]">{req.sentencia}</p>
                      <p className="text-xs text-gray-400">{req.valuePayment}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-gray-900">{req.pagador}</p>
                      <p className="text-xs text-gray-400">{req.documento}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-xs text-gray-500 max-w-[160px] truncate">{req.entity}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <p className="text-xs text-gray-500">{req.fechaSolicitud}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${sc.bg} ${sc.text} ${sc.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setViewRequest(req); setShowRejectInput(false); setRejectReason(""); }} className="p-1.5 text-gray-400 hover:text-[#1C5BB8] hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={14} />
                        </button>
                        {req.status === "Pendiente" && (
                          <>
                            <button onClick={() => handleApprove(req.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-[#34A853] text-white rounded-lg text-xs hover:bg-[#2d9247] transition-colors">
                              <CheckCircle2 size={12} /> Aprobar
                            </button>
                            <button onClick={() => { setViewRequest(req); setShowRejectInput(true); }} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors">
                              <XCircle size={12} /> Rechazar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
      </div>

      {/* Modal detalle pagador */}
      {viewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewRequest(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="bg-orange-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-white" />
                <h2 className="text-sm font-semibold text-white">Corrección de Pago — Pagador</h2>
              </div>
              <button onClick={() => setViewRequest(null)} className="p-1.5 hover:bg-white/20 rounded-lg">
                <X size={16} className="text-white" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Hash,     label: "Sentencia",  value: viewRequest.sentencia },
                  { icon: User,     label: "Pagador",    value: viewRequest.pagador },
                  { icon: Calendar, label: "Solicitado", value: viewRequest.fechaSolicitud },
                  { icon: CreditCard, label: "Valor",    value: viewRequest.valuePayment },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-xs font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Descripción de la corrección</p>
                <div className="p-3.5 bg-orange-50 border border-orange-100 rounded-xl">
                  <p className="text-xs text-gray-700 leading-relaxed">{viewRequest.motivo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Estado actual:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${statusCfg[viewRequest.status].bg} ${statusCfg[viewRequest.status].text} ${statusCfg[viewRequest.status].border}`}>
                  {viewRequest.status}
                </span>
              </div>
              {showRejectInput && viewRequest.status === "Pendiente" && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Motivo del rechazo <span className="text-red-500">*</span></label>
                  <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Indica por qué se rechaza la corrección..." className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 resize-none" />
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setViewRequest(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">Cerrar</button>
              {viewRequest.status === "Pendiente" && (
                <>
                  {!showRejectInput ? (
                    <>
                      <button onClick={() => setShowRejectInput(true)} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs hover:bg-red-100">
                        <XCircle size={13} /> Rechazar
                      </button>
                      <button onClick={() => handleApprove(viewRequest.id)} className="flex items-center gap-1.5 px-4 py-2 bg-[#34A853] text-white rounded-lg text-xs hover:bg-[#2d9247]">
                        <CheckCircle2 size={13} /> Aprobar Corrección
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setShowRejectInput(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">Cancelar</button>
                      <button onClick={() => handleReject(viewRequest.id)} className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700">
                        <XCircle size={13} /> Confirmar Rechazo
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Componente Principal ───────────────────────────────────────────────────────
export function EditRequests() {
  const [activeTab, setActiveTab] = useState<"liquidators" | "payers">("liquidators");

  const tabs = [
    { id: "liquidators" as const, label: "Liquidadores", count: initialRequests.filter(r => r.status === "Pendiente").length, color: "blue" },
    { id: "payers"      as const, label: "Pagadores",    count: initialPayerRequests.filter(r => r.status === "Pendiente").length, color: "orange" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Solicitudes de Edición y Corrección</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestión de solicitudes de modificación por liquidadores y pagadores</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? tab.id === "liquidators"
                  ? "bg-white text-[#1C5BB8] shadow-sm"
                  : "bg-white text-orange-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id
                  ? tab.id === "liquidators" ? "bg-blue-100 text-[#1C5BB8]" : "bg-orange-100 text-orange-600"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "liquidators" ? (
        <LiquidatorRequestsTable />
      ) : (
        <PayerRequestsTable />
      )}
    </div>
  );
}
