'use client'

interface ConfirmTradeModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'buy' | 'sell'
  pair: string
  onConfirm: () => void
}

export function ConfirmTradeModal({
  isOpen,
  onClose,
  type,
  pair,
  onConfirm
}: ConfirmTradeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
      <div className="bg-[#1c1c1c] rounded-t-xl">
        <div className="p-4">
          <h2 className="text-white/80 text-lg mb-4">
            {type === 'buy' ? 'Вы покупаете' : 'Вы продаете'} {pair}
          </h2>
          
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <input
                type="number"
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
            onClick={onConfirm}
            className={`w-full py-4 rounded-lg text-white font-medium ${
              type === 'buy' ? 'bg-emerald-500' : 'bg-[#ef4444]'
            }`}
          >
            {type === 'buy' ? 'Купить' : 'Продать'} {pair}
          </button>
          
          <button
            onClick={onClose}
            className="w-full mt-2 py-4 text-white/60 font-medium"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}
