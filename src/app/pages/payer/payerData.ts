export type PaymentStatus = "paid" | "pending" | "to_correct";

export interface PayerSentence {
  id: string;
  number: string;
  plaintiff: string;
  entity: string;
  liquidator: string;
  payer?: string;
  liquidatedValue: string;
  liquidatedRaw: number;
  completedDate: string;
  year: number;
  status: PaymentStatus;
  paidDate?: string;
  paymentMethod?: string;
  voucherRef?: string;
  payingEntity?: string;
  correctionNote?: string;
  juzgado?: string;
  fallo?: string;
  tipoObligacion?: string;
  capitalBase?: string;
  interesesCausados?: string;
  costas?: string;
  observations?: string;
}

export const ALL_PAYER_SENTENCES: PayerSentence[] = [
  // ── 2026 ─────────────────────────────────────────────────────────────────────
  {
    id: "1", number: "S-2026-002", plaintiff: "Jorge Enrique Morales Pinto",
    entity: "Secretaría de Educación", liquidator: "Carlos Sánchez",
    liquidatedValue: "$34.300.000", liquidatedRaw: 34300000,
    completedDate: "2026-02-25", year: 2026, status: "pending",
    juzgado: "Juzgado 2° Administrativo de Cali", fallo: "2026-01-15",
    tipoObligacion: "Intereses Moratorios",
    capitalBase: "$28.000.000", interesesCausados: "$5.800.000", costas: "$500.000",
    observations: "Sentencia ejecutoriada. Pago dentro de los 18 meses siguientes a la ejecutoria del fallo.",
  },
  {
    id: "2", number: "S-2026-006", plaintiff: "Ana María Rodríguez Flórez",
    entity: "Secretaría de Salud", liquidator: "Laura Díaz",
    liquidatedValue: "$58.200.000", liquidatedRaw: 58200000,
    completedDate: "2026-02-23", year: 2026, status: "pending",
    juzgado: "Tribunal Administrativo del Valle del Cauca", fallo: "2026-01-20",
    tipoObligacion: "Reliquidación Pensional",
    capitalBase: "$48.000.000", interesesCausados: "$9.200.000", costas: "$1.000.000",
    observations: "Incluye reliquidación de mesadas pensionales. Coordinar con Secretaría de Hacienda.",
  },
  {
    id: "3", number: "S-2026-008", plaintiff: "Roberto Castaño López",
    entity: "Gobernación Valle del Cauca", liquidator: "María García",
    liquidatedValue: "$21.500.000", liquidatedRaw: 21500000,
    completedDate: "2026-02-20", year: 2026, status: "pending",
    juzgado: "Juzgado 5° Administrativo de Cali", fallo: "2026-01-10",
    tipoObligacion: "Daño Emergente",
    capitalBase: "$18.000.000", interesesCausados: "$3.000.000", costas: "$500.000",
    observations: "Incluir costas del proceso judicial según auto de 2026-01-08.",
  },
  {
    id: "4", number: "S-2026-011", plaintiff: "Carmen Inés Vargas Mosquera",
    entity: "Secretaría de Infraestructura", liquidator: "Pedro Jiménez",
    liquidatedValue: "$47.800.000", liquidatedRaw: 47800000,
    completedDate: "2026-02-18", year: 2026, status: "to_correct",
    correctionNote: "El soporte de pago adjunto tiene errores en el número de cuenta bancaria del beneficiario. Verificar y adjuntar comprobante correcto con los datos bancarios actualizados del demandante.",
    juzgado: "Consejo de Estado", fallo: "2026-01-05",
    tipoObligacion: "Lucro Cesante",
    capitalBase: "$40.000.000", interesesCausados: "$7.300.000", costas: "$500.000",
    observations: "Proceso de segunda instancia. El administrador requiere corrección del soporte de pago.",
  },
  {
    id: "5", number: "S-2026-003", plaintiff: "Pedro Martínez Gómez",
    entity: "Secretaría de Hacienda", liquidator: "Laura Díaz",
    liquidatedValue: "$58.200.000", liquidatedRaw: 58200000,
    completedDate: "2026-02-10", year: 2026, status: "paid",
    paidDate: "2026-02-15", paymentMethod: "Transferencia Bancaria",
    voucherRef: "COMP-2026-015", payingEntity: "Banco de Bogotá",
    juzgado: "Juzgado 1° Administrativo de Cali", fallo: "2025-12-20",
    tipoObligacion: "Intereses Moratorios",
    capitalBase: "$48.000.000", interesesCausados: "$9.200.000", costas: "$1.000.000",
    observations: "Pago registrado en tiempo. Sin observaciones adicionales.",
  },
  {
    id: "6", number: "S-2026-004", plaintiff: "Carmen López Restrepo",
    entity: "Secretaría de Educación", liquidator: "Carlos Sánchez",
    liquidatedValue: "$21.800.000", liquidatedRaw: 21800000,
    completedDate: "2026-02-05", year: 2026, status: "paid",
    paidDate: "2026-02-10", paymentMethod: "Cheque",
    voucherRef: "COMP-2026-010", payingEntity: "Bancolombia",
    juzgado: "Juzgado 3° Administrativo de Cali", fallo: "2025-12-15",
    tipoObligacion: "Daño Moral",
    capitalBase: "$18.000.000", interesesCausados: "$3.300.000", costas: "$500.000",
    observations: "Pago completo. Sin observaciones.",
  },
  {
    id: "7", number: "S-2026-001", plaintiff: "Luis Fernández Parra",
    entity: "Secretaría de Salud", liquidator: "María García",
    liquidatedValue: "$38.500.000", liquidatedRaw: 38500000,
    completedDate: "2026-01-20", year: 2026, status: "paid",
    paidDate: "2026-01-28", paymentMethod: "Transferencia Bancaria",
    voucherRef: "COMP-2026-003", payingEntity: "Davivienda",
    juzgado: "Tribunal Administrativo del Valle del Cauca", fallo: "2025-11-30",
    tipoObligacion: "Reliquidación Pensional",
    capitalBase: "$32.000.000", interesesCausados: "$6.000.000", costas: "$500.000",
    observations: "Primer pago del año 2026. Proceso completado dentro del plazo.",
  },
  // ── 2025 histórico ─────────────────────────────────────────────────────────
  {
    id: "8", number: "S-2025-089", plaintiff: "Andrés Felipe Moreno Gutiérrez",
    entity: "Secretaría de Hacienda", liquidator: "Pedro Jiménez",
    liquidatedValue: "$29.400.000", liquidatedRaw: 29400000,
    completedDate: "2025-11-15", year: 2025, status: "paid",
    paidDate: "2025-11-25", paymentMethod: "Transferencia Bancaria",
    voucherRef: "COMP-2025-089", payingEntity: "Bancolombia",
    juzgado: "Juzgado 4° Administrativo de Cali", fallo: "2025-10-01",
    tipoObligacion: "Intereses Moratorios",
    capitalBase: "$24.000.000", interesesCausados: "$4.900.000", costas: "$500.000",
    observations: "Pago histórico 2025. Proceso completado.",
  },
  {
    id: "9", number: "S-2025-075", plaintiff: "Gloria Patricia Ospina Restrepo",
    entity: "Gobernación Valle del Cauca", liquidator: "Carlos Sánchez",
    liquidatedValue: "$43.100.000", liquidatedRaw: 43100000,
    completedDate: "2025-10-20", year: 2025, status: "paid",
    paidDate: "2025-11-02", paymentMethod: "Cheque",
    voucherRef: "COMP-2025-075", payingEntity: "Banco de Occidente",
    juzgado: "Tribunal Administrativo del Valle del Cauca", fallo: "2025-09-15",
    tipoObligacion: "Daño Emergente",
    capitalBase: "$36.000.000", interesesCausados: "$6.600.000", costas: "$500.000",
    observations: "Caso histórico 2025.",
  },
  {
    id: "10", number: "S-2025-060", plaintiff: "Hernando Castro Flórez",
    entity: "Secretaría de Educación", liquidator: "Laura Díaz",
    liquidatedValue: "$67.800.000", liquidatedRaw: 67800000,
    completedDate: "2025-08-30", year: 2025, status: "paid",
    paidDate: "2025-09-15", paymentMethod: "Pago en Línea PSE",
    voucherRef: "COMP-2025-060", payingEntity: "Davivienda",
    juzgado: "Consejo de Estado", fallo: "2025-07-20",
    tipoObligacion: "Reliquidación Pensional",
    capitalBase: "$56.000.000", interesesCausados: "$11.300.000", costas: "$500.000",
    observations: "Caso del Consejo de Estado. Pagado dentro del plazo.",
  },
  {
    id: "11", number: "S-2025-048", plaintiff: "Marta Cecilia Betancur Arango",
    entity: "Secretaría de Infraestructura", liquidator: "María García",
    liquidatedValue: "$15.900.000", liquidatedRaw: 15900000,
    completedDate: "2025-07-10", year: 2025, status: "paid",
    paidDate: "2025-07-20", paymentMethod: "Consignación Bancaria",
    voucherRef: "COMP-2025-048", payingEntity: "BBVA Colombia",
    juzgado: "Juzgado 2° Administrativo de Cali", fallo: "2025-06-01",
    tipoObligacion: "Lucro Cesante",
    capitalBase: "$13.500.000", interesesCausados: "$2.100.000", costas: "$300.000",
    observations: "Proceso menor cuantía.",
  },
  {
    id: "12", number: "S-2025-031", plaintiff: "Jorge Luis Salcedo Varela",
    entity: "Secretaría de Salud", liquidator: "Pedro Jiménez",
    liquidatedValue: "$52.700.000", liquidatedRaw: 52700000,
    completedDate: "2025-05-22", year: 2025, status: "paid",
    paidDate: "2025-06-05", paymentMethod: "Giro Bancario",
    voucherRef: "COMP-2025-031", payingEntity: "Banco Popular",
    juzgado: "Tribunal Administrativo del Valle del Cauca", fallo: "2025-04-15",
    tipoObligacion: "Daño Moral",
    capitalBase: "$44.000.000", interesesCausados: "$8.200.000", costas: "$500.000",
    observations: "Proceso completado dentro del plazo legal.",
  },
];

export const paymentMethods = [
  "Transferencia Bancaria",
  "Cheque",
  "Consignación Bancaria",
  "Pago en Línea PSE",
  "Giro Bancario",
];

export const bankEntities = [
  "Bancolombia",
  "Banco de Bogotá",
  "Davivienda",
  "BBVA Colombia",
  "Banco Popular",
  "Banco Agrario",
  "Banco de Occidente",
  "Banco GNB Sudameris",
  "Entidad Oficial",
];