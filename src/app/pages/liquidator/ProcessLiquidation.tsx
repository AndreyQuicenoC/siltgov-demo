import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, Eye, Lock, FileDown, Send,
  CheckCircle2, User, Calendar, Building2,
  Hash, Scale, AlertTriangle, X, MessageSquare,
  FileText, Edit3, AlertCircle, ExternalLink
} from "lucide-react";
import { toast } from "sonner";

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface PrevLiquidationSummary {
  fechaInicial: string;
  fechaFinal: string;
  tipoObligacion: string;
  capitalBase: string;
  interesesCausados: string;
  costas: string;
  totalLiquidado: string;
  responsable: string;
  observaciones: string;
}

interface PrevFormData {
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

interface SentenceData {
  isTerminated: boolean;
  isPorCorregir: boolean;
  number: string;
  plaintiff: string;
  document: string;
  juzgado: string;
  fallo: string;
  entity: string;
  assignedLiquidator: string;
  adminObservations: string;
  // Solo para Terminadas
  liquidatedValue?: string;
  completedDate?: string;
  tipoObligacion?: string;
  periodicidad?: string;
  costas?: string;
  capitalBase?: string;
  interesesCausados?: string;
  observations?: string;
  // Solo para Por corregir
  correctionNote?: string;
  prevLiquidationSummary?: PrevLiquidationSummary;
  prevFormData?: PrevFormData;
}

// ── Datos mock de sentencias ──────────────────────────────────────────────────
const sentenceMap: Record<string, SentenceData> = {
  // ── EN PROCESO ──────────────────────────────────────────────────────────────
  "1": {
    isTerminated: false, isPorCorregir: false,
    number: "S-2026-001", plaintiff: "Juan Carlos Pérez Morales", document: "12345678",
    juzgado: "Juzgado 1° Administrativo de Cali", fallo: "2026-02-20",
    entity: "Secretaría de Educación", assignedLiquidator: "María García",
    adminObservations: "Sentencia de primera instancia. Incluir cálculo de intereses moratorios desde la fecha de ejecutoria.",
  },
  "4": {
    isTerminated: false, isPorCorregir: false,
    number: "S-2026-005", plaintiff: "Roberto Antonio Castaño", document: "11122334",
    juzgado: "Consejo de Estado", fallo: "2026-02-12",
    entity: "Secretaría de Infraestructura", assignedLiquidator: "María García",
    adminObservations: "Caso de alta complejidad. Revisar jurisprudencia reciente del Consejo de Estado sobre intereses moratorios.",
  },
  "6": {
    isTerminated: false, isPorCorregir: false,
    number: "S-2026-007", plaintiff: "Diego Fernando Torres Salazar", document: "77788990",
    juzgado: "Juzgado 3° Administrativo de Cali", fallo: "2026-02-08",
    entity: "Secretaría de Educación", assignedLiquidator: "María García",
    adminObservations: "Sin observaciones adicionales.",
  },
  "8": {
    isTerminated: false, isPorCorregir: false,
    number: "S-2026-009", plaintiff: "Carlos Eduardo Muñoz Ospina", document: "66677889",
    juzgado: "Consejo de Estado", fallo: "2026-02-03",
    entity: "Gobernación Valle del Cauca", assignedLiquidator: "María García",
    adminObservations: "Requiere revisión por parte de la Secretaría Jurídica antes de finalizar.",
  },
  "10": {
    isTerminated: false, isPorCorregir: false,
    number: "S-2026-011", plaintiff: "Andrés Felipe Sánchez Lozano", document: "88899001",
    juzgado: "Juzgado 5° Administrativo de Cali", fallo: "2026-01-28",
    entity: "Secretaría de Educación", assignedLiquidator: "María García",
    adminObservations: "Sin observaciones.",
  },
  "13": {
    isTerminated: false, isPorCorregir: false,
    number: "S-2025-075", plaintiff: "Isabel Cristina Vergara Mora", document: "11200334",
    juzgado: "Consejo de Estado", fallo: "2026-01-15",
    entity: "Secretaría de Hacienda", assignedLiquidator: "María García",
    adminObservations: "Expediente derivado del Tribunal Nacional. Coordinar con área jurídica.",
  },

  // ── TERMINADAS ───────────────────────────────────────────────────────────────
  "2": {
    isTerminated: true, isPorCorregir: false,
    number: "S-2026-002", plaintiff: "Ana María Rodríguez Flórez", document: "98765432",
    juzgado: "Tribunal Administrativo del Valle", fallo: "2026-02-18",
    entity: "Secretaría de Salud", assignedLiquidator: "María García",
    adminObservations: "",
    liquidatedValue: "$38.450.000", completedDate: "2026-02-25",
    capitalBase: "$32.500.000", tipoObligacion: "Interés Moratorio",
    periodicidad: "Mensual", costas: "$1.200.000", interesesCausados: "$4.750.000",
    observations: "Liquidación aprobada conforme a normativa vigente. Valores verificados con área jurídica.",
  },
  "3": {
    isTerminated: true, isPorCorregir: false,
    number: "S-2026-003", plaintiff: "Carmen Lucía López Restrepo", document: "55512345",
    juzgado: "Juzgado 2° Administrativo de Cali", fallo: "2026-02-15",
    entity: "Gobernación Valle del Cauca", assignedLiquidator: "María García",
    adminObservations: "",
    liquidatedValue: "$25.100.000", completedDate: "2026-02-22",
    capitalBase: "$21.800.000", tipoObligacion: "Interés Legal Civil",
    periodicidad: "Anual", costas: "$800.000", interesesCausados: "$2.500.000",
    observations: "Incluye actualización monetaria según IPC 2025.",
  },
  "7": {
    isTerminated: true, isPorCorregir: false,
    number: "S-2026-008", plaintiff: "Luisa Fernanda Gómez Parra", document: "44455667",
    juzgado: "Juzgado 4° Administrativo de Cali", fallo: "2026-02-05",
    entity: "Secretaría de Salud", assignedLiquidator: "María García",
    adminObservations: "",
    liquidatedValue: "$33.200.000", completedDate: "2026-02-20",
    capitalBase: "$29.400.000", tipoObligacion: "Interés Comercial",
    periodicidad: "Mensual", costas: "$650.000", interesesCausados: "$3.150.000",
    observations: "Sin deducciones. Sentencia ejecutoriada en firme.",
  },

  // ── POR CORREGIR ─────────────────────────────────────────────────────────────
  "5": {
    isTerminated: false, isPorCorregir: true,
    number: "S-2026-006", plaintiff: "María del Pilar Vargas Ruiz", document: "33344556",
    juzgado: "Tribunal Administrativo del Valle", fallo: "2026-02-08",
    entity: "Secretaría de Hacienda", assignedLiquidator: "Laura Díaz",
    adminObservations: "Falta documentación adicional del accionante.",
    correctionNote: "Se solicita verificar las fechas de causación. El período registrado no corresponde con la ejecutoria del fallo. Corregir la fecha inicial y recalcular los intereses moratorios.",
    prevLiquidationSummary: {
      fechaInicial: "2023-03-15", fechaFinal: "2026-02-08",
      tipoObligacion: "Interés Legal Civil",
      capitalBase: "$18.600.000", interesesCausados: "$3.348.000",
      costas: "$450.000", totalLiquidado: "$22.398.000",
      responsable: "Laura Díaz",
      observaciones: "Liquidación inicial — pendiente de corrección solicitada por el administrador.",
    },
    prevFormData: {
      sentencia: "S-2026-006", fechaInicial: "2023-03-15", fechaFinal: "2026-02-08",
      tipoObligacion: "civil", tasaInteres: "6.00",
      interesMoratorio: "", interesCorriente: "", aplicaIPC: false, ipc: "",
      capitalBase: "18600000", periodicidad: "anual",
      aplicaActualizacion: false, actualizacionMonetaria: "",
      interesesCausados: "3348000", costas: "450000",
      embargos: "0", retenciones: "0", impuestos: "0",
      sentenciaEjecutoriada: true, noPagadaPreviamente: true,
      responsable: "Laura Díaz",
      observaciones: "Corrección solicitada. Verificar período de causación.",
    },
  },
  "12": {
    isTerminated: false, isPorCorregir: true,
    number: "S-2025-082", plaintiff: "Mauricio Alberto Peña Castro", document: "99900112",
    juzgado: "Juzgado 1° Administrativo de Cali", fallo: "2026-01-20",
    entity: "Gobernación Valle del Cauca", assignedLiquidator: "Carlos Sánchez",
    adminObservations: "Documentación incompleta.",
    correctionNote: "Se solicita corregir el tipo de obligación aplicado. Según el expediente, corresponde interés moratorio (Art. 884 C.Co.) y no legal civil. Recalcular con la tasa correcta.",
    prevLiquidationSummary: {
      fechaInicial: "2022-06-10", fechaFinal: "2026-01-20",
      tipoObligacion: "Interés Legal Civil",
      capitalBase: "$26.300.000", interesesCausados: "$6.312.000",
      costas: "$780.000", totalLiquidado: "$33.392.000",
      responsable: "Carlos Sánchez",
      observaciones: "Tipo de obligación requiere corrección según indicación del administrador.",
    },
    prevFormData: {
      sentencia: "S-2025-082", fechaInicial: "2022-06-10", fechaFinal: "2026-01-20",
      tipoObligacion: "civil", tasaInteres: "6.00",
      interesMoratorio: "", interesCorriente: "", aplicaIPC: false, ipc: "",
      capitalBase: "26300000", periodicidad: "mensual",
      aplicaActualizacion: false, actualizacionMonetaria: "",
      interesesCausados: "6312000", costas: "780000",
      embargos: "0", retenciones: "0", impuestos: "0",
      sentenciaEjecutoriada: true, noPagadaPreviamente: true,
      responsable: "Carlos Sánchez",
      observaciones: "Corrección pendiente: cambiar tipo de obligación a moratorio.",
    },
  },
};

// ── Componente InfoRow ─────────────────────────────────────────────────────────
const InfoRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-500 w-40 flex-shrink-0">{label}</span>
    <span className={`text-xs font-medium text-right break-all ${highlight ? "text-[#1C5BB8]" : "text-gray-800"}`}>{value}</span>
  </div>
);

