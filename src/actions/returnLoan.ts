import { Prestamo, PrestamoEstado } from "@/types";
import { basicFetch } from "./BasicFetch";

interface ReturnLoanResponse {
  success: boolean;
  message: string;
  prestamo?: Prestamo;
}

// Interface para la respuesta del backend
interface BackendReturnResponse {
  success: boolean;
  message: string;
  data: {
    prestamo: {
      id: number;
      borrower_id: number;
      book_id: number;
      retrieval_date: string;
      devolution_expected_date: string;
      Borrower: { name: string };
      Book: { name: string };
    };
    devolucion: {
      fechaDevolucion: string;
      fechaEsperada: string;
      devueltoATiempo: boolean;
      diasRetraso: number;
    };
  };
}

// Interface para la respuesta de un libro individual
interface BackendBookResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    author: string;
    campus_id: number;
    Campus: {
      name: string;
    };
  };
}

export async function returnLoan(prestamoId: string): Promise<ReturnLoanResponse> {
  try {
    const response = await basicFetch(`/api/loans/${prestamoId}`, "DELETE") as BackendReturnResponse;
    
    // Mapear la respuesta del backend al formato esperado por el frontend
    const backendPrestamo = response.data.prestamo;
    const devolucion = response.data.devolucion;
    
    // Obtener información completa del libro (incluyendo autor)
    let autor = "N/A";
    try {
      const bookResponse = await basicFetch(`/api/books/${backendPrestamo.book_id}`, "GET") as BackendBookResponse;
      if (bookResponse.success && bookResponse.data) {
        autor = bookResponse.data.author;
      }
    } catch (error) {
      console.error(`Error al obtener autor del libro ${backendPrestamo.book_id}:`, error);
    }
    
    const prestamo: Prestamo = {
      id: prestamoId,
      usuarioId: backendPrestamo.borrower_id.toString(),
      libroId: backendPrestamo.book_id.toString(),
      fechaPrestamo: new Date(backendPrestamo.retrieval_date).toISOString().split('T')[0],
      fechaDevolucionPrevista: new Date(backendPrestamo.devolution_expected_date).toISOString().split('T')[0],
      fechaDevolucionReal: new Date(devolucion.fechaDevolucion).toISOString().split('T')[0],
      estado: PrestamoEstado.DEVUELTO,
      renovaciones_hechas: 0,
      LibroNombre: backendPrestamo.Book?.name || 'Libro no encontrado',
      usuarioNombre: backendPrestamo.Borrower?.name || 'Usuario no encontrado',
      autor: autor, // Ahora obtenemos el autor real del libro
      notas: devolucion.devueltoATiempo ? 
        "Libro devuelto en buen estado y a tiempo" : 
        `Libro devuelto con ${devolucion.diasRetraso} día(s) de retraso`
    };

    return {
      success: response.success,
      message: response.message,
      prestamo: prestamo
    };
  } catch (error) {
    console.error("Error al devolver el préstamo:", error);
    throw error;
  }
} 