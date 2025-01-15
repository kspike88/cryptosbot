"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Wallet } from 'lucide-react'
import { translations } from '@/utils/translations'
import type { Language } from '@/app/types/app'
import { useState, useEffect } from 'react';

export function Navigation() {
  const pathname = usePathname()
  const [language, setLanguage] = useState<Language>('en') // Set default language for initial render

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language
    if (savedLanguage) setLanguage(savedLanguage)
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around p-4 bg-white border-t border-gray-200">
      <Link 
        href="/"
        className={`flex flex-col items-center ${pathname === '/' ? 'text-purple-500' : 'text-gray-600'}`}
      >
        <Wallet className="h-6 w-6" />
        <span className="text-sm">{translations.navigation.assets[language]}</span>
      </Link>
      <Link 
        href="/trading"
        className={`flex flex-col items-center ${pathname === '/trading' ? 'text-purple-500' : 'text-gray-600'}`}
      >
        <BarChart2 className="h-6 w-6" />
        <span className="text-sm">{translations.navigation.trading[language]}</span>
      </Link>
    </div>
  )
}
