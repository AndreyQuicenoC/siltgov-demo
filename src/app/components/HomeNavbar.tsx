import { useNavigate, useLocation } from "react-router";

export function HomeNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRoute = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Primera fila: Logo + Ingresar */}
      <div className="bg-[#0347A6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#2B6FCC] font-bold text-sm">SG</span>
              </div>
              <div className="text-white text-left">
                <p className="font-semibold text-sm leading-tight">SILTGOV</p>
                <p className="text-[10px] text-blue-100">Gobernación del Valle del Cauca</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-gray-900 px-5 py-1.5 rounded-lg hover:bg-[#FFE04D] transition-colors text-xs font-semibold"
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>

      {/* Segunda fila: Navegación */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-10 gap-6">
            <button
              onClick={() => navigate("/")}
              className={`text-xs font-medium transition-colors ${
                isRoute("/") ? "text-[#2B6FCC]" : "text-gray-700 hover:text-[#2B6FCC]"
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => navigate("/about")}
              className={`text-xs font-medium transition-colors ${
                isRoute("/about") ? "text-[#2B6FCC]" : "text-gray-700 hover:text-[#2B6FCC]"
              }`}
            >
              Sobre Nosotros
            </button>
            <button
              onClick={() => navigate("/faq")}
              className={`text-xs font-medium transition-colors ${
                isRoute("/faq") ? "text-[#2B6FCC]" : "text-gray-700 hover:text-[#2B6FCC]"
              }`}
            >
              Preguntas Frecuentes
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}