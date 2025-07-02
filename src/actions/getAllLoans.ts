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
  devolution_date?: string; // Fecha de devolución real (si existe)
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
      
      let estado: PrestamoEstado;
      let diasRetraso = 0;
      let fechaDevolucionReal: string | undefined;

      // Si tiene fecha de devolución real, está devuelto
      if (loan.devolution_date) {
        estado = PrestamoEstado.DEVUELTO;
        fechaDevolucionReal = new Date(loan.devolution_date).toISOString().split('T')[0];
        
        // Calcular si fue devuelto con retraso
        const fechaDevolucion = new Date(loan.devolution_date);
        fechaDevolucion.setHours(0, 0, 0, 0);
        if (fechaDevolucion > fechaDevolucionPrevista) {
          diasRetraso = Math.ceil((fechaDevolucion.getTime() - fechaDevolucionPrevista.getTime()) / (1000 * 60 * 60 * 24));
        }
      } else {
        // Si no tiene fecha de devolución, verificar si está vencido
        const isOverdue = fechaDevolucionPrevista < fechaActual;
        if (isOverdue) {
          estado = PrestamoEstado.VENCIDO;
          diasRetraso = Math.ceil((fechaActual.getTime() - fechaDevolucionPrevista.getTime()) / (1000 * 60 * 60 * 24));
        } else {
          estado = PrestamoEstado.ACTIVO;
        }
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

      const prestamo: Prestamo = {
        id: loan.id.toString(),
        usuarioId: loan.borrower_id.toString(),
        libroId: loan.book_id.toString(),
        fechaPrestamo: new Date(loan.retrieval_date).toISOString().split('T')[0],
        fechaDevolucionPrevista: new Date(loan.devolution_expected_date).toISOString().split('T')[0],
        fechaDevolucionReal: fechaDevolucionReal,
        estado: estado,
        renovaciones_hechas: 0, // Este campo no existe en el backend
        diasRetraso: diasRetraso,
        LibroNombre: loan.Book?.name || 'Libro no encontrado',
        usuarioNombre: loan.Borrower?.name || 'Usuario no encontrado',
        autor: autor, // Ahora obtenemos el autor real del libro
        notas: estado === PrestamoEstado.DEVUELTO ? 
          (diasRetraso > 0 ? `Devuelto con ${diasRetraso} día(s) de retraso` : "Devuelto a tiempo") :
          estado === PrestamoEstado.VENCIDO ? 
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

// Nueva función específica para obtener el historial completo de préstamos
export const getCompleteLoanHistory = async (): Promise<Prestamo[]> => {
  try {
    // Intentar obtener todos los préstamos (incluyendo devueltos)
    const response = await basicFetch(`/api/loans/history`, "GET") as BackendLoansResponse;
    
    if (!response.success || !response.data) {
      // Si no existe el endpoint de historial, usar getAllLoans
      console.log("Endpoint de historial no disponible, usando getAllLoans");
      return await getAllLoans();
    }

    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    // Mapear todos los préstamos del historial
    const prestamosPromises = response.data.map(async (loan) => {
      // Determinar el estado del préstamo
      const fechaDevolucionPrevista = new Date(loan.devolution_expected_date);
      fechaDevolucionPrevista.setHours(0, 0, 0, 0);
      
      let estado: PrestamoEstado;
      let diasRetraso = 0;
      let fechaDevolucionReal: string | undefined;

      // Si tiene fecha de devolución real, está devuelto
      if (loan.devolution_date) {
        estado = PrestamoEstado.DEVUELTO;
        fechaDevolucionReal = new Date(loan.devolution_date).toISOString().split('T')[0];
        
        // Calcular si fue devuelto con retraso
        const fechaDevolucion = new Date(loan.devolution_date);
        fechaDevolucion.setHours(0, 0, 0, 0);
        if (fechaDevolucion > fechaDevolucionPrevista) {
          diasRetraso = Math.ceil((fechaDevolucion.getTime() - fechaDevolucionPrevista.getTime()) / (1000 * 60 * 60 * 24));
        }
      } else {
        // Si no tiene fecha de devolución, verificar si está vencido
        const isOverdue = fechaDevolucionPrevista < fechaActual;
        if (isOverdue) {
          estado = PrestamoEstado.VENCIDO;
          diasRetraso = Math.ceil((fechaActual.getTime() - fechaDevolucionPrevista.getTime()) / (1000 * 60 * 60 * 24));
        } else {
          estado = PrestamoEstado.ACTIVO;
        }
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

      const prestamo: Prestamo = {
        id: loan.id.toString(),
        usuarioId: loan.borrower_id.toString(),
        libroId: loan.book_id.toString(),
        fechaPrestamo: new Date(loan.retrieval_date).toISOString().split('T')[0],
        fechaDevolucionPrevista: new Date(loan.devolution_expected_date).toISOString().split('T')[0],
        fechaDevolucionReal: fechaDevolucionReal,
        estado: estado,
        renovaciones_hechas: 0,
        diasRetraso: diasRetraso,
        LibroNombre: loan.Book?.name || 'Libro no encontrado',
        usuarioNombre: loan.Borrower?.name || 'Usuario no encontrado',
        autor: autor,
        notas: estado === PrestamoEstado.DEVUELTO ? 
          (diasRetraso > 0 ? `Devuelto con ${diasRetraso} día(s) de retraso` : "Devuelto a tiempo") :
          estado === PrestamoEstado.VENCIDO ? 
          `Préstamo vencido hace ${diasRetraso} día(s)` : 
          "Préstamo activo"
      };

      return prestamo;
    });

    // Esperar a que todas las promesas se resuelvan
    const prestamos = await Promise.all(prestamosPromises);
    return prestamos;
  } catch (error) {
    console.error("Error al obtener el historial completo de préstamos:", error);
    // Fallback a getAllLoans si hay error
    return await getAllLoans();
  }
};

export default getAllLoans;