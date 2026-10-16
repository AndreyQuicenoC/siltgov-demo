import { useState, useMemo } from "react";
import { Plus, Search, Edit2, Trash2, Eye, X, User, Mail, Hash, CreditCard, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Pagination } from "../../components/Pagination";
import { toast } from "sonner";

type Payer = {
  id: string;
  name: string;
  document: string;
  email: string;
  office: string;
  status: string;
  payments: number;
};

type PayerForm = {
  name: string;
  document: string;
  email: string;
};

const emptyForm: PayerForm = { name: "", document: "", email: "" };

const initialPayers: Payer[] = [
  { id: "1", name: "Carlos Andrés Torres Mejía",  document: "10.011.223", email: "carlos.torres@valledelcauca.gov.co",  office: "Oficina Central Sec. Salud VDC", status: "Activo",   payments: 24 },
  { id: "2", name: "Ana Lucía Martínez Pérez",    document: "20.022.334", email: "ana.martinez@valledelcauca.gov.co",   office: "Oficina Central Sec. Salud VDC", status: "Activo",   payments: 18 },
  { id: "3", name: "Pedro Iván Gómez Suárez",     document: "30.033.445", email: "pedro.gomez@valledelcauca.gov.co",    office: "Oficina Central Sec. Salud VDC", status: "Activo",   payments: 31 },
  { id: "4", name: "Claudia Esperanza Ruiz Vega", document: "40.044.556", email: "claudia.ruiz@valledelcauca.gov.co",   office: "Oficina Central Sec. Salud VDC", status: "Activo",   payments: 12 },
  { id: "5", name: "Jaime Alberto Soto Ríos",     document: "50.055.667", email: "jaime.soto@valledelcauca.gov.co",     office: "Oficina Central Sec. Salud VDC", status: "Inactivo", payments: 5  },
  { id: "6", name: "Luz Marina Castillo Mora",    document: "60.066.778", email: "luz.castillo@valledelcauca.gov.co",   office: "Oficina Central Sec. Salud VDC", status: "Activo",   payments: 9  },
];

const ITEMS_PER_PAGE = 8;

