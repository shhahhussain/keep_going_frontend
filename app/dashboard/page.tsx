"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Play, Square, Plus, X, Skull, Eye, EyeOff, LogOut } from "lucide-react"
import { startReminders, stopReminders, markDone, getStatus } from "@/lib/api"

export default function KeepGoingApp() {
  const [message, setMessage] = useState("")
  const [brutalMessages, setBrutalMessages] = useState([""])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [interval, setInterval] = useState("60")
  const [brutalMode, setBrutalMode] = useState(false)
  const [showBrutalPreview, setShowBrutalPreview] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState("")
  const [channel, setChannel] = useState("whatsapp")
  const router = useRouter()
  const [waitlistEmail, setWaitlistEmail] = useState("")
  const [waitlistPhone, setWaitlistPhone] = useState("")
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null)

  useEffect(() => {
    const savedNumber = localStorage.getItem("keep_going_phone_number");
    const savedChannel = localStorage.getItem("keep_going_channel") || "whatsapp";
    if (savedNumber) {
      setPhoneNumber(savedNumber);
      setChannel(savedChannel);
      getStatus(savedNumber).then((data) => {
        if (data && Array.isArray(data.messages) && data.messages.length > 0) {
          setMessage(data.messages[0])
        }
      })
    } else {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    fetch("http://localhost:5000/brutal_waitlist_count")
      .then(res => res.json())
      .then(data => setWaitlistCount(data.count))
  }, [])

  const addBrutalMessage = () => {
    setBrutalMessages([...brutalMessages, ""])
  }

  const updateBrutalMessage = (index: number, value: string) => {
    const newBrutalMessages = [...brutalMessages]
    newBrutalMessages[index] = value
    setBrutalMessages(newBrutalMessages)
  }

  const removeBrutalMessage = (index: number) => {
    if (brutalMessages.length > 1) {
      setBrutalMessages(brutalMessages.filter((_, i) => i !== index))
    }
  }

  const handleStart = async () => {
    if (message.trim() && phoneNumber.trim()) {
      await startReminders({
        phone_number: phoneNumber,
        messages: [message],
        interval: Number(interval),
        brutal_mode: false,
        brutal_messages: [],
      })
      setIsActive(true)
      setConfirmationMessage("You just made a promise to yourself. Break it, and it breaks you.")
      setTimeout(() => setConfirmationMessage(""), 4000)
    }
  }

  const handleStop = async () => {
    await stopReminders(phoneNumber)
    setIsActive(false)
    setConfirmationMessage("You just hit pause on progress. The version of you who needs this is still waiting.")
    setTimeout(() => setConfirmationMessage(""), 4000)
  }

  const handleDone = async () => {
    await markDone(phoneNumber)
  }

  const handleSignOut = () => {
    localStorage.removeItem("keep_going_phone_number");
    localStorage.removeItem("keep_going_channel");
    router.push('/');
  }

  const getIntervalText = (minutes: string) => {
    const mins = Number.parseInt(minutes)
    if (mins < 60) return `${mins}min`
    if (mins === 60) return "1hr"
    if (mins === 120) return "2hrs"
    if (mins === 240) return "4hrs"
    if (mins === 480) return "8hrs"
    if (mins === 1440) return "24hrs"
    return `${mins}min`
  }

  const defaultBrutalMessages = [
    "Look at you. How many more days will you waste pretending you're trying?",
    "You’re not tired — you're addicted to easy.",
    "This comfort you’re choosing? It’s costing your future.",
    "Discipline isn’t hard. Regret is.",
    "If you stopped lying to yourself, you'd be unstoppable.",
  ]
  

  if (!phoneNumber) {
    return (
        <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
            <div className="animate-pulse text-red-500 font-black text-2xl">LOADING...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-2 text-red-500 font-impact">KEEP</h1>
          <h1 className="text-7xl md:text-6xl font-black tracking-tighter mb-4 font-impact">GOING</h1>
          <p className="text-lg md:text-xl font-bold text-white max-w-md mx-auto leading-tight">
          Motivation fades. These reminders won’t.          </p>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="absolute top-0 right-0 text-white hover:text-red-400"
            >
                <LogOut size={16}/>
            </Button>
        </div>

        {/* Confirmation Message */}
        {confirmationMessage && (
          <div className="bg-red-900/50 border-2 border-red-500 p-4 mb-6 text-center animate-pulse">
            <p className="text-red-400 font-black text-lg font-impact">{confirmationMessage}</p>
          </div>
        )}

        {/* Brutal Mode Toggle */}
        {/*
        <div className="mb-8 p-6 bg-black border-2 border-red-600 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Skull className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-black text-red-400 font-impact">BRUTAL MODE</h2>
            </div>
          </div>
          <p className="text-red-400 font-bold text-sm mb-2">Brutal Mode is coming soon. Join the waitlist to be the first to try it.</p>
          {waitlistCount !== null && (
            <p className="text-white font-bold mb-2">{waitlistCount} people are already on the waitlist.</p>
          )}
          {waitlistSubmitted ? (
            <p className="text-red-400 font-bold">Thank you for joining the waitlist!</p>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                await fetch("http://localhost:5000/brutal_waitlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: waitlistEmail, phone: waitlistPhone })
                })
                setWaitlistSubmitted(true)
                fetch("http://localhost:5000/brutal_waitlist_count")
                  .then(res => res.json())
                  .then(data => setWaitlistCount(data.count))
              }}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                required
                placeholder="Email address"
                value={waitlistEmail}
                onChange={e => setWaitlistEmail(e.target.value)}
                className="rounded px-3 py-2 bg-black border border-white text-white"
              />
              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={waitlistPhone}
                onChange={e => setWaitlistPhone(e.target.value)}
                className="rounded px-3 py-2 bg-black border border-white text-white"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Join Waitlist
              </button>
            </form>
          )}
        </div>
        */}

        {/* Regular Messages Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-4 text-red-400 font-impact">MOTIVATION MESSAGE</h2>
          <p className="text-white mb-4 font-bold">Write what you need to hear when you're ready to quit.</p>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="If you quit now, you're just proving yourself right, that you never had it in you."
            className="bg-black border-2 border-red-600 text-white placeholder-white min-h-[100px] text-base font-bold resize-none focus:border-red-500 focus:ring-red-500"
          />
        </div>

        {/* Brutal Messages Section */}
        {/* Removed brutal mode UI sections */}
        
        {/* Interval Selection */}
        <div className="mb-10">
          <h2 className="text-2xl font-black mb-4 text-red-400 font-impact">REMINDER FREQUENCY</h2>
          <p className="text-white mb-6 font-bold">
            How often do you need the push? Current: {" "}
            <span className="text-white font-black">{getIntervalText(interval)}</span>
          </p>

          <div className="space-y-6">
            <Slider
              value={[Number.parseInt(interval)]}
              onValueChange={(value) => setInterval(value[0].toString())}
              max={1440}
              min={15}
              step={15}
              className="w-full"
            />

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
              {["15", "30", "60", "120", "240", "1440"].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setInterval(mins)}
                  className={`p-3 rounded font-black transition-all ${
                    interval === mins
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-black text-white hover:bg-red-700"
                  }`}
                >
                  {getIntervalText(mins)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {!isActive ? (
            <Button
              onClick={handleStart}
              disabled={!message.trim() || !phoneNumber.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-xl h-16 disabled:bg-white disabled:text-red-500 shadow-lg transition-all"
            >
              <Play className="h-6 w-6 mr-3" />
              START REMINDERS
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              className="flex-1 bg-black hover:bg-red-700 text-white font-black text-xl h-16 border-2 border-red-600 shadow-lg transition-all"
            >
              <Square className="h-6 w-6 mr-3" />
              STOP REMINDERS
            </Button>
          )}
        </div>

        {/* Hidden Done Link */}
        {isActive && (
          <div className="text-center mb-8">
            <a href="/done" onClick={handleDone} className="text-white hover:text-red-400 font-bold text-sm underline transition-colors">
              Mark as done (from SMS)
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="text-center border-t border-red-600 pt-8">
          <p className="text-white font-bold">When the world gets quiet, your excuses get loud.</p>
          <p className="text-white font-bold mt-2">This is the voice that doesn't let you lie to yourself.</p>
          {/* Removed brutal mode footer message */}
        </div>
      </div>
    </div>
  )
}
