import { useState, useMemo } from "react";
import { LucideIcon } from "lucide-react";
import {
  Plus, Search, Filter, Eye, Edit2, Trash2, X, ChevronDown, Scale,
  ArrowLeft, Calendar, Building2, User, Hash, MessageSquare, AlertTriangle,
  FileText, UserCheck, CreditCard, Clock, CheckCircle2, RefreshCw,
} from "lucide-react";
import { Pagination } from "../../components/Pagination";
import { InfoTooltip, StatusTooltip } from "../../components/InfoTooltip";
import { toast } from "sonner";

type Sentence = {
  id: string;
  number: string;
  date: string;
  court: string;
  plaintiff: string;
  document: string;
  status: string;
  liquidator: string;
  payer: string;
  observations: string;
};

type SentenceForm = {
  number: string;
  date: string;
  court: string;
  plaintiff: string;
  document: string;
  observations: string;
  liquidator: string;
  payer: string;
};

const emptyForm: SentenceForm = {
  number: "", date: "", court: "", plaintiff: "",
  document: "", observations: "", liquidator: "", payer: "",
};

const initialSentences: Sentence[] = [
  { id: "1",  number: "S-2026-001", date: "2026-02-20", court: "Juzgado 1° Administrativo Cali",    plaintiff: "Juan Carlos Pérez Morales",    document: "12.345.678", status: "En proceso",            liquidator: "María García",   payer: "Carlos Torres",  observations: "Sentencia de primera instancia, pendiente de liquidación por parte del área." },
  { id: "2",  number: "S-2026-002", date: "2026-02-18", court: "Tribunal Administrativo del Valle", plaintiff: "Ana María Rodríguez Flórez",   document: "98.765.432", status: "Terminada",             liquidator: "Carlos Sánchez", payer: "Laura Díaz",     observations: "" },
  { id: "3",  number: "S-2026-003", date: "2026-02-15", court: "Juzgado 2° Administrativo Cali",    plaintiff: "Carmen Lucía López Restrepo",  document: "55.512.345", status: "Terminada",             liquidator: "María García",   payer: "Carlos Torres",  observations: "Accionante solicita prioridad en trámite." },
  { id: "4",  number: "S-2026-004", date: "2026-02-12", court: "Tribunal Administrativo del Valle", plaintiff: "Carmen López Restrepo",        document: "44.455.667", status: "Pagada",                liquidator: "Carlos Sánchez", payer: "Laura Díaz",     observations: "" },
  { id: "5",  number: "S-2026-005", date: "2026-02-10", court: "Consejo de Estado",                 plaintiff: "Roberto Antonio Castaño",      document: "11.122.334", status: "En proceso",            liquidator: "Pedro Jiménez",  payer: "Carlos Torres",  observations: "Caso de alta complejidad." },
  { id: "6",  number: "S-2026-006", date: "2026-02-08", court: "Juzgado 3° Administrativo Cali",   plaintiff: "María del Pilar Vargas Ruiz",   document: "33.344.556", status: "Creada",                   liquidator: "Laura Díaz",     payer: "Pedro Gómez",    observations: "Falta documentación adicional del accionante." },
  { id: "7",  number: "S-2026-007", date: "2026-02-05", court: "Juzgado 4° Administrativo Cali",   plaintiff: "Diego Fernando Torres Salazar", document: "77.788.990", status: "En proceso",            liquidator: "María García",   payer: "Carlos Torres",  observations: "" },
  { id: "8",  number: "S-2026-008", date: "2026-02-03", court: "Juzgado 5° Administrativo Cali",   plaintiff: "Luisa Fernanda Gómez Parra",   document: "44.455.123", status: "Terminada",             liquidator: "María García",   payer: "Ana Martínez",   observations: "" },
  { id: "9",  number: "S-2026-009", date: "2026-01-30", court: "Consejo de Estado",                 plaintiff: "Carlos Eduardo Muñoz Ospina",  document: "66.677.889", status: "En proceso",               liquidator: "Pedro Jiménez",  payer: "Pedro Gómez",    observations: "Recurso de apelación interpuesto por la entidad el 2026-01-28. En espera de resolución del Consejo de Estado." },
  { id: "10", number: "S-2026-010", date: "2026-01-28", court: "Tribunal Administrativo del Valle", plaintiff: "Patricia Elena Herrera Díaz",  document: "22.233.445", status: "Terminada",             liquidator: "Carlos Sánchez", payer: "Laura Díaz",     observations: "" },
  { id: "11", number: "S-2026-011", date: "2026-01-25", court: "Juzgado 1° Administrativo Cali",   plaintiff: "Andrés Felipe Sánchez Lozano", document: "88.899.001", status: "Creada",                   liquidator: "Laura Díaz",     payer: "Carlos Torres",  observations: "Ejecución suspendida mediante auto del 2026-01-20. Pendiente levantamiento de medida cautelar." },
  { id: "12", number: "S-2025-089", date: "2026-01-20", court: "Tribunal Administrativo del Valle", plaintiff: "Sandra Milena Ríos Quintero",  document: "55.566.778", status: "Pagada",                liquidator: "María García",   payer: "Ana Martínez",   observations: "" },
  { id: "13", number: "S-2025-082", date: "2026-01-15", court: "Juzgado 2° Administrativo Cali",   plaintiff: "Mauricio Alberto Peña Castro",  document: "99.900.112", status: "Creada",                   liquidator: "Carlos Sánchez", payer: "Pedro Gómez",    observations: "Documentación incompleta." },
  { id: "14", number: "S-2025-075", date: "2026-01-10", court: "Consejo de Estado",                 plaintiff: "Isabel Cristina Vergara Mora",  document: "11.200.334", status: "En proceso",            liquidator: "Laura Díaz",     payer: "Carlos Torres",  observations: "Expediente derivado del Tribunal Nacional." },
  { id: "15", number: "S-2025-068", date: "2026-01-05", court: "Tribunal Administrativo del Valle", plaintiff: "Germán Arturo Cárdenas Nieto",  document: "66.543.210", status: "Terminada",             liquidator: "María García",   payer: "Laura Díaz",     observations: "" },
];

