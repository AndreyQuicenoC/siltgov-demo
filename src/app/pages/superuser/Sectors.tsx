import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Layers, Search, X, ChevronDown } from "lucide-react";
import { Modal } from "../../components/Modal";
import { Pagination } from "../../components/Pagination";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { toast } from "sonner";

type Sector = { id: string; name: string; description: string; status: string; entities: number };

const initialSectors: Sector[] = [
  { id: "1",  name: "Salud",                           description: "Entidades del sector salud pública y servicios médicos",               status: "Activo",   entities: 5  },
  { id: "2",  name: "Educación",                       description: "Entidades vinculadas a la gestión educativa y formación",               status: "Activo",   entities: 7  },
  { id: "3",  name: "Hacienda",                        description: "Gestión fiscal, presupuestal y tributaria del Estado",                  status: "Activo",   entities: 6  },
  { id: "4",  name: "Justicia y Seguridad",             description: "Entidades de justicia, convivencia y seguridad ciudadana",             status: "Activo",   entities: 4  },
  { id: "5",  name: "Infraestructura",                 description: "Obras públicas, vías, transporte e infraestructura física",             status: "Activo",   entities: 3  },
  { id: "6",  name: "Ambiente y Desarrollo Sostenible", description: "Gestión ambiental, recursos naturales y desarrollo sostenible",      status: "Activo",   entities: 2  },
  { id: "7",  name: "Agricultura y Desarrollo Rural",  description: "Fomento agropecuario, cadenas productivas y desarrollo rural",          status: "Activo",   entities: 3  },
  { id: "8",  name: "TIC y Conectividad",              description: "Tecnologías de la información, gobierno digital y conectividad",        status: "Inactivo", entities: 1  },
  { id: "9",  name: "Cultura y Patrimonio",            description: "Fomento cultural, patrimonio histórico y expresiones artísticas",       status: "Activo",   entities: 2  },
  { id: "10", name: "Deporte y Recreación",            description: "Actividad física, deporte de alto rendimiento y recreación",            status: "Activo",   entities: 2  },
];

const ITEMS_PER_PAGE = 8;

function showUndoToast(message: string, onUndo: () => void) {
  toast.custom(
    (t) => (
      <div className="flex items-center gap-3 bg-gray-900 text-white rounded-xl px-4 py-2.5 shadow-xl min-w-[300px]">
        <span className="text-xs flex-1">{message}</span>
        <button
          onClick={() => { onUndo(); toast.dismiss(t); }}
          className="text-[#FBBC05] text-xs font-bold hover:text-yellow-300 transition-colors whitespace-nowrap"
        >
          Deshacer
        </button>
        <button onClick={() => toast.dismiss(t)} className="text-gray-400 hover:text-white ml-1 transition-colors">
          <X size={12} />
        </button>
      </div>
    ),
    { duration: 5000 }
  );
}

