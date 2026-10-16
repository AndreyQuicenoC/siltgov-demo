import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  CheckCircle, Clock, DollarSign, FileText,
  Upload, X, Search, Filter, Eye, AlertCircle,
  Building2, Calendar, CreditCard, Paperclip,
  ChevronDown, ExternalLink, Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "../../components/Pagination";
import {
  ALL_PAYER_SENTENCES,
  paymentMethods,
  bankEntities,
  type PayerSentence,
  type PaymentStatus,
} from "./payerData";

const ITEMS_PER_PAGE = 5;
const CURRENT_YEAR = 2026;

const statusCfg: Record<
  PaymentStatus,
  { bg: string; text: string; border: string; dot: string; label: string; Icon: React.ElementType }
> = {
  paid:       { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  dot: "bg-[#34A853]", label: "Pagada",       Icon: CheckCircle },
  pending:    { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500", label: "Pendiente",    Icon: Clock },
  to_correct: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500",label: "Por corregir", Icon: AlertCircle },
};

interface PaymentForm {
  date: string; entity: string; method: string; totalPaid: string; file: File | null;
}

const filterOptions: { value: "all" | PaymentStatus; label: string }[] = [
  { value: "all",        label: "Todos"        },
  { value: "paid",       label: "Pagadas"      },
  { value: "pending",    label: "Pendientes"   },
  { value: "to_correct", label: "Por corregir" },
];

export function PayerDashboard() {
  const navigate = useNavigate();

  const [sentences, setSentences] = useState<PayerSentence[]>(
    () => ALL_PAYER_SENTENCES.filter(s => s.year === CURRENT_YEAR)
  );
  const [selectedSentence, setSelectedSentence] = useState<PayerSentence | null>(null);
  const [viewSentence, setViewSentence] = useState<PayerSentence | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | PaymentStatus>("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<PaymentForm>({
    date: "", entity: "", method: "", totalPaid: "", file: null,
  });

  // ── Stats (año 2026) ───────────────────────────────────────────────────────
  const total        = sentences.length;
  const paidCount    = sentences.filter(s => s.status === "paid").length;
  const pendingCount = sentences.filter(s => s.status === "pending").length;
  const tcCount      = sentences.filter(s => s.status === "to_correct").length;
  const totalPendingValue = sentences
    .filter(s => s.status !== "paid")
    .reduce((acc, s) => acc + s.liquidatedRaw, 0);
  const totalPaidValue = sentences
    .filter(s => s.status === "paid")
    .reduce((acc, s) => acc + s.liquidatedRaw, 0);

  const fmt = (v: number) => "$" + v.toLocaleString("es-CO");

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = sentences.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      s.number.toLowerCase().includes(q) ||
      s.plaintiff.toLowerCase().includes(q) ||
      s.entity.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "application/pdf") {
      toast.error("Solo se permiten archivos PDF");
      return;
    }
    setForm(f => ({ ...f, file }));
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.entity || !form.method || !form.totalPaid) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }
    if (!form.file) {
      toast.error("Debes adjuntar el soporte de pago en PDF");
      return;
    }
    setSentences(prev =>
      prev.map(s =>
        s.id === selectedSentence?.id
          ? { ...s, status: "paid" as PaymentStatus, paidDate: form.date, paymentMethod: form.method, payingEntity: form.entity, voucherRef: `COMP-${Date.now().toString().slice(-6)}` }
          : s
      )
    );
    toast.success(`Pago registrado exitosamente para ${selectedSentence?.number}`);
    closePayModal();
  };

  const closePayModal = () => {
    setSelectedSentence(null);
    setForm({ date: "", entity: "", method: "", totalPaid: "", file: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleViewFull = (s: PayerSentence) => {
    navigate(`/payer/view/${s.id}`, { state: { sentence: s } });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Panel del Pagador</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestión y registro de pagos de sentencias — Año {CURRENT_YEAR}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
          <Calendar size={14} className="text-[#1C5BB8]" />
          <span className="text-xs text-[#1C5BB8] font-medium">
            {new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* ── Estadísticas año 2026 ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Sentencias {CURRENT_YEAR}</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-400 mt-1">Asignadas al pagador</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-lg"><FileText size={20} className="text-[#1C5BB8]" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Pagadas {CURRENT_YEAR}</p>
              <p className="text-2xl font-bold text-[#34A853]">{paidCount}</p>
              <p className="text-xs text-gray-400 mt-1">Con soporte cargado</p>
            </div>
            <div className="p-2.5 bg-green-50 rounded-lg"><CheckCircle size={20} className="text-[#34A853]" /></div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#34A853] rounded-full transition-all" style={{ width: `${total ? (paidCount / total) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Sin Pagar {CURRENT_YEAR}</p>
              <p className="text-2xl font-bold text-amber-500">{pendingCount + tcCount}</p>
              <p className="text-xs text-gray-400 mt-1">{pendingCount} pend. · {tcCount} por corregir</p>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg"><Clock size={20} className="text-amber-500" /></div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${total ? ((pendingCount + tcCount) / total) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Valor Pendiente {CURRENT_YEAR}</p>
              <p className="text-lg font-bold text-[#CE1126]">{fmt(totalPendingValue)}</p>
              <p className="text-xs text-gray-400 mt-1">Pagado: {fmt(totalPaidValue)}</p>
            </div>
            <div className="p-2.5 bg-red-50 rounded-lg"><DollarSign size={20} className="text-[#CE1126]" /></div>
          </div>
        </div>
      </div>

      {/* ── Tabla de detalle ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Cabecera */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-900">
            Detalle de sentencias del año {CURRENT_YEAR}
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Buscar sentencia..."
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] w-44"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs transition-colors ${
                  filterStatus !== "all" ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Filter size={13} />
                {filterOptions.find(o => o.value === filterStatus)?.label}
                <ChevronDown size={12} />
              </button>
              {showFilterMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                  <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                    {filterOptions.map(opt => (
                      <button key={opt.value}
                        onClick={() => { setFilterStatus(opt.value); setShowFilterMenu(false); setCurrentPage(1); }}
                        className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${filterStatus === opt.value ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">N° Sentencia</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Demandante</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Entidad</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Valor Liquidado</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Fecha Term.</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">No se encontraron sentencias</td>
                </tr>
              ) : (
                paginated.map(s => {
                  const sc = statusCfg[s.status];
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold text-[#1C5BB8]">{s.number}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-xs font-medium text-gray-900">{s.plaintiff}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <p className="text-xs text-gray-500 truncate max-w-[160px]">{s.entity}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold text-gray-800">{s.liquidatedValue}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="text-xs text-gray-500">{s.completedDate}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${sc.bg} ${sc.text} ${sc.border}`}>
                          <sc.Icon size={11} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                       <div className="flex items-center justify-end gap-1.5">
  <button
    onClick={() => setViewSentence(s)}
    className="p-1.5 text-gray-400 hover:text-[#1C5BB8] hover:bg-blue-50 rounded-lg transition-colors"
    title="Vista rápida"
  >
    <Eye size={14} />
  </button>
  <button
    onClick={() => handleViewFull(s)}
    className="p-1.5 text-gray-400 hover:text-[#1C5BB8] hover:bg-blue-50 rounded-lg transition-colors"
    title="Visualizar"
  >
    <ExternalLink size={14} />
  </button>
  {s.status === "pending" && (
    <button
      onClick={() => setSelectedSentence(s)}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C5BB8] text-white rounded-lg text-xs hover:bg-[#1850A0] transition-colors"
    >
      <Upload size={12} />
      Procesar Pago
    </button>
  )}
  {s.status === "to_correct" && (
    <button
      onClick={() => handleViewFull(s)}
      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-xs hover:bg-orange-100 transition-colors"
    >
      <Edit3 size={12} />
      Corregir
    </button>
  )}
  {s.status === "paid" && (
    <span className="text-xs text-gray-400 italic pr-1">Completado</span>
  )}
</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer + Paginación */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#34A853]" /><span className="text-xs text-gray-500">{paidCount} pagadas</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-xs text-gray-500">{pendingCount} pendientes</span></div>
            {tcCount > 0 && <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400" /><span className="text-xs text-gray-500">{tcCount} por corregir</span></div>}
          </div>
          <p className="text-xs text-gray-400">{filtered.length} de {total} sentencias</p>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
      </div>

      {/* ─── Overlay: Vista rápida ─── */}
      {viewSentence && (() => {
        const sc = statusCfg[viewSentence.status];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewSentence(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
              <div className="bg-gray-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-white" />
                  <h2 className="text-sm font-semibold text-white">Vista rápida — {viewSentence.number}</h2>
                </div>
                <button onClick={() => setViewSentence(null)} className="p-1.5 hover:bg-white/20 rounded-lg">
                  <X size={18} className="text-white" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-6 space-y-3">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${sc.bg} ${sc.border}`}>
                  <sc.Icon size={14} className={sc.text} />
                  <span className={`text-xs font-semibold ${sc.text}`}>{sc.label}</span>
                  {viewSentence.status === "to_correct" && <span className="text-xs text-orange-600 ml-auto">Requiere corrección</span>}
                </div>
                {[
                  { label: "N° Sentencia",    value: viewSentence.number },
                  { label: "Demandante",       value: viewSentence.plaintiff },
                  { label: "Entidad",          value: viewSentence.entity },
                  { label: "Liquidador",       value: viewSentence.liquidator },
                  { label: "Valor Liquidado",  value: viewSentence.liquidatedValue, highlight: true },
                  { label: "Fecha Terminada",  value: viewSentence.completedDate },
                  ...(viewSentence.status === "paid" ? [
                    { label: "Fecha de Pago",    value: viewSentence.paidDate! },
                    { label: "Entidad Bancaria", value: viewSentence.payingEntity! },
                    { label: "Método de Pago",   value: viewSentence.paymentMethod! },
                    { label: "Comprobante",      value: viewSentence.voucherRef! },
                  ] : []),
                  ...(viewSentence.status === "to_correct" && viewSentence.correctionNote ? [
                    { label: "Nota corrección",  value: viewSentence.correctionNote, warning: true },
                  ] : []),
                ].map(({ label, value, highlight, warning }) => (
                  <div key={label} className="flex justify-between items-start py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-500 w-36 flex-shrink-0">{label}</span>
                    <span className={`text-xs font-medium text-right break-words max-w-[180px] ${highlight ? "text-[#1C5BB8]" : (warning ? "text-orange-700" : "text-gray-800")}`}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center flex-shrink-0">
                <div className="flex gap-2">
                  {viewSentence.status === "pending" && (
                    <button onClick={() => { setViewSentence(null); setSelectedSentence(viewSentence); }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs hover:bg-[#1850A0]">
                      <Upload size={13} /> Procesar Pago
                    </button>
                  )}
                  {viewSentence.status === "to_correct" && (
                    <button onClick={() => { setViewSentence(null); handleViewFull(viewSentence); }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 text-white rounded-lg text-xs hover:bg-orange-700">
                      <Edit3 size={13} /> Corregir
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setViewSentence(null); handleViewFull(viewSentence); }}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs hover:bg-gray-50">
                    <ExternalLink size={12} /> Ver completo
                  </button>
                  <button onClick={() => setViewSentence(null)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50">
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── Overlay: Procesar Pago ─── */}
      {selectedSentence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closePayModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#1C5BB8] px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                    <Upload size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Registrar Soporte de Pago</h2>
                    <p className="text-xs text-blue-200">Sentencia {selectedSentence.number}</p>
                  </div>
                </div>
                <button type="button" aria-label="Cerrar registro de soporte de pago" title="Cerrar" onClick={closePayModal} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                  <X size={18} className="text-white" aria-hidden />
                </button>
              </div>
            </div>
            {/* Resumen */}
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex flex-wrap gap-4 flex-shrink-0">
              <div>
                <p className="text-xs text-blue-500 mb-0.5">Demandante</p>
                <p className="text-xs font-medium text-gray-800">{selectedSentence.plaintiff}</p>
              </div>
              <div>
                <p className="text-xs text-blue-500 mb-0.5">Entidad</p>
                <p className="text-xs font-medium text-gray-800">{selectedSentence.entity}</p>
              </div>
              <div>
                <p className="text-xs text-blue-500 mb-0.5">Valor a Pagar</p>
                <p className="text-xs font-bold text-[#1C5BB8]">{selectedSentence.liquidatedValue}</p>
              </div>
            </div>
            {/* Formulario - scrollable */}
            <div className="overflow-y-auto flex-1">
              <form id="pay-form" onSubmit={handleSubmitPayment} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#1C5BB8]" />Fecha de Pago <span className="text-red-500">*</span></span>
                  </label>
                  <input type="date" required value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Building2 size={13} className="text-[#1C5BB8]" />Entidad Bancaria <span className="text-red-500">*</span></span>
                  </label>
                  <select required value={form.entity} onChange={e => setForm(f => ({ ...f, entity: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] focus:border-transparent bg-white">
                    <option value="">Selecciona la entidad bancaria...</option>
                    {bankEntities.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><CreditCard size={13} className="text-[#1C5BB8]" />Método de Pago <span className="text-red-500">*</span></span>
                  </label>
                  <select required value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] focus:border-transparent bg-white">
                    <option value="">Selecciona el método de pago...</option>
                    {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><DollarSign size={13} className="text-[#1C5BB8]" />Total Pagado <span className="text-red-500">*</span></span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="text" required value={form.totalPaid}
                      onChange={e => { const v = e.target.value.replace(/[^0-9.]/g, ""); setForm(f => ({ ...f, totalPaid: v })); }}
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Valor referencia: <span className="font-medium text-gray-600">{selectedSentence.liquidatedValue}</span></p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Paperclip size={13} className="text-[#1C5BB8]" />Soporte de Pago (PDF) <span className="text-red-500">*</span></span>
                  </label>
                  <div onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${form.file ? "border-[#34A853] bg-green-50" : "border-gray-300 hover:border-[#5B9BDE] hover:bg-blue-50/30"}`}>
                    <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                    {form.file ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle size={18} className="text-[#34A853]" />
                        <div className="text-left">
                          <p className="text-xs font-medium text-[#34A853]">{form.file.name}</p>
                          <p className="text-xs text-gray-400">{(form.file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button type="button" onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, file: null })); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="ml-auto p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs text-gray-500">Haz clic para subir el comprobante</p>
                        <p className="text-xs text-gray-400 mt-0.5">Solo archivos PDF</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Una vez registrado el pago, la sentencia quedará marcada como pagada y no podrá revertirse.</p>
                </div>
              </form>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <button type="button" onClick={closePayModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button form="pay-form" type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-[#34A853] text-white rounded-lg text-sm hover:bg-[#2d9247] transition-colors shadow-sm">
                <Upload size={15} />
                Registrar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
