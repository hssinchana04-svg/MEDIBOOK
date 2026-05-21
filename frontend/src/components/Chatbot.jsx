import React, { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const Chatbot = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I'm MediBot, your AI health assistant. Ask me any health questions, describe symptoms, or ask about doctor specialities.\n\n*Disclaimer: I provide educational info only. For diagnostics, consult a doctor.*"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Prepare chat history to send to backend (excluding ID)
    const history = messages.map(msg => ({
      sender: msg.sender,
      text: msg.text
    }))

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/health-chat`, {
        message: userMessage.text,
        history: history
      })

      if (data.success) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: data.reply
        }])
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment."
        }])
      }
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Sorry, an error occurred. Please check your connection and try again."
      }])
    } finally {
      setLoading(false)
    }
  }

  // Simple formatting helper for bot responses
  const renderMessageText = (text) => {
    return text.split('\n').map((line, idx) => {
      // Check if it's a bullet point
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm mt-1">
            {formatBoldText(line.trim().substring(2))}
          </li>
        )
      }
      return (
        <p key={idx} className="text-sm min-h-[1em] mb-1.5 leading-relaxed">
          {formatBoldText(line)}
        </p>
      )
    })
  }

  // Handle markdown bold formatting: **text** or *text*
  const formatBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-gray-800">{part.slice(1, -1)}</em>
      }
      return part
    })
  }

  // Quick navigation link rendering if bot mentions specialty keywords
  const getQuickLinks = (text) => {
    const specialties = [
      { key: "General physician", label: "Consult General Physician" },
      { key: "Gynecologist", label: "Consult Gynecologist" },
      { key: "Dermatologist", label: "Consult Dermatologist" },
      { key: "Pediatricians", label: "Consult Pediatricians" },
      { key: "Neurologist", label: "Consult Neurologist" },
      { key: "Gastroenterologist", label: "Consult Gastroenterologist" }
    ]

    const matched = specialties.filter(spec => 
      text.toLowerCase().includes(spec.key.toLowerCase())
    )

    if (matched.length === 0) return null

    return (
      <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-100">
        <span className="text-[10px] font-semibold text-gray-400 w-full mb-0.5">Quick Actions:</span>
        {matched.map((spec, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsOpen(false)
              navigate(`/doctors/${spec.key}`)
            }}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-blue-100 transition-all"
          >
            🔎 {spec.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[380px] h-[500px] bg-white border border-gray-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide leading-none">MediBot</h3>
                <span className="text-[10px] text-blue-100 font-medium">Online • AI Health Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-100 font-bold p-1 rounded-full hover:bg-white/10 text-lg leading-none transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 flex flex-col gap-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white self-end rounded-tr-none'
                    : 'bg-white text-gray-700 self-start rounded-tl-none border border-gray-100'
                }`}
              >
                {msg.sender === 'user' ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div>
                    {renderMessageText(msg.text)}
                    {getQuickLinks(msg.text)}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="bg-white text-gray-500 self-start rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex gap-2 bg-white">
            <input
              type="text"
              placeholder="Ask a health question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-750 placeholder:text-gray-400 bg-gray-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`w-9 h-9 rounded-xl flex items-center justify-center bg-blue-600 text-white font-bold transition-all shadow-sm ${
                (!input.trim() || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:scale-95'
              }`}
            >
              ➔
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-108 active:scale-95 text-2xl"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  )
}

export default Chatbot
