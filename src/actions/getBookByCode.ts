import { Libro } from "@/types";
import { basicFetch } from "./BasicFetch";

/**
 * Interface para la respuesta de búsqueda de libro por código
 */
interface GetBookByCodeResponse {
  success: boolean;
  message: string;
  libro?: Libro;
}

// Interface para la respuesta del backend
interface BackendBookResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    author: string;
    campus_id: number;
    createdAt: string;
    updatedAt: string;
    Campus: {
      name: string;
    };
  };
}

/**
 * Busca un libro por su código de barras o identificador
 * @param code Código del libro (código de barras, ISBN, o identificador interno) - que es el ID
 * @returns Promise con la respuesta que incluye el libro si se encuentra
 */
export const getBookByCode = async (code: string): Promise<GetBookByCodeResponse> => {
  try {
    // Validar que se proporcionó un código
    if (!code || code.trim() === "") {
      return {
        success: false,
        message: "Debe proporcionar un código válido"
      };
    }

    const response = await basicFetch(`/api/books/${encodeURIComponent(code.trim())}`, 'GET') as BackendBookResponse;
    
    if (!response.success || !response.data) {
      return {
        success: false,
        message: "Libro no encontrado"
      };
    }

    // Mapear la respuesta del backend al formato del frontend
    const libro: Libro = {
      id: response.data.id.toString(),
      codigo: response.data.id.toString(), // Usar el ID como código
      titulo: response.data.name,
      autor: response.data.author,
      isbn: "", // El backend no incluye ISBN
      disponible: true, // Asumir disponible por defecto
      disponibles: 1, // Asumir 1 disponible por defecto
      editorial: undefined,
      anioPublicacion: undefined,
      genero: undefined,
      imagen: undefined,
      descripcion: undefined,
      ubicacion: response.data.Campus.name
    };

    return {
      success: true,
      message: "Libro encontrado exitosamente",
      libro: libro
    };
  } catch (error) {
    console.error("Error en getBookByCode:", error);
    return {
      success: false,
      message: "Error al buscar el libro"
    };
  }
};

export default getBookByCode;