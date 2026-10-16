import { Mail, Phone, MapPin, FileText, Shield, Book } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F2847] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8 mb-6">
          {/* Logo y descripción */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#1C5BB8] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SG</span>
              </div>
              <span className="font-semibold text-white">SILTGOV</span>
            </div>
            <p className="text-sm text-gray-400">
              Sistema Integrado de Liquidaciones Gubernamentales
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Gobernación del Valle del Cauca
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <FileText size={14} />
                  Manual de Usuario
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <Book size={14} />
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <Shield size={14} />
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-1 flex-shrink-0" />
                <span>+57 (2) 620 00 00</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-1 flex-shrink-0" />
                <span className="text-xs">siltgov@valledelcauca.gov.co</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 flex-shrink-0" />
                <span className="text-xs">Calle 9 # 3-14, Cali, Valle del Cauca, Colombia</span>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Horario de Atención</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">
                <strong className="text-white">Lunes - Viernes</strong>
                <br />
                8:00 AM - 5:00 PM
              </li>
              <li className="text-gray-400 mt-3">
                <strong className="text-white">Soporte Técnico</strong>
                <br />
                24/7 vía correo electrónico
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2026 Gobernación del Valle del Cauca - SILTGOV</p>
            <p className="text-xs">Desarrollado con el respaldo del Gobierno de Colombia</p>
          </div>
        </div>
      </div>
    </footer>
  );
}