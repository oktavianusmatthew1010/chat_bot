import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Lightbulb, RefreshCw, Copy, Check, Sparkles, MessageSquare, Users, Zap } from 'lucide-react'
import OpenRouterService from '../services/openRouterService'
import './SuggestionScreen.css'

const SuggestionScreen = ({ user, onBack }) => {
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [customPrompt, setCustomPrompt] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [error, setError] = useState('')

  const openRouterService = new OpenRouterService()

  const categories = [
    {
      id: 'general',
      title: 'Umum',
      description: 'Saran percakapan umum',
      icon: MessageSquare,
      color: '#667eea'
    },
    {
      id: 'customer_service',
      title: 'Layanan Pelanggan',
      description: 'Respon untuk support pelanggan',
      icon: Users,
      color: '#10b981'
    },
    {
      id: 'creative',
      title: 'Kreatif',
      description: 'Ide dan konten kreatif',
      icon: Sparkles,
      color: '#f59e0b'
    },
    {
      id: 'problem_solving',
      title: 'Pemecahan Masalah',
      description: 'Solusi untuk berbagai masalah',
      icon: Zap,
      color: '#8b5cf6'
    }
  ]

  const generateSuggestions = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      let prompt = ''
      
      if (customPrompt.trim()) {
        prompt = `Berikan 5 saran atau ide terkait: "${customPrompt.trim()}". Berikan dalam bahasa Indonesia dengan format yang jelas dan praktis.`
      } else {
        switch (selectedCategory) {
          case 'general':
            prompt = 'Berikan 5 saran percakapan umum yang menarik dan bermanfaat untuk memulai obrolan dengan AI. Berikan dalam bahasa Indonesia.'
            break
          case 'customer_service':
            prompt = 'Berikan 5 template respon layanan pelanggan yang profesional dan ramah untuk menangani berbagai situasi. Berikan dalam bahasa Indonesia.'
            break
          case 'creative':
            prompt = 'Berikan 5 ide kreatif untuk konten, proyek, atau aktivitas yang dapat menginspirasi. Berikan dalam bahasa Indonesia.'
            break
          case 'problem_solving':
            prompt = 'Berikan 5 pendekatan atau strategi untuk memecahkan masalah umum dalam kehidupan sehari-hari atau pekerjaan. Berikan dalam bahasa Indonesia.'
            break
          default:
            prompt = 'Berikan 5 saran umum yang bermanfaat. Berikan dalam bahasa Indonesia.'
        }
      }

      const response = await openRouterService.sendMessage(prompt, user.role)
      
      // Parse the response to extract individual suggestions
      const suggestionText = response.content || response
      const suggestionLines = suggestionText
        .split('\n')
        .filter(line => line.trim())
        .filter(line => /^\d+\.|^-|^\*/.test(line.trim()))
        .map(line => line.replace(/^\d+\.|^-|^\*/, '').trim())
        .slice(0, 5)

      if (suggestionLines.length === 0) {
        // Fallback: split by sentences if no numbered list found
        const sentences = suggestionText
          .split(/[.!?]\s+/)
          .filter(s => s.trim().length > 20)
          .slice(0, 5)
          .map(s => s.trim() + (s.endsWith('.') ? '' : '.'))
        
        setSuggestions(sentences.length > 0 ? sentences : ['Tidak dapat menghasilkan saran saat ini. Silakan coba lagi.'])
      } else {
        setSuggestions(suggestionLines)
      }
      
    } catch (error) {
      console.error('Error generating suggestions:', error)
      setError('Gagal menghasilkan saran. Silakan periksa koneksi internet dan coba lagi.')
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : MessageSquare
  }

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.color : '#667eea'
  }

  // Generate initial suggestions on mount
  useEffect(() => {
    generateSuggestions()
  }, [selectedCategory])

  return (
    <div className="suggestion-screen">
      {/* Header */}
      <motion.div 
        className="suggestion-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-left">
          <motion.button
            className="back-btn"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div className="header-title">
            <h1>AI Suggestion Generator</h1>
            <p>Dapatkan saran dan ide kreatif dari AI</p>
          </div>
        </div>
        
        <motion.button
          className="refresh-btn"
          onClick={generateSuggestions}
          disabled={isLoading}
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={20} className={isLoading ? 'spinning' : ''} />
        </motion.button>
      </motion.div>

      {/* Category Selection */}
      <motion.div 
        className="category-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>Pilih Kategori Saran</h3>
        <div className="category-grid">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: `0 8px 25px ${category.color}30` 
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  '--category-color': category.color
                }}
              >
                <IconComponent size={32} className="category-icon" />
                <h4>{category.title}</h4>
                <p>{category.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Custom Prompt */}
      <motion.div 
        className="custom-prompt-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3>Atau Masukkan Permintaan Khusus</h3>
        <div className="prompt-container">
          <textarea
            className="custom-prompt-input"
            placeholder="Contoh: Berikan saran untuk meningkatkan produktivitas kerja dari rumah..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={3}
            maxLength={500}
          />
          <motion.button
            className="generate-btn"
            onClick={generateSuggestions}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              <>
                <Lightbulb size={20} />
                Generate Saran
              </>
            )}
          </motion.button>
        </div>
        <div className="char-count">
          {customPrompt.length}/500 karakter
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions Display */}
      <motion.div 
        className="suggestions-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="suggestions-header">
          <h3>Saran AI</h3>
          {suggestions.length > 0 && (
            <span className="suggestion-count">
              {suggestions.length} saran dihasilkan
            </span>
          )}
        </div>

        <div className="suggestions-container">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                className="loading-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="loading-animation">
                  <div className="loading-dots">
                    <motion.div 
                      className="dot"
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="dot"
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="dot"
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <p>AI sedang menghasilkan saran...</p>
                </div>
              </motion.div>
            ) : suggestions.length > 0 ? (
              <motion.div
                className="suggestions-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    className="suggestion-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
                  >
                    <div className="suggestion-content">
                      <div className="suggestion-number">
                        {index + 1}
                      </div>
                      <div className="suggestion-text">
                        {suggestion}
                      </div>
                    </div>
                    
                    <motion.button
                      className="copy-btn"
                      onClick={() => copyToClipboard(suggestion, index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Salin ke clipboard"
                    >
                      {copiedIndex === index ? (
                        <Check size={16} className="check-icon" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Lightbulb size={48} className="empty-icon" />
                <h4>Belum ada saran</h4>
                <p>Pilih kategori atau masukkan permintaan khusus untuk mendapatkan saran dari AI.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Tips Section */}
      <motion.div 
        className="tips-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h4>💡 Tips untuk Saran yang Lebih Baik</h4>
        <ul>
          <li>Gunakan permintaan yang spesifik dan jelas</li>
          <li>Sertakan konteks atau situasi yang relevan</li>
          <li>Coba berbagai kategori untuk perspektif yang berbeda</li>
          <li>Gunakan tombol refresh untuk mendapatkan saran baru</li>
        </ul>
      </motion.div>
    </div>
  )
}

export default SuggestionScreen