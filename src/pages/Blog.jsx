import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FaSearch, FaTimes, FaClock, FaUser, FaArrowRight,
  FaChevronLeft, FaChevronRight, FaCalendarAlt
} from 'react-icons/fa'
import { formatDate } from '../utils/helpers'

const categories = ['All', 'Adventure', 'Tips', 'Destinations', 'Food', 'Lifestyle']

const placeholderPosts = Array.from({ length: 6 }).map((_, i) => ({
  _id: i,
  slug: `post-${i + 1}`,
  title: ['Top 10 Hidden Gems in Southeast Asia', 'Ultimate Travel Packing Guide 2024', 'Best Street Food Destinations Worldwide',
    'How to Travel on a Budget: Complete Guide', 'Sustainable Tourism: Travel Responsibly', 'Digital Nomad Guide: Best Cities to Work From'][i],
  excerpt: ['Discover off-the-beaten-path destinations that most tourists miss...', 'Everything you need to pack for your next adventure...',
    'A culinary journey through the world\'s most vibrant food markets...', 'Smart tips and tricks to make your travel budget go further...',
    'Learn how to minimize your environmental impact while exploring...', 'The best cities around the world for remote workers and digital nomads...'][i],
  category: (['Adventure', 'Tips', 'Food', 'Tips', 'Lifestyle', 'Destinations'])[i],
  coverImage: [
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=600',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
  ][i],
  author: { name: ['Alex Turner', 'Maria Garcia', 'James Wilson', 'Sarah Lee', 'David Kim', 'Emma Brown'][i], avatar: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
  ][i] },
  readTime: ['5 min', '8 min', '6 min', '10 min', '4 min', '7 min'][i],
  createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
}))

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/blog')
      setPosts(Array.isArray(data) ? data : data.data || data.posts || [])
    } catch {
      setPosts(placeholderPosts)
    } finally {
      setLoading(false)
    }
  }

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    return matchSearch && matchCategory
  })

  const totalPages = Math.ceil(filtered.length / postsPerPage)
  const indexOfLast = currentPage * postsPerPage
  const indexOfFirst = indexOfLast - postsPerPage
  const currentPosts = filtered.slice(indexOfFirst, indexOfLast)
  const featured = currentPosts[0]

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="flex items-center gap-3 pt-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
      </div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold text-white mb-4">
            Travel Blog
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-200">
            Stories, guides, and inspiration for your next journey
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              placeholder="Search articles..."
              className="input-field pl-12"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCurrentPage(1) }}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <SkeletonCard />
              <div className="grid gap-8">
                <SkeletonCard />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FaSearch className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Articles Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try a different search or category</p>
          </motion.div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && currentPage === 1 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <Link to={`/blog/${featured.slug}`} className="group grid md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="relative h-72 md:h-full overflow-hidden">
                    <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold">
                      {featured.category}
                    </span>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="text-primary-500 text-sm font-medium mb-2">
                      <FaCalendarAlt className="inline mr-1.5" size={12} />
                      {formatDate(featured.createdAt)}
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-500 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={featured.author?.avatar} alt={featured.author?.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{featured.author?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            <FaClock className="inline mr-1" size={10} /> {featured.readTime}
                          </p>
                        </div>
                      </div>
                      <span className="text-primary-500 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <FaArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Blog Grid */}
            <motion.div
              key={activeCategory + search}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {currentPosts.slice(currentPage === 1 ? 1 : 0).map(post => (
                  <motion.div
                    key={post._id}
                    layout
                    variants={cardVariants}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Link to={`/blog/${post.slug}`} className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold shadow-lg">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <span>
                            <FaCalendarAlt className="inline mr-1" size={10} />
                            {formatDate(post.createdAt)}
                          </span>
                          <span>
                            <FaClock className="inline mr-1" size={10} />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <img src={post.author?.avatar} alt={post.author?.name} className="w-7 h-7 rounded-full object-cover" />
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{post.author?.name}</span>
                          </div>
                          <span className="text-primary-500 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read More <FaArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${
                      currentPage === i + 1
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                        : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </motion.div>
  )
}
