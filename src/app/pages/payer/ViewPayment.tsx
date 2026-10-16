import { useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import {
  ArrowLeft, FileDown, Upload, X,
  CheckCircle, Clock, AlertCircle, AlertTriangle,
  Building2, Calendar, CreditCard, Paperclip,
  Scale, User, Hash, FileText, DollarSign, MessageSquare, Send,
} from "lucide-react";
import { toast } from "sonner";
import {
  ALL_PAYER_SENTENCES,
  paymentMethods,
  bankEntities,
  type PayerSentence,
  type PaymentStatus,
} from "./payerData";
import { InfoTooltip } from "../../components/InfoTooltip";

// ── InfoRow ────────────────────────────────────────────────────────────────────
const InfoRow = ({
  label, value, highlight, warning,
}: {
  label: string; value: string; highlight?: boolean; warning?: boolean;
}) => (
  <div className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-500 w-44 flex-shrink-0">{label}</span>
    <span className={`text-xs font-medium text-right break-words max-w-[200px] ${
      highlight ? "text-[#1C5BB8]" : warning ? "text-orange-700" : "text-gray-800"
    }`}>
      {value}
    </span>
  </div>
);

interface PaymentForm {
  date: string; entity: string; method: string; totalPaid: string; file: File | null;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function ViewPayment() {
  const navigate     = useNavigate();
  const { id }       = useParams<{ id: string }>();
  const location     = useLocation();

  // Use route state if available (current session state), fallback to shared data
  const initialData =
    (location.state?.sentence as PayerSentence | undefined) ||
    ALL_PAYER_SENTENCES.find(s => s.id === id) ||
    ALL_PAYER_SENTENCES[0];

  const [sentence, setSentence] = useState<PayerSentence>(initialData);
  const [showPayModal, setShowPayModal]       = useState(false);
  const [showCorrectModal, setShowCorrectModal] = useState(false);
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionFile, setCorrectionFile]   = useState<File | null>(null);
  const [correctionSent, setCorrectionSent]   = useState(false);

  // Solicitar cambios (for paid sentences)
  const [showCorrModal, setShowCorrModal] = useState(false);
  const [corrReason2, setCorrReason2]     = useState("");
  const [corrSent2, setCorrSent2]         = useState(false);

  const fileInputRef     = useRef<HTMLInputElement>(null);
  const corrFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<PaymentForm>({
    date: "", entity: "", method: "", totalPaid: "", file: null,
  });

  const statusCfg: Record<PaymentStatus, { bg: string; text: string; border: string; label: string; Icon: React.ElementType }> = {
    paid:       { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  label: "Pagada",       Icon: CheckCircle },
    pending:    { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  label: "Pendiente",    Icon: Clock },
    to_correct: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", label: "Por corregir", Icon: AlertCircle },
  };

  const sc = statusCfg[sentence.status];

  const handleDownload = () => {
    toast.success("Descargando documento de liquidación...");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "application/pdf") { toast.error("Solo se permiten archivos PDF"); return; }
    setForm(f => ({ ...f, file }));
  };

  const handleCorrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "application/pdf") { toast.error("Solo se permiten archivos PDF"); return; }
    setCorrectionFile(file);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.entity || !form.method || !form.totalPaid) {
      toast.error("Por favor completa todos los campos obligatorios"); return;
    }
    if (!form.file) { toast.error("Debes adjuntar el soporte de pago en PDF"); return; }
    setSentence(prev => ({
      ...prev, status: "paid",
      paidDate: form.date, paymentMethod: form.method, payingEntity: form.entity,
      voucherRef: `COMP-${Date.now().toString().slice(-6)}`,
    }));
    toast.success(`Pago registrado exitosamente para ${sentence.number}`);
    setShowPayModal(false);
    setForm({ date: "", entity: "", method: "", totalPaid: "", file: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitCorrection = () => {
    if (!correctionReason.trim()) { toast.error("Por favor describe la corrección realizada"); return; }
    if (!correctionFile) { toast.error("Debes adjuntar el nuevo soporte de pago en PDF"); return; }
    setCorrectionSent(true);
    setShowCorrectModal(false);
    toast.success("Solicitud de corrección enviada al administrador. En espera de revisión.");
  };

  const handleSubmitCorrRequest = () => {
    if (!corrReason2.trim()) { toast.error("Por favor describe el motivo de la solicitud de cambios"); return; }
    setCorrSent2(true);
    setShowCorrModal(false);
    toast.success("Solicitud de cambios enviada al administrador. En espera de revisión.");
  };

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Volver</span>
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Detalle del Pago</h1>
            <p className="text-xs text-gray-500 mt-0.5">Sentencia {sentence.number}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${sc.bg} ${sc.text} ${sc.border}`}>
            <sc.Icon size={12} />
            {sc.label}
          </span>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FileDown size={14} />
            Descargar pago de liquidación
          </button>
        </div>
      </div>

      {/* Aviso corrección enviada */}
      {correctionSent && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <AlertTriangle size={16} className="text-[#1C5BB8] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#1C5BB8]">Solicitud de corrección enviada</p>
            <p className="text-xs text-blue-700 mt-0.5">El administrador revisará tu solicitud y notificará la respuesta. El estado permanece como "Por corregir" hasta la resolución.</p>
          </div>
        </div>
      )}

      {/* Nota de corrección del admin */}
      {sentence.status === "to_correct" && sentence.correctionNote && (
        <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <AlertCircle size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-orange-700">Corrección requerida por el administrador</p>
            <p className="text-xs text-orange-700 mt-1 leading-relaxed">{sentence.correctionNote}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Columna principal ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Datos de la Sentencia */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/60">
              <Scale size={15} className="text-[#1C5BB8]" />
              <h2 className="text-sm font-semibold text-gray-900">Datos de la Sentencia</h2>
            </div>
            <div className="p-5">
              <InfoRow label="N° Sentencia"          value={sentence.number} />
              <InfoRow label="Demandante"             value={sentence.plaintiff} />
              <InfoRow label="Entidad"                value={sentence.entity} />
              <InfoRow label="Liquidador Asignado"   value={sentence.liquidator} />
              <InfoRow label="Pagador Asignado"       value={sentence.payer || "Carlos Torres"} />
              {sentence.juzgado && <InfoRow label="Juzgado / Tribunal" value={sentence.juzgado} />}
              {sentence.fallo   && <InfoRow label="Fecha del Fallo"    value={sentence.fallo} />}
              {sentence.tipoObligacion && <InfoRow label="Tipo de Obligación"  value={sentence.tipoObligacion} />}
              <InfoRow label="Fecha de Terminación"  value={sentence.completedDate} />
            </div>
          </div>

          {/* Valores Liquidados */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/60">
              <DollarSign size={15} className="text-[#34A853]" />
              <h2 className="text-sm font-semibold text-gray-900">Valores Liquidados</h2>
            </div>
            <div className="p-5">
              {sentence.capitalBase       && <InfoRow label="Capital Base"          value={sentence.capitalBase} />}
              {sentence.interesesCausados && <InfoRow label="Intereses Causados"     value={sentence.interesesCausados} />}
              {sentence.costas            && <InfoRow label="Costas del Proceso"     value={sentence.costas} />}
              <InfoRow label="Total Liquidado" value={sentence.liquidatedValue} highlight />
              {sentence.observations && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Observaciones</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{sentence.observations}</p>
                </div>
              )}
            </div>
          </div>

          {/* Comprobante de Pago (si está pagada) */}
          {sentence.status === "paid" && (
            <div className="bg-white rounded-xl border border-green-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-green-100 flex items-center gap-2 bg-green-50/60">
                <CheckCircle size={15} className="text-[#34A853]" />
                <h2 className="text-sm font-semibold text-gray-900">Comprobante de Pago</h2>
              </div>
              <div className="p-5">
                <InfoRow label="Fecha de Pago"    value={sentence.paidDate || ""} />
                <InfoRow label="Entidad Bancaria" value={sentence.payingEntity || ""} />
                <InfoRow label="Método de Pago"   value={sentence.paymentMethod || ""} />
                <InfoRow label="N° Comprobante"   value={sentence.voucherRef || ""} highlight />
              </div>
            </div>
          )}
        </div>

        {/* ── Panel lateral de acciones ──────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Tarjeta de estado */}
          <div className={`rounded-xl border p-4 ${sc.bg} ${sc.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <sc.Icon size={16} className={sc.text} />
              <span className={`text-sm font-semibold ${sc.text}`}>{sc.label}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {sentence.status === "paid"       && "Pago registrado exitosamente. El proceso se encuentra completado."}
              {sentence.status === "pending"    && "Esta sentencia está pendiente de pago. Adjunta el soporte de pago correspondiente."}
              {sentence.status === "to_correct" && "El administrador ha solicitado una corrección. Revisa la nota y realiza los ajustes necesarios."}
            </p>
          </div>

          {/* Acciones disponibles */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2.5">
            <p className="text-xs font-semibold text-gray-700 mb-3">Acciones disponibles</p>

            {sentence.status === "pending" && (
              <button
                onClick={() => setShowPayModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] transition-colors shadow-sm"
              >
                <Upload size={15} />
                Registrar Pago
              </button>
            )}

            {sentence.status === "to_correct" && !correctionSent && (
              <button
                onClick={() => setShowCorrectModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors shadow-sm"
              >
                <FileText size={15} />
                Enviar Corrección
              </button>
            )}

            {sentence.status === "paid" && (
              <button
                onClick={() => setShowCorrModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                <MessageSquare size={15} />
                Solicitar Cambios
              </button>
            )}

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <FileDown size={15} />
              Descargar pago de liquidación
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={15} />
              Volver
            </button>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-700 mb-3">Información adicional</p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Hash size={12} className="text-gray-400 flex-shrink-0" />
                <span>{sentence.number}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <User size={12} className="text-gray-400 flex-shrink-0" />
                <span>{sentence.liquidator}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                <span>Terminada: {sentence.completedDate}</span>
              </div>
              {sentence.paidDate && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle size={12} className="text-[#34A853] flex-shrink-0" />
                  <span>Pagada: {sentence.paidDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Overlay: Registrar Pago ───────────────────────────────────────── */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPayModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#1C5BB8] px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                    <Upload size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Registrar Soporte de Pago</h2>
                    <p className="text-xs text-blue-200">Sentencia {sentence.number}</p>
                  </div>
                </div>
                <button onClick={() => setShowPayModal(false)} className="p-1.5 hover:bg-white/20 rounded-lg">
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>
            {/* Resumen */}
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex flex-wrap gap-4 flex-shrink-0">
              <div>
                <p className="text-xs text-blue-500 mb-0.5">Demandante</p>
                <p className="text-xs font-medium text-gray-800">{sentence.plaintiff}</p>
              </div>
              <div>
                <p className="text-xs text-blue-500 mb-0.5">Valor a Pagar</p>
                <p className="text-xs font-bold text-[#1C5BB8]">{sentence.liquidatedValue}</p>
              </div>
            </div>
            {/* Formulario - scrollable */}
            <div className="overflow-y-auto flex-1">
              <form id="vp-pay-form" onSubmit={handleSubmitPayment} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#1C5BB8]" />Fecha de Pago <span className="text-red-500">*</span></span>
                  </label>
                  <input type="date" required value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Building2 size={13} className="text-[#1C5BB8]" />Entidad Bancaria <span className="text-red-500">*</span></span>
                  </label>
                  <select required value={form.entity} onChange={e => setForm(f => ({ ...f, entity: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
                    <option value="">Selecciona la entidad bancaria...</option>
                    {bankEntities.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><CreditCard size={13} className="text-[#1C5BB8]" />Método de Pago <span className="text-red-500">*</span></span>
                  </label>
                  <select required value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
                    <option value="">Selecciona el método de pago...</option>
                    {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><DollarSign size={13} className="text-[#1C5BB8]" />Total Pagado <span className="text-red-500">*</span></span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="text" required value={form.totalPaid}
                      onChange={e => { const v = e.target.value.replace(/[^0-9.]/g, ""); setForm(f => ({ ...f, totalPaid: v })); }}
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Valor ref: <span className="font-medium text-gray-600">{sentence.liquidatedValue}</span></p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5"><Paperclip size={13} className="text-[#1C5BB8]" />Soporte de Pago (PDF) <span className="text-red-500">*</span>
                      <InfoTooltip content="Adjunta el comprobante de pago emitido por la entidad bancaria en formato PDF. Debe ser el documento oficial con número de transacción, fecha y monto." />
                    </span>
                  </label>
                  <div onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${form.file ? "border-[#34A853] bg-green-50" : "border-gray-300 hover:border-[#5B9BDE] hover:bg-blue-50/30"}`}>
                    <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                    {form.file ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle size={18} className="text-[#34A853]" />
                        <div className="text-left">
                          <p className="text-xs font-medium text-[#34A853]">{form.file.name}</p>
                          <p className="text-xs text-gray-400">{(form.file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button type="button" onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, file: null })); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="ml-auto p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload size={24} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs text-gray-500">Haz clic para subir el comprobante</p>
                        <p className="text-xs text-gray-400 mt-0.5">Solo archivos PDF</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Una vez registrado el pago, la sentencia quedará marcada como pagada.</p>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setShowPayModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button form="vp-pay-form" type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-[#34A853] text-white rounded-lg text-sm hover:bg-[#2d9247] shadow-sm">
                <Upload size={15} />
                Registrar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Overlay: Enviar Corrección ───────────────────────────────────── */}
      {showCorrectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCorrectModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="bg-orange-600 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Enviar Corrección al Administrador</h2>
                    <p className="text-xs text-orange-200">Sentencia {sentence.number}</p>
                  </div>
                </div>
                <button onClick={() => setShowCorrectModal(false)} className="p-1.5 hover:bg-white/20 rounded-lg">
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="px-6 py-5 space-y-4">
                {/* Nota del admin */}
                {sentence.correctionNote && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs font-semibold text-orange-700 mb-1">Corrección solicitada por el administrador:</p>
                    <p className="text-xs text-orange-600 leading-relaxed">{sentence.correctionNote}</p>
                  </div>
                )}
                {/* Descripción de la corrección */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Descripción de la corrección realizada <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={correctionReason}
                    onChange={e => setCorrectionReason(e.target.value)}
                    placeholder="Describe detalladamente las correcciones realizadas, el número de cuenta correcto, el monto verificado u otros ajustes..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  />
                </div>
                {/* Nuevo soporte PDF */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Paperclip size={13} className="text-orange-600" />
                      Nuevo soporte de pago (PDF) <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <div
                    onClick={() => corrFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                      correctionFile ? "border-[#34A853] bg-green-50" : "border-orange-200 hover:border-orange-400 hover:bg-orange-50/30"
                    }`}
                  >
                    <input ref={corrFileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleCorrFileChange} />
                    {correctionFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle size={18} className="text-[#34A853]" />
                        <div className="text-left">
                          <p className="text-xs font-medium text-[#34A853]">{correctionFile.name}</p>
                          <p className="text-xs text-gray-400">{(correctionFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button type="button" onClick={e => { e.stopPropagation(); setCorrectionFile(null); if (corrFileInputRef.current) corrFileInputRef.current.value = ""; }} className="ml-auto p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload size={24} className="mx-auto text-orange-200 mb-2" />
                        <p className="text-xs text-gray-500">Haz clic para subir el nuevo comprobante</p>
                        <p className="text-xs text-gray-400 mt-0.5">Solo archivos PDF</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setShowCorrectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleSubmitCorrection}
                className="flex items-center gap-2 px-5 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 shadow-sm">
                <FileText size={15} />
                Enviar al Administrador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Overlay: Solicitar corrección al administrador (para sentencias pagadas) ── */}
      {showCorrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="corr-paid-title">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowCorrModal(false); setCorrReason2(""); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
            {/* Header */}
            <div className="bg-[#1C5BB8] px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-white" aria-hidden="true" />
                <div>
                  <h2 id="corr-paid-title" className="text-sm font-semibold text-white">Solicitar corrección al administrador</h2>
                  <p className="text-xs text-blue-200">{sentence.number} — {sentence.plaintiff}</p>
                </div>
              </div>
              <button
                onClick={() => { setShowCorrModal(false); setCorrReason2(""); }}
                className="p-1.5 hover:bg-white/20 rounded-lg"
                aria-label="Cerrar modal"
              >
                <X size={18} className="text-white" aria-hidden="true" />
              </button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Valor pagado + comprobante */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-400 mb-0.5">Valor pagado</p>
                  <p className="font-semibold text-gray-800">{sentence.liquidatedValue}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Comprobante</p>
                  <p className="font-semibold text-gray-800">{sentence.voucherRef || "—"}</p>
                </div>
              </div>
              <div>
                <label htmlFor="corr2-reason" className="block text-xs font-medium text-gray-700 mb-1.5">
                  Motivo de la corrección <span className="text-red-500" aria-hidden="true">*</span>
                  <span className="sr-only">(obligatorio)</span>
                </label>
                <textarea
                  id="corr2-reason"
                  rows={4}
                  value={corrReason2}
                  onChange={e => setCorrReason2(e.target.value)}
                  placeholder="Describe qué necesitas corregir en este pago..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] resize-none"
                />
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg" role="note">
                <p className="text-xs text-[#1C5BB8]">
                  Si el administrador aprueba la solicitud, la sentencia volverá a Sentencias Pendientes para ser corregida.
                </p>
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => { setShowCorrModal(false); setCorrReason2(""); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitCorrRequest}
                className="px-4 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs hover:bg-[#1850A0] inline-flex items-center gap-1.5"
              >
                <Send size={13} aria-hidden="true" /> Enviar solicitud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}