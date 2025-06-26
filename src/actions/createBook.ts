import { basicFetch } from "./BasicFetch";

export interface CreateBookData {
  id: string;
  name: string;
  author: string;
  campus: string;
}

export interface CreateBookResponse {
  success: boolean;
  message: string;
  book?: {
    id: string;
    name: string;
    author: string;
    campus_id: number;
    campus_name: string;
  };
}

export const createBook = async (bookData: CreateBookData): Promise<CreateBookResponse> => {
  try {
    const data = await basicFetch("/api/books", "POST", bookData);
    
    return {
      success: true,
      message: "Libro creado exitosamente",
      book: data,
    };
  } catch (error) {
    console.error("Error creating book:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error de conexión al crear el libro",
    };
  }
}; 