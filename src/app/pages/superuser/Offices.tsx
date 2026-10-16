import { useState, useMemo } from "react";
import {
  Plus, Edit2, Trash2, MapPin, Search, X, ChevronDown,
  Eye, Building2, Briefcase,
} from "lucide-react";
import { Modal } from "../../components/Modal";
import { Pagination } from "../../components/Pagination";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { InfoTooltip } from "../../components/InfoTooltip";
import { toast } from "sonner";

// ─── Entity → Department mapping ──────────────────────────────────────────────
const ENTITY_DEPT_MAP: Record<string, string> = {
  "Secretaría de Salud (Valle del Cauca)":                "Valle del Cauca",
  "Secretaría de Educación (Valle del Cauca)":            "Valle del Cauca",
  "Secretaría de Hacienda (Valle del Cauca)":             "Valle del Cauca",
  "Secretaría de Justicia y Seguridad (Valle del Cauca)": "Valle del Cauca",
  "Secretaría de Infraestructura (Valle del Cauca)":      "Valle del Cauca",
  "Secretaría de Salud del Cauca":                        "Cauca",
  "Secretaría de Educación del Cauca":                    "Cauca",
  "Secretaría de Hacienda de Nariño":                     "Nariño",
  "Secretaría de Salud de Nariño":                        "Nariño",
};

// Ordered entity list for the form selector
const ENTITIES = Object.keys(ENTITY_DEPT_MAP);

// Unique departments for the filter
const DEPARTMENTS = [...new Set(Object.values(ENTITY_DEPT_MAP))];

type Office = { id: string; name: string; code: string; entity: string; department: string; status: string };

const initialOffices: Office[] = [
  { id: "1",  name: "Oficina Central Sec. Salud VDC",           code: "OFI-001", entity: "Secretaría de Salud (Valle del Cauca)",                status: "Activo",   department: "Valle del Cauca" },
  { id: "2",  name: "Oficina Norte Sec. Salud VDC",             code: "OFI-002", entity: "Secretaría de Salud (Valle del Cauca)",                status: "Activo",   department: "Valle del Cauca" },
  { id: "3",  name: "Oficina Sur Sec. Salud VDC",               code: "OFI-003", entity: "Secretaría de Salud (Valle del Cauca)",                status: "Activo",   department: "Valle del Cauca" },
  { id: "4",  name: "Oficina Central Sec. Educación VDC",       code: "OFI-004", entity: "Secretaría de Educación (Valle del Cauca)",            status: "Activo",   department: "Valle del Cauca" },
  { id: "5",  name: "Oficina Norte Sec. Educación VDC",         code: "OFI-005", entity: "Secretaría de Educación (Valle del Cauca)",            status: "Activo",   department: "Valle del Cauca" },
  { id: "6",  name: "Oficina Central Sec. Hacienda VDC",        code: "OFI-006", entity: "Secretaría de Hacienda (Valle del Cauca)",             status: "Activo",   department: "Valle del Cauca" },
  { id: "7",  name: "Oficina Pagaduría Sec. Hacienda VDC",      code: "OFI-007", entity: "Secretaría de Hacienda (Valle del Cauca)",             status: "Activo",   department: "Valle del Cauca" },
  { id: "8",  name: "Oficina Jurídica Sec. Justicia VDC",       code: "OFI-008", entity: "Secretaría de Justicia y Seguridad (Valle del Cauca)", status: "Activo",   department: "Valle del Cauca" },
  { id: "9",  name: "Oficina Central Sec. Salud Cauca",         code: "OFI-009", entity: "Secretaría de Salud del Cauca",                        status: "Activo",   department: "Cauca" },
  { id: "10", name: "Oficina Central Sec. Educación Cauca",     code: "OFI-010", entity: "Secretaría de Educación del Cauca",                    status: "Inactivo", department: "Cauca" },
  { id: "11", name: "Oficina Central Sec. Hacienda Nariño",     code: "OFI-011", entity: "Secretaría de Hacienda de Nariño",                     status: "Activo",   department: "Nariño" },
  { id: "12", name: "Oficina Norte Sec. Salud Nariño",          code: "OFI-012", entity: "Secretaría de Salud de Nariño",                        status: "Activo",   department: "Nariño" },
];

const ITEMS_PER_PAGE = 8;
const emptyForm = { name: "", code: "", entity: "", department: "", status: "Activo" };

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

