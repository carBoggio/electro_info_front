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

/**
 * Busca un libro por su código de barras o identificador
 * @param code Código del libro (código de barras, ISBN, o identificador interno)
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

    const response = await basicFetch(`/api/libros/codigo/${encodeURIComponent(code.trim())}`, 'GET');
    return response as GetBookByCodeResponse;
  } catch (error) {
    console.error("Error en getBookByCode:", error);
    return {
      success: false,
      message: "Error al buscar el libro"
    };
  }
};

export default getBookByCode;