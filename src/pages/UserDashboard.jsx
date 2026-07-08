import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers'
import Loader from '../components/common/Loader'
import StarRating from '../components/common/StarRating'
import toast from 'react-hot-toast'
import {
  FaHome, FaBookmark, FaHeart, FaCreditCard, FaStar, FaBell, FaUserCog, FaSignOutAlt,
  FaMapMarkedAlt, FaHotel, FaPlane, FaCar, FaEye, FaTimes, FaTrash, FaEdit, FaDownload,
  FaCheck, FaExclamationCircle, FaPaperPlane, FaCamera, FaSearch, FaFilter, FaCalendarAlt,
  FaChevronLeft, FaChevronRight, FaRegCalendarCheck, FaSuitcase, FaMoneyBillWave,
  FaRegHeart, FaRegBell, FaRegStar, FaUserCircle, FaSortDown, FaSortUp
} from 'react-icons/fa'

const sidebarItems = [
  { id: 'overview', label: 'Dashboard Overview', icon: FaHome },
  { id: 'bookings', label: 'My Bookings', icon: FaBookmark },
  { id: 'wishlist', label: 'My Wishlist', icon: FaHeart },
  { id: 'payments', label: 'Payment History', icon: FaCreditCard },
  { id: 'reviews', label: 'My Reviews', icon: FaStar },
  { id: 'notifications', label: 'Notifications', icon: FaBell },
  { id: 'settings', label: 'Profile Settings', icon: FaUserCog },
  { id: 'logout', label: 'Logout', icon: FaSignOutAlt },
]

const bookingTabs = ['All', 'Tours', 'Hotels', 'Flights', 'Cars']

const statusColors = {
  Confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
}

