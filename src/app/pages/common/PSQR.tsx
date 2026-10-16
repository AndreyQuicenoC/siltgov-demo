import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/Card";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const previousRequests = [
  { id: "1", type: "Petición", subject: "Solicitud de información", date: "2026-02-20", status: "En proceso" },
  { id: "2", type: "Queja", subject: "Demora en proceso", date: "2026-02-15", status: "Resuelta" },
];

export function PSQR() {
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    description: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("PSQR enviada exitosamente. Recibirá respuesta en máximo 15 días hábiles.");
    setFormData({ type: "", subject: "", description: "", email: "", phone: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">PSQR</h1>
        <p className="text-gray-600 mt-1">
          Peticiones, Quejas, Sugerencias y Reclamos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <CardTitle>Nueva PSQR</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Solicitud
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8]"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="petition">Petición</option>
                    <option value="complaint">Queja</option>
                    <option value="suggestion">Sugerencia</option>
                    <option value="claim">Reclamo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8]"
                    placeholder="Breve descripción del asunto"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción Detallada
                  </label>
                  <textarea
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8]"
                    placeholder="Describa en detalle su petición, queja, sugerencia o reclamo..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C5BB8]"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-[#1C5BB8] text-white rounded-lg hover:bg-[#1850A0] transition-colors"
                  >
                    <Send size={20} />
                    Enviar PSQR
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Mis Solicitudes Anteriores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previousRequests.map((request) => (
                  <div key={request.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-[#1C5BB8]">{request.type}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          request.status === "Resuelta"
                            ? "bg-green-100 text-[#34A853]"
                            : "bg-yellow-100 text-[#FBBC05]"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{request.subject}</p>
                    <p className="text-xs text-gray-500">{request.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 mb-2">Línea de Atención</p>
                <p className="text-lg font-semibold text-[#1C5BB8]">018000 123 456</p>
                <p className="text-xs text-gray-600 mt-2">
                  Lunes a Viernes
                  <br />
                  8:00 AM - 5:00 PM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
