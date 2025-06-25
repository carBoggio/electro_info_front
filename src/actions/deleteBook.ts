import { basicFetch } from "./BasicFetch";

export interface DeleteBookResponse {
  success: boolean;
  message: string;
}

export const deleteBook = async (bookId: string): Promise<DeleteBookResponse> => {
  try {
    await basicFetch(`/api/books/${bookId}`, "DELETE");
    
    return {
      success: true,
      message: "Libro eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error deleting book:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error de conexión al eliminar el libro",
    };
  }
}; 