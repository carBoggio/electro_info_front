export async function basicFetch(url: string, method: "GET" | "POST" | "DELETE", body?: any) {
  const baseUrl = import.meta.env.VITE_BASE_URL || "";
  const fullUrl = `${baseUrl}${url}`;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method === "POST" && body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.statusText}`);
  }

  return response.json();
}