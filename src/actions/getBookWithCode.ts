import { Libro } from "@/types";
import { getAllBooks } from "@/actions/getAllBooks";

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

    // Obtener todos los libros disponibles
    const libros = await getAllBooks();
    
    // En un entorno real, esta sería una llamada a la API específica para buscar por código
    // Para esta implementación, simulamos una búsqueda en los libros disponibles
    
    // Normalizamos el código para la búsqueda (eliminar espacios, convertir a minúsculas)
    const normalizedCode = code.trim().toLowerCase();
    
    // Buscar el libro por código (simulado: buscamos por ID o cualquier coincidencia con el código)
    const libroEncontrado = libros.find(libro => 
      libro.id === normalizedCode || 
      (libro.isbn && libro.isbn.toLowerCase() === normalizedCode) ||
      (libro.codigo && libro.codigo.toLowerCase() === normalizedCode)
    );
    
    if (libroEncontrado) {
      return {
        success: true,
        message: `Libro '${libroEncontrado.titulo}' encontrado con éxito`,
        libro: libroEncontrado
      };
    } else {
      // Si no encontramos el libro exacto, simulamos una búsqueda probabilística
      // En un entorno real, esto sería una búsqueda más sofisticada en la base de datos
      
      // Para fines de demostración, si el código tiene al menos 4 caracteres,
      // buscamos cualquier libro que contenga esos caracteres en su ID
      if (normalizedCode.length >= 4) {
        const posibleLibro = libros.find(libro => 
          libro.id.toLowerCase().includes(normalizedCode)
        );
        
        if (posibleLibro) {
          return {
            success: true,
            message: `Posible coincidencia encontrada: '${posibleLibro.titulo}'`,
            libro: posibleLibro
          };
        }
      }
      
      return {
        success: false,
        message: `No se encontró ningún libro con el código '${code}'`
      };
    }
  } catch (error) {
    console.error("Error en getBookByCode:", error);
    return {
      success: false,
      message: "Error al buscar el libro"
    };
  }
};

export default getBookByCode;