import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers'
import Loader from '../components/common/Loader'
import StarRating from '../components/common/StarRating'
import toast from 'react-hot-toast'
import {
  FaHome, FaUsers, FaMapMarkedAlt, FaHotel, FaPlane, FaCar, FaBookmark,
  FaCreditCard, FaTag, FaStar, FaEdit, FaChartBar, FaCog,
  FaPlus, FaTrash, FaEye, FaCheck, FaTimes, FaSearch, FaFilter,
  FaToggleOn, FaToggleOff, FaDownload, FaChevronLeft, FaChevronRight,
  FaRegCalendarCheck, FaMoneyBillWave, FaShoppingCart, FaGlobe,
  FaUserCheck, FaStarHalfAlt, FaPercent, FaImage, FaPhone, FaEnvelope,
  FaCalendarAlt, FaDollarSign, FaMapPin, FaClock, FaChartLine
} from 'react-icons/fa'

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FaHome },
  { id: 'users', label: 'Manage Users', icon: FaUsers },
  { id: 'tours', label: 'Manage Tours', icon: FaMapMarkedAlt },
  { id: 'hotels', label: 'Manage Hotels', icon: FaHotel },
  { id: 'flights', label: 'Manage Flights', icon: FaPlane },
  { id: 'cars', label: 'Manage Cars', icon: FaCar },
  { id: 'bookings', label: 'Manage Bookings', icon: FaBookmark },
  { id: 'payments', label: 'Manage Payments', icon: FaCreditCard },
  { id: 'coupons', label: 'Manage Coupons', icon: FaTag },
  { id: 'reviews', label: 'Manage Reviews', icon: FaStar },
  { id: 'blog', label: 'Blog Posts', icon: FaEdit },
  { id: 'reports', label: 'Sales Reports', icon: FaChartBar },
  { id: 'settings', label: 'Settings', icon: FaCog },
]