const paymentStatusColors = {
  Paid: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  Refunded: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  Failed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function UserDashboard() {
  const { user, logout, updateProfile } = useAuth()
  const { wishlist, removeFromWishlist } = useWishlist()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalBookings: 0, upcomingTrips: 0, totalSpent: 0 })
  const [recentBookings, setRecentBookings] = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [bookingTab, setBookingTab] = useState('All')
  const [payments, setPayments] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showCancelModal, setShowCancelModal] = useState(null)
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [editingReview, setEditingReview] = useState(null)
  const [editReviewText, setEditReviewText] = useState('')

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' })
    }
  }, [user])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [bookingsRes, paymentsRes, reviewsRes, notificationsRes] = await Promise.all([
        API.get('/bookings'),
        API.get('/payments'),
        API.get('/reviews/mine'),
        API.get('/notifications'),
      ])
      const bookings = bookingsRes.data?.data || bookingsRes.data || []
      const paymentsData = paymentsRes.data?.data || paymentsRes.data || []
      const reviewsData = reviewsRes.data?.data || reviewsRes.data || []
      const notifsData = notificationsRes.data?.data || notificationsRes.data || []

      setAllBookings(bookings)
      setRecentBookings(bookings.slice(0, 3))
      setPayments(paymentsData)
      setUserReviews(reviewsData)
      setNotifications(notifsData)

      const upcoming = bookings.filter(b => b.status === 'Confirmed').length
      const spent = paymentsData
        .filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0)
      setStats({
        totalBookings: bookings.length,
        upcomingTrips: upcoming,
        totalSpent: spent,
      })
    } catch (err) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      await API.put(`/bookings/${bookingId}/cancel`)
      toast.success('Booking cancelled successfully')
      setShowCancelModal(null)
      fetchDashboardData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking')
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await updateProfile(profileForm)
      if (avatarFile) {
        const formData = new FormData()
        formData.append('avatar', avatarFile)
        await API.put('/auth/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      setSaving(true)
      await API.put('/auth/changepassword', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success('Password changed successfully')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`/reviews/${reviewId}`)
      toast.success('Review deleted')
      setUserReviews(prev => prev.filter(r => r._id !== reviewId))
    } catch (err) {
      toast.error('Failed to delete review')
    }
  }

  const handleUpdateReview = async (reviewId) => {
    try {
      await API.put(`/reviews/${reviewId}`, { comment: editReviewText })
      toast.success('Review updated')
      setUserReviews(prev => prev.map(r => r._id === reviewId ? { ...r, comment: editReviewText } : r))
      setEditingReview(null)
      setEditReviewText('')
    } catch (err) {
      toast.error('Failed to update review')
    }
  }

  const handleMarkRead = async (notifId) => {
    try {
      await API.put(`/notifications/${notifId}/read`)
      setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, read: true } : n))
    } catch (err) {
      toast.error('Failed to mark as read')
    }
  }

  const handleClearAll = async () => {
    try {
      await API.put('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success('All notifications marked as read')
    } catch (err) {
      toast.error('Failed to clear notifications')
    }
  }

  const filteredBookings = bookingTab === 'All'
    ? allBookings
    : allBookings.filter(b => {
        const type = (b.type || b.bookingType || '').toLowerCase()
        return type === bookingTab.toLowerCase().slice(0, -1)
      })

  const renderSidebar = () => (
    <aside className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto z-40 w-72 flex-shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="h-full glass-card rounded-none lg:rounded-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-white/20 dark:border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-gray-900 dark:text-white truncate">{user?.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'logout') { handleLogout(); return }
                setActiveSection(item.id)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                activeSection === item.id
                  ? 'gradient-bg text-white shadow-lg shadow-primary-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )

  const renderOverview = () => (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your travel plans.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: stats.totalBookings, icon: FaBookmark, color: 'from-blue-500 to-blue-600' },
          { label: 'Upcoming Trips', value: stats.upcomingTrips, icon: FaSuitcase, color: 'from-green-500 to-green-600' },
          { label: 'Total Spent', value: formatCurrency(stats.totalSpent), icon: FaMoneyBillWave, color: 'from-purple-500 to-purple-600' },
          { label: 'Wishlist Count', value: wishlist.length, icon: FaHeart, color: 'from-red-500 to-red-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <stat.icon className="text-xl" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No bookings yet. Start exploring!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20 dark:border-gray-700/30 text-sm text-gray-500 dark:text-gray-400">
                  <th className="pb-3 font-medium">Booking</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, i) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/10 dark:border-gray-700/20"
                  >
                    <td className="py-4">
                      <span className="text-sm font-mono text-gray-900 dark:text-white">#{booking._id?.slice(-8)}</span>
                    </td>
                    <td className="py-4 text-sm capitalize text-gray-600 dark:text-gray-400">{booking.type || booking.bookingType || 'N/A'}</td>
                    <td className="py-4 text-sm text-gray-600 dark:text-gray-400">{booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}</td>
                    <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(booking.amount || booking.totalPrice || 0)}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status] || statusColors.Pending}`}>
                        {booking.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Book a Tour', icon: FaMapMarkedAlt, link: '/tours', color: 'from-blue-500 to-cyan-500' },
            { label: 'Book a Hotel', icon: FaHotel, link: '/hotels', color: 'from-purple-500 to-pink-500' },
            { label: 'Book Flight', icon: FaPlane, link: '/flights', color: 'from-orange-500 to-red-500' },
            { label: 'Rent a Car', icon: FaCar, link: '/cars', color: 'from-green-500 to-emerald-500' },
          ].map(action => (
            <Link
              key={action.label}
              to={action.link}
              className="group glass-card p-4 hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="text-lg" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const renderBookings = () => (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Bookings</h2>
      </div>

      <div className="flex gap-2 flex-wrap">
        {bookingTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setBookingTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              bookingTab === tab
                ? 'gradient-bg text-white shadow-lg shadow-primary-500/30'
                : 'glass text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FaBookmark className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No bookings yet</p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Start planning your next adventure!</p>
          <Link to="/tours" className="btn-primary inline-block mt-6">Browse Tours</Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking, i) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
                  <img
                    src={getImageUrl(booking.image || booking.item?.image)}
                    alt={booking.title || booking.item?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white">
                        {booking.title || booking.item?.title || 'Booking'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Booking ID: <span className="font-mono">#{booking._id?.slice(-8)}</span>
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {booking.startDate && (
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-primary-500" />
                        <span>{formatDate(booking.startDate)}</span>
                      </div>
                    )}
                    {booking.endDate && (
                      <>
                        <span>—</span>
                        <span>{formatDate(booking.endDate)}</span>
                      </>
                    )}
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(booking.amount || booking.totalPrice || 0)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/20 dark:border-gray-700/30">
                    <button className="btn-secondary !py-2 !px-4 text-sm flex items-center gap-2">
                      <FaEye /> View Details
                    </button>
                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => setShowCancelModal(booking)}
                        className="py-2 px-4 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-300"
                      >
                        <FaTimes className="inline mr-1" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCancelModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="glass-card p-6 max-w-md w-full"
            >
              <FaExclamationCircle className="text-4xl text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white text-center mb-2">Cancel Booking?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                Are you sure you want to cancel booking #{showCancelModal._id?.slice(-8)}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowCancelModal(null)} className="btn-secondary flex-1">Keep Booking</button>
                <button
                  onClick={() => handleCancelBooking(showCancelModal._id)}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  const renderWishlist = () => (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FaRegHeart className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400">Your wishlist is empty</p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Save your favorite tours and hotels here!</p>
          <Link to="/tours" className="btn-primary inline-block mt-6">Explore Tours</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-primary-500 font-medium mb-1">{item.category || item.type || 'Tour'}</p>
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(item.discountPrice || item.price || 0)}</p>
                <Link
                  to={`/${(item.category || item.type || 'tour').toLowerCase()}s/${item.slug || item._id}`}
                  className="btn-secondary !py-2 !px-4 text-sm mt-4 inline-block"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )

  const renderPayments = () => (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Payment History</h2>
      {payments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FaCreditCard className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No payments yet</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20 dark:border-gray-700/30 text-sm text-gray-500 dark:text-gray-400">
                  <th className="p-4 font-medium">Booking ID</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Method</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, i) => (
                  <motion.tr
                    key={payment._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/10 dark:border-gray-700/20 hover:bg-white/50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm text-gray-900 dark:text-white">#{payment.booking?._id?.slice(-8) || payment._id?.slice(-8)}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{payment.createdAt ? formatDate(payment.createdAt) : 'N/A'}</td>
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(payment.amount || 0)}</td>
                    <td className="p-4 text-sm capitalize text-gray-600 dark:text-gray-400">{payment.method || payment.paymentMethod || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusColors[payment.status] || paymentStatusColors.Pending}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toast.success('Invoice download started')}
                        className="text-primary-500 hover:text-primary-600 transition-colors"
                      >
                        <FaDownload />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )

  const renderReviews = () => (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">My Reviews</h2>
      {userReviews.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FaRegStar className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No reviews yet</p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Share your experience with other travelers!</p>
          <Link to="/tours" className="btn-primary inline-block mt-6">Review a Tour</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userReviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white">
                    {review.tour?.title || review.hotel?.title || 'Item'}
                  </h3>
                  <StarRating rating={review.rating} size="sm" showValue />
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500">{review.createdAt ? formatDate(review.createdAt) : ''}</span>
              </div>
              {editingReview === review._id ? (
                <div className="mt-4">
                  <textarea
                    value={editReviewText}
                    onChange={e => setEditReviewText(e.target.value)}
                    className="input-field"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleUpdateReview(review._id)} className="btn-primary !py-2 text-sm">Save</button>
                    <button onClick={() => { setEditingReview(null); setEditReviewText('') }} className="btn-secondary !py-2 text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-gray-600 dark:text-gray-400">{review.comment}</p>
              )}
              <div className="flex gap-2 mt-4 pt-3 border-t border-white/20 dark:border-gray-700/30">
                {editingReview !== review._id && (
                  <button
                    onClick={() => { setEditingReview(review._id); setEditReviewText(review.comment || '') }}
                    className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )

  const renderNotifications = () => (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Notifications</h2>
        {notifications.some(n => !n.read) && (
          <button onClick={handleClearAll} className="text-sm text-primary-500 hover:text-primary-600 font-medium">
            Mark all as read
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FaRegBell className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass-card p-4 flex items-start gap-4 ${!notif.read ? 'border-l-4 border-primary-500' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                !notif.read ? 'gradient-bg' : 'bg-gray-100 dark:bg-gray-700'
              } text-white`}>
                {notif.type === 'booking' ? <FaBookmark /> : notif.type === 'payment' ? <FaCreditCard /> : <FaBell />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notif.createdAt ? formatDate(notif.createdAt) : ''}</p>
              </div>
              {!notif.read && (
                <button
                  onClick={() => handleMarkRead(notif._id)}
                  className="text-primary-500 hover:text-primary-600 flex-shrink-0"
                >
                  <FaCheck />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )

  const renderSettings = () => (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="max-w-2xl space-y-8">
      <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Profile Settings</h2>

      <div className="glass-card p-6">
        <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-6">Avatar</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : user?.avatar ? (
                <img src={getImageUrl(user.avatar)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white cursor-pointer shadow-lg hover:scale-110 transition-transform">
              <FaCamera className="text-xs" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click the camera icon to upload a new photo</p>
        </div>
      </div>

      <form onSubmit={handleProfileUpdate} className="glass-card p-6 space-y-5">
        <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white">Personal Information</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            value={profileForm.name}
            onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={profileForm.email}
            onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
          <input
            type="tel"
            value={profileForm.phone}
            onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
            className="input-field"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FaPaperPlane /> Save Changes
            </>
          )}
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="glass-card p-6 space-y-5">
        <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white">Change Password</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
            className="input-field"
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={passwordForm.confirmPassword}
            onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
            className="input-field"
            required
            minLength={6}
          />
        </div>
        <button type="submit" disabled={saving} className="btn-accent flex items-center gap-2">
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <FaPaperPlane /> Update Password
            </>
          )}
        </button>
      </form>
    </motion.div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview()
      case 'bookings': return renderBookings()
      case 'wishlist': return renderWishlist()
      case 'payments': return renderPayments()
      case 'reviews': return renderReviews()
      case 'notifications': return renderNotifications()
      case 'settings': return renderSettings()
      default: return renderOverview()
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
          {sidebarOpen ? <FaTimes /> : <FaUserCircle />}
        </button>

        <div className="flex gap-8">
          {renderSidebar()}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
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
    </div>
  )
}
