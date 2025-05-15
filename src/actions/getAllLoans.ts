// getAllLoans.ts

import { Prestamo } from "@/types";
import { PRESTAMOS_BASE } from "./mocks";

export const getAllLoans = async (): Promise<Prestamo[]> => {
   
    return PRESTAMOS_BASE


};

export default getAllLoans;