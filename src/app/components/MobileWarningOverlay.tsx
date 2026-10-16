import { useState, useEffect } from "react";
import { X, Monitor, Smartphone, ExternalLink } from "lucide-react";

const STORAGE_KEY = "siltgov_mobile_warned_v1";

/**
 * MobileWarningOverlay
 * ─────────────────────────────────────────────────────────────────────────────
 * Appears only on mobile viewports (<768 px) and only once per session
 * (sessionStorage), shown after the user successfully logs in and lands on any
 * dashboard route. It is NEVER shown on public pages or on desktop.
 */
export function MobileWarningOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alreadyWarned = sessionStorage.getItem(STORAGE_KEY);
    const isMobile = window.innerWidth < 768;

    if (!alreadyWarned && isMobile) {
      // Short delay so the dashboard renders first
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-warn-title"
      aria-describedby="mobile-warn-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1C5BB8] to-[#2B6FCC] px-5 py-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone size={20} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 id="mobile-warn-title" className="text-sm font-semibold text-white leading-tight">
                Dispositivo móvil detectado
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">Recomendación de uso</p>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 ml-2"
            aria-label="Cerrar aviso"
          >
            <X size={16} className="text-white" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div id="mobile-warn-desc" className="p-5 space-y-4">
          <p className="text-xs text-gray-700 leading-relaxed">
            <strong className="text-gray-900">SILTGOV</strong> es un sistema{" "}
            <a
              href="https://developer.mozilla.org/es/docs/Learn_web_development/Core/CSS_layout/Responsive_Design"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1C5BB8] underline underline-offset-2 hover:text-[#1850A0] inline-flex items-center gap-0.5"
              aria-label="¿Qué es el diseño responsivo? (abre en nueva pestaña)"
            >
              responsivo <ExternalLink size={10} aria-hidden="true" />
            </a>
            , lo que significa que puede usarse desde cualquier pantalla.
          </p>

          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Monitor size={16} className="text-amber-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Sin embargo, <strong>no recomendamos ingresar datos, registrar pagos ni realizar operaciones críticas desde un dispositivo móvil</strong>. Los formularios y tablas del sistema están optimizados para pantallas de computador.
            </p>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            Por seguridad y para una mejor experiencia, accede desde un computador cuando necesites realizar operaciones en la plataforma.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={dismiss}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1C5BB8] text-white rounded-xl text-sm font-medium hover:bg-[#1850A0] transition-colors"
          >
            Entendido, continuar
          </button>
        </div>
      </div>
    </div>
  );
}
