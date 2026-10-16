import { useNavigate } from "react-router";
import {
  CheckCircle, Clock, DollarSign, FileText,
  Eye, ArrowRight, Calendar,
} from "lucide-react";
import {
  ALL_PAYER_SENTENCES,
} from "./payerData";

export function PayerHistory() {
  const navigate = useNavigate();

  // ── Stats históricas (todos los años) ─────────────────────────────────────
  const total         = ALL_PAYER_SENTENCES.length;
  const paidCount     = ALL_PAYER_SENTENCES.filter(s => s.status === "paid").length;
  const unpaidCount   = ALL_PAYER_SENTENCES.filter(s => s.status !== "paid").length;
  const tcCount       = ALL_PAYER_SENTENCES.filter(s => s.status === "to_correct").length;
  const pendingCount  = ALL_PAYER_SENTENCES.filter(s => s.status === "pending").length;
  const totalPending  = ALL_PAYER_SENTENCES.filter(s => s.status !== "paid").reduce((a, s) => a + s.liquidatedRaw, 0);
  const totalPaid     = ALL_PAYER_SENTENCES.filter(s => s.status === "paid").reduce((a, s) => a + s.liquidatedRaw, 0);

  const fmt = (v: number) => "$" + v.toLocaleString("es-CO");

  // Recent paid sentences (last 5)
  const recentPaid = ALL_PAYER_SENTENCES
    .filter(s => s.status === "paid")
    .sort((a, b) => (b.paidDate || "").localeCompare(a.paidDate || ""))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Inicio</h1>
          <p className="text-sm text-gray-500 mt-0.5">Resumen general de sentencias y pagos</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
          <Calendar size={14} className="text-[#1C5BB8]" />
          <span className="text-xs text-[#1C5BB8] font-medium">
            {new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* ── Estadísticas históricas ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Histórico</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-400 mt-1">Todos los años</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-lg"><FileText size={20} className="text-[#1C5BB8]" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Pagadas</p>
              <p className="text-2xl font-bold text-[#34A853]">{paidCount}</p>
              <p className="text-xs text-gray-400 mt-1">Históricamente</p>
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
              <p className="text-xs text-gray-500 mb-1">Sin Pagar</p>
              <p className="text-2xl font-bold text-amber-500">{unpaidCount}</p>
              <p className="text-xs text-gray-400 mt-1">{pendingCount} pend. · {tcCount} por corregir</p>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg"><Clock size={20} className="text-amber-500" /></div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${total ? (unpaidCount / total) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Valor Pendiente</p>
              <p className="text-lg font-bold text-[#CE1126]">{fmt(totalPending)}</p>
              <p className="text-xs text-gray-400 mt-1">Pagado: {fmt(totalPaid)}</p>
            </div>
            <div className="p-2.5 bg-red-50 rounded-lg"><DollarSign size={20} className="text-[#CE1126]" /></div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => navigate("/payer/pending")}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between hover:border-[#1C5BB8] hover:bg-blue-50/30 transition-all group text-left">
          <div>
            <p className="text-xs font-semibold text-gray-700 group-hover:text-[#1C5BB8]">Sentencias pendientes</p>
            <p className="text-xs text-gray-400 mt-0.5">{unpaidCount} sin pagar</p>
          </div>
          <ArrowRight size={16} className="text-gray-300 group-hover:text-[#1C5BB8]" />
        </button>
        <button onClick={() => navigate("/payer/paid")}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between hover:border-[#34A853] hover:bg-green-50/30 transition-all group text-left">
          <div>
            <p className="text-xs font-semibold text-gray-700 group-hover:text-[#34A853]">Sentencias pagadas</p>
            <p className="text-xs text-gray-400 mt-0.5">{paidCount} pagos registrados</p>
          </div>
          <ArrowRight size={16} className="text-gray-300 group-hover:text-[#34A853]" />
        </button>
      </div>

      {/* Recent paid sentences */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Sentencias pagadas recientemente</h2>
          <button onClick={() => navigate("/payer/paid")}
            className="text-xs text-[#1C5BB8] hover:underline flex items-center gap-1">
            Ver todas <ArrowRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">N° Sentencia</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Demandante</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Entidad</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Valor</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Fecha Pago</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Ver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentPaid.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">Sin pagos recientes</td></tr>
              ) : recentPaid.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/70">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-[#1C5BB8]">{s.number}</span>
                    {s.voucherRef && <p className="text-[10px] text-gray-400 mt-0.5">{s.voucherRef}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-medium text-gray-900">{s.plaintiff}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <p className="text-xs text-gray-500 truncate max-w-[160px]">{s.entity}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold text-[#34A853]">{s.liquidatedValue}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-xs text-gray-500">{s.paidDate}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => navigate(`/payer/view/${s.id}`, { state: { sentence: s } })}
                      className="p-1.5 text-gray-400 hover:text-[#1C5BB8] hover:bg-blue-50 rounded-lg"
                      title="Ver detalle"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Summary footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#34A853]" /><span className="text-xs text-gray-500">{paidCount} pagadas</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-xs text-gray-500">{pendingCount} pendientes</span></div>
          {tcCount > 0 && <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400" /><span className="text-xs text-gray-500">{tcCount} por corregir</span></div>}
        </div>
      </div>
    </div>
  );
}
