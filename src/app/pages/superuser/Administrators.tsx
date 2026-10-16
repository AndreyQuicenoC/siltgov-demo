import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, User, Search, X, ChevronDown, Eye, Mail, MapPin, Calendar, Shield, ExternalLink } from "lucide-react";
import { Modal } from "../../components/Modal";
import { Pagination } from "../../components/Pagination";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { InfoTooltip } from "../../components/InfoTooltip";
import { toast } from "sonner";

const OFFICES = [
  "Oficina Central Sec. Salud VDC",
  "Oficina Norte Sec. Salud VDC",
  "Oficina Sur Sec. Salud VDC",
  "Oficina Central Sec. Educación VDC",
  "Oficina Norte Sec. Educación VDC",
  "Oficina Central Sec. Hacienda VDC",
  "Oficina Pagaduría Sec. Hacienda VDC",
  "Oficina Jurídica Sec. Justicia VDC",
  "Oficina Central Sec. Salud Cauca",
  "Oficina Central Sec. Educación Cauca",
  "Oficina Central Sec. Hacienda Nariño",
  "Oficina Norte Sec. Salud Nariño",
];

type Admin = {
  id: string; name: string; email: string;
  office: string; joinDate: string; status: string;
};

const initialAdmins: Admin[] = [
  { id: "1",  name: "Roberto Vargas Torres",      email: "roberto.vargas@valledelcauca.gov.co",    office: "Oficina Central Sec. Salud VDC",         joinDate: "2024-03-15", status: "Activo"   },
  { id: "2",  name: "Sofía Martínez Hoyos",        email: "sofia.martinez@valledelcauca.gov.co",    office: "Oficina Norte Sec. Salud VDC",           joinDate: "2024-05-20", status: "Activo"   },
  { id: "3",  name: "Alejandro Pardo Ríos",        email: "alejandro.pardo@valledelcauca.gov.co",   office: "Oficina Central Sec. Educación VDC",     joinDate: "2023-11-08", status: "Activo"   },
  { id: "4",  name: "Carmenza Londoño Pérez",      email: "carmenza.londono@valledelcauca.gov.co",  office: "Oficina Central Sec. Hacienda VDC",      joinDate: "2024-01-12", status: "Activo"   },
  { id: "5",  name: "Hernán Gutiérrez Cano",       email: "hernan.gutierrez@cauca.gov.co",          office: "Oficina Central Sec. Salud Cauca",       joinDate: "2023-08-30", status: "Activo"   },
  { id: "6",  name: "Patricia Benavides Mora",     email: "patricia.benavides@narino.gov.co",       office: "Oficina Central Sec. Hacienda Nariño",   joinDate: "2024-06-17", status: "Activo"   },
  { id: "7",  name: "Gustavo Camacho Flores",      email: "gustavo.camacho@valledelcauca.gov.co",   office: "Oficina Pagaduría Sec. Hacienda VDC",    joinDate: "2022-04-25", status: "Inactivo" },
  { id: "8",  name: "Natalia Cardona López",       email: "natalia.cardona@valledelcauca.gov.co",   office: "Oficina Jurídica Sec. Justicia VDC",     joinDate: "2024-09-03", status: "Activo"   },
  { id: "9",  name: "Fernando Espinosa Ruiz",      email: "fernando.espinosa@valledelcauca.gov.co", office: "Oficina Norte Sec. Educación VDC",       joinDate: "2025-02-14", status: "Activo"   },
  { id: "10", name: "Viviana Castellanos Mesa",    email: "viviana.castellanos@narino.gov.co",      office: "Oficina Norte Sec. Salud Nariño",        joinDate: "2023-07-19", status: "Inactivo" },
  { id: "11", name: "Diego Ramírez Varela",        email: "diego.ramirez@valledelcauca.gov.co",     office: "Oficina Sur Sec. Salud VDC",             joinDate: "2024-10-05", status: "Activo"   },
  { id: "12", name: "Marcela Quintero Salinas",    email: "marcela.quintero@cauca.gov.co",          office: "Oficina Central Sec. Educación Cauca",   joinDate: "2023-03-22", status: "Activo"   },
];

const ITEMS_PER_PAGE = 8;
const emptyForm = { name: "", email: "", office: "", joinDate: "", status: "Activo" };