// ─── Status configuration ──────────────────────────────────────────────────────
const statusConfig: Record<string, { bg: string; text: string; border: string; icon: LucideIcon; label: string }> = {
  "Creada":                   { bg: "bg-gray-50",   text: "text-gray-600",   border: "border-gray-200",   icon: FileText,     label: "Creada" },
  "En proceso":               { bg: "bg-blue-50",   text: "text-[#1C5BB8]",  border: "border-blue-200",   icon: Clock,        label: "En proceso" },
  "Terminada":                { bg: "bg-green-50",  text: "text-[#34A853]",  border: "border-green-200",  icon: CheckCircle2, label: "Terminada" },
  "Pagada":                   { bg: "bg-gray-50",   text: "text-gray-600",   border: "border-gray-200",   icon: CreditCard,   label: "Pagada" },
  "Corrección de liquidador": { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  icon: AlertTriangle,label: "Correc. liquidador" },
  "Corrección de Pagador":    { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: RefreshCw,    label: "Correc. pagador" },
};

// ─── Status tooltip descriptions ──────────────────────────────────────────────
const STATUS_TIPS: Record<string, string> = {
  "Creada":                   "Sentencia registrada en el sistema. Pendiente de asignación o información inicial.",
  "En proceso":               "El liquidador está elaborando el cálculo. No puede modificarse hasta completar la liquidación.",
  "Terminada":                "Liquidación completada. Pendiente que el pagador ejecute el pago correspondiente.",
  "Pagada":                   "Pago efectuado y verificado. El expediente está cerrado.",
  "Corrección de liquidador": "El pagador ha solicitado corrección de la liquidación. El liquidador debe revisar y corregir.",
  "Corrección de Pagador":    "El administrador ha solicitado corrección del soporte de pago. El pagador debe corregir.",
};

const ALL_STATUSES = ["Todos", "Creada", "En proceso", "Terminada", "Pagada", "Corrección de liquidador", "Corrección de Pagador"];

