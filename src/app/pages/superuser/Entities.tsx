import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Briefcase, Search, X, ChevronDown } from "lucide-react";
import { Modal } from "../../components/Modal";
import { Pagination } from "../../components/Pagination";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { toast } from "sonner";

const DEPARTMENTS = [
  "Valle del Cauca", "Cauca", "Nariño", "Huila", "Tolima",
  "Cundinamarca", "Antioquia", "Risaralda", "Quindío", "Bolívar",
  "Atlántico", "Santander",
];

const SECTORS = [
  "Salud", "Educación", "Hacienda", "Justicia y Seguridad",
  "Infraestructura", "Ambiente y Desarrollo Sostenible",
  "Agricultura y Desarrollo Rural", "TIC y Conectividad",
  "Cultura y Patrimonio", "Deporte y Recreación",
];

type Entity = { id: string; name: string; code: string; department: string; sector: string; status: string };

const initialEntities: Entity[] = [
  { id: "1",  name: "Secretaría de Salud",                       code: "ENT-001", department: "Valle del Cauca", sector: "Salud",                         status: "Activo"   },
  { id: "2",  name: "Secretaría de Educación",                   code: "ENT-002", department: "Valle del Cauca", sector: "Educación",                     status: "Activo"   },
  { id: "3",  name: "Secretaría de Hacienda",                    code: "ENT-003", department: "Valle del Cauca", sector: "Hacienda",                      status: "Activo"   },
  { id: "4",  name: "Secretaría de Justicia y Seguridad",        code: "ENT-004", department: "Valle del Cauca", sector: "Justicia y Seguridad",          status: "Activo"   },
  { id: "5",  name: "Secretaría de Infraestructura",             code: "ENT-005", department: "Valle del Cauca", sector: "Infraestructura",               status: "Activo"   },
  { id: "6",  name: "Secretaría de Salud del Cauca",             code: "ENT-006", department: "Cauca",           sector: "Salud",                         status: "Activo"   },
  { id: "7",  name: "Secretaría de Educación del Cauca",         code: "ENT-007", department: "Cauca",           sector: "Educación",                     status: "Activo"   },
  { id: "8",  name: "Secretaría de Hacienda del Cauca",          code: "ENT-008", department: "Cauca",           sector: "Hacienda",                      status: "Inactivo" },
  { id: "9",  name: "Secretaría de Salud de Nariño",             code: "ENT-009", department: "Nariño",          sector: "Salud",                         status: "Activo"   },
  { id: "10", name: "Secretaría de Educación de Nariño",         code: "ENT-010", department: "Nariño",          sector: "Educación",                     status: "Activo"   },
  { id: "11", name: "Secretaría de Hacienda de Nariño",          code: "ENT-011", department: "Nariño",          sector: "Hacienda",                      status: "Activo"   },
  { id: "12", name: "Secretaría de Salud del Huila",             code: "ENT-012", department: "Huila",           sector: "Salud",                         status: "Activo"   },
  { id: "13", name: "Secretaría de Educación de Antioquia",      code: "ENT-013", department: "Antioquia",       sector: "Educación",                     status: "Activo"   },
  { id: "14", name: "Secretaría de Hacienda de Cundinamarca",    code: "ENT-014", department: "Cundinamarca",    sector: "Hacienda",                      status: "Activo"   },
  { id: "15", name: "Secretaría de Infraestructura de Antioquia", code: "ENT-015", department: "Antioquia",      sector: "Infraestructura",               status: "Inactivo" },
  { id: "16", name: "Secretaría de Ambiente del Valle del Cauca", code: "ENT-016", department: "Valle del Cauca", sector: "Ambiente y Desarrollo Sostenible", status: "Activo" },
  { id: "17", name: "Secretaría de Cultura del Valle del Cauca", code: "ENT-017", department: "Valle del Cauca", sector: "Cultura y Patrimonio",         status: "Activo"   },
  { id: "18", name: "Secretaría de Deporte de Antioquia",        code: "ENT-018", department: "Antioquia",       sector: "Deporte y Recreación",          status: "Activo"   },
];

const ITEMS_PER_PAGE = 8;
const emptyForm = { name: "", code: "", department: "", sector: "", status: "Activo" };

