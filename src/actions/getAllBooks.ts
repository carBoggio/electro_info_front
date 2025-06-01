import { Libro } from "@/types";
import { basicFetch } from "./BasicFetch";

// Interface para la respuesta del backend
interface BackendBook {
  id: number;
  name: string;
  author: string;
  campus_id: number;
  createdAt: string;
  updatedAt: string;
  Campus: {
    name: string;
  };
}

interface BackendBooksResponse {
  success: boolean;
  count: number;
  data: BackendBook[];
}

export const getAllBooks = async (): Promise<Libro[]> => {
  try {
    const response = await basicFetch('/api/books', 'GET') as BackendBooksResponse;
    
    if (!response.success || !response.data) {
      return [];
    }

    // Mapear todos los libros al formato del frontend
    const libros = response.data.map(book => {
      const libro: Libro = {
        id: book.id.toString(),
        codigo: book.id.toString(), // Usar el ID como código
        titulo: book.name,
        autor: book.author,
        isbn: "", // El backend no incluye ISBN
        disponible: true, // Asumir disponible por defecto
        disponibles: 1, // Asumir 1 disponible por defecto (se podría calcular después)
        editorial: undefined,
        anioPublicacion: undefined,
        genero: undefined,
        imagen: undefined,
        descripcion: undefined,
        ubicacion: book.Campus?.name || "Ubicación no especificada"
      };

      return libro;
    });

    return libros;
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    return [];
  }
};