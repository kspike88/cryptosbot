"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Wallet } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()
  
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around p-4 bg-white border-t border-gray-200">
      <Link 
        href="/"
        className={`flex flex-col items-center ${pathname === '/' ? 'text-blue-500' : 'text-gray-600'}`}
      >
        <Wallet className="h-6 w-6" />
        <span className="text-sm ">Активы</span>
      </Link>
      <Link 
        href="/trading"
        className={`flex flex-col items-center ${pathname === '/trading' ? 'text-blue-500' : 'text-gray-600'}`}
      >
        <BarChart2 className="h-6 w-6" />
        <span className="text-sm">Торговля</span>
      </Link>
    </div>
  )
}

