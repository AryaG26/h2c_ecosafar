export const apiClient = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error("API request failed");
    }
    return response.json();
  };
  