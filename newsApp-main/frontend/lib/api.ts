// Base API configuration
const API_BASE_URL = "http://localhost:5000/api"

// Helper function for making authenticated requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "An error occurred")
  }

  return response.json()
}

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    return fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  },
}

// News API
export const newsApi = {
  getAllNews: () => fetchWithAuth("/news"),

  getNewsById: (id: string) => fetchWithAuth(`/news/${id}`),

  getNewsByCategory: (categoryId: string) => fetchWithAuth(`/news/category/${categoryId}`),

  createNews: (newsData: {
    title: string
    description: string
    image?: string
    category_id: number
  }) =>
    fetchWithAuth("/news", {
      method: "POST",
      body: JSON.stringify(newsData),
    }),

  updateNews: (
    id: string,
    newsData: {
      title?: string
      description?: string
      image?: string
      category_id?: number
    },
  ) =>
    fetchWithAuth(`/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(newsData),
    }),

  deleteNews: (id: string) =>
    fetchWithAuth(`/news/${id}`, {
      method: "DELETE",
    }),
}

// Category API
export const categoryApi = {
  getAllCategories: () => fetchWithAuth("/categories"),

  createCategory: (title: string) =>
    fetchWithAuth("/categories", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  updateCategory: (id: string, title: string) =>
    fetchWithAuth(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title }),
    }),

  deleteCategory: (id: string) =>
    fetchWithAuth(`/categories/${id}`, {
      method: "DELETE",
    }),
}