export function Offices() {
  const [offices, setOffices] = useState(initialOffices);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Todos" | "Activo" | "Inactivo">("Todos");
  const [deptFilter, setDeptFilter] = useState("Todos");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeptMenu, setShowDeptMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(emptyForm);

  const [editItem, setEditItem] = useState<Office | null>(null);
  const [editData, setEditData] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Office | null>(null);
  const [previewOffice, setPreviewOffice] = useState<Office | null>(null);

  const filtered = useMemo(() =>
    offices.filter(o => {
      const q = search.toLowerCase();
      const matchSearch = !q || o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q) || o.entity.toLowerCase().includes(q);
      const matchStatus = statusFilter === "Todos" || o.status === statusFilter;
      const matchDept = deptFilter === "Todos" || o.department === deptFilter;
      return matchSearch && matchStatus && matchDept;
    }), [offices, search, statusFilter, deptFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const reset = () => setCurrentPage(1);

  // Auto-fill department when entity is selected
  const handleFormEntityChange = (entity: string, data: typeof emptyForm, setData: (d: typeof emptyForm) => void) => {
    const dept = ENTITY_DEPT_MAP[entity] ?? "";
    setData({ ...data, entity, department: dept });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.code || !formData.entity) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    setOffices(prev => [...prev, { id: String(Date.now()), ...formData }]);
    toast.success("Oficina creada exitosamente");
    setShowModal(false);
    setFormData(emptyForm);
  };

  const handleEditOpen = (item: Office) => {
    setEditItem(item);
    setEditData({ name: item.name, code: item.code, entity: item.entity, department: item.department, status: item.status });
  };

  const handleEditSave = () => {
    if (!editData.name || !editData.code || !editData.entity) {
      toast.error("Completa todos los campos obligatorios"); return;
    }
    setOffices(prev => prev.map(o => o.id === editItem!.id ? { ...o, ...editData } : o));
    toast.success("Oficina actualizada exitosamente");
    setEditItem(null);
  };

  const handleDeleteRequest = (item: Office) => setDeleteConfirm(item);

  const handleDeleteConfirmed = () => {
    const item = deleteConfirm!;
    const originalIndex = offices.findIndex(o => o.id === item.id);
    setOffices(prev => prev.filter(o => o.id !== item.id));
    setDeleteConfirm(null);
    showUndoToast(`Oficina "${item.name}" eliminada`, () => {
      setOffices(prev => {
        const arr = [...prev];
        arr.splice(Math.min(originalIndex, arr.length), 0, item);
        return arr;
      });
    });
  };

  const renderFormFields = (data: typeof emptyForm, setData: (d: typeof emptyForm) => void) => (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre de la Oficina <span className="text-red-500">*</span></label>
        <input type="text" value={data.name} onChange={e => setData({ ...data, name: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
          placeholder="Ej: Oficina Central Sec. Salud VDC" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Código <span className="text-red-500">*</span></label>
          <input type="text" value={data.code} onChange={e => setData({ ...data, code: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
            placeholder="OFI-XXX" maxLength={7} />
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
        <label className="block text-xs font-medium text-gray-700 mb-1.5 inline-flex items-center">
          Entidad <span className="text-red-500 mr-1">*</span>
          <InfoTooltip content="Entidad gubernamental a la que pertenece esta oficina. Al seleccionarla, el departamento se asigna automáticamente según la jerarquía del sistema." />
        </label>
        <select value={data.entity} onChange={e => handleFormEntityChange(e.target.value, data, setData)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
          <option value="">Seleccionar entidad...</option>
          {ENTITIES.map(e => <option key={e}>{e}</option>)}
        </select>
      </div>
      {/* Departamento: auto-filled, read-only */}
      {data.department && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5 inline-flex items-center">
            Departamento
            <InfoTooltip content="Se asigna automáticamente a partir de la entidad seleccionada. Para cambiar el departamento, selecciona una entidad diferente." />
          </label>
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
            <Building2 size={13} className="text-[#1C5BB8] flex-shrink-0" />
            <span className="text-sm text-gray-700">{data.department}</span>
            <span className="ml-auto text-[10px] bg-blue-50 text-[#1C5BB8] border border-blue-100 px-1.5 py-0.5 rounded">Auto</span>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Oficinas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de oficinas vinculadas a entidades gubernamentales</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1C5BB8] text-white px-4 py-2 rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium shadow-sm">
          <Plus size={16} /> Nueva Oficina
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* ── Toolbar ── */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); reset(); }}
              placeholder="Buscar por nombre, código o entidad..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
            {search && (
              <button onClick={() => { setSearch(""); reset(); }} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X size={12} className="text-gray-400" />
              </button>
            )}
          </div>

          {/* Status filter */}
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

          {/* Department filter */}
          <div className="relative">
            <button onClick={() => { setShowDeptMenu(!showDeptMenu); setShowStatusMenu(false); }}
              className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-lg transition-colors ${
                deptFilter !== "Todos" ? "border-[#1C5BB8] bg-blue-50 text-[#1C5BB8]" : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}>
              <Building2 size={12} />
              <span>{deptFilter === "Todos" ? "Departamento" : deptFilter}</span>
              <ChevronDown size={12} />
            </button>
            {showDeptMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDeptMenu(false)} />
                <div className="absolute left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
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

          <span className="text-xs text-gray-400 ml-auto">{filtered.length} oficinas</span>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Oficina", "Código", "Departamento", "Entidad", "Estado", "Acciones"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No se encontraron oficinas</td></tr>
              ) : paginated.map(office => (
                <tr key={office.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin size={13} className="text-amber-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{office.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">{office.code}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={11} className="text-[#1C5BB8] flex-shrink-0" />
                      <span className="text-xs text-gray-700">{office.department}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[200px] truncate">{office.entity}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${
                      office.status === "Activo" ? "bg-green-50 text-[#34A853] border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}>{office.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setPreviewOffice(office)} className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition-colors" title="Vista previa"><Eye size={14} /></button>
                      <button onClick={() => handleEditOpen(office)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Editar"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteRequest(office)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} />
      </div>

      {/* ── Modal: Nueva Oficina ── */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva Oficina" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-amber-50 rounded-lg">
            <MapPin className="text-amber-600" size={20} />
            <p className="text-xs text-gray-700">Las oficinas deben estar vinculadas a una entidad específica. El departamento se asigna automáticamente.</p>
          </div>
          {renderFormFields(formData, setFormData)}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => { setShowModal(false); setFormData(emptyForm); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleCreate} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Crear Oficina</button>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Editar Oficina ── */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Editar Oficina" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-amber-50 rounded-lg">
            <MapPin className="text-amber-600" size={20} />
            <p className="text-xs text-gray-700">Modifica la información de la oficina. El departamento se actualiza al cambiar la entidad.</p>
          </div>
          {renderFormFields(editData, setEditData)}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => setEditItem(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleEditSave} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Guardar Cambios</button>
          </div>
        </div>
      </Modal>

      {/* ── Preview Overlay ── */}
      {previewOffice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setPreviewOffice(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1C5BB8] to-[#2B6FCC] px-6 py-5">
              <button
                onClick={() => setPreviewOffice(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X size={15} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={26} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-blue-200 text-[10px] uppercase tracking-wider font-medium mb-0.5">Oficina Gubernamental</p>
                  <h3 className="text-sm font-semibold text-white leading-tight">{previewOffice.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="font-mono bg-white/15 text-white px-2 py-0.5 rounded text-xs">{previewOffice.code}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      previewOffice.status === "Activo"
                        ? "bg-green-500/20 text-green-100 border border-green-400/30"
                        : "bg-gray-400/20 text-gray-200 border border-gray-400/30"
                    }`}>{previewOffice.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-3">
              {/* Departamento */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <Building2 size={14} className="text-[#1C5BB8] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#1C5BB8] uppercase tracking-wide font-semibold">Departamento</p>
                  <p className="text-xs font-medium text-gray-800 mt-0.5">{previewOffice.department}</p>
                </div>
              </div>

              {/* Entidad */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <Briefcase size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Entidad</p>
                  <p className="text-xs font-medium text-gray-800 mt-0.5">{previewOffice.entity}</p>
                </div>
              </div>

              {/* Jerarquía visual */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">Jerarquía del sistema</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 flex-wrap">
                  <span className="bg-[#1C5BB8]/10 text-[#1C5BB8] px-2 py-0.5 rounded font-medium">{previewOffice.department}</span>
                  <ChevronDown size={10} className="text-gray-300 -rotate-90" />
                  <span className="bg-emerald-50 text-[#34A853] px-2 py-0.5 rounded font-medium truncate max-w-[140px]">{previewOffice.entity.replace(/\s*\(.*?\)/, "")}</span>
                  <ChevronDown size={10} className="text-gray-300 -rotate-90" />
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">Esta oficina</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setPreviewOffice(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => { setPreviewOffice(null); handleEditOpen(previewOffice); }}
                className="flex items-center gap-1.5 px-4 py-2 border border-[#1C5BB8] text-[#1C5BB8] rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors"
              >
                <Edit2 size={12} /> Editar Oficina
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="¿Eliminar oficina?"
        message={`¿Estás seguro de eliminar "${deleteConfirm?.name}"? Tendrás 5 segundos para deshacer esta acción.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
