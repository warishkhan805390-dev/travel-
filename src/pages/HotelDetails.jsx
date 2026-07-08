import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FaStar, FaMapMarkerAlt, FaHeart, FaShare, FaCheck, FaTimes,
  FaWifi, FaSwimmingPool, FaSpa, FaDumbbell, FaParking, FaUtensils,
  FaSnowflake, FaTv, FaCoffee, FaBath, FaMinus, FaPlus, FaCalendarAlt,
  FaPhone, FaChevronLeft, FaChevronRight, FaBed
} from 'react-icons/fa'
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers'
import ImageGallery from '../components/common/ImageGallery'
import MapView from '../components/common/MapView'
import Loader from '../components/common/Loader'
import StarRating from '../components/common/StarRating'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const tabs = ['Overview', 'Rooms', 'Amenities', 'Reviews', 'Location']

const amenityIcons = {
  wifi: { icon: FaWifi, label: 'Free WiFi' },
  pool: { icon: FaSwimmingPool, label: 'Swimming Pool' },
  spa: { icon: FaSpa, label: 'Spa' },
  gym: { icon: FaDumbbell, label: 'Gym' },
  parking: { icon: FaParking, label: 'Free Parking' },
  restaurant: { icon: FaUtensils, label: 'Restaurant' },
  ac: { icon: FaSnowflake, label: 'Air Conditioning' },
  tv: { icon: FaTv, label: 'TV' },
  coffee: { icon: FaCoffee, label: 'Coffee Maker' },
  bath: { icon: FaBath, label: 'Private Bath' },
}

const defaultRooms = [
  { type: 'Single Room', price: 120, amenities: ['wifi', 'ac', 'tv', 'bath'], maxGuests: 1 },
  { type: 'Double Room', price: 180, amenities: ['wifi', 'ac', 'tv', 'bath', 'coffee'], maxGuests: 2 },
  { type: 'Suite', price: 280, amenities: ['wifi', 'ac', 'tv', 'bath', 'coffee', 'pool'], maxGuests: 3 },
  { type: 'Deluxe Suite', price: 450, amenities: ['wifi', 'ac', 'tv', 'bath', 'coffee', 'pool', 'spa'], maxGuests: 4 },
]

