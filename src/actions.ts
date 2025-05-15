import { Libro, Prestamo, PrestamoEstado, LibrosResponse } from './types';

const API_URL = 'http://localhost:3000/api';

interface BuscarLibroParams {
  titulo?: string;
  autor?: string;
  isbn?: string;
}

interface CrearPrestamoData {
  libroId: string;
  usuarioId: string;
  fechaPrestamo: string;
  fechaDevolucionPrevista: string;
}

// Libros actions
export const libroActions = {
  buscarLibro: async (params: BuscarLibroParams): Promise<Libro[]> => {
    const queryParams = new URLSearchParams();
    if (params.titulo) queryParams.append('titulo', params.titulo);
    if (params.autor) queryParams.append('autor', params.autor);
    if (params.isbn) queryParams.append('isbn', params.isbn);

    const response = await fetch(`${API_URL}/libros/buscar-libro?${queryParams}`);
    if (!response.ok) throw new Error('Error al buscar libros');
    return response.json();
  },

  buscarTodosLibros: async (page: number = 1, limit: number = 10): Promise<LibrosResponse> => {
    const response = await fetch(
      `${API_URL}/libros/buscar-todos-libros?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Error al obtener libros');
    return response.json();
  }
};

// Préstamos actions
export const prestamoActions = {
  crearPrestamo: async (prestamoData: CrearPrestamoData): Promise<Prestamo> => {
    const response = await fetch(`${API_URL}/prestamos/nuevo-prestamo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prestamoData),
    });
    if (!response.ok) throw new Error('Error al crear el préstamo');
    return response.json();
  },

  renovarPrestamo: async (id: string): Promise<Prestamo> => {
    const response = await fetch(`${API_URL}/prestamos/renovar-prestamo/${id}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Error al renovar el préstamo');
    return response.json();
  },

  devolverPrestamo: async (id: string): Promise<Prestamo> => {
    const response = await fetch(`${API_URL}/prestamos/devolver-prestamo/${id}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Error al devolver el préstamo');
    return response.json();
  },

  obtenerTodosPrestamos: async (): Promise<Prestamo[]> => {
    const response = await fetch(`${API_URL}/prestamos/obtener-todos-prestamos`);
    if (!response.ok) throw new Error('Error al obtener préstamos');
    return response.json();
  },

  buscarPrestamos: async (estados?: PrestamoEstado[]): Promise<Prestamo[]> => {
    const queryParams = estados ? `?estados=${estados.join('-')}` : '';
    const response = await fetch(`${API_URL}/prestamos/buscar-prestamos${queryParams}`);
    if (!response.ok) throw new Error('Error al buscar préstamos');
    return response.json();
  }
}; 