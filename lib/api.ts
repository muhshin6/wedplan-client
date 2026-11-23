// In the browser, point at this app's own origin so every `/api/...` call is
// proxied to the backend by the rewrite in next.config.ts. That keeps the
// session cookie first-party. On the server (e.g. generateMetadata) there is
// no proxy, so fetch the backend directly.
export const API_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    : window.location.origin

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

// Extract a human-readable message from any failed API response.
// Falls back to status-based defaults so users never see a blank error.
export async function readApiError(
  response: Response,
  fallback = "Something went wrong. Please try again."
): Promise<string> {
  try {
    const result = await response.json()

    if (typeof result?.message === "string" && result.message.trim()) {
      return result.message
    }
  } catch {
    // non-JSON response
  }

  if (response.status === 401) return "Please sign in to continue."
  if (response.status === 403)
    return "You do not have permission for this action."
  if (response.status === 404) return "The requested record was not found."
  if (response.status >= 500)
    return "The server is unavailable. Please try again later."

  return fallback
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
