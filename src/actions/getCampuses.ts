import { basicFetch } from "./BasicFetch";

export interface Campus {
  id: number;
  name: string;
}

export const getCampuses = async (): Promise<Campus[]> => {
    try {
      const response = await basicFetch("/api/campuses", "GET");
      console.log("Respuesta de /api/campuses:", response);
      if (Array.isArray(response)) {
        return response;
      } else if (response && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn("Respuesta inesperada de /api/campuses:", response);
        return [];
      }
    } catch (error) {
      console.error("Error fetching campuses:", error);
      return [];
    }
  };