const formatDate = (d: string) => {
  const [y, m, day] = d.split("-");
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${day} ${months[parseInt(m) - 1]}. ${y}`;
};

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

export function Administrators() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Todos" | "Activo" | "Inactivo">("Todos");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(emptyForm);

  const [editItem, setEditItem] = useState<Admin | null>(null);
  const [editData, setEditData] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Admin | null>(null);
  const [previewAdmin, setPreviewAdmin] = useState<Admin | null>(null);
  const [previewDetail, setPreviewDetail] = useState(false);

  const filtered = useMemo(() =>
    admins.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
      const matchStatus = statusFilter === "Todos" || a.status === statusFilter;
      return matchSearch && matchStatus;
    }), [admins, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCreate = () => {
    if (!formData.name || !formData.email || !formData.office) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    setAdmins(prev => [...prev, {
      id: String(Date.now()),
      ...formData,
      joinDate: formData.joinDate || new Date().toISOString().split("T")[0],
    }]);
    toast.success("Administrador creado exitosamente");
    setShowModal(false);
    setFormData(emptyForm);
  };

  const handleEditOpen = (item: Admin) => {
    setEditItem(item);
    setEditData({ name: item.name, email: item.email, office: item.office, joinDate: item.joinDate, status: item.status });
  };

  const handleEditSave = () => {
    if (!editData.name || !editData.email || !editData.office) {
      toast.error("Completa todos los campos obligatorios"); return;
    }
    setAdmins(prev => prev.map(a => a.id === editItem!.id ? { ...a, ...editData } : a));
    toast.success("Administrador actualizado exitosamente");
    setEditItem(null);
  };

  const handleDeleteRequest = (item: Admin) => setDeleteConfirm(item);

  const handleDeleteConfirmed = () => {
    const item = deleteConfirm!;
    const originalIndex = admins.findIndex(a => a.id === item.id);
    setAdmins(prev => prev.filter(a => a.id !== item.id));
    setDeleteConfirm(null);
    showUndoToast(`Administrador "${item.name}" eliminado`, () => {
      setAdmins(prev => {
        const arr = [...prev];
        arr.splice(Math.min(originalIndex, arr.length), 0, item);
        return arr;
      });
    });
  };

  const handlePreviewOpen = (item: Admin) => {
    setPreviewAdmin(item);
    setPreviewDetail(false);
  };

  const renderFormFields = (data: typeof emptyForm, setData: (d: typeof emptyForm) => void, isEdit = false) => (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre Completo <span className="text-red-500">*</span></label>
        <input type="text" value={data.name} onChange={e => setData({ ...data, name: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
          placeholder="Nombre y apellidos completos" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Correo Institucional <span className="text-red-500">*</span>
          {isEdit && <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">No editable</span>}
        </label>
        {isEdit ? (
          <input type="email" value={data.email} readOnly
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed" />
        ) : (
          <input type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]"
            placeholder="correo@departamento.gov.co" />
        )}
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5 inline-flex items-center">
          Oficina Asignada <span className="text-red-500 mr-1">*</span>
          <InfoTooltip content="Cada administrador gestiona una única oficina: sus liquidadores, pagadores y sentencias. No puede acceder a oficinas de otras dependencias." />
        </label>
        <select value={data.office} onChange={e => setData({ ...data, office: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
          <option value="">Seleccionar oficina...</option>
          {OFFICES.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Fecha de Ingreso</label>
          <input type="date" value={data.joinDate} onChange={e => setData({ ...data, joinDate: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Estado</label>
          <select value={data.status} onChange={e => setData({ ...data, status: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B9BDE] bg-white">
            <option>Activo</option><option>Inactivo</option>
          </select>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Administradores</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de administradores asignados a oficinas del sistema</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1C5BB8] text-white px-4 py-2 rounded-lg hover:bg-[#1850A0] transition-colors text-sm font-medium shadow-sm">
          <Plus size={16} /> Nuevo Administrador
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por nombre o correo..."
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
                    <button key={opt} onClick={() => { setStatusFilter(opt); setCurrentPage(1); setShowStatusMenu(false); }}
                      className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 ${statusFilter === opt ? "text-[#1C5BB8] font-medium" : "text-gray-700"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} administradores</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Administrador", "Correo Institucional", "Oficina Asignada", "Fecha Ingreso", "Estado", "Acciones"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No se encontraron administradores</td></tr>
              ) : paginated.map(admin => (
                <tr key={admin.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={13} className="text-purple-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{admin.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[180px] truncate">{admin.email}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[200px] truncate">{admin.office}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-gray-500">{formatDate(admin.joinDate)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border ${
                      admin.status === "Activo" ? "bg-green-50 text-[#34A853] border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}>{admin.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handlePreviewOpen(admin)} className="p-1.5 hover:bg-purple-50 rounded-lg text-gray-400 hover:text-purple-600 transition-colors" title="Vista previa"><Eye size={14} /></button>
                      <button onClick={() => handleEditOpen(admin)} className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-[#1C5BB8] transition-colors" title="Editar"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteRequest(admin)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 size={14} /></button>
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Administrador" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-purple-50 rounded-lg">
            <User className="text-purple-600" size={20} />
            <p className="text-xs text-gray-700">Cada administrador es asignado a una única oficina del sistema</p>
          </div>
          {renderFormFields(formData, setFormData)}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleCreate} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Crear Administrador</button>
          </div>
        </div>
      </Modal>

      {/* Modal: Editar */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Editar Administrador" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-purple-50 rounded-lg">
            <User className="text-purple-600" size={20} />
            <p className="text-xs text-gray-700">Actualiza la información del administrador. El correo no puede modificarse.</p>
          </div>
          {renderFormFields(editData, setEditData, true)}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button onClick={() => setEditItem(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleEditSave} className="px-5 py-2 bg-[#1C5BB8] text-white rounded-lg text-sm hover:bg-[#1850A0] font-medium">Guardar Cambios</button>
          </div>
        </div>
      </Modal>

      {/* Overlay: Vista previa del administrador */}
      {previewAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setPreviewAdmin(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1C5BB8] to-[#2B6FCC] px-6 py-5">
              <button onClick={() => setPreviewAdmin(null)} className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                <X size={15} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={26} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{previewAdmin.name}</h3>
                  <p className="text-xs text-blue-100 mt-0.5">Administrador del Sistema</p>
                  <span className={`inline-flex mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                    previewAdmin.status === "Activo" ? "bg-green-500/20 text-green-100 border border-green-400/30" : "bg-gray-400/20 text-gray-200 border border-gray-400/30"
                  }`}>{previewAdmin.status}</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Correo Institucional</p>
                  <p className="text-xs font-medium text-gray-800 mt-0.5">{previewAdmin.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Oficina Asignada</p>
                  <p className="text-xs font-medium text-gray-800 mt-0.5">{previewAdmin.office}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Fecha de Ingreso</p>
                  <p className="text-xs font-medium text-gray-800 mt-0.5">{formatDate(previewAdmin.joinDate)}</p>
                </div>
              </div>

              {previewDetail && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <Shield size={14} className="text-[#1C5BB8] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#1C5BB8] uppercase tracking-wide font-semibold">Rol y Permisos</p>
                    <p className="text-xs text-gray-700 mt-0.5">Administrador — Acceso completo a su oficina asignada. Puede gestionar liquidadores, pagadores y sentencias de su dependencia.</p>
                    <p className="text-[10px] text-gray-400 mt-1.5">ID de usuario: ADM-{previewAdmin.id.padStart(4, "0")}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <button onClick={() => setPreviewAdmin(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                Cerrar
              </button>
              <div className="flex items-center gap-2">
                {!previewDetail && (
                  <button onClick={() => setPreviewDetail(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1C5BB8] text-white rounded-lg text-xs font-medium hover:bg-[#1850A0] transition-colors">
                    <ExternalLink size={12} /> Ver al detalle
                  </button>
                )}
                <button onClick={() => { setPreviewAdmin(null); handleEditOpen(previewAdmin); }}
                  className="flex items-center gap-1.5 px-4 py-2 border border-[#1C5BB8] text-[#1C5BB8] rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors">
                  <Edit2 size={12} /> Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="¿Eliminar administrador?"
        message={`¿Estás seguro de eliminar a "${deleteConfirm?.name}"? Tendrás 5 segundos para deshacer esta acción.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}