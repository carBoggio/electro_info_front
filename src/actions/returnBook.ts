import { basicFetch } from "./BasicFetch";

export interface ReturnBookResponse {
  success: boolean;
  message: string;
}

export const returnBook = async (book_id: string): Promise<ReturnBookResponse> => {
  try {
    const response = await basicFetch("/api/loans/devolver", "POST", { book_id });
    return {
      success: response.success,
      message: response.message || "Préstamo devuelto",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al devolver el préstamo",
    };
  }
}; 