import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatCurrency, formatDate } from '../utils/helpers'
import { FaCheck, FaPlane, FaHotel, FaCar, FaMapMarkedAlt, FaDownload, FaPrint, FaEnvelope, FaArrowRight, FaHome } from 'react-icons/fa'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const checkmarkVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 },
  },
}

const lineVariants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: { duration: 0.6, delay: 0.4 },
  },
}

export default function BookingConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    const data = location.state?.booking
    if (data) {
      setBooking(data)
    } else {
      const saved = sessionStorage.getItem('lastBooking')
      if (saved) {
        setBooking(JSON.parse(saved))
      }
    }
  }, [location.state])

  useEffect(() => {
    if (booking) {
      sessionStorage.setItem('lastBooking', JSON.stringify(booking))
    }
  }, [booking])

  const typeConfig = {
    tour: { icon: FaMapMarkedAlt, label: 'Tour', color: 'from-blue-500 to-cyan-500' },
    hotel: { icon: FaHotel, label: 'Hotel', color: 'from-purple-500 to-pink-500' },
    flight: { icon: FaPlane, label: 'Flight', color: 'from-orange-500 to-red-500' },
    car: { icon: FaCar, label: 'Car Rental', color: 'from-green-500 to-emerald-500' },
  }

  const bookingType = (booking?.type || booking?.bookingType || 'tour').toLowerCase()
  const config = typeConfig[bookingType] || typeConfig.tour
  const TypeIcon = config.icon

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const content = `
Travel Booking Confirmation
============================
Booking Reference: ${booking?._id || 'N/A'}
Type: ${config.label}
${booking?.title || booking?.item?.title ? `Item: ${booking.title || booking.item?.title}` : ''}
${booking?.startDate ? `Start Date: ${formatDate(booking.startDate)}` : ''}
${booking?.endDate ? `End Date: ${formatDate(booking.endDate)}` : ''}
Amount: ${formatCurrency(booking?.amount || booking?.totalPrice || 0)}
Payment Method: ${booking?.paymentMethod || booking?.method || 'N/A'}
Status: ${booking?.status || 'Confirmed'}

Thank you for booking with us!
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `booking-${booking?._id?.slice(-8) || 'confirmation'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-primary-50/30 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center glass-card p-12 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto">
              <FaEnvelope className="text-3xl text-yellow-500" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">No Booking Found</h2>
            <p className="text-gray-500 dark:text-gray-400">It seems you haven't completed a booking yet.</p>
            <Link to="/tours" className="btn-primary inline-flex items-center gap-2">
              <FaHome /> Start Exploring
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50/30 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="relative inline-flex mb-6">
            <motion.div
              variants={checkmarkVariants}
              className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center shadow-2xl shadow-primary-500/30"
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <motion.path
                  d="M14 24L20 30L34 18"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={lineVariants}
                />
              </svg>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
              className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow-lg"
            >
              <FaCheck />
            </motion.div>
          </div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-500 dark:text-gray-400 mt-2"
          >
            Your travel adventure is all set. Get ready for an amazing experience!
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-8 mb-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Booking Reference</p>
            <p className="text-2xl font-mono font-bold gradient-text">
              #{booking._id?.slice(-8) || 'N/A'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-lg`}>
                <TypeIcon className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{config.label}</p>
                <p className="font-medium text-gray-900 dark:text-white">{booking.title || booking.item?.title || booking.name || config.label}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {booking.startDate && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{formatDate(booking.startDate)}</p>
                </div>
              )}
              {booking.endDate && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">{formatDate(booking.endDate)}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount Paid</p>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                  {formatCurrency(booking.amount || booking.totalPrice || 0)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Method</p>
                <p className="font-medium text-gray-900 dark:text-white mt-1 capitalize">
                  {booking.paymentMethod || booking.method || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <span className="text-sm text-gray-500 dark:text-gray-400">Booking Status</span>
              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                {booking.status || 'Confirmed'}
              </span>
            </div>

            {booking.guests && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guests</p>
                <p className="font-medium text-gray-900 dark:text-white mt-1">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 mb-6">
          <div className="flex items-start gap-3">
            <FaEnvelope className="text-primary-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A confirmation email has been sent to your registered email address with all the booking details. Please check your inbox (and spam folder).
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 justify-center">
          <Link to="/dashboard" className="btn-primary flex items-center gap-2">
            <FaArrowRight /> View My Bookings
          </Link>
          <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
            <FaDownload /> Download Invoice
          </button>
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
            <FaPrint /> Print
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-4">Book another</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: 'Book a Tour', icon: FaMapMarkedAlt, link: '/tours', color: 'from-blue-500 to-cyan-500' },
              { label: 'Book a Hotel', icon: FaHotel, link: '/hotels', color: 'from-purple-500 to-pink-500' },
              { label: 'Book Flight', icon: FaPlane, link: '/flights', color: 'from-orange-500 to-red-500' },
              { label: 'Rent a Car', icon: FaCar, link: '/cars', color: 'from-green-500 to-emerald-500' },
            ].map(action => (
              <Link
                key={action.label}
                to={action.link}
                className="group px-5 py-2.5 glass rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <action.icon className="text-sm" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
