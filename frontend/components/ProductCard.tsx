'use client'

import { ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import MagicBorderButton from './ui/button'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
}

interface ProductCardProps {
  product: Product
  onBuyNow: () => void
  disabled?: boolean
}

const productGradients: Record<string, string> = {
  '1': 'from-blue-500 to-cyan-500',
  '2': 'from-red-500 to-pink-500',
  '3': 'from-orange-500 to-red-500',
  '4': 'from-green-500 to-teal-500',
  '5': 'from-indigo-500 to-red-500',
  '6': 'from-amber-500 to-orange-500',
  '7': 'from-rose-500 to-pink-500',
  '8': 'from-cyan-500 to-blue-500',
}

export default function ProductCard({ product, onBuyNow, disabled }: ProductCardProps) {
  // Check if image is a file path or emoji
  const isImagePath = product.image.startsWith('/');

  return (
    <div className="bg-black rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10">
      {/* Product Image */}
      <div className={`h-48 bg-gradient-to-br ${productGradients[product.id] || 'from-gray-800 to-gray-900'} flex items-center justify-center relative overflow-hidden`}>
        {isImagePath ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <span className="text-6xl z-10">{product.image}</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Product Info */}
      <div className="p-5 bg-black">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">{product.name}</h3>
          <span className="text-xs px-2.5 py-1 bg-gray-900 text-gray-300 rounded-full border border-gray-800">
            {product.category}
          </span>
        </div>
        
        <p className="text-sm text-gray-400 mb-5 line-clamp-2">{product.description}</p>

        {/* Price and Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Price</span>
            <span className="text-xl font-bold text-white">${product.price.toFixed(2)} <span className="text-sm font-normal text-gray-400">USDC</span></span>
          </div>
          
          <MagicBorderButton
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              onBuyNow();
            }}
            disabled={disabled}
            className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <span className="flex items-center justify-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Now</span>
            </span>
          </MagicBorderButton>
        </div>
      </div>
    </div>
  )
}
