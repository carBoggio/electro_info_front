import { Libro } from "@/types";
import { basicFetch } from "./BasicFetch";

export const getAllBooks = async (): Promise<Libro[]> => {
  try {
    const response = await basicFetch('/api/libros', 'GET');
    return response as Libro[];
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    throw error;
  }
};