import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, LogOut, Settings, Mic, MicOff, MoreVertical, Volume2, VolumeX } from 'lucide-react'
import FloatingAvatar from './FloatingAvatar'
import openRouterService from '../services/openRouterService'
import './ChatScreen.css'

// Helper function to render markdown content
const renderMarkdown = (text) => {
  // Convert markdown images ![alt](url) to img tags
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  let html = text.replace(imageRegex, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;" />')
  
  // Convert markdown links [text](url) to anchor tags
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  html = html.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  
  // Convert **bold** to <strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  
  // Convert *italic* to <em>
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  
  // Convert line breaks
  html = html.replace(/\n/g, '<br />')
  
  return html
}

const ChatScreen = ({ user, chatHistory, onAddMessage, onLogout, onNavigate, selectedAvatar, onAvatarChange }) => {
  const messages = chatHistory || []
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isTalking, setIsTalking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [useAIAvatar, setUseAIAvatar] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount and initialize speech
  useEffect(() => {
    inputRef.current?.focus()
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'id-ID'  // Indonesian language for speech recognition
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsRecording(false)
      }
      
      recognitionRef.current.onerror = () => {
        setIsRecording(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
      
      setSpeechSupported(true)
    }
    
    // Initialize speech synthesis and load voices
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
      
      // Load voices - some browsers need this
      const loadVoices = () => {
        const voices = synthRef.current.getVoices()
        console.log('Available voices:', voices.filter(v => v.lang.includes('id') || v.name.toLowerCase().includes('indonesia')))
      }
      
      // Load voices immediately and on voiceschanged event
      loadVoices()
      synthRef.current.onvoiceschanged = loadVoices
    }
  }, [])

  // Simulate AI typing and talking states
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.sender === 'ai') {
        setIsTalking(true)
        setTimeout(() => setIsTalking(false), 2000)
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      role: user.role
    }

    setInputMessage('')
    setIsTyping(true)
    
    // Add user message
    onAddMessage(userMessage)
    
    // Get AI response from OpenRouter
    try {
      const aiResponse = await openRouterService.sendMessage(
        userMessage.text,
        user.role,
        messages,
        user.name
      )
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        role: 'assistant'
      }
      
      onAddMessage(aiMessage)
      setIsTyping(false)
      
      // Speak the AI response
      speakText(aiMessage.text)
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      // Fallback response
      const fallbackMessage = {
        id: Date.now() + 1,
        text: `Halo ${user.name}! Saya adalah AI assistant yang siap membantu Anda. Bagaimana saya bisa membantu hari ini?`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        role: 'assistant'
      }
      
      onAddMessage(fallbackMessage)
      setIsTyping(false)
      
      // Speak the fallback response
      speakText(fallbackMessage.text)
    }
  }

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await handleSendMessage()
    }
  }

  const speakText = (text) => {
    if (voiceEnabled && synthRef.current && 'speechSynthesis' in window) {
      // Stop any ongoing speech
      synthRef.current.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 1.3  // Increased speed for faster speech
      utterance.pitch = 1.1  // Slightly higher pitch for Indonesian dialect
      utterance.volume = 0.8
      
      // Try to find Indonesian voice if available
      const voices = synthRef.current.getVoices()
      const indonesianVoice = voices.find(voice => 
        voice.lang.includes('id') || 
        voice.name.toLowerCase().includes('indonesia') ||
        voice.name.toLowerCase().includes('bahasa')
      )
      
      if (indonesianVoice) {
        utterance.voice = indonesianVoice
      }
      
      utterance.onstart = () => setIsTalking(true)
      utterance.onend = () => setIsTalking(false)
      utterance.onerror = () => setIsTalking(false)
      
      synthRef.current.speak(utterance)
    }
  }

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)
    if (!voiceEnabled && synthRef.current) {
      synthRef.current.cancel()
      setIsTalking(false)
    }
  }

  const toggleRecording = () => {
    if (!speechSupported) {
      alert('Speech recognition tidak didukung di browser ini')
      return
    }
    
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current?.start()
      setIsRecording(true)
    }
  }



  const getRoleDisplayName = (role) => {
    const roleNames = {
      customer: 'Pelanggan',
      support: 'Agen Support',
      roleplay: 'Roleplay'
    }
    return roleNames[role] || role
  }

  const getMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getGreetingMessage = () => {
    const greetings = {
      customer: `Halo ${user.name}! Saya adalah asisten AI Anda. Bagaimana saya bisa membantu Anda hari ini?`,
      support: `Selamat datang, ${user.name}! Sebagai agen support, Anda dapat membantu pelanggan dan mengelola keluhan. Ada yang bisa saya bantu?`,
      roleplay: `Hai ${user.name}! Mari kita mulai petualangan roleplay yang menarik. Karakter apa yang ingin Anda mainkan hari ini?`
    }
    return greetings[user.role] || `Halo ${user.name}! Selamat datang di AI Chat Hub.`
  }

  return (
    <div className="chat-screen">
      {/* Header */}
      <motion.div 
        className="chat-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-left">
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h3>{user.name}</h3>
              <span className="user-role">{getRoleDisplayName(user.role)}</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          {/* Voice Status Indicator */}
          <motion.button
            className="voice-status"
            title={voiceEnabled ? 'Klik untuk matikan suara' : 'Klik untuk nyalakan suara'}
            onClick={toggleVoice}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {voiceEnabled ? <Volume2 size={18} color="#10b981" /> : <VolumeX size={18} color="#ef4444" />}
          </motion.button>
          
          <motion.button
            className="header-btn"
            onClick={() => setShowSettings(!showSettings)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreVertical size={20} />
          </motion.button>
          
          <motion.button
            className="logout-btn"
            onClick={onLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Settings Dropdown */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="settings-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {user.role === 'support' && (
              <button 
                className="dropdown-item"
                onClick={() => {
                  onNavigate('complaints')
                  setShowSettings(false)
                }}
              >
                <Settings size={16} />
                Kelola Keluhan
              </button>
            )}
            <button 
              className="dropdown-item"
              onClick={() => {
                onNavigate('suggestions')
                setShowSettings(false)
              }}
            >
              <Settings size={16} />
              Saran AI
            </button>
            <button 
              className="dropdown-item"
              onClick={() => {
                toggleVoice()
                setShowSettings(false)
              }}
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              {voiceEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            </button>
            <button 
              className="dropdown-item"
              onClick={() => {
                setUseAIAvatar(!useAIAvatar)
                setShowSettings(false)
              }}
            >
              <Settings size={16} />
              {useAIAvatar ? 'Gunakan Avatar CSS' : 'Gunakan Avatar AI'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div className="messages-container">
        <motion.div 
          className="messages-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Welcome Message */}
          <motion.div
            className="message ai-message"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="message-avatar ai-avatar">
              AI
            </div>
            <div className="message-content">
              <div className="message-text">
                Halo! Saya asisten AI yang siap membantu Anda menangani pelanggan hari ini. Apa yang bisa saya bantu terkait:
              </div>
              <div className="message-time">
                {getMessageTime(new Date().toISOString())}
              </div>
            </div>
          </motion.div>

          {/* Quick Options */}
          <motion.div
            className="quick-options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
               className="quick-option-btn"
               onClick={async () => {
                 const message = "Saya membutuhkan bantuan untuk menangani keluhan pelanggan. Bagaimana cara terbaik untuk merespons keluhan dengan profesional?"
                 setInputMessage(message)
                 
                 // Send message immediately
                 const userMessage = {
                   id: Date.now(),
                   text: message,
                   sender: 'user',
                   timestamp: new Date().toISOString(),
                   role: user.role
                 }
                 onAddMessage(userMessage)
                 setInputMessage('')
                 setIsTyping(true)
                 
                 try {
                   const aiResponse = await openRouterService.sendMessage(message, user.role, messages, user.name)
                   const aiMessage = {
                     id: Date.now() + 1,
                     text: aiResponse,
                     sender: 'ai',
                     timestamp: new Date().toISOString(),
                     role: 'assistant'
                   }
                   onAddMessage(aiMessage)
                   setIsTyping(false)
                   speakText(aiMessage.text)
                 } catch (error) {
                   console.error('Error getting AI response:', error)
                   const fallbackMessage = {
                     id: Date.now() + 1,
                     text: `Halo ${user.name}! Saya akan membantu Anda menangani keluhan pelanggan dengan profesional. Berikut beberapa tips penting: 1) Dengarkan dengan empati, 2) Akui masalah pelanggan, 3) Tawarkan solusi konkret, 4) Follow up untuk memastikan kepuasan.`,
                     sender: 'ai',
                     timestamp: new Date().toISOString(),
                     role: 'assistant'
                   }
                   onAddMessage(fallbackMessage)
                   setIsTyping(false)
                   speakText(fallbackMessage.text)
                 }
               }}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
             >
               <span className="option-number">1</span>
               <span className="option-text">Penanganan keluhan pelanggan</span>
             </motion.button>
             
             <motion.button
               className="quick-option-btn"
               onClick={async () => {
                 const message = "Saya perlu informasi detail tentang produk dan spesifikasinya untuk membantu pelanggan. Bisakah Anda membantu?"
                 setInputMessage(message)
                 
                 const userMessage = {
                   id: Date.now(),
                   text: message,
                   sender: 'user',
                   timestamp: new Date().toISOString(),
                   role: user.role
                 }
                 onAddMessage(userMessage)
                 setInputMessage('')
                 setIsTyping(true)
                 
                 try {
                   const aiResponse = await openRouterService.sendMessage(message, user.role, messages, user.name)
                   const aiMessage = {
                     id: Date.now() + 1,
                     text: aiResponse,
                     sender: 'ai',
                     timestamp: new Date().toISOString(),
                     role: 'assistant'
                   }
                   onAddMessage(aiMessage)
                   setIsTyping(false)
                   speakText(aiMessage.text)
                 } catch (error) {
                   console.error('Error getting AI response:', error)
                   const fallbackMessage = {
                     id: Date.now() + 1,
                     text: `Tentu! Saya akan membantu Anda dengan informasi produk. Untuk memberikan informasi yang akurat, pastikan Anda: 1) Memahami kebutuhan spesifik pelanggan, 2) Berikan spesifikasi teknis yang relevan, 3) Jelaskan manfaat dan fitur utama, 4) Bandingkan dengan alternatif jika diperlukan.`,
                     sender: 'ai',
                     timestamp: new Date().toISOString(),
                     role: 'assistant'
                   }
                   onAddMessage(fallbackMessage)
                   setIsTyping(false)
                   speakText(fallbackMessage.text)
                 }
               }}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
             >
               <span className="option-number">2</span>
               <span className="option-text">Informasi produk dan spesifikasi</span>
             </motion.button>
             
             <motion.button
               className="quick-option-btn"
               onClick={async () => {
                 const message = "Saya membutuhkan panduan solusi teknis untuk membantu pelanggan mengatasi masalah yang mereka hadapi."
                 setInputMessage(message)
                 
                 const userMessage = {
                   id: Date.now(),
                   text: message,
                   sender: 'user',
                   timestamp: new Date().toISOString(),
                   role: user.role
                 }
                 onAddMessage(userMessage)
                 setInputMessage('')
                 setIsTyping(true)
                 
                 try {
                   const aiResponse = await openRouterService.sendMessage(message, user.role, messages, user.name)
                   const aiMessage = {
                     id: Date.now() + 1,
                     text: aiResponse,
                     sender: 'ai',
                     timestamp: new Date().toISOString(),
                     role: 'assistant'
                   }
                   onAddMessage(aiMessage)
                   setIsTyping(false)
                   speakText(aiMessage.text)
                 } catch (error) {
                   console.error('Error getting AI response:', error)
                   const fallbackMessage = {
                     id: Date.now() + 1,
                     text: `Saya siap membantu dengan solusi teknis! Pendekatan terbaik: 1) Identifikasi masalah dengan pertanyaan yang tepat, 2) Berikan langkah-langkah troubleshooting yang jelas, 3) Sediakan alternatif solusi, 4) Pastikan pelanggan memahami setiap langkah, 5) Dokumentasikan solusi untuk referensi masa depan.`,
                     sender: 'ai',
                     timestamp: new Date().toISOString(),
                     role: 'assistant'
                   }
                   onAddMessage(fallbackMessage)
                   setIsTyping(false)
                   speakText(fallbackMessage.text)
                 }
               }}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
             >
               <span className="option-number">3</span>
               <span className="option-text">Panduan solusi teknis</span>
             </motion.button>
             
             <motion.button
               className="quick-option-btn"
               onClick={async () => {
                 const message = "Saya perlu saran untuk memberikan respons yang profesional kepada pelanggan. Bagaimana cara berkomunikasi yang efektif?"
                 setInputMessage(message)
                 
                 const userMessage = {
                   id: Date.now(),
                   text: message,
                   sender: 'user',
                   timestamp: new Date().toISOString(),
                   role: user.role
                 }
                 onAddMessage(userMessage)
                 setInputMessage('')
                 setIsTyping(true)
                 
                 try {
                   const aiResponse = await openRouterService.sendMessage(message, user.role, messages, user.name)
                   const aiMessage = {
                     id: Date.now() + 1,
                     text: aiResponse,
                     sender: 'ai',
                     timestamp: new Date().toISOString(),
                     role: 'assistant'
                   }
                   onAddMessage(aiMessage)
                   setIsTyping(false)
                   speakText(aiMessage.text)
                 } catch (error) {
                   console.error('Error getting AI response:', error)
                   const fallbackMessage = {
                     id: Date.now() + 1,
                     text: `Komunikasi profesional adalah kunci! Tips penting: 1) Gunakan bahasa yang sopan dan jelas, 2) Tunjukkan empati dan pemahaman, 3) Berikan informasi yang akurat dan lengkap, 4) Tawarkan bantuan tambahan, 5) Tutup dengan nada positif dan terbuka untuk pertanyaan lebih lanjut.`,
                     sender: 'ai',
                     timestamp: new Date().toISOString(),
                     role: 'assistant'
                   }
                   onAddMessage(fallbackMessage)
                   setIsTyping(false)
                   speakText(fallbackMessage.text)
                 }
               }}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
             >
               <span className="option-number">4</span>
               <span className="option-text">Saran respons profesional untuk pelanggan</span>
             </motion.button>
          </motion.div>

          {/* Chat Messages */}
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`message-avatar ${message.sender === 'user' ? 'user-avatar' : 'ai-avatar'}`}>
                  {message.sender === 'user' ? user.name.charAt(0).toUpperCase() : 'AI'}
                </div>
                <div className="message-content">
                  <div 
                    className="message-text"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }}
                  />
                  <div className="message-time">
                    {getMessageTime(message.timestamp)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="message ai-message typing-message"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message-avatar ai-avatar">
                  AI
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <motion.div 
                        className="dot"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="dot"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div 
                        className="dot"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                    <span>AI sedang mengetik...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </motion.div>
      </div>

      {/* Input Area */}
      <motion.div 
        className="input-area"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="input-container">
          <motion.button
            className={`voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isRecording ? 'Berhenti merekam' : 'Mulai merekam suara'}
            disabled={!speechSupported}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </motion.button>
          
          <textarea
            ref={inputRef}
            className="message-input"
            placeholder="Ketik pesan Anda di sini..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            maxLength={1000}
          />
          
          <motion.button
            className="send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Kirim pesan"
          >
            <Send size={20} />
          </motion.button>
        </div>
        
        <div className="input-footer">
          <span className="char-count">
            {inputMessage.length}/1000
          </span>
          <span className="powered-by">
            Powered by OpenRouter AI
          </span>
        </div>
      </motion.div>

      {/* Floating Avatar */}
      <FloatingAvatar 
        isTyping={isTyping}
        isTalking={isTalking}
        role={user.role}
        size="medium"
        position="bottom-right"
        useAIAvatar={useAIAvatar}
      />
    </div>
  )
}

export default ChatScreen