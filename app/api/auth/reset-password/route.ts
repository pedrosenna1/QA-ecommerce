import { verifyPasswordResetToken, resetPassword } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ message: "Token e senha são obrigatórios" }, { status: 400 })
    }

    // Verify token and get user ID
    const userId = await verifyPasswordResetToken(token)

    if (!userId) {
      return NextResponse.json({ message: "Token inválido ou expirado" }, { status: 400 })
    }

    // Reset password
    const success = await resetPassword(userId, password)

    if (!success) {
      return NextResponse.json({ message: "Erro ao redefinir senha" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
