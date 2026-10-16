import { useNavigate } from "react-router";
import { useEffect } from "react";
import {
  Shield, CheckCircle, FileText, BarChart3, Zap, Lock,
  ArrowRight, Award, Globe, Clock, Heart, Target, Handshake, Star
} from "lucide-react";
import { HomeNavbar } from "../components/HomeNavbar";
import { HomeFooter } from "../components/HomeFooter";

// ── Datos de la página ────────────────────────────────────────────────────────

const stats = [
  { value: "2024",  label: "Año de lanzamiento" },
  { value: "100%",  label: "Respaldo gubernamental" },
  { value: "99.9%", label: "Disponibilidad garantizada" },
  { value: "0",     label: "Tolerancia a errores críticos" },
];

const values = [
  {
    icon: Shield,
    color: "text-[#1C5BB8]",
    bg: "bg-blue-50",
    title: "Integridad",
    desc: "Cada acción dentro del sistema queda registrada y es auditable. La veracidad de la información es inviolable y está protegida por diseño.",
  },
  {
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-50",
    title: "Servicio Público",
    desc: "Nuestro propósito es la ciudadanía. Facilitamos que el Estado cumpla sus obligaciones judiciales con prontitud, precisión y dignidad.",
  },
  {
    icon: Target,
    color: "text-[#34A853]",
    bg: "bg-green-50",
    title: "Precisión",
    desc: "Las liquidaciones deben ser exactas. Trabajamos bajo estándares de cero tolerancia al error en los cálculos que determinan obligaciones del Estado.",
  },
  {
    icon: Handshake,
    color: "text-amber-600",
    bg: "bg-amber-50",
    title: "Confianza",
    desc: "Construimos relaciones de confianza con las entidades y funcionarios que nos usan, porque manejamos información sensible que exige absoluta responsabilidad.",
  },
];

const valueProps = [
  {
    icon: Award,
    title: "Respaldo institucional sólido",
    desc: "SILTGOV es una iniciativa oficial de la Gobernación del Valle del Cauca, lo que garantiza continuidad, soporte institucional y alineación permanente con las políticas del Gobierno Nacional.",
    highlight: "Avalado por el Estado",
  },
  {
    icon: Lock,
    title: "Seguridad de clase gubernamental",
    desc: "Diseñado bajo el Marco de Seguridad Digital del Gobierno Nacional (MSPI), con estándares que superan los requerimientos mínimos de protección para plataformas de gestión pública.",
    highlight: "Cumple MSPI",
  },
  {
    icon: FileText,
    title: "Normativa siempre actualizada",
    desc: "El sistema incorpora la legislación colombiana vigente aplicable a las liquidaciones judiciales. Las actualizaciones normativas se reflejan en el sistema de forma oportuna, eliminando el riesgo de cálculos desactualizados.",
    highlight: "100% conforme a la ley",
  },
  {
    icon: BarChart3,
    title: "Visibilidad y rendición de cuentas",
    desc: "Cada entidad obtiene visibilidad completa sobre el estado de sus liquidaciones. SILTGOV facilita la rendición de cuentas ante organismos de control al mantener registros inmutables de cada operación.",
    highlight: "Trazabilidad total",
  },
  {
    icon: Globe,
    title: "Accesibilidad sin fricciones",
    desc: "Plataforma web disponible desde cualquier dispositivo, sin instalaciones ni requerimientos técnicos especiales. El acceso es fluido, seguro y consistente desde cualquier punto de trabajo.",
    highlight: "Siempre disponible",
  },
  {
    icon: Clock,
    title: "Reducción real de tiempos",
    desc: "Eliminamos la dependencia de cálculos manuales en hojas de cálculo y flujos de papel. El resultado: procesos que tardaban días ahora se completan en horas, con mayor precisión y menor riesgo.",
    highlight: "Eficiencia comprobada",
  },
];

