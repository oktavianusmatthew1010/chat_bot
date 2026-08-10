import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginScreen from './components/LoginScreen'
import ChatScreen from './components/ChatScreen'
import ComplaintScreen from './components/ComplaintScreen'
import SuggestionScreen from './components/SuggestionScreen'
import FloatingAvatar from './components/FloatingAvatar'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('login')
  const [user, setUser] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [selectedAvatar, setSelectedAvatar] = useState('assistant')

  // Load saved data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('chatApp_user')
    const savedHistory = localStorage.getItem('chatApp_history')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setCurrentScreen('chat')
    }
    
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('chatApp_user', JSON.stringify(userData))
    setCurrentScreen('chat')
  }

  const handleLogout = () => {
    setUser(null)
    setChatHistory([])
    localStorage.removeItem('chatApp_user')
    localStorage.removeItem('chatApp_history')
    setCurrentScreen('login')
  }

  const addMessage = (message) => {
    const newHistory = [...chatHistory, message]
    setChatHistory(newHistory)
    localStorage.setItem('chatApp_history', JSON.stringify(newHistory))
  }

  const screenVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentScreen === 'login' && (
          <motion.div
            key="login"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <LoginScreen onLogin={handleLogin} />
          </motion.div>
        )}
        
        {currentScreen === 'chat' && (
          <motion.div
            key="chat"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ChatScreen 
              user={user}
              chatHistory={chatHistory}
              onAddMessage={addMessage}
              onLogout={handleLogout}
              onNavigate={setCurrentScreen}
              selectedAvatar={selectedAvatar}
              onAvatarChange={setSelectedAvatar}
            />
          </motion.div>
        )}
        
        {currentScreen === 'complaints' && (
          <motion.div
            key="complaints"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ComplaintScreen 
              user={user}
              onNavigate={setCurrentScreen}
            />
          </motion.div>
        )}
        
        {currentScreen === 'suggestions' && (
          <motion.div
            key="suggestions"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <SuggestionScreen 
              user={user}
              onNavigate={setCurrentScreen}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Avatar - hanya tampil di chat screen */}
      {currentScreen === 'chat' && (
        <FloatingAvatar 
          avatar={selectedAvatar}
          isActive={chatHistory.length > 0}
        />
      )}
    </div>
  )
}

export default App
