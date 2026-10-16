import { useState } from "react";
import { Mail, Phone, MapPin, FileText, Shield, Book, X } from "lucide-react";
import { useNavigate } from "react-router";

function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1C5BB8]/10 rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-[#1C5BB8]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Términos y Condiciones</h2>
              <p className="text-[10px] text-gray-400">SILTGOV — Versión 2.1 · Vigencia: enero 2026</p>
            </div>
          </div>
          <button type="button" aria-label="Cerrar términos y condiciones" title="Cerrar" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} className="text-gray-500" aria-hidden />
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 text-xs text-gray-600 leading-relaxed">
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">1. Alcance y Objeto</h3>
            <p>El Sistema Integrado de Liquidaciones Gubernamentales — SILTGOV — es una plataforma tecnológica de la Gobernación del Valle del Cauca (en adelante "la Gobernación") destinada exclusivamente a la gestión interna de sentencias judiciales y liquidaciones a cargo de entidades públicas departamentales. El acceso y uso de SILTGOV implica la aceptación plena de los presentes Términos y Condiciones.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">2. Acceso y Usuarios Autorizados</h3>
            <p>El acceso a SILTGOV está restringido exclusivamente a funcionarios públicos debidamente habilitados mediante credenciales institucionales. Existen cuatro perfiles de usuario: Superusuario, Administrador, Liquidador y Pagador, cada uno con atribuciones específicas. Cualquier uso no autorizado o intento de acceso indebido será reportado a las autoridades competentes y podrá dar lugar a responsabilidad disciplinaria, civil y penal.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">3. Obligaciones del Usuario</h3>
            <p>El usuario se compromete a: (a) mantener la confidencialidad de sus credenciales de acceso; (b) no compartir ni transferir su cuenta a terceros; (c) utilizar el sistema únicamente para los fines institucionales autorizados; (d) reportar de inmediato cualquier uso indebido o sospechoso de su cuenta; (e) no intentar vulnerar, modificar o interferir con el funcionamiento del sistema.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">4. Uso Permitido del Sistema</h3>
            <p>SILTGOV debe utilizarse únicamente para el registro, cálculo, revisión y seguimiento de liquidaciones judiciales en el ámbito de competencia asignado. Queda expresamente prohibido: el uso del sistema para fines personales o privados, la exportación masiva de información sin autorización, la manipulación de registros históricos fuera del flujo establecido, y cualquier acción que altere la integridad de los datos.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">5. Propiedad Intelectual</h3>
            <p>SILTGOV, incluyendo su código fuente, diseño, bases de datos, algoritmos de cálculo y documentación, es propiedad exclusiva de la Gobernación del Valle del Cauca. Queda prohibida cualquier reproducción, distribución o uso comercial sin autorización expresa por escrito de la Gobernación.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">6. Disponibilidad y Mantenimiento</h3>
            <p>La Gobernación se reserva el derecho de realizar mantenimientos programados que puedan generar interrupciones temporales del servicio. Se realizarán esfuerzos razonables para notificar con anticipación, pero no se garantiza disponibilidad continua del sistema. Las interrupciones por causas de fuerza mayor o fallas de terceros no generan responsabilidad para la Gobernación.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">7. Responsabilidad</h3>
            <p>La Gobernación del Valle del Cauca no se hace responsable por daños derivados del uso incorrecto del sistema, pérdida de información por causas imputables al usuario, o consecuencias de decisiones tomadas con base en información del sistema que no haya sido debidamente validada por los funcionarios competentes.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">8. Modificaciones</h3>
            <p>La Gobernación se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados a los usuarios a través del sistema y entrarán en vigor a los 15 días hábiles siguientes a su publicación.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">9. Legislación Aplicable</h3>
            <p>Los presentes Términos se rigen por la legislación colombiana vigente, en especial la Ley 1581 de 2012, el Decreto 1377 de 2013, la Ley 594 de 2000 (Ley General de Archivos) y demás normas concordantes. Cualquier disputa será resuelta ante los jueces competentes de la ciudad de Cali, Colombia.</p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs font-semibold hover:bg-[#1850A0] transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#34A853]/10 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-[#34A853]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Política de Privacidad</h2>
              <p className="text-[10px] text-gray-400">SILTGOV — Conforme a la Ley 1581 de 2012</p>
            </div>
          </div>
          <button type="button" aria-label="Cerrar política de privacidad" title="Cerrar" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} className="text-gray-500" aria-hidden />
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 text-xs text-gray-600 leading-relaxed">
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">1. Responsable del Tratamiento</h3>
            <p>La Gobernación del Valle del Cauca, con domicilio en Calle 9 No. 3-14, Santiago de Cali, Colombia, es la entidad responsable del tratamiento de los datos personales recopilados a través de SILTGOV. Puede contactar al Oficial de Protección de Datos en: datospersonales@valledelcauca.gov.co.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">2. Datos Recopilados</h3>
            <p>SILTGOV recopila los siguientes datos de sus usuarios: nombre completo, número de cédula, cargo institucional, correo electrónico institucional, dependencia y oficina asignada. Adicionalmente, el sistema registra datos de actividad como: fecha y hora de acceso, acciones realizadas, dirección IP y dispositivo utilizado para efectos de auditoría.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">3. Finalidad del Tratamiento</h3>
            <p>Los datos son tratados para: (a) autenticar y autorizar el acceso de funcionarios al sistema; (b) asignar roles y permisos de acuerdo con la jerarquía institucional; (c) auditar todas las operaciones realizadas en el sistema; (d) generar reportes institucionales de gestión; (e) notificar a los usuarios sobre el estado de sus procesos asignados; (f) cumplir con las obligaciones legales y normativas aplicables.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">4. Bases Legales del Tratamiento</h3>
            <p>El tratamiento se fundamenta en: el cumplimiento de obligaciones legales derivadas de la vinculación laboral y/o contractual con la Gobernación, el interés legítimo en la seguridad y trazabilidad de los procesos judiciales, y la Ley 1581 de 2012 y su Decreto Reglamentario 1377 de 2013.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">5. Conservación de los Datos</h3>
            <p>Los datos de acceso y actividad se conservan durante el tiempo que dure la vinculación del funcionario y por un período adicional de 5 años, conforme a las tablas de retención documental aprobadas por el Archivo General de la Nación. Los registros de auditoría se conservan por un mínimo de 10 años.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">6. Seguridad de la Información</h3>
            <p>SILTGOV implementa medidas técnicas y organizativas proporcionales al riesgo: encriptación AES-256 para datos en tránsito y en reposo, autenticación de doble factor, controles de acceso basados en roles (RBAC), monitoreo continuo de seguridad, y procedimientos de respuesta a incidentes alineados con el MSPI del Gobierno Nacional.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">7. Derechos de los Titulares</h3>
            <p>Conforme a la Ley 1581 de 2012, los usuarios tienen derecho a: (a) conocer, actualizar y rectificar sus datos; (b) solicitar prueba de la autorización otorgada; (c) ser informados sobre el uso dado a sus datos; (d) presentar quejas ante la Superintendencia de Industria y Comercio; (e) revocar la autorización en los casos que aplique legalmente.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">8. Transferencia de Datos</h3>
            <p>Los datos personales no serán transferidos a terceros sin autorización previa, salvo en cumplimiento de obligaciones legales, órdenes judiciales o requerimientos de autoridades competentes en el ejercicio de sus funciones.</p>
          </section>
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">9. Actualizaciones de la Política</h3>
            <p>Esta Política de Privacidad puede ser actualizada periódicamente. Las modificaciones serán publicadas en SILTGOV con al menos 10 días hábiles de anticipación a su entrada en vigor. El uso continuado del sistema implica la aceptación de los cambios introducidos.</p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-[#34A853] text-white rounded-lg text-xs font-semibold hover:bg-[#2D9147] transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export function HomeFooter() {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="bg-[#0F2847] text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-[#1C5BB8] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">SG</span>
                </div>
                <span className="text-sm font-semibold text-white">SILTGOV</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Sistema Integrado de Liquidaciones Gubernamentales del Valle del Cauca
              </p>
            </div>

            {/* Enlaces */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate("/")} className="text-xs text-gray-400 hover:text-white transition-colors text-left">
                    Inicio
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/about")} className="text-xs text-gray-400 hover:text-white transition-colors text-left">
                    Sobre Nosotros
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/faq")} className="text-xs text-gray-400 hover:text-white transition-colors text-left">
                    Preguntas Frecuentes
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/login")} className="text-xs text-gray-400 hover:text-white transition-colors text-left">
                    Iniciar Sesión
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowTerms(true)}
                    className="text-xs text-gray-400 hover:text-white transition-colors text-left flex items-center gap-1.5"
                  >
                    <FileText size={11} className="flex-shrink-0" />
                    Términos y Condiciones
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowPrivacy(true)}
                    className="text-xs text-gray-400 hover:text-white transition-colors text-left flex items-center gap-1.5"
                  >
                    <Shield size={11} className="flex-shrink-0" />
                    Política de Privacidad
                  </button>
                </li>
                <li>
                  <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <Book size={11} className="flex-shrink-0" />
                    Manual de Usuario
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Contacto</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Phone size={11} className="mt-0.5 flex-shrink-0 text-gray-500" />
                  <span className="text-xs text-gray-400">+57 (2) 620 00 00</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail size={11} className="mt-0.5 flex-shrink-0 text-gray-500" />
                  <span className="text-xs text-gray-400">siltgov@valledelcauca.gov.co</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={11} className="mt-0.5 flex-shrink-0 text-gray-500" />
                  <span className="text-xs text-gray-400">Calle 9 # 3-14, Cali, Valle del Cauca</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700/60 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-500">© 2026 Gobernación del Valle del Cauca — SILTGOV</p>
            <div className="flex items-center gap-2">
              <span className="text-sm">🇨🇴</span>
              <p className="text-xs text-gray-500">Gobierno de Colombia</p>
            </div>
          </div>
        </div>
      </footer>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </>
  );
}