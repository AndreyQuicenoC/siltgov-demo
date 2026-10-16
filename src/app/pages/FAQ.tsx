import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, HelpCircle, Search, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router";
import { HomeNavbar } from "../components/HomeNavbar";
import { HomeFooter } from "../components/HomeFooter";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const allFAQs: FAQItem[] = [
  { id: 1,  question: "¿Qué es SILTGOV?", answer: "SILTGOV (Sistema Integrado de Liquidaciones Gubernamentales) es una plataforma tecnológica desarrollada para la gestión integral de sentencias judiciales y liquidaciones de la Gobernación del Valle del Cauca, garantizando transparencia, eficiencia y trazabilidad en todos los procesos.", category: "General" },
  { id: 2,  question: "¿Quiénes pueden usar el sistema?", answer: "El sistema cuenta con cuatro roles diferenciados: Superusuario (administración general), Administrador (gestión de entidades y usuarios), Liquidador (procesamiento de liquidaciones) y Pagador (registro de pagos efectuados).", category: "Acceso" },
  { id: 3,  question: "¿Cómo se calculan las liquidaciones?", answer: "Las liquidaciones se calculan conforme a la normativa colombiana vigente, incluyendo capital base, actualización monetaria, intereses corrientes y moratorios, IPC cuando aplica, y deducciones correspondientes. El sistema valida automáticamente tasas y periodos según la legislación aplicable.", category: "Liquidaciones" },
  { id: 4,  question: "¿Es seguro el sistema?", answer: "Sí, SILTGOV implementa encriptación de datos de extremo a extremo, autenticación de dos factores, registro de auditoría completo y cumple con los estándares de seguridad del Gobierno Nacional.", category: "Seguridad" },
  { id: 5,  question: "¿Cómo puedo reportar un problema?", answer: "Puede utilizar el sistema PSQR (Peticiones, Quejas, Sugerencias y Reclamos) disponible en todas las secciones de la plataforma, o contactar directamente a la línea de soporte técnico al +57 (2) 620 00 00.", category: "Soporte" },
  { id: 6,  question: "¿Qué documentos genera el sistema?", answer: "El sistema genera documentos PDF oficiales con firma digital para cada liquidación, incluyendo el detalle desglosado por concepto, validaciones realizadas, responsable del proceso y fecha de corte.", category: "Documentos" },
  { id: 7,  question: "¿Cómo obtengo acceso al sistema?", answer: "El acceso debe ser solicitado a través del administrador de su entidad. Una vez aprobado, recibirá sus credenciales de acceso por correo electrónico junto con las instrucciones para el primer ingreso.", category: "Acceso" },
  { id: 8,  question: "¿Qué hago si olvido mi contraseña?", answer: "En la pantalla de inicio de sesión, haga clic en '¿Olvidaste tu contraseña?' e ingrese su correo electrónico. Recibirá un enlace para restablecer su contraseña que tendrá validez de 24 horas.", category: "Acceso" },
  { id: 9,  question: "¿Qué es la verificación en dos pasos?", answer: "Es una medida de seguridad adicional que requiere, además de su contraseña, un código de 6 dígitos enviado a su correo electrónico. Este código debe ingresarse cada vez que inicie sesión (excepto para Superusuarios).", category: "Seguridad" },
  { id: 10, question: "¿Puedo acceder desde dispositivos móviles?", answer: "Sí, SILTGOV es completamente responsivo y puede accederse desde cualquier dispositivo con conexión a internet, incluyendo smartphones, tablets y computadores.", category: "General" },
  { id: 11, question: "¿Cuánto tiempo toma procesar una liquidación?", answer: "El tiempo de procesamiento depende de la complejidad del caso. Una liquidación simple puede procesarse en minutos, mientras que casos más complejos pueden requerir revisiones adicionales que tomen algunos días hábiles.", category: "Liquidaciones" },
  { id: 12, question: "¿Se pueden modificar liquidaciones ya generadas?", answer: "Las liquidaciones generadas quedan registradas en el sistema. Si se detecta un error, debe crearse una nueva versión con la corrección correspondiente, manteniendo el historial completo para auditoría.", category: "Liquidaciones" },
  { id: 13, question: "¿Qué tipos de interés se pueden calcular?", answer: "El sistema permite calcular intereses legales civiles, intereses comerciales e intereses moratorios según la legislación colombiana. También permite aplicar IPC cuando la sentencia así lo ordena.", category: "Liquidaciones" },
  { id: 14, question: "¿Cómo funciona el sistema de auditoría?", answer: "Todas las acciones en el sistema quedan registradas con fecha, hora, usuario responsable y tipo de operación. Los Superusuarios pueden acceder a estos registros para realizar seguimiento y auditorías completas.", category: "Seguridad" },
  { id: 15, question: "¿Qué información se requiere para crear una sentencia?", answer: "Se requiere información del juzgado, número de radicado, partes involucradas, tipo de sentencia, fecha de ejecutoria, monto condenado y documentos de soporte en formato PDF.", category: "Documentos" },
  { id: 16, question: "¿Hay capacitación disponible para nuevos usuarios?", answer: "Sí, la Gobernación ofrece capacitaciones periódicas para nuevos usuarios. Además, está disponible un manual de usuario completo en la sección de ayuda del sistema.", category: "Soporte" },
];

