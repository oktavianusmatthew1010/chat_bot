const OPENAI_API_KEY = 'sk-proj-demo-key-placeholder'
const OPENAI_BASE_URL = 'https://api.openai.com'

class NewportAIService {
  constructor() {
    this.apiKey = OPENAI_API_KEY
    this.baseUrl = OPENAI_BASE_URL
  }

  async generateAvatar(prompt, options = {}) {
    try {
      // For demo purposes, return a placeholder image URL
      // In production, you would use a real API key and make the actual API call
      console.log('Demo mode: Would generate avatar with prompt:', prompt)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Return a placeholder avatar image
      const placeholderAvatars = [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
      ]
      
      const randomIndex = Math.floor(Math.random() * placeholderAvatars.length)
      return placeholderAvatars[randomIndex]

      // This is handled in the demo implementation above
    } catch (error) {
      console.error('Error generating avatar with Newport AI:', error)
      return null
    }
  }

  async generateAvatarByRole(role, userPreferences = {}) {
    const basePrompts = {
      customer: 'Professional portrait of a friendly customer service representative, warm smile, approachable demeanor',
      support: 'Professional portrait of a helpful technical support specialist, confident and knowledgeable expression',
      roleplay: 'Creative portrait of a versatile character, adaptable and engaging personality'
    }

    let prompt = basePrompts[role] || basePrompts.customer

    // Add user preferences to the prompt
    if (userPreferences.hijab) {
      prompt += ', wearing a hijab, modest and elegant styling'
    }
    if (userPreferences.skinTone) {
      prompt += `, ${userPreferences.skinTone} skin tone`
    }
    if (userPreferences.style) {
      prompt += `, ${userPreferences.style} style`
    }

    prompt += ', high quality portrait, professional lighting, clean background'

    return await this.generateAvatar(prompt, {
      size: '512x512',
      quality: 'hd'
    })
  }

  async generateHijabAvatar(role = 'customer', customPrompt = '') {
    const hijabPrompt = customPrompt || 
      `Professional portrait of a ${role === 'customer' ? 'friendly customer service representative' : 
       role === 'support' ? 'helpful technical support specialist' : 'versatile character'} ` +
      'wearing a black hijab, warm brown eyes, natural makeup, professional appearance, ' +
      'high quality portrait, soft lighting, clean white background, photorealistic'

    return await this.generateAvatar(hijabPrompt, {
      size: '512x512',
      quality: 'hd'
    })
  }
}

export default new NewportAIService()