export function Sectors() {
  const [sectors, setSectors] = useState(initialSectors);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Todos" | "Activo" | "Inactivo">("Todos");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({ name: "", description: "", status: "Activo" });

  const [editItem, setEditItem] = useState<Sector | null>(null);
  const [editData, setEditData] = useState({ name: "", description: "", status: "Activo" });
  const [deleteConfirm, setDeleteConfirm] = useState<Sector | null>(null);

  const filtered = useMemo(() =>
    sectors.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      const matchStatus = statusFilter === "Todos" || s.status === statusFilter;
      return matchSearch && matchStatus;
    }), [sectors, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCreate = () => {
    if (!formData.name || !formData.description) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    setSectors(prev => [...prev, { id: String(Date.now()), ...formData, entities: 0 }]);
    toast.success("Sector creado exitosamente");
    setShowModal(false);
    setFormData({ name: "", description: "", status: "Activo" });
  };

  const handleEditOpen = (item: Sector) => {
    setEditItem(item);
    setEditData({ name: item.name, description: item.description, status: item.status });
  };

  const handleEditSave = () => {
    if (!editData.name || !editData.description) { toast.error("Completa todos los campos obligatorios"); return; }
    setSectors(prev => prev.map(s => s.id === editItem!.id ? { ...s, ...editData } : s));
    toast.success("Sector actualizado exitosamente");
    setEditItem(null);
  };

  const handleDeleteRequest = (item: Sector) => setDeleteConfirm(item);

  const handleDeleteConfirmed = () => {
    const item = deleteConfirm!;
    const originalIndex = sectors.findIndex(s => s.id === item.id);
    setSectors(prev => prev.filter(s => s.id !== item.id));
    setDeleteConfirm(null);
    showUndoToast(`Sector "${item.name}" eliminado`, () => {
      setSectors(prev => {
        const arr = [...prev];
        arr.splice(Math.min(originalIndex, arr.length), 0, item);
        return arr;
      });
    });
  };

  const handleStatusFilter = (val: "Todos" | "Activo" | "Inactivo") => {
    setStatusFilter(val);
    setCurrentPage(1);
    setShowStatusMenu(false);
  };

  const formFields = (data: typeof formData, setData: (d: typeof formData) => void) => (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre del Sector <span className="text-red-500">*</span></label>
        <input type="text" value={data.name} onChange={e => setData({ ...data, name: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
          placeholder="Ej: Salud, Educación, Hacienda..." />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Descripción <span className="text-red-500">*</span></label>
        <textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] resize-none"
          rows={3} placeholder="Describe el alcance del sector..." />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Estado</label>
        <select value={data.status} onChange={e => setData({ ...data, status: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
          <option>Activo</option><option>Inactivo</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sectores</h1>
          <p className="text-sm text-gray-500 mt-0.5">Clasificación sectorial de entidades gubernamentales</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1C5BB8] text-white px-4 py-2 rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium shadow-sm">
          <Plus size={16} /> Nuevo Sector
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por nombre o descripción..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
            {search && (
              <button onClick={() => { setSearch(""); setCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X size={12} className="text-gray-400" />
              </button>
            )}
          </div>
          <div className="relative">
            <button onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-lg transition-colors ${
                statusFilter !== "Todos" ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}>
              <span>Estado: {statusFilter}</span><ChevronDown size={12} />
            </button>
            {showStatusMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(false)} />
                <div className="absolute left-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  {(["Todos", "Activo", "Inactivo"] as const).map(opt => (
                    <button key={opt} onClick={() => handleStatusFilter(opt)}
                      className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${statusFilter === opt ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} sectores</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Sector", "Descripción", "Entidades", "Estado", "Acciones"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">No se encontraron sectores</td></tr>
              ) : paginated.map(sector => (
                <tr key={sector.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Layers size={13} className="text-indigo-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{sector.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[320px]">
                    <span className="line-clamp-2">{sector.description}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-medium text-gray-900">{sector.entities}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${
                      sector.status === "Activo" ? "bg-green-50 text-[#34A853] border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}>{sector.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleEditOpen(sector)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Editar"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteRequest(sector)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
      </div>

      {/* Modal: Nuevo */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Sector" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-indigo-50 rounded-lg">
            <Layers className="text-indigo-600" size={20} />
            <p className="text-xs text-gray-700">Los sectores clasifican las entidades gubernamentales por área de gestión</p>
          </div>
          {formFields(formData, setFormData)}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleCreate} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Crear Sector</button>
          </div>
        </div>
      </Modal>

      {/* Modal: Editar */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Editar Sector" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-indigo-50 rounded-lg">
            <Layers className="text-indigo-600" size={20} />
            <p className="text-xs text-gray-700">Modifica la información del sector</p>
          </div>
          {formFields(editData, setEditData)}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => setEditItem(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleEditSave} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Guardar Cambios</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="¿Eliminar sector?"
        message={`¿Estás seguro de eliminar "${deleteConfirm?.name}"? Tendrás 5 segundos para deshacer esta acción.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
