import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Shield, ArrowLeft, User, Briefcase, CreditCard, Settings } from "lucide-react";
import { toast } from "sonner";

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

type Role = keyof typeof roleConfig;

export function TwoFactorAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lee desde location.state primero, luego sessionStorage como respaldo
  const stateRole = location.state?.role as Role | undefined;
  const stateEmail = location.state?.email as string | undefined;

  const role: Role =
    stateRole ??
    (sessionStorage.getItem("2fa_role") as Role | null) ??
    "admin";

  const email: string =
    stateEmail ??
    sessionStorage.getItem("2fa_email") ??
    "";

  const config = roleConfig[role] ?? roleConfig.admin;
  const RoleIcon = config.icon;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error("Por favor ingresa el código de 6 dígitos");
      return;
    }

    // Cualquier código de 6 dígitos es válido en modo demo
    toast.success(`Verificación exitosa — ingresando como ${config.label}`);
    // Limpia sessionStorage tras uso exitoso
    sessionStorage.removeItem("2fa_role");
    sessionStorage.removeItem("2fa_email");

    setTimeout(() => {
      navigate(config.destination);
    }, 600);
  };

  const resendCode = () => {
    toast.success("Se ha enviado un nuevo código a tu correo");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Fondo estético */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C5BB8] via-[#1850A0] to-[#144A8E]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#34A853] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#FBBC05] rounded-full blur-3xl"></div>
        </div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Tarjeta principal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Banner de rol */}
        <div className={`${config.color} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Volver
            </button>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
              <RoleIcon size={14} className="text-white" />
              <span className="text-white text-xs font-semibold">{config.label}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Ícono y título */}
          <div className="text-center mb-7">
            <div className="w-16 h-16 bg-[#1C5BB8] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="text-white" size={30} />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1.5">
              Verificación en Dos Pasos
            </h1>
            <p className="text-sm text-gray-500">
              Hemos enviado un código de 6 dígitos a
            </p>
            <p className="text-sm font-medium text-[#1C5BB8] mt-1 break-all">
              {email || "tu correo registrado"}
            </p>
          </div>

          {/* Destino de navegación */}
          <div className={`flex items-center gap-3 ${config.lightColor} border ${config.borderColor} rounded-xl p-3.5 mb-6`}>
            <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <RoleIcon size={15} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Al verificar, accederás a</p>
              <p className={`text-sm font-semibold ${config.textColor}`}>
                {config.description}
              </p>
            </div>
            <div className={`ml-auto text-xs ${config.textColor} font-mono opacity-70`}>
              {config.destination}
            </div>
          </div>

          {/* Inputs del código */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-3 text-center">
                Ingresa el código de verificación
              </label>
              <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-11 h-13 text-center text-lg font-bold border-2 rounded-xl focus:outline-none transition-all
                      ${digit
                        ? `border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]`
                        : "border-gray-200 text-gray-900 focus:border-[#1C5BB8]"
                      }`}
                    style={{ height: "52px" }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className={`w-full ${config.color} text-white py-2.5 rounded-xl hover:opacity-90 transition-all font-medium shadow-lg text-sm`}
            >
              Verificar y Acceder
            </button>
          </form>

          {/* Reenviar */}
          <div className="mt-5 text-center">
            <p className="text-xs text-gray-500 mb-1.5">¿No recibiste el código?</p>
            <button
              onClick={resendCode}
              className="text-xs text-[#1C5BB8] hover:underline font-medium"
            >
              Reenviar código
            </button>
          </div>

          {/* Hint demo */}
          <div className="mt-5 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 text-center">
              <span className="font-medium text-gray-600">Modo demo:</span>{" "}
              usa cualquier código de 6 dígitos, ej.{" "}
              <span className="font-mono font-semibold text-[#1C5BB8]">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
