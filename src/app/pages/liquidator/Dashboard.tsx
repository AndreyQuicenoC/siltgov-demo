import { useNavigate } from "react-router";
import {
  FileText, CheckCircle2, Clock, AlertCircle,
  DollarSign, ArrowRight, Calendar,
} from "lucide-react";

const LIQUIDATOR_NAME = "María García";

// Summary data
const allSentences = [
  { id: "1",  number: "S-2026-001", completedDate: "",           accionante: "Juan Carlos Pérez Morales",      entity: "Secretaría de Educación",      status: "En proceso",             liquidatedValue: null,        liquidatedRaw: 0,        assignedDate: "2026-02-20" },
  { id: "2",  number: "S-2026-002", completedDate: "2026-02-25", accionante: "Ana María Rodríguez Flórez",     entity: "Secretaría de Salud",          status: "Terminada",              liquidatedValue: "$34.300.000", liquidatedRaw: 34300000, assignedDate: "2026-02-18" },
  { id: "3",  number: "S-2026-003", completedDate: "2026-02-22", accionante: "Carmen Lucía López Restrepo",    entity: "Gobernación Valle del Cauca",  status: "Terminada",              liquidatedValue: "$22.500.000", liquidatedRaw: 22500000, assignedDate: "2026-02-15" },
  { id: "4",  number: "S-2026-005", completedDate: "",           accionante: "Roberto Antonio Castaño",        entity: "Secretaría de Infraestructura", status: "En proceso",            liquidatedValue: null,        liquidatedRaw: 0,        assignedDate: "2026-02-12" },
  { id: "5",  number: "S-2026-006", completedDate: "",           accionante: "María del Pilar Vargas Ruiz",    entity: "Secretaría de Hacienda",       status: "Por corregir",           liquidatedValue: null,        liquidatedRaw: 0,        assignedDate: "2026-02-10" },
  { id: "6",  number: "S-2026-007", completedDate: "",           accionante: "Diego Fernando Torres Salazar",  entity: "Secretaría de Educación",      status: "En proceso",             liquidatedValue: null,        liquidatedRaw: 0,        assignedDate: "2026-02-08" },
  { id: "7",  number: "S-2026-008", completedDate: "2026-02-15", accionante: "Luisa Fernanda Gómez Parra",     entity: "Secretaría de Salud",          status: "Corrección de liquidador", liquidatedValue: "$30.800.000", liquidatedRaw: 30800000, assignedDate: "2026-02-05" },
  { id: "8",  number: "S-2026-009", completedDate: "",           accionante: "Carlos Eduardo Muñoz Ospina",    entity: "Gobernación Valle del Cauca",  status: "En proceso",             liquidatedValue: null,        liquidatedRaw: 0,        assignedDate: "2026-02-03" },
  { id: "9",  number: "S-2026-010", completedDate: "2026-02-10", accionante: "Patricia Elena Herrera Díaz",    entity: "Secretaría de Infraestructura", status: "Terminada",             liquidatedValue: "$16.700.000", liquidatedRaw: 16700000, assignedDate: "2026-01-30" },
  { id: "10", number: "S-2026-011", completedDate: "",           accionante: "Andrés Felipe Sánchez Lozano",   entity: "Secretaría de Educación",      status: "En proceso",             liquidatedValue: null,        liquidatedRaw: 0,        assignedDate: "2026-01-28" },
  { id: "11", number: "S-2025-089", completedDate: "2026-02-05", accionante: "Sandra Milena Ríos Quintero",    entity: "Secretaría de Salud",          status: "Terminada",              liquidatedValue: "$40.200.000", liquidatedRaw: 40200000, assignedDate: "2026-01-25" },
  { id: "12", number: "S-2025-082", completedDate: "",           accionante: "Mauricio Alberto Peña Castro",   entity: "Gobernación Valle del Cauca",  status: "Por corregir",           liquidatedValue: null,        liquidatedRaw: 0,        assignedDate: "2026-01-20" },
  { id: "13", number: "S-2025-075", completedDate: "",           accionante: "Isabel Cristina Vergara Mora",   entity: "Secretaría de Hacienda",       status: "En proceso",             liquidatedValue: null,        liquidatedRaw: 0,        assignedDate: "2026-01-15" },
  { id: "14", number: "S-2025-068", completedDate: "2026-01-30", accionante: "Germán Arturo Cárdenas Nieto",   entity: "Secretaría de Infraestructura", status: "Corrección de liquidador", liquidatedValue: "$35.100.000", liquidatedRaw: 35100000, assignedDate: "2026-01-10" },
  { id: "15", number: "S-2025-060", completedDate: "2026-01-20", accionante: "Claudia Patricia Mejía Torres",  entity: "Secretaría de Educación",      status: "Terminada",              liquidatedValue: "$20.000.000", liquidatedRaw: 20000000, assignedDate: "2026-01-05" },
];

