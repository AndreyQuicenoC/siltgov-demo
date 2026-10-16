import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, ScatterChart, Scatter, ZAxis,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  BarChart2, PieChart as PieChartIcon, TrendingUp, Filter, Calendar, X,
  Activity, Users, CreditCard, Clock, CheckCircle2, Award, Target, Zap,
  AlertTriangle,
} from "lucide-react";

// ─── Color palette ─────────────────────────────────────────────────────────────
const C = {
  blue:   "#1C5BB8",
  green:  "#34A853",
  gold:   "#FBBC05",
  red:    "#EA4335",
  violet: "#7C3AED",
  cyan:   "#0EA5E9",
  orange: "#F97316",
  teal:   "#14B8A6",
};
const PIE_COLORS = [C.blue, C.green, C.gold, C.red, C.violet, C.cyan];

// ─── Data ──────────────────────────────────────────────────────────────────────
const ALL_MONTHLY = [
  { month: "Ene", date: "2026-01", creadas: 12, terminadas: 8,  pagadas: 5  },
  { month: "Feb", date: "2026-02", creadas: 15, terminadas: 10, pagadas: 7  },
  { month: "Mar", date: "2026-03", creadas: 18, terminadas: 14, pagadas: 9  },
  { month: "Abr", date: "2026-04", creadas: 14, terminadas: 12, pagadas: 8  },
  { month: "May", date: "2026-05", creadas: 20, terminadas: 15, pagadas: 11 },
  { month: "Jun", date: "2026-06", creadas: 16, terminadas: 13, pagadas: 10 },
];

const ALL_AVG_TIME = [
  { month: "Ene", date: "2026-01", terminada: 22, pagada: 14, completo: 36 },
  { month: "Feb", date: "2026-02", terminada: 20, pagada: 13, completo: 33 },
  { month: "Mar", date: "2026-03", terminada: 18, pagada: 11, completo: 29 },
  { month: "Abr", date: "2026-04", terminada: 19, pagada: 12, completo: 31 },
  { month: "May", date: "2026-05", terminada: 17, pagada: 10, completo: 27 },
  { month: "Jun", date: "2026-06", terminada: 15, pagada: 9,  completo: 24 },
];

const ALL_LIQUIDATOR_MONTHLY = [
  { month: "Ene", date: "2026-01", "María García": 4, "Carlos Sánchez": 3, "Laura Díaz": 3, "Pedro Jiménez": 2 },
  { month: "Feb", date: "2026-02", "María García": 5, "Carlos Sánchez": 3, "Laura Díaz": 4, "Pedro Jiménez": 3 },
  { month: "Mar", date: "2026-03", "María García": 6, "Carlos Sánchez": 4, "Laura Díaz": 5, "Pedro Jiménez": 3 },
  { month: "Abr", date: "2026-04", "María García": 5, "Carlos Sánchez": 3, "Laura Díaz": 4, "Pedro Jiménez": 2 },
  { month: "May", date: "2026-05", "María García": 7, "Carlos Sánchez": 5, "Laura Díaz": 5, "Pedro Jiménez": 3 },
  { month: "Jun", date: "2026-06", "María García": 6, "Carlos Sánchez": 4, "Laura Díaz": 5, "Pedro Jiménez": 3 },
];

const ALL_PAYER_MONTHLY = [
  { month: "Ene", date: "2026-01", "Carlos Torres": 5, "Pedro Gómez": 4, "Ana Martínez": 3, "Claudia Ruiz": 2 },
  { month: "Feb", date: "2026-02", "Carlos Torres": 7, "Pedro Gómez": 5, "Ana Martínez": 4, "Claudia Ruiz": 2 },
  { month: "Mar", date: "2026-03", "Carlos Torres": 8, "Pedro Gómez": 6, "Ana Martínez": 5, "Claudia Ruiz": 3 },
  { month: "Abr", date: "2026-04", "Carlos Torres": 6, "Pedro Gómez": 5, "Ana Martínez": 4, "Claudia Ruiz": 2 },
  { month: "May", date: "2026-05", "Carlos Torres": 9, "Pedro Gómez": 6, "Ana Martínez": 5, "Claudia Ruiz": 4 },
  { month: "Jun", date: "2026-06", "Carlos Torres": 8, "Pedro Gómez": 7, "Ana Martínez": 5, "Claudia Ruiz": 3 },
];

const TOP_LIQUIDATORS = [
  { name: "Laura Díaz",      casos: 15, fill: C.blue   },
  { name: "María García",    casos: 12, fill: C.green  },
  { name: "Carlos Sánchez",  casos: 8,  fill: C.gold   },
  { name: "Pedro Jiménez",   casos: 6,  fill: C.violet },
  { name: "Claudia Morales", casos: 4,  fill: C.cyan   },
];

const TOP_PAYERS = [
  { name: "Pedro Gómez",    pagos: 31, fill: C.green  },
  { name: "Carlos Torres",  pagos: 24, fill: C.blue   },
  { name: "Ana Martínez",   pagos: 18, fill: C.gold   },
  { name: "Claudia Ruiz",   pagos: 12, fill: C.violet },
  { name: "Jaime Soto",     pagos: 9,  fill: C.teal   },
];

