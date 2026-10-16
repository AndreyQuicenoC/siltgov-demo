import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";
import { User, Lock, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function Profile() {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    fullName: "Usuario Ejemplo",
    document: "1234567890",
    email: "usuario@example.com",
    phone: "3001234567",
    position: "Administrador",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSaveProfile = () => {
    toast.success("Perfil actualizado exitosamente");
  };

  const handleChangePassword = () => {
    if (!passwordData.current) {
      toast.error("Ingresa tu contraseña actual");
      return;
    }
    if (passwordData.new.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    toast.success("Contraseña actualizada exitosamente");
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header con botón regresar */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors mt-0.5 flex-shrink-0"
        >
          <ArrowLeft size={14} />
          Regresar
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gestiona tu información personal y seguridad de acceso</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User size={18} className="text-[#1C5BB8]" />
              <CardTitle>Información Personal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Documento</label>
                <input
                  type="text"
                  value={profileData.document}
                  onChange={(e) => setProfileData({ ...profileData, document: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8] focus:outline-none"
                />
              </div>

              {/* Correo — bloqueado para todos los roles */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail size={12} className="text-gray-400" />
                  Correo Institucional
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
                    <Lock size={9} /> No editable
                  </span>
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed select-none"
                  title="El correo institucional no puede modificarse"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Para cambiar tu correo, contacta al área de sistemas.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Número de Contacto
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Cargo</label>
                <input
                  type="text"
                  value={profileData.position}
                  onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8] focus:outline-none"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                className="w-full px-4 py-2.5 bg-[#1C5BB8] text-white rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium"
              >
                Guardar Cambios
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Cambiar Contraseña */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-[#1C5BB8]" />
              <CardTitle>Cambiar Contraseña</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8] focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8] focus:outline-none"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8] focus:outline-none"
                  placeholder="Repite la nueva contraseña"
                />
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-[11px] text-amber-700">
                  Usa una contraseña segura con al menos 8 caracteres, incluyendo mayúsculas, números y símbolos.
                </p>
              </div>
              <button
                onClick={handleChangePassword}
                className="w-full px-4 py-2.5 bg-[#1C5BB8] text-white rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium"
              >
                Cambiar Contraseña
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
