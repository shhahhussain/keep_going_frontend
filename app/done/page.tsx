"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DonePage() {
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    // Auto-confirm after 2 seconds
    const timer = setTimeout(() => {
      setConfirmed(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        {!confirmed ? (
          <div className="animate-pulse">
            <CheckCircle className="h-24 w-24 text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl font-black mb-4 text-red-400 font-impact">CHECKING IN...</h1>
            <p className="text-white font-bold">Confirming your progress...</p>
          </div>
        ) : (
          <div>
            <CheckCircle className="h-24 w-24 text-red-500 mx-auto mb-6" />
            <h1 className="text-5xl font-black mb-4 text-red-400 font-impact">DONE!</h1>
            <p className="text-xl font-bold text-white mb-8">You showed up. That's what matters.</p>
            <p className="text-white font-bold mb-8">Keep this momentum going. The grind never stops.</p>

            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-black text-lg px-8 py-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                BACK TO REMINDERS
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