function showUndoToast(message: string, onUndo: () => void) {
  toast.custom(
    (t) => (
      <div className="flex items-center gap-3 bg-gray-900 text-white rounded-xl px-4 py-2.5 shadow-xl min-w-[300px]">
        <span className="text-xs flex-1">{message}</span>
        <button onClick={() => { onUndo(); toast.dismiss(t); }}
          className="text-[#FBBC05] text-xs font-bold hover:text-yellow-300 transition-colors whitespace-nowrap">
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

export function Entities() {
  const [entities, setEntities] = useState(initialEntities);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Todos" | "Activo" | "Inactivo">("Todos");
  const [deptFilter, setDeptFilter] = useState("Todos");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeptMenu, setShowDeptMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(emptyForm);

  const [editItem, setEditItem] = useState<Entity | null>(null);
  const [editData, setEditData] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Entity | null>(null);

  const filtered = useMemo(() =>
    entities.filter(e => {
      const q = search.toLowerCase();
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q);
      const matchStatus = statusFilter === "Todos" || e.status === statusFilter;
      const matchDept = deptFilter === "Todos" || e.department === deptFilter;
      return matchSearch && matchStatus && matchDept;
    }), [entities, search, statusFilter, deptFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const reset = () => setCurrentPage(1);

  const handleCreate = () => {
    if (!formData.name || !formData.code || !formData.department || !formData.sector) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    setEntities(prev => [...prev, { id: String(Date.now()), ...formData }]);
    toast.success("Entidad creada exitosamente");
    setShowModal(false);
    setFormData(emptyForm);
  };

  const handleEditOpen = (item: Entity) => {
    setEditItem(item);
    setEditData({ name: item.name, code: item.code, department: item.department, sector: item.sector, status: item.status });
  };

  const handleEditSave = () => {
    if (!editData.name || !editData.code || !editData.department || !editData.sector) {
      toast.error("Completa todos los campos obligatorios"); return;
    }
    setEntities(prev => prev.map(e => e.id === editItem!.id ? { ...e, ...editData } : e));
    toast.success("Entidad actualizada exitosamente");
    setEditItem(null);
  };

  const handleDeleteRequest = (item: Entity) => setDeleteConfirm(item);

  const handleDeleteConfirmed = () => {
    const item = deleteConfirm!;
    const originalIndex = entities.findIndex(e => e.id === item.id);
    setEntities(prev => prev.filter(e => e.id !== item.id));
    setDeleteConfirm(null);
    showUndoToast(`Entidad "${item.name}" eliminada`, () => {
      setEntities(prev => {
        const arr = [...prev];
        arr.splice(Math.min(originalIndex, arr.length), 0, item);
        return arr;
      });
    });
  };

  const renderFormFields = (data: typeof emptyForm, setData: (d: typeof emptyForm) => void) => (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre de la Entidad <span className="text-red-500">*</span></label>
        <input type="text" value={data.name} onChange={e => setData({ ...data, name: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
          placeholder="Ej: Secretaría de Salud" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Código <span className="text-red-500">*</span></label>
          <input type="text" value={data.code} onChange={e => setData({ ...data, code: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
            placeholder="ENT-XXX" maxLength={7} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Estado</label>
          <select value={data.status} onChange={e => setData({ ...data, status: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
            <option>Activo</option><option>Inactivo</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Departamento <span className="text-red-500">*</span></label>
        <select value={data.department} onChange={e => setData({ ...data, department: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
          <option value="">Seleccionar departamento...</option>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Sector <span className="text-red-500">*</span></label>
        <select value={data.sector} onChange={e => setData({ ...data, sector: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
          <option value="">Seleccionar sector...</option>
          {SECTORS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
    </>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Entidades</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de entidades gubernamentales del sistema</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1C5BB8] text-white px-4 py-2 rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium shadow-sm">
          <Plus size={16} /> Nueva Entidad
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); reset(); }}
              placeholder="Buscar por nombre o código..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
            {search && (
              <button onClick={() => { setSearch(""); reset(); }} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X size={12} className="text-gray-400" />
              </button>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { setShowStatusMenu(!showStatusMenu); setShowDeptMenu(false); }}
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
                    <button key={opt} onClick={() => { setStatusFilter(opt); reset(); setShowStatusMenu(false); }}
                      className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${statusFilter === opt ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { setShowDeptMenu(!showDeptMenu); setShowStatusMenu(false); }}
              className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-lg transition-colors ${
                deptFilter !== "Todos" ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}>
              <span>{deptFilter === "Todos" ? "Departamento" : deptFilter.split(" ").slice(0, 2).join(" ")}</span>
              <ChevronDown size={12} />
            </button>
            {showDeptMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDeptMenu(false)} />
                <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 max-h-52 overflow-y-auto">
                  <button onClick={() => { setDeptFilter("Todos"); reset(); setShowDeptMenu(false); }}
                    className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${deptFilter === "Todos" ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}>
                    Todos los departamentos
                  </button>
                  {DEPARTMENTS.map(d => (
                    <button key={d} onClick={() => { setDeptFilter(d); reset(); setShowDeptMenu(false); }}
                      className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${deptFilter === d ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className="text-xs text-gray-400 ml-auto">{filtered.length} entidades</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Entidad", "Código", "Departamento", "Sector", "Estado", "Acciones"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No se encontraron entidades</td></tr>
              ) : paginated.map(entity => (
                <tr key={entity.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase size={13} className="text-[#34A853]" />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{entity.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">{entity.code}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-600">{entity.department}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-100">{entity.sector}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${
                      entity.status === "Activo" ? "bg-green-50 text-[#34A853] border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}>{entity.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleEditOpen(entity)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Editar"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteRequest(entity)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva Entidad" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-emerald-50 rounded-lg">
            <Briefcase className="text-[#34A853]" size={20} />
            <p className="text-xs text-gray-700">Complete los datos de la nueva entidad gubernamental</p>
          </div>
          {renderFormFields(formData, setFormData)}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleCreate} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Crear Entidad</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Editar Entidad" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-emerald-50 rounded-lg">
            <Briefcase className="text-[#34A853]" size={20} />
            <p className="text-xs text-gray-700">Modifica la información de la entidad</p>
          </div>
          {renderFormFields(editData, setEditData)}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => setEditItem(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleEditSave} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Guardar Cambios</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="¿Eliminar entidad?"
        message={`¿Estás seguro de eliminar "${deleteConfirm?.name}"? Tendrás 5 segundos para deshacer esta acción.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
