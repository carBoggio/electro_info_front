import { Prestamo, PrestamoEstado } from "@/types";

import { getLoan } from "./getPrestamo";
import { returnLoan } from "./returnLoan";
import { makeLoan } from "./MakeLoan";
import { getBookByCode } from "./getBookByCode";

interface RenewLoanResponse {
  success: boolean;
  message: string;
  prestamo?: Prestamo;
}

export async function renewLoan(prestamoId: string, diasAdicionales: number = 14): Promise<RenewLoanResponse> {
  try {
    // 1. Obtener información del préstamo actual
    const prestamoActual = await getLoan(prestamoId);
    
    if (!prestamoActual) {
      return {
        success: false,
        message: "Préstamo no encontrado"
      };
    }

    if (prestamoActual.estado !== PrestamoEstado.ACTIVO) {
      return {
        success: false,
        message: "Solo se pueden renovar préstamos activos"
      };
    }

    // 2. Obtener información del libro usando el libroId
    const libroResponse = await getBookByCode(prestamoActual.libroId);
    if (!libroResponse.success || !libroResponse.libro) {
      return {
        success: false,
        message: "No se pudo obtener información del libro"
      };
    }

    // 3. Eliminar el préstamo actual usando returnLoan
    const returnResult = await returnLoan(prestamoId);
    if (!returnResult.success) {
      return {
        success: false,
        message: `Error al procesar la devolución: ${returnResult.message}`
      };
    }

    // 4. Crear un nuevo préstamo con más días
    const newLoanResult = await makeLoan(
      prestamoActual.usuarioId,
      diasAdicionales,
      prestamoActual.libroId
    );

    if (!newLoanResult.success) {
      return {
        success: false,
        message: `Error al crear el nuevo préstamo: ${newLoanResult.message || 'Error desconocido'}`
      };
    }

    // 5. Crear el préstamo renovado con la información actualizada
    const fechaHoy = new Date();
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaHoy.getDate() + diasAdicionales);

    const prestamoRenovado: Prestamo = {
      id: prestamoId, // Mantener el mismo ID para la respuesta
      usuarioId: prestamoActual.usuarioId,
      libroId: prestamoActual.libroId,
      fechaPrestamo: fechaHoy.toISOString().split('T')[0],
      fechaDevolucionPrevista: fechaDevolucion.toISOString().split('T')[0],
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: prestamoActual.renovaciones_hechas + 1,
      LibroNombre: prestamoActual.LibroNombre,
      usuarioNombre: prestamoActual.usuarioNombre,
      autor: prestamoActual.autor,
      notas: `Préstamo renovado. Renovaciones realizadas: ${prestamoActual.renovaciones_hechas + 1}`
    };

    return {
      success: true,
      message: "Préstamo renovado exitosamente",
      prestamo: prestamoRenovado
    };

  } catch (error) {
    console.error("Error al renovar el préstamo:", error);
    return {
      success: false,
      message: "Error interno al procesar la renovación"
    };
  }
} 