const statusBadge = (status) => {
  const colors = {
    Active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    Inactive: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    Confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    Paid: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    Refunded: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
    Failed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    Published: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    Draft: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400',
  }
  return colors[status] || colors.Pending
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [stats, setStats] = useState({
    totalUsers: 0, totalBookings: 0, totalTours: 0, totalRevenue: 0,
    todaysBookings: 0, pendingReviews: 0, activeCoupons: 0,
  })
  const [users, setUsers] = useState([])
  const [tours, setTours] = useState([])
  const [hotels, setHotels] = useState([])
  const [flights, setFlights] = useState([])
  const [cars, setCars] = useState([])
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [coupons, setCoupons] = useState([])
  const [reviews, setReviews] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [bookingTab, setBookingTab] = useState('All')
  const [recentBookings, setRecentBookings] = useState([])
  const [popularTours, setPopularTours] = useState([])

  const [showAddModal, setShowAddModal] = useState(null)
  const [showEditModal, setShowEditModal] = useState(null)
  const [modalForm, setModalForm] = useState({})

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [
        usersRes, toursRes, hotelsRes, flightsRes, carsRes,
        bookingsRes, paymentsRes, couponsRes, reviewsRes, blogRes
      ] = await Promise.all([
        API.get('/users'),
        API.get('/tours'),
        API.get('/hotels'),
        API.get('/flights'),
        API.get('/cars'),
        API.get('/bookings'),
        API.get('/payments'),
        API.get('/coupons'),
        API.get('/reviews'),
        API.get('/blog'),
      ])

      const u = usersRes.data?.data || usersRes.data || []
      const t = toursRes.data?.data || toursRes.data || []
      const h = hotelsRes.data?.data || hotelsRes.data || []
      const f = flightsRes.data?.data || flightsRes.data || []
      const c = carsRes.data?.data || carsRes.data || []
      const b = bookingsRes.data?.data || bookingsRes.data || []
      const p = paymentsRes.data?.data || paymentsRes.data || []
      const co = couponsRes.data?.data || couponsRes.data || []
      const r = reviewsRes.data?.data || reviewsRes.data || []
      const bl = blogRes.data?.data || blogRes.data || []

      setUsers(u); setTours(t); setHotels(h); setFlights(f); setCars(c)
      setBookings(b); setPayments(p); setCoupons(co); setReviews(r); setBlogPosts(bl)
      setRecentBookings(b.slice(0, 5))
      setPopularTours(t.sort((a, b) => (b.bookings || 0) - (a.bookings || 0)).slice(0, 5))

      const totalRevenue = p.filter(py => py.status === 'Paid').reduce((sum, py) => sum + (py.amount || 0), 0)
      const today = new Date().toDateString()
      setStats({
        totalUsers: u.length,
        totalBookings: b.length,
        totalTours: t.length,
        totalRevenue,
        todaysBookings: b.filter(bk => new Date(bk.createdAt).toDateString() === today).length,
        pendingReviews: r.filter(rv => rv.status === 'Pending').length,
        activeCoupons: co.filter(cp => cp.isActive).length,
      })
    } catch (err) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (endpoint, id, label) => {
    if (!confirm(`Delete this ${label}?`)) return
    try {
      await API.delete(`/${endpoint}/${id}`)
      toast.success(`${label} deleted successfully`)
      fetchAllData()
    } catch (err) {
      toast.error(`Failed to delete ${label}`)
    }
  }

  const handleToggleFeatured = async (endpoint, id, current) => {
    try {
      await API.put(`/${endpoint}/${id}`, { featured: !current })
      toast.success('Updated successfully')
      fetchAllData()
    } catch (err) {
      toast.error('Failed to update')
    }
  }

  const handleToggleActive = async (endpoint, id, current) => {
    try {
      await API.put(`/${endpoint}/${id}`, { isActive: !current })
      toast.success('Updated successfully')
      fetchAllData()
    } catch (err) {
      toast.error('Failed to update')
    }
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = showAddModal || showEditModal?.type
      const id = showEditModal?.id
      const formData = new FormData()
      Object.entries(modalForm).forEach(([key, val]) => {
        if (val !== undefined && val !== null) formData.append(key, val)
      })

      if (id) {
        await API.put(`/${endpoint}/${id}`, modalForm)
        toast.success('Updated successfully')
      } else {
        await API.post(`/${endpoint}`, modalForm)
        toast.success('Created successfully')
      }
      setShowAddModal(null)
      setShowEditModal(null)
      setModalForm({})
      fetchAllData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    }
  }

  const handleApproveReview = async (id) => {
    try {
      await API.put(`/reviews/${id}`, { status: 'Approved' })
      toast.success('Review approved')
      fetchAllData()
    } catch (err) {
      toast.error('Failed to approve')
    }
  }

  const filteredBookings = bookingTab === 'All'
    ? bookings
    : bookings.filter(b => (b.status || '').toLowerCase() === bookingTab.toLowerCase())

  const filteredUsers = users.filter(u => {
    const match = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const roleMatch = !roleFilter || u.role === roleFilter
    return match && roleMatch
  })

  const renderSidebar = () => (
    <aside className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto z-40 w-64 flex-shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="h-full glass-card rounded-none lg:rounded-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-white/20 dark:border-gray-700/30">
          <h2 className="font-display font-bold text-xl gradient-text">Admin Panel</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user?.name}</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 text-left ${
                activeSection === item.id
                  ? 'gradient-bg text-white shadow-lg shadow-primary-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="text-base" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )

  const renderDashboard = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: FaUsers, color: 'from-blue-500 to-blue-600' },
          { label: 'Total Bookings', value: stats.totalBookings, icon: FaBookmark, color: 'from-green-500 to-green-600' },
          { label: 'Total Tours', value: stats.totalTours, icon: FaMapMarkedAlt, color: 'from-orange-500 to-red-500' },
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: FaMoneyBillWave, color: 'from-purple-500 to-pink-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <stat.icon />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-center">
              <FaChartLine className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 dark:text-gray-500 text-sm">Chart will render here</p>
              <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Total Revenue: {formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
          <div className="space-y-4">
            {[
              { label: "Today's Bookings", value: stats.todaysBookings, icon: FaRegCalendarCheck, color: 'text-blue-500' },
              { label: 'Pending Reviews', value: stats.pendingReviews, icon: FaStarHalfAlt, color: 'text-yellow-500' },
              { label: 'Active Coupons', value: stats.activeCoupons, icon: FaPercent, color: 'text-green-500' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <s.icon className={`text-lg ${s.color}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{s.label}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/20 dark:border-gray-700/30 text-gray-500 dark:text-gray-400">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.slice(0, 4).map(b => (
                  <tr key={b._id} className="border-b border-white/10 dark:border-gray-700/20">
                    <td className="py-3 font-mono text-gray-900 dark:text-white">#{b._id?.slice(-6)}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{b.user?.name || 'N/A'}</td>
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{formatCurrency(b.amount || b.totalPrice || 0)}</td>
                    <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(b.status)}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">Popular Tours</h2>
          <div className="space-y-3">
            {popularTours.slice(0, 5).map(t => (
              <div key={t._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <img src={getImageUrl(t.image)} alt={t.title} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{t.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.bookings || 0} bookings</p>
                </div>
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{formatCurrency(t.discountPrice || t.price || 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderTable = (items, columns, actions, type) => (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/20 dark:border-gray-700/30 text-sm text-gray-500 dark:text-gray-400">
              {columns.map(col => <th key={col.key} className="p-3 font-medium whitespace-nowrap">{col.label}</th>)}
              {actions && <th className="p-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="p-8 text-center text-gray-400 dark:text-gray-500">
                  No {type} found
                </td>
              </tr>
            ) : items.map((item, i) => (
              <motion.tr
                key={item._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-white/10 dark:border-gray-700/20 hover:bg-white/50 dark:hover:bg-gray-700/30 transition-colors"
              >
                {columns.map(col => (
                  <td key={col.key} className="p-3 text-sm whitespace-nowrap">
                    {col.render ? col.render(item) : item[col.key] ?? 'N/A'}
                  </td>
                ))}
                {actions && (
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {actions.edit && (
                        <button onClick={() => { setShowEditModal({ type, id: item._id }); setModalForm(item) }} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <FaEdit />
                        </button>
                      )}
                      {actions.delete && (
                        <button onClick={() => handleDelete(type, item._id, type)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <FaTrash />
                        </button>
                      )}
                      {actions.view && (
                        <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <FaEye />
                        </button>
                      )}
                      {actions.toggleFeatured && (
                        <button onClick={() => handleToggleFeatured(type, item._id, item.featured)} className={`p-1.5 rounded-lg transition-colors ${item.featured ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                          {item.featured ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                      )}
                      {actions.toggleActive && (
                        <button onClick={() => handleToggleActive(type, item._id, item.isActive)} className={`p-1.5 rounded-lg transition-colors ${item.isActive ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                          {item.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                      )}
                      {actions.approve && item.status !== 'Approved' && (
                        <button onClick={() => handleApproveReview(item._id)} className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                          <FaCheck />
                        </button>
                      )}
                      {actions.cancel && item.status === 'Confirmed' && (
                        <button onClick={() => handleDelete('bookings', item._id, 'booking')} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderSearchBar = () => (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="input-field !pl-10 !py-2.5 text-sm"
        />
      </div>
    </div>
  )

  const renderAddButton = (type) => (
    <button
      onClick={() => { setShowAddModal(type); setModalForm({}) }}
      className="btn-primary !py-2.5 !px-4 text-sm flex items-center gap-2"
    >
      <FaPlus /> Add {type}
    </button>
  )

  const renderFormModal = () => {
    const isOpen = showAddModal || showEditModal
    const type = showAddModal || showEditModal?.type
    if (!isOpen) return null

    const fields = getFormFields(type)
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => { setShowAddModal(null); setShowEditModal(null) }}
        >
          <motion.div
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            onClick={e => e.stopPropagation()}
            className="glass-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4">
              {showEditModal ? `Edit ${type}` : `Add ${type}`}
            </h3>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              {fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={modalForm[field.key] || ''}
                      onChange={e => setModalForm(p => ({ ...p, [field.key]: e.target.value }))}
                      className="input-field"
                      rows={3}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={modalForm[field.key] || ''}
                      onChange={e => setModalForm(p => ({ ...p, [field.key]: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select...</option>
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={modalForm[field.key] || ''}
                      onChange={e => setModalForm(p => ({ ...p, [field.key]: e.target.value }))}
                      className="input-field"
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowAddModal(null); setShowEditModal(null) }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{showEditModal ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  const getFormFields = (type) => {
    const base = [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ]
    const priceFields = [
      { key: 'price', label: 'Price', type: 'number' },
      { key: 'discountPrice', label: 'Discount Price', type: 'number' },
    ]
    switch (type) {
      case 'tours':
        return [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'destination', label: 'Destination', type: 'text' },
          { key: 'category', label: 'Category', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'price', label: 'Price', type: 'number' },
          { key: 'discountPrice', label: 'Discount Price', type: 'number' },
          { key: 'duration', label: 'Duration (days)', type: 'number' },
          { key: 'maxGroupSize', label: 'Max Group Size', type: 'number' },
        ]
      case 'hotels':
        return [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'location', label: 'Location', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'pricePerNight', label: 'Price Per Night', type: 'number' },
          { key: 'rating', label: 'Rating', type: 'number' },
          { key: 'amenities', label: 'Amenities (comma separated)', type: 'text' },
        ]
      case 'flights':
        return [
          { key: 'airline', label: 'Airline', type: 'text' },
          { key: 'flightNumber', label: 'Flight Number', type: 'text' },
          { key: 'from', label: 'Departure City', type: 'text' },
          { key: 'to', label: 'Arrival City', type: 'text' },
          { key: 'departureTime', label: 'Departure Time', type: 'text' },
          { key: 'arrivalTime', label: 'Arrival Time', type: 'text' },
          { key: 'price', label: 'Price', type: 'number' },
          { key: 'seats', label: 'Available Seats', type: 'number' },
        ]
      case 'cars':
        return [
          { key: 'title', label: 'Car Name', type: 'text' },
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'brand', label: 'Brand', type: 'text' },
          { key: 'pricePerDay', label: 'Price Per Day', type: 'number' },
          { key: 'seats', label: 'Seats', type: 'number' },
          { key: 'transmission', label: 'Transmission', type: 'select', options: ['Manual', 'Automatic'] },
        ]
      case 'coupons':
        return [
          { key: 'code', label: 'Coupon Code', type: 'text' },
          { key: 'discount', label: 'Discount (%)', type: 'number' },
          { key: 'minAmount', label: 'Min Amount', type: 'number' },
          { key: 'validUntil', label: 'Valid Until', type: 'date' },
        ]
      case 'blog':
        return [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'content', label: 'Content', type: 'textarea' },
          { key: 'category', label: 'Category', type: 'text' },
          { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
        ]
      case 'users':
        return [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'email', label: 'Email', type: 'email' },
          { key: 'phone', label: 'Phone', type: 'text' },
          { key: 'role', label: 'Role', type: 'select', options: ['user', 'admin'] },
        ]
      default:
        return base
    }
  }

  const renderUserSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Manage Users</h2>
        {renderAddButton('users')}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {renderSearchBar()}
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field !w-auto !py-2.5 text-sm">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {renderTable(
        filteredUsers,
        [
          { key: 'avatar', label: 'Avatar', render: (u) => (
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {u.avatar ? <img src={getImageUrl(u.avatar)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">{u.name?.charAt(0)}</div>}
            </div>
          )},
          { key: 'name', label: 'Name', render: (u) => <span className="font-medium text-gray-900 dark:text-white">{u.name}</span> },
          { key: 'email', label: 'Email', render: (u) => <span className="text-gray-500 dark:text-gray-400">{u.email}</span> },
          { key: 'phone', label: 'Phone', render: (u) => <span className="text-gray-500 dark:text-gray-400">{u.phone || 'N/A'}</span> },
          { key: 'role', label: 'Role', render: (u) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>
              {u.role}
            </span>
          )},
          { key: 'createdAt', label: 'Joined', render: (u) => <span className="text-gray-500 dark:text-gray-400">{u.createdAt ? formatDate(u.createdAt) : 'N/A'}</span> },
          { key: 'status', label: 'Status', render: (u) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
              {u.isActive !== false ? 'Active' : 'Inactive'}
            </span>
          )},
        ],
        { edit: true, delete: true },
        'users'
      )}
    </motion.div>
  )

  const renderTourSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Manage Tours</h2>
        {renderAddButton('tours')}
      </div>
      {renderSearchBar()}
      {renderTable(
        tours.filter(t => t.title?.toLowerCase().includes(searchTerm.toLowerCase())),
        [
          { key: 'image', label: 'Image', render: (t) => <img src={getImageUrl(t.image)} alt={t.title} className="w-12 h-8 rounded-lg object-cover" /> },
          { key: 'title', label: 'Title', render: (t) => <span className="font-medium text-gray-900 dark:text-white">{t.title}</span> },
          { key: 'destination', label: 'Destination', render: (t) => <span className="text-gray-500 dark:text-gray-400">{t.destination}</span> },
          { key: 'category', label: 'Category', render: (t) => <span className="text-gray-500 dark:text-gray-400 capitalize">{t.category}</span> },
          { key: 'price', label: 'Price', render: (t) => <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(t.discountPrice || t.price || 0)}</span> },
          { key: 'duration', label: 'Duration', render: (t) => <span className="text-gray-500 dark:text-gray-400">{t.duration}d</span> },
          { key: 'status', label: 'Status', render: (t) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.isActive !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
              {t.isActive !== false ? 'Active' : 'Inactive'}
            </span>
          )},
          { key: 'featured', label: 'Featured', render: (t) => t.featured ? <FaCheck className="text-green-500" /> : <FaTimes className="text-gray-400" /> },
        ],
        { edit: true, delete: true, toggleFeatured: true },
        'tours'
      )}
    </motion.div>
  )

  const renderHotelSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Manage Hotels</h2>
        {renderAddButton('hotels')}
      </div>
      {renderSearchBar()}
      {renderTable(
        hotels.filter(h => h.title?.toLowerCase().includes(searchTerm.toLowerCase())),
        [
          { key: 'image', label: 'Image', render: (h) => <img src={getImageUrl(h.image)} alt={h.title} className="w-12 h-8 rounded-lg object-cover" /> },
          { key: 'title', label: 'Title', render: (h) => <span className="font-medium text-gray-900 dark:text-white">{h.title}</span> },
          { key: 'location', label: 'Location', render: (h) => <span className="text-gray-500 dark:text-gray-400">{h.location}</span> },
          { key: 'pricePerNight', label: 'Price/Night', render: (h) => <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(h.pricePerNight || 0)}</span> },
          { key: 'rating', label: 'Rating', render: (h) => <StarRating rating={h.rating || 0} size="sm" /> },
          { key: 'status', label: 'Status', render: (h) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${h.isActive !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
              {h.isActive !== false ? 'Active' : 'Inactive'}
            </span>
          )},
        ],
        { edit: true, delete: true },
        'hotels'
      )}
    </motion.div>
  )

  const renderFlightSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Manage Flights</h2>
        {renderAddButton('flights')}
      </div>
      {renderSearchBar()}
      {renderTable(
        flights.filter(f => f.airline?.toLowerCase().includes(searchTerm.toLowerCase()) || f.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase())),
        [
          { key: 'airline', label: 'Airline', render: (f) => <span className="font-medium text-gray-900 dark:text-white">{f.airline}</span> },
          { key: 'flightNumber', label: 'Flight', render: (f) => <span className="font-mono text-gray-500 dark:text-gray-400">{f.flightNumber}</span> },
          { key: 'from', label: 'From', render: (f) => <span className="text-gray-500 dark:text-gray-400">{f.from}</span> },
          { key: 'to', label: 'To', render: (f) => <span className="text-gray-500 dark:text-gray-400">{f.to}</span> },
          { key: 'departureTime', label: 'Departure', render: (f) => <span className="text-gray-500 dark:text-gray-400">{f.departureTime}</span> },
          { key: 'arrivalTime', label: 'Arrival', render: (f) => <span className="text-gray-500 dark:text-gray-400">{f.arrivalTime}</span> },
          { key: 'price', label: 'Price', render: (f) => <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(f.price || 0)}</span> },
          { key: 'seats', label: 'Seats', render: (f) => <span className="text-gray-500 dark:text-gray-400">{f.seats || f.availableSeats || 0}</span> },
        ],
        { edit: true, delete: true },
        'flights'
      )}
    </motion.div>
  )

  const renderCarSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Manage Cars</h2>
        {renderAddButton('cars')}
      </div>
      {renderSearchBar()}
      {renderTable(
        cars.filter(c => c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || c.brand?.toLowerCase().includes(searchTerm.toLowerCase())),
        [
          { key: 'image', label: 'Image', render: (c) => <img src={getImageUrl(c.image)} alt={c.title} className="w-12 h-8 rounded-lg object-cover" /> },
          { key: 'title', label: 'Car', render: (c) => <span className="font-medium text-gray-900 dark:text-white">{c.title}</span> },
          { key: 'brand', label: 'Brand', render: (c) => <span className="text-gray-500 dark:text-gray-400">{c.brand}</span> },
          { key: 'type', label: 'Type', render: (c) => <span className="text-gray-500 dark:text-gray-400 capitalize">{c.type}</span> },
          { key: 'pricePerDay', label: 'Price/Day', render: (c) => <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(c.pricePerDay || 0)}</span> },
          { key: 'seats', label: 'Seats', render: (c) => <span className="text-gray-500 dark:text-gray-400">{c.seats}</span> },
          { key: 'transmission', label: 'Transmission', render: (c) => <span className="text-gray-500 dark:text-gray-400">{c.transmission}</span> },
        ],
        { edit: true, delete: true },
        'cars'
      )}
    </motion.div>
  )

  const renderBookingSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Manage Bookings</h2>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setBookingTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
              bookingTab === tab
                ? 'gradient-bg text-white shadow-lg'
                : 'glass text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderTable(
        filteredBookings,
        [
          { key: 'id', label: 'Booking ID', render: (b) => <span className="font-mono text-gray-900 dark:text-white">#{b._id?.slice(-8)}</span> },
          { key: 'user', label: 'User', render: (b) => <span className="text-gray-600 dark:text-gray-400">{b.user?.name || 'N/A'}</span> },
          { key: 'type', label: 'Type', render: (b) => <span className="capitalize text-gray-600 dark:text-gray-400">{b.type || b.bookingType || 'N/A'}</span> },
          { key: 'item', label: 'Item', render: (b) => <span className="text-gray-600 dark:text-gray-400">{b.title || b.item?.title || 'N/A'}</span> },
          { key: 'dates', label: 'Dates', render: (b) => (
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {b.startDate ? formatDate(b.startDate) : ''}{b.endDate ? ` - ${formatDate(b.endDate)}` : ''}
            </span>
          )},
          { key: 'amount', label: 'Amount', render: (b) => <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(b.amount || b.totalPrice || 0)}</span> },
          { key: 'paymentStatus', label: 'Payment', render: (b) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(b.paymentStatus || 'Pending')}`}>
              {b.paymentStatus || 'Pending'}
            </span>
          )},
          { key: 'status', label: 'Status', render: (b) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(b.status)}`}>{b.status}</span>
          )},
        ],
        { view: true, cancel: true },
        'bookings'
      )}
    </motion.div>
  )

  const renderPaymentSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Manage Payments</h2>
      {renderTable(
        payments,
        [
          { key: 'id', label: 'Payment ID', render: (p) => <span className="font-mono text-gray-900 dark:text-white">#{p._id?.slice(-8)}</span> },
          { key: 'booking', label: 'Booking', render: (p) => <span className="font-mono text-gray-500 dark:text-gray-400">#{p.booking?._id?.slice(-8) || 'N/A'}</span> },
          { key: 'user', label: 'User', render: (p) => <span className="text-gray-600 dark:text-gray-400">{p.user?.name || p.booking?.user?.name || 'N/A'}</span> },
          { key: 'amount', label: 'Amount', render: (p) => <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(p.amount || 0)}</span> },
          { key: 'method', label: 'Method', render: (p) => <span className="capitalize text-gray-500 dark:text-gray-400">{p.method || p.paymentMethod || 'N/A'}</span> },
          { key: 'status', label: 'Status', render: (p) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(p.status)}`}>{p.status}</span>
          )},
          { key: 'date', label: 'Date', render: (p) => <span className="text-gray-500 dark:text-gray-400">{p.createdAt ? formatDate(p.createdAt) : 'N/A'}</span> },
        ],
        null,
        'payments'
      )}
    </motion.div>
  )

  const renderCouponSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Manage Coupons</h2>
        {renderAddButton('coupons')}
      </div>
      {renderTable(
        coupons,
        [
          { key: 'code', label: 'Code', render: (c) => <span className="font-mono font-bold text-primary-600 dark:text-primary-400 uppercase">{c.code}</span> },
          { key: 'discount', label: 'Discount', render: (c) => <span className="font-medium text-gray-900 dark:text-white">{c.discount}%</span> },
          { key: 'minAmount', label: 'Min Amount', render: (c) => <span className="text-gray-500 dark:text-gray-400">{formatCurrency(c.minAmount || 0)}</span> },
          { key: 'validUntil', label: 'Valid Until', render: (c) => <span className="text-gray-500 dark:text-gray-400">{c.validUntil ? formatDate(c.validUntil) : 'N/A'}</span> },
          { key: 'usage', label: 'Usage', render: (c) => <span className="text-gray-500 dark:text-gray-400">{c.usedCount || 0}/{c.maxUsage || '∞'}</span> },
          { key: 'active', label: 'Active', render: (c) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
              {c.isActive ? 'Yes' : 'No'}
            </span>
          )},
        ],
        { edit: true, delete: true, toggleActive: true },
        'coupons'
      )}
    </motion.div>
  )

  const renderReviewSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Manage Reviews</h2>
      {renderTable(
        reviews,
        [
          { key: 'user', label: 'User', render: (r) => (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {r.user?.avatar ? <img src={getImageUrl(r.user.avatar)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">{r.user?.name?.charAt(0)}</div>}
              </div>
              <span className="text-gray-600 dark:text-gray-400">{r.user?.name}</span>
            </div>
          )},
          { key: 'item', label: 'Tour/Hotel', render: (r) => <span className="text-gray-600 dark:text-gray-400">{r.tour?.title || r.hotel?.title || 'N/A'}</span> },
          { key: 'rating', label: 'Rating', render: (r) => <StarRating rating={r.rating} size="sm" /> },
          { key: 'comment', label: 'Comment', render: (r) => <span className="text-gray-500 dark:text-gray-400 max-w-xs truncate block">{r.comment}</span> },
          { key: 'status', label: 'Status', render: (r) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'}`}>
              {r.status || 'Pending'}
            </span>
          )},
        ],
        { approve: true, delete: true },
        'reviews'
      )}
    </motion.div>
  )

  const renderBlogSection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Blog Posts</h2>
        {renderAddButton('blog')}
      </div>
      <div className="grid gap-4">
        {blogPosts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FaEdit className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No blog posts yet</p>
          </div>
        ) : blogPosts.map((post, i) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card p-5 flex items-start gap-4"
          >
            {post.image && <img src={getImageUrl(post.image)} alt={post.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-gray-900 dark:text-white">{post.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{post.content?.substring(0, 150)}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                <span>{post.category}</span>
                <span>{post.createdAt ? formatDate(post.createdAt) : ''}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                  {post.status || 'Draft'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => { setShowEditModal({ type: 'blog', id: post._id }); setModalForm(post) }} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"><FaEdit /></button>
              <button onClick={() => handleDelete('blog', post._id, 'blog post')} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FaTrash /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderReportSection = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Sales Reports</h2>
        <button onClick={() => toast.success('Report download started')} className="btn-primary !py-2.5 !px-4 text-sm flex items-center gap-2">
          <FaDownload /> Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: FaDollarSign, color: 'from-green-500 to-emerald-600' },
          { label: 'Total Bookings', value: stats.totalBookings, icon: FaShoppingCart, color: 'from-blue-500 to-cyan-600' },
          { label: 'Avg Booking Value', value: formatCurrency(stats.totalBookings ? stats.totalRevenue / stats.totalBookings : 0), icon: FaChartLine, color: 'from-purple-500 to-pink-600' },
          { label: 'Active Users', value: users.filter(u => u.isActive !== false).length, icon: FaUserCheck, color: 'from-orange-500 to-red-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg`}><s.icon /></div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">Monthly Revenue</h3>
        <div className="h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="text-center">
            <FaChartBar className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-gray-500">Monthly revenue chart will render here</p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Using Chart.js</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-4">Booking Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Tours', count: bookings.filter(b => (b.type || '').toLowerCase() === 'tour').length, color: 'text-blue-500' },
            { label: 'Hotels', count: bookings.filter(b => (b.type || '').toLowerCase() === 'hotel').length, color: 'text-purple-500' },
            { label: 'Flights', count: bookings.filter(b => (b.type || '').toLowerCase() === 'flight').length, color: 'text-orange-500' },
            { label: 'Cars', count: bookings.filter(b => (b.type || '').toLowerCase() === 'car').length, color: 'text-green-500' },
          ].map(s => (
            <div key={s.label} className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const renderSettings = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Settings</h2>
      <div className="glass-card p-6 space-y-5">
        <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white">General Settings</h3>
        {[
          { label: 'Site Name', key: 'siteName', value: 'Travel Booking' },
          { label: 'Support Email', key: 'supportEmail', value: 'support@travelbooking.com' },
          { label: 'Currency', key: 'currency', value: 'USD' },
          { label: 'Tax Rate (%)', key: 'taxRate', value: '10' },
        ].map(s => (
          <div key={s.key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{s.label}</label>
            <input type="text" defaultValue={s.value} className="input-field" />
          </div>
        ))}
        <button className="btn-primary">Save Settings</button>
      </div>
    </motion.div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard()
      case 'users': return renderUserSection()
      case 'tours': return renderTourSection()
      case 'hotels': return renderHotelSection()
      case 'flights': return renderFlightSection()
      case 'cars': return renderCarSection()
      case 'bookings': return renderBookingSection()
      case 'payments': return renderPaymentSection()
      case 'coupons': return renderCouponSection()
      case 'reviews': return renderReviewSection()
      case 'blog': return renderBlogSection()
      case 'reports': return renderReportSection()
      case 'settings': return renderSettings()
      default: return renderDashboard()
    }
  }

  if (loading) return <Loader type="page" />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50/30 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-bg text-white shadow-2xl flex items-center justify-center"
        >
          {sidebarOpen ? <FaTimes /> : <FaCog />}
        </button>
        <div className="flex gap-8">
          {renderSidebar()}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <div className="flex-1 min-w-0 pb-20 lg:pb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {renderFormModal()}
    </div>
  )
}
