import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search, Filter, ChevronDown, X, FileText, Clock, AlertCircle, Edit3,
  Calendar, Eye,
} from "lucide-react";
import { Pagination } from "../../components/Pagination";

interface Sentence {
  id: string;
  number: string;
  assignedDate: string;
  accionante: string;
  document: string;
  status: "En proceso" | "Por corregir";
  instancia: "Primera" | "Segunda" | "Tercera";
  juzgado: string;
  entity: string;
  adminNote?: string;
}

const pendingSentences: Sentence[] = [
  { id: "1",  number: "S-2026-001", assignedDate: "2026-02-20", accionante: "Juan Carlos Pérez Morales",      document: "12345678", status: "En proceso",   instancia: "Primera", juzgado: "Juzgado 1° Administrativo Cali",   entity: "Secretaría de Educación" },
  { id: "4",  number: "S-2026-005", assignedDate: "2026-02-12", accionante: "Roberto Antonio Castaño",        document: "11122334", status: "En proceso",   instancia: "Tercera", juzgado: "Consejo de Estado",                 entity: "Secretaría de Infraestructura" },
  { id: "5",  number: "S-2026-006", assignedDate: "2026-02-10", accionante: "María del Pilar Vargas Ruiz",    document: "33344556", status: "Por corregir", instancia: "Segunda", juzgado: "Tribunal Administrativo del Valle", entity: "Secretaría de Hacienda", adminNote: "Recalcular intereses moratorios desde fecha de ejecutoria." },
  { id: "6",  number: "S-2026-007", assignedDate: "2026-02-08", accionante: "Diego Fernando Torres Salazar",  document: "77788990", status: "En proceso",   instancia: "Primera", juzgado: "Juzgado 3° Administrativo Cali",   entity: "Secretaría de Educación" },
  { id: "8",  number: "S-2026-009", assignedDate: "2026-02-03", accionante: "Carlos Eduardo Muñoz Ospina",    document: "66677889", status: "En proceso",   instancia: "Tercera", juzgado: "Consejo de Estado",                 entity: "Gobernación Valle del Cauca" },
  { id: "10", number: "S-2026-011", assignedDate: "2026-01-28", accionante: "Andrés Felipe Sánchez Lozano",   document: "88899001", status: "En proceso",   instancia: "Primera", juzgado: "Juzgado 5° Administrativo Cali",   entity: "Secretaría de Educación" },
  { id: "12", number: "S-2025-082", assignedDate: "2026-01-20", accionante: "Mauricio Alberto Peña Castro",   document: "99900112", status: "Por corregir", instancia: "Primera", juzgado: "Juzgado 1° Administrativo Cali",   entity: "Gobernación Valle del Cauca", adminNote: "Verificar capital base contra anexo del fallo." },
  { id: "13", number: "S-2025-075", assignedDate: "2026-01-15", accionante: "Isabel Cristina Vergara Mora",   document: "11200334", status: "En proceso",   instancia: "Tercera", juzgado: "Consejo de Estado",                 entity: "Secretaría de Hacienda" },
];

const ITEMS_PER_PAGE = 8;

const statusConfig = {
  "En proceso":   { bg: "bg-blue-50",  text: "text-[#1C5BB8]", border: "border-blue-200",  icon: Clock        },
  "Por corregir": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: AlertCircle  },
};

export function LiquidatorPending() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [preview, setPreview] = useState<Sentence | null>(null);

  const stats = {
    total:       pendingSentences.length,
    enProceso:   pendingSentences.filter(s => s.status === "En proceso").length,
    porCorregir: pendingSentences.filter(s => s.status === "Por corregir").length,
  };

  const filtered = useMemo(() => pendingSentences.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.number.toLowerCase().includes(q) || s.accionante.toLowerCase().includes(q) || s.document.includes(q);
    const matchStatus = filterStatus === "Todos" || s.status === filterStatus;
    const matchFrom = !filterDateFrom || s.assignedDate >= filterDateFrom;
    const matchTo = !filterDateTo || s.assignedDate <= filterDateTo;
    return matchSearch && matchStatus && matchFrom && matchTo;
  }), [search, filterStatus, filterDateFrom, filterDateTo]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearch(""); setFilterStatus("Todos");
    setFilterDateFrom(""); setFilterDateTo(""); setCurrentPage(1);
  };

  const activeFilters = [filterStatus !== "Todos", !!filterDateFrom, !!filterDateTo].filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sentencias Pendientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sentencias asignadas por el administrador para liquidar o corregir</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Liquidador</p>
          <p className="text-sm font-medium text-gray-700">María García</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total pendientes", value: stats.total,       color: "border-l-[#1C5BB8]", text: "text-[#1C5BB8]" },
          { label: "En Proceso",        value: stats.enProceso,   color: "border-l-[#FBBC05]", text: "text-amber-600" },
          { label: "Por corregir",      value: stats.porCorregir, color: "border-l-amber-400", text: "text-amber-700" },
        ].map(({ label, value, color, text }) => (
          <div key={label} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${color} shadow-sm p-4`}>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${text}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Buscar por accionante, cédula o N° sentencia..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
              {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={12} className="text-gray-400 hover:text-gray-600" /></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`relative flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs ${showFilters || activeFilters ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
              <Filter size={13} /> Filtros <ChevronDown size={11} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
              {activeFilters > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1C5BB8] text-white rounded-full text-[9px] flex items-center justify-center font-bold">{activeFilters}</span>}
            </button>
            {activeFilters > 0 && <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"><X size={12} /> Limpiar</button>}
            <span className="ml-auto text-xs text-gray-400">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white">
                  <option>Todos</option><option>En proceso</option><option>Por corregir</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Calendar size={11} /> Desde</label>
                <input type="date" value={filterDateFrom} onChange={e => { setFilterDateFrom(e.target.value); setCurrentPage(1); }}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Calendar size={11} /> Hasta</label>
                <input type="date" value={filterDateTo} onChange={e => { setFilterDateTo(e.target.value); setCurrentPage(1); }}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg" />
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">N° Sentencia</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Accionante</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Juzgado</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Asignación</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={32} className="text-gray-200" />
                    <p className="text-sm text-gray-400">No hay sentencias pendientes</p>
                  </div>
                </td></tr>
              ) : paginated.map(s => {
                const sc = statusConfig[s.status]; const Sc = sc.icon;
                const isCorrect = s.status === "Por corregir";
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
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">{s.juzgado}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell"><span className="text-xs text-gray-500">{s.assignedDate}</span></td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${sc.bg} ${sc.text} ${sc.border}`}>
                        <Sc size={10} /> {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setPreview(s)} className="p-1.5 text-gray-400 hover:text-[#1C5BB8] hover:bg-blue-50 rounded-lg" title="Vista previa">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => navigate(`/liquidator/process/${s.id}`)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${isCorrect ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200" : "bg-[#1C5BB8] text-white hover:bg-[#1850A0]"}`}>
                          {isCorrect ? <><Edit3 size={13} /> Corregir</> : <><FileText size={13} /> Liquidar</>}
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

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPreview(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2"><Eye size={18} className="text-white" />
                <h2 className="text-sm font-semibold text-white">Vista previa — {preview.number}</h2></div>
              <button onClick={() => setPreview(null)} className="p-1.5 hover:bg-white/20 rounded-lg"><X size={18} className="text-white" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-2">
              {[
                ["N° Sentencia", preview.number],
                ["Accionante", preview.accionante],
                ["Cédula", preview.document],
                ["Entidad", preview.entity],
                ["Juzgado", preview.juzgado],
                ["Fecha asignación", preview.assignedDate],
                ["Estado", preview.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5 border-b border-gray-50">
                  <span className="text-xs text-gray-500 w-32 flex-shrink-0">{k}</span>
                  <span className="text-xs font-medium text-gray-800 text-right">{v}</span>
                </div>
              ))}
              {preview.adminNote && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-medium text-amber-700 mb-1">Nota del administrador</p>
                  <p className="text-xs text-amber-700">{preview.adminNote}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setPreview(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50">Cerrar</button>
              <button onClick={() => { const id = preview.id; setPreview(null); navigate(`/liquidator/process/${id}`); }}
                className="px-4 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs hover:bg-[#1850A0]">
                {preview.status === "Por corregir" ? "Corregir" : "Liquidar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}