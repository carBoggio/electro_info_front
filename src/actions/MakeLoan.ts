import { Libro } from "@/types";
import { basicFetch } from "./BasicFetch";

interface MakeLoanRequest {
  barcode: string;
  usuarioId: string;
  duracionDias: number;

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

  usuarioId: string,
  duracionDias: number,
  barcode: string
): Promise<MakeLoanResponse> => {
  try {
    const request: MakeLoanRequest = {
      barcode,
      usuarioId,
      duracionDias
    };

    const response = await basicFetch('/api/loans', 'POST', request);
    return response as MakeLoanResponse;
  } catch (error) {
    console.error("Error al crear el préstamo:", error);
    throw error;
  }
};