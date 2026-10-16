import { useNavigate } from "react-router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { 
  Shield, 
  CheckCircle, 
  FileText, 
  BarChart3,
  Lock,
  Zap,
  ArrowRight,
  ChevronRight,
  Phone,
  Mail,
  ChevronLeft
} from "lucide-react";
import { HomeNavbar } from "../components/HomeNavbar";
import { HomeFooter } from "../components/HomeFooter";

export function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description: "Sistema de encriptación de datos y auditoría completa de todas las operaciones"
    },
    {
      icon: FileText,
      title: "Gestión de Sentencias",
      description: "Administración integral de sentencias judiciales desde su registro hasta el pago"
    },
    {
      icon: BarChart3,
      title: "Reportes en Tiempo Real",
      description: "Estadísticas y reportes actualizados para toma de decisiones informadas"
    },
    {
      icon: Zap,
      title: "Proceso Automatizado",
      description: "Cálculo automático de liquidaciones con normativa colombiana vigente"
    }
  ];

  // Configuración del carrusel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ],
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1D4ED8] via-[#1E40AF] to-[#1E3A8A] text-gray-900 py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#B8D4FF] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C7E2FF] rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-block bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full mb-5 border border-gray-200">
                <span className="text-xs font-medium text-gray-700">Gobierno de Colombia</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-5 leading-tight text-gray-100">
                Gestión Transparente de Liquidaciones Gubernamentales
              </h1>
              <p className="text-base text-gray-200 mb-6">
                Sistema integral para el procesamiento, cálculo y seguimiento de sentencias judiciales y liquidaciones con total trazabilidad y cumplimiento normativo.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-[#5B9BDE] text-white px-6 py-2.5 rounded-lg hover:bg-[#4A8BD1] transition-colors text-sm font-semibold flex items-center gap-2 shadow-md"
                >
                  Acceder al Sistema
                  <ArrowRight size={16} />
                </button>
                <a
                  href="#about"
                  className="bg-white text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold border border-gray-300"
                >
                  Conocer Más
                </a>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#B8D4FF]/30 rounded-3xl blur-2xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1672851612972-651dd2bb6363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMGdvdmVybm1lbnQlMjBzZWN1cml0eSUyMHRlY2hub2xvZ3klMjBzaGllbGR8ZW58MXx8fHwxNzcyMzI4MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Sistema Seguro"
                  className="relative w-full h-80 object-cover rounded-2xl shadow-xl border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Características Principales
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Una solución completa diseñada para optimizar la gestión de liquidaciones gubernamentales
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#5B9BDE] to-[#4A8BD1] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-white" size={22} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios y Seguridad - Carrusel de Flashcards */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Seguridad y Beneficios del Sistema
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              SILTGOV garantiza la máxima seguridad y eficiencia en el manejo de liquidaciones gubernamentales
            </p>
          </div>

          <div className="carousel-container">
            <Slider {...sliderSettings}>
              {/* Flashcard 1 */}
              <div className="px-3">
                <div className="relative bg-gradient-to-br from-[#D6E8FA] to-[#C1DBFA] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-72">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/40 rounded-full flex items-center justify-center">
                    <Lock size={24} className="text-[#2B6FCC]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 mt-8">Encriptación de Datos</h3>
                  <p className="text-sm text-gray-700">
                    Todos los datos se encriptan con algoritmos de última generación (AES-256), garantizando la confidencialidad de la información sensible.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-400/30">
                    <span className="text-xs text-gray-600 font-medium">✓ Certificado ISO 27001</span>
                  </div>
                </div>
              </div>

              {/* Flashcard 2 */}
              <div className="px-3">
                <div className="relative bg-gradient-to-br from-[#D4EDD9] to-[#BDE3C5] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-72">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/40 rounded-full flex items-center justify-center">
                    <Shield size={24} className="text-[#5FA96E]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 mt-8">Autenticación 2FA</h3>
                  <p className="text-sm text-gray-700">
                    Sistema de verificación en dos pasos que protege las cuentas contra accesos no autorizados, cumpliendo estándares gubernamentales.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-400/30">
                    <span className="text-xs text-gray-600 font-medium">✓ Doble factor obligatorio</span>
                  </div>
                </div>
              </div>

              {/* Flashcard 3 */}
              <div className="px-3">
                <div className="relative bg-gradient-to-br from-[#F7D6D6] to-[#F5C4C4] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-72">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/40 rounded-full flex items-center justify-center">
                    <FileText size={24} className="text-[#D65757]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 mt-8">Auditoría Completa</h3>
                  <p className="text-sm text-gray-700">
                    Registro detallado de cada acción: usuario, fecha, hora y tipo de operación. Trazabilidad total para cumplimiento normativo.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-400/30">
                    <span className="text-xs text-gray-600 font-medium">✓ 100% trazable</span>
                  </div>
                </div>
              </div>

              {/* Flashcard 4 */}
              <div className="px-3">
                <div className="relative bg-gradient-to-br from-[#FFF4D1] to-[#FFEDB3] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-72">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/40 rounded-full flex items-center justify-center">
                    <Zap size={24} className="text-[#D4A547]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 mt-8">Cálculos Automatizados</h3>
                  <p className="text-sm text-gray-700">
                    Procesamiento automático de liquidaciones basado en normativa colombiana vigente: IPC, intereses moratorios, corrientes y deducciones aplicables.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-400/30">
                    <span className="text-xs text-gray-600 font-medium">✓ Precisión del 100%</span>
                  </div>
                </div>
              </div>

              {/* Flashcard 5 */}
              <div className="px-3">
                <div className="relative bg-gradient-to-br from-[#E0E9F7] to-[#D0DFEF] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-72">
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/40 rounded-full flex items-center justify-center">
                    <BarChart3 size={24} className="text-[#5B8BC4]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 mt-8">Reportes en Tiempo Real</h3>
                  <p className="text-sm text-gray-700">
                    Dashboards interactivos con estadísticas actualizadas, exportación a PDF/Excel y visualización de datos para toma de decisiones informadas.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-400/30">
                    <span className="text-xs text-gray-600 font-medium">✓ Información al instante</span>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </section>

      {/* Atención Ciudadana Section - Similar a gov.co */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#34A853]/20 via-[#CE1126]/20 to-[#FCDC00]/20 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1568623421216-cf2db9a325c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHNtaWxpbmclMjB3ZWxjb21pbmd8ZW58MXx8fHwxNzcyMzI2NzkzfDA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Atención Ciudadana"
                className="relative rounded-2xl shadow-xl w-full"
              />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Atención y Servicios
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Accede a nuestros canales de atención y servicios disponibles para la ciudadanía
              </p>
              
              <div className="space-y-2.5">
                <button 
                  onClick={() => navigate("/faq")}
                  className="w-full flex items-center justify-between bg-gradient-to-r from-[#CE1126] to-[#D32F2F] text-white px-5 py-3 rounded-xl hover:shadow-lg transition-all group"
                >
                  <span className="text-sm font-semibold">Preguntas Frecuentes</span>
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
                
                <button 
                  onClick={() => navigate("/about")}
                  className="w-full flex items-center justify-between bg-gradient-to-r from-[#CE1126] to-[#D32F2F] text-white px-5 py-3 rounded-xl hover:shadow-lg transition-all group"
                >
                  <span className="text-sm font-semibold">Sobre Nosotros</span>
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Sobre SILTGOV
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                El Sistema Integrado de Liquidaciones Gubernamentales es una iniciativa tecnológica de la Gobernación del Valle del Cauca, desarrollada para modernizar y optimizar el procesamiento de sentencias judiciales y liquidaciones.
              </p>
              <p className="text-sm text-gray-600 mb-5">
                Nuestra plataforma garantiza transparencia, eficiencia y cumplimiento normativo en cada etapa del proceso, desde el registro de la sentencia hasta el pago final, proporcionando trazabilidad completa y reportes en tiempo real.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#34A853] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="text-white" size={13} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Cumplimiento Normativo</h4>
                    <p className="text-xs text-gray-600">Alineado con la legislación colombiana vigente</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#34A853] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="text-white" size={13} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Transparencia Total</h4>
                    <p className="text-xs text-gray-600">Auditoría completa de todas las operaciones</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#34A853] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="text-white" size={13} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Eficiencia Operativa</h4>
                    <p className="text-xs text-gray-600">Automatización de procesos complejos</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#1C5BB8] to-[#1850A0] p-6 rounded-2xl text-white shadow-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🇨🇴</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Respaldo Oficial</h3>
                  <p className="text-xs text-blue-100">Gobierno de Colombia</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lock size={16} />
                    <h4 className="text-sm font-semibold">Certificación Oficial</h4>
                  </div>
                  <p className="text-xs text-blue-100">
                    Sistema certificado y avalado por el Ministerio de Tecnologías de la Información y las Comunicaciones
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Shield size={16} />
                    <h4 className="text-sm font-semibold">Gobernación del Valle</h4>
                  </div>
                  <p className="text-xs text-blue-100">
                    Desarrollado e implementado por la Gobernación del Valle del Cauca para optimizar la gestión pública
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Contáctenos
            </h2>
            <p className="text-sm text-gray-600">
              Estamos disponibles para atender sus consultas y solicitudes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-[#1C5BB8]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="text-[#1C5BB8]" size={22} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Teléfono</h3>
              <p className="text-sm text-gray-600">+57 (2) 620 00 00</p>
              <p className="text-xs text-gray-500 mt-1">Lun - Vie, 8:00 AM - 5:00 PM</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-[#1C5BB8]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="text-[#1C5BB8]" size={22} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">Correo Electrónico</h3>
              <p className="text-xs text-gray-600">siltgov@valledelcauca.gov.co</p>
              <p className="text-xs text-gray-500 mt-1">Respuesta en 24-48 horas</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-[#1C5BB8]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="text-[#1C5BB8]" size={22} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">PSQR</h3>
              <p className="text-xs text-gray-600">Sistema de atención ciudadana</p>
              <button className="mt-2 text-[#1C5BB8] hover:underline text-xs font-medium">
                Crear solicitud →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-[#1C5BB8] via-[#1850A0] to-[#144A8E] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FCDC00] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#CE1126] rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl font-bold mb-3">
            ¿Listo para comenzar?
          </h2>
          <p className="text-base text-blue-100 mb-6">
            Accede al sistema y gestiona tus liquidaciones de manera eficiente y segura
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#FCDC00] text-gray-900 px-6 py-2.5 rounded-lg hover:bg-[#FBBC05] transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate("/about")}
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg hover:bg-white/20 transition-all text-sm font-semibold border border-white/20"
            >
              Más Información
            </button>
          </div>
        </div>
      </section>
      </main>

      <HomeFooter />
    </div>
  );
}

// Componentes para los botones de navegación del carrusel
function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "rgba(0, 0, 0, 0.5)", borderRadius: "50%", padding: "10px" }}
      onClick={onClick}
    >
      <ChevronRight size={24} className="text-white" />
    </div>
  );
}

function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "rgba(0, 0, 0, 0.5)", borderRadius: "50%", padding: "10px" }}
      onClick={onClick}
    >
      <ChevronLeft size={24} className="text-white" />
    </div>
  );
}