import { Prestamo, PrestamoEstado } from "@/types";
import { basicFetch } from "./BasicFetch";

interface RenewLoanResponse {
  success: boolean;
  message: string;
  prestamo?: Prestamo;
}

export async function renewLoan(prestamoId: string): Promise<RenewLoanResponse> {
  // Mock data for development
  const mockResponse: RenewLoanResponse = {
    success: true,
    message: "Préstamo renovado exitosamente",
    prestamo: {
      id: prestamoId,
      usuarioId: "user123",
      libroId: "book456",
      fechaPrestamo: "2024-03-20",
      fechaDevolucionPrevista: "2024-05-20", // +30 días desde la fecha original
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 1,
      LibroNombre: "El Principito",
      usuarioNombre: "Juan Pérez",
      autor: "Antoine de Saint-Exupéry",
      notas: "Préstamo renovado por primera vez"
    }
  };

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock data
  return mockResponse;

  // Commented implementation with BasicFetch
  /*
  try {
    const response = await basicFetch(`/api/prestamos/${prestamoId}/renovar`, "POST");
    return response as RenewLoanResponse;
  } catch (error) {
    console.error("Error al renovar el préstamo:", error);
    throw error;
  }
  */
} 