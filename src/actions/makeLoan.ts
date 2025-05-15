import { Prestamo, PrestamoEstado } from "@/types";
import { basicFetch } from "./BasicFetch";

interface MakeLoanResponse {
  success: boolean;
  message: string;
  prestamo?: Prestamo;
}

interface MakeLoanRequest {
  libroId: string;
  usuarioId: string;
  duracionDias: number;
  barcode?: string;
}

const makeLoan = async (request: MakeLoanRequest): Promise<MakeLoanResponse> => {
  // Mock data for development
  const mockResponse: MakeLoanResponse = {
    success: true,
    message: "Préstamo creado exitosamente",
    prestamo: {
      id: Math.random().toString(36).substr(2, 9), // ID aleatorio
      usuarioId: request.usuarioId,
      libroId: request.libroId,
      fechaPrestamo: new Date().toISOString().split('T')[0],
      fechaDevolucionPrevista: new Date(Date.now() + request.duracionDias * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 0,
      LibroNombre: "El Principito", // Esto vendría del backend
      usuarioNombre: "Juan Pérez", // Esto vendría del backend
      autor: "Antoine de Saint-Exupéry", // Esto vendría del backend
      notas: request.barcode ? `Préstamo realizado con código de barras: ${request.barcode}` : "Préstamo realizado manualmente"
    }
  };

  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock data
  return mockResponse;

  // Commented implementation with BasicFetch
  /*
  try {
    const response = await basicFetch('/api/prestamos/crear', 'POST', request);
    return response as MakeLoanResponse;
  } catch (error) {
    console.error("Error al crear el préstamo:", error);
    throw error;
  }
  */
};

export { makeLoan }; 