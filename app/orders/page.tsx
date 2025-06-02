"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Loader2, ShoppingBag, Package } from "lucide-react"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: OrderItem[]
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Fetch orders when user is loaded
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      setLoadingOrders(true)
      try {
        const response = await fetch(`/api/auth/orders?userId=${user.id}`)
        const data = await response.json()

        if (response.ok) {
          setOrders(data.orders)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoadingOrders(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  if (isLoading || loadingOrders) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Carregando...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8" data-testid="orders-title">
        Meus Pedidos
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Você ainda não tem pedidos</h2>
          <p className="text-gray-500 mb-6">Comece a comprar para ver seus pedidos aqui.</p>
          <Link href="/">
            <Button>Explorar Produtos</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg border shadow-sm" data-testid={`order-${order.id}`}>
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Pedido #{order.id}</h2>
                  <p className="text-gray-500">Realizado em {new Date(order.date).toLocaleDateString("pt-BR")}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "Entregue" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2">
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <span>
                        {item.name} <span className="text-gray-500">x{item.quantity}</span>
                      </span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" id={`track-order-${order.id}`}>
                  Rastrear Pedido
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
