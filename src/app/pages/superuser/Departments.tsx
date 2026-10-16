import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Building2, Search, X, ChevronDown } from "lucide-react";
import { Modal } from "../../components/Modal";
import { Pagination } from "../../components/Pagination";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { toast } from "sonner";

type Dept = { id: string; name: string; status: string; entities: number };

const initialDepts: Dept[] = [
  { id: "1",  name: "Valle del Cauca", status: "Activo",   entities: 23 },
  { id: "2",  name: "Cauca",           status: "Activo",   entities: 18 },
  { id: "3",  name: "Nariño",          status: "Activo",   entities: 15 },
  { id: "4",  name: "Huila",           status: "Activo",   entities: 12 },
  { id: "5",  name: "Tolima",          status: "Activo",   entities: 19 },
  { id: "6",  name: "Cundinamarca",    status: "Activo",   entities: 34 },
  { id: "7",  name: "Antioquia",       status: "Activo",   entities: 41 },
  { id: "8",  name: "Risaralda",       status: "Inactivo", entities: 9  },
  { id: "9",  name: "Quindío",         status: "Activo",   entities: 7  },
  { id: "10", name: "Bolívar",         status: "Activo",   entities: 22 },
  { id: "11", name: "Atlántico",       status: "Activo",   entities: 17 },
  { id: "12", name: "Santander",       status: "Inactivo", entities: 14 },
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

export function Departments() {
  const [departments, setDepartments] = useState(initialDepts);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Todos" | "Activo" | "Inactivo">("Todos");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({ name: "", status: "Activo" });

  // Edit state
  const [editItem, setEditItem] = useState<Dept | null>(null);
  const [editData, setEditData] = useState({ name: "", status: "Activo" });

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<Dept | null>(null);

  const filtered = useMemo(() =>
    departments.filter(d => {
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || d.status === statusFilter;
      return matchSearch && matchStatus;
    }), [departments, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCreate = () => {
    if (!formData.name) {
      toast.error("El nombre del departamento es obligatorio");
      return;
    }
    setDepartments(prev => [...prev, { id: String(Date.now()), ...formData, entities: 0 }]);
    toast.success("Departamento creado exitosamente");
    setShowModal(false);
    setFormData({ name: "", status: "Activo" });
  };

  const handleEditOpen = (item: Dept) => {
    setEditItem(item);
    setEditData({ name: item.name, status: item.status });
  };

  const handleEditSave = () => {
    if (!editData.name) { toast.error("El nombre es obligatorio"); return; }
    setDepartments(prev => prev.map(d => d.id === editItem!.id ? { ...d, ...editData } : d));
    toast.success("Departamento actualizado exitosamente");
    setEditItem(null);
  };

  const handleDeleteRequest = (item: Dept) => {
    setDeleteConfirm(item);
  };

  const handleDeleteConfirmed = () => {
    const item = deleteConfirm!;
    const originalIndex = departments.findIndex(d => d.id === item.id);
    setDepartments(prev => prev.filter(d => d.id !== item.id));
    setDeleteConfirm(null);
    showUndoToast(`Departamento "${item.name}" eliminado`, () => {
      setDepartments(prev => {
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

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Departamentos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de departamentos del sistema</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1C5BB8] text-white px-4 py-2 rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} /> Nuevo Departamento
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por nombre..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
            />
            {search && (
              <button onClick={() => { setSearch(""); setCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X size={12} className="text-gray-400" />
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-lg transition-colors ${
                statusFilter !== "Todos"
                  ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>Estado: {statusFilter}</span>
              <ChevronDown size={12} />
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

          <span className="text-xs text-gray-400 ml-auto">{filtered.length} departamentos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Nombre", "Entidades", "Estado", "Acciones"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">No se encontraron departamentos</td></tr>
              ) : paginated.map(dept => (
                <tr key={dept.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 size={13} className="text-[#1C5BB8]" />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{dept.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-medium text-gray-900">{dept.entities}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${
                      dept.status === "Activo"
                        ? "bg-green-50 text-[#34A853] border-green-200"
                        : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}>
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditOpen(dept)}
                        className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(dept)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Departamento" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-blue-50 rounded-lg">
            <Building2 className="text-[#1C5BB8]" size={20} />
            <p className="text-xs text-gray-700">Complete la información del nuevo departamento</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre del Departamento <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
              placeholder="Ej: Valle del Cauca"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Estado</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white"
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleCreate} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Crear Departamento</button>
          </div>
        </div>
      </Modal>

      {/* Modal: Editar */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Editar Departamento" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-blue-50 rounded-lg">
            <Building2 className="text-[#1C5BB8]" size={20} />
            <p className="text-xs text-gray-700">Modifica la información del departamento</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre del Departamento <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={editData.name}
              onChange={e => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
              placeholder="Ej: Valle del Cauca"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Estado</label>
            <select
              value={editData.status}
              onChange={e => setEditData({ ...editData, status: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white"
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => setEditItem(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleEditSave} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Guardar Cambios</button>
          </div>
        </div>
      </Modal>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="¿Eliminar departamento?"
        message={`¿Estás seguro de eliminar "${deleteConfirm?.name}"? Tendrás 5 segundos para deshacer esta acción.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
