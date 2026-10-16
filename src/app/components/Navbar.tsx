import { User, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { ActionTooltip } from "./ActionTooltip";

interface NavbarProps {
  role: string;
}

const menuItems = {
  superuser: [
    { label: "Dashboard",       path: "/superuser" },
    { label: "Departamentos",   path: "/superuser/departments" },
    { label: "Sectores",        path: "/superuser/sectors" },
    { label: "Entidades",       path: "/superuser/entities" },
    { label: "Oficinas",        path: "/superuser/offices" },
    { label: "Administradores", path: "/superuser/administrators" },
    { label: "Auditoría",       path: "/superuser/audit" },
  ],
  admin: [
    { label: "Inicio",        path: "/admin" },
    { label: "Sentencias",    path: "/admin/sentences" },
    { label: "Liquidadores",  path: "/admin/liquidators" },
    { label: "Pagadores",     path: "/admin/payers" },
    { label: "Sol. Edición",  path: "/admin/edit-requests" },
    { label: "Estadísticas",  path: "/admin/statistics" },
  ],
  liquidator: [
    { label: "Inicio",                   path: "/liquidator/dashboard" },
    { label: "Sentencias Pendientes",    path: "/liquidator/pending" },
    { label: "Mis Liquidaciones",        path: "/liquidator/completed" },
    { label: "Calcular Liquidación",     path: "/liquidator/calculate" },
  ],
  payer: [
    { label: "Inicio",                path: "/payer/history" },
    { label: "Sentencias Pendientes", path: "/payer/pending" },
    { label: "Sentencias Pagadas",    path: "/payer/paid" },
  ],
};

export function Navbar({ role }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const roleNames = {
    superuser: "Superusuario",
    admin: "Administrador",
    liquidator: "Liquidador",
    payer: "Pagador",
  };

  const items = menuItems[role as keyof typeof menuItems] || [];

  const handleProfile = () => {
    navigate(`/${role}/profile`);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Primera Fila: Logo y Usuario */}
      <div className="bg-[#0347A6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#2B6FCC] font-bold text-sm">SG</span>
              </div>
              <div className="text-white">
                <h1 className="font-semibold text-sm">SILTGOV</h1>
                <p className="text-[10px] text-blue-100">
                  {roleNames[role as keyof typeof roleNames]}
                </p>
              </div>
            </div>

            {/* Usuario */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <ActionTooltip label="Menú de perfil y sesión">
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    aria-expanded={showProfileMenu}
                    aria-haspopup="menu"
                    className="flex items-center gap-1.5 p-1.5 hover:bg-[#3D7DD8] rounded-lg transition-colors"
                  >
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                      <User size={14} className="text-[#2B6FCC]" aria-hidden />
                    </div>
                    <ChevronDown size={12} className="text-white hidden sm:block" aria-hidden />
                  </button>
                </ActionTooltip>

                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-1.5 z-20 border border-gray-200">
                      <ActionTooltip label="Ver y editar mi perfil">
                        <button
                          type="button"
                          onClick={handleProfile}
                          className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-700 text-xs"
                        >
                          <User size={14} aria-hidden />
                          Mi Perfil
                        </button>
                      </ActionTooltip>
                      <ActionTooltip label="Cerrar sesión y volver al inicio">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600 text-xs"
                        >
                          <LogOut size={14} aria-hidden />
                          Cerrar Sesión
                        </button>
                      </ActionTooltip>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda Fila: Opciones de Navegación */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-9 gap-1 overflow-x-auto">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === `/${role}`}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg transition-colors text-xs whitespace-nowrap font-medium ${
                    isActive
                      ? "bg-[#5B9BDE] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}