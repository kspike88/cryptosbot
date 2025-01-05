'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, UTCTimestamp } from 'lightweight-charts'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface TradingModalProps {
  isOpen: boolean
  onClose: () => void
  pair: {
    id: string
    name: string
    base: string
    price: number
    change: number
    icon: string
    bgColor: string
  } | null
  onTransactionComplete: (amount: string) => void
}

export function TradingModal({ isOpen, onClose, pair, onTransactionComplete }: TradingModalProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [candleData, setCandleData] = useState<any[]>([])
  const [showTradePanel, setShowTradePanel] = useState(false)
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    type: 'buy' | 'sell';
    amount: string;
    timestamp: number;
  }>>([])

  useEffect(() => {
    if (!chartContainerRef.current || !pair) return

    const fetchCandleData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${pair.base}USDT&interval=1m&limit=100`
        )
        const data = await response.json()
        const formattedData = data.map((d: any[]) => ({
          time: (d[0] / 1000) as UTCTimestamp,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }))
        setCandleData(formattedData)
      } catch (error) {
        console.error('Error fetching candle data:', error)
      }
    }

    fetchCandleData()
    const interval = setInterval(fetchCandleData, 60000)

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    candlestickSeries.setData(candleData)

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth ?? 400,
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
      clearInterval(interval)
    }
  }, [pair, candleData])

  const handleTrade = () => {
    if (!amount) return
    onTransactionComplete(amount)
    setShowTradePanel(false)
    const newTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: tradeType,
      amount: amount,
      timestamp: Date.now()
    }
    setTransactions(prev => [...prev, newTransaction])
    setAmount('')
  }

  if (!isOpen || !pair) return null

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center">
          <button onClick={onClose} className="text-gray-600">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="ml-4 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${pair.bgColor} overflow-hidden`}>
              <Image
                src={pair.icon}
                alt={pair.name}
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div className="text-[#6b7280]">
              <div className="font-medium">{pair.id}</div>
              <div className="text-sm">
                ${pair.price.toFixed(2)}{' '}
                <span
                  className={pair.change >= 0 ? 'text-green-500' : 'text-[#ef4444]'}
                >
                  {pair.change >= 0 ? '+' : ''}
                  {pair.change.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div ref={chartContainerRef} className="w-full" />

        <div className="flex-1 p-4">
          <div className="p-4 bg-gray-100 rounded-lg flex-1">
            {transactions.length === 0 ? (
              <div className="text-center text-[#6b7280]">
                <div className="mb-2">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>Нет сделок</div>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-3 bg-white rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="text-[#6b7280]">
                        <div>{transaction.type === 'buy' ? 'Покупка' : 'Продажа'}</div>
                        <div className="text-sm">
                          {new Date(transaction.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right text-[#6b7280]">
                        <div>{transaction.amount} USDT</div>
                        <div className="text-sm">${(parseFloat(transaction.amount)).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex p-4 gap-4">
          <button
            onClick={() => {
              setTradeType('buy')
              setShowTradePanel(true)
            }}
            className="flex-1 py-3 rounded-lg text-white font-medium bg-emerald-500"
          >
            Купить
          </button>
          <button
            onClick={() => {
              setTradeType('sell')
              setShowTradePanel(true)
            }}
            className="flex-1 py-3 rounded-lg text-white font-medium bg-[#ef4444]"
          >
            Продать
          </button>
        </div>
<<<<<<< HEAD

        {showTradePanel && (
          <div className="fixed inset-x-0 bottom-0 bg-[#1c1c1c] rounded-t-xl animate-slide-up">
            <div className="p-4">
              <h2 className="text-white/80 text-lg mb-4">
                {tradeType === 'buy' ? 'Вы покупаете' : 'Вы продаете'} {pair.base}
              </h2>

              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-5xl bg-transparent text-white w-full outline-none"
                    placeholder="0"
                  />
                  <span className="text-2xl text-white/60">USDT</span>
                </div>
                <div className="text-sm text-white/60 mt-2">
                  Доступно: 0 USDT
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {['30s', '1m', '5m', '15m', '30m', '1h'].map((time) => (
                  <button
                    key={time}
                    className="px-4 py-2 rounded bg-white/10 text-white/60 hover:bg-white/20"
                  >
                    {time}
                  </button>
                ))}
              </div>

              <button
                onClick={handleTrade}
                className={`w-full py-4 rounded-lg text-white font-medium ${
                  tradeType === 'buy' ? 'bg-emerald-500' : 'bg-[#ef4444]'
                }`}
              >
                {tradeType === 'buy' ? 'Купить' : 'Продать'} {pair.base}
              </button>

              <button
                onClick={() => setShowTradePanel(false)}
                className="w-full mt-2 py-4 text-white/60 font-medium"
              >
                Назад
              </button>
            </div>
          </div>
        )}
=======
        
        <div ref={chartContainerRef} className="w-full h-[calc(100vh-200px)]" />
        
        <div className="p-4 grid grid-cols-2 gap-4 absolute bottom-0 left-0 right-0">
          <button className="py-3 px-6 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-center">
            Купить
          </button>
          <button className="py-3 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-center">
            Продать
          </button>
        </div>
>>>>>>> e18488812e45c3ca6abf25cfc2545794884db9b6
      </div>
    </div>
  )
}

