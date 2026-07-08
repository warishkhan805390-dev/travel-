import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  FaCalendarAlt, FaClock, FaUser, FaArrowLeft, FaFacebookF,
  FaTwitter, FaWhatsapp, FaLink, FaQuoteLeft, FaShare
} from 'react-icons/fa'
import { formatDate } from '../utils/helpers'

const placeholderPost = {
  _id: '1',
  slug: 'top-10-hidden-gems',
  title: 'Top 10 Hidden Gems in Southeast Asia',
  excerpt: 'Discover off-the-beaten-path destinations that most tourists miss when visiting Southeast Asia.',
  content: `
    <h2>Introduction</h2>
    <p>Southeast Asia is a treasure trove of hidden wonders waiting to be explored. While popular destinations like Bangkok and Bali draw millions of visitors, there are countless lesser-known gems that offer authentic experiences without the crowds.</p>
    
    <h2>1. Koh Rong Samloem, Cambodia</h2>
    <p>This pristine island offers crystal-clear waters, white sandy beaches, and a relaxed atmosphere. Unlike its more famous neighbor Koh Rong, this island remains relatively untouched by mass tourism.</p>
    
    <h2>2. Luang Namtha, Laos</h2>
    <p>Nestled in northern Laos, this charming town is the gateway to some of the region's best trekking experiences. The surrounding national park offers incredible biodiversity and encounters with local hill tribes.</p>
    
    <h2>3. Hpa-An, Myanmar</h2>
    <p>This hidden gem in southern Myanmar features stunning limestone karst landscapes, beautiful caves, and peaceful countryside. It's a paradise for photographers and nature lovers.</p>
    
    <h2>4. Con Dao Islands, Vietnam</h2>
    <p>This remote archipelago offers some of Vietnam's most beautiful beaches and pristine coral reefs. The islands have a fascinating history and are now a haven for eco-tourists.</p>
    
    <h2>5. Battambang, Cambodia</h2>
    <p>Cambodia's second-largest city is known for its well-preserved French colonial architecture, vibrant arts scene, and the famous Bamboo Train.</p>
    
    <h2>6. El Nido, Palawan, Philippines</h2>
    <p>While Palawan has gained popularity, El Nido's hidden lagoons and secret beaches still offer moments of pure solitude and natural wonder.</p>
    
    <h2>7. Bagan, Myanmar (Beyond the Temples)</h2>
    <p>While Bagan's temples are famous, venture off the main path to discover traditional villages, lacquerware workshops, and hidden viewpoints.</p>
    
    <h2>8. Kampot, Cambodia</h2>
    <p>Known for its pepper plantations and riverside setting, Kampot offers a perfect blend of relaxation and adventure with its nearby cave systems and national park.</p>
    
    <h2>9. Sapa, Vietnam (Trekking Routes)</h2>
    <p>Beyond the main tourist path, Sapa offers incredible trekking routes through terraced rice fields and remote hill tribe villages.</p>
    
    <h2>10. Merang, Indonesia</h2>
    <p>A small fishing village that serves as a gateway to some of Indonesia's most beautiful and less-visited islands.</p>
    
    <h2>Tips for Visiting Hidden Gems</h2>
    <p>When exploring off-the-beaten-path destinations, always respect local customs, travel responsibly, and support local communities. These hidden gems rely on sustainable tourism to preserve their natural beauty and cultural heritage.</p>
  `,
  category: 'Adventure',
  coverImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200',
  author: {
    name: 'Alex Turner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Alex is a seasoned traveler who has visited over 50 countries. He specializes in off-the-beaten-path destinations and sustainable travel practices.',
  },
  readTime: '5 min',
  createdAt: new Date().toISOString(),
}

const relatedPosts = Array.from({ length: 3 }).map((_, i) => ({
  _id: `related-${i}`,
  slug: `related-post-${i}`,
  title: ['Ultimate Travel Packing Guide 2024', 'Best Street Food Destinations Worldwide', 'How to Travel on a Budget'][i],
  coverImage: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=600'][i],
  readTime: ['8 min', '6 min', '10 min'][i],
  category: ['Tips', 'Food', 'Tips'][i],
}))

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/blog/${slug}`)
      setPost(data.data || data)
    } catch {
      setPost(placeholderPost)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const text = `${post?.title} - TravelBooking Blog`
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    }
    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
      return
    }
    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end justify-center overflow-hidden">
        <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 pb-16 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <img src={post.author?.avatar} alt={post.author?.name} className="w-8 h-8 rounded-full object-cover" />
                <span>{post.author?.name}</span>
              </div>
              <span>|</span>
              <span><FaCalendarAlt className="inline mr-1.5" size={12} />{formatDate(post.createdAt)}</span>
              <span>|</span>
              <span><FaClock className="inline mr-1.5" size={12} />{post.readTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/blog" className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Blog</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Share Sidebar */}
          <div className="hidden lg:flex flex-col items-center gap-3 sticky top-24 self-start">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Share</span>
            <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all">
              <FaFacebookF />
            </button>
            <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all">
              <FaTwitter />
            </button>
            <button onClick={() => handleShare('whatsapp')} className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all">
              <FaWhatsapp />
            </button>
            <button onClick={() => handleShare('copy')} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
              <FaLink />
            </button>
          </div>

          {/* Article */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-a:text-primary-500 prose-img:rounded-2xl prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50/50 dark:prose-blockquote:bg-primary-900/10 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Mobile Share Buttons */}
            <div className="lg:hidden mt-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <FaShare /> Share this article
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleShare('facebook')} className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all">Facebook</button>
                <button onClick={() => handleShare('twitter')} className="flex-1 py-2 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-500 text-sm font-medium hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all">Twitter</button>
                <button onClick={() => handleShare('whatsapp')} className="flex-1 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/40 transition-all">WhatsApp</button>
                <button onClick={() => handleShare('copy')} className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">Copy Link</button>
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-10 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <img src={post.author?.avatar} alt={post.author?.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{post.author?.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1">
                    {post.author?.bio || 'Travel enthusiast and writer sharing inspiring stories from around the world.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Blog */}
            <div className="mt-10 text-center">
              <Link to="/blog" className="inline-flex items-center gap-2 text-primary-500 font-medium hover:gap-3 transition-all">
                <FaArrowLeft size={14} /> Back to Blog
              </Link>
            </div>
          </motion.article>
        </div>
      </div>

      {/* Related Posts */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Related Articles</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((rp, i) => (
              <motion.div
                key={rp._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${rp.slug}`} className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="relative h-44 overflow-hidden">
                    <img src={rp.coverImage} alt={rp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold">{rp.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">{rp.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400"><FaClock className="inline mr-1" size={10} />{rp.readTime}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Comments</h2>
          <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
            <FaQuoteLeft className="text-3xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Comments Coming Soon</h3>
            <p className="text-gray-500 dark:text-gray-400">We're working on adding comments functionality. Stay tuned!</p>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}
