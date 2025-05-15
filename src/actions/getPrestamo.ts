import { Prestamo, PrestamoEstado } from "@/types";
import { basicFetch } from "./BasicFetch";

export async function getPrestamo(prestamoId: string): Promise<Prestamo> {
  // Mock data for development
  const mockPrestamo: Prestamo = {
    id: prestamoId,
    usuarioId: "user123",
    libroId: "book456",
    fechaPrestamo: "2024-03-20",
    fechaDevolucionPrevista: "2024-04-20",
    estado: PrestamoEstado.ACTIVO,
    renovaciones_hechas: 0,
    LibroNombre: "El Principito",
    usuarioNombre: "Juan Pérez",
    autor: "Antoine de Saint-Exupéry",
    notas: "Préstamo en buen estado"
  };

  // Return mock data
  return mockPrestamo;

  // Commented implementation with BasicFetch
  /*
  try {
    const response = await basicFetch(`/api/prestamos/${prestamoId}`, "GET");
    return response as Prestamo;
  } catch (error) {
    console.error("Error al obtener el préstamo:", error);
    throw error;
  }
  */
} 