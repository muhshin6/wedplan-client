import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  // No baseURL: requests use relative `/api/auth` paths and are proxied to
  // the backend by the rewrite in next.config.ts. The session cookie is then
  // first-party on this app's origin.
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
        businessName: {
          type: "string",
          required: false,
        },
        role: {
          type: "string",
          required: false,
          input: false,
        },
        plan: {
          type: "string",
          required: false,
          input: false,
        },
      },
    }),
  ],
})