const SCATTER_DATA_LIQ = [
  { name: "María García",   role: "Liquidador", casos: 12, tiempo: 16 },
  { name: "Carlos Sánchez", role: "Liquidador", casos: 8,  tiempo: 18 },
  { name: "Laura Díaz",     role: "Liquidador", casos: 15, tiempo: 14 },
  { name: "Pedro Jiménez",  role: "Liquidador", casos: 6,  tiempo: 21 },
  { name: "Claudia Morales",role: "Liquidador", casos: 10, tiempo: 17 },
];
const SCATTER_DATA_PAY = [
  { name: "Carlos Torres", role: "Pagador", casos: 24, tiempo: 9  },
  { name: "Pedro Gómez",   role: "Pagador", casos: 31, tiempo: 8  },
  { name: "Ana Martínez",  role: "Pagador", casos: 18, tiempo: 11 },
  { name: "Claudia Ruiz",  role: "Pagador", casos: 12, tiempo: 12 },
  { name: "Jaime Soto",    role: "Pagador", casos: 9,  tiempo: 14 },
];

// ─── Datos de correcciones ────────────────────────────────────────────────────
const LIQUIDATOR_CORRECTIONS = [
  { name: "María García",   corrections: 3, fill: C.blue   },
  { name: "Carlos Sánchez", corrections: 2, fill: C.green  },
  { name: "Laura Díaz",     corrections: 3, fill: C.gold   },
  { name: "Pedro Jiménez",  corrections: 2, fill: C.violet },
];

const PAYER_CORRECTIONS = [
  { name: "Carlos Torres", corrections: 2, fill: C.blue   },
  { name: "Pedro Gómez",   corrections: 1, fill: C.green  },
  { name: "Ana Martínez",  corrections: 3, fill: C.gold   },
  { name: "Claudia Ruiz",  corrections: 2, fill: C.violet },
  { name: "Jaime Soto",    corrections: 1, fill: C.cyan   },
];