export function FAQ() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [openId, setOpenId] = useState<number | null>(null);
  const itemsPerPage = 8;

  // ── SEO ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Preguntas Frecuentes | SILTGOV — Sistema Integrado de Liquidaciones Gubernamentales";

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = meta?.content ?? "";
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Resuelve tus dudas sobre SILTGOV: acceso al sistema, roles de usuario, cálculo de liquidaciones, seguridad, documentos y soporte técnico.";

    let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement("meta"); ogTitle.setAttribute("property", "og:title"); document.head.appendChild(ogTitle); }
    ogTitle.content = "FAQ | SILTGOV — Preguntas Frecuentes";

    return () => {
      document.title = prevTitle;
      if (meta) meta.content = prevDesc;
    };
  }, []);

  const categories = ["Todas", ...Array.from(new Set(allFAQs.map((f) => f.category)))];

  const filtered = allFAQs.filter((faq) => {
    const matchSearch =
      !searchTerm ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "Todas" || faq.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFAQs = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HomeNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1C5BB8] to-[#1850A0] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/15 rounded-2xl mb-4">
            <HelpCircle size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Preguntas Frecuentes</h1>
          <p className="text-sm text-blue-100 max-w-2xl mx-auto">
            Encuentra respuestas rápidas y detalladas a las consultas más comunes sobre SILTGOV
          </p>
        </div>
      </section>

      {/* Búsqueda y filtros */}
      <section className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Buscar pregunta o respuesta..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1C5BB8] focus:border-transparent bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#1C5BB8] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ acordeón */}
      <section className="py-10 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">{filtered.length} preguntas encontradas</p>
          </div>

          {currentFAQs.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-400">No se encontraron preguntas que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {currentFAQs.map((faq) => (
                <div key={faq.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1C5BB8]/10 text-[#1C5BB8] text-[10px] font-bold flex items-center justify-center mt-0.5">
                        {faq.id}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="hidden sm:inline-block px-2 py-0.5 bg-[#1C5BB8]/8 text-[#1C5BB8] rounded-full text-[10px] font-medium">
                        {faq.category}
                      </span>
                      <ChevronRight
                        size={15}
                        className={`text-gray-400 transition-transform flex-shrink-0 ${openId === faq.id ? "rotate-90" : ""}`}
                      />
                    </div>
                  </button>
                  {openId === faq.id && (
                    <div className="px-5 pb-4 pt-0">
                      <div className="ml-9 pl-0 border-l-2 border-[#1C5BB8]/20 pl-4">
                        <p className="text-xs text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-gray-500">
                Mostrando {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filtered.length)} de {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-xs"
                >
                  <ChevronLeft size={13} /> Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === page ? "bg-[#1C5BB8] text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 text-xs"
                >
                  Siguiente <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">¿No encontraste lo que buscabas?</h2>
              <p className="text-sm text-gray-500">Nuestro equipo de soporte está listo para ayudarte.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="mailto:siltgov@valledelcauca.gov.co"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#1C5BB8] hover:bg-blue-50 transition-all group"
              >
                <div className="w-9 h-9 bg-[#1C5BB8]/10 rounded-lg flex items-center justify-center group-hover:bg-[#1C5BB8]/20 transition-colors">
                  <Mail size={16} className="text-[#1C5BB8]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Escríbenos</p>
                  <p className="text-[10px] text-gray-400">siltgov@valledelcauca.gov.co</p>
                </div>
              </a>
              <a
                href="tel:+576200000"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#34A853] hover:bg-green-50 transition-all group"
              >
                <div className="w-9 h-9 bg-[#34A853]/10 rounded-lg flex items-center justify-center group-hover:bg-[#34A853]/20 transition-colors">
                  <Phone size={16} className="text-[#34A853]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Llámanos</p>
                  <p className="text-[10px] text-gray-400">+57 (2) 620 00 00 · Lun–Vie 8–17h</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}