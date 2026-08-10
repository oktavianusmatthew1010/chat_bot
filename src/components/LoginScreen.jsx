import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, User, Headphones, Theater } from 'lucide-react'
import './LoginScreen.css'

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const roles = [
    {
      id: 'customer',
      title: 'Pelanggan',
      description: 'Dapatkan bantuan dan dukungan',
      icon: User,
      color: '#667eea'
    },
    {
      id: 'support',
      title: 'Agen Support',
      description: 'Bantu pelanggan dan kelola keluhan',
      icon: Headphones,
      color: '#764ba2'
    },
    {
      id: 'roleplay',
      title: 'Roleplay',
      description: 'Percakapan karakter interaktif',
      icon: Theater,
      color: '#f093fb'
    }
  ]

  const handleLogin = async () => {
    if (!username.trim()) {
      alert('Silakan masukkan nama Anda')
      return
    }

    if (!selectedRole) {
      alert('Silakan pilih peran Anda')
      return
    }

    setIsLoading(true)
    
    // Simulasi loading
    setTimeout(() => {
      const userData = {
        name: username.trim(),
        role: selectedRole,
        loginTime: new Date().toISOString()
      }
      
      onLogin(userData)
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="login-screen">
      <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="login-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <MessageCircle size={48} className="logo-icon" />
          <h1>AI Chat Hub</h1>
          <p>Pilih peran Anda untuk memulai</p>
        </motion.div>

        <motion.div 
          className="role-selection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {roles.map((role, index) => {
            const IconComponent = role.icon
            return (
              <motion.div
                key={role.id}
                className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
                onClick={() => setSelectedRole(role.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: `0 10px 25px ${role.color}40` 
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  '--role-color': role.color
                }}
              >
                <IconComponent size={40} className="role-icon" />
                <h3>{role.title}</h3>
                <p>{role.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div 
          className="login-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="input-group">
            <input
              type="text"
              placeholder="Masukkan nama Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="username-input"
              maxLength={50}
            />
          </div>
          
          <motion.button
            className="login-button"
            onClick={handleLogin}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              'Mulai Chat'
            )}
          </motion.button>
        </motion.div>

        <motion.div 
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p>Powered by OpenRouter AI • Bahasa Indonesia</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginScreen