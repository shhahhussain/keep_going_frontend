"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Smartphone, Skull } from "lucide-react"
import { isValidPhoneNumber } from "libphonenumber-js"

interface MainAppProps {
  token: string;
  setToken: (token: string | null) => void;
}

export default function MainApp({ token, setToken }: MainAppProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [channel, setChannel] = useState<"whatsapp">("whatsapp")
  const [isValid, setIsValid] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState("")
  const [waitlistPhone, setWaitlistPhone] = useState("")
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    setIsValid(isValidPhoneNumber(phoneNumber))
  }, [phoneNumber])

  useEffect(() => {
    const saved = localStorage.getItem("keep_going_phone_number")
    if (saved) router.push("/dashboard")
  }, [router])

  useEffect(() => {
    fetch("http://localhost:5000/brutal_waitlist_count")
      .then(res => res.json())
      .then(data => setWaitlistCount(data.count))
  }, [])

  const handleSignIn = async () => {
    const trimmed = phoneNumber.trim()
    if (!isValidPhoneNumber(trimmed)) return

    localStorage.setItem("keep_going_phone_number", trimmed)
    localStorage.setItem("keep_going_channel", channel)

    let exists = false
    try {
      const res = await fetch(`http://localhost:5000/status?phone_number=${encodeURIComponent(trimmed)}`)
      exists = res.status === 200
    } catch {}

    if (!exists) {
      await fetch("http://localhost:5000/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: trimmed,
          messages: ["You've survived 100% of your worst days. Keep that streak alive."],
          interval: 60,
          brutal_mode: false,
          brutal_messages: [],
          channel,
        }),
      })
    }

    router.push("/dashboard")
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch("http://localhost:5000/brutal_waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: waitlistEmail, phone: waitlistPhone }),
    })

    setWaitlistSubmitted(true)

    fetch("http://localhost:5000/brutal_waitlist_count")
      .then(res => res.json())
      .then(data => setWaitlistCount(data.count))
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto text-center">
        {/* Header */}
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-2 text-red-500 font-impact">KEEP</h1>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 font-impact">GOING</h1>

        {/* Description */}
        <p className="text-lg md:text-xl font-bold text-white mb-8">
          Enter your phone number to start or manage your reminders.
        </p>

        {/* Sign-In Section */}
        <div className="flex flex-col gap-4 w-full mb-10">
          <Input
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            className="rounded px-3 py-2 bg-black border border-white text-white"
          />

          {/* Channel Toggle */}
          <div className="flex gap-2">
            <Button
              onClick={() => setChannel("whatsapp")}
              className={`flex-1 font-bold ${channel === "whatsapp" ? "bg-red-600 hover:bg-red-700" : "bg-white hover:bg-red-700"}`}
            >
              WhatsApp
            </Button>
            {/*
            <Button
              onClick={() => setChannel("sms")}
              className={`flex-1 font-bold ${channel === "sms" ? "bg-red-600 hover:bg-red-700" : "bg-white hover:bg-red-700"}`}
            >
              SMS
            </Button>
            */}
          </div>

          <Button
            disabled={!isValid}
            onClick={handleSignIn}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2"
          >
            Start Reminders <ArrowRight className="ml-2" size={16} />
          </Button>
        </div>

        {/* Brutal Mode Section */}
        <div className="bg-black border-2 border-red-600 p-6 rounded-lg text-left mb-10">
          <div className="flex items-center mb-3">
            <Skull className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-2xl font-black text-red-400 font-impact">BRUTAL MODE</h2>
          </div>
          <p className="text-red-400 font-bold text-sm mb-2">Brutal Mode is coming soon. Join the waitlist to be the first to try it.</p>
          {waitlistCount !== null && (
            <p className="text-white font-bold mb-2">{waitlistCount} people are already on the waitlist.</p>
          )}

          {waitlistSubmitted ? (
            <p className="text-red-400 font-bold mt-4">Thanks for joining the waitlist!</p>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-3 mt-4">
              <Input
                type="email"
                required
                placeholder="Email address"
                value={waitlistEmail}
                onChange={e => setWaitlistEmail(e.target.value)}
                className="bg-black border-white text-white"
              />
              <Input
                type="tel"
                placeholder="Phone number (optional)"
                value={waitlistPhone}
                onChange={e => setWaitlistPhone(e.target.value)}
                className="bg-black border-white text-white"
              />
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Join Waitlist
              </Button>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-xs text-white mt-4 font-bold">
          <Smartphone size={12} className="inline-block mr-1" />
          Standard messaging rates may apply.
        </p>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            setToken(null);
          }}
          className="text-sm text-gray-400 underline mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
