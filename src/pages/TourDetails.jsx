import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FaStar, FaClock, FaUserFriends, FaMapMarkerAlt, FaHeart, FaShare,
  FaCheck, FaTimes, FaPlane, FaBus, FaHotel, FaUtensils, FaSun, FaMoon,
  FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMinus, FaPlus, FaPhone
} from 'react-icons/fa'
import { formatCurrency, calculateDiscount, formatDate, getImageUrl } from '../utils/helpers'
import ImageGallery from '../components/common/ImageGallery'
import MapView from '../components/common/MapView'
import Loader from '../components/common/Loader'
import StarRating from '../components/common/StarRating'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const tabs = ['Overview', 'Itinerary', 'Hotels & Transport', 'Reviews', 'Location']

export default function TourDetails() {
  const { slug } = useParams()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('Overview')
  const [expandedDay, setExpandedDay] = useState(null)
  const [checkInDate, setCheckInDate] = useState('')
  const [guests, setGuests] = useState(2)
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { user } = useAuth()
  const [relatedTours, setRelatedTours] = useState([])

  useEffect(() => {
    fetchTour()
  }, [slug])

  const fetchTour = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/tours/${slug}`)
      const tourData = data.data || data
      setTour(tourData)
      if (tourData.destination) {
        const { data: related } = await axios.get(`/api/tours?destination=${tourData.destination}`)
        const relatedData = Array.isArray(related) ? related : related.data || []
        setRelatedTours(relatedData.filter(t => t._id !== tourData._id).slice(0, 3))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tour details')
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book this tour')
      return
    }
    if (!checkInDate) {
      toast.error('Please select a date')
      return
    }
    toast.success('Booking initiated!')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: tour.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  const discount = tour ? calculateDiscount(tour.price, tour.discountPrice) : 0
  const inWishlist = tour ? isInWishlist(tour._id) : false

  if (loading) return <Loader type="page" />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Tour Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link to="/tours" className="btn-primary">Back to Tours</Link>
        </div>
      </div>
    )
  }

  if (!tour) return null

  const includedServices = tour.included || ['Accommodation', 'Meals', 'Transport', 'Guide', 'Sightseeing']
  const excludedServices = tour.excluded || ['Flights', 'Visa', 'Insurance', 'Personal expenses', 'Tips']

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/tours" className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Tours</Link>
            <span className="text-gray-400">/</span>
            {tour.destination && (
              <>
                <Link to={`/tours?destination=${tour.destination}`} className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">{tour.destination}</Link>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-900 dark:text-white font-medium truncate">{tour.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ImageGallery images={tour.images?.length > 0 ? tour.images : [getImageUrl(tour.image)]} />
            </motion.div>

            {/* Tour Info Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-6 mt-6 p-5 glass-card"
            >
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold gradient-text">
                    {formatCurrency(tour.discountPrice || tour.price)}
                  </span>
                  {tour.discountPrice && (
                    <span className="text-lg text-gray-400 line-through">{formatCurrency(tour.price)}</span>
                  )}
                  {discount > 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-semibold">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">per person</span>
              </div>
              <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaClock className="text-accent-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{tour.duration}</p>
                  <p className="text-xs">Duration</p>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaUserFriends className="text-accent-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Up to {tour.groupSize || 20}</p>
                  <p className="text-xs">Group Size</p>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaMapMarkerAlt className="text-accent-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{tour.location || tour.destination}</p>
                  <p className="text-xs">Location</p>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
              <div className="flex items-center gap-2">
                <StarRating rating={tour.rating || 0} showValue />
                <span className="text-sm text-gray-500 dark:text-gray-400">({tour.reviewCount || 0} reviews)</span>
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
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Tour</h3>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                            {tour.description || 'Experience an amazing journey with our carefully crafted tour package.'}
                          </p>
                        </div>
                        {tour.highlights?.length > 0 && (
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Highlights</h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {tour.highlights.map((h, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                  <FaStar className="text-amber-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300">{h}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900/30">
                            <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                              <FaCheck className="text-green-500" /> Included
                            </h4>
                            <ul className="space-y-2">
                              {includedServices.map((s, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <FaCheck className="text-green-500 flex-shrink-0" size={12} />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                            <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                              <FaTimes className="text-red-500" /> Excluded
                            </h4>
                            <ul className="space-y-2">
                              {excludedServices.map((s, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                  <FaTimes className="text-red-500 flex-shrink-0" size={12} />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Itinerary' && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Day-by-Day Itinerary</h3>
                        <div className="space-y-3">
                          {(tour.itinerary?.length > 0 ? tour.itinerary : [
                            { day: 1, title: 'Arrival & Welcome', description: 'Arrive at the airport. Transfer to hotel. Welcome dinner.', meals: ['Breakfast', 'Dinner'] },
                            { day: 2, title: 'City Tour', description: 'Full day city tour visiting major attractions.', meals: ['Breakfast', 'Lunch', 'Dinner'] },
                            { day: 3, title: 'Departure', description: 'Breakfast at hotel. Check out and transfer to airport.', meals: ['Breakfast'] },
                          ]).map((item, i) => (
                            <motion.div
                              key={i}
                              initial={false}
                              className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
                            >
                              <button
                                onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                                    {item.day || i + 1}
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                      {item.meals?.map((meal, j) => (
                                        <span key={j} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                          {meal === 'Breakfast' ? <FaSun size={10} /> : meal === 'Dinner' ? <FaMoon size={10} /> : <FaUtensils size={10} />}
                                          {meal}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <motion.div
                                  animate={{ rotate: expandedDay === i ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <FaChevronDown className="text-gray-400" />
                                </motion.div>
                              </button>
                              <AnimatePresence>
                                {expandedDay === i && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-4 pb-4 pt-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {item.description}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'Hotels & Transport' && (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaHotel className="text-primary-500" /> Hotels
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {(tour.hotels?.length > 0 ? tour.hotels : [
                              { name: 'Grand Palace Hotel', stars: 5, amenities: ['Pool', 'Spa', 'Gym', 'Restaurant'] },
                              { name: 'City View Resort', stars: 4, amenities: ['Pool', 'Restaurant', 'Bar'] },
                            ]).map((hotel, i) => (
                              <div key={i} className="p-4 glass-card">
                                <div className="flex items-center gap-2 mb-2">
                                  <FaStar className="text-amber-400" size={14} />
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">{hotel.stars} Star</span>
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{hotel.name}</h4>
                                <div className="flex flex-wrap gap-2">
                                  {hotel.amenities?.map((a, j) => (
                                    <span key={j} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaBus className="text-accent-500" /> Transport
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {(tour.transports?.length > 0 ? tour.transports : [
                              { type: 'AC Bus', ac: true, details: 'Luxury air-conditioned coach' },
                              { type: 'SUV', ac: true, details: 'Private SUV for city tours' },
                            ]).map((t, i) => (
                              <div key={i} className="p-4 glass-card">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 dark:to-accent-900 flex items-center justify-center">
                                    <FaBus className="text-primary-500" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{t.type}</h4>
                                    <span className={`text-xs font-medium ${t.ac ? 'text-green-500' : 'text-orange-500'}`}>
                                      {t.ac ? 'AC' : 'Non-AC'}
                                    </span>
                                  </div>
                                </div>
                                {t.details && (
                                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t.details}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Reviews' && (
                      <div>
                        <div className="flex items-center gap-6 mb-8 p-6 glass-card">
                          <div className="text-center">
                            <div className="text-5xl font-bold gradient-text">{(tour.rating || 0).toFixed(1)}</div>
                            <StarRating rating={tour.rating || 0} size="sm" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tour.reviewCount || 0} reviews</p>
                          </div>
                          <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map(star => {
                              const count = tour.reviews?.filter(r => Math.round(r.rating) === star).length || 0
                              const total = tour.reviews?.length || 1
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
                          {(tour.reviews?.length > 0 ? tour.reviews : [
                            { user: { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }, rating: 5, comment: 'Amazing experience! Highly recommend.', createdAt: new Date().toISOString() },
                          ]).map((review, i) => (
                            <div key={i} className="p-5 glass-card">
                              <div className="flex items-start gap-4">
                                <img
                                  src={review.user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                                  alt={review.user?.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{review.user?.name || 'Anonymous'}</h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {review.createdAt ? formatDate(review.createdAt) : ''}
                                    </span>
                                  </div>
                                  <StarRating rating={review.rating || 0} size="sm" />
                                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {review.comment}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'Location' && (
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tour Location</h3>
                        <MapView
                          latitude={tour.latitude || 27.7172}
                          longitude={tour.longitude || 85.3240}
                          address={tour.location || tour.destination}
                          height="450px"
                        />
                        {tour.location && (
                          <div className="mt-4 p-4 glass-card">
                            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <FaMapMarkerAlt className="text-primary-500" />
                              {tour.location}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Tour Guide */}
            {tour.guide && (
              <div className="mt-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Tour Guide</h3>
                <div className="p-6 glass-card flex items-center gap-6">
                  <img
                    src={tour.guide.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                    alt={tour.guide.name}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{tour.guide.name}</h4>
                    <StarRating rating={tour.guide.rating || 5} size="sm" showValue />
                    {tour.guide.languages?.length > 0 && (
                      <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <FaPhone className="text-primary-500" size={12} />
                        Speaks: {tour.guide.languages.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Related Tours */}
            {relatedTours.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Tours</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedTours.map((rt, i) => (
                    <Link key={rt._id} to={`/tours/${rt.slug}`} className="group card p-0">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={getImageUrl(rt.images?.[0] || rt.image)}
                          alt={rt.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {rt.discountPrice && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-semibold">
                            {calculateDiscount(rt.price, rt.discountPrice)}% OFF
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">{rt.title}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold gradient-text">
                            {formatCurrency(rt.discountPrice || rt.price)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">per person</span>
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
                      {formatCurrency(tour.discountPrice || tour.price)}
                    </span>
                    {tour.discountPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        {formatCurrency(tour.price)}
                      </span>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">per person</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => inWishlist ? removeFromWishlist(tour._id) : addToWishlist(tour)}
                      className={`w-10 h-10 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                        inWishlist
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500'
                          : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800'
                      }`}
                    >
                      <FaHeart />
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary-500 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300"
                    >
                      <FaShare />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaCalendarAlt className="inline mr-1.5 text-primary-500" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaUserFriends className="inline mr-1.5 text-primary-500" />
                      Number of Guests
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests(g => Math.max(1, g - 1))}
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        <FaMinus />
                      </button>
                      <span className="text-xl font-bold text-gray-900 dark:text-white w-8 text-center">{guests}</span>
                      <button
                        onClick={() => setGuests(g => Math.min(tour.maxGroupSize || 20, g + 1))}
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>{formatCurrency(tour.discountPrice || tour.price)} x {guests} guest{guests > 1 ? 's' : ''}</span>
                      <span>{formatCurrency((tour.discountPrice || tour.price) * guests)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Taxes & Fees</span>
                      <span>{formatCurrency(Math.round((tour.discountPrice || tour.price) * guests * 0.1))}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>Total</span>
                      <span className="gradient-text">
                        {formatCurrency(Math.round((tour.discountPrice || tour.price) * guests * 1.1))}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBookNow}
                    className="w-full py-4 gradient-bg text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Book Now
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-600 dark:text-green-400 font-medium">Available</span>
                    <span className="text-gray-400 dark:text-gray-500">|</span>
                    <span className="text-gray-500 dark:text-gray-400">{tour.bookedCount || 0} booked</span>
                  </div>
                </div>
              </motion.div>

              {/* Need Help */}
              <div className="glass-card p-6 text-center">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Our travel experts are here to help</p>
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

const FaChevronDown = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M6 9l6 6 6-6" />
  </svg>
)
