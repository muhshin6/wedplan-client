import { Inter, Playfair_Display } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer/page"
import { Toaster } from "sonner"
import { MotionConfig } from "framer-motion"
import type { Metadata } from "next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: {
    default: "WedPlan | Wedding Planning Platform",
    template: "%s | WedPlan",
  },
  description:
    "Find the best wedding photographers, videographers, venues, and wedding services with WedPlan.",
  keywords: [
    "WedPlan",
    "Wedding Planner",
    "Wedding Services",
    "Wedding Photographer",
    "Wedding Videographer",
    "Wedding Venues",
  ],
  authors: [{ name: "WedPlan" }],
  creator: "WedPlan",
  metadataBase: new URL("https://your-domain.vercel.app"),
  openGraph: {
    title: "WedPlan | Wedding Planning Platform",
    description:
      "Discover trusted wedding vendors and plan your dream wedding with WedPlan.",
    siteName: "WedPlan",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        inter.variable,
        playfair.variable,
        "font-sans"
      )}
    >
      <body>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <Navbar />
            {children}
            <Footer />
          </MotionConfig>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
