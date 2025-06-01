import { Prestamo, PrestamoEstado } from "@/types";
import { basicFetch } from "./BasicFetch";

// Interface para la respuesta del backend
interface BackendLoan {
  id: number;
  borrower_id: number;
  book_id: number;
  retrieval_date: string;
  devolution_expected_date: string;
  createdAt: string;
  updatedAt: string;
  Borrower: {
    name: string;
    Role: {
      name: string;
    };
  };
  Book: {
    name: string;
    Campus: {
      name: string;
    };
  };
}

interface BackendLoansResponse {
  success: boolean;
  count: number;
  data: BackendLoan[];
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

export async function getLoan(prestamoId: string): Promise<Prestamo | null> {
  try {
    const response = await basicFetch(`/api/loans`, "GET") as BackendLoansResponse;
    
    if (!response.success || !response.data) {
      return null;
    }

    // Buscar el préstamo específico por ID
    const loan = response.data.find(loan => loan.id.toString() === prestamoId);
    
    if (!loan) {
      return null;
    }

    // Obtener información completa del libro (incluyendo autor)
    let autor = "N/A";
    try {
      const bookResponse = await basicFetch(`/api/books/${loan.book_id}`, "GET") as BackendBookResponse;
      if (bookResponse.success && bookResponse.data) {
        autor = bookResponse.data.author;
      }
    } catch (error) {
      console.error(`Error al obtener autor del libro ${loan.book_id}:`, error);
    }

    // Mapear la respuesta del backend al formato del frontend
    const prestamo: Prestamo = {
      id: loan.id.toString(),
      usuarioId: loan.borrower_id.toString(),
      libroId: loan.book_id.toString(),
      fechaPrestamo: new Date(loan.retrieval_date).toISOString().split('T')[0],
      fechaDevolucionPrevista: new Date(loan.devolution_expected_date).toISOString().split('T')[0],
      estado: PrestamoEstado.ACTIVO, // Los préstamos en la base son activos por defecto
      renovaciones_hechas: 0, // Este campo no existe en el backend, agregar después si es necesario
      LibroNombre: loan.Book?.name || 'Libro no encontrado',
      usuarioNombre: loan.Borrower?.name || 'Usuario no encontrado',
      autor: autor, // Ahora obtenemos el autor real del libro
      notas: `Préstamo activo desde ${new Date(loan.retrieval_date).toLocaleDateString()}`
    };

    return prestamo;
  } catch (error) {
    console.error("Error al obtener el préstamo:", error);
    return null;
  }
} 