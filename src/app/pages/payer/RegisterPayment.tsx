import { useState, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  ArrowLeft, Upload, CreditCard, FileText, CheckCircle, Building2,
  Calendar, DollarSign, Paperclip, X, Loader2, Lock, AlertCircle,
  ChevronRight, ShieldCheck, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { ALL_PAYER_SENTENCES } from "./payerData";
import {
  type PaymentChannel, type PaymentTxStatus, type AjusteTipo,
  ajusteLabels,
} from "./paymentModel";

type Tab = "report" | "gateway";
type GatewayStep = "select" | "form" | "processing" | "result";

// ── Styled payment channel logos ──────────────────────────────────────────────
function PSELogo() {
  return (
    <div className="flex items-center justify-center w-12 h-8 rounded-md bg-[#00338d]">
      <span className="text-white font-extrabold text-xs tracking-tighter">PSE</span>
    </div>
  );
}
function PayULogo() {
  return (
    <div className="flex items-center justify-center w-14 h-8 rounded-md bg-[#00c0ef]">
      <span className="text-white font-extrabold text-xs">Pay<span className="text-[#ff6900]">U</span></span>
    </div>
  );
}
function VisaLogo() {
  return (
    <div className="flex items-center justify-center w-12 h-8 rounded-md bg-[#1a1f71]">
      <span className="text-white font-extrabold text-sm italic">VISA</span>
    </div>
  );
}
function MastercardLogo() {
  return (
    <div className="flex items-center justify-center w-12 h-8 rounded-md bg-white border border-gray-200">
      <div className="flex">
        <div className="w-5 h-5 rounded-full bg-[#eb001b] opacity-90" />
        <div className="w-5 h-5 rounded-full bg-[#f79e1b] opacity-90 -ml-2" />
      </div>
    </div>
  );
}
function NequiLogo() {
  return (
    <div className="flex items-center justify-center w-14 h-8 rounded-md bg-[#4A0088]">
      <span className="text-white font-extrabold text-xs">Nequi</span>
    </div>
  );
}
function DaviplataLogo() {
  return (
    <div className="flex items-center justify-center w-16 h-8 rounded-md bg-[#e40a17]">
      <span className="text-white font-extrabold text-xs">Daviplata</span>
    </div>
  );
}
function BancolombiaLogo() {
  return (
    <div className="flex items-center justify-center w-16 h-8 rounded-md bg-[#FDDA24]">
      <span className="text-[#1a1a1a] font-extrabold text-[10px]">Bancolombia</span>
    </div>
  );
}
function EfectyLogo() {
  return (
    <div className="flex items-center justify-center w-14 h-8 rounded-md bg-[#FFCF00]">
      <span className="text-[#1a1a1a] font-extrabold text-xs">Efecty</span>
    </div>
  );
}

const channels: { id: PaymentChannel; label: string; desc: string; color: string; Logo: React.FC }[] = [
  { id: "PSE",  label: "PSE",  desc: "Débito desde tu cuenta bancaria",  color: "bg-blue-50 border-blue-200 text-[#1C5BB8]",   Logo: PSELogo },
  { id: "PayU", label: "PayU", desc: "Pasarela multimedios PayU Latam",   color: "bg-cyan-50 border-cyan-200 text-cyan-700",     Logo: PayULogo },
  { id: "Visa", label: "Visa / Mastercard", desc: "Tarjeta crédito o débito internacional", color: "bg-indigo-50 border-indigo-200 text-indigo-700", Logo: VisaLogo },
  { id: "Nequi" as PaymentChannel, label: "Nequi", desc: "Pago desde tu cuenta Nequi", color: "bg-purple-50 border-purple-200 text-purple-700", Logo: NequiLogo },
  { id: "Daviplata" as PaymentChannel, label: "Daviplata", desc: "Transferencia desde Daviplata", color: "bg-red-50 border-red-200 text-red-700", Logo: DaviplataLogo },
  { id: "Bancolombia" as PaymentChannel, label: "Bancolombia", desc: "Pago en línea Bancolombia", color: "bg-yellow-50 border-yellow-200 text-yellow-700", Logo: BancolombiaLogo },
  { id: "Efecty" as PaymentChannel, label: "Efecty", desc: "Pago en efectivo Efecty", color: "bg-amber-50 border-amber-200 text-amber-700", Logo: EfectyLogo },
];

const banks = ["Bancolombia", "Banco de Bogotá", "Davivienda", "BBVA Colombia", "Banco Popular", "Banco de Occidente"];

export function RegisterPayment() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const isEdit = params.get("edit") === "1";
  const navigate = useNavigate();

  const sentence = useMemo(() => ALL_PAYER_SENTENCES.find(s => s.id === id), [id]);
  const [tab, setTab] = useState<Tab>("report");

  // ── Tab 1: Subir reporte ─────────────────────────────────
  const [reportForm, setReportForm] = useState({
    date: sentence?.paidDate || "",
    bank: sentence?.payingEntity || "",
    method: sentence?.paymentMethod || "",
    total: "",
    file: null as File | null,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Tab 2: Pasarela ───────────────────────────────────────
  const [gwStep, setGwStep] = useState<GatewayStep>("select");
  const [channel, setChannel] = useState<PaymentChannel | null>(null);
  const [gwData, setGwData] = useState({
    bank: "", document: "", cardNumber: "", cardHolder: "", cardExp: "", cardCvv: "",
    email: sentence ? `${sentence.plaintiff.split(" ")[0].toLowerCase()}@correo.com` : "",
  });
  const [txStatus, setTxStatus] = useState<PaymentTxStatus>("iniciado");
  const [txId, setTxId] = useState("");

  // ── Ajuste sobre pago existente ──────────────────────────
  const [showAjuste, setShowAjuste] = useState(false);
  const [ajuste, setAjuste] = useState<{ tipo: AjusteTipo; amount: string; reason: string }>({
    tipo: "correccion", amount: "", reason: "",
  });

  if (!sentence) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-gray-500">Sentencia no encontrada</p>
        <button onClick={() => navigate("/payer")} className="mt-4 text-xs text-[#1C5BB8] hover:underline">Volver al panel</button>
      </div>
    );
  }

  const fmt = (v: number) => "$" + v.toLocaleString("es-CO");

  // ── Handlers ─────────────────────────────────────────────
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && f.type !== "application/pdf") { toast.error("Solo PDF"); return; }
    setReportForm(rf => ({ ...rf, file: f }));
  };

  const submitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const { date, bank, method, total, file } = reportForm;
    if (!date || !bank || !method || !total) { toast.error("Completa todos los campos"); return; }
    if (!file && !isEdit) { toast.error("Adjunta el soporte en PDF"); return; }
    toast.success(`Soporte ${isEdit ? "actualizado" : "registrado"} para ${sentence.number}`);
    setTimeout(() => navigate("/payer/paid"), 600);
  };

  const submitAjuste = () => {
    if (!ajuste.amount || !ajuste.reason) { toast.error("Completa monto y motivo"); return; }
    toast.success(`Ajuste "${ajusteLabels[ajuste.tipo]}" registrado`);
    setShowAjuste(false);
    setAjuste({ tipo: "correccion", amount: "", reason: "" });
  };

  // ── Pasarela ─────────────────────────────────────────────
  const startGateway = () => {
    if (channel === "PSE" && (!gwData.bank || !gwData.document)) { toast.error("Selecciona banco y digita documento"); return; }
    if (channel === "Visa" && (!gwData.cardNumber || !gwData.cardHolder || !gwData.cardExp || !gwData.cardCvv)) { toast.error("Completa los datos de la tarjeta"); return; }
    if (channel === "PayU" && !gwData.email) { toast.error("Ingresa el email"); return; }

    setGwStep("processing");
    setTxStatus("procesando");
    const newTxId = "TX-" + Date.now().toString().slice(-8);
    setTxId(newTxId);

    setTimeout(() => {
      const ok = Math.random() > 0.15;
      setTxStatus(ok ? "aprobado" : "rechazado");
      setGwStep("result");
    }, 2400);
  };

  const resetGateway = () => {
    setGwStep("select"); setChannel(null); setTxStatus("iniciado"); setTxId("");
    setGwData(d => ({ ...d, bank: "", document: "", cardNumber: "", cardHolder: "", cardExp: "", cardCvv: "" }));
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#1C5BB8]">
        <ArrowLeft size={14} /> Volver
      </button>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {isEdit ? "Editar soporte de pago" : "Registrar pago"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Sentencia <span className="font-mono text-[#1C5BB8]">{sentence.number}</span> — {sentence.plaintiff}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Valor a pagar</p>
            <p className="text-lg font-bold text-[#1C5BB8]">{sentence.liquidatedValue}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div><p className="text-gray-400">Entidad demandada</p><p className="font-medium text-gray-700 truncate">{sentence.entity}</p></div>
          <div><p className="text-gray-400">Liquidador</p><p className="font-medium text-gray-700">{sentence.liquidator}</p></div>
          <div><p className="text-gray-400">Tipo Obligación</p><p className="font-medium text-gray-700">{sentence.tipoObligacion || "—"}</p></div>
          <div><p className="text-gray-400">Fecha Terminada</p><p className="font-medium text-gray-700">{sentence.completedDate}</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button onClick={() => setTab("report")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${tab === "report" ? "text-[#1C5BB8] border-b-2 border-[#1C5BB8] bg-blue-50/40" : "text-gray-500 hover:bg-gray-50"}`}>
            <Upload size={14} /> Subir reporte de pago
          </button>
          <button onClick={() => setTab("gateway")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${tab === "gateway" ? "text-[#1C5BB8] border-b-2 border-[#1C5BB8] bg-blue-50/40" : "text-gray-500 hover:bg-gray-50"}`}>
            <CreditCard size={14} /> Pagar liquidación
          </button>
        </div>

        {/* ── TAB 1: Reporte ────────────────────────────────── */}
        {tab === "report" && (
          <form onSubmit={submitReport} className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5"><Calendar size={11} className="inline mr-1 text-[#1C5BB8]" /> Fecha de pago *</label>
                <input type="date" value={reportForm.date} onChange={e => setReportForm({ ...reportForm, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5"><Building2 size={11} className="inline mr-1 text-[#1C5BB8]" /> Entidad bancaria *</label>
                <select value={reportForm.bank} onChange={e => setReportForm({ ...reportForm, bank: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]">
                  <option value="">Selecciona...</option>{banks.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5"><CreditCard size={11} className="inline mr-1 text-[#1C5BB8]" /> Método *</label>
                <select value={reportForm.method} onChange={e => setReportForm({ ...reportForm, method: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]">
                  <option value="">Selecciona...</option>
                  <option>Transferencia Bancaria</option><option>Cheque</option><option>Consignación Bancaria</option><option>Pago en Línea PSE</option><option>Giro Bancario</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5"><DollarSign size={11} className="inline mr-1 text-[#1C5BB8]" /> Total pagado *</label>
                <input type="text" value={reportForm.total} onChange={e => setReportForm({ ...reportForm, total: e.target.value.replace(/[^0-9.]/g, "") })}
                  placeholder="0" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
                <p className="text-xs text-gray-400 mt-1">Referencia: {sentence.liquidatedValue}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5"><Paperclip size={11} className="inline mr-1 text-[#1C5BB8]" /> Soporte (PDF) {!isEdit && "*"}</label>
              <div onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${reportForm.file ? "border-[#34A853] bg-green-50" : "border-gray-300 hover:border-[#5B9BDE] hover:bg-blue-50/30"}`}>
                <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
                {reportForm.file ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle size={18} className="text-[#34A853]" />
                    <span className="text-xs font-medium text-[#34A853]">{reportForm.file.name}</span>
                    <button type="button" onClick={e => { e.stopPropagation(); setReportForm({ ...reportForm, file: null }); }} className="ml-2 p-1 hover:bg-red-50 rounded"><X size={12} className="text-gray-500" /></button>
                  </div>
                ) : (
                  <div>
                    <Upload size={22} className="mx-auto text-gray-300 mb-1" />
                    <p className="text-xs text-gray-500">{isEdit ? "Reemplazar soporte" : "Click para subir"}</p>
                    <p className="text-xs text-gray-400">Solo archivos PDF</p>
                  </div>
                )}
              </div>
            </div>

            {isEdit && sentence.status === "paid" && (
              <div className="border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setShowAjuste(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs hover:bg-amber-100">
                  <RefreshCw size={13} /> Registrar ajuste sobre este pago
                </button>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#34A853] text-white rounded-lg text-xs hover:bg-[#2d9247]">
                <Upload size={13} /> {isEdit ? "Actualizar soporte" : "Registrar pago"}
              </button>
            </div>
          </form>
        )}

        {/* ── TAB 2: Pasarela ───────────────────────────────── */}
        {tab === "gateway" && (
          <div className="p-6">
            {gwStep === "select" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                  <ShieldCheck size={14} className="text-[#1C5BB8]" />
                  <p className="text-xs text-[#1C5BB8]">Selecciona el método de pago. La transacción es simulada con fines de demostración.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {channels.map(c => {
                    const LogoComp = c.Logo;
                    return (
                      <button key={c.id} onClick={() => { setChannel(c.id); setGwStep("form"); }}
                        className={`text-left p-4 border rounded-xl transition-all hover:shadow-md ${c.color} hover:border-current`}>
                        <div className="mb-2"><LogoComp /></div>
                        <p className="text-xs font-semibold mb-0.5">{c.label}</p>
                        <p className="text-[10px] opacity-80">{c.desc}</p>
                        <ChevronRight size={13} className="mt-1.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {gwStep === "form" && channel && (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Pagar con</p>
                  <p className="text-lg font-bold text-[#1C5BB8]">{channels.find(c => c.id === channel)?.label}</p>
                  <p className="text-xs text-gray-500 mt-1">Monto: <span className="font-bold text-gray-800">{sentence.liquidatedValue}</span></p>
                </div>

                {channel === "PSE" && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Banco</label>
                      <select value={gwData.bank} onChange={e => setGwData({ ...gwData, bank: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                        <option value="">Selecciona tu banco...</option>{banks.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Documento del titular</label>
                      <input value={gwData.document} onChange={e => setGwData({ ...gwData, document: e.target.value.replace(/[^0-9]/g, "") })}
                        placeholder="Cédula" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                    </div>
                  </>
                )}

                {channel === "Visa" && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Número de tarjeta</label>
                      <input value={gwData.cardNumber} onChange={e => setGwData({ ...gwData, cardNumber: e.target.value.replace(/[^0-9]/g, "").slice(0, 16) })}
                        placeholder="•••• •••• •••• ••••" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg font-mono" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Titular</label>
                      <input value={gwData.cardHolder} onChange={e => setGwData({ ...gwData, cardHolder: e.target.value })}
                        placeholder="Nombre como aparece en la tarjeta" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Vencimiento</label>
                        <input value={gwData.cardExp} onChange={e => setGwData({ ...gwData, cardExp: e.target.value })}
                          placeholder="MM/AA" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">CVV</label>
                        <input type="password" value={gwData.cardCvv} onChange={e => setGwData({ ...gwData, cardCvv: e.target.value.replace(/[^0-9]/g, "").slice(0, 4) })}
                          placeholder="•••" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                      </div>
                    </div>
                  </>
                )}

                {channel === "PayU" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" value={gwData.email} onChange={e => setGwData({ ...gwData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                    <p className="text-xs text-gray-400 mt-1">Recibirás el comprobante en este correo.</p>
                  </div>
                )}

                {(channel === "Nequi" || channel === "Daviplata" || channel === "Bancolombia" || channel === "Efecty") && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Número de celular / cuenta</label>
                      <input value={gwData.document} onChange={e => setGwData({ ...gwData, document: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) })}
                        placeholder="3XXXXXXXXX" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Email de confirmación</label>
                      <input type="email" value={gwData.email} onChange={e => setGwData({ ...gwData, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                      <p className="text-xs text-gray-400 mt-1">Recibirás el comprobante en este correo.</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <Lock size={12} className="text-gray-500" />
                  <p className="text-xs text-gray-600">Conexión cifrada — pasarela simulada</p>
                </div>

                <div className="flex justify-between gap-2 pt-2">
                  <button onClick={resetGateway} className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50">Volver</button>
                  <button onClick={startGateway} className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs hover:bg-[#1850A0]">
                    Pagar {fmt(sentence.liquidatedRaw)} <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {gwStep === "processing" && (
              <div className="py-16 text-center">
                <Loader2 size={42} className="mx-auto text-[#1C5BB8] animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-800">Procesando pago...</p>
                <p className="text-xs text-gray-500 mt-1">No cierres esta ventana</p>
                <p className="text-xs text-gray-400 mt-3 font-mono">TX: {txId}</p>
              </div>
            )}

            {gwStep === "result" && (
              <div className="py-10 text-center max-w-md mx-auto">
                {txStatus === "aprobado" ? (
                  <>
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle size={36} className="text-[#34A853]" />
                    </div>
                    <p className="text-base font-bold text-[#34A853]">Pago aprobado</p>
                    <p className="text-xs text-gray-500 mt-1">La transacción fue procesada exitosamente.</p>
                    <div className="mt-5 p-4 bg-gray-50 border border-gray-200 rounded-lg text-left text-xs space-y-1.5">
                      <div className="flex justify-between"><span className="text-gray-500">Sentencia</span><span className="font-medium">{sentence.number}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Canal</span><span className="font-medium">{channel}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Monto</span><span className="font-bold text-[#34A853]">{sentence.liquidatedValue}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">TX ID</span><span className="font-mono">{txId}</span></div>
                    </div>
                    <div className="mt-5 flex justify-center gap-2">
                      <button onClick={() => navigate("/payer/paid")} className="px-4 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs hover:bg-[#1850A0]">Ir a pagadas</button>
                      <button onClick={resetGateway} className="px-4 py-2 border border-gray-300 rounded-lg text-xs hover:bg-gray-50">Nuevo intento</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
                      <AlertCircle size={36} className="text-[#CE1126]" />
                    </div>
                    <p className="text-base font-bold text-[#CE1126]">Pago rechazado</p>
                    <p className="text-xs text-gray-500 mt-1">No se pudo procesar la transacción. Intenta nuevamente.</p>
                    <p className="text-xs text-gray-400 mt-2 font-mono">TX: {txId}</p>
                    <button onClick={resetGateway} className="mt-5 px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs hover:bg-[#1850A0]">Reintentar</button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Modal Ajuste ─── */}
      {showAjuste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAjuste(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-amber-500 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2"><RefreshCw size={18} className="text-white" />
                <h2 className="text-sm font-semibold text-white">Registrar ajuste</h2></div>
              <button onClick={() => setShowAjuste(false)} className="p-1.5 hover:bg-white/20 rounded-lg"><X size={18} className="text-white" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Tipo de ajuste</label>
                <select value={ajuste.tipo} onChange={e => setAjuste({ ...ajuste, tipo: e.target.value as AjusteTipo })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                  <option value="correccion">{ajusteLabels.correccion}</option>
                  <option value="reverso_parcial">{ajusteLabels.reverso_parcial}</option>
                  <option value="complemento">{ajusteLabels.complemento}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Monto del ajuste</label>
                <input value={ajuste.amount} onChange={e => setAjuste({ ...ajuste, amount: e.target.value.replace(/[^0-9.]/g, "") })}
                  placeholder="0" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Motivo</label>
                <textarea value={ajuste.reason} onChange={e => setAjuste({ ...ajuste, reason: e.target.value })}
                  rows={3} placeholder="Describe el motivo del ajuste..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setShowAjuste(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button onClick={submitAjuste} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs hover:bg-amber-600">Guardar ajuste</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}