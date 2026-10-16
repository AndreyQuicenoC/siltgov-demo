import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  ShieldCheck,
  ClipboardList,
  FileText,
  DollarSign,
  BarChart3,
  CheckCircle2,
  History,
  Layers,
  MapPin,
} from "lucide-react";

interface SidebarProps {
  role: string;
}

const menuItems = {
  superuser: [
    { icon: LayoutDashboard, label: "Dashboard",       path: "/superuser" },
    { icon: Building2,       label: "Departamentos",   path: "/superuser/departments" },
    { icon: Layers,          label: "Sectores",        path: "/superuser/sectors" },
    { icon: Briefcase,       label: "Entidades",       path: "/superuser/entities" },
    { icon: MapPin,          label: "Oficinas",        path: "/superuser/offices" },
    { icon: Users,           label: "Administradores", path: "/superuser/administrators" },
    { icon: ShieldCheck,     label: "Auditoría",       path: "/superuser/audit" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Dashboard",      path: "/admin" },
    { icon: FileText,        label: "Sentencias",     path: "/admin/sentences" },
    { icon: ClipboardList,   label: "Liquidadores",   path: "/admin/liquidators" },
    { icon: DollarSign,      label: "Pagadores",      path: "/admin/payers" },
    { icon: BarChart3,       label: "Estadísticas",   path: "/admin/statistics" },
  ],
  liquidator: [
    { icon: FileText, label: "Mis Sentencias", path: "/liquidator" },
  ],
  payer: [
    { icon: CheckCircle2, label: "Panel de Pagos", path: "/payer" },
    { icon: History,      label: "Historial",      path: "/payer/history" },
  ],
};

export function Sidebar({ role }: SidebarProps) {
  const items = menuItems[role as keyof typeof menuItems] || [];

  return (
    <aside className="w-64 bg-[#1C5BB8] text-white min-h-full">
      <nav className="p-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === `/${role}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-white text-[#1C5BB8] font-medium"
                      : "text-white hover:bg-[#1850A0]"
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}