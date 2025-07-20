"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Play, Square, Plus, X, Skull, Eye, EyeOff } from "lucide-react"
import { startReminders, stopReminders, markDone } from "@/lib/api"

export default function KeepGoingApp() {
  const [messages, setMessages] = useState([""])
  const [brutalMessages, setBrutalMessages] = useState([""])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [interval, setInterval] = useState("60")
  const [brutalMode, setBrutalMode] = useState(false)
  const [showBrutalPreview, setShowBrutalPreview] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState("")

  const addMessage = () => {
    setMessages([...messages, ""])
  }

  const addBrutalMessage = () => {
    setBrutalMessages([...brutalMessages, ""])
  }

  const updateMessage = (index: number, value: string) => {
    const newMessages = [...messages]
    newMessages[index] = value
    setMessages(newMessages)
  }

  const updateBrutalMessage = (index: number, value: string) => {
    const newBrutalMessages = [...brutalMessages]
    newBrutalMessages[index] = value
    setBrutalMessages(newBrutalMessages)
  }

  const removeMessage = (index: number) => {
    if (messages.length > 1) {
      setMessages(messages.filter((_, i) => i !== index))
    }
  }

  const removeBrutalMessage = (index: number) => {
    if (brutalMessages.length > 1) {
      setBrutalMessages(brutalMessages.filter((_, i) => i !== index))
    }
  }

  const handleStart = async () => {
    if (messages.some((msg) => msg.trim()) && phoneNumber.trim()) {
      await startReminders({
        phone_number: phoneNumber,
        messages,
        interval: Number(interval),
        brutal_mode: brutalMode,
        brutal_messages: brutalMode ? brutalMessages : [],
      })
      setIsActive(true)
      setConfirmationMessage(brutalMode ? "BRUTAL MODE ACTIVATED. NO MERCY." : "REMINDERS STARTED. NO EXCUSES.")
      setTimeout(() => setConfirmationMessage(""), 4000)
    }
  }

  const handleStop = async () => {
    await stopReminders(phoneNumber)
    setIsActive(false)
    setConfirmationMessage("REMINDERS STOPPED. HOPE YOU'RE READY TO QUIT.")
    setTimeout(() => setConfirmationMessage(""), 4000)
  }

  const handleDone = async () => {
    await markDone(phoneNumber)
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
    "Seriously? You're already giving up? Pathetic.",
    "I knew you'd quit. Prove me wrong for once.",
    "Your excuses are weaker than your willpower.",
    "Everyone else is grinding while you're making excuses.",
    "You said you wanted this. Was that just another lie?",
  ]

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-2 text-red-500 font-impact">KEEP</h1>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 font-impact">GOING</h1>
          <p className="text-lg md:text-xl font-bold text-gray-300 max-w-md mx-auto leading-tight">
            Raw motivation when you need it most. No bullshit. Just truth.
          </p>
        </div>

        {/* Confirmation Message */}
        {confirmationMessage && (
          <div className="bg-red-900/50 border-2 border-red-500 p-4 mb-6 text-center animate-pulse">
            <p className="text-red-400 font-black text-lg font-impact">{confirmationMessage}</p>
          </div>
        )}

        {/* Brutal Mode Toggle */}
        <div className="mb-8 p-6 bg-gray-900 border-2 border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Skull className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-black text-red-400 font-impact">BRUTAL MODE</h2>
            </div>
            <Switch checked={brutalMode} onCheckedChange={setBrutalMode} className="data-[state=checked]:bg-red-600" />
          </div>
          <p className="text-gray-400 font-bold mb-2">
            If you don't check in, you'll get cussed out. You've been warned.
          </p>
          {brutalMode && (
            <p className="text-red-400 font-bold text-sm">⚠️ BRUTAL MODE ACTIVE - No safe words. No mercy.</p>
          )}
        </div>

        {/* Regular Messages Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-4 text-red-400 font-impact">MOTIVATION MESSAGES</h2>
          <p className="text-gray-400 mb-4 font-bold">Write what you need to hear when you're ready to quit.</p>

          {messages.map((message, index) => (
            <div key={index} className="mb-4 relative">
              <Textarea
                value={message}
                onChange={(e) => updateMessage(index, e.target.value)}
                placeholder="You've survived 100% of your worst days. Keep that streak alive."
                className="bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 min-h-[100px] text-base font-bold resize-none focus:border-red-500 focus:ring-red-500"
              />
              {messages.length > 1 && (
                <Button
                  onClick={() => removeMessage(index)}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            onClick={addMessage}
            variant="outline"
            className="w-full border-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white font-black bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            ADD MESSAGE
          </Button>
        </div>

        {/* Brutal Messages Section */}
        {brutalMode && (
          <div className="mb-8 p-6 bg-red-950/20 border-2 border-red-800 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-red-400 font-impact">BRUTAL MESSAGES</h2>
              <Button
                onClick={() => setShowBrutalPreview(!showBrutalPreview)}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
              >
                {showBrutalPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-red-300 mb-4 font-bold text-sm">These get sent when you slack off. Make them hurt.</p>

            {showBrutalPreview && (
              <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded">
                <p className="text-red-300 font-bold text-sm mb-2">PREVIEW:</p>
                <p className="text-red-400 font-bold italic">
                  {brutalMessages.find((msg) => msg.trim()) || defaultBrutalMessages[0]}
                </p>
              </div>
            )}

            {brutalMessages.map((message, index) => (
              <div key={index} className="mb-4 relative">
                <Textarea
                  value={message}
                  onChange={(e) => updateBrutalMessage(index, e.target.value)}
                  placeholder="Seriously? You're already giving up? Pathetic."
                  className="bg-red-950/30 border-2 border-red-800 text-red-200 placeholder-red-400/70 min-h-[80px] text-base font-bold resize-none focus:border-red-500 focus:ring-red-500"
                />
                {brutalMessages.length > 1 && (
                  <Button
                    onClick={() => removeBrutalMessage(index)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              onClick={addBrutalMessage}
              variant="outline"
              className="w-full border-2 border-red-800 text-red-300 hover:bg-red-900/30 hover:text-red-200 font-black bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD BRUTAL MESSAGE
            </Button>
          </div>
        )}

        {/* Phone Number */}
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-4 text-red-400 font-impact">YOUR NUMBER</h2>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 text-lg font-bold h-14 focus:border-red-500 focus:ring-red-500"
          />
        </div>

        {/* Interval Selection */}
        <div className="mb-10">
          <h2 className="text-2xl font-black mb-4 text-red-400 font-impact">REMINDER FREQUENCY</h2>
          <p className="text-gray-400 mb-6 font-bold">
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
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
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
              disabled={!messages.some((msg) => msg.trim()) || !phoneNumber.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-xl h-16 disabled:bg-gray-800 disabled:text-gray-500 shadow-lg transition-all"
            >
              <Play className="h-6 w-6 mr-3" />
              START REMINDERS
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-black text-xl h-16 border-2 border-gray-600 shadow-lg transition-all"
            >
              <Square className="h-6 w-6 mr-3" />
              STOP REMINDERS
            </Button>
          )}
        </div>

        {/* Hidden Done Link */}
        {isActive && (
          <div className="text-center mb-8">
            <a href="/done" onClick={handleDone} className="text-gray-600 hover:text-gray-400 font-bold text-sm underline transition-colors">
              Mark as done (from SMS)
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="text-center border-t border-gray-800 pt-8">
          <p className="text-gray-600 font-bold">Sometimes you need someone to tell you the hard truth.</p>
          <p className="text-gray-600 font-bold mt-2">This is that someone.</p>
          {brutalMode && (
            <p className="text-red-600 font-black mt-4 text-sm">
              ☠️ BRUTAL MODE: No safe words. No mercy. Just results.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
