'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { Transaction } from '@/app/types/trading'

interface TradeModalProps {
  isOpen: boolean
  onClose: () => void
  pair: {
    id: string
    name: string
    base: string
    price: number
  } | null
  type: 'buy' | 'sell'
}

export function TradeModal({ isOpen, onClose, pair, type }: TradeModalProps) {
  const [amount, setAmount] = useState<string>('0')
  const [timeFrame, setTimeFrame] = useState<string>('30s')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active')

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  const handleTrade = () => {
    if (!pair || !amount || parseFloat(amount) <= 0) return

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      pair: pair.id,
      amount: parseFloat(amount),
      price: pair.price,
      total: parseFloat(amount) * pair.price,
      timestamp: Date.now(),
    }

    const updatedTransactions = [...transactions, newTransaction]
    setTransactions(updatedTransactions)
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions))
    setAmount('0')
  }

  if (!isOpen || !pair) return null

  return (
    <div className="fixed inset-0 bg-gray-900/90 z-50">
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center border-b border-gray-800">
          <button onClick={onClose} className="text-gray-400">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="ml-4 text-white text-lg">
            {type === 'buy' ? 'Вы покупаете' : 'Вы продаете'} {pair.base}
          </h2>
        </div>

        <div className="flex-1 p-4">
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-5xl bg-transparent text-white w-full outline-none"
                placeholder="0"
              />
              <span className="text-2xl text-gray-400">USDT</span>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Доступно: 0 USDT
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {['30s', '1m', '5m', '15m', '30m', '1h'].map((time) => (
              <button
                key={time}
                onClick={() => setTimeFrame(time)}
                className={`px-4 py-2 rounded ${
                  timeFrame === time
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <div className="p-4 border-t border-gray-800">
            <div className="flex justify-between mb-4">
              <button
                onClick={() => setActiveTab('active')}
                className={`text-sm ${
                  activeTab === 'active' ? 'text-white' : 'text-gray-400'
                }`}
              >
                Активные
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`text-sm ${
                  activeTab === 'all' ? 'text-white' : 'text-gray-400'
                }`}
              >
                Все
              </button>
            </div>

            <div className="min-h-[100px] flex items-center justify-center text-gray-400">
              {transactions.length === 0 ? (
                <div className="text-center">
                  <div className="mb-2">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>Нет сделок</div>
                </div>
              ) : (
                <div className="w-full space-y-2">
                  {transactions
                    .filter((t) => t.pair === pair.id)
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center p-2 rounded bg-gray-800"
                      >
                        <div>
                          <div className="text-white">
                            {transaction.type === 'buy' ? 'Покупка' : 'Продажа'}{' '}
                            {pair.base}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white">
                            {transaction.amount.toFixed(8)} {pair.base}
                          </div>
                          <div className="text-sm text-gray-400">
                            {transaction.total.toFixed(2)} USDT
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleTrade}
            className={`w-full p-4 text-white text-lg font-medium ${
              type === 'buy' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {type === 'buy' ? 'Купить' : 'Продать'} {pair.base}
          </button>
        </div>
      </div>
    </div>
  )
}

