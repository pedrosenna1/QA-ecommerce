"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useBugMode } from "@/context/bug-mode-context"
import { products } from "@/lib/products"
import { ArrowLeft, ExternalLink, Share2 } from "lucide-react"
import NavigationMenu from "@/components/navigation-menu"

export default function ProductPage() {
  const params = useParams()
  const productId = Number(params.id)
  const { addToCart } = useCart()
  const { bugMode } = useBugMode()

  const product = products.find((p) => p.id === productId)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationMenu />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (bugMode && productId % 2 === 0) {
      // In bug mode, some products add twice
      addToCart(product)
      addToCart(product)
      return
    }

    addToCart(product)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationMenu />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900"
          data-testid="back-to-home"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-96 w-full">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
              id="product-image"
            />
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold" data-testid="product-title">
                {bugMode && productId % 5 === 0 ? product.name.toUpperCase() : product.name}
              </h1>

              {/* Botões de compartilhamento e nova aba */}
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href={`/product/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  title="Abrir em nova aba"
                  data-testid="product-new-tab"
                >
                  <ExternalLink className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: product.description,
                        url: window.location.href,
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      alert("Link copiado para a área de transferência!")
                    }
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  title="Compartilhar produto"
                  data-testid="share-product"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <p className="text-2xl font-semibold mb-4" id="product-price">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="space-y-4">
              <Button onClick={handleAddToCart} size="lg" className="w-full md:w-auto" data-testid="add-to-cart-button">
                Add to Cart
              </Button>

              {/* Links para testes de múltiplas abas */}
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/cart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                  data-testid="view-cart-new-tab"
                >
                  <span>Ver Carrinho</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  data-testid="continue-shopping-new-tab"
                >
                  <span>Continuar Comprando</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos relacionados com opção de nova aba */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter((p) => p.id !== productId && p.category === product.category)
              .slice(0, 4)
              .map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-32 w-full">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <Link href={`/product/${relatedProduct.id}`}>
                        <h3 className="font-medium text-sm">{relatedProduct.name}</h3>
                      </Link>
                      <Link
                        href={`/product/${relatedProduct.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Abrir em nova aba"
                        data-testid={`related-product-new-tab-${relatedProduct.id}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                    <p className="text-gray-600 text-sm">${relatedProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
