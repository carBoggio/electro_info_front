import { basicFetch } from "./BasicFetch";

interface Request {
  id: number;
  borrower_id: string;
  devolution_date: string;
}

interface GetInterestedUsersResponse {
  success: boolean;
  data?: Request[];
  message?: string;
}

export async function getInterestedUsers(): Promise<GetInterestedUsersResponse> {
  try {
    const response = await basicFetch('/api/requests', 'GET');
    return response as GetInterestedUsersResponse;
  } catch (error) {
    console.error("Error al obtener usuarios interesados:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error al obtener usuarios interesados"
    };
  }
} 