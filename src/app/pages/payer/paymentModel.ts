// Modelo de Pago + AjustePago para el flujo de pagador
export type PaymentChannel = "PSE" | "PayU" | "Visa" | "Nequi" | "Daviplata" | "Bancolombia" | "Efecty";
export type PaymentTxStatus = "iniciado" | "procesando" | "aprobado" | "rechazado";

export interface Pago {
  id: string;
  sentenceId: string;
  channel: PaymentChannel;
  amount: number;
  date: string;          // YYYY-MM-DD
  voucherRef: string;
  payingEntity: string;
  status: PaymentTxStatus;
  reportFile?: string;
  createdAt: string;
}

export type AjusteTipo = "correccion" | "reverso_parcial" | "complemento";

export interface AjustePago {
  id: string;
  pagoId: string;
  tipo: AjusteTipo;
  amount: number;
  reason: string;
  date: string;
  createdBy: string;
}

export const ajusteLabels: Record<AjusteTipo, string> = {
  correccion: "Corrección",
  reverso_parcial: "Reverso parcial",
  complemento: "Complemento",
};

// Almacén en memoria de demos (cuando exista Supabase se reemplaza)
export const mockPagos: Pago[] = [];
export const mockAjustes: AjustePago[] = [];