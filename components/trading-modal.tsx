"use client"

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, UTCTimestamp, ISeriesApi } from 'lightweight-charts'

interface TradingModalProps {
  isOpen: boolean
  onClose: () => void
  pair: {
    id: string
    name: string
    price: number
    change: number
    icon: React.ReactNode
    bgColor: string
  } | null
}

export function TradingModal({ isOpen, onClose, pair }: TradingModalProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [candlestickSeries, setCandlestickSeries] = useState<ISeriesApi<"Candlestick">>()
  
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chartInstance = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333333',
      },
      grid: {
        vertLines: { color: '#e5e7eb' },
        horzLines: { color: '#e5e7eb' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#e5e7eb',
      },
      rightPriceScale: {
        borderColor: '#e5e7eb',
      },
    })

    const candlestickSeriesInstance = chartInstance.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    // Chart instance created
    setCandlestickSeries(candlestickSeriesInstance)

    const initialData = generateInitialData(pair?.price || 0)
    candlestickSeriesInstance.setData(initialData)

    return () => {
      chartInstance.remove()
    }
  }, [pair, candlestickSeries])

  useEffect(() => {
    if (!candlestickSeries || !pair) return

    const updateData = () => {
      const currentTime = Math.floor(Date.now() / 1000) as UTCTimestamp
      const basePrice = pair.price
      const randomChange = (Math.random() - 0.5) * 2
      const open = basePrice
      const close = basePrice + randomChange
      const high = Math.max(open, close) + Math.random()
      const low = Math.min(open, close) - Math.random()

      candlestickSeries.update({
        time: currentTime,
        open,
        high,
        low,
        close,
      })
    }

    const interval = setInterval(updateData, 10000)
    updateData()

    return () => clearInterval(interval)
  }, [candlestickSeries, pair])

  if (!isOpen || !pair) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-10 z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${pair.bgColor} rounded-full flex items-center justify-center text-white`}>
              {pair.icon}
            </div>
            <div>
              <div className="text-lg font-medium text-gray-900">{pair.id}</div>
              <div className="text-gray-600">
                {pair.price.toFixed(2)}
                <span className={`ml-2 ${pair.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
        
        <div ref={chartContainerRef} />
        
        <div className="p-4 grid grid-cols-2 gap-4">
          <button className="py-3 px-6 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-center">
            Купить
          </button>
          <button className="py-3 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-center">
            Продать
          </button>
        </div>
      </div>
    </div>
  )
}

function generateInitialData(basePrice: number) {
  const data = []
  const numberOfPoints = 50
  let currentPrice = basePrice

  for (let i = 0; i < numberOfPoints; i++) {
    const time = Math.floor(Date.now() / 1000 - (numberOfPoints - i) * 60) as UTCTimestamp
    const randomChange = (Math.random() - 0.5) * 2
    const open = currentPrice
    const close = currentPrice + randomChange
    const high = Math.max(open, close) + Math.random()
    const low = Math.min(open, close) - Math.random()

    data.push({
      time,
      open,
      high,
      low,
      close,
    })

    currentPrice = close
  }

  return data
}

