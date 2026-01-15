'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useCreditLimit, useHasActiveLoan } from '@/hooks/useContracts'
import ProductCard from '@/components/ProductCard'
import CheckoutModal from '@/components/CheckoutModal'
import { ShoppingBag, Search, Filter, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Sample products - in real app would come from backend/IPFS
const products = [
  {
    id: '1',
    name: 'Digital Artwork NFT',
    description: 'Exclusive digital art piece by emerging Web3 artist',
    price: 0.99,
    image: '🎨',
    category: 'Art',
  },
  {
    id: '2',
    name: 'Premium Domain Name',
    description: 'Short, memorable .eth domain for your identity',
    price: 1.49,
    image: '🌐',
    category: 'Domains',
  },
  {
    id: '3',
    name: 'Music Album Access',
    description: 'Lifetime access to exclusive album collection',
    price: 1.99,
    image: '🎵',
    category: 'Music',
  },
  {
    id: '4',
    name: 'Gaming Skin Bundle',
    description: 'Rare skins for popular blockchain games',
    price: 2.49,
    image: '🎮',
    category: 'Gaming',
  },
  {
    id: '5',
    name: 'Course Access Pass',
    description: 'Full Web3 development bootcamp access',
    price: 2.99,
    image: '📚',
    category: 'Education',
  },
  {
    id: '6',
    name: 'Coffee Subscription',
    description: 'One month of premium coffee delivery',
    price: 1.29,
    image: '☕',
    category: 'Lifestyle',
  },
  {
    id: '7',
    name: 'VIP Event Ticket',
    description: 'Access to exclusive Web3 conference',
    price: 2.79,
    image: '🎟️',
    category: 'Events',
  },
  {
    id: '8',
    name: 'E-Book Bundle',
    description: 'Collection of crypto and blockchain books',
    price: 0.79,
    image: '📖',
    category: 'Education',
  },
]

const categories = ['All', 'Art', 'Domains', 'Music', 'Gaming', 'Education', 'Lifestyle', 'Events']

export default function ShopPage() {
  const { address, isConnected } = useAccount()
  const { data: creditLimit = BigInt(0) } = useCreditLimit(address)
  const { data: hasActiveLoan = false } = useHasActiveLoan(address)
  
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const formattedCreditLimit = Number(creditLimit) / 1e6

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleBuyNow = (product: typeof products[0]) => {
    setSelectedProduct(product)
    setIsCheckoutOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <ShoppingBag className="w-8 h-8" />
              <span>Shop</span>
            </h1>
            <p className="text-gray-600 mt-1">Browse products and buy now, pay later</p>
          </div>

          {isConnected && (
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Available Credit</p>
              <p className="text-xl font-bold text-blue-600">${formattedCreditLimit.toFixed(2)} USDC</p>
            </div>
          )}
        </div>

        {/* Active Loan Warning */}
        {hasActiveLoan && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">You have an active loan</p>
              <p className="text-sm text-yellow-700">
                Please repay your current loan before making a new purchase.{' '}
                <Link href="/repay" className="underline font-medium">Go to Repay</Link>
              </p>
            </div>
          </div>
        )}

        {/* Not Connected Warning */}
        {!isConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-blue-800 mb-2">Connect your wallet to shop</h3>
            <p className="text-sm text-blue-600 mb-4">You need to connect your wallet to use Buy Now, Pay Later</p>
            <ConnectButton />
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuyNow={() => handleBuyNow(product)}
              disabled={hasActiveLoan || !isConnected || product.price > formattedCreditLimit}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your criteria</p>
          </div>
        )}

        {/* Checkout Modal */}
        {selectedProduct && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => {
              setIsCheckoutOpen(false)
              setSelectedProduct(null)
            }}
            product={selectedProduct}
          />
        )}
      </div>
    </div>
  )
}