const RADAR_DATA = [
  { subject: "Ene", "María García": 4, "Carlos Sánchez": 3, "Laura Díaz": 3, "Pedro Jiménez": 2 },
  { subject: "Feb", "María García": 5, "Carlos Sánchez": 3, "Laura Díaz": 4, "Pedro Jiménez": 3 },
  { subject: "Mar", "María García": 6, "Carlos Sánchez": 4, "Laura Díaz": 5, "Pedro Jiménez": 3 },
  { subject: "Abr", "María García": 5, "Carlos Sánchez": 3, "Laura Díaz": 4, "Pedro Jiménez": 2 },
  { subject: "May", "María García": 7, "Carlos Sánchez": 5, "Laura Díaz": 5, "Pedro Jiménez": 3 },
  { subject: "Jun", "María García": 6, "Carlos Sánchez": 4, "Laura Díaz": 5, "Pedro Jiménez": 3 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeImprovement(data: typeof ALL_AVG_TIME) {
  return data.slice(1).map((curr, i) => {
    const prev = data[i];
    const pct = (v: number, p: number) => +((p - v) / p * 100).toFixed(1);
    return {
      period: `${prev.month}→${curr.month}`,
      terminada: pct(curr.terminada, prev.terminada),
      pagada:    pct(curr.pagada,    prev.pagada),
      completo:  pct(curr.completo,  prev.completo),
    };
  });
}

function sumByEmployee(data: typeof ALL_LIQUIDATOR_MONTHLY, keys: string[]) {
  return keys.map((k, i) => ({
    name: k, total: data.reduce((a, b) => a + ((b as any)[k] ?? 0), 0), fill: PIE_COLORS[i % PIE_COLORS.length],
  }));
}

// ─── Sub-components ────────────────────────────────────────────────────────────
type ChartType = "bar" | "pie" | "line" | "area" | "radar";

function ChartTypeSel({ options, value, onChange }: { options: { id: ChartType; label: string; Icon: LucideIcon }[]; value: ChartType; onChange: (v: ChartType) => void }) {
  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
      {options.map(({ id, label, Icon }) => (
        <button key={id} onClick={() => onChange(id)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition-all ${value === id ? "bg-white text-[#1C5BB8] shadow-sm font-semibold" : "text-gray-500 hover:text-gray-700"}`}>
          <Icon size={12} /> {label}
        </button>
      ))}
    </div>
  );
}

const CHART_BAR_PIE_LINE = [
  { id: "bar"  as ChartType, label: "Barras",  Icon: BarChart2    },
  { id: "pie"  as ChartType, label: "Pastel",  Icon: PieChartIcon },
  { id: "line" as ChartType, label: "Líneas",  Icon: TrendingUp   },
];
const CHART_BAR_PIE_AREA = [
  { id: "bar"  as ChartType, label: "Barras",  Icon: BarChart2    },
  { id: "pie"  as ChartType, label: "Pastel",  Icon: PieChartIcon },
  { id: "area" as ChartType, label: "Área",    Icon: Activity     },
];
const CHART_LINE_BAR_RADAR = [
  { id: "line"  as ChartType, label: "Líneas",  Icon: TrendingUp   },
  { id: "bar"   as ChartType, label: "Barras",  Icon: BarChart2    },
  { id: "radar" as ChartType, label: "Radar",   Icon: Target       },
];
const CHART_BAR_LINE_AREA = [
  { id: "bar"  as ChartType, label: "Barras",  Icon: BarChart2  },
  { id: "line" as ChartType, label: "Líneas",  Icon: TrendingUp },
  { id: "area" as ChartType, label: "Área",    Icon: Activity   },
];

function SectionCard({ title, badge, right, children }: { title: string; badge?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {badge && <span className="text-[10px] bg-blue-50 text-[#1C5BB8] border border-blue-100 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
        </div>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// Custom tooltip for scatter
const ScatterTip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-900">{d?.name}</p>
      <p className="text-gray-500">{d?.role}</p>
      <p>Casos: <span className="font-medium text-gray-900">{d?.casos}</span></p>
      <p>T. Promedio: <span className="font-medium text-gray-900">{d?.tiempo} días</span></p>
    </div>
  );
};

// Custom tooltip for improvement chart
const ImprovTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((p: any, idx: number) => (
        <p key={p.dataKey ?? String(idx)} style={{ color: p.fill }} className="flex items-center gap-1.5">
          <span className={`inline-block w-2 h-2 rounded-full`} style={{ background: p.value >= 0 ? C.green : C.red }} />
          {p.name}: {p.value >= 0 ? "+" : ""}{p.value}%
        </p>
      ))}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export function Statistics() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterActive, setFilterActive] = useState(false);

  const [ctSentencias,   setCtSentencias]   = useState<ChartType>("bar");
  const [ctTiempo,       setCtTiempo]       = useState<ChartType>("bar");
  const [ctAvgMes,       setCtAvgMes]       = useState<ChartType>("line");
  const [ctLiquidador,   setCtLiquidador]   = useState<ChartType>("bar");
  const [ctPagador,      setCtPagador]      = useState<ChartType>("bar");
  const [ctCorrLiq,      setCtCorrLiq]      = useState<ChartType>("bar");
  const [ctCorrPay,      setCtCorrPay]      = useState<ChartType>("bar");

  // ── Filtered data (affects all except "mes actual" charts) ─────────────────
  const filterMonthly = <T extends { date: string }>(data: T[]): T[] => {
    if (!filterActive || (!dateFrom && !dateTo)) return data;
    return data.filter(d => {
      const m = d.date;
      if (dateFrom && m < dateFrom.substring(0, 7)) return false;
      if (dateTo   && m > dateTo.substring(0, 7))   return false;
      return true;
    });
  };

  const monthlyData      = useMemo(() => filterMonthly(ALL_MONTHLY),           [filterActive, dateFrom, dateTo]);
  const avgTimeData      = useMemo(() => filterMonthly(ALL_AVG_TIME),           [filterActive, dateFrom, dateTo]);
  const liqMonthlyData   = useMemo(() => filterMonthly(ALL_LIQUIDATOR_MONTHLY), [filterActive, dateFrom, dateTo]);
  const payMonthlyData   = useMemo(() => filterMonthly(ALL_PAYER_MONTHLY),      [filterActive, dateFrom, dateTo]);

  const timeImprovement  = useMemo(() => computeImprovement(avgTimeData),       [avgTimeData]);

  const liqTotals        = useMemo(() => sumByEmployee(liqMonthlyData, ["María García","Carlos Sánchez","Laura Díaz","Pedro Jiménez"]), [liqMonthlyData]);
  const payTotals        = useMemo(() => sumByEmployee(payMonthlyData, ["Carlos Torres","Pedro Gómez","Ana Martínez","Claudia Ruiz"]),   [payMonthlyData]);

  const applyFilter = () => setFilterActive(true);
  const clearFilter = () => { setDateFrom(""); setDateTo(""); setFilterActive(false); };

  // Current month KPIs (never filtered)
  const curMonth = ALL_MONTHLY[ALL_MONTHLY.length - 1];

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Estadísticas</h1>
        <p className="text-gray-500 text-sm mt-0.5">Análisis y reportes del sistema de liquidaciones</p>
      </div>

      {/* ── Date Range Filter ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Filter size={14} className="text-[#1C5BB8]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Filtrar por período</p>
              <p className="text-[10px] text-gray-400">Afecta todos los gráficos excepto los de mes actual</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <Calendar size={13} className="text-gray-400" />
            <span className="text-xs text-gray-400">Desde</span>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="text-xs text-gray-700 bg-transparent border-none outline-none" />
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <Calendar size={13} className="text-gray-400" />
            <span className="text-xs text-gray-400">Hasta</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="text-xs text-gray-700 bg-transparent border-none outline-none" />
          </div>

          <button onClick={applyFilter}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1C5BB8] text-white rounded-xl text-xs font-semibold hover:bg-[#1850A0] transition-colors shadow-sm">
            <Filter size={12} /> Filtrar
          </button>

          {filterActive && (
            <button onClick={clearFilter}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors">
              <X size={12} /> Limpiar
            </button>
          )}

          {filterActive && (
            <span className="flex items-center gap-1 text-xs bg-blue-50 border border-blue-200 text-[#1C5BB8] px-3 py-1.5 rounded-full font-medium ml-auto">
              <Zap size={11} /> Filtro activo — {monthlyData.length} mes{monthlyData.length !== 1 ? "es" : ""}
            </span>
          )}
        </div>
      </div>

      {/* ── KPI Cards (mes actual — never filtered) ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Total Sentencias (Mes Actual)", value: curMonth.creadas,     color: "text-[#1C5BB8]", bg: "bg-blue-50",  border: "border-blue-100",  icon: <Activity size={18} className="text-[#1C5BB8]" /> },
          { label: "Terminadas (Mes Actual)",        value: curMonth.terminadas,  color: "text-[#34A853]", bg: "bg-green-50", border: "border-green-100", icon: <CheckCircle2 size={18} className="text-[#34A853]" /> },
          { label: "Pagadas (Mes Actual)",           value: curMonth.pagadas,     color: "text-gray-700",  bg: "bg-gray-50",  border: "border-gray-200",  icon: <CreditCard size={18} className="text-gray-500" /> },
        ].map(({ label, value, color, bg, border, icon }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`w-10 h-10 bg-white/70 rounded-xl flex items-center justify-center shadow-sm`}>{icon}</div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sentencias por Mes ─────────────────────────────────────────────── */}
      <SectionCard
        title="Sentencias por Mes"
        badge={filterActive ? "Filtrado" : undefined}
        right={<ChartTypeSel options={CHART_BAR_PIE_LINE} value={ctSentencias} onChange={setCtSentencias} />}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height={288}>
            {ctSentencias === "bar" ? (
              <BarChart key="sent-bar" data={monthlyData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid #E5E7EB" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar key="sent-bar-creadas"    dataKey="creadas"    fill={C.blue}  name="Creadas"    radius={[4,4,0,0]} />
                <Bar key="sent-bar-terminadas" dataKey="terminadas" fill={C.green} name="Terminadas" radius={[4,4,0,0]} />
                <Bar key="sent-bar-pagadas"    dataKey="pagadas"    fill={C.gold}  name="Pagadas"    radius={[4,4,0,0]} />
              </BarChart>
            ) : ctSentencias === "pie" ? (
              <PieChart key="sent-pie">
                <Pie
                  data={[
                    { name: "Creadas",    value: monthlyData.reduce((a,b) => a + b.creadas,    0) },
                    { name: "Terminadas", value: monthlyData.reduce((a,b) => a + b.terminadas, 0) },
                    { name: "Pagadas",    value: monthlyData.reduce((a,b) => a + b.pagadas,    0) },
                  ]}
                  cx="50%" cy="50%" outerRadius={110} innerRadius={55}
                  dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {[C.blue, C.green, C.gold].map((c, i) => <Cell key={`sentencias-pie-${i}`} fill={c} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            ) : (
              <LineChart key="sent-line" data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line key="sent-line-creadas"    type="monotone" dataKey="creadas"    stroke={C.blue}  strokeWidth={2.5} dot={{ r: 4 }} name="Creadas" />
                <Line key="sent-line-terminadas" type="monotone" dataKey="terminadas" stroke={C.green} strokeWidth={2.5} dot={{ r: 4 }} name="Terminadas" />
                <Line key="sent-line-pagadas"    type="monotone" dataKey="pagadas"    stroke={C.gold}  strokeWidth={2.5} dot={{ r: 4 }} name="Pagadas" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* ── Tiempo Promedio ────────────────────────────────────────────────── */}
      <SectionCard
        title="Tiempo Promedio de Gestión"
        badge={filterActive ? "Filtrado" : undefined}
        right={<ChartTypeSel options={CHART_BAR_LINE_AREA} value={ctTiempo} onChange={setCtTiempo} />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          {[
            { label: "Creación → Terminada", value: `${avgTimeData.at(-1)?.terminada ?? 15} días`, color: "text-[#1C5BB8]", bg: "bg-blue-50",  border: "border-blue-100",  icon: <Clock size={16} className="text-[#1C5BB8]" /> },
            { label: "Terminada → Pagada",   value: `${avgTimeData.at(-1)?.pagada ?? 9} días`,    color: "text-[#34A853]", bg: "bg-green-50", border: "border-green-100", icon: <CheckCircle2 size={16} className="text-[#34A853]" /> },
            { label: "Proceso Completo",      value: `${avgTimeData.at(-1)?.completo ?? 24} días`, color: "text-gray-700",  bg: "bg-gray-50",  border: "border-gray-200",  icon: <Target size={16} className="text-gray-500" /> },
          ].map(({ label, value, color, bg, border, icon }) => (
            <div key={label} className={`${bg} border ${border} rounded-xl p-4 flex items-center gap-3`}>
              <div className="w-9 h-9 bg-white/70 rounded-lg flex items-center justify-center shadow-sm">{icon}</div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height={256}>
            {ctTiempo === "bar" ? (
              <BarChart key="tiempo-bar" data={avgTimeData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} unit=" d" />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} días`]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar key="tiempo-bar-terminada" dataKey="terminada" fill={C.blue}  name="Creación→Terminada" radius={[4,4,0,0]} />
                <Bar key="tiempo-bar-pagada"    dataKey="pagada"    fill={C.green} name="Terminada→Pagada"   radius={[4,4,0,0]} />
                <Bar key="tiempo-bar-completo"  dataKey="completo"  fill={C.gold}  name="Proceso Completo"   radius={[4,4,0,0]} />
              </BarChart>
            ) : ctTiempo === "line" ? (
              <LineChart key="tiempo-line" data={avgTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} unit=" d" />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} días`]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line key="tiempo-line-terminada" type="monotone" dataKey="terminada" stroke={C.blue}  strokeWidth={2.5} dot={{ r: 4 }} name="Creación→Terminada" />
                <Line key="tiempo-line-pagada"    type="monotone" dataKey="pagada"    stroke={C.green} strokeWidth={2.5} dot={{ r: 4 }} name="Terminada→Pagada" />
                <Line key="tiempo-line-completo"  type="monotone" dataKey="completo"  stroke={C.gold}  strokeWidth={2.5} dot={{ r: 4 }} name="Proceso Completo" />
              </LineChart>
            ) : (
              <AreaChart key="tiempo-area" data={avgTimeData}>
                <defs>
                  <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.blue} stopOpacity={0.15}/><stop offset="95%" stopColor={C.blue} stopOpacity={0}/></linearGradient>
                  <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={0.15}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient>
                  <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.15}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} unit=" d" />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} días`]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area key="tiempo-area-terminada" type="monotone" dataKey="terminada" stroke={C.blue}  fill="url(#gT)" strokeWidth={2} name="Creación→Terminada" />
                <Area key="tiempo-area-pagada"    type="monotone" dataKey="pagada"    stroke={C.green} fill="url(#gP)" strokeWidth={2} name="Terminada→Pagada" />
                <Area key="tiempo-area-completo"  type="monotone" dataKey="completo"  stroke={C.gold}  fill="url(#gC)" strokeWidth={2} name="Proceso Completo" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* ── Tiempo Promedio por Mes (nuevo) ────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[#1C5BB8]" />
          <h2 className="text-sm font-semibold text-gray-900">Evolución del Tiempo Promedio por Mes</h2>
          {filterActive && <span className="text-[10px] bg-blue-50 text-[#1C5BB8] border border-blue-100 px-2 py-0.5 rounded-full font-medium">Filtrado</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Chart 1: Line – Trend over months */}
          <SectionCard title="Tendencia Días Promedio" right={
            <ChartTypeSel options={CHART_LINE_BAR_RADAR} value={ctAvgMes} onChange={setCtAvgMes} />
          }>
            <div className="h-56">
              <ResponsiveContainer width="100%" height={224}>
                {ctAvgMes === "line" ? (
                  <LineChart key="avgmes-line" data={avgTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} unit=" d" domain={[0, 42]} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} días`]} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line key="avgmes-line-completo"  type="monotone" dataKey="completo"  stroke={C.violet} strokeWidth={2.5} dot={{ r: 4 }} name="Proceso Completo" />
                    <Line key="avgmes-line-terminada" type="monotone" dataKey="terminada" stroke={C.blue}   strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} name="Creación→Terminada" />
                    <Line key="avgmes-line-pagada"    type="monotone" dataKey="pagada"    stroke={C.green}  strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} name="Terminada→Pagada" />
                  </LineChart>
                ) : ctAvgMes === "bar" ? (
                  <BarChart key="avgmes-bar" data={avgTimeData} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} unit=" d" />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} días`]} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar key="avgmes-bar-completo"  dataKey="completo"  fill={C.violet} name="Proceso Completo" radius={[4,4,0,0]} />
                    <Bar key="avgmes-bar-terminada" dataKey="terminada" fill={C.blue}   name="→ Terminada" radius={[4,4,0,0]} />
                    <Bar key="avgmes-bar-pagada"    dataKey="pagada"    fill={C.green}  name="→ Pagada" radius={[4,4,0,0]} />
                  </BarChart>
                ) : (
                  <RadarChart key="avgmes-radar" cx="50%" cy="50%" outerRadius={85} data={RADAR_DATA.map((d,_) => ({
                    subject: d.subject,
                    completo: (ALL_AVG_TIME.find(x => x.month === d.subject)?.completo ?? 0),
                  }))}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6B7280" }} />
                    <PolarRadiusAxis tick={{ fontSize: 9 }} />
                    <Radar key="avgmes-radar-completo" name="Proceso Completo" dataKey="completo" stroke={C.violet} fill={C.violet} fillOpacity={0.2} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} días`]} />
                  </RadarChart>
                )}
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Chart 2: Improvement % – positive/negative */}
          <SectionCard title="% Mejora Entre Meses" badge="Positivo = Reducción de tiempos">
            {timeImprovement.length < 2 ? (
              <div className="h-56 flex items-center justify-center text-xs text-gray-400">
                Selecciona un rango de al menos 2 meses para ver mejoras
              </div>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height={224}>
                  <BarChart key="improv-bar" data={timeImprovement} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="period" tick={{ fontSize: 10, fill: "#6B7280" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} unit="%" tickFormatter={v => `${v>0?"+":""}${v}`} />
                    <ReferenceLine y={0} stroke="#9CA3AF" strokeWidth={1.5} />
                    <Tooltip content={<ImprovTip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar key="improv-bar-terminada" dataKey="terminada" name="Creación→Terminada" radius={[4,4,0,0]}>
                      {timeImprovement.map((e, i) => (
                        <Cell key={`improv-term-${i}`} fill={e.terminada >= 0 ? C.green : C.red} />
                      ))}
                    </Bar>
                    <Bar key="improv-bar-pagada" dataKey="pagada" name="Terminada→Pagada" radius={[4,4,0,0]}>
                      {timeImprovement.map((e, i) => (
                        <Cell key={`improv-pag-${i}`} fill={e.pagada >= 0 ? C.teal : C.orange} fillOpacity={0.8} />
                      ))}
                    </Bar>
                    <Bar key="improv-bar-completo" dataKey="completo" name="Proceso Completo" radius={[4,4,0,0]}>
                      {timeImprovement.map((e, i) => (
                        <Cell key={`improv-compl-${i}`} fill={e.completo >= 0 ? C.blue : C.violet} fillOpacity={0.75} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#34A853]" /> Positivo = Mejora (menos días)
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#EA4335] ml-2" /> Negativo = Empeoramiento
            </p>
          </SectionCard>
        </div>
      </div>

      {/* ── Top Rankings (mes actual — never filtered) ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Liquidadores */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Award size={15} className="text-[#1C5BB8]" />
            <h2 className="text-sm font-semibold text-gray-900">Top Liquidadores (Mes Actual)</h2>
          </div>
          <div className="p-5 space-y-3">
            {TOP_LIQUIDATORS.map((l, i) => (
              <div key={l.name} className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${i === 0 ? "bg-[#FBBC05] text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-300 text-white" : "bg-gray-100 text-gray-500"}`}>{i+1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-gray-800">{l.name}</span>
                    <span className="text-xs font-bold text-gray-900">{l.casos} casos</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(l.casos / TOP_LIQUIDATORS[0].casos) * 100}%`, background: l.fill }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pagadores */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Award size={15} className="text-[#34A853]" />
            <h2 className="text-sm font-semibold text-gray-900">Top Pagadores (Mes Actual)</h2>
          </div>
          <div className="p-5 space-y-3">
            {TOP_PAYERS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${i === 0 ? "bg-[#FBBC05] text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-300 text-white" : "bg-gray-100 text-gray-500"}`}>{i+1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-gray-800">{p.name}</span>
                    <span className="text-xs font-bold text-gray-900">{p.pagos} pagos</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(p.pagos / TOP_PAYERS[0].pagos) * 100}%`, background: p.fill }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Liquidaciones por Liquidador (histórico) ───────────────────────── */}
      <SectionCard
        title="Liquidaciones por Liquidador (Histórico)"
        badge={filterActive ? "Filtrado" : undefined}
        right={<ChartTypeSel options={CHART_BAR_PIE_AREA} value={ctLiquidador} onChange={setCtLiquidador} />}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height={288}>
            {ctLiquidador === "bar" ? (
              <BarChart key="liq-bar" data={liqMonthlyData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar key="liq-bar-maria"  dataKey="María García"   fill={C.blue}   name="María García"   radius={[3,3,0,0]} />
                <Bar key="liq-bar-carlos" dataKey="Carlos Sánchez" fill={C.green}  name="Carlos Sánchez" radius={[3,3,0,0]} />
                <Bar key="liq-bar-laura"  dataKey="Laura Díaz"     fill={C.gold}   name="Laura Díaz"     radius={[3,3,0,0]} />
                <Bar key="liq-bar-pedro"  dataKey="Pedro Jiménez"  fill={C.violet} name="Pedro Jiménez"  radius={[3,3,0,0]} />
              </BarChart>
            ) : ctLiquidador === "pie" ? (
              <PieChart key="liq-pie">
                <Pie data={liqTotals} cx="50%" cy="50%" outerRadius={110} innerRadius={50} dataKey="total"
                  label={({ name, percent }) => `${name.split(" ")[0]} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {liqTotals.map((e, i) => <Cell key={`liq-pie-${i}`} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            ) : (
              <AreaChart key="liq-area" data={liqMonthlyData}>
                <defs>
                  {[C.blue, C.green, C.gold, C.violet].map((c, i) => (
                    <linearGradient key={`liq-grad-${i}`} id={`gl${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.2}/><stop offset="95%" stopColor={c} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area key="liq-area-maria"  type="monotone" dataKey="María García"   stroke={C.blue}   fill="url(#gl0)" strokeWidth={2} name="María García" />
                <Area key="liq-area-carlos" type="monotone" dataKey="Carlos Sánchez" stroke={C.green}  fill="url(#gl1)" strokeWidth={2} name="Carlos Sánchez" />
                <Area key="liq-area-laura"  type="monotone" dataKey="Laura Díaz"     stroke={C.gold}   fill="url(#gl2)" strokeWidth={2} name="Laura Díaz" />
                <Area key="liq-area-pedro"  type="monotone" dataKey="Pedro Jiménez"  stroke={C.violet} fill="url(#gl3)" strokeWidth={2} name="Pedro Jiménez" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* ── Liquidaciones por Pagador (histórico) ──────────────────────────── */}
      <SectionCard
        title="Liquidaciones por Pagador (Histórico)"
        badge={filterActive ? "Filtrado" : undefined}
        right={<ChartTypeSel options={CHART_BAR_PIE_AREA} value={ctPagador} onChange={setCtPagador} />}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height={288}>
            {ctPagador === "bar" ? (
              <BarChart key="pay-bar" data={payMonthlyData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar key="pay-bar-ctorres"   dataKey="Carlos Torres" fill={C.blue}   name="Carlos Torres" radius={[3,3,0,0]} />
                <Bar key="pay-bar-pgomez"    dataKey="Pedro Gómez"   fill={C.green}  name="Pedro Gómez"   radius={[3,3,0,0]} />
                <Bar key="pay-bar-amartinez" dataKey="Ana Martínez"  fill={C.gold}   name="Ana Martínez"  radius={[3,3,0,0]} />
                <Bar key="pay-bar-cruiz"     dataKey="Claudia Ruiz"  fill={C.violet} name="Claudia Ruiz"  radius={[3,3,0,0]} />
              </BarChart>
            ) : ctPagador === "pie" ? (
              <PieChart key="pay-pie">
                <Pie data={payTotals} cx="50%" cy="50%" outerRadius={110} innerRadius={50} dataKey="total"
                  label={({ name, percent }) => `${name.split(" ")[0]} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {payTotals.map((e, i) => <Cell key={`pay-pie-${i}`} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            ) : (
              <AreaChart key="pay-area" data={payMonthlyData}>
                <defs>
                  {[C.blue, C.green, C.gold, C.violet].map((c, i) => (
                    <linearGradient key={`pay-grad-${i}`} id={`gp${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.2}/><stop offset="95%" stopColor={c} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area key="pay-area-ctorres"   type="monotone" dataKey="Carlos Torres" stroke={C.blue}   fill="url(#gp0)" strokeWidth={2} name="Carlos Torres" />
                <Area key="pay-area-pgomez"    type="monotone" dataKey="Pedro Gómez"   stroke={C.green}  fill="url(#gp1)" strokeWidth={2} name="Pedro Gómez" />
                <Area key="pay-area-amartinez" type="monotone" dataKey="Ana Martínez"  stroke={C.gold}   fill="url(#gp2)" strokeWidth={2} name="Ana Martínez" />
                <Area key="pay-area-cruiz"     type="monotone" dataKey="Claudia Ruiz"  stroke={C.violet} fill="url(#gp3)" strokeWidth={2} name="Claudia Ruiz" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* ── Dispersión: Comparativa entre Empleados ────────────────────────── */}
      <SectionCard title="Dispersión de Eficiencia — Comparativa de Empleados" badge="Casos vs Tiempo Promedio">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: C.blue }} /> Liquidadores
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: C.green }} /> Pagadores
          </div>
          <span className="text-xs text-gray-400 ml-auto">Arriba izq. = Pocos casos, mucho tiempo · Abajo der. = Muchos casos, poco tiempo (ideal)</span>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="casos" type="number" name="Casos" tick={{ fontSize: 11, fill: "#6B7280" }} label={{ value: "Casos Procesados", position: "insideBottom", offset: -10, style: { fontSize: 11, fill: "#9CA3AF" } }} domain={[0, 36]} />
              <YAxis dataKey="tiempo" type="number" name="Tiempo" tick={{ fontSize: 11, fill: "#6B7280" }} label={{ value: "Días Promedio", angle: -90, position: "insideLeft", offset: 15, style: { fontSize: 11, fill: "#9CA3AF" } }} domain={[0, 26]} />
              <ZAxis range={[60, 200]} />
              <Tooltip content={<ScatterTip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 24 }} />
              <Scatter key="scatter-liq" name="Liquidadores" data={SCATTER_DATA_LIQ} fill={C.blue} fillOpacity={0.8} />
              <Scatter key="scatter-pay" name="Pagadores"    data={SCATTER_DATA_PAY} fill={C.green} fillOpacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          {[...SCATTER_DATA_LIQ, ...SCATTER_DATA_PAY].slice(0, 8).map(e => (
            <div key={e.name} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.role === "Liquidador" ? C.blue : C.green }} />
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-gray-800 truncate">{e.name.split(" ")[0]}</p>
                <p className="text-[9px] text-gray-400">{e.casos} casos · {e.tiempo}d</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Correcciones Enviadas ─────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-orange-500" />
          <h2 className="text-sm font-semibold text-gray-900">Correcciones Enviadas</h2>
          <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full font-medium">Liquidadores y Pagadores</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {[
            { label: "Correcciones — Liquidadores", total: LIQUIDATOR_CORRECTIONS.reduce((a, b) => a + b.corrections, 0), sub: `${LIQUIDATOR_CORRECTIONS.length} liquidadores`, color: "text-[#1C5BB8]", bg: "bg-blue-50", border: "border-blue-100", icon: <Users size={18} className="text-[#1C5BB8]" /> },
            { label: "Correcciones — Pagadores",    total: PAYER_CORRECTIONS.reduce((a, b) => a + b.corrections, 0),       sub: `${PAYER_CORRECTIONS.length} pagadores`,    color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", icon: <AlertTriangle size={18} className="text-orange-500" /> },
          ].map(({ label, total, sub, color, bg, border, icon }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-5 flex items-center gap-4`}>
              <div className="w-10 h-10 bg-white/70 rounded-xl flex items-center justify-center shadow-sm">{icon}</div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className={`text-3xl font-bold ${color}`}>{total}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard
            title="Correcciones por Liquidador"
            badge="Histórico"
            right={<ChartTypeSel options={[{ id: "bar" as ChartType, label: "Barras", Icon: BarChart2 }, { id: "pie" as ChartType, label: "Pastel", Icon: PieChartIcon }]} value={ctCorrLiq} onChange={setCtCorrLiq} />}
          >
            <div className="h-52">
              <ResponsiveContainer width="100%" height={208}>
                {ctCorrLiq === "bar" ? (
                  <BarChart key="corr-liq-bar" data={LIQUIDATOR_CORRECTIONS} layout="vertical" margin={{ left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#6B7280" }} width={105} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} correcciones`]} />
                    <Bar dataKey="corrections" name="Correcciones" radius={[0, 4, 4, 0]} maxBarSize={22}>
                      {LIQUIDATOR_CORRECTIONS.map((e, i) => <Cell key={`liq-corr-${i}`} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                ) : (
                  <PieChart key="corr-liq-pie">
                    <Pie data={LIQUIDATOR_CORRECTIONS.map(e => ({ name: e.name, value: e.corrections }))} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {LIQUIDATOR_CORRECTIONS.map((e, i) => <Cell key={`liq-cpie-${i}`} fill={e.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} correcciones`]} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1.5">
              {LIQUIDATOR_CORRECTIONS.map((e, i) => (
                <div key={e.name} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 text-white" style={{ background: e.fill }}>{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-gray-800">{e.name}</span>
                      <span className="text-xs font-bold text-gray-900">{e.corrections} corr.</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(e.corrections / Math.max(...LIQUIDATOR_CORRECTIONS.map(x => x.corrections))) * 100}%`, background: e.fill }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Correcciones por Pagador"
            badge="Histórico"
            right={<ChartTypeSel options={[{ id: "bar" as ChartType, label: "Barras", Icon: BarChart2 }, { id: "pie" as ChartType, label: "Pastel", Icon: PieChartIcon }]} value={ctCorrPay} onChange={setCtCorrPay} />}
          >
            <div className="h-52">
              <ResponsiveContainer width="100%" height={208}>
                {ctCorrPay === "bar" ? (
                  <BarChart key="corr-pay-bar" data={PAYER_CORRECTIONS} layout="vertical" margin={{ left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#6B7280" }} width={105} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} correcciones`]} />
                    <Bar dataKey="corrections" name="Correcciones" radius={[0, 4, 4, 0]} maxBarSize={22}>
                      {PAYER_CORRECTIONS.map((e, i) => <Cell key={`pay-corr-${i}`} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                ) : (
                  <PieChart key="corr-pay-pie">
                    <Pie data={PAYER_CORRECTIONS.map(e => ({ name: e.name, value: e.corrections }))} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value" label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {PAYER_CORRECTIONS.map((e, i) => <Cell key={`pay-cpie-${i}`} fill={e.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} correcciones`]} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1.5">
              {PAYER_CORRECTIONS.map((e, i) => (
                <div key={e.name} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 text-white" style={{ background: e.fill }}>{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-gray-800">{e.name}</span>
                      <span className="text-xs font-bold text-gray-900">{e.corrections} corr.</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(e.corrections / Math.max(...PAYER_CORRECTIONS.map(x => x.corrections))) * 100}%`, background: e.fill }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

    </div>
  );
}