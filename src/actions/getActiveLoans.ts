import { Prestamo, PrestamoEstado } from "@/types";
import { getAllLoans } from "./getAllLoans";

export const getActiveLoans = async (): Promise<Prestamo[]> => {
  try {
    // Obtener todos los préstamos y filtrar solo los activos
    const todosLosPrestamos = await getAllLoans();
    return todosLosPrestamos.filter(prestamo => prestamo.estado === PrestamoEstado.ACTIVO);
  } catch (error) {
    console.error("Error al obtener préstamos activos:", error);
    return [];
  }
};