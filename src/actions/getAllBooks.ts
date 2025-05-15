import { Libro } from "@/types";
import { LIBROS_LISTA } from "@/actions/mocks";

export const getAllBooks = async (): Promise<Libro[]> => {
  return LIBROS_LISTA;
};