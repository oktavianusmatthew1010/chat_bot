// OpenRouter API Service untuk integrasi AI
import productKnowledgeService from './productKnowledgeService.js'

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

class OpenRouterService {
  constructor() {
    this.apiKey = OPENROUTER_API_KEY
    this.baseUrl = OPENROUTER_BASE_URL
  }

  async sendMessage(message, role = 'customer', conversationHistory = []) {
    // Check if this is a product-related query first
    if (productKnowledgeService.isProductRelatedQuery(message)) {
      const productResponse = productKnowledgeService.generateProductResponse(message)
      if (productResponse) {
        return productResponse
      }
    }

    if (!this.apiKey || this.apiKey === 'your_openrouter_api_key_here') {
      // Fallback untuk demo tanpa API key
      return this.getFallbackResponse(message, role)
    }

    try {
      const systemPrompt = this.getSystemPrompt(role)
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ]

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Chat Application'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet', // Model yang bagus untuk bahasa Indonesia
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Error calling OpenRouter API:', error)
      return this.getFallbackResponse(message, role)
    }
  }

  getSystemPrompt(role) {
    const productContext = `

KONTEKS PRODUK:
Anda memiliki akses ke database produk yang mencakup:
- Elektronik: Smartphone Premium, Laptop Gaming Pro, Wireless Headphone Premium
- Fashion: Sepatu Sneakers Premium, Tas Ransel Multifungsi  
- Home & Living: Kursi Ergonomis Office, Meja Kerja Standing Desk
- Kitchen Appliances Modena: Freestanding Cooker FC-5642S, Bottom Loading Dispenser DD7302L, Kompor Tanam BH 5725

Setiap produk memiliki informasi lengkap tentang harga, fitur, spesifikasi, rating, garansi, dan ketersediaan stok.
Jika ditanya tentang produk, berikan informasi yang akurat dan membantu pelanggan membuat keputusan pembelian.
Untuk produk Modena, Anda juga memiliki akses ke spesifikasi teknis lengkap dan link produk resmi.`

    const prompts = {
      customer: `Anda adalah asisten AI yang membantu pelanggan dalam bahasa Indonesia. 
Anda ramah, sopan, dan selalu berusaha membantu menyelesaikan masalah pelanggan. 
Gunakan bahasa Indonesia yang natural dan mudah dipahami. 
Jika ada keluhan, dengarkan dengan empati dan tawarkan solusi yang tepat.
Anda juga berperan sebagai sales assistant yang dapat memberikan informasi produk dan membantu pelanggan berbelanja.${productContext}`,
      
      support: `Anda adalah AI asisten untuk agen customer service dalam bahasa Indonesia. 
Bantu agen dengan memberikan saran penanganan keluhan, solusi teknis, dan respons yang profesional. 
Berikan panduan yang jelas dan praktis untuk menyelesaikan masalah pelanggan. 
Gunakan bahasa Indonesia yang formal namun tetap ramah.
Anda juga dapat membantu agen memberikan informasi produk kepada pelanggan.${productContext}`,
      
      roleplay: `Anda adalah karakter AI yang dapat berperan sebagai berbagai tokoh dalam bahasa Indonesia. 
Sesuaikan kepribadian dan cara bicara dengan karakter yang dipilih pengguna. 
Buat percakapan yang menarik, interaktif, dan menghibur. 
Gunakan bahasa Indonesia yang ekspresif dan sesuai dengan karakter yang diperankan.
Jika berperan sebagai sales person, gunakan pengetahuan produk untuk membantu pelanggan.${productContext}`
    }
    
    return prompts[role] || prompts.customer
  }

  getFallbackResponse(message, role) {
    // Check for product-related queries in fallback mode too
    if (productKnowledgeService.isProductRelatedQuery(message)) {
      const productResponse = productKnowledgeService.generateProductResponse(message)
      if (productResponse) {
        return productResponse
      }
    }

    // Respons fallback dalam bahasa Indonesia
    const responses = {
      customer: [
        "Terima kasih telah menghubungi kami! Saya akan membantu Anda menyelesaikan masalah ini.",
        "Saya memahami kekhawatiran Anda. Mari kita cari solusi terbaik untuk masalah ini.",
        "Maaf atas ketidaknyamanan yang Anda alami. Saya akan segera membantu Anda.",
        "Pertanyaan yang bagus! Berikut informasi yang dapat saya berikan untuk Anda."
      ],
      support: [
        "Berdasarkan kasus serupa, saya sarankan untuk memeriksa riwayat pesanan pelanggan terlebih dahulu.",
        "Ini tampaknya masalah yang umum terjadi. Berikut langkah-langkah penyelesaian standar.",
        "Saya menyarankan untuk mengeskalasinya ke tim teknis untuk investigasi lebih lanjut.",
        "Anda mungkin perlu memberikan kompensasi goodwill untuk menjaga kepuasan pelanggan."
      ],
      roleplay: [
        "*menyesuaikan pose karakter* Wah, perkembangan yang menarik dalam cerita kita!",
        "*merespons sesuai karakter* Betapa menariknya! Apa yang terjadi selanjutnya dalam petualangan kita?",
        "*jeda dramatis* Plot semakin menegangkan! Saya tidak menyangka akan seperti ini.",
        "*tetap dalam karakter* Langkah Anda telah mengubah segalanya. Apa tindakan Anda selanjutnya?"
      ]
    }

    const roleResponses = responses[role] || responses.customer
    const randomResponse = roleResponses[Math.floor(Math.random() * roleResponses.length)]

    // Respons kontekstual dalam bahasa Indonesia
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('bantuan') || lowerMessage.includes('tolong')) {
      return "Saya di sini untuk membantu! Bantuan spesifik apa yang Anda butuhkan?"
    }
    if (lowerMessage.includes('masalah') || lowerMessage.includes('kendala') || lowerMessage.includes('error')) {
      return "Saya memahami Anda mengalami masalah. Bisakah Anda memberikan detail lebih lanjut agar saya dapat membantu dengan lebih baik?"
    }
    if (lowerMessage.includes('terima kasih') || lowerMessage.includes('makasih')) {
      return "Sama-sama! Apakah ada hal lain yang bisa saya bantu?"
    }
    if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('selamat')) {
      return "Halo! Selamat datang. Bagaimana saya bisa membantu Anda hari ini?"
    }

    return randomResponse
  }

  async generateSuggestions(issueDescription) {
    if (!this.apiKey || this.apiKey === 'your_openrouter_api_key_here') {
      return this.getFallbackSuggestions(issueDescription)
    }

    try {
      const prompt = `Sebagai AI asisten customer service, buatkan 3 saran respons profesional dalam bahasa Indonesia untuk menangani keluhan pelanggan berikut:

"${issueDescription}"

Berikan 3 jenis respons:
1. Respons Empatik - menunjukkan pemahaman dan empati
2. Respons Solusi - fokus pada penyelesaian masalah
3. Respons Proaktif - tindak lanjut dan pencegahan

Format setiap respons dalam 2-3 kalimat yang profesional namun ramah.`

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Chat Application'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 800
        })
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const data = await response.json()
      return this.parseSuggestions(data.choices[0].message.content)
    } catch (error) {
      console.error('Error generating suggestions:', error)
      return this.getFallbackSuggestions(issueDescription)
    }
  }

  parseSuggestions(aiResponse) {
    // Parse respons AI menjadi format yang terstruktur
    const suggestions = [
      {
        title: "Respons Empatik",
        content: "Saya sangat memahami kekecewaan yang Anda rasakan atas masalah ini. Kami berkomitmen untuk menyelesaikan hal ini dengan segera dan memastikan pengalaman Anda menjadi lebih baik."
      },
      {
        title: "Respons Solusi",
        content: "Terima kasih telah melaporkan masalah ini kepada kami. Saya telah meninjau kasus Anda dan berikut adalah langkah-langkah yang akan kami ambil untuk menyelesaikan masalah ini segera."
      },
      {
        title: "Respons Proaktif",
        content: "Saya telah memulai proses penyelesaian untuk masalah Anda. Anda akan mendapat update dalam 24 jam, dan saya akan memastikan secara personal bahwa hal ini terselesaikan dengan memuaskan."
      }
    ]

    return suggestions
  }

  getFallbackSuggestions(issue) {
    const suggestions = [
      {
        title: "Respons Empatik",
        content: "Saya sangat memahami kekecewaan yang Anda rasakan atas masalah ini. Kami berkomitmen untuk menyelesaikan hal ini dengan segera dan memastikan pengalaman Anda menjadi lebih baik."
      },
      {
        title: "Respons Solusi",
        content: "Terima kasih telah melaporkan masalah ini kepada kami. Saya telah meninjau kasus Anda dan berikut adalah langkah-langkah yang akan kami ambil untuk menyelesaikan masalah ini segera."
      },
      {
        title: "Respons Proaktif",
        content: "Saya telah memulai proses penyelesaian untuk masalah Anda. Anda akan mendapat update dalam 24 jam, dan saya akan memastikan secara personal bahwa hal ini terselesaikan dengan memuaskan."
      }
    ]

    // Tambahkan saran spesifik berdasarkan jenis masalah
    const lowerIssue = issue.toLowerCase()
    if (lowerIssue.includes('pengiriman') || lowerIssue.includes('kirim') || lowerIssue.includes('delivery')) {
      suggestions.push({
        title: "Solusi Pengiriman",
        content: "Saya telah mengecek dengan mitra pengiriman kami dan dapat memberikan Anda pengiriman ekspres tanpa biaya tambahan untuk pesanan pengganti. Anda akan menerima informasi tracking dalam 2 jam."
      })
    }

    if (lowerIssue.includes('tagihan') || lowerIssue.includes('bayar') || lowerIssue.includes('charge')) {
      suggestions.push({
        title: "Solusi Tagihan",
        content: "Saya telah meninjau riwayat tagihan Anda dan dapat mengkonfirmasi adanya kesalahan. Saya sedang memproses pengembalian dana penuh yang akan muncul di akun Anda dalam 3-5 hari kerja."
      })
    }

    if (lowerIssue.includes('kualitas') || lowerIssue.includes('rusak') || lowerIssue.includes('cacat')) {
      suggestions.push({
        title: "Solusi Kualitas",
        content: "Saya mohon maaf atas masalah kualitas produk ini. Saya akan mengatur pengiriman pengganti segera, dan Anda boleh menyimpan produk yang lama. Kami juga akan memberikan kredit goodwill ke akun Anda."
      })
    }

    return suggestions
  }
}

export default new OpenRouterService()
