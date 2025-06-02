import { createPasswordResetToken, getUserByEmail } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email é obrigatório" }, { status: 400 })
    }

    // Check if user exists
    const user = await getUserByEmail(email)

    // For security reasons, always return success even if the email doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      // In a real app, we would log this or handle it differently
      return NextResponse.json({ success: true })
    }

    // Create password reset token
    const token = await createPasswordResetToken(email)

    if (!token) {
      return NextResponse.json({ message: "Erro ao criar token de redefinição" }, { status: 500 })
    }

    // In a real app, we would send an email with the reset link
    // For this demo, we'll just return the token in the response
    const resetLink = `${request.headers.get("origin")}/reset-password/${token}`

    // Log the reset link for testing purposes
    console.log("Password reset link:", resetLink)

    return NextResponse.json({
      success: true,
      // Only include the resetLink in development for testing
      ...(process.env.NODE_ENV === "development" && { resetLink }),
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
