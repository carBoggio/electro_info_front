import { Libro } from "@/types";

// Mock para simular la creación de un préstamo
export const makeLoan = async (
  libro: Libro,
  usuarioId: string,
  duracionDias: number,
  barcode?: string
) => {
  return {
    success: true,
    message: `Préstamo del libro "${libro.titulo}" realizado para el usuario ${usuarioId} por ${duracionDias} días.`,
    libro,
    usuarioId,
    duracionDias,
    barcode,
    fecha: new Date().toISOString(),
  };
};