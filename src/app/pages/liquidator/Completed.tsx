import { useState, useMemo } from "react";
import {
  Search, Filter, ChevronDown, X, FileText, CheckCircle2,
  MessageSquare, Calendar, Eye, Clock, AlertCircle, Send,
  Lock, ArrowRight,
} from "lucide-react";
import { Pagination } from "../../components/Pagination";
import { toast } from "sonner";

interface CompletedSentence {
  id: string;
  number: string;
  completedDate: string;
  accionante: string;
  document: string;
  liquidatedValue: string;
  liquidatedRaw: number;
  status: "Terminada" | "Corrección de liquidador";
  instancia: "Primera" | "Segunda" | "Tercera";
  juzgado: string;
  entity: string;
  capitalBase?: string;
  intereses?: string;
  costas?: string;
  payerNote?: string;
}

type CorrectionStatus = "solicitada" | "aprobada" | "rechazada";

const completedSentences: CompletedSentence[] = [
  { id: "2",  number: "S-2026-002", completedDate: "2026-02-25", accionante: "Ana María Rodríguez Flórez",    document: "98765432", liquidatedValue: "$34.300.000", liquidatedRaw: 34300000, status: "Terminada",                instancia: "Segunda", juzgado: "Tribunal Administrativo del Valle", entity: "Secretaría de Salud",          capitalBase: "$28.000.000", intereses: "$5.800.000", costas: "$500.000" },
  { id: "3",  number: "S-2026-003", completedDate: "2026-02-22", accionante: "Carmen Lucía López Restrepo",   document: "55512345", liquidatedValue: "$22.500.000", liquidatedRaw: 22500000, status: "Terminada",                instancia: "Primera", juzgado: "Juzgado 2° Administrativo Cali",   entity: "Gobernación Valle del Cauca",   capitalBase: "$18.000.000", intereses: "$4.000.000", costas: "$500.000" },
  { id: "7",  number: "S-2026-008", completedDate: "2026-02-15", accionante: "Luisa Fernanda Gómez Parra",    document: "44455667", liquidatedValue: "$30.800.000", liquidatedRaw: 30800000, status: "Corrección de liquidador", instancia: "Primera", juzgado: "Juzgado 4° Administrativo Cali",   entity: "Secretaría de Salud",          capitalBase: "$25.000.000", intereses: "$5.300.000", costas: "$500.000", payerNote: "Verificar fórmula de intereses sobre el capital base." },
  { id: "9",  number: "S-2026-010", completedDate: "2026-02-10", accionante: "Patricia Elena Herrera Díaz",   document: "22233445", liquidatedValue: "$16.700.000", liquidatedRaw: 16700000, status: "Terminada",                instancia: "Segunda", juzgado: "Tribunal Administrativo del Valle", entity: "Secretaría de Infraestructura", capitalBase: "$13.500.000", intereses: "$2.700.000", costas: "$500.000" },
  { id: "11", number: "S-2025-089", completedDate: "2026-02-05", accionante: "Sandra Milena Ríos Quintero",   document: "55566778", liquidatedValue: "$40.200.000", liquidatedRaw: 40200000, status: "Terminada",                instancia: "Segunda", juzgado: "Tribunal Administrativo del Valle", entity: "Secretaría de Salud",          capitalBase: "$32.000.000", intereses: "$7.700.000", costas: "$500.000" },
  { id: "14", number: "S-2025-068", completedDate: "2026-01-30", accionante: "Germán Arturo Cárdenas Nieto",  document: "66543210", liquidatedValue: "$35.100.000", liquidatedRaw: 35100000, status: "Corrección de liquidador", instancia: "Primera", juzgado: "Juzgado 2° Administrativo Cali",   entity: "Secretaría de Infraestructura", capitalBase: "$28.000.000", intereses: "$6.600.000", costas: "$500.000", payerNote: "Falta incluir IPC del último trimestre." },
  { id: "15", number: "S-2025-060", completedDate: "2026-01-20", accionante: "Claudia Patricia Mejía Torres", document: "44112233", liquidatedValue: "$20.000.000", liquidatedRaw: 20000000, status: "Terminada",                instancia: "Segunda", juzgado: "Tribunal Administrativo del Valle", entity: "Secretaría de Educación",      capitalBase: "$16.000.000", intereses: "$3.500.000", costas: "$500.000" },
];

