'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, UTCTimestamp } from 'lightweight-charts'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { translations } from '@/utils/translations'
import type { Translations, Language } from '@/app/types/app'

interface Transaction {
  id: string
  type: 'buy' | 'sell'
  amount: string
  timestamp: number
  expiryTime: number
}

const DURATION_MAP = {
  '30s': 30 * 1000,
  '1m': 60 * 1000,
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
}

export default function TradingPairPage() {
  const params = useParams()
  const pairId = decodeURIComponent(params.pair as string)

  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [candleData, setCandleData] = useState<any[]>([])
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [pair, setPair] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showTradeMenu, setShowTradeMenu] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState('30s')
  const [language, setLanguage] = useState<Language>('ru')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language
    setLanguage(savedLanguage || 'ru')
  }, [])

  useEffect(() => {
    // Clean expired transactions
    const interval = setInterval(() => {
      const now = Date.now()
      setTransactions(prev => prev.filter(t => t.expiryTime > now))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Fetch pair data
    const fetchPair = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr')
        const data = await response.json()
        const binancePair = data.find((p: any) => p.symbol === pairId.split('/')[0] + 'USDT')
        if (binancePair) {
          setPair({
            id: pairId,
            name: pairId.split('/')[0],
            base: pairId.split('/')[0],
            price: parseFloat(binancePair.lastPrice),
            change: parseFloat(binancePair.priceChangePercent),
            icon: `https://s2.coinmarketcap.com/static/img/coins/64x64/1.png`,
            bgColor: 'bg-white'
          })
        }
      } catch (error) {
        console.error('Error fetching pair data:', error)
      }
    }
    fetchPair()
  }, [pairId])

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
    const now = Date.now()
    const duration = DURATION_MAP[selectedDuration as keyof typeof DURATION_MAP]
    const newTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: tradeType,
      amount: amount,
      timestamp: now,
      expiryTime: now + duration
    }
    setTransactions(prev => [newTransaction, ...prev])
    setAmount('')
  }

  const getTranslation = (key: keyof Translations) => {
    return translations[key]?.[language] || key
  }

  if (!pair) return null

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex items-center bg-white sticky top-0 z-10">
          <Link href="/trading" className="text-gray-600">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="ml-4 text-[#6b7280]">
            <div className="font-medium">
              {tradeType === 'buy' ? getTranslation('buyingBTC') : getTranslation('sellingBTC')}
            </div>
          </div>
        </div>

        <div ref={chartContainerRef} className="w-full" />

        <div className="flex-1 p-4 overflow-hidden">
          <div className="p-4 bg-gray-50 rounded-lg h-full overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="text-center text-[#6b7280]">
                <div className="mb-2">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>{getTranslation('noDeals')}</div>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-3 bg-white rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="text-[#6b7280]">
                        <div>{transaction.type === 'buy' ? getTranslation('buy') : getTranslation('sell')}</div>
                        <div className="text-sm">
                          {new Date(transaction.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right text-[#6b7280]">
                        <div>{transaction.amount} USDT</div>
                        <div className="text-sm">
                          {Math.max(0, Math.ceil((transaction.expiryTime - Date.now()) / 1000))}s
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setTradeType('buy')
                setShowTradeMenu(true)
              }}
              className="flex-1 py-3 rounded-lg text-white font-medium bg-emerald-500"
            >
              {getTranslation('buy')}
            </button>
            <button
              onClick={() => {
                setTradeType('sell')
                setShowTradeMenu(true)
              }}
              className="flex-1 py-3 rounded-lg text-white font-medium bg-[#ef4444]"
            >
              {getTranslation('sell')}
            </button>
          </div>

          {showTradeMenu && (
            <div className="fixed inset-0 bg-white z-50">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center">
                  <button onClick={() => setShowTradeMenu(false)} className="text-gray-600">
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  <div className="ml-4 text-[#6b7280]">
                    <div className="font-medium">
                      {tradeType === 'buy' ? getTranslation('buyingBTC') : getTranslation('sellingBTC')}
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-6xl bg-transparent text-[#1c1c1c] w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                      <span className="text-3xl text-gray-400">USDT</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      {getTranslation('available')}: 0 USDT
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    {Object.keys(DURATION_MAP).map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedDuration(time)}
                        className={`px-4 py-2 rounded whitespace-nowrap ${
                          selectedDuration === time 
                            ? 'bg-gray-200 text-gray-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t">
                  <button
                    onClick={() => {
                      handleTrade()
                      setShowTradeMenu(false)
                    }}
                    className={`w-full py-4 rounded-lg text-white font-medium ${
                      tradeType === 'buy' ? 'bg-emerald-500' : 'bg-[#ef4444]'
                    }`}
                  >
                    {tradeType === 'buy' 
                      ? `${getTranslation('buy')} ${pair?.base}`
                      : `${getTranslation('sell')} ${pair?.base}`
                    }
                  </button>
                  
                  <button
                    onClick={() => setShowTradeMenu(false)}
                    className="w-full mt-2 py-4 text-gray-600 font-medium"
                  >
                    {getTranslation('back')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