export default function HotelDetails() {
  const { slug } = useParams()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('Overview')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [guests, setGuests] = useState(2)
  const [similarHotels, setSimilarHotels] = useState([])
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { user } = useAuth()

  useEffect(() => {
    fetchHotel()
  }, [slug])

  const fetchHotel = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/hotels/${slug}`)
      const hotelData = data.data || data
      setHotel(hotelData)
      setSelectedRoom(hotelData.rooms?.[0]?.type || defaultRooms[0].type)
      if (hotelData.city) {
        const { data: similar } = await axios.get(`/api/hotels?city=${hotelData.city}`)
        const similarData = Array.isArray(similar) ? similar : similar.data || []
        setSimilarHotels(similarData.filter(h => h._id !== hotelData._id).slice(0, 3))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hotel details')
    } finally {
      setLoading(false)
    }
  }

  const handleReserve = () => {
    if (!user) { toast.error('Please login to reserve'); return }
    if (!checkIn || !checkOut) { toast.error('Please select dates'); return }
    toast.success('Reservation initiated!')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: hotel.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  const rooms = hotel.rooms?.length > 0 ? hotel.rooms : defaultRooms
  const currentRoom = rooms.find(r => r.type === selectedRoom) || rooms[0]
  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))) : 1
  const totalPrice = (currentRoom?.price || hotel.price || 0) * nights
  const inWishlist = hotel ? isInWishlist(hotel._id) : false

  if (loading) return <Loader type="page" />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Hotel Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link to="/hotels" className="btn-primary">Back to Hotels</Link>
        </div>
      </div>
    )
  }

  if (!hotel) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/hotels" className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Hotels</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium truncate">{hotel.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ImageGallery images={hotel.images?.length > 0 ? hotel.images : [getImageUrl(hotel.image)]} />
            </motion.div>

            {/* Hotel Info Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-6 mt-6 p-5 glass-card"
            >
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{hotel.name}</h1>
                <div className="flex items-center gap-3">
                  <StarRating rating={hotel.stars || 0} size="sm" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {hotel.type || 'Hotel'}
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <FaMapMarkerAlt className="text-primary-500" size={12} />
                  {hotel.location || hotel.city}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div className="text-right">
                  <div className="text-3xl font-bold gradient-text">{formatCurrency(hotel.price || currentRoom?.price)}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">per night</div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="mt-8">
              <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-white dark:bg-gray-700 text-primary-500 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'Overview' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About {hotel.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                            {hotel.description || 'Experience luxury and comfort at our premium hotel. Enjoy world-class amenities and exceptional service.'}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hotel Policies</h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Check-in / Check-out</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Check-in: {hotel.checkIn || '2:00 PM'}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Check-out: {hotel.checkOut || '12:00 PM'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Cancellation</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{hotel.cancellationPolicy || 'Free cancellation up to 24 hours before check-in'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Rooms' && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Rooms</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {rooms.map((room, i) => {
                            const roomAmenities = room.amenities?.map(a => amenityIcons[a]).filter(Boolean) || []
                            return (
                              <div
                                key={i}
                                className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                                  selectedRoom === room.type
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/10'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700'
                                }`}
                                onClick={() => setSelectedRoom(room.type)}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{room.type}</h4>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold gradient-text">{formatCurrency(room.price)}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">per night</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 mb-3 text-sm text-gray-500 dark:text-gray-400">
                                  <FaBed size={12} />
                                  <span>Up to {room.maxGuests || 2} guests</span>
                                </div>
                                {roomAmenities.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {roomAmenities.map((a, j) => (
                                      <span key={j} className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                                        <a.icon size={10} />
                                        {a.label}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {activeTab === 'Amenities' && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hotel Amenities</h3>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {(hotel.amenities?.length > 0 ? hotel.amenities : Object.keys(amenityIcons)).map((key, i) => {
                            const amenity = amenityIcons[key]
                            if (!amenity) return null
                            const Icon = amenity.icon
                            return (
                              <div key={i} className="flex items-center gap-3 p-4 glass-card">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center">
                                  <Icon className="text-primary-500 text-xl" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{amenity.label}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {activeTab === 'Reviews' && (
                      <div>
                        <div className="flex items-center gap-6 mb-8 p-6 glass-card">
                          <div className="text-center">
                            <div className="text-5xl font-bold gradient-text">{(hotel.rating || 0).toFixed(1)}</div>
                            <StarRating rating={hotel.rating || 0} size="sm" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{hotel.reviewCount || 0} reviews</p>
                          </div>
                          <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map(star => {
                              const count = hotel.reviews?.filter(r => Math.round(r.rating) === star).length || 0
                              const total = hotel.reviews?.length || 1
                              const pct = (count / total) * 100
                              return (
                                <div key={star} className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-600 dark:text-gray-400 w-8">{star} star</span>
                                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="text-gray-500 dark:text-gray-400 w-8 text-right">{count}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="space-y-4">
                          {(hotel.reviews?.length > 0 ? hotel.reviews : [
                            { user: { name: 'Alice Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }, rating: 5, comment: 'Wonderful stay! Very comfortable rooms and excellent service.', createdAt: new Date().toISOString() },
                          ]).map((review, i) => (
                            <div key={i} className="p-5 glass-card">
                              <div className="flex items-start gap-4">
                                <img src={review.user?.avatar} alt={review.user?.name} className="w-12 h-12 rounded-full object-cover" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{review.user?.name}</h4>
                                    <span className="text-xs text-gray-500">{review.createdAt ? formatDate(review.createdAt) : ''}</span>
                                  </div>
                                  <StarRating rating={review.rating || 0} size="sm" />
                                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'Location' && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Location</h3>
                        <MapView
                          latitude={hotel.latitude || 28.6139}
                          longitude={hotel.longitude || 77.2090}
                          address={hotel.location || hotel.city}
                          height="450px"
                        />
                        <div className="mt-4 p-4 glass-card">
                          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaMapMarkerAlt className="text-primary-500" />
                            {hotel.location || hotel.city || 'Location not specified'}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Similar Hotels */}
            {similarHotels.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Similar Hotels</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarHotels.map((h, i) => (
                    <Link key={h._id} to={`/hotels/${h.slug}`} className="group card p-0">
                      <div className="relative h-40 overflow-hidden">
                        <img src={getImageUrl(h.images?.[0] || h.image)} alt={h.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{h.name}</h4>
                        <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <FaMapMarkerAlt size={10} className="text-primary-500" />
                          {h.location || h.city}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-bold gradient-text">{formatCurrency(h.price)}</span>
                          <span className="text-xs text-gray-500">/ night</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold gradient-text">
                      {formatCurrency(currentRoom?.price || hotel.price || 0)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/ night</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => inWishlist ? removeFromWishlist(hotel._id) : addToWishlist(hotel)}
                      className={`w-10 h-10 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                        inWishlist
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'
                          : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <FaHeart />
                    </button>
                    <button onClick={handleShare} className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary-500 transition-all duration-300">
                      <FaShare />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FaCalendarAlt className="inline mr-1.5 text-primary-500" />
                        Check-in
                      </label>
                      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FaCalendarAlt className="inline mr-1.5 text-primary-500" />
                        Check-out
                      </label>
                      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]} className="input-field" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Type
                    </label>
                    <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="input-field">
                      {rooms.map((r, i) => (
                        <option key={i} value={r.type}>{r.type} - {formatCurrency(r.price)}/night</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guests</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setGuests(g => Math.max(1, g - 1))}
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                        <FaMinus />
                      </button>
                      <span className="text-xl font-bold text-gray-900 dark:text-white w-8 text-center">{guests}</span>
                      <button onClick={() => setGuests(g => Math.min(currentRoom?.maxGuests || 4, g + 1))}
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>{formatCurrency(currentRoom?.price || hotel.price || 0)} x {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Taxes & Fees</span>
                      <span>{formatCurrency(Math.round(totalPrice * 0.12))}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>Total</span>
                      <span className="gradient-text">{formatCurrency(Math.round(totalPrice * 1.12))}</span>
                    </div>
                  </div>

                  <button onClick={handleReserve}
                    className="w-full py-4 gradient-bg text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-[1.02]">
                    Reserve Now
                  </button>
                </div>
              </motion.div>

              <div className="glass-card p-6 text-center">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Our team is available 24/7</p>
                <a href="tel:+1234567890" className="btn-secondary inline-flex items-center gap-2">
                  <FaPhone /> Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
