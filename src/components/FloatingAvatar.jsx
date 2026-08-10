import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import newportAIService from '../services/newportAIService'
import './FloatingAvatar.css'

const FloatingAvatar = ({ 
  isTyping = false, 
  isTalking = false, 
  role = 'customer',
  size = 'medium',
  position = 'bottom-right',
  useAIAvatar = false
}) => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })
  const [blinkState, setBlinkState] = useState(false)
  const [aiAvatarUrl, setAiAvatarUrl] = useState(null)
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)
  const avatarRef = useRef(null)

  // Generate AI avatar when component mounts or role changes
  useEffect(() => {
    const generateAIAvatar = async () => {
      if (!useAIAvatar) return
      
      setIsLoadingAvatar(true)
      try {
        const avatarUrl = await newportAIService.generateAvatarByRole(role)
        setAiAvatarUrl(avatarUrl)
      } catch (error) {
        console.error('Failed to generate AI avatar:', error)
        // Fallback to CSS avatar
        setAiAvatarUrl(null)
      } finally {
        setIsLoadingAvatar(false)
      }
    }

    if (useAIAvatar && role) {
      generateAIAvatar()
    } else {
      setAiAvatarUrl(null)
    }
  }, [role, useAIAvatar])

  // Eye tracking effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!avatarRef.current) return
      
      const rect = avatarRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) / 20
      const deltaY = (e.clientY - centerY) / 20
      
      setEyePosition({
        x: Math.max(-3, Math.min(3, deltaX)),
        y: Math.max(-2, Math.min(2, deltaY))
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true)
      setTimeout(() => setBlinkState(false), 150)
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(blinkInterval)
  }, [])

  // Avatar configuration based on role
  const getAvatarConfig = () => {
    const configs = {
      customer: {
        skinTone: '#f4c2a1',
        eyeColor: '#8B4513',
        clothingColor: '#4F46E5',
        shadowColor: 'rgba(79, 70, 229, 0.3)'
      },
      support: {
        skinTone: '#e8b894',
        eyeColor: '#2D5016',
        clothingColor: '#059669',
        shadowColor: 'rgba(5, 150, 105, 0.3)'
      },
      roleplay: {
        skinTone: '#f7d794',
        eyeColor: '#1E3A8A',
        clothingColor: '#DC2626',
        shadowColor: 'rgba(220, 38, 38, 0.3)'
      }
    }
    return configs[role] || configs.customer
  }

  const config = getAvatarConfig()

  // Size configurations
  const sizeConfig = {
    small: { width: '60px', height: '60px', bottom: '20px', right: '20px' },
    medium: { width: '80px', height: '80px', bottom: '30px', right: '30px' },
    large: { width: '100px', height: '100px', bottom: '40px', right: '40px' }
  }

  const currentSize = sizeConfig[size]

  // Animation variants
  const floatingVariants = {
    floating: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const talkingVariants = {
    idle: {
      scale: 1,
      rotate: 0
    },
    talking: {
      scale: [1, 1.05, 1],
      rotate: [0, 1, -1, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity
      }
    }
  }

  // Typing animation variants
  const typingVariants = {
    bounce1: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay: 0
      }
    },
    bounce2: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay: 0.2
      }
    },
    bounce3: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay: 0.4
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={avatarRef}
        className={`floating-avatar ${position} ${size}`}
        style={{
          width: currentSize.width,
          height: currentSize.height,
          bottom: currentSize.bottom,
          right: currentSize.right
        }}
        initial={{ opacity: 0, scale: 0, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0, y: 50 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      >
        {/* Main Avatar Container */}
        <motion.div
          className="avatar-container"
          variants={floatingVariants}
          animate="floating"
        >
          {/* AI Avatar or CSS Avatar */}
          {useAIAvatar && aiAvatarUrl && !isLoadingAvatar ? (
            <motion.div
              className="ai-avatar-container"
              variants={talkingVariants}
              animate={isTalking ? "talking" : "idle"}
            >
              <img 
                src={aiAvatarUrl} 
                alt="AI Generated Avatar"
                className="ai-avatar-image"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: `0 8px 32px ${config.shadowColor}`
                }}
              />
              {isTalking && (
                <div className="talking-overlay" />
              )}
            </motion.div>
          ) : isLoadingAvatar ? (
            <motion.div
              className="avatar-loading"
              style={{
                background: `linear-gradient(135deg, ${config.skinTone}, ${config.skinTone}dd)`,
                boxShadow: `0 8px 32px ${config.shadowColor}`
              }}
            >
              <div className="loading-spinner" />
              <div className="loading-text">Generating Avatar...</div>
            </motion.div>
          ) : (
            <motion.div
              className="avatar-head"
              style={{
                background: `linear-gradient(135deg, ${config.skinTone}, ${config.skinTone}dd)`,
                boxShadow: `0 8px 32px ${config.shadowColor}`
              }}
              variants={talkingVariants}
              animate={isTalking ? "talking" : "idle"}
            >


              {/* Eyebrows */}
              <div className="avatar-eyebrows">
                <motion.div 
                  className="eyebrow left-eyebrow"
                  animate={{
                    scaleY: isTalking ? [1, 1.1, 0.9, 1] : 1,
                    rotate: isTalking ? [0, -2, 2, 0] : 0
                  }}
                  transition={{ duration: 0.5, repeat: isTalking ? Infinity : 0 }}
                />
                <motion.div 
                  className="eyebrow right-eyebrow"
                  animate={{
                    scaleY: isTalking ? [1, 1.1, 0.9, 1] : 1,
                    rotate: isTalking ? [0, 2, -2, 0] : 0
                  }}
                  transition={{ duration: 0.5, repeat: isTalking ? Infinity : 0 }}
                />
              </div>

              {/* Eyes */}
              <div className="avatar-eyes">
                <motion.div 
                  className="eye left-eye"
                  style={{
                    transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
                  }}
                  animate={{
                    scaleY: blinkState ? 0.1 : 1
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="iris" style={{ backgroundColor: config.eyeColor }}>
                    <div className="pupil">
                      <div className="eye-highlight" />
                    </div>
                  </div>
                  <div className="eye-shadow" />
                </motion.div>
                <motion.div 
                  className="eye right-eye"
                  style={{
                    transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
                  }}
                  animate={{
                    scaleY: blinkState ? 0.1 : 1
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="iris" style={{ backgroundColor: config.eyeColor }}>
                    <div className="pupil">
                      <div className="eye-highlight" />
                    </div>
                  </div>
                  <div className="eye-shadow" />
                </motion.div>
              </div>

              {/* Nose */}
              <div className="avatar-nose">
                <div className="nose-bridge" />
                <div className="nostril left-nostril" />
                <div className="nostril right-nostril" />
              </div>

              {/* Mouth */}
              <motion.div 
                className="avatar-mouth"
                animate={{
                  scaleX: isTalking ? [1, 1.2, 0.8, 1.1, 1] : 1,
                  scaleY: isTalking ? [1, 0.8, 1.2, 0.9, 1] : 1
                }}
                transition={{
                  duration: isTalking ? 0.5 : 0.3,
                  repeat: isTalking ? Infinity : 0
                }}
              />

              {/* Cheeks */}
              <AnimatePresence>
                {isTalking && (
                  <>
                    <motion.div 
                      className="cheek left-cheek"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.6, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    />
                    <motion.div 
                      className="cheek right-cheek"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.6, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    />
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Clothing */}
          <div 
            className="avatar-clothing"
            style={{
              background: `linear-gradient(135deg, ${config.clothingColor}, ${config.clothingColor}dd)`
            }}
          >
            <div className="clothing-collar" />
            <div className="clothing-buttons">
              <div className="button" />
              <div className="button" />
            </div>
          </div>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="typing-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <motion.div className="typing-dot" variants={typingVariants} animate="bounce1" />
                <motion.div className="typing-dot" variants={typingVariants} animate="bounce2" />
                <motion.div className="typing-dot" variants={typingVariants} animate="bounce3" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FloatingAvatar