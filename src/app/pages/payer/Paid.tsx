import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search, Filter, ChevronDown, X, CheckCircle, FileText,
  Calendar, Eye, ArrowRight,
} from "lucide-react";
import { Pagination } from "../../components/Pagination";
import { ALL_PAYER_SENTENCES, type PayerSentence } from "./payerData";

const ITEMS_PER_PAGE = 8;

export function PayerPaid() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("Todos");
  const [filterMethod, setFilterMethod] = useState("Todos");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [preview, setPreview] = useState<PayerSentence | null>(null);

  const sentences = useMemo(
    () =>
      ALL_PAYER_SENTENCES.filter(s => s.status === "paid").sort(
        (a, b) => (b.paidDate || "").localeCompare(a.paidDate || "")
      ),
    []
  );

  const yearOptions = Array.from(new Set(sentences.map(s => String(s.year)))).sort().reverse();
  const methodOptions = Array.from(new Set(sentences.map(s => s.paymentMethod || "—")));

  const filtered = useMemo(
    () =>
      sentences.filter(s => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          s.number.toLowerCase().includes(q) ||
          s.plaintiff.toLowerCase().includes(q) ||
          (s.voucherRef || "").toLowerCase().includes(q);
        const matchYear = filterYear === "Todos" || String(s.year) === filterYear;
        const matchMethod = filterMethod === "Todos" || s.paymentMethod === filterMethod;
        const matchFrom = !filterDateFrom || (s.paidDate && s.paidDate >= filterDateFrom);
        const matchTo = !filterDateTo || (s.paidDate && s.paidDate <= filterDateTo);
        return matchSearch && matchYear && matchMethod && matchFrom && matchTo;
      }),
    [sentences, search, filterYear, filterMethod, filterDateFrom, filterDateTo]
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = {
    total: sentences.length,
    valor: sentences.reduce((acc, s) => acc + s.liquidatedRaw, 0),
    thisYear: sentences.filter(s => s.year === 2026).length,
    valorYear: sentences
      .filter(s => s.year === 2026)
      .reduce((acc, s) => acc + s.liquidatedRaw, 0),
  };

  const fmt = (v: number) => "$" + v.toLocaleString("es-CO");

  const clearFilters = () => {
    setSearch("");
    setFilterYear("Todos");
    setFilterMethod("Todos");
    setFilterDateFrom("");
    setFilterDateTo("");
    setCurrentPage(1);
  };

  const activeFilters = [
    filterYear !== "Todos",
    filterMethod !== "Todos",
    !!filterDateFrom,
    !!filterDateTo,
  ].filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sentencias Pagadas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Histórico de pagos registrados con sus soportes</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg">
          <CheckCircle size={14} className="text-[#34A853]" aria-hidden="true" />
          <span className="text-xs text-[#34A853] font-medium">{stats.total} pagos registrados</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total pagadas",      value: stats.total,          color: "border-l-[#34A853]", text: "text-[#34A853]" },
          { label: "Pagadas 2026",       value: stats.thisYear,       color: "border-l-[#1C5BB8]", text: "text-[#1C5BB8]" },
          { label: "Valor total pagado", value: fmt(stats.valor),     color: "border-l-[#FBBC05]", text: "text-gray-800",  small: true },
          { label: "Valor pagado 2026",  value: fmt(stats.valorYear), color: "border-l-[#34A853]", text: "text-[#34A853]", small: true },
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
                placeholder="Buscar por accionante, sentencia o comprobante..."
                aria-label="Buscar sentencias pagadas"
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
              className={`relative flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs ${
                showFilters || activeFilters ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter size={13} aria-hidden="true" /> Filtros
              <ChevronDown size={11} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} aria-hidden="true" />
              {activeFilters > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1C5BB8] text-white rounded-full text-[9px] flex items-center justify-center font-bold"
                  aria-label={`${activeFilters} filtros activos`}
                >
                  {activeFilters}
                </span>
              )}
            </button>
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                <X size={12} /> Limpiar filtros
              </button>
            )}
            <span className="ml-auto text-xs text-gray-400" aria-live="polite">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1" htmlFor="filter-year">Año</label>
                <select id="filter-year" value={filterYear} onChange={e => { setFilterYear(e.target.value); setCurrentPage(1); }} className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white">
                  <option>Todos</option>
                  {yearOptions.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1" htmlFor="filter-method">Método</label>
                <select id="filter-method" value={filterMethod} onChange={e => { setFilterMethod(e.target.value); setCurrentPage(1); }} className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white">
                  <option>Todos</option>
                  {methodOptions.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1" htmlFor="filter-from">
                  <Calendar size={11} aria-hidden="true" /> Pago desde
                </label>
                <input id="filter-from" type="date" value={filterDateFrom} onChange={e => { setFilterDateFrom(e.target.value); setCurrentPage(1); }} className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1" htmlFor="filter-to">
                  <Calendar size={11} aria-hidden="true" /> Pago hasta
                </label>
                <input id="filter-to" type="date" value={filterDateTo} onChange={e => { setFilterDateTo(e.target.value); setCurrentPage(1); }} className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg" />
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto" role="region" aria-label="Tabla de sentencias pagadas">
          <table className="w-full">
            <caption className="sr-only">Sentencias con pagos registrados y sus detalles</caption>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">N° Sentencia</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Accionante</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Comprobante</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Valor</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Método</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Fecha pago</th>
                <th scope="col" className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={32} className="text-gray-200" aria-hidden="true" />
                      <p className="text-sm text-gray-400">Sin pagos registrados</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-[#1C5BB8]">{s.number}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-gray-900">{s.plaintiff}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">{s.entity}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-xs font-mono text-gray-600">{s.voucherRef}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold text-[#34A853]">{s.liquidatedValue}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-600">{s.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">{s.paidDate}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick preview (eye icon) */}
                        <button
                          onClick={() => setPreview(s)}
                          className="p-1.5 text-gray-400 hover:text-[#1C5BB8] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Vista previa rápida"
                          aria-label={`Vista previa de ${s.number}`}
                        >
                          <Eye size={14} aria-hidden="true" />
                        </button>
                        {/* Ver al detalle — navega a ViewPayment */}
                        <button
                          onClick={() => navigate(`/payer/view/${s.id}`, { state: { sentence: s } })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1C5BB8] text-white hover:bg-[#1850A0] transition-colors"
                          aria-label={`Ver detalle de ${s.number}`}
                        >
                          <ArrowRight size={13} aria-hidden="true" /> Ver al detalle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
      </div>

      {/* Quick-view preview overlay */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="preview-paid-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPreview(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="bg-[#34A853] px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-white" aria-hidden="true" />
                <h2 id="preview-paid-title" className="text-sm font-semibold text-white">
                  Pago — {preview.number}
                </h2>
              </div>
              <button onClick={() => setPreview(null)} className="p-1.5 hover:bg-white/20 rounded-lg" aria-label="Cerrar vista previa">
                <X size={18} className="text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-2">
              {[
                ["N° Sentencia", preview.number],
                ["Accionante", preview.plaintiff],
                ["Entidad demandada", preview.entity],
                ["Liquidador", preview.liquidator],
                ["Valor Liquidado", preview.liquidatedValue],
                ["Fecha de Pago", preview.paidDate || "—"],
                ["Entidad Bancaria", preview.payingEntity || "—"],
                ["Método de Pago", preview.paymentMethod || "—"],
                ["Comprobante", preview.voucherRef || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5 border-b border-gray-50">
                  <span className="text-xs text-gray-500 w-32 flex-shrink-0">{k}</span>
                  <span className="text-xs font-medium text-gray-800 text-right">{v}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => { const id = preview.id; const s = preview; setPreview(null); navigate(`/payer/view/${id}`, { state: { sentence: s } }); }}
                className="px-4 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs hover:bg-[#1850A0] inline-flex items-center gap-1.5"
              >
                <ArrowRight size={13} aria-hidden="true" /> Ver al detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
