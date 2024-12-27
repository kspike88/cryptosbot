import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./global.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "Real-time cryptocurrency trading dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#ededed] text-white`}>
        {children}
      </body>
    </html>
  )
}

