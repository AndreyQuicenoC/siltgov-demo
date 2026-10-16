import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Mail, Lock, Eye, EyeOff, HelpCircle, AlertCircle, BookOpen, X,
  Shield, Settings, Briefcase, CreditCard, ArrowLeft, RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import backgroundImage from "figma:asset/d8b8b1d6383d7e928e16c3ba232fc8f16b03eec0.png";
import { HomeNavbar } from "../components/HomeNavbar";
import { HomeFooter } from "../components/HomeFooter";

// ── Configuración de roles para el overlay 2FA ──────────────────────────────
const roleConfig = {
  admin: {
    label: "Administrador",
    destination: "/admin",
    description: "Panel de Administración",
    color: "bg-[#1C5BB8]",
    lightColor: "bg-blue-50",
    textColor: "text-[#1C5BB8]",
    borderColor: "border-blue-200",
    icon: Settings,
  },
  liquidator: {
    label: "Liquidador",
    destination: "/liquidator",
    description: "Panel de Liquidaciones",
    color: "bg-[#34A853]",
    lightColor: "bg-green-50",
    textColor: "text-[#34A853]",
    borderColor: "border-green-200",
    icon: Briefcase,
  },
  payer: {
    label: "Pagador",
    destination: "/payer",
    description: "Panel de Pagos",
    color: "bg-[#FBBC05]",
    lightColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    icon: CreditCard,
  },
} as const;

type TwoFARole = keyof typeof roleConfig;

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Estado 2FA overlay
  const [show2FA, setShow2FA] = useState(false);
  const [twoFARole, setTwoFARole] = useState<TwoFARole>("admin");
  const [twoFACode, setTwoFACode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (show2FA) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [show2FA]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) { toast.error("Debes aceptar los términos y condiciones"); return; }
    if (!email || !password) { toast.error("Por favor completa todos los campos"); return; }

    if (email.includes("super")) {
      navigate("/superuser");
    } else if (email.includes("admin")) {
      setTwoFARole("admin");
      setTwoFACode(["", "", "", "", "", ""]);
      setShow2FA(true);
    } else if (email.includes("liquidador")) {
      setTwoFARole("liquidator");
      setTwoFACode(["", "", "", "", "", ""]);
      setShow2FA(true);
    } else if (email.includes("pagador")) {
      setTwoFARole("payer");
      setTwoFACode(["", "", "", "", "", ""]);
      setShow2FA(true);
    } else {
      toast.error("Credenciales inválidas");
    }
  };

  // Handlers de los inputs del código 2FA
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return;
    const newCode = [...twoFACode];
    newCode[index] = value;
    setTwoFACode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !twoFACode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const newCode = [...twoFACode];
    for (let i = 0; i < pasted.length && i < 6; i++) newCode[i] = pasted[i];
    setTwoFACode(newCode);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFACode.join("").length !== 6) { toast.error("Ingresa el código de 6 dígitos"); return; }
    const config = roleConfig[twoFARole];
    toast.success(`Verificación exitosa — ingresando como ${config.label}`);
    setShow2FA(false);
    setTimeout(() => navigate(config.destination), 600);
  };

  const handleResend = () => toast.success("Se ha enviado un nuevo código a tu correo");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar del home */}
      <HomeNavbar />

      {/* Contenedor con imagen de fondo */}
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/30"></div>
        </div>

        {/* Grid de dos columnas */}
        <div className="relative min-h-full grid grid-cols-1 lg:grid-cols-2 py-10 px-6 lg:px-0">

          {/* ── Columna Izquierda: Branding ── */}
          <div className="flex flex-col px-6 lg:px-16 py-6 space-y-6">
            {/* Flecha regresar (sutil pero visible) */}
            <div>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-xs font-medium group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Volver al inicio
              </button>
            </div>

            {/* Logo / Branding */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-[#2B6FCC] font-bold text-2xl">SG</span>
                </div>
                <div className="text-white">
                  <h1 className="font-bold text-2xl leading-tight">SILTGOV</h1>
                  <p className="text-sm text-gray-200 mt-0.5">Gobernación del Valle del Cauca</p>
                </div>
              </div>

              {/* Línea decorativa */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-0.5 bg-[#FCDC00]"></div>
                <div className="w-3 h-0.5 bg-white/40"></div>
              </div>

              {/* Descripción */}
              <p className="text-white/80 text-sm leading-relaxed max-w-xs mb-7">
                Sistema Integrado de Liquidaciones Gubernamentales para la gestión
                eficiente de sentencias judiciales.
              </p>

              {/* Badges institucionales */}
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FCDC00]"></div>
                  <span className="text-white/70 text-xs">Plataforma oficial del Valle del Cauca</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#34A853]"></div>
                  <span className="text-white/70 text-xs">Seguridad y verificación en dos pasos</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5B9BDE]"></div>
                  <span className="text-white/70 text-xs">Acceso restringido a usuarios autorizados</span>
                </div>
              </div>

              {/* ¿Necesitas ayuda? — justo debajo del contenido */}
              <div>
                <p className="text-white/50 text-xs mb-3 uppercase tracking-wider">¿Necesitas ayuda?</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowGuide(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FFE87C] to-[#FFE04D] text-gray-900 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all text-sm font-semibold"
                  >
                    <BookOpen size={17} />
                    Guía de Acceso
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Columna Derecha: Formulario ── */}
          <div className="flex items-center justify-center px-6 py-6 lg:px-16 lg:py-16">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
                <p className="text-sm text-gray-600">Ingresa tus credenciales para acceder</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] focus:border-transparent"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 text-[#5B9BDE] border-gray-300 rounded focus:ring-[#5B9BDE]"
                  />
                  <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
                    Acepto los{" "}
                    <a href="#" className="text-[#5B9BDE] hover:underline">términos y condiciones</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#5B9BDE] text-white py-2.5 rounded-lg hover:bg-[#4A8BD1] transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
                >
                  Ingresar
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs text-[#5B9BDE] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </form>

              {/* Usuarios de prueba */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-700 mb-2 font-medium flex items-center gap-1.5">
                  <HelpCircle size={14} /> Usuarios de prueba:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• super@example.com — Superusuario</li>
                  <li>• admin@example.com — Administrador</li>
                  <li>• liquidador@example.com — Liquidador</li>
                  <li>• pagador@example.com — Pagador</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HomeFooter />

      {/* ── Overlay 2FA ──────────────────────────────────────────────── */}
      {show2FA && (() => {
        const config = roleConfig[twoFARole];
        const RoleIcon = config.icon;
        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden z-10">
              {/* Banner de rol */}
              <div className={`${config.color} px-5 py-4`}>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShow2FA(false)}
                    className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-xs"
                  >
                    <ArrowLeft size={14} /> Volver
                  </button>
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
                    <RoleIcon size={13} className="text-white" />
                    <span className="text-white text-xs font-semibold">{config.label}</span>
                  </div>
                  <button onClick={() => setShow2FA(false)} className="text-white/60 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Ícono y título */}
                <div className="text-center mb-5">
                  <div className="w-14 h-14 bg-[#1C5BB8] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Shield className="text-white" size={26} />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">Verificación en Dos Pasos</h2>
                  <p className="text-xs text-gray-500">Código enviado a</p>
                  <p className="text-xs font-medium text-[#1C5BB8] mt-0.5 break-all">{email}</p>
                </div>

                {/* Destino */}
                <div className={`flex items-center gap-3 ${config.lightColor} border ${config.borderColor} rounded-xl p-3 mb-5`}>
                  <div className={`w-7 h-7 ${config.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <RoleIcon size={13} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-500">Al verificar, accederás a</p>
                    <p className={`text-xs font-semibold ${config.textColor}`}>{config.description}</p>
                  </div>
                </div>

                {/* Inputs del código */}
                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2.5 text-center">
                      Ingresa el código de 6 dígitos
                    </label>
                    <div className="flex gap-2 justify-center">
                      {twoFACode.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleCodeKeyDown(index, e)}
                          onPaste={handleCodePaste}
                          style={{ height: "48px" }}
                          className={`w-10 text-center text-base font-bold border-2 rounded-xl focus:outline-none transition-all ${
                            digit
                              ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]"
                              : "border-gray-200 text-gray-900 focus:border-[#1C5BB8]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full ${config.color} text-white py-2.5 rounded-xl hover:opacity-90 transition-all font-medium shadow-md text-sm`}
                  >
                    Verificar y Acceder
                  </button>
                </form>

                {/* Reenviar */}
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-400">¿No recibiste el código?</p>
                  <button onClick={handleResend} className="flex items-center gap-1 text-xs text-[#1C5BB8] hover:underline font-medium">
                    <RotateCcw size={11} /> Reenviar
                  </button>
                </div>

                {/* Demo hint */}
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="text-[11px] text-gray-500 text-center">
                    <span className="font-medium text-gray-600">Modo demo:</span>{" "}
                    usa cualquier código de 6 dígitos, ej.{" "}
                    <span className="font-mono font-semibold text-[#1C5BB8]">123456</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Modal Guía de Acceso ─────────────────────────────────────── */}
      {showGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowGuide(false)}></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-[#1C5BB8]" size={20} />
                  <h2 className="text-base font-semibold text-gray-900">Guía de Inicio de Sesión</h2>
                </div>
                <button onClick={() => setShowGuide(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { num: "1", title: "Ingresa tu correo electrónico", desc: "Utiliza el correo institucional asignado por tu administrador." },
                  { num: "2", title: "Escribe tu contraseña", desc: "Asegúrate de ingresar la contraseña correcta. Es sensible a mayúsculas." },
                  { num: "3", title: "Acepta los términos", desc: "Marca la casilla para aceptar los términos y condiciones de uso." },
                  { num: "4", title: "Haz clic en Ingresar", desc: "Si tus credenciales son correctas, serás redirigido al sistema." },
                  { num: "5", title: "Verificación en dos pasos (si aplica)", desc: "Revisa tu correo para el código de verificación de 6 dígitos.", yellow: true },
                ].map((step) => (
                  <div key={step.num} className="flex gap-3">
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full ${step.yellow ? "bg-[#FCDC00] text-gray-900" : "bg-[#1C5BB8] text-white"} flex items-center justify-center text-xs font-semibold`}>
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{step.title}</h3>
                      <p className="text-xs text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-gray-700">
                    <strong>Importante:</strong> Si tienes problemas para acceder, contacta al administrador de tu entidad o escribe a soporte@siltgov.gov.co
                  </p>
                </div>
              </div>
              <div className="p-5 border-t border-gray-200 flex justify-end">
                <button onClick={() => setShowGuide(false)} className="px-4 py-2 bg-[#1C5BB8] text-white rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium">
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
