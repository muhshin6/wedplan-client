import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"



export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  fetchOptions: {
    credentials: "include",
  },
  plugins: [
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
export const { signIn, signUp, useSession } = createAuthClient()