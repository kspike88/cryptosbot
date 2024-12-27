"use client"

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, UTCTimestamp, ISeriesApi, IChartApi } from 'lightweight-charts'

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

interface CandlestickData {
  time: UTCTimestamp
  open: number
  high: number
  low: number
  close: number
}

export function TradingModal({ isOpen, onClose, pair }: TradingModalProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const lastPriceRef = useRef<number>(0)
  const [isChartReady, setIsChartReady] = useState(false)
  
  useEffect(() => {
    if (!chartContainerRef.current || !pair) return

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333333',
      },
      grid: {
        vertLines: { color: '#e5e7eb' },
        horzLines: { color: '#e5e7eb' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#e5e7eb',
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      rightPriceScale: {
        borderColor: '#e5e7eb',
        autoScale: true,
      },
      crosshair: {
        mode: 1,
      },
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries
    lastPriceRef.current = pair.price

    const initialData = generateInitialData(pair.price)
    candlestickSeries.setData(initialData)

    window.addEventListener('resize', handleResize)
    setIsChartReady(true)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
      candlestickSeriesRef.current = null
      setIsChartReady(false)
    }
  }, [pair])

  useEffect(() => {
    if (!isChartReady || !pair) return

    const updateData = () => {
      if (!candlestickSeriesRef.current) return

      const currentTime = Math.floor(Date.now() / 1000) as UTCTimestamp
      const previousPrice = lastPriceRef.current
      const volatility = previousPrice * 0.001 // 0.1% volatility
      const randomChange = (Math.random() - 0.5) * 2 * volatility
      
      const open = previousPrice
      const close = previousPrice + randomChange
      const high = Math.max(open, close) + Math.random() * volatility
      const low = Math.min(open, close) - Math.random() * volatility

      const newData: CandlestickData = {
        time: currentTime,
        open,
        high,
        low,
        close,
      }

      candlestickSeriesRef.current.update(newData)
      lastPriceRef.current = close
    }

    const interval = setInterval(updateData, 1000) // Update every second for smoother animation

    return () => clearInterval(interval)
  }, [isChartReady, pair])

  if (!isOpen || !pair) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg overflow-hidden relative">
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
        
        <div ref={chartContainerRef} className="w-full h-[calc(100vh-200px)]" />
        
        <div className="p-4 grid grid-cols-2 gap-4 absolute bottom-0 left-0 right-0">
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

function generateInitialData(basePrice: number): CandlestickData[] {
  const data: CandlestickData[] = []
  const numberOfPoints = 100 // More points for smoother initial view
  let currentPrice = basePrice
  const volatility = basePrice * 0.001 // 0.1% volatility

  for (let i = 0; i < numberOfPoints; i++) {
    const time = Math.floor(Date.now() / 1000 - (numberOfPoints - i) * 60) as UTCTimestamp
    const randomChange = (Math.random() - 0.5) * 2 * volatility
    const open = currentPrice
    const close = currentPrice + randomChange
    const high = Math.max(open, close) + Math.random() * volatility
    const low = Math.min(open, close) - Math.random() * volatility

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

