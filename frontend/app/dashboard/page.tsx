'use client'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  useUserCreditInfo,
  useHasActiveLoan
} from '@/hooks/useContracts'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import TrustScoreCard from '@/components/TrustScoreCard'
import CreditScoreBreakdown from '@/components/CreditScoreBreakdown'
import ActiveLoanCard from '@/components/ActiveLoanCard'
import { 
  ShoppingBag, 
  ArrowRight,
  Wallet,
  CreditCard,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const isAdmin = useIsAdmin()
  
  const { data: creditInfo } = useUserCreditInfo(address)
  const { data: hasActiveLoan = false } = useHasActiveLoan(address)

  // Parse credit info: [score, totalScore, walletBonus, zkBoost, creditLimit]
  const creditData = creditInfo as readonly [bigint, bigint, bigint, bigint, bigint] | undefined
  const totalScore = creditData ? Number(creditData[1]) : 0
  const creditLimit = creditData ? Number(creditData[4]) : 0

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (isConnected && isAdmin) {
      router.push('/admin/dashboard')
    }
  }, [isConnected, isAdmin, router])

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-6 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Connect Your Wallet</h1>
          <p className="text-gray-600 max-w-sm">Please connect your wallet to view your dashboard and start building your Web3 credit score</p>
          <ConnectButton />
        </div>
      </div>
    )
  }

  const formattedCreditLimit = creditLimit / 1e6

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome Back! 👋
            </h1>
            <p className="text-gray-600 mt-1 flex items-center space-x-2">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/shop"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Shop Now</span>
            </Link>
            <Link
              href="/zkproof"
              className="flex items-center space-x-2 px-4 py-2 border-2 border-purple-300 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all"
            >
              <Zap className="w-5 h-5" />
              <span>ZK Boost</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Trust Score</p>
                <p className="text-3xl font-bold text-gray-900">{totalScore}</p>
                <p className="text-xs text-gray-400">/ 190 max</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Credit Limit</p>
                <p className="text-3xl font-bold text-green-600">${formattedCreditLimit.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${hasActiveLoan ? 'bg-orange-100' : 'bg-gray-100'}`}>
                <ShoppingBag className={`w-6 h-6 ${hasActiveLoan ? 'text-orange-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Status</p>
                <p className={`text-lg font-bold ${hasActiveLoan ? 'text-orange-600' : 'text-gray-400'}`}>
                  {hasActiveLoan ? 'Active Loan' : 'No Active Loan'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Credit Score Breakdown - Takes 2 columns */}
          <div className="lg:col-span-2">
            <CreditScoreBreakdown />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Active Loan or Shop CTA */}
            {hasActiveLoan ? (
              <ActiveLoanCard />
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Ready to Shop?</h3>
                  <p className="text-gray-600">
                    You have <span className="font-bold text-blue-600">${formattedCreditLimit.toFixed(2)} USDC</span> credit available!
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center w-full space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <span>Browse Shop</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Trust Score Card */}
            <TrustScoreCard />
          </div>
        </div>

        {/* Credit Building Tips */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Zap className="w-6 h-6" />
            <span>Tips to Build Credit Faster</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
              <p className="font-semibold mb-1">💰 Pay Early</p>
              <p className="text-sm opacity-90">Repay 7+ days before due date for +15 points instead of +10</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
              <p className="font-semibold mb-1">🔐 Submit ZK Proof</p>
              <p className="text-sm opacity-90">Verify your balance privately and earn up to +30 bonus points</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
              <p className="font-semibold mb-1">📈 Stay Consistent</p>
              <p className="text-sm opacity-90">Regular on-time payments build your score faster</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
