import { AlertTriangle, X } from "lucide-react";
import { ActionTooltip } from "./ActionTooltip";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Eliminar",
}: ConfirmDialogProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 border border-gray-100">
        <ActionTooltip label="Cerrar diálogo de confirmación">
          <button
            type="button"
            aria-label="Cerrar diálogo de confirmación"
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={15} aria-hidden />
          </button>
        </ActionTooltip>
        <div className="flex items-start gap-4 pr-6">
          <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle size={22} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <ActionTooltip label="Cancelar y volver sin eliminar">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
          </ActionTooltip>
          <ActionTooltip label={`Confirmar: ${confirmLabel}`}>
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 font-semibold shadow-sm transition-colors"
            >
              {confirmLabel}
            </button>
          </ActionTooltip>
        </div>
      </div>
    </div>
  );
}
