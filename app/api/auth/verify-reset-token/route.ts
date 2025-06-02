import { verifyPasswordResetToken } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ message: "Token é obrigatório" }, { status: 400 })
    }

    const userId = await verifyPasswordResetToken(token)

    if (!userId) {
      return NextResponse.json({ message: "Token inválido ou expirado" }, { status: 400 })
    }

    return NextResponse.json({ valid: true, userId })
  } catch (error) {
    console.error("Verify reset token error:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
