import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, Filter, Clock, AlertCircle, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react'
import './ComplaintScreen.css'

const ComplaintScreen = ({ user, onBack }) => {
  const [complaints, setComplaints] = useState([])
  const [filteredComplaints, setFilteredComplaints] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  // Sample complaints data
  useEffect(() => {
    const sampleComplaints = [
      {
        id: 1,
        customerName: 'Budi Santoso',
        email: 'budi.santoso@email.com',
        subject: 'Masalah Login Aplikasi',
        description: 'Saya tidak bisa login ke aplikasi sejak kemarin. Sudah mencoba reset password tapi tetap tidak bisa masuk.',
        status: 'open',
        priority: 'high',
        category: 'Technical',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        assignedTo: user.name,
        responses: []
      },
      {
        id: 2,
        customerName: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@email.com',
        subject: 'Pembayaran Tidak Terproses',
        description: 'Pembayaran saya sudah dipotong dari rekening tapi status pesanan masih pending. Mohon bantuan untuk mengecek.',
        status: 'in_progress',
        priority: 'high',
        category: 'Payment',
        createdAt: '2024-01-14T15:45:00Z',
        updatedAt: '2024-01-15T09:20:00Z',
        assignedTo: user.name,
        responses: [
          {
            id: 1,
            message: 'Terima kasih atas laporannya. Kami sedang mengecek status pembayaran Anda.',
            timestamp: '2024-01-14T16:00:00Z',
            sender: 'agent'
          }
        ]
      },
      {
        id: 3,
        customerName: 'Ahmad Wijaya',
        email: 'ahmad.wijaya@email.com',
        subject: 'Fitur Tidak Berfungsi',
        description: 'Fitur export data tidak berfungsi dengan baik. Selalu muncul error ketika mencoba download.',
        status: 'resolved',
        priority: 'medium',
        category: 'Feature',
        createdAt: '2024-01-13T11:20:00Z',
        updatedAt: '2024-01-14T14:30:00Z',
        assignedTo: user.name,
        responses: [
          {
            id: 1,
            message: 'Masalah telah diperbaiki. Silakan coba lagi fitur export data.',
            timestamp: '2024-01-14T14:30:00Z',
            sender: 'agent'
          }
        ]
      },
      {
        id: 4,
        customerName: 'Maya Sari',
        email: 'maya.sari@email.com',
        subject: 'Permintaan Refund',
        description: 'Saya ingin mengajukan refund untuk pembelian bulan lalu karena tidak sesuai dengan yang diharapkan.',
        status: 'closed',
        priority: 'low',
        category: 'Refund',
        createdAt: '2024-01-12T09:15:00Z',
        updatedAt: '2024-01-13T16:45:00Z',
        assignedTo: user.name,
        responses: [
          {
            id: 1,
            message: 'Refund telah diproses dan akan masuk ke rekening Anda dalam 3-5 hari kerja.',
            timestamp: '2024-01-13T16:45:00Z',
            sender: 'agent'
          }
        ]
      }
    ]
    
    setComplaints(sampleComplaints)
    setFilteredComplaints(sampleComplaints)
  }, [user.name])

  // Filter complaints based on search and filters
  useEffect(() => {
    let filtered = complaints

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(complaint => 
        complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.priority === priorityFilter)
    }

    setFilteredComplaints(filtered)
  }, [complaints, searchTerm, statusFilter, priorityFilter])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={16} className="status-icon open" />
      case 'in_progress':
        return <Clock size={16} className="status-icon in-progress" />
      case 'resolved':
        return <CheckCircle size={16} className="status-icon resolved" />
      case 'closed':
        return <XCircle size={16} className="status-icon closed" />
      default:
        return <AlertCircle size={16} className="status-icon" />
    }
  }

  const getStatusText = (status) => {
    const statusTexts = {
      open: 'Terbuka',
      in_progress: 'Sedang Diproses',
      resolved: 'Selesai',
      closed: 'Ditutup'
    }
    return statusTexts[status] || status
  }

  const getPriorityClass = (priority) => {
    return `priority-${priority}`
  }

  const getPriorityText = (priority) => {
    const priorityTexts = {
      low: 'Rendah',
      medium: 'Sedang',
      high: 'Tinggi'
    }
    return priorityTexts[priority] || priority
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusChange = (complaintId, newStatus) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === complaintId 
          ? { ...complaint, status: newStatus, updatedAt: new Date().toISOString() }
          : complaint
      )
    )
  }

  const getComplaintStats = () => {
    const stats = {
      total: complaints.length,
      open: complaints.filter(c => c.status === 'open').length,
      in_progress: complaints.filter(c => c.status === 'in_progress').length,
      resolved: complaints.filter(c => c.status === 'resolved').length
    }
    return stats
  }

  const stats = getComplaintStats()

  return (
    <div className="complaint-screen">
      {/* Header */}
      <motion.div 
        className="complaint-header"
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
            <h1>Kelola Keluhan</h1>
            <p>Kelola dan tanggapi keluhan pelanggan</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="stats-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Keluhan</div>
        </div>
        <div className="stat-card open">
          <div className="stat-number">{stats.open}</div>
          <div className="stat-label">Terbuka</div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-number">{stats.in_progress}</div>
          <div className="stat-label">Diproses</div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Selesai</div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="search-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, atau subjek..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <motion.button
          className="filter-btn"
          onClick={() => setShowFilters(!showFilters)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter size={20} />
          Filter
        </motion.button>
      </motion.div>

      {/* Filter Options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filter-options"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Semua Status</option>
                <option value="open">Terbuka</option>
                <option value="in_progress">Sedang Diproses</option>
                <option value="resolved">Selesai</option>
                <option value="closed">Ditutup</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Prioritas:</label>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="all">Semua Prioritas</option>
                <option value="high">Tinggi</option>
                <option value="medium">Sedang</option>
                <option value="low">Rendah</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complaints List */}
      <motion.div 
        className="complaints-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="complaints-list">
          <AnimatePresence>
            {filteredComplaints.map((complaint, index) => (
              <motion.div
                key={complaint.id}
                className="complaint-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              >
                <div className="complaint-header-card">
                  <div className="complaint-info">
                    <h3>{complaint.subject}</h3>
                    <p className="customer-name">{complaint.customerName}</p>
                    <p className="customer-email">{complaint.email}</p>
                  </div>
                  
                  <div className="complaint-meta">
                    <div className="status-badge">
                      {getStatusIcon(complaint.status)}
                      <span>{getStatusText(complaint.status)}</span>
                    </div>
                    <div className={`priority-badge ${getPriorityClass(complaint.priority)}`}>
                      {getPriorityText(complaint.priority)}
                    </div>
                  </div>
                </div>
                
                <div className="complaint-description">
                  <p>{complaint.description}</p>
                </div>
                
                <div className="complaint-footer">
                  <div className="complaint-dates">
                    <span>Dibuat: {formatDate(complaint.createdAt)}</span>
                    <span>Diperbarui: {formatDate(complaint.updatedAt)}</span>
                  </div>
                  
                  <div className="complaint-actions">
                    <select 
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="open">Terbuka</option>
                      <option value="in_progress">Sedang Diproses</option>
                      <option value="resolved">Selesai</option>
                      <option value="closed">Ditutup</option>
                    </select>
                    
                    <motion.button
                      className="view-btn"
                      onClick={() => setSelectedComplaint(complaint)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye size={16} />
                      Lihat Detail
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredComplaints.length === 0 && (
            <motion.div
              className="no-complaints"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <MessageSquare size={48} className="no-complaints-icon" />
              <h3>Tidak ada keluhan ditemukan</h3>
              <p>Coba ubah filter atau kata kunci pencarian Anda.</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Complaint Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedComplaint(null)}
          >
            <motion.div
              className="complaint-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{selectedComplaint.subject}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedComplaint(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <div className="complaint-details">
                  <div className="detail-row">
                    <strong>Pelanggan:</strong> {selectedComplaint.customerName}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong> {selectedComplaint.email}
                  </div>
                  <div className="detail-row">
                    <strong>Kategori:</strong> {selectedComplaint.category}
                  </div>
                  <div className="detail-row">
                    <strong>Prioritas:</strong> 
                    <span className={`priority-text ${getPriorityClass(selectedComplaint.priority)}`}>
                      {getPriorityText(selectedComplaint.priority)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Status:</strong>
                    <div className="status-badge">
                      {getStatusIcon(selectedComplaint.status)}
                      <span>{getStatusText(selectedComplaint.status)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="complaint-description-full">
                  <h4>Deskripsi Keluhan:</h4>
                  <p>{selectedComplaint.description}</p>
                </div>
                
                {selectedComplaint.responses.length > 0 && (
                  <div className="complaint-responses">
                    <h4>Tanggapan:</h4>
                    {selectedComplaint.responses.map(response => (
                      <div key={response.id} className="response-item">
                        <p>{response.message}</p>
                        <span className="response-time">
                          {formatDate(response.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ComplaintScreen