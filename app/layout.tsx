import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BugModeProvider } from "@/context/bug-mode-context"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"
import ApiSimulatorControl from "@/components/api-simulator-control"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QA Testing E-commerce",
  description: "An e-commerce application designed for QA testing practice",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BugModeProvider>
          <AuthProvider>
            <CartProvider>
              <main className="min-h-screen bg-gray-50">{children}</main>
              <ApiSimulatorControl />
            </CartProvider>
          </AuthProvider>
        </BugModeProvider>
      </body>
    </html>
  )
}
