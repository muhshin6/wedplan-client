"use client"

import { AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#DDF2FD",
            fontFamily: "sans-serif",
            padding: "24px",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "100%",
              background: "#fff",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <AlertTriangle size={40} color="#dc2626" />
            <h1
              style={{ color: "#164863", fontSize: "24px", marginTop: "20px" }}
            >
              Something went wrong
            </h1>
            <p
              style={{ color: "#427D9D", fontSize: "14px", marginTop: "12px" }}
            >
              The application hit an unexpected error. Please try again.
            </p>
            {error.message && (
              <p
                style={{
                  marginTop: "12px",
                  padding: "10px",
                  background: "#fef2f2",
                  color: "#dc2626",
                  fontSize: "12px",
                  borderRadius: "8px",
                }}
              >
                {error.message}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                marginTop: "24px",
                background: "#164863",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
