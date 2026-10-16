import { useState, useMemo } from "react";
import { Building2, Briefcase, Users, MapPin, Layers, ShieldCheck, Search, X } from "lucide-react";
import { StatCard } from "../../components/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";
import { Pagination } from "../../components/Pagination";

const allActivity = [
  { action: "Nuevo departamento 'Atlántico' creado",           user: "Superusuario",          time: "Hace 1 hora",   type: "success" },
  { action: "Administrador Roberto Vargas actualizado",         user: "Superusuario",          time: "Hace 2 horas",  type: "info"    },
  { action: "Entidad 'Sec. Hacienda del Cauca' desactivada",   user: "Superusuario",          time: "Hace 3 horas",  type: "warning" },
  { action: "Nueva oficina OFI-012 creada",                    user: "Sistema",               time: "Hace 4 horas",  type: "success" },
  { action: "Reporte de seguridad registrado",                 user: "Superusuario",          time: "Hace 5 horas",  type: "error"   },
  { action: "Sector 'TIC y Conectividad' desactivado",         user: "Superusuario",          time: "Hace 6 horas",  type: "warning" },
  { action: "Administrador Natalia Cardona creado",             user: "Superusuario",          time: "Hace 8 horas",  type: "success" },
  { action: "Oficina OFI-010 marcada como inactiva",           user: "Superusuario",          time: "Hace 10 horas", type: "warning" },
  { action: "Nueva entidad ENT-018 registrada",                user: "Sistema",               time: "Hace 12 horas", type: "success" },
  { action: "Intento de acceso no autorizado bloqueado",       user: "Sistema – IDS",         time: "Hace 1 día",    type: "error"   },
  { action: "Credenciales de administrador restablecidas",     user: "Superusuario",          time: "Hace 1 día",    type: "info"    },
  { action: "Departamento 'Risaralda' desactivado",            user: "Superusuario",          time: "Hace 2 días",   type: "warning" },
  { action: "Sector 'Cultura y Patrimonio' creado",            user: "Superusuario",          time: "Hace 2 días",   type: "success" },
  { action: "Reporte de ataque al sistema registrado",         user: "Superusuario",          time: "Hace 3 días",   type: "error"   },
  { action: "Oficina Jurídica Sec. Justicia VDC creada",       user: "Sistema",               time: "Hace 3 días",   type: "success" },
  { action: "Administrador Gustavo Camacho desactivado",       user: "Superusuario",          time: "Hace 4 días",   type: "warning" },
  { action: "Nueva entidad 'Sec. Infraestructura' agregada",   user: "Sistema",               time: "Hace 4 días",   type: "success" },
  { action: "Actualización de reglas de firewall perimetral",  user: "Sistema – Seguridad",   time: "Hace 5 días",   type: "info"    },
  { action: "Departamento 'Quindío' reactivado",               user: "Superusuario",          time: "Hace 6 días",   type: "success" },
  { action: "Reporte de acceso sospechoso en Sec. Hacienda",   user: "Superusuario",          time: "Hace 7 días",   type: "error"   },
];

const ITEMS_PER_PAGE = 8;

const dotColor = (type: string) => {
  if (type === "success") return "bg-[#34A853]";
  if (type === "warning") return "bg-[#FBBC05]";
  if (type === "error")   return "bg-red-500";
  return "bg-[#1C5BB8]";
};

export function SuperuserDashboard() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() =>
    allActivity.filter(a => {
      const q = search.toLowerCase();
      return !q || a.action.toLowerCase().includes(q) || a.user.toLowerCase().includes(q);
    }), [search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Panel de Superusuario</h1>
        <p className="text-sm text-gray-500 mt-0.5">Administración general del sistema SILTGOV</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Departamentos" value="12"  icon={Building2}   color="blue"   />
        <StatCard title="Sectores"      value="10"  icon={Layers}      color="gray"   />
        <StatCard title="Entidades"     value="18"  icon={Briefcase}   color="green"  />
        <StatCard title="Oficinas"      value="12"  icon={MapPin}      color="yellow" />
        <StatCard title="Admins."       value="12"  icon={Users}       color="blue"   />
        <StatCard title="Reportes Seg." value="7"   icon={ShieldCheck} color="gray"   />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle>Actividad Reciente</CardTitle>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Buscar actividad..."
                className="pl-8 pr-7 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] w-56"
              />
              {search && (
                <button onClick={() => { setSearch(""); setCurrentPage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X size={11} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paginated.length === 0 ? (
              <p className="text-sm text-center text-gray-400 py-6">No se encontraron registros de actividad</p>
            ) : paginated.map((activity, index) => (
              <div key={index} className="flex items-start gap-3.5 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor(activity.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Por <span className="text-gray-500">{activity.user}</span> · {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </Card>
    </div>
  );
}