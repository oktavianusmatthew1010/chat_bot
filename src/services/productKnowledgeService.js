class ProductKnowledgeService {
  constructor() {
    this.productDatabase = {
      // Kategori Elektronik
      'smartphone': {
        name: 'Smartphone Premium',
        category: 'Elektronik',
        price: 'Rp 8.500.000 - Rp 15.000.000',
        features: [
          'Kamera 108MP dengan AI Photography',
          'Layar AMOLED 6.7 inch 120Hz',
          'Processor Snapdragon 8 Gen 2',
          'RAM 12GB + Storage 256GB',
          'Battery 5000mAh dengan fast charging 67W',
          'Wireless charging dan reverse charging',
          '5G Ready'
        ],
        warranty: '2 tahun garansi resmi',
        availability: 'Tersedia dalam stok'
      },
      'laptop': {
        name: 'Laptop Gaming Pro',
        category: 'Elektronik',
        price: 'Rp 18.000.000 - Rp 35.000.000',
        features: [
          'Intel Core i7-13700H atau AMD Ryzen 7 7700H',
          'NVIDIA RTX 4060/4070 Graphics',
          'RAM 16GB DDR5 (upgradeable to 32GB)',
          'SSD NVMe 1TB',
          'Layar 15.6" FHD 144Hz IPS',
          'Keyboard RGB Backlit',
          'Cooling system advanced'
        ],
        warranty: '2 tahun garansi internasional',
        availability: 'Pre-order (estimasi 1-2 minggu)'
      },
      'headphone': {
        name: 'Wireless Headphone Premium',
        category: 'Audio',
        price: 'Rp 2.500.000 - Rp 4.500.000',
        features: [
          'Active Noise Cancellation (ANC)',
          'Hi-Res Audio certified',
          'Battery life 30 jam dengan ANC off',
          'Quick charge 15 menit = 3 jam playback',
          'Bluetooth 5.3 dengan multipoint connection',
          'Touch controls dan voice assistant',
          'Foldable design dengan carrying case'
        ],
        warranty: '1 tahun garansi resmi',
        availability: 'Tersedia dalam stok'
      },
      
      // Kategori Fashion
      'sepatu': {
        name: 'Sepatu Sneakers Premium',
        category: 'Fashion',
        price: 'Rp 1.200.000 - Rp 2.800.000',
        features: [
          'Upper material kulit premium atau mesh breathable',
          'Sole technology untuk comfort maksimal',
          'Design limited edition',
          'Tersedia ukuran 36-45',
          'Colorway eksklusif',
          'Packaging premium dengan dust bag'
        ],
        warranty: '6 bulan garansi manufacturing defect',
        availability: 'Limited stock - berbagai ukuran'
      },
      'tas': {
        name: 'Tas Ransel Multifungsi',
        category: 'Fashion',
        price: 'Rp 800.000 - Rp 1.500.000',
        features: [
          'Material water-resistant',
          'Laptop compartment hingga 15.6"',
          'USB charging port built-in',
          'Anti-theft zipper design',
          'Ergonomic shoulder straps',
          'Multiple pockets dan organizer',
          'Reflective strips untuk safety'
        ],
        warranty: '1 tahun garansi material dan jahitan',
        availability: 'Tersedia dalam stok'
      },
      
      // Kategori Home & Living
      'kursi': {
        name: 'Kursi Ergonomis Office',
        category: 'Home & Living',
        price: 'Rp 2.000.000 - Rp 4.500.000',
        features: [
          'Ergonomic design dengan lumbar support',
          'Adjustable height dan armrest',
          'Mesh backrest untuk ventilasi',
          'Seat cushion memory foam',
          'Base aluminium dengan smooth casters',
          'Tilt mechanism dengan lock',
          'Weight capacity hingga 120kg'
        ],
        warranty: '3 tahun garansi mechanism, 1 tahun fabric',
        availability: 'Tersedia dalam stok'
      },
      'meja': {
        name: 'Meja Kerja Standing Desk',
        category: 'Home & Living',
        price: 'Rp 3.500.000 - Rp 6.000.000',
        features: [
          'Electric height adjustment 70-120cm',
          'Desktop solid wood atau engineered wood',
          'Memory preset untuk 3 posisi',
          'Cable management system',
          'Anti-collision technology',
          'Quiet motor operation <50dB',
          'Weight capacity 80kg'
        ],
        warranty: '5 tahun garansi motor, 2 tahun elektronik',
        availability: 'Pre-order (estimasi 2-3 minggu)'
      },
      
      // Kategori Modena Kitchen Appliances
      'freestanding-cooker': {
        id: 'MOD-FC5642S',
        name: 'Modena Freestanding Cooker FC-5642S',
        category: 'Kompor + Oven',
        price: 'Rp 15.499.000',
        features: [
          '4 tungku gas dengan api biru',
          'Oven kapasitas besar 64L',
          'Timer mekanis',
          'Safety device untuk gas',
          'Material stainless steel anti karat'
        ],
        specifications: {
          dimension: '60 x 60 x 85 cm',
          weight: '42 kg',
          capacity: 'Oven 64 L',
          power: '220V / 50Hz',
          material: 'Stainless steel + kaca tempered',
          fuel_type: 'Gas + Listrik (oven)'
        },
        rating: 4.7,
        warranty: 'Garansi resmi Modena',
        availability: 'Tersedia dalam stok',
        url: 'https://www.modena.com/id_id/fc5642s',
        image: 'https://www.modena.com/media/catalog/product/f/c/fc-5642s_1.jpg'
      },
      'dispenser': {
        id: 'MOD-DD7302L',
        name: 'Modena Bottom Loading Dispenser DD7302L',
        category: 'Dispenser',
        price: 'Rp 3.175.000',
        features: [
          'Galon bawah (bottom loading)',
          'Child lock untuk air panas',
          'Pendinginan cepat',
          'Desain elegan minimalis',
          'Tangki stainless steel higienis'
        ],
        specifications: {
          dimension: '31 x 37 x 104 cm',
          weight: '17 kg',
          capacity: 'Tangki panas 1.7 L, dingin 3.2 L',
          power: '420W (heating), 100W (cooling)',
          material: 'Plastic + stainless steel',
          fuel_type: 'Electric'
        },
        rating: 4.8,
        warranty: 'Garansi resmi Modena',
        availability: 'Tersedia dalam stok',
        url: 'https://www.modena.com/id_id/dd7302l',
        image: 'https://www.modena.com/media/catalog/product/d/d/dd-7302l_1.jpg'
      },
      'kompor-tanam': {
        id: 'MOD-BH5725',
        name: 'Modena Kompor Tanam 2 Tungku BH 5725',
        category: 'Kompor Tanam',
        price: 'Rp 2.899.000',
        features: [
          '2 tungku gas',
          'Material kaca tempered hitam',
          'Pengapian otomatis',
          'Safety device cut-off gas',
          'Knob kontrol ergonomis'
        ],
        specifications: {
          dimension: '76 x 45 x 12 cm',
          weight: '12 kg',
          capacity: 'N/A',
          power: 'Manual ignition (gas)',
          material: 'Tempered glass + besi',
          fuel_type: 'Gas'
        },
        rating: 4.5,
        warranty: 'Garansi resmi Modena',
        availability: 'Tersedia dalam stok',
        url: 'https://www.modena.com/id_id/bh5725',
        image: 'https://www.modena.com/media/catalog/product/b/h/bh-5725_1.jpg'
      }
    };
    
    this.categories = {
      'elektronik': ['smartphone', 'laptop', 'headphone'],
      'fashion': ['sepatu', 'tas'],
      'home': ['kursi', 'meja'],
      'living': ['kursi', 'meja'],
      'kitchen': ['freestanding-cooker', 'dispenser', 'kompor-tanam'],
      'modena': ['freestanding-cooker', 'dispenser', 'kompor-tanam'],
      'kompor': ['freestanding-cooker', 'kompor-tanam'],
      'oven': ['freestanding-cooker'],
      'dapur': ['freestanding-cooker', 'dispenser', 'kompor-tanam']
    };
    
    this.commonQuestions = {
      'harga': 'Untuk informasi harga terbaru dan promo yang sedang berlangsung',
      'garansi': 'Semua produk kami dilengkapi dengan garansi resmi',
      'pengiriman': 'Kami menyediakan pengiriman ke seluruh Indonesia dengan berbagai pilihan ekspedisi',
      'pembayaran': 'Tersedia berbagai metode pembayaran: Transfer Bank, E-wallet, Kartu Kredit, dan Cicilan 0%',
      'return': 'Kebijakan return 7 hari untuk produk yang tidak sesuai atau cacat',
      'stok': 'Untuk ketersediaan stok real-time, silakan hubungi customer service kami'
    };
  }
  
  searchProduct(query) {
    const searchTerm = query.toLowerCase();
    const results = [];
    
    // Search in product database
    Object.keys(this.productDatabase).forEach(key => {
      const product = this.productDatabase[key];
      if (key.includes(searchTerm) || 
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)) {
        results.push({ key, ...product });
      }
    });
    
    // Search in categories
    if (this.categories[searchTerm]) {
      this.categories[searchTerm].forEach(productKey => {
        if (!results.find(r => r.key === productKey)) {
          results.push({ key: productKey, ...this.productDatabase[productKey] });
        }
      });
    }
    
    return results;
  }
  
  getProductInfo(productKey) {
    return this.productDatabase[productKey] || null;
  }
  
  generateProductResponse(query) {
    const searchResults = this.searchProduct(query);
    
    if (searchResults.length === 0) {
      return this.generateGeneralResponse(query);
    }
    
    if (searchResults.length === 1) {
      return this.generateSingleProductResponse(searchResults[0]);
    }
    
    return this.generateMultipleProductResponse(searchResults);
  }
  
  generateSingleProductResponse(product) {
    let response = `🛍️ **${product.name}**\n\n`;
    
    // Add product image if available
    if (product.image) {
      response += `📸 **Gambar Produk:**\n![${product.name}](${product.image})\n\n`;
    }
    
    response += `📱 **Kategori:** ${product.category}\n` +
                `💰 **Harga:** ${product.price}\n`;
    
    // Add rating if available
    if (product.rating) {
      const stars = '⭐'.repeat(Math.floor(product.rating));
      response += `${stars} **Rating:** ${product.rating}/5\n`;
    }
    
    response += `\n✨ **Fitur Unggulan:**\n${product.features.map(f => `• ${f}`).join('\n')}\n`;
    
    // Add specifications if available
    if (product.specifications) {
      response += `\n📋 **Spesifikasi:**\n`;
      Object.entries(product.specifications).forEach(([key, value]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        response += `• **${label}:** ${value}\n`;
      });
    }
    
    response += `\n🛡️ **Garansi:** ${product.warranty}\n` +
                `📦 **Ketersediaan:** ${product.availability}\n`;
    
    // Add product URL if available
    if (product.url) {
      response += `🔗 **Info Lengkap:** ${product.url}\n`;
    }
    
    response += `\nApakah ada yang ingin Anda tanyakan lebih lanjut tentang produk ini? 😊`;
    
    return response;
  }
  
  generateMultipleProductResponse(products) {
    let response = `🛍️ **Saya menemukan beberapa produk yang mungkin Anda cari:**\n\n`;
    
    products.slice(0, 3).forEach((product, index) => {
      response += `**${index + 1}. ${product.name}**\n`;
      
      // Add product image if available
      if (product.image) {
        response += `![${product.name}](${product.image})\n`;
      }
      
      response += `💰 **Harga:** ${product.price}\n`;
      
      // Add rating if available
      if (product.rating) {
        const stars = '⭐'.repeat(Math.floor(product.rating));
        response += `${stars} **Rating:** ${product.rating}/5\n`;
      }
      
      response += `📦 **Ketersediaan:** ${product.availability}\n`;
      
      // Add product URL if available
      if (product.url) {
        response += `🔗 [Info Lengkap](${product.url})\n`;
      }
      
      response += `\n`;
    });
    
    response += `Produk mana yang ingin Anda ketahui lebih detail? Atau ada spesifikasi khusus yang Anda cari? 😊`;
    
    return response;
  }
  
  generateGeneralResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    // Check for common questions
    for (const [key, value] of Object.entries(this.commonQuestions)) {
      if (lowerQuery.includes(key)) {
        return `ℹ️ **Informasi ${key.charAt(0).toUpperCase() + key.slice(1)}**\n\n${value}.\n\nAda yang bisa saya bantu lebih lanjut? 😊`;
      }
    }
    
    // Default response for product inquiries
    return `🤔 Maaf, saya tidak menemukan produk spesifik yang Anda cari.\n\n` +
           `📋 **Kategori produk yang tersedia:**\n` +
           `• 📱 Elektronik (Smartphone, Laptop, Headphone)\n` +
           `• 👕 Fashion (Sepatu, Tas)\n` +
           `• 🏠 Home & Living (Kursi, Meja)\n` +
           `• 🍳 Kitchen Appliances Modena (Kompor + Oven, Dispenser, Kompor Tanam)\n\n` +
           `Silakan sebutkan kategori atau nama produk yang lebih spesifik, atau tanyakan tentang harga, garansi, pengiriman, dll. 😊`;
  }
  
  isProductRelatedQuery(query) {
    const productKeywords = [
      'produk', 'harga', 'beli', 'jual', 'stok', 'tersedia', 'garansi',
      'smartphone', 'laptop', 'headphone', 'sepatu', 'tas', 'kursi', 'meja',
      'elektronik', 'fashion', 'home', 'living', 'spesifikasi', 'fitur',
      'pembayaran', 'pengiriman', 'return', 'cicilan', 'promo', 'diskon',
      // Modena product keywords
      'modena', 'kompor', 'oven', 'dispenser', 'dapur', 'kitchen', 'cooker',
      'freestanding', 'tanam', 'tungku', 'gas', 'listrik', 'stainless',
      'fc5642s', 'dd7302l', 'bh5725', 'bottom loading', 'child lock',
      'tempered glass', 'pengapian', 'safety device'
    ];
    
    const lowerQuery = query.toLowerCase();
    return productKeywords.some(keyword => lowerQuery.includes(keyword));
  }
}

export default new ProductKnowledgeService();