import { Libro } from "@/types";
import { basicFetch } from "./BasicFetch";

interface MakeLoanRequest {
  libroId: string;
  usuarioId: string;
  duracionDias: number;
  barcode?: string;
}

interface MakeLoanResponse {
  success: boolean;
  message: string;
  libro: Libro;
  usuarioId: string;
  duracionDias: number;
  barcode?: string;
  fecha: string;
}

export const makeLoan = async (
  libro: Libro,
  usuarioId: string,
  duracionDias: number,
  barcode?: string
): Promise<MakeLoanResponse> => {
  try {
    const request: MakeLoanRequest = {
      libroId: libro.id,
      usuarioId,
      duracionDias,
      barcode
    };

    const response = await basicFetch('/api/prestamos', 'POST', request);
    return response as MakeLoanResponse;
  } catch (error) {
    console.error("Error al crear el préstamo:", error);
    throw error;
  }
};