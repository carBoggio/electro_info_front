// getAllLoans.ts

import { Prestamo, PrestamoEstado } from "@/types";
import { basicFetch } from "./BasicFetch";

// Interface para la respuesta del backend (reutilizando la misma de getLoan y getOverdueLoans)
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

export const getAllLoans = async (): Promise<Prestamo[]> => {
  try {
    const response = await basicFetch(`/api/loans`, "GET") as BackendLoansResponse;
    
    if (!response.success || !response.data) {
      return [];
    }

    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    // Mapear todos los préstamos al formato del frontend y obtener información del autor
    const prestamosPromises = response.data.map(async (loan) => {
      // Determinar el estado del préstamo
      const fechaDevolucionPrevista = new Date(loan.devolution_expected_date);
      fechaDevolucionPrevista.setHours(0, 0, 0, 0);
      
      const isOverdue = fechaDevolucionPrevista < fechaActual;
      const diasRetraso = isOverdue ? 
        Math.ceil((fechaActual.getTime() - fechaDevolucionPrevista.getTime()) / (1000 * 60 * 60 * 24)) : 
        0;

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

      const prestamo: Prestamo = {
        id: loan.id.toString(),
        usuarioId: loan.borrower_id.toString(),
        libroId: loan.book_id.toString(),
        fechaPrestamo: new Date(loan.retrieval_date).toISOString().split('T')[0],
        fechaDevolucionPrevista: new Date(loan.devolution_expected_date).toISOString().split('T')[0],
        fechaDevolucionReal: undefined, // Los préstamos activos no tienen fecha de devolución real
        estado: isOverdue ? PrestamoEstado.VENCIDO : PrestamoEstado.ACTIVO,
        renovaciones_hechas: 0, // Este campo no existe en el backend
        diasRetraso: diasRetraso,
        LibroNombre: loan.Book?.name || 'Libro no encontrado',
        usuarioNombre: loan.Borrower?.name || 'Usuario no encontrado',
        autor: autor, // Ahora obtenemos el autor real del libro
        notas: isOverdue ? 
          `Préstamo vencido hace ${diasRetraso} día(s)` : 
          "Préstamo activo"
      };

      return prestamo;
    });

    // Esperar a que todas las promesas se resuelvan
    const prestamos = await Promise.all(prestamosPromises);
    return prestamos;
  } catch (error) {
    console.error("Error al obtener todos los préstamos:", error);
    return [];
  }
};

export default getAllLoans;