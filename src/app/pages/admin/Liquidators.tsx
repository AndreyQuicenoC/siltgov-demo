import { useState, useMemo } from "react";
import { Plus, Search, Edit2, Trash2, Eye, X, User, Mail, Hash, Briefcase, ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Pagination } from "../../components/Pagination";
import { toast } from "sonner";

type Liquidator = {
  id: string;
  name: string;
  document: string;
  email: string;
  office: string;
  status: string;
  cases: number;
};

type LiquidatorForm = {
  name: string;
  document: string;
  email: string;
};

const emptyForm: LiquidatorForm = { name: "", document: "", email: "" };

const initialLiquidators: Liquidator[] = [
  { id: "1",  name: "María Elena García Ruiz",     document: "12.345.678", email: "maria.garcia@valledelcauca.gov.co",    office: "Oficina Central Sec. Salud VDC", status: "Activo",   cases: 12 },
  { id: "2",  name: "Carlos Hernán Sánchez Mejía",  document: "98.765.432", email: "carlos.sanchez@valledelcauca.gov.co",  office: "Oficina Central Sec. Salud VDC", status: "Activo",   cases: 8  },
  { id: "3",  name: "Laura Sofía Díaz Pinto",        document: "55.512.345", email: "laura.diaz@valledelcauca.gov.co",      office: "Oficina Central Sec. Salud VDC", status: "Activo",   cases: 15 },
  { id: "4",  name: "Pedro Antonio Jiménez Torres",  document: "11.122.334", email: "pedro.jimenez@valledelcauca.gov.co",   office: "Oficina Central Sec. Salud VDC", status: "Activo",   cases: 6  },
  { id: "5",  name: "Claudia Patricia Morales Vega", document: "44.455.667", email: "claudia.morales@valledelcauca.gov.co", office: "Oficina Central Sec. Salud VDC", status: "Activo",   cases: 10 },
  { id: "6",  name: "Andrés Felipe Vargas León",     document: "77.788.990", email: "andres.vargas@valledelcauca.gov.co",   office: "Oficina Central Sec. Salud VDC", status: "Inactivo", cases: 3  },
  { id: "7",  name: "Daniela Marcela Ríos Cano",    document: "33.344.556", email: "daniela.rios@valledelcauca.gov.co",    office: "Oficina Central Sec. Salud VDC", status: "Activo",   cases: 9  },
  { id: "8",  name: "Mauricio Alberto López Parra",  document: "66.677.889", email: "mauricio.lopez@valledelcauca.gov.co",  office: "Oficina Central Sec. Salud VDC", status: "Activo",   cases: 7  },
  { id: "9",  name: "Sandra Milena Ospina Castro",   document: "22.233.445", email: "sandra.ospina@valledelcauca.gov.co",   office: "Oficina Central Sec. Salud VDC", status: "Activo",   cases: 11 },
  { id: "10", name: "Germán Darío Peña Quintero",    document: "88.899.001", email: "german.pena@valledelcauca.gov.co",     office: "Oficina Central Sec. Salud VDC", status: "Activo",   cases: 5  },
  { id: "11", name: "Isabel Cristina Herrera Díaz",  document: "11.200.334", email: "isabel.herrera@valledelcauca.gov.co",  office: "Oficina Central Sec. Salud VDC", status: "Inactivo", cases: 0  },
  { id: "12", name: "Roberto Carlos Muñoz Salazar",  document: "66.543.210", email: "roberto.munoz@valledelcauca.gov.co",   office: "Oficina Central Sec. Salud VDC", status: "Activo",   cases: 4  },
];

const ITEMS_PER_PAGE = 8;

