import { Prestamo, PrestamoEstado } from "@/types";
import { basicFetch } from "./BasicFetch";

interface ReturnLoanResponse {
  success: boolean;
  message: string;
  prestamo?: Prestamo;
}

export async function returnLoan(prestamoId: string): Promise<ReturnLoanResponse> {
  // Mock data for development
  const mockResponse: ReturnLoanResponse = {
    success: true,
    message: "Préstamo devuelto exitosamente",
    prestamo: {
      id: prestamoId,
      usuarioId: "user123",
      libroId: "book456",
      fechaPrestamo: "2024-03-20",
      fechaDevolucionPrevista: "2024-04-20",
      fechaDevolucionReal: new Date().toISOString().split('T')[0],
      estado: PrestamoEstado.DEVUELTO,
      renovaciones_hechas: 0,
      LibroNombre: "El Principito",
      usuarioNombre: "Juan Pérez",
      autor: "Antoine de Saint-Exupéry",
      notas: "Libro devuelto en buen estado"
    }
  };

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock data
  return mockResponse;

  // Commented implementation with BasicFetch
  /*
  try {
    const response = await basicFetch(`/api/prestamos/${prestamoId}/devolver`, "POST");
    return response as ReturnLoanResponse;
  } catch (error) {
    console.error("Error al devolver el préstamo:", error);
    throw error;
  }
  */
} 