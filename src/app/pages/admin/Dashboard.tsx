import { FileText, Clock, CheckCircle2, DollarSign, Building2, MapPin, Layers, ChevronRight } from "lucide-react";
import { StatCard } from "../../components/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";

const OFFICE_INFO = {
  departamento: "Valle del Cauca",
  sector: "Salud",
  oficina: "Oficina Central Sec. Salud VDC",
};

const recentSentences = [
  { id: "S-2026-001", date: "2026-02-20", plaintiff: "Juan Carlos Pérez Morales",  status: "En proceso",   liquidator: "María García"   },
  { id: "S-2026-002", date: "2026-02-18", plaintiff: "Ana María Rodríguez Flórez", status: "Terminada",    liquidator: "Carlos Sánchez" },
  { id: "S-2026-003", date: "2026-02-15", plaintiff: "Carmen Lucía López Restrepo", status: "Pagada",      liquidator: "Laura Díaz"     },
  { id: "S-2026-004", date: "2026-02-12", plaintiff: "Carmen López Restrepo",       status: "En proceso",  liquidator: "Diego Torres"   },
  { id: "S-2026-005", date: "2026-02-10", plaintiff: "Roberto Antonio Castaño",     status: "Por corregir", liquidator: "Pedro Jiménez" },
];

const statusColors: Record<string, string> = {
  "En proceso":   "bg-blue-50 text-[#1C5BB8] border border-blue-200",
  "Terminada":    "bg-green-50 text-[#34A853] border border-green-200",
  "Pagada":       "bg-gray-100 text-gray-700 border border-gray-200",
  "Por corregir": "bg-amber-50 text-amber-700 border border-amber-200",
};

export function AdminDashboard() {
  return (
    <div className="space-y-6">

      {/* ── Identidad de la Oficina ───────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-[#1C5BB8] text-xs font-medium uppercase tracking-widest mb-1">Panel de Administración</p>
            <h1 className="text-xl font-bold text-gray-900 mb-0.5">Dashboard</h1>
            <p className="text-gray-500 text-sm">Vista general del sistema de liquidaciones</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <span>SILTGOV</span>
            <ChevronRight size={13} />
            <span>Admin</span>
            <ChevronRight size={13} />
            <span className="text-gray-700 font-medium">Dashboard</span>
          </div>
        </div>

        {/* Office identity row */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
            <div className="w-7 h-7 bg-[#1C5BB8]/10 rounded-lg flex items-center justify-center">
              <MapPin size={14} className="text-[#1C5BB8]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Departamento</p>
              <p className="text-sm font-semibold text-gray-900">{OFFICE_INFO.departamento}</p>
            </div>
          </div>

          <div className="text-gray-300 text-lg hidden sm:block">›</div>

          <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
            <div className="w-7 h-7 bg-[#1C5BB8]/10 rounded-lg flex items-center justify-center">
              <Layers size={14} className="text-[#1C5BB8]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Sector</p>
              <p className="text-sm font-semibold text-gray-900">{OFFICE_INFO.sector}</p>
            </div>
          </div>

          <div className="text-gray-300 text-lg hidden sm:block">›</div>

          <div className="flex items-center gap-2.5 bg-[#1C5BB8]/5 border border-[#1C5BB8]/20 rounded-xl px-4 py-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 bg-[#1C5BB8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 size={14} className="text-[#1C5BB8]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#1C5BB8]/60 uppercase tracking-wider font-medium">Oficina Actual</p>
              <p className="text-sm font-bold text-[#1C5BB8] truncate">{OFFICE_INFO.oficina}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Sentencias" value="156" icon={FileText} color="blue" />
        <StatCard title="En Proceso"       value="42"  icon={Clock}         color="yellow" />
        <StatCard title="Terminadas"       value="78"  icon={CheckCircle2}  color="green" />
        <StatCard title="Pagadas"          value="36"  icon={DollarSign}    color="gray" />
      </div>

      {/* ── Recent Sentences ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Sentencias</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["N° Sentencia", "Fecha", "Demandante", "Liquidador", "Estado"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentSentences.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1C5BB8]">{s.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.plaintiff}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.liquidator}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full ${statusColors[s.status] ?? ""}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}