export function About() {
  const navigate = useNavigate();

  // ── SEO: document title & meta description ──────────────────────────────────
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Sobre SILTGOV | Sistema Integrado de Liquidaciones Gubernamentales — Valle del Cauca";

    // Meta description
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = meta?.content ?? "";
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Conoce SILTGOV, la plataforma oficial de la Gobernación del Valle del Cauca para la gestión transparente, segura y trazable de sentencias judiciales y liquidaciones gubernamentales.";

    // OG tags
    let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement("meta"); ogTitle.setAttribute("property", "og:title"); document.head.appendChild(ogTitle); }
    ogTitle.content = "Sobre SILTGOV | Gobernación del Valle del Cauca";

    let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement("meta"); ogDesc.setAttribute("property", "og:description"); document.head.appendChild(ogDesc); }
    ogDesc.content = "Plataforma oficial para la gestión de liquidaciones judiciales del Valle del Cauca.";

    return () => {
      document.title = prevTitle;
      if (meta) meta.content = prevDesc;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HomeNavbar />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#1C5BB8] via-[#1850A0] to-[#144A8E] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-3 py-1.5 rounded-full mb-5">
              <span className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider">Gobernación del Valle del Cauca</span>
            </div>
            <h1 className="text-3xl font-bold mb-4 leading-snug">
              Sobre SILTGOV
            </h1>
            <p className="text-sm text-blue-100 leading-relaxed mb-7 max-w-xl">
              Somos la solución tecnológica oficial del Valle del Cauca para la gestión transparente,
              segura y trazable de las obligaciones judiciales del Estado. Conoce quiénes somos,
              qué nos mueve y por qué somos la alternativa de confianza.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 bg-[#FCDC00] text-gray-900 px-5 py-2.5 rounded-lg hover:bg-[#FBBC05] transition-all text-sm font-semibold shadow-md"
              >
                Acceder al Sistema <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate("/faq")}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-lg hover:bg-white/20 transition-all text-sm font-medium"
              >
                Preguntas Frecuentes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-[#1C5BB8]">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Misión y Visión ───────────────────────────────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Propósito e Identidad</h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Lo que nos define como organización y hacia dónde orientamos cada decisión
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#1C5BB8]/10 rounded-xl flex items-center justify-center">
                  <Award size={20} className="text-[#1C5BB8]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Nuestra</p>
                  <h3 className="text-sm font-semibold text-gray-900">Misión</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Modernizar la gestión de liquidaciones judiciales del departamento del Valle del Cauca
                a través de tecnología que garantice transparencia, precisión normativa y eficiencia
                operativa. Facilitamos que el Estado honre sus obligaciones judiciales de manera
                oportuna, trazable y con total rendición de cuentas.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#34A853]/10 rounded-xl flex items-center justify-center">
                  <Globe size={20} className="text-[#34A853]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Nuestra</p>
                  <h3 className="text-sm font-semibold text-gray-900">Visión</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ser el estándar de referencia en gestión digital de liquidaciones judiciales para
                Colombia, posicionando a la Gobernación del Valle del Cauca como modelo de gobierno
                transparente y eficiente, con una plataforma que evoluciona junto a la normativa
                y las necesidades del Estado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Qué es SILTGOV ───────────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#1C5BB8]/8 text-[#1C5BB8] text-[11px] font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Qué es SILTGOV
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-5 leading-snug">
                Una respuesta institucional al reto de las liquidaciones judiciales
              </h2>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                SILTGOV nació de una necesidad concreta: el Estado colombiano enfrenta miles de sentencias
                judiciales que generan obligaciones de pago, y gestionarlas con instrumentos tradicionales
                —hojas de cálculo, procesos manuales, flujos desconectados— derivaba en errores,
                retrasos y falta de visibilidad para los organismos de control.
              </p>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                La Gobernación del Valle del Cauca impulsó el desarrollo de una plataforma centralizada
                que integrara todo el ciclo de vida de la sentencia: desde su registro y parametrización
                hasta la confirmación del pago, con trazabilidad completa en cada paso. El resultado
                es SILTGOV: una herramienta diseñada para funcionarios públicos, construida bajo
                estándares de gobierno digital y respaldada por la institucionalidad del departamento.
              </p>
              <div className="space-y-3">
                {[
                  { title: "Origen institucional", desc: "Desarrollado dentro de la agenda de transformación digital de la Gobernación del Valle del Cauca" },
                  { title: "Diseño centrado en el usuario", desc: "Construido con y para los funcionarios que gestionan liquidaciones diariamente" },
                  { title: "Evolución continua",           desc: "Actualizado permanentemente para reflejar cambios normativos y necesidades operativas" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#34A853] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tarjeta de respaldo */}
            <div className="bg-gradient-to-br from-[#1C5BB8] to-[#1850A0] rounded-2xl p-7 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🇨🇴</span>
                </div>
                <div>
                  <p className="text-xs text-blue-200 uppercase tracking-wider font-medium">Respaldo Oficial</p>
                  <h3 className="text-sm font-bold">Gobernación del Valle del Cauca</h3>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/10 border border-white/15 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Lock size={13} />
                    <h4 className="text-xs font-semibold">Marco de Seguridad Digital</h4>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-relaxed">
                    Implementado conforme al MSPI del Gobierno Nacional, con medidas de seguridad certificadas para plataformas de gestión pública.
                  </p>
                </div>
                <div className="bg-white/10 border border-white/15 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <FileText size={13} />
                    <h4 className="text-xs font-semibold">Normativa de Referencia</h4>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-relaxed">
                    Ley 1437 de 2011 (CPACA), Ley 1581 de 2012, normativas de hacienda pública y legislación aplicable a liquidaciones judiciales en Colombia.
                  </p>
                </div>
                <div className="bg-white/10 border border-white/15 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock size={13} />
                    <h4 className="text-xs font-semibold">SLA 99.9 % de disponibilidad</h4>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-relaxed">
                    Infraestructura de alta disponibilidad que garantiza continuidad operativa durante los horarios de atención y fuera de ellos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Valores ──────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block bg-[#1C5BB8]/8 text-[#1C5BB8] text-[11px] font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              Nuestros Valores
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lo que nos guía cada día</h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Los principios que orientan el desarrollo, la operación y la evolución del sistema
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className={`w-11 h-11 ${v.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <v.icon size={20} className={v.color} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Propuesta de Valor ───────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block bg-[#34A853]/10 text-[#34A853] text-[11px] font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              Propuesta de Valor
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¿Por qué SILTGOV es la alternativa ideal?
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              No somos una herramienta genérica. Somos la solución construida específicamente
              para los desafíos reales de la gestión judicial pública colombiana.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {valueProps.map((vp) => (
              <div key={vp.title} className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#1C5BB8]/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#5B9BDE] to-[#4A8BD1] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <vp.icon size={17} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-sm font-semibold text-gray-900">{vp.title}</h3>
                      <span className="inline-block bg-[#34A853]/10 text-[#34A853] text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0">
                        {vp.highlight}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{vp.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bloque de cierre */}
          <div className="mt-10 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#1C5BB8]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star size={18} className="text-[#1C5BB8]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Una plataforma que crece con las entidades
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
                  SILTGOV no es un producto terminado; es un sistema vivo que se actualiza, mejora
                  y adapta a partir del uso real, la normativa vigente y los estándares del gobierno
                  digital colombiano. Cada entidad que lo adopta contribuye a su fortalecimiento.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/faq")}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-[#1C5BB8] text-white px-5 py-2.5 rounded-lg hover:bg-[#1850A0] transition-colors text-xs font-semibold whitespace-nowrap shadow-sm"
            >
              Más preguntas <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Compromiso ───────────────────────────────────────────────────────── */}
      <section className="py-12 bg-gradient-to-r from-[#1C5BB8] via-[#1850A0] to-[#144A8E] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Handshake size={22} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Nuestro compromiso con el Estado</h2>
          <p className="text-sm text-blue-100 mb-7 max-w-2xl mx-auto leading-relaxed">
            SILTGOV existe para que el Estado colombiano pueda cumplir sus obligaciones judiciales
            con la transparencia, la rapidez y la exactitud que la ciudadanía merece. Es un
            compromiso institucional con la buena gestión pública.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#FCDC00] text-gray-900 px-6 py-2.5 rounded-lg hover:bg-[#FBBC05] transition-all text-sm font-semibold shadow-lg"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate("/faq")}
              className="bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded-lg hover:bg-white/20 transition-all text-sm font-medium"
            >
              Preguntas Frecuentes
            </button>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}