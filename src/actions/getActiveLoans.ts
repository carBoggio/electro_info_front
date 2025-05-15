import { PRESTAMOS_BASE } from "@/actions/mocks";
import { Prestamo } from "@/types";

export const getActiveLoans = async (): Promise<Prestamo[]> => {
  // Filtra solo los préstamos activos
  return PRESTAMOS_BASE.filter(p => p.estado === "ACTIVO");
};