const statusColors: Record<string, string> = {
  "En proceso":             "bg-blue-50 text-[#1C5BB8] border border-blue-200",
  "Terminada":              "bg-green-50 text-[#34A853] border border-green-200",
  "Por corregir":           "bg-amber-50 text-amber-700 border border-amber-200",
  "Corrección de liquidador": "bg-orange-50 text-orange-700 border border-orange-200",
  "Pagada":                 "bg-gray-100 text-gray-700 border border-gray-200",
};

export function LiquidatorDashboard() {
  const navigate = useNavigate();

  const stats = {
    total:       allSentences.length,
    terminadas:  allSentences.filter(s => s.status === "Terminada" || s.status === "Corrección de liquidador").length,
    pendientes:  allSentences.filter(s => s.status === "En proceso" || s.status === "Por corregir").length,
    porCorregir: allSentences.filter(s => s.status === "Corrección de liquidador").length,
    sinLiquidar: allSentences.filter(s => s.status === "En proceso" || s.status === "Por corregir").length,
    valorLiquidado: allSentences.filter(s => s.liquidatedRaw > 0).reduce((acc, s) => acc + s.liquidatedRaw, 0),
  };

  const fmt = (v: number) => "$" + v.toLocaleString("es-CO");

  // Recent liquidated sentences (last 5 completed)
  const recentCompleted = allSentences
    .filter(s => s.completedDate)
    .sort((a, b) => b.completedDate.localeCompare(a.completedDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Inicio</h1>
          <p className="text-sm text-gray-500 mt-0.5">Resumen de actividad — Liquidador {LIQUIDATOR_NAME}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
          <Calendar size={14} className="text-[#1C5BB8]" />
          <span className="text-xs text-[#1C5BB8] font-medium">
            {new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Histórico</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-400 mt-1">Todas las sentencias</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-lg"><FileText size={20} className="text-[#1C5BB8]" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Liquidadas</p>
              <p className="text-2xl font-bold text-[#34A853]">{stats.terminadas}</p>
              <p className="text-xs text-gray-400 mt-1">Históricamente</p>
            </div>
            <div className="p-2.5 bg-green-50 rounded-lg"><CheckCircle2 size={20} className="text-[#34A853]" /></div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#34A853] rounded-full" style={{ width: `${stats.total ? (stats.terminadas / stats.total) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Sin Liquidar</p>
              <p className="text-2xl font-bold text-amber-500">{stats.sinLiquidar}</p>
              <p className="text-xs text-gray-400 mt-1">
                {stats.sinLiquidar - stats.porCorregir} en proceso · {stats.porCorregir} por corregir
              </p>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg"><Clock size={20} className="text-amber-500" /></div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${stats.total ? (stats.sinLiquidar / stats.total) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Corrección de liquidador</p>
              <p className="text-2xl font-bold text-orange-600">{stats.porCorregir}</p>
              <p className="text-xs text-gray-400 mt-1">Requieren revisión</p>
            </div>
            <div className="p-2.5 bg-orange-50 rounded-lg"><AlertCircle size={20} className="text-orange-500" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Valor Total Reportado</p>
              <p className="text-lg font-bold text-[#1C5BB8]">{fmt(stats.valorLiquidado)}</p>
              <p className="text-xs text-gray-400 mt-1">Total reportado en liquidaciones completadas</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-lg"><DollarSign size={20} className="text-[#1C5BB8]" /></div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => navigate("/liquidator/pending")}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between hover:border-[#1C5BB8] hover:bg-blue-50/30 transition-all group text-left">
          <div>
            <p className="text-xs font-semibold text-gray-700 group-hover:text-[#1C5BB8]">Sentencias pendientes</p>
            <p className="text-xs text-gray-400 mt-0.5">{stats.sinLiquidar} esperando liquidación</p>
          </div>
          <ArrowRight size={16} className="text-gray-300 group-hover:text-[#1C5BB8]" />
        </button>
        <button onClick={() => navigate("/liquidator/completed")}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between hover:border-[#34A853] hover:bg-green-50/30 transition-all group text-left">
          <div>
            <p className="text-xs font-semibold text-gray-700 group-hover:text-[#34A853]">Mis liquidaciones</p>
            <p className="text-xs text-gray-400 mt-0.5">{stats.terminadas} liquidaciones completadas</p>
          </div>
          <ArrowRight size={16} className="text-gray-300 group-hover:text-[#34A853]" />
        </button>
      </div>

      {/* Recent liquidated sentences */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Liquidaciones recientes</h2>
          <button onClick={() => navigate("/liquidator/completed")}
            className="text-xs text-[#1C5BB8] hover:underline flex items-center gap-1">
            Ver todas <ArrowRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">N° Sentencia</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Accionante</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Entidad</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Valor Liquidado</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Fecha</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentCompleted.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/70">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-[#1C5BB8]">{s.number}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-medium text-gray-900">{s.accionante}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <p className="text-xs text-gray-500 truncate max-w-[160px]">{s.entity}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold text-gray-800">{s.liquidatedValue || "—"}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-xs text-gray-500">{s.completedDate}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${statusColors[s.status] ?? ""}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}