const ITEMS_PER_PAGE = 8;
const LIQUIDATORS = ["María García", "Carlos Sánchez", "Laura Díaz", "Pedro Jiménez", "Claudia Morales"];
const PAYERS = ["Carlos Torres", "Pedro Gómez", "Ana Martínez", "Laura Díaz"];

// ─── Sub-component: Status Badge with Tooltip ─────────────────────────────────
function StatusBadge({ status, showIcon = false }: { status: string; showIcon?: boolean }) {
  const sc = statusConfig[status] ?? statusConfig["En proceso"];
  const Icon = sc.icon;
  return (
    <StatusTooltip description={STATUS_TIPS[status] ?? ""}>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${sc.bg} ${sc.text} ${sc.border}`}>
        {showIcon && <Icon size={11} />}
        {status}
      </span>
    </StatusTooltip>
  );
}

// ─── Sub-component: Sentence Detail View ──────────────────────────────────────
function SentenceDetail({ sentence, onBack, onEdit }: { sentence: Sentence; onBack: () => void; onEdit: () => void }) {
  const sc = statusConfig[sentence.status] ?? statusConfig["En proceso"];
  const StatusIcon = sc.icon;
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Back button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-[#1C5BB8] hover:bg-[#1850A0] text-white px-5 py-2.5 rounded-xl shadow-md transition-all hover:shadow-lg active:scale-95 font-medium text-sm"
        >
          <ArrowLeft size={17} />
          Regresar a Sentencias
        </button>
        <div className="h-5 w-px bg-gray-200" />
        <span className="text-xs text-gray-400">Detalle del expediente</span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#1C5BB8] to-[#2B6FCC] px-6 py-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale size={16} className="text-blue-200" />
              <span className="text-blue-200 text-xs font-medium uppercase tracking-wider">Sentencia Judicial</span>
            </div>
            <h1 className="text-xl font-bold text-white">{sentence.number}</h1>
            <p className="text-blue-200 text-sm mt-0.5">{sentence.court}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Edit2 size={13} /> Editar
            </button>
            <StatusTooltip description={STATUS_TIPS[sentence.status] ?? ""}>
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border cursor-help ${sc.bg} ${sc.text} ${sc.border}`}>
                <StatusIcon size={11} />
                {sentence.status}
              </span>
            </StatusTooltip>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Información del Accionante */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <User size={12} /> Información del Accionante
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3.5">
                <p className="text-xs text-gray-400 mb-0.5">Accionante</p>
                <p className="text-sm font-semibold text-gray-900">{sentence.plaintiff}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3.5">
                <p className="text-xs text-gray-400 mb-0.5">Cédula / NIT</p>
                <p className="text-sm font-semibold font-mono text-gray-900">{sentence.document}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3.5">
                <p className="text-xs text-gray-400 mb-0.5">Juzgado / Tribunal</p>
                <p className="text-sm font-medium text-gray-900">{sentence.court}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3.5">
                <p className="text-xs text-gray-400 mb-0.5">Fecha del Fallo</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#1C5BB8]" />
                  {sentence.date}
                </p>
              </div>
            </div>

            {sentence.observations && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                <p className="text-xs text-amber-600 font-medium mb-1 flex items-center gap-1">
                  <MessageSquare size={11} /> Observaciones
                </p>
                <p className="text-sm text-gray-700">{sentence.observations}</p>
              </div>
            )}
          </div>

          {/* Asignación */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck size={12} /> Asignación
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-100">
                <p className="text-xs text-[#1C5BB8] font-medium mb-1 flex items-center gap-1">
                  <FileText size={11} /> Liquidador Asignado
                </p>
                <p className="text-sm font-semibold text-gray-900">{sentence.liquidator || "Sin asignar"}</p>
                <p className="text-[10px] text-gray-400 mt-1">Calcula capital, intereses y actualizaciones.</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3.5 border border-green-100">
                <p className="text-xs text-[#34A853] font-medium mb-1 flex items-center gap-1">
                  <CreditCard size={11} /> Pagador Asignado
                </p>
                <p className="text-sm font-semibold text-gray-900">{sentence.payer || "Sin asignar"}</p>
                <p className="text-[10px] text-gray-400 mt-1">Ejecuta el pago y registra los soportes bancarios.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                <Hash size={11} /> Estado del expediente
              </p>
              <StatusTooltip description={STATUS_TIPS[sentence.status] ?? ""}>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border cursor-help ${sc.bg} ${sc.text} ${sc.border}`}>
                  <StatusIcon size={11} />
                  {sentence.status}
                </span>
              </StatusTooltip>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-3 bg-gray-50/50 flex items-center justify-between">
          <p className="text-xs text-gray-400">Los campos de valor base, intereses e instancia son gestionados por el Liquidador.</p>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-[#1C5BB8] hover:underline"
          >
            <ArrowLeft size={12} /> Volver a la lista
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function Sentences() {
  const [sentences, setSentences] = useState<Sentence[]>(initialSentences);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Sentence | null>(null);
  const [form, setForm] = useState<SentenceForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewItem, setPreviewItem] = useState<Sentence | null>(null);
  const [detailItem, setDetailItem] = useState<Sentence | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Sentence | null>(null);

  const filtered = useMemo(() => sentences.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.number.toLowerCase().includes(q) || s.plaintiff.toLowerCase().includes(q) || s.document.includes(q) || s.court.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Todos" || s.status === filterStatus;
    return matchSearch && matchStatus;
  }), [sentences, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const activeFilters = [filterStatus !== "Todos"].filter(Boolean).length;
  const clearFilters = () => { setFilterStatus("Todos"); setCurrentPage(1); };

  const openCreate = () => {
    setEditItem(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item: Sentence) => {
    setEditItem(item);
    setForm({ number: item.number, date: item.date, court: item.court, plaintiff: item.plaintiff, document: item.document, observations: item.observations, liquidator: item.liquidator, payer: item.payer });
    setShowModal(true);
    setDetailItem(null);
    setPreviewItem(null);
  };

  const handleSave = () => {
    if (!form.number.trim() || !form.date || !form.court.trim() || !form.plaintiff.trim() || !form.document.trim()) {
      toast.error("Completa todos los campos requeridos (*)"); return;
    }
    if (editItem) {
      setSentences(prev => prev.map(s => s.id === editItem.id ? { ...s, ...form } : s));
      toast.success("Sentencia actualizada correctamente");
    } else {
      setSentences(prev => [{ id: String(Date.now()), ...form, status: "En proceso" }, ...prev]);
      toast.success("Sentencia creada exitosamente");
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditItem(null);
  };

  const handleDeleteConfirmed = (item: Sentence) => {
    const copy = { ...item };
    setSentences(prev => prev.filter(s => s.id !== item.id));
    setDeleteConfirm(null);
    toast(`Sentencia ${item.number} eliminada`, {
      description: "Tienes 5 segundos para deshacer esta acción.",
      action: {
        label: "Deshacer",
        onClick: () => {
          setSentences(prev => {
            const newList = [...prev, copy];
            return newList.sort((a, b) => Number(a.id) - Number(b.id));
          });
          toast.success("Eliminación revertida correctamente.");
        },
      },
      duration: 5000,
    });
  };

  const f = (field: keyof SentenceForm, val: string) => setForm(prev => ({ ...prev, [field]: val }));

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (detailItem) {
    const current = sentences.find(s => s.id === detailItem.id) ?? detailItem;
    return (
      <>
        <SentenceDetail
          sentence={current}
          onBack={() => setDetailItem(null)}
          onEdit={() => openEdit(current)}
        />
        {showModal && renderModal()}
      </>
    );
  }

  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="bg-[#1C5BB8] px-6 py-4 flex items-center justify-between sticky top-0 z-10 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Scale size={16} className="text-blue-200" />
              <h2 className="text-sm font-semibold text-white">
                {editItem ? `Editar Sentencia — ${editItem.number}` : "Nueva Sentencia"}
              </h2>
            </div>
            <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X size={16} className="text-white" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">N° Sentencia <span className="text-red-500">*</span></label>
                <input value={form.number} onChange={e => f("number", e.target.value)} type="text" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" placeholder="S-2026-XXX" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Fecha Fallo <span className="text-red-500">*</span></label>
                <input value={form.date} onChange={e => f("date", e.target.value)} type="date" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 inline-flex items-center">
                Juzgado / Tribunal <span className="text-red-500 mr-1">*</span>
                <InfoTooltip content="Órgano judicial que emitió el fallo: Juzgado Administrativo, Tribunal Administrativo o Consejo de Estado (instancia definitiva)." />
              </label>
              <input value={form.court} onChange={e => f("court", e.target.value)} type="text" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" placeholder="Nombre del juzgado o tribunal" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Accionante <span className="text-red-500">*</span></label>
                <input value={form.plaintiff} onChange={e => f("plaintiff", e.target.value)} type="text" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" placeholder="Nombre completo" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Cédula / NIT <span className="text-red-500">*</span></label>
                <input value={form.document} onChange={e => f("document", e.target.value)} type="text" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" placeholder="Número de documento" />
              </div>
            </div>

            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3">
              <p className="text-xs text-[#1C5BB8] font-medium flex items-center gap-1.5">
                <AlertTriangle size={12} />
                Los campos de Valor Base, Intereses e Instancia serán completados por el Liquidador asignado.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5 inline-flex items-center">
                Observaciones
                <InfoTooltip content="Anota aquí información relevante para el proceso: documentación faltante, contexto del caso, instrucciones especiales o novedades que deban conocer el liquidador o el pagador." />
              </label>
              <textarea value={form.observations} onChange={e => f("observations", e.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] resize-none" placeholder="Información adicional relevante para el proceso..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Adjuntar Fallo (PDF)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#5B9BDE] hover:bg-blue-50/30 transition-colors">
                <FileText size={18} className="mx-auto text-gray-300 mb-1" />
                <p className="text-xs text-gray-500">Haz clic para subir el fallo judicial en PDF</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 inline-flex items-center">
                  Asignar Liquidador
                  <InfoTooltip content="El liquidador calcula el monto total: capital, intereses de mora y actualizaciones monetarias. Sin asignación, la sentencia no puede avanzar a 'Terminada'." />
                </label>
                <select value={form.liquidator} onChange={e => f("liquidator", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
                  <option value="">Seleccionar...</option>
                  {LIQUIDATORS.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 inline-flex items-center">
                  Asignar Pagador
                  <InfoTooltip content="El pagador ejecuta la transferencia bancaria y registra los soportes del pago. Se activa solo cuando la liquidación ha sido aprobada." />
                </label>
                <select value={form.payer} onChange={e => f("payer", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
                  <option value="">Seleccionar...</option>
                  {PAYERS.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button onClick={() => { setShowModal(false); setEditItem(null); setForm(emptyForm); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleSave} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium transition-colors shadow-sm">
              {editItem ? "Guardar Cambios" : "Crear Sentencia"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Gestión de Sentencias</h1>
          <p className="text-sm text-gray-500 mt-0.5">Administrar todas las sentencias judiciales del sistema</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#1C5BB8] text-white px-4 py-2 rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium shadow-sm">
          <Plus size={16} /> Nueva Sentencia
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Buscar por N° sentencia, accionante, cédula..." className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
              {search && <button onClick={() => { setSearch(""); setCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={12} className="text-gray-400" /></button>}
            </div>

            <div className="relative">
              <button onClick={() => setShowFilterMenu(!showFilterMenu)} className={`relative flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs transition-colors ${activeFilters > 0 ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                <Filter size={13} /> Filtros <ChevronDown size={11} />
                {activeFilters > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1C5BB8] text-white rounded-full text-[9px] flex items-center justify-center">{activeFilters}</span>}
              </button>
              {showFilterMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                  <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-3">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Estado</p>
                    <div className="space-y-0.5">
                      {ALL_STATUSES.map(opt => {
                        const sc = opt !== "Todos" ? statusConfig[opt] : null;
                        return (
                          <button
                            key={opt}
                            onClick={() => { setFilterStatus(opt); setCurrentPage(1); setShowFilterMenu(false); }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-2 ${filterStatus === opt ? "bg-blue-50 text-[#1C5BB8] font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                          >
                            {sc && (() => {
                              const Icon = sc.icon;
                              return <Icon size={11} className={filterStatus === opt ? "text-[#1C5BB8]" : sc.text} />;
                            })()}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {activeFilters > 0 && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                <X size={12} /> Limpiar
              </button>
            )}
            <span className="ml-auto text-xs text-gray-400">{filtered.length} registros</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["N° Sentencia", "Fecha Fallo", "Accionante", "Estado", "Liquidador", "Pagador", "Acciones"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center">
                  <Scale size={28} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">No se encontraron sentencias</p>
                </td></tr>
              ) : paginated.map(s => {
                const sc = statusConfig[s.status] ?? statusConfig["En proceso"];
                return (
                  <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-bold text-[#1C5BB8]">{s.number}</p>
                      <p className="text-xs text-gray-400 font-mono">{s.document}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">{s.date}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-gray-900">{s.plaintiff}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">{s.court}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">{s.liquidator || <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600">{s.payer || <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setPreviewItem(s)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Vista previa">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Editar">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm(s)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Eliminar">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
      </div>

      {/* ── Preview Overlay ─────────────────────────────────────────────────── */}
      {previewItem && (() => {
        const sc = statusConfig[previewItem.status] ?? statusConfig["En proceso"];
        const StatusIcon = sc.icon;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-[#1C5BB8] to-[#2B6FCC] px-5 py-4 flex items-start justify-between">
                <div>
                  <p className="text-blue-200 text-[10px] uppercase tracking-wider font-medium mb-0.5">Sentencia Judicial</p>
                  <h3 className="text-base font-bold text-white">{previewItem.number}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${sc.bg} ${sc.text} ${sc.border}`}>
                    <StatusIcon size={10} />{previewItem.status}
                  </span>
                  <button onClick={() => setPreviewItem(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                    <X size={15} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Accionante</p>
                    <p className="text-sm font-medium text-gray-900">{previewItem.plaintiff}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Cédula / NIT</p>
                    <p className="text-sm font-mono text-gray-700">{previewItem.document}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Juzgado / Tribunal</p>
                    <p className="text-sm text-gray-700">{previewItem.court}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Fecha Fallo</p>
                    <p className="text-sm text-gray-700">{previewItem.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Liquidador</p>
                    <p className="text-sm text-gray-700">{previewItem.liquidator || "—"}</p>
                  </div>
                </div>
                {previewItem.observations && (
                  <div className="bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                    <p className="text-[10px] text-amber-600 font-medium mb-0.5">Observaciones</p>
                    <p className="text-xs text-gray-700 line-clamp-2">{previewItem.observations}</p>
                  </div>
                )}
                {/* Status tip hint */}
                <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  <p className="text-[10px] text-gray-500 leading-relaxed">{STATUS_TIPS[previewItem.status]}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 px-5 py-3.5 flex items-center justify-between gap-3 bg-gray-50/50">
                <button onClick={() => setPreviewItem(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors font-medium">
                  Cerrar
                </button>
                <button onClick={() => { setDetailItem(previewItem); setPreviewItem(null); }} className="flex items-center gap-1.5 px-4 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs font-medium hover:bg-[#1850A0] transition-colors shadow-sm">
                  Ver Detalle Completo <ArrowLeft size={12} className="rotate-180" />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Confirm Delete Modal ─────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">¿Eliminar sentencia?</h3>
              <p className="text-sm text-gray-500 mb-1">
                Estás a punto de eliminar la sentencia <span className="font-semibold text-gray-800">{deleteConfirm.number}</span>.
              </p>
              <p className="text-xs text-gray-400">Podrás revertir esta acción durante los próximos 5 segundos.</p>
            </div>
            <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                Cancelar
              </button>
              <button onClick={() => handleDeleteConfirmed(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors shadow-sm">
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────────────────────── */}
      {showModal && renderModal()}
    </div>
  );
}