const ITEMS_PER_PAGE = 8;

const statusConfig = {
  "Terminada":                { bg: "bg-green-50", text: "text-[#34A853]", border: "border-green-200", icon: CheckCircle2 },
  "Corrección de liquidador": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: AlertCircle  },
};

const instanciaColors = {
  "Primera": "bg-violet-50 text-violet-700 border-violet-200",
  "Segunda":  "bg-sky-50 text-sky-700 border-sky-200",
  "Tercera":  "bg-orange-50 text-orange-700 border-orange-200",
};

const corrStatusCfg: Record<CorrectionStatus, { label: string; bg: string; text: string; border: string }> = {
  solicitada: { label: "Solicitada — esperando respuesta", bg: "bg-blue-50",  text: "text-[#1C5BB8]", border: "border-blue-200"  },
  aprobada:   { label: "Aprobada — regresa a pendientes",  bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  rechazada:  { label: "Rechazada por administrador",       bg: "bg-red-50",   text: "text-red-700",   border: "border-red-200"   },
};

export function LiquidatorCompleted() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterInstancia, setFilterInstancia] = useState("Todas");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Overlay states
  const [preview, setPreview] = useState<CompletedSentence | null>(null);
  const [detailSentence, setDetailSentence] = useState<CompletedSentence | null>(null);
  const [corrReqModal, setCorrReqModal] = useState<CompletedSentence | null>(null);
  const [corrReason, setCorrReason] = useState("");

  // Correction states per sentence
  const [corrections, setCorrections] = useState<Record<string, CorrectionStatus>>({});

  // Approved corrections remove sentences from this view
  const approvedIds = Object.entries(corrections).filter(([, v]) => v === "aprobada").map(([k]) => k);
  const displaySentences = completedSentences.filter(s => !approvedIds.includes(s.id));

  const stats = {
    total: displaySentences.length,
    terminadas: displaySentences.filter(s => s.status === "Terminada").length,
    correccion: displaySentences.filter(s => s.status === "Corrección de liquidador").length,
    valorTotal: displaySentences.reduce((acc, s) => acc + s.liquidatedRaw, 0),
  };

  const filtered = useMemo(() => displaySentences.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.number.toLowerCase().includes(q) || s.accionante.toLowerCase().includes(q) || s.document.includes(q);
    const matchStatus = filterStatus === "Todos" || s.status === filterStatus;
    const matchInstancia = filterInstancia === "Todas" || s.instancia === filterInstancia;
    const matchFrom = !filterDateFrom || s.completedDate >= filterDateFrom;
    const matchTo = !filterDateTo || s.completedDate <= filterDateTo;
    return matchSearch && matchStatus && matchInstancia && matchFrom && matchTo;
  }), [search, filterStatus, filterInstancia, filterDateFrom, filterDateTo, displaySentences]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearch(""); setFilterStatus("Todos"); setFilterInstancia("Todas");
    setFilterDateFrom(""); setFilterDateTo(""); setCurrentPage(1);
  };

  const activeFilters = [filterStatus !== "Todos", filterInstancia !== "Todas", !!filterDateFrom, !!filterDateTo].filter(Boolean).length;
  const fmt = (v: number) => "$" + v.toLocaleString("es-CO");

  const submitCorrectionRequest = () => {
    if (!corrReason.trim()) { toast.error("Describe el motivo de la corrección"); return; }
    if (!corrReqModal) return;
    setCorrections(prev => ({ ...prev, [corrReqModal.id]: "solicitada" }));
    toast.success(`Solicitud de corrección enviada para ${corrReqModal.number}`);
    setCorrReqModal(null); setCorrReason("");
  };

  // Simulate admin response (demo buttons)
  const simulateAdminResponse = (id: string, decision: CorrectionStatus) => {
    setCorrections(prev => ({ ...prev, [id]: decision }));
    if (decision === "aprobada") {
      toast.success("Admin aprobó la corrección — sentencia regresa a pendientes");
    } else {
      toast.error("Admin rechazó la solicitud de corrección");
    }
  };

  const openCorrReq = (s: CompletedSentence) => {
    setDetailSentence(null);
    setPreview(null);
    setCorrReqModal(s);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Mis Liquidaciones</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sentencias liquidadas y con solicitudes de corrección activas</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Liquidador</p>
          <p className="text-sm font-medium text-gray-700">María García</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total liquidaciones",   value: stats.total,          color: "border-l-[#1C5BB8]", text: "text-[#1C5BB8]" },
          { label: "Terminadas",            value: stats.terminadas,     color: "border-l-[#34A853]", text: "text-[#34A853]" },
          { label: "Corrección solicitada", value: stats.correccion,     color: "border-l-amber-400", text: "text-amber-700" },
          { label: "Valor total reportado", value: fmt(stats.valorTotal), color: "border-l-[#FBBC05]", text: "text-gray-800",  small: true },
        ].map(({ label, value, color, text, small }) => (
          <div key={label} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${color} shadow-sm p-4`}>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`${small ? "text-sm" : "text-2xl"} font-bold ${text}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search & Filters */}
        <div className="px-5 py-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Buscar por sentencia, accionante o cédula..."
                aria-label="Buscar liquidaciones"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2" aria-label="Limpiar búsqueda">
                  <X size={12} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-label="Mostrar filtros"
              className={`relative flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs ${showFilters || activeFilters ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
            >
              <Filter size={13} aria-hidden="true" /> Filtros
              <ChevronDown size={11} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} aria-hidden="true" />
              {activeFilters > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1C5BB8] text-white rounded-full text-[9px] flex items-center justify-center font-bold" aria-label={`${activeFilters} filtros activos`}>
                  {activeFilters}
                </span>
              )}
            </button>
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                <X size={12} /> Limpiar filtros
              </button>
            )}
            <span className="ml-auto text-xs text-gray-400" aria-live="polite">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1" htmlFor="filter-status">Estado</label>
                <select id="filter-status" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white">
                  <option>Todos</option><option>Terminada</option><option>Corrección de liquidador</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1" htmlFor="filter-instancia">Instancia</label>
                <select id="filter-instancia" value={filterInstancia} onChange={e => { setFilterInstancia(e.target.value); setCurrentPage(1); }}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white">
                  <option>Todas</option><option>Primera</option><option>Segunda</option><option>Tercera</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1" htmlFor="filter-from">
                  <Calendar size={11} aria-hidden="true" /> Desde
                </label>
                <input id="filter-from" type="date" value={filterDateFrom} onChange={e => { setFilterDateFrom(e.target.value); setCurrentPage(1); }} className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1" htmlFor="filter-to">
                  <Calendar size={11} aria-hidden="true" /> Hasta
                </label>
                <input id="filter-to" type="date" value={filterDateTo} onChange={e => { setFilterDateTo(e.target.value); setCurrentPage(1); }} className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg" />
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto" role="region" aria-label="Tabla de liquidaciones">
          <table className="w-full" aria-describedby="table-desc">
            <caption id="table-desc" className="sr-only">Lista de sentencias liquidadas con su estado y acciones disponibles</caption>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">N° Sentencia</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Accionante</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Instancia</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Valor Reportado</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Terminada</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th scope="col" className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={32} className="text-gray-200" aria-hidden="true" />
                      <p className="text-sm text-gray-400">Sin liquidaciones que mostrar</p>
                    </div>
                  </td>
                </tr>
              ) : paginated.map(s => {
                const sc = statusConfig[s.status];
                const Sc = sc.icon;
                const corrState = corrections[s.id];
                return (
                  <tr key={s.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-[#1C5BB8]">{s.number}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{s.document}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-gray-900">{s.accionante}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[160px]">{s.entity}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs border ${instanciaColors[s.instancia]}`}>
                        {s.instancia} Instancia
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold text-gray-800">{s.liquidatedValue}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">{s.completedDate}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${sc.bg} ${sc.text} ${sc.border}`}>
                          <Sc size={10} aria-hidden="true" /> {s.status}
                        </span>
                        {/* Correction state badge */}
                        {corrState === "solicitada" && (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] bg-blue-50 border border-blue-200 text-[#1C5BB8]">
                              <Clock size={10} aria-hidden="true" /> Corrección solicitada
                            </span>
                            {/* Demo: simulate admin response */}
                            <div className="flex gap-1">
                              <button
                                onClick={() => simulateAdminResponse(s.id, "aprobada")}
                                className="px-1.5 py-0.5 text-[10px] bg-green-100 text-green-700 rounded border border-green-200 hover:bg-green-200"
                                title="Simular aprobación (demo)"
                              >✓ Aprobar</button>
                              <button
                                onClick={() => simulateAdminResponse(s.id, "rechazada")}
                                className="px-1.5 py-0.5 text-[10px] bg-red-100 text-red-700 rounded border border-red-200 hover:bg-red-200"
                                title="Simular rechazo (demo)"
                              >✗ Rechazar</button>
                            </div>
                          </div>
                        )}
                        {corrState === "rechazada" && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] bg-red-50 border border-red-200 text-red-700">
                            Corrección rechazada
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Vista previa (ojo) */}
                        <button
                          onClick={() => setPreview(s)}
                          className="p-1.5 text-gray-400 hover:text-[#1C5BB8] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Vista previa rápida"
                          aria-label={`Vista previa de ${s.number}`}
                        >
                          <Eye size={14} aria-hidden="true" />
                        </button>
                        {/* Ver al detalle */}
                        <button
                          onClick={() => setDetailSentence(s)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1C5BB8] text-white hover:bg-[#1850A0] transition-colors"
                          aria-label={`Ver detalle de ${s.number}`}
                        >
                          <ArrowRight size={13} aria-hidden="true" /> Ver al detalle
                        </button>
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

      {/* ── Vista previa (ojo) ── */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="preview-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPreview(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="bg-gray-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-white" aria-hidden="true" />
                <h2 id="preview-title" className="text-sm font-semibold text-white">Vista previa — {preview.number}</h2>
              </div>
              <button onClick={() => setPreview(null)} className="p-1.5 hover:bg-white/20 rounded-lg" aria-label="Cerrar vista previa">
                <X size={18} className="text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-2">
              {[
                ["N° Sentencia", preview.number],
                ["Accionante", preview.accionante],
                ["Cédula", preview.document],
                ["Entidad", preview.entity],
                ["Juzgado", preview.juzgado],
                ["Instancia", `${preview.instancia} Instancia`],
                ["Capital Base", preview.capitalBase || "—"],
                ["Intereses", preview.intereses || "—"],
                ["Costas", preview.costas || "—"],
                ["Valor Reportado", preview.liquidatedValue],
                ["Fecha Terminada", preview.completedDate],
                ["Estado", preview.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5 border-b border-gray-50">
                  <span className="text-xs text-gray-500 w-32 flex-shrink-0">{k}</span>
                  <span className="text-xs font-medium text-gray-800 text-right">{v}</span>
                </div>
              ))}
              {preview.payerNote && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-medium text-amber-700 mb-1">Solicitud del pagador:</p>
                  <p className="text-xs text-amber-700">{preview.payerNote}</p>
                </div>
              )}
              {corrections[preview.id] && (
                <div className={`mt-3 p-3 rounded-lg border ${corrStatusCfg[corrections[preview.id]].bg} ${corrStatusCfg[corrections[preview.id]].border}`}>
                  <p className={`text-xs font-medium ${corrStatusCfg[corrections[preview.id]].text}`}>
                    Corrección: {corrStatusCfg[corrections[preview.id]].label}
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Ver al detalle ── */}
      {detailSentence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="detail-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDetailSentence(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#1C5BB8] px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText size={18} className="text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="detail-title" className="text-sm font-semibold text-white">Detalle de Liquidación</h2>
                  <p className="text-xs text-blue-200">{detailSentence.number} — {detailSentence.accionante}</p>
                </div>
              </div>
              <button onClick={() => setDetailSentence(null)} className="p-1.5 hover:bg-white/20 rounded-lg" aria-label="Cerrar detalle">
                <X size={18} className="text-white" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-2">
              {/* Full info */}
              {[
                ["N° Sentencia", detailSentence.number],
                ["Accionante", detailSentence.accionante],
                ["Cédula / Doc.", detailSentence.document],
                ["Entidad", detailSentence.entity],
                ["Juzgado / Tribunal", detailSentence.juzgado],
                ["Instancia", `${detailSentence.instancia} Instancia`],
                ["Capital Base", detailSentence.capitalBase || "—"],
                ["Intereses Causados", detailSentence.intereses || "—"],
                ["Costas del Proceso", detailSentence.costas || "—"],
                ["Valor Total Reportado", detailSentence.liquidatedValue],
                ["Fecha Terminada", detailSentence.completedDate],
                ["Estado", detailSentence.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5 border-b border-gray-50">
                  <span className="text-xs text-gray-500 w-36 flex-shrink-0">{k}</span>
                  <span className={`text-xs font-medium text-right break-words max-w-[220px] ${k === "Valor Total Reportado" ? "text-[#1C5BB8]" : "text-gray-800"}`}>{v}</span>
                </div>
              ))}

              {/* Payer note */}
              {detailSentence.payerNote && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Motivo señalado por el pagador:</p>
                  <p className="text-xs text-amber-600">{detailSentence.payerNote}</p>
                </div>
              )}

              {/* Correction state badge */}
              {corrections[detailSentence.id] && (
                <div className={`mt-2 p-3 rounded-lg border ${corrStatusCfg[corrections[detailSentence.id]].bg} ${corrStatusCfg[corrections[detailSentence.id]].border}`}>
                  <p className={`text-xs font-medium ${corrStatusCfg[corrections[detailSentence.id]].text}`}>
                    Corrección: {corrStatusCfg[corrections[detailSentence.id]].label}
                  </p>
                </div>
              )}

              {/* ¿Necesitas editar? */}
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={14} className="text-amber-600 flex-shrink-0" aria-hidden="true" />
                  <p className="text-xs font-semibold text-amber-800">¿Necesitas editar?</p>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed mb-3">
                  Esta liquidación está bloqueada. Solicita autorización al administrador para realizar cambios.
                </p>
                {(!corrections[detailSentence.id] || corrections[detailSentence.id] === "rechazada") && (
                  <button
                    onClick={() => openCorrReq(detailSentence)}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-medium hover:bg-amber-700 transition-colors"
                    aria-label="Solicitar autorización para hacer cambios"
                  >
                    <MessageSquare size={13} aria-hidden="true" /> Solicitar hacer cambios
                  </button>
                )}
                {corrections[detailSentence.id] === "solicitada" && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <Clock size={12} className="text-[#1C5BB8] flex-shrink-0" aria-hidden="true" />
                    <p className="text-xs text-[#1C5BB8]">Solicitud enviada — en espera de respuesta del administrador.</p>
                  </div>
                )}
                {corrections[detailSentence.id] === "aprobada" && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 size={12} className="text-green-700 flex-shrink-0" aria-hidden="true" />
                    <p className="text-xs text-green-700">Corrección aprobada. La sentencia regresará a pendientes.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setDetailSentence(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Solicitar corrección al administrador ── */}
      {corrReqModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="corr-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setCorrReqModal(null); setCorrReason(""); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
            <div className="bg-[#1C5BB8] px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-white" aria-hidden="true" />
                <div>
                  <h2 id="corr-title" className="text-sm font-semibold text-white">Solicitar corrección al administrador</h2>
                  <p className="text-xs text-blue-200">{corrReqModal.number} — {corrReqModal.accionante}</p>
                </div>
              </div>
              <button onClick={() => { setCorrReqModal(null); setCorrReason(""); }} className="p-1.5 hover:bg-white/20 rounded-lg" aria-label="Cerrar modal">
                <X size={18} className="text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {corrReqModal.payerNote && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Motivo señalado por el pagador:</p>
                  <p className="text-xs text-amber-600">{corrReqModal.payerNote}</p>
                </div>
              )}
              <div>
                <label htmlFor="corr-reason" className="block text-xs font-medium text-gray-700 mb-1.5">
                  Descripción de la corrección solicitada <span className="text-red-500" aria-hidden="true">*</span>
                  <span className="sr-only">(obligatorio)</span>
                </label>
                <textarea
                  id="corr-reason"
                  rows={4}
                  value={corrReason}
                  onChange={e => setCorrReason(e.target.value)}
                  placeholder="Describe qué necesitas corregir y el motivo..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] resize-none"
                />
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg" role="note">
                <p className="text-xs text-[#1C5BB8]">
                  El administrador revisará la solicitud. Si es aprobada, la sentencia volverá a Sentencias Pendientes para corrección.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => { setCorrReqModal(null); setCorrReason(""); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={submitCorrectionRequest}
                className="px-4 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs hover:bg-[#1850A0] inline-flex items-center gap-1.5"
              >
                <Send size={13} aria-hidden="true" /> Enviar solicitud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}