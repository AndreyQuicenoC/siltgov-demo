import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Calculator, FileText, Download, CheckCircle2,
  AlertCircle, Calendar, DollarSign, Percent,
  ClipboardCheck, ArrowLeft, Info, Edit3
} from "lucide-react";
import { toast } from "sonner";

interface LiquidationData {
  sentencia: string;
  fechaInicial: string;
  fechaFinal: string;
  tipoObligacion: string;
  tasaInteres: string;
  interesMoratorio: string;
  interesCorriente: string;
  aplicaIPC: boolean;
  ipc: string;
  capitalBase: string;
  periodicidad: string;
  aplicaActualizacion: boolean;
  actualizacionMonetaria: string;
  interesesCausados: string;
  costas: string;
  embargos: string;
  retenciones: string;
  impuestos: string;
  sentenciaEjecutoriada: boolean;
  noPagadaPreviamente: boolean;
  responsable: string;
  observaciones: string;
}

const fieldClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] focus:border-transparent transition-all bg-white";
const labelClass = "block text-xs font-medium text-gray-600 mb-1.5";

function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 mb-5">
      <div className="w-8 h-8 bg-[#1C5BB8]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={16} className="text-[#1C5BB8]" />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-[#1C5BB8]">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export function CalculateLiquidation() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as {
    sentenceId?: string;
    prefilledData?: Partial<LiquidationData>;
    mode?: "nuevo" | "corregir";
  } | null;

  const isCorrection = locationState?.mode === "corregir";

  const [showResult, setShowResult] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [terminated, setTerminated] = useState(false);

  const [formData, setFormData] = useState<LiquidationData>({
    sentencia: locationState?.sentenceId ?? "",
    fechaInicial: "",
    fechaFinal: "",
    tipoObligacion: "",
    tasaInteres: "",
    interesMoratorio: "",
    interesCorriente: "",
    aplicaIPC: false,
    ipc: "",
    capitalBase: "",
    periodicidad: "mensual",
    aplicaActualizacion: false,
    actualizacionMonetaria: "",
    interesesCausados: "",
    costas: "",
    embargos: "0",
    retenciones: "0",
    impuestos: "0",
    sentenciaEjecutoriada: false,
    noPagadaPreviamente: false,
    responsable: "",
    observaciones: "",
  });

  // Pre-cargar datos si viene de una liquidación "Por corregir"
  useEffect(() => {
    if (locationState?.prefilledData) {
      setFormData(prev => ({
        ...prev,
        ...locationState.prefilledData,
        sentencia: locationState.sentenceId ?? prev.sentencia,
      }));
    }
  }, []);

  const [result, setResult] = useState({
    capitalBase: 0,
    actualizacionMonetaria: 0,
    interesesCausados: 0,
    costas: 0,
    subtotal: 0,
    deducciones: 0,
    totalLiquidado: 0,
  });

  const set = (field: keyof LiquidationData, value: string | boolean) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const validateForm = () => {
    if (!formData.sentencia)          { toast.error("Selecciona una sentencia"); return false; }
    if (!formData.fechaInicial || !formData.fechaFinal) { toast.error("Las fechas son obligatorias"); return false; }
    if (formData.fechaInicial >= formData.fechaFinal)   { toast.error("La fecha final debe ser posterior a la inicial"); return false; }
    if (!formData.capitalBase)        { toast.error("El capital base es obligatorio"); return false; }
    if (!formData.tipoObligacion)     { toast.error("Selecciona el tipo de obligación"); return false; }
    if (!formData.sentenciaEjecutoriada) { toast.error("La sentencia debe estar ejecutoriada"); return false; }
    if (!formData.noPagadaPreviamente)   { toast.error("Confirma que no ha sido pagada previamente"); return false; }
    if (!formData.responsable)        { toast.error("Indica el responsable de la liquidación"); return false; }
    return true;
  };

  const calculateLiquidation = () => {
    if (!validateForm()) return;
    setCalculating(true);
    setTimeout(() => {
      const capital = parseFloat(formData.capitalBase) || 0;
      const actualizacion = formData.aplicaActualizacion ? parseFloat(formData.actualizacionMonetaria) || 0 : 0;
      const intereses = parseFloat(formData.interesesCausados) || 0;
      const costas = parseFloat(formData.costas) || 0;
      const embargos = parseFloat(formData.embargos) || 0;
      const retenciones = parseFloat(formData.retenciones) || 0;
      const impuestos = parseFloat(formData.impuestos) || 0;
      const subtotal = capital + actualizacion + intereses + costas;
      const deducciones = embargos + retenciones + impuestos;
      setResult({ capitalBase: capital, actualizacionMonetaria: actualizacion, interesesCausados: intereses, costas, subtotal, deducciones, totalLiquidado: subtotal - deducciones });
      setCalculating(false);
      setShowResult(true);
      toast.success("Liquidación calculada exitosamente");
    }, 1800);
  };

  const markAsTerminated = () => {
    setTerminated(true);
    toast.success(
      isCorrection ? "¡Corrección enviada exitosamente!" : "¡Liquidación marcada como Terminada!",
      { description: "La sentencia ha sido actualizada y bloqueada para edición." }
    );
    setTimeout(() => navigate("/liquidator"), 1500);
  };

  const fmt = (v: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/liquidator")} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Calcular Liquidación</h1>
          <p className="text-sm text-gray-500 mt-0.5">Complete los campos requeridos para generar la liquidación</p>
        </div>
        <div className="ml-auto">
          <Calculator size={28} className="text-[#1C5BB8]" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* ── Formulario ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Selección de sentencia */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <SectionTitle
              icon={FileText}
              title={isCorrection ? "Sentencia a Corregir" : "Sentencia a Liquidar"}
              subtitle={isCorrection
                ? "Datos pre-cargados desde la liquidación anterior — aplica las correcciones indicadas"
                : "Selecciona la sentencia que deseas calcular"}
            />
            {isCorrection && (
              <div className="mb-4 flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <Edit3 size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Los campos han sido pre-cargados con los valores de la liquidación anterior. Revisa y corrige según la indicación del administrador.
                </p>
              </div>
            )}
            <div>
              <label className={labelClass}>Número de Sentencia <span className="text-red-500">*</span></label>
              <select value={formData.sentencia} onChange={e => set("sentencia", e.target.value)} className={fieldClass}>
                <option value="">Seleccionar sentencia...</option>
                <optgroup label="── En Proceso ──">
                  <option value="S-2026-001">S-2026-001 — Juan Carlos Pérez Morales ($45.000.000)</option>
                  <option value="S-2026-005">S-2026-005 — Roberto Antonio Castaño ($67.300.000)</option>
                  <option value="S-2026-007">S-2026-007 — Diego Fernando Torres Salazar ($53.200.000)</option>
                  <option value="S-2026-009">S-2026-009 — Carlos Eduardo Muñoz Ospina ($41.750.000)</option>
                  <option value="S-2026-011">S-2026-011 — Andrés Felipe Sánchez Lozano ($72.100.000)</option>
                  <option value="S-2025-075">S-2025-075 — Isabel Cristina Vergara Mora ($84.600.000)</option>
                </optgroup>
                <optgroup label="── Por Corregir ──">
                  <option value="S-2026-006">S-2026-006 — María del Pilar Vargas Ruiz ($18.600.000)</option>
                  <option value="S-2025-082">S-2025-082 — Mauricio Alberto Peña Castro ($26.300.000)</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Fechas */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <SectionTitle icon={Calendar} title="Período de Liquidación" subtitle="Fechas de inicio y fin del cálculo de intereses" />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Fecha Inicial de Causación <span className="text-red-500">*</span></label>
                <input type="date" value={formData.fechaInicial} onChange={e => set("fechaInicial", e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>Fecha Final de Liquidación <span className="text-red-500">*</span></label>
                <input type="date" value={formData.fechaFinal} onChange={e => set("fechaFinal", e.target.value)} className={fieldClass} />
              </div>
            </div>
            {formData.fechaInicial && formData.fechaFinal && formData.fechaInicial < formData.fechaFinal && (
              <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs text-[#1C5BB8]">
                  Período: <strong>
                    {Math.round((new Date(formData.fechaFinal).getTime() - new Date(formData.fechaInicial).getTime()) / (1000 * 60 * 60 * 24))} días
                  </strong>
                </p>
              </div>
            )}
          </div>

          {/* Parámetros Normativos */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <SectionTitle icon={Percent} title="Parámetros Normativos" subtitle="Tasas e índices según normativa colombiana vigente" />
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Tipo de Obligación <span className="text-red-500">*</span></label>
                <select value={formData.tipoObligacion} onChange={e => set("tipoObligacion", e.target.value)} className={fieldClass}>
                  <option value="">Seleccione el tipo...</option>
                  <option value="civil">Interés Legal Civil (6% E.A.)</option>
                  <option value="comercial">Interés Comercial Bancario</option>
                  <option value="moratorio">Interés Moratorio — Art. 884 C.Co.</option>
                  <option value="laboral">Condena Laboral — Art. 1° D. 797/49</option>
                </select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Tasa Aplicable (%)</label>
                  <input type="number" step="0.01" value={formData.tasaInteres} onChange={e => set("tasaInteres", e.target.value)} className={fieldClass} placeholder="Ej: 6.00" />
                </div>
                <div>
                  <label className={labelClass}>Interés Moratorio (%)</label>
                  <input type="number" step="0.01" value={formData.interesMoratorio} onChange={e => set("interesMoratorio", e.target.value)} className={fieldClass} placeholder="Ej: 1.5" />
                </div>
                <div>
                  <label className={labelClass}>Interés Corriente (%)</label>
                  <input type="number" step="0.01" value={formData.interesCorriente} onChange={e => set("interesCorriente", e.target.value)} className={fieldClass} placeholder="Ej: 0.8" />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={formData.aplicaIPC} onChange={e => set("aplicaIPC", e.target.checked)} className="w-4 h-4 text-[#1C5BB8] border-gray-300 rounded focus:ring-[#5B9BDE]" />
                <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">Aplica IPC (Índice de Precios al Consumidor)</span>
              </label>
              {formData.aplicaIPC && (
                <div className="ml-7">
                  <label className={labelClass}>IPC anual (%)</label>
                  <input type="number" step="0.01" value={formData.ipc} onChange={e => set("ipc", e.target.value)} className={`${fieldClass} max-w-xs`} placeholder="Ej: 9.28" />
                </div>
              )}
            </div>
          </div>

          {/* Base de cálculo */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <SectionTitle icon={DollarSign} title="Base para Cálculo" subtitle="Valores financieros del proceso judicial" />
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Capital Base <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" step="0.01" value={formData.capitalBase} onChange={e => set("capitalBase", e.target.value)} className={`${fieldClass} pl-7`} placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Periodicidad</label>
                  <select value={formData.periodicidad} onChange={e => set("periodicidad", e.target.value)} className={fieldClass}>
                    <option value="diaria">Diaria</option>
                    <option value="mensual">Mensual</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={formData.aplicaActualizacion} onChange={e => set("aplicaActualizacion", e.target.checked)} className="w-4 h-4 text-[#1C5BB8] border-gray-300 rounded focus:ring-[#5B9BDE]" />
                <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">Aplica Actualización Monetaria</span>
              </label>
              {formData.aplicaActualizacion && (
                <div className="ml-7">
                  <label className={labelClass}>Valor de Actualización Monetaria</label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" step="0.01" value={formData.actualizacionMonetaria} onChange={e => set("actualizacionMonetaria", e.target.value)} className={`${fieldClass} pl-7`} placeholder="0" />
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Intereses Causados</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" step="0.01" value={formData.interesesCausados} onChange={e => set("interesesCausados", e.target.value)} className={`${fieldClass} pl-7`} placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Costas y Agencias en Derecho</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" step="0.01" value={formData.costas} onChange={e => set("costas", e.target.value)} className={`${fieldClass} pl-7`} placeholder="0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deducciones */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <SectionTitle icon={FileText} title="Deducciones" subtitle="Valores a descontar del total liquidado" />
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Embargos", field: "embargos" as const },
                { label: "Retenciones en la Fuente", field: "retenciones" as const },
                { label: "Impuestos Aplicables", field: "impuestos" as const },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className={labelClass}>{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" step="0.01" value={formData[field]} onChange={e => set(field, e.target.value)} className={`${fieldClass} pl-7`} placeholder="0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Validaciones */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <SectionTitle icon={ClipboardCheck} title="Validaciones y Responsable" subtitle="Confirmaciones requeridas antes de calcular" />
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={formData.sentenciaEjecutoriada} onChange={e => set("sentenciaEjecutoriada", e.target.checked)} className="mt-0.5 w-4 h-4 text-[#1C5BB8] border-gray-300 rounded focus:ring-[#5B9BDE]" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">Confirmo que la sentencia está ejecutoriada <span className="text-red-500">*</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">La sentencia debe estar en firme y ejecutoriada para liquidar</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={formData.noPagadaPreviamente} onChange={e => set("noPagadaPreviamente", e.target.checked)} className="mt-0.5 w-4 h-4 text-[#1C5BB8] border-gray-300 rounded focus:ring-[#5B9BDE]" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">Confirmo que no ha sido pagada previamente <span className="text-red-500">*</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">Verificar en el sistema que no existan pagos previos registrados</p>
                </div>
              </label>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Responsable de la Liquidación <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.responsable} onChange={e => set("responsable", e.target.value)} className={fieldClass} placeholder="Nombre completo del liquidador" />
                </div>
                <div>
                  <label className={labelClass}>Cargo / Dependencia</label>
                  <input type="text" className={fieldClass} placeholder="Ej: Profesional Universitario Grupo Judicial" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Observaciones y Fundamentos Jurídicos</label>
                <textarea value={formData.observaciones} onChange={e => set("observaciones", e.target.value)} rows={3} className={`${fieldClass} resize-none`} placeholder="Fundamentos legales, normas aplicables, jurisprudencia relevante..." />
              </div>
            </div>
          </div>
        </div>

        {/* ── Panel lateral ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">

            {/* Botón calcular */}
            <button
              onClick={calculateLiquidation}
              disabled={calculating || terminated}
              className="w-full bg-[#1C5BB8] text-white py-3 rounded-xl hover:bg-[#1850A0] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
            >
              {calculating ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Calculando...</>
              ) : (
                <><Calculator size={17} /> Calcular Liquidación</>
              )}
            </button>

            {/* Resultado */}
            {!showResult ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={16} className="text-[#1C5BB8]" />
                  <h3 className="text-sm font-semibold text-gray-900">Información</h3>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <p>Complete todos los campos marcados con <span className="text-red-500">*</span> para calcular.</p>
                  <p>El sistema validará las tasas aplicables según la normativa colombiana vigente.</p>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-[#1C5BB8] font-medium mb-2">Campos obligatorios:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {["Sentencia", "Fechas de liquidación", "Tipo de obligación", "Capital base", "Validaciones", "Responsable"].map(f => (
                      <li key={f} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#1C5BB8]" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-[#1C5BB8] px-5 py-3.5">
                  <h3 className="text-sm font-semibold text-white">Resultado de Liquidación</h3>
                </div>
                <div className="p-5 space-y-2.5">
                  {[
                    { label: "Capital Base", value: result.capitalBase, color: "" },
                    ...(result.actualizacionMonetaria > 0 ? [{ label: "Actualización Monetaria", value: result.actualizacionMonetaria, color: "" }] : []),
                    { label: "Intereses Causados", value: result.interesesCausados, color: "" },
                    { label: "Costas", value: result.costas, color: "" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-gray-500">{label}</span>
                      <span className={`font-medium text-gray-800 ${color}`}>{fmt(value)}</span>
                    </div>
                  ))}

                  <div className="border-t border-gray-100 pt-2.5 flex justify-between text-xs">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-gray-800">{fmt(result.subtotal)}</span>
                  </div>

                  {result.deducciones > 0 && (
                    <div className="flex justify-between text-xs text-red-600">
                      <span>Deducciones</span>
                      <span className="font-medium">−{fmt(result.deducciones)}</span>
                    </div>
                  )}

                  <div className="mt-2 p-3.5 bg-[#1C5BB8]/5 border border-[#1C5BB8]/20 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700">Total Liquidado</span>
                      <span className="text-lg font-bold text-[#1C5BB8]">{fmt(result.totalLiquidado)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success("Generando PDF...")}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs mt-2"
                  >
                    <Download size={14} /> Descargar PDF
                  </button>
                </div>
              </div>
            )}

            {/* Marcar como terminada / Enviar corrección */}
            {showResult && !terminated && (
              <div className={`bg-white rounded-xl border shadow-sm p-5 ${isCorrection ? "border-amber-200" : "border-green-200"}`}>
                <div className="flex items-center gap-2 mb-3">
                  {isCorrection
                    ? <Edit3 size={16} className="text-amber-600" />
                    : <CheckCircle2 size={16} className="text-[#34A853]" />}
                  <h3 className="text-sm font-semibold text-gray-900">
                    {isCorrection ? "Enviar Corrección" : "Finalizar Liquidación"}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  {isCorrection
                    ? "Al enviar, la corrección quedará registrada para revisión del administrador."
                    : "Al finalizar, la liquidación quedará bloqueada y la sentencia se marcará como Terminada."}
                </p>
                <button
                  onClick={markAsTerminated}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 text-white rounded-xl transition-colors text-sm font-medium shadow-sm ${
                    isCorrection ? "bg-amber-500 hover:bg-amber-600" : "bg-[#34A853] hover:bg-[#2d9247]"
                  }`}
                >
                  {isCorrection
                    ? <><Edit3 size={15} /> Enviar Corrección</>
                    : <><CheckCircle2 size={16} /> Marcar como Terminada</>}
                </button>
                <div className="mt-3 flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-lg">
                  <AlertCircle size={12} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Esta acción no puede revertirse sin autorización del administrador.</p>
                </div>
              </div>
            )}

            {terminated && (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle2 size={18} className="text-[#34A853]" />
                <div>
                  <p className="text-sm font-semibold text-green-800">¡Liquidación Terminada!</p>
                  <p className="text-xs text-green-600">Redirigiendo al panel...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}