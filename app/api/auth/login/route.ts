import { getUserByEmail, verifyPassword } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const user = await getUserByEmail(email)

    if (!user) {
      return NextResponse.json({ message: "Email não encontrado" }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(user, password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Senha incorreta" }, { status: 401 })
    }

    // Don't send the password back to the client
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
