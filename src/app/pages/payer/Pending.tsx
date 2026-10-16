import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search, Filter, ChevronDown, X, Clock, AlertCircle, CreditCard,
  Calendar, Eye, FileText, Edit3, Building2,
} from "lucide-react";
import { Pagination } from "../../components/Pagination";
import { ALL_PAYER_SENTENCES, type PayerSentence, type PaymentStatus } from "./payerData";

const ITEMS_PER_PAGE = 8;
const CURRENT_YEAR = 2026;

const statusCfg: Record<Exclude<PaymentStatus, "paid">, { bg: string; text: string; border: string; label: string; Icon: React.ElementType }> = {
  pending:    { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  label: "Pendiente",    Icon: Clock },
  to_correct: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", label: "Por corregir", Icon: AlertCircle },
};

export function PayerPending() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "to_correct">("all");
  const [filterEntity, setFilterEntity] = useState("Todas");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [preview, setPreview] = useState<PayerSentence | null>(null);

  const sentences = useMemo(
    () => ALL_PAYER_SENTENCES.filter(s => s.year === CURRENT_YEAR && s.status !== "paid").sort((a, b) => a.plaintiff.localeCompare(b.plaintiff)),
    []
  );

  const entityOptions = Array.from(new Set(sentences.map(s => s.entity)));

  const filtered = useMemo(() => sentences.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.number.toLowerCase().includes(q) || s.plaintiff.toLowerCase().includes(q) || s.entity.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    const matchEntity = filterEntity === "Todas" || s.entity === filterEntity;
    const matchFrom = !filterDateFrom || s.completedDate >= filterDateFrom;
    const matchTo = !filterDateTo || s.completedDate <= filterDateTo;
    return matchSearch && matchStatus && matchEntity && matchFrom && matchTo;
  }), [sentences, search, filterStatus, filterEntity, filterDateFrom, filterDateTo]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = {
    total: sentences.length,
    pending: sentences.filter(s => s.status === "pending").length,
    toCorrect: sentences.filter(s => s.status === "to_correct").length,
    valor: sentences.reduce((acc, s) => acc + s.liquidatedRaw, 0),
  };

  const fmt = (v: number) => "$" + v.toLocaleString("es-CO");

  const clearFilters = () => {
    setSearch(""); setFilterStatus("all"); setFilterEntity("Todas");
    setFilterDateFrom(""); setFilterDateTo(""); setCurrentPage(1);
  };

  const activeFilters = [filterStatus !== "all", filterEntity !== "Todas", !!filterDateFrom, !!filterDateTo].filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sentencias Pendientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sentencias liquidadas que aún no han sido pagadas — Año {CURRENT_YEAR}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
          <Calendar size={14} className="text-[#1C5BB8]" />
          <span className="text-xs text-[#1C5BB8] font-medium">{new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total pendientes", value: stats.total, color: "border-l-[#1C5BB8]", text: "text-[#1C5BB8]" },
          { label: "Pendientes",       value: stats.pending, color: "border-l-amber-400", text: "text-amber-600" },
          { label: "Por corregir",     value: stats.toCorrect, color: "border-l-orange-400", text: "text-orange-700" },
          { label: "Valor total",      value: fmt(stats.valor), color: "border-l-[#CE1126]", text: "text-[#CE1126]", small: true },
        ].map(({ label, value, color, text, small }) => (
          <div key={label} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${color} shadow-sm p-4`}>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`${small ? "text-sm" : "text-2xl"} font-bold ${text}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Buscar por accionante, sentencia o entidad..." className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as any); setCurrentPage(1); }}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white">
                  <option value="all">Todos</option><option value="pending">Pendiente</option><option value="to_correct">Por corregir</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Entidad</label>
                <select value={filterEntity} onChange={e => { setFilterEntity(e.target.value); setCurrentPage(1); }}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white">
                  <option>Todas</option>{entityOptions.map(en => <option key={en}>{en}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Calendar size={11} /> Desde</label>
                <input type="date" value={filterDateFrom} onChange={e => { setFilterDateFrom(e.target.value); setCurrentPage(1); }} className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Calendar size={11} /> Hasta</label>
                <input type="date" value={filterDateTo} onChange={e => { setFilterDateTo(e.target.value); setCurrentPage(1); }} className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg" />
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Accionante</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Entidad</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">N° Sentencia</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Valor</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Terminada</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={32} className="text-gray-200" />
                    <p className="text-sm text-gray-400">Sin sentencias pendientes</p>
                  </div>
                </td></tr>
              ) : paginated.map(s => {
                const sc = statusCfg[s.status as "pending" | "to_correct"]; const Sc = sc.Icon;
                const isCorr = s.status === "to_correct";
                return (
                  <tr key={s.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-gray-900">{s.plaintiff}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[180px] flex items-center gap-1"><Building2 size={10} /> {s.entity}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-xs text-gray-600">{s.entity}</p>
                    </td>
                    <td className="px-5 py-3.5"><span className="text-xs font-bold text-[#1C5BB8]">{s.number}</span></td>
                    <td className="px-5 py-3.5"><span className="text-xs font-semibold text-gray-800">{s.liquidatedValue}</span></td>
                    <td className="px-5 py-3.5 hidden lg:table-cell"><span className="text-xs text-gray-500">{s.completedDate}</span></td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${sc.bg} ${sc.text} ${sc.border}`}>
                        <Sc size={10} /> {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setPreview(s)} className="p-1.5 text-gray-400 hover:text-[#1C5BB8] hover:bg-blue-50 rounded-lg" title="Vista previa"><Eye size={14} /></button>
                        <button onClick={() => navigate(`/payer/register/${s.id}`)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${isCorr ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200" : "bg-[#1C5BB8] text-white hover:bg-[#1850A0]"}`}>
                          {isCorr ? <><Edit3 size={13} /> Corregir</> : <><CreditCard size={13} /> Pagar</>}
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
                ["Accionante", preview.plaintiff],
                ["Entidad", preview.entity],
                ["Liquidador", preview.liquidator],
                ["Juzgado", preview.juzgado || "—"],
                ["Tipo Obligación", preview.tipoObligacion || "—"],
                ["Capital Base", preview.capitalBase || "—"],
                ["Intereses", preview.interesesCausados || "—"],
                ["Costas", preview.costas || "—"],
                ["Valor Liquidado", preview.liquidatedValue],
                ["Fecha Terminada", preview.completedDate],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5 border-b border-gray-50">
                  <span className="text-xs text-gray-500 w-32 flex-shrink-0">{k}</span>
                  <span className="text-xs font-medium text-gray-800 text-right">{v}</span>
                </div>
              ))}
              {preview.correctionNote && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-xs font-medium text-orange-700 mb-1">Nota de corrección</p>
                  <p className="text-xs text-orange-700">{preview.correctionNote}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setPreview(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50">Cerrar</button>
              <button onClick={() => { const id = preview.id; setPreview(null); navigate(`/payer/register/${id}`); }}
                className="px-4 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs hover:bg-[#1850A0]">
                {preview.status === "to_correct" ? "Corregir" : "Pagar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