// ── Componente Principal ───────────────────────────────────────────────────────
export function ProcessLiquidation() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const sentence = sentenceMap[id ?? "1"] ?? sentenceMap["1"];

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestReason, setRequestReason] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const handleSendRequest = () => {
    if (!requestReason.trim()) { toast.error("Debes indicar el motivo del cambio"); return; }
    setRequestSent(true);
    setShowRequestModal(false);
    toast.success("Solicitud enviada al administrador correctamente");
  };

  // ─── Panel de datos que ingresó el admin (solo lectura) ───────────────────
  const AdminDataPanel = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
        <div className="flex items-center gap-2">
          <Scale size={15} className="text-[#1C5BB8]" />
          <h2 className="text-sm font-semibold text-gray-900">Datos de la Sentencia</h2>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">
          <Lock size={9} /> Ingresado por el administrador
        </span>
      </div>
      <div className="px-5 py-4 grid grid-cols-2 gap-x-6">
        <InfoRow label="N° Sentencia"      value={sentence.number}            highlight />
        <InfoRow label="Fecha de Fallo"    value={sentence.fallo} />
        <InfoRow label="Juzgado / Tribunal" value={sentence.juzgado} />
        <InfoRow label="Demandante"        value={sentence.plaintiff} />
        <InfoRow label="Cédula / NIT"      value={sentence.document} />
        <InfoRow label="Entidad"           value={sentence.entity} />
        <InfoRow label="Liquidador asignado" value={sentence.assignedLiquidator} />
        {sentence.adminObservations && (
          <div className="col-span-2 mt-1">
            <p className="text-xs text-gray-400 mb-1.5">Observaciones del administrador</p>
            <p className="text-xs text-gray-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 leading-relaxed">
              {sentence.adminObservations}
            </p>
          </div>
        )}
      </div>
      {/* PDF adjunto simulado */}
      <div className="px-5 pb-4">
        <button
          onClick={() => toast.info("Abriendo documento PDF adjunto...")}
          className="flex items-center gap-2 px-4 py-2 border border-[#1C5BB8]/30 bg-[#1C5BB8]/5 text-[#1C5BB8] rounded-lg text-xs hover:bg-[#1C5BB8]/10 transition-colors"
        >
          <FileText size={13} />
          Ver PDF de la sentencia
          <ExternalLink size={11} className="opacity-60" />
        </button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // MODO 1: TERMINADA (solo lectura)
  // ─────────────────────────────────────────────────────────────────────────────
  if (sentence.isTerminated) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/liquidator")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">Visualizar Liquidación</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
                  <CheckCircle2 size={11} /> Terminada
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{sentence.number} — Solo lectura</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs hover:bg-[#1850A0] transition-colors">
            <FileDown size={14} /> Descargar PDF
          </button>
        </div>

        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <Lock size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Liquidación finalizada — no editable</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Terminada el <strong>{sentence.completedDate}</strong>. Para modificaciones, solicita autorización al administrador.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <AdminDataPanel />

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <Eye size={15} className="text-[#1C5BB8]" />
                <h2 className="text-sm font-semibold text-gray-900">Resumen de Liquidación</h2>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-x-8">
                <InfoRow label="Capital Base"        value={sentence.capitalBase ?? "—"} />
                <InfoRow label="Intereses Causados"  value={sentence.interesesCausados ?? "—"} />
                <InfoRow label="Tipo de Obligación"  value={sentence.tipoObligacion ?? "—"} />
                <InfoRow label="Periodicidad"        value={sentence.periodicidad ?? "—"} />
                <InfoRow label="Costas"              value={sentence.costas ?? "—"} />
                <InfoRow label="Fecha de Término"    value={sentence.completedDate ?? "—"} />
              </div>
              <div className="mx-5 mb-4 p-4 bg-[#1C5BB8]/5 border border-[#1C5BB8]/20 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Valor Final Liquidado</span>
                  <span className="text-xl font-bold text-[#1C5BB8]">{sentence.liquidatedValue}</span>
                </div>
              </div>
              {sentence.observations && (
                <div className="px-5 pb-4">
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Observaciones del liquidador</p>
                  <p className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2.5 leading-relaxed">{sentence.observations}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Datos Clave</h3>
              <div className="space-y-2.5">
                {[
                  { icon: User,      label: "Liquidador",   value: sentence.assignedLiquidator },
                  { icon: Calendar,  label: "Terminada el", value: sentence.completedDate ?? "—" },
                  { icon: Building2, label: "Entidad",      value: sentence.entity },
                  { icon: Hash,      label: "N° Sentencia", value: sentence.number },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-[#1C5BB8]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-xs font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-amber-600" />
                <h3 className="text-sm font-semibold text-gray-900">¿Necesitas editar?</h3>
              </div>
              {requestSent ? (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 size={13} className="text-[#34A853] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-green-800">Solicitud enviada</p>
                    <p className="text-xs text-green-600 mt-0.5">Espera la autorización del administrador.</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    Esta liquidación está bloqueada. Solicita autorización al administrador para realizar cambios.
                  </p>
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-amber-300 bg-amber-50 text-amber-800 rounded-lg text-xs hover:bg-amber-100 transition-colors"
                  >
                    <MessageSquare size={13} /> Solicitar hacer cambios
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRequestModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-amber-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={17} className="text-white" />
                  <h2 className="text-sm font-semibold text-white">Solicitud de Edición</h2>
                </div>
                <button onClick={() => setShowRequestModal(false)} className="p-1.5 hover:bg-white/20 rounded-lg"><X size={16} className="text-white" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700">Sentencia: <strong>{sentence.number}</strong> — {sentence.plaintiff}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Motivo de la solicitud <span className="text-red-500">*</span></label>
                  <textarea
                    rows={4} value={requestReason} onChange={e => setRequestReason(e.target.value)}
                    placeholder="Describe detalladamente el motivo por el que necesitas editar esta liquidación..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>
              </div>
              <div className="px-6 pb-6 flex justify-end gap-3">
                <button onClick={() => setShowRequestModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
                <button onClick={handleSendRequest} className="flex items-center gap-2 px-5 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors">
                  <Send size={14} /> Enviar Solicitud
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MODO 2: POR CORREGIR
  // ─────────────────────────────────────────────────────────────────────────────
  if (sentence.isPorCorregir) {
    const prev = sentence.prevLiquidationSummary!;
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/liquidator")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">Corregir Liquidación</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                <AlertCircle size={11} /> Por corregir
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{sentence.number} — {sentence.plaintiff}</p>
          </div>
        </div>

        {/* Aviso de corrección */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-300 rounded-xl">
          <Edit3 size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">El administrador solicitó corrección</p>
            <p className="text-xs text-amber-700 leading-relaxed">{sentence.correctionNote}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* Datos del admin */}
            <AdminDataPanel />

            {/* Liquidación previa */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/60">
                <Eye size={15} className="text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-900">Liquidación Anterior (referencia)</h2>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-x-6">
                <InfoRow label="Período"            value={`${prev.fechaInicial} → ${prev.fechaFinal}`} />
                <InfoRow label="Tipo de Obligación" value={prev.tipoObligacion} />
                <InfoRow label="Capital Base"       value={prev.capitalBase} />
                <InfoRow label="Intereses Causados" value={prev.interesesCausados} />
                <InfoRow label="Costas"             value={prev.costas} />
                <InfoRow label="Responsable"        value={prev.responsable} />
              </div>
              <div className="mx-5 mb-4 p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">Total liquidado anterior</span>
                  <span className="text-base font-bold text-gray-700">{prev.totalLiquidado}</span>
                </div>
              </div>
              {prev.observaciones && (
                <div className="px-5 pb-4">
                  <p className="text-xs text-gray-400 mb-1.5">Observaciones anteriores</p>
                  <p className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">{prev.observaciones}</p>
                </div>
              )}
            </div>

            {/* CTA para ir a corregir */}
            <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mx-auto">
                <Edit3 size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Corregir el Cálculo</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  Usa el formulario de cálculo con los datos pre-cargados de la liquidación anterior. Aplica las correcciones indicadas y vuelve a enviar.
                </p>
              </div>
              <button
                onClick={() =>
                  navigate("/liquidator/calculate", {
                    state: { sentenceId: sentence.number, prefilledData: sentence.prevFormData, mode: "corregir" },
                  })
                }
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm hover:bg-amber-600 transition-colors shadow-sm"
              >
                <Edit3 size={15} /> Ir a Corregir Liquidación
              </button>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Datos Clave</h3>
              <div className="space-y-2.5">
                {[
                  { icon: User,      label: "Demandante",  value: sentence.plaintiff },
                  { icon: Building2, label: "Entidad",     value: sentence.entity },
                  { icon: Calendar,  label: "Fecha Fallo", value: sentence.fallo },
                  { icon: Hash,      label: "Documento",   value: sentence.document },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-xs font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-700 font-medium mb-1">⚠️ Recuerda</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Atiende puntualmente la corrección indicada por el administrador antes de reenviar la liquidación.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MODO 3: EN PROCESO (nueva liquidación)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/liquidator")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">Liquidar Sentencia</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#1C5BB8] text-xs font-medium">
              En proceso
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{sentence.number} — {sentence.plaintiff}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Datos del admin */}
          <AdminDataPanel />

          {/* Redirección a calcular */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto">
              <Scale size={24} className="text-[#1C5BB8]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Calcular la Liquidación</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Usa el formulario de cálculo para procesar esta sentencia. Al completarla, quedará marcada como <strong>Terminada</strong>.
              </p>
            </div>
            <button
              onClick={() =>
                navigate("/liquidator/calculate", {
                  state: { sentenceId: sentence.number, mode: "nuevo" },
                })
              }
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1C5BB8] text-white rounded-xl text-sm hover:bg-[#1850A0] transition-colors shadow-sm"
            >
              Ir a Calcular Liquidación
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Datos Clave</h3>
            <div className="space-y-2.5">
              {[
                { icon: User,      label: "Demandante",  value: sentence.plaintiff },
                { icon: Building2, label: "Entidad",     value: sentence.entity },
                { icon: Calendar,  label: "Fecha Fallo", value: sentence.fallo },
                { icon: Hash,      label: "Documento",   value: sentence.document },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-[#1C5BB8]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-xs font-medium text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs text-[#1C5BB8] font-medium mb-1">ℹ️ Recuerda</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Una vez calculada y enviada la liquidación, quedará bloqueada para edición. Verifica todos los datos antes de finalizar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
