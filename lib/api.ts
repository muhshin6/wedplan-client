export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Obtain a short-lived JWT from Better Auth and attach it as a Bearer token.
// The token is issued from the auth cookie-backed session — the client never
// sees the signing secret and never invents a user id or role.
export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const response = await fetch(`${API_URL}/api/auth/token`, {
      credentials: "include",
    })

    if (!response.ok) return {}

    const result = await response.json()
    const token = result?.token

    if (!token) return {}

    return { Authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = await getAuthHeaders()

  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...headers,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  })
}