export function Payers() {
  const [payers, setPayers] = useState<Payer[]>(initialPayers);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Payer | null>(null);
  const [form, setForm] = useState<PayerForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewItem, setPreviewItem] = useState<Payer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Payer | null>(null);

  const filtered = useMemo(() => payers.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.document.includes(q) || p.email.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Todos" || p.status === filterStatus;
    return matchSearch && matchStatus;
  }), [payers, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openCreate = () => {
    setEditItem(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item: Payer) => {
    setEditItem(item);
    setForm({ name: item.name, document: item.document, email: item.email });
    setShowModal(true);
    setPreviewItem(null);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.document.trim() || !form.email.trim()) {
      toast.error("Completa todos los campos requeridos"); return;
    }
    if (editItem) {
      setPayers(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form } : p));
      toast.success("Pagador actualizado correctamente");
    } else {
      setPayers(prev => [...prev, { id: String(Date.now()), ...form, office: "Oficina Central Sec. Salud VDC", status: "Activo", payments: 0 }]);
      toast.success("Pagador creado exitosamente");
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditItem(null);
  };

  const handleDeleteConfirmed = (item: Payer) => {
    const copy = { ...item };
    setPayers(prev => prev.filter(p => p.id !== item.id));
    setDeleteConfirm(null);
    toast(`Pagador ${item.name} eliminado`, {
      description: "Tienes 5 segundos para deshacer esta acción.",
      action: {
        label: "Deshacer",
        onClick: () => {
          setPayers(prev => [...prev, copy].sort((a, b) => Number(a.id) - Number(b.id)));
          toast.success("Eliminación revertida correctamente.");
        },
      },
      duration: 5000,
    });
  };

  const f = (field: keyof PayerForm, val: string) => setForm(prev => ({ ...prev, [field]: val }));

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pagadores</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de pagadores de la oficina</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#1C5BB8] text-white px-4 py-2 rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium shadow-sm">
          <Plus size={16} /> Nuevo Pagador
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Buscar por nombre, cédula o correo..." className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
            {search && <button onClick={() => { setSearch(""); setCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={12} className="text-gray-400" /></button>}
          </div>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
            <option>Todos</option><option>Activo</option><option>Inactivo</option>
          </select>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} pagadores</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Pagador", "Documento", "Correo Institucional", "Pagos", "Estado", "Acciones"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center">
                  <User size={28} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">No se encontraron pagadores</p>
                </td></tr>
              ) : paginated.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 border border-green-100">
                        <User size={13} className="text-[#34A853]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{p.name}</p>
                        <p className="text-[10px] text-gray-400">Pagador</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono text-gray-600">{p.document}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[200px] truncate">{p.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold ${p.payments > 20 ? "text-amber-600" : "text-gray-900"}`}>{p.payments}</span>
                    <span className="text-[10px] text-gray-400 ml-1">pagos</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${p.status === "Activo" ? "bg-green-50 text-[#34A853] border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === "Activo" ? "bg-[#34A853]" : "bg-gray-400"}`} />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setPreviewItem(p)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Vista previa"><Eye size={14} /></button>
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Editar"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteConfirm(p)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
      </div>

      {/* ── Preview Overlay ─────────────────────────────────────────────────── */}
      {previewItem && (() => {
        const isActive = previewItem.status === "Activo";
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-[#34A853] to-[#2d9548] px-5 py-5 text-center relative">
                <button onClick={() => setPreviewItem(null)} className="absolute right-3 top-3 p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <X size={15} className="text-white" />
                </button>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <User size={26} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-white">{previewItem.name}</h3>
                <p className="text-green-100 text-xs mt-0.5">Pagador</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${isActive ? "bg-white/90 text-[#34A853] border-green-100" : "bg-white/70 text-gray-500 border-gray-200"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#34A853]" : "bg-gray-400"}`} />
                    {previewItem.status}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Hash size={14} className="text-[#34A853] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Documento</p>
                    <p className="text-xs font-mono font-medium text-gray-900">{previewItem.document}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail size={14} className="text-[#34A853] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400">Correo institucional</p>
                    <p className="text-xs text-gray-700 truncate">{previewItem.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <CreditCard size={14} className="text-[#34A853] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Pagos procesados</p>
                    <p className="text-xs font-semibold text-gray-900">{previewItem.payments} pagos realizados</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 px-5 py-3.5 flex items-center justify-between gap-3 bg-gray-50/50">
                <button onClick={() => setPreviewItem(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors font-medium">
                  Cerrar
                </button>
                <button onClick={() => openEdit(previewItem)} className="flex items-center gap-1.5 px-4 py-2 bg-[#34A853] text-white rounded-lg text-xs font-medium hover:bg-[#2d9548] transition-colors shadow-sm">
                  <Edit2 size={12} /> Editar Pagador
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
              <h3 className="text-base font-semibold text-gray-900 mb-1">¿Eliminar pagador?</h3>
              <p className="text-sm text-gray-500 mb-1">
                Estás a punto de eliminar a <span className="font-semibold text-gray-800">{deleteConfirm.name}</span>.
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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#34A853] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={15} className="text-green-100" />
                <h2 className="text-sm font-semibold text-white">
                  {editItem ? `Editar — ${editItem.name.split(" ")[0]} ${editItem.name.split(" ")[2] ?? ""}` : "Nuevo Pagador"}
                </h2>
              </div>
              <button onClick={() => { setShowModal(false); setEditItem(null); setForm(emptyForm); }} className="p-1.5 hover:bg-white/20 rounded-lg">
                <X size={16} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {editItem && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2">
                  <AlertTriangle size={13} className="text-[#34A853] flex-shrink-0" />
                  <p className="text-xs text-[#34A853]">Editando información de <span className="font-semibold">{editItem.name}</span></p>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre Completo <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => f("name", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" placeholder="Nombre completo del pagador" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Cédula <span className="text-red-500">*</span></label>
                  <input type="text" value={form.document} onChange={e => f("document", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" placeholder="Nro. documento" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Estado</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 size={13} className="text-[#34A853]" />
                    <span className="text-xs text-[#34A853] font-medium">Activo</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Correo Institucional <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => f("email", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" placeholder="correo@valledelcauca.gov.co" />
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button onClick={() => { setShowModal(false); setEditItem(null); setForm(emptyForm); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleSave} className="px-5 py-2 bg-[#34A853] text-white rounded-lg text-sm hover:bg-[#2d9548] font-medium shadow-sm">
                {editItem ? "Guardar Cambios" : "Crear Pagador"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
