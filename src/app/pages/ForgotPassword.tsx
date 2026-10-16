import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }

    // Simulación de envío
    setTimeout(() => {
      setSent(true);
      toast.success("Se ha enviado un enlace de recuperación a tu correo");
    }, 1000);
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
        
        {/* Patrón de cuadrícula */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Contenido */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 backdrop-blur-sm">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#1C5BB8] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Volver al inicio de sesión</span>
        </button>

        {!sent ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#1C5BB8] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="text-white" size={32} />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Recuperar Contraseña</h1>
              <p className="text-sm text-gray-600 mt-2">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C5BB8] focus:border-transparent"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1C5BB8] text-white py-3 rounded-lg hover:bg-[#1850A0] transition-colors font-medium"
              >
                Enviar Enlace de Recuperación
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-[#34A853]" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Correo Enviado
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="text-[#1C5BB8] hover:underline text-sm font-medium"
            >
              Volver al inicio de sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