export function Liquidators() {
  const [liquidators, setLiquidators] = useState<Liquidator[]>(initialLiquidators);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Liquidator | null>(null);
  const [form, setForm] = useState<LiquidatorForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewItem, setPreviewItem] = useState<Liquidator | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Liquidator | null>(null);

  const filtered = useMemo(() => liquidators.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.document.includes(q) || l.email.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Todos" || l.status === filterStatus;
    return matchSearch && matchStatus;
  }), [liquidators, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openCreate = () => {
    setEditItem(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item: Liquidator) => {
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
      setLiquidators(prev => prev.map(l => l.id === editItem.id ? { ...l, ...form } : l));
      toast.success("Liquidador actualizado correctamente");
    } else {
      setLiquidators(prev => [...prev, { id: String(Date.now()), ...form, office: "Oficina Central Sec. Salud VDC", status: "Activo", cases: 0 }]);
      toast.success("Liquidador creado exitosamente");
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditItem(null);
  };

  const handleDeleteConfirmed = (item: Liquidator) => {
    const copy = { ...item };
    setLiquidators(prev => prev.filter(l => l.id !== item.id));
    setDeleteConfirm(null);
    toast(`Liquidador ${item.name} eliminado`, {
      description: "Tienes 5 segundos para deshacer esta acción.",
      action: {
        label: "Deshacer",
        onClick: () => {
          setLiquidators(prev => [...prev, copy].sort((a, b) => Number(a.id) - Number(b.id)));
          toast.success("Eliminación revertida correctamente.");
        },
      },
      duration: 5000,
    });
  };

  const f = (field: keyof LiquidatorForm, val: string) => setForm(prev => ({ ...prev, [field]: val }));

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Liquidadores</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de liquidadores de la oficina</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#1C5BB8] text-white px-4 py-2 rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium shadow-sm">
          <Plus size={16} /> Nuevo Liquidador
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
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} liquidadores</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Liquidador", "Documento", "Correo Institucional", "Casos", "Estado", "Acciones"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center">
                  <User size={28} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">No se encontraron liquidadores</p>
                </td></tr>
              ) : paginated.map(l => (
                <tr key={l.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-100">
                        <User size={13} className="text-[#1C5BB8]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{l.name}</p>
                        <p className="text-[10px] text-gray-400">Liquidador</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono text-gray-600">{l.document}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[200px] truncate">{l.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold ${l.cases > 10 ? "text-amber-600" : "text-gray-900"}`}>{l.cases}</span>
                    <span className="text-[10px] text-gray-400 ml-1">casos</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${l.status === "Activo" ? "bg-green-50 text-[#34A853] border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${l.status === "Activo" ? "bg-[#34A853]" : "bg-gray-400"}`} />
                      {l.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setPreviewItem(l)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Vista previa"><Eye size={14} /></button>
                      <button onClick={() => openEdit(l)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Editar"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteConfirm(l)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 size={14} /></button>
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
              <div className="bg-gradient-to-r from-[#1C5BB8] to-[#2B6FCC] px-5 py-5 text-center relative">
                <button onClick={() => setPreviewItem(null)} className="absolute right-3 top-3 p-1 hover:bg-white/20 rounded-lg transition-colors">
                  <X size={15} className="text-white" />
                </button>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <User size={26} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-white">{previewItem.name}</h3>
                <p className="text-blue-200 text-xs mt-0.5">Liquidador</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${isActive ? "bg-green-50 text-[#34A853] border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#34A853]" : "bg-gray-400"}`} />
                    {previewItem.status}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Hash size={14} className="text-[#1C5BB8] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Documento</p>
                    <p className="text-xs font-mono font-medium text-gray-900">{previewItem.document}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail size={14} className="text-[#1C5BB8] flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400">Correo institucional</p>
                    <p className="text-xs text-gray-700 truncate">{previewItem.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Briefcase size={14} className="text-[#1C5BB8] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400">Casos activos</p>
                    <p className="text-xs font-semibold text-gray-900">{previewItem.cases} casos asignados</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 px-5 py-3.5 flex items-center justify-between gap-3 bg-gray-50/50">
                <button onClick={() => setPreviewItem(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors font-medium">
                  Cerrar
                </button>
                <button onClick={() => openEdit(previewItem)} className="flex items-center gap-1.5 px-4 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs font-medium hover:bg-[#1850A0] transition-colors shadow-sm">
                  <Edit2 size={12} /> Editar Liquidador
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
              <h3 className="text-base font-semibold text-gray-900 mb-1">¿Eliminar liquidador?</h3>
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
            <div className="bg-[#1C5BB8] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={15} className="text-blue-200" />
                <h2 className="text-sm font-semibold text-white">
                  {editItem ? `Editar — ${editItem.name.split(" ")[0]} ${editItem.name.split(" ")[2] ?? ""}` : "Nuevo Liquidador"}
                </h2>
              </div>
              <button onClick={() => { setShowModal(false); setEditItem(null); setForm(emptyForm); }} className="p-1.5 hover:bg-white/20 rounded-lg">
                <X size={16} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {editItem && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
                  <AlertTriangle size={13} className="text-[#1C5BB8] flex-shrink-0" />
                  <p className="text-xs text-[#1C5BB8]">Editando información de <span className="font-semibold">{editItem.name}</span></p>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre Completo <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => f("name", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" placeholder="Nombre completo del liquidador" />
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
              <button onClick={handleSave} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium shadow-sm">
                {editItem ? "Guardar Cambios" : "Crear Liquidador"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
