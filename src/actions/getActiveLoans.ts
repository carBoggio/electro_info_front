import { Prestamo, PrestamoEstado } from "@/types";
import { getAllLoans } from "./getAllLoans";
import { basicFetch } from "./BasicFetch";

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

export const isBookInActiveLoans = async (bookId: string): Promise<boolean> => {
  try {
    // Obtener todos los préstamos activos
    const activeLoans = await getActiveLoans();
    
    // Verificar si el libro está en algún préstamo activo
    return activeLoans.some(loan => loan.libroId === bookId);
  } catch (error) {
    console.error("Error al verificar si el libro está en préstamos activos:", error);
    return false; // En caso de error, asumimos que no está disponible
  }
};