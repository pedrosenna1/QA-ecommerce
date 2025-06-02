import { updateUserProfile } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { userId, ...userData } = data

    if (!userId) {
      return NextResponse.json({ message: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const success = await updateUserProfile(userId, userData)

    if (!success) {
      return NextResponse.json({ message: "Falha ao atualizar perfil" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
