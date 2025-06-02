import ProductCard from "@/components/product-card"
import NavigationMenu from "@/components/navigation-menu"
import { products } from "@/lib/products"
import { ExternalLink } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationMenu />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" data-testid="page-title">
            Produtos em Destaque
          </h1>

          {/* Botão para abrir página inicial em nova aba */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Testes de múltiplas abas:</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
              data-testid="open-home-new-tab"
            >
              <span>Nova Aba</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Seção de testes de múltiplas abas */}
        <div className="mt-12 p-6 bg-white rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Área de Testes - Múltiplas Abas</h2>
          <p className="text-gray-600 mb-4">
            Use os links abaixo para testar o comportamento da aplicação em múltiplas abas:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-3 border rounded-md hover:bg-gray-50 transition-colors"
              data-testid="login-new-tab-test"
            >
              <span>Login</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <a
              href="/register"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-3 border rounded-md hover:bg-gray-50 transition-colors"
              data-testid="register-new-tab-test"
            >
              <span>Registro</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <a
              href="/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-3 border rounded-md hover:bg-gray-50 transition-colors"
              data-testid="profile-new-tab-test"
            >
              <span>Perfil</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <a
              href="/checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-3 border rounded-md hover:bg-gray-50 transition-colors"
              data-testid="checkout-new-tab-test"
            >
              <span>Checkout</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-900 mb-2">Cenários de Teste Sugeridos:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Adicione produtos ao carrinho em uma aba e verifique em outra</li>
              <li>• Faça login em uma aba e verifique o estado em outras abas</li>
              <li>• Teste o Bug Mode em múltiplas abas simultaneamente</li>
              <li>• Verifique a sincronização do simulador de API entre abas</li>
              <li>• Teste o checkout em uma aba enquanto navega em outra</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
