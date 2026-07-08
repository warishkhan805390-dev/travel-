import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  FaGlobeAmericas, FaBullseye, FaHeart, FaUsers, FaAward, FaSmile,
  FaStar, FaLinkedinIn, FaTwitter, FaInstagram, FaFacebookF,
  FaMapMarkerAlt, FaPhone, FaEnvelope
} from 'react-icons/fa'
import { FiTarget, FiEye } from 'react-icons/fi'

const stats = [
  { icon: FaAward, value: 12, label: 'Years Experience', suffix: '+' },
  { icon: FaGlobeAmericas, value: 850, label: 'Tours Completed', suffix: '+' },
  { icon: FaSmile, value: 12500, label: 'Happy Customers', suffix: '+' },
  { icon: FaStar, value: 48, label: 'Awards Won', suffix: '' },
]

const team = [
  {
    name: 'Alex Thompson',
    role: 'CEO & Founder',
    bio: 'Visionary leader with 15+ years in travel industry. Founded TravelBooking with a mission to make travel accessible to everyone.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    socials: { linkedin: '#', twitter: '#', instagram: '#' },
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    bio: 'Tech innovator driving our digital transformation. Expert in building scalable travel technology platforms.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    socials: { linkedin: '#', twitter: '#', instagram: '#' },
  },
  {
    name: 'Marcus Williams',
    role: 'Head of Travel',
    bio: 'Travel expert who has visited 60+ countries. Curates our most memorable tour experiences.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    socials: { linkedin: '#', twitter: '#', instagram: '#' },
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    bio: 'Creative marketer with a passion for storytelling. Brings travel dreams to life through compelling campaigns.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
    socials: { linkedin: '#', twitter: '#', instagram: '#' },
  },
]

const gallery = [
  'https://images.unsplash.com/photo-1522199710521-72d69614c702?w=600',
  'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
  'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600',
]

const partners = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/512px-Google_2015_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/512px-Amazon_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Microsoft_logo.svg/512px-Microsoft_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Emirates_logo.svg/512px-Emirates_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Marriott_International_logo.svg/512px-Marriott_International_logo.svg.png',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const AnimatedNumber = ({ value, isInView }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isInView) { setCount(0); return }
    let start = 0
    const duration = 2000
    const step = Math.ceil(value / 60)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(start)
    }, duration / 60)
    return () => clearInterval(timer)
  }, [value, isInView])
  return <>{count.toLocaleString()}</>
}

export default function About() {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            About TravelBooking
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            We've been transforming travel dreams into unforgettable experiences since 2012
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <Link to="/contact" className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300">
              Contact Us
            </Link>
            <Link to="/tours" className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
              Explore Tours
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary-500 font-semibold tracking-wider uppercase text-sm">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              The Journey Behind TravelBooking
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg">
              Founded in 2012, TravelBooking started as a small dream shared by travel enthusiasts who believed that exploring the world should be seamless, affordable, and memorable for everyone.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: FaGlobeAmericas, title: 'Our Mission', text: 'To make travel accessible, affordable, and unforgettable for everyone by providing curated experiences and exceptional service.' },
              { icon: FiEye, title: 'Our Vision', text: 'To become the world\'s most trusted travel platform, connecting people with extraordinary experiences across every corner of the globe.' },
              { icon: FaHeart, title: 'Our Values', text: 'Integrity, innovation, customer-centricity, sustainability, and a deep passion for creating magical travel moments.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-500 group"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/95" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Impact By Numbers</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">Numbers that speak to our commitment to excellence</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-amber-400" size={28} />
                </div>
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                  <AnimatedNumber value={stat.value} isInView={statsInView} />
                  {stat.suffix}
                </div>
                <div className="text-gray-400 text-lg font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary-500 font-semibold tracking-wider uppercase text-sm">Our Team</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Passionate people dedicated to making your travel dreams a reality
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex gap-2 justify-center">
                        {Object.entries(member.socials).map(([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-500 transition-all duration-300"
                          >
                            {platform === 'linkedin' ? <FaLinkedinIn size={14} /> :
                             platform === 'twitter' ? <FaTwitter size={14} /> :
                             platform === 'instagram' ? <FaInstagram size={14} /> :
                             <FaFacebookF size={14} />}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-primary-500 text-sm font-medium mb-2">{member.role}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary-500 font-semibold tracking-wider uppercase text-sm">Why Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Why Travel With Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              We go above and beyond to make your travel experience extraordinary
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: FaShieldAlt, title: 'Best Price Guarantee', desc: 'We match any price and offer the lowest rates available for your travel needs.' },
              { icon: FaHeadset, title: '24/7 Customer Support', desc: 'Our dedicated support team is always available to help you anytime, anywhere.' },
              { icon: FaCalendarCheck, title: 'Easy Booking', desc: 'Book your entire trip in minutes with our seamless and intuitive booking platform.' },
              { icon: FaShieldVirus, title: 'Trusted & Safe', desc: 'Your safety and security are our top priorities with verified hotels and services.' },
              { icon: FaHotel, title: 'Handpicked Hotels', desc: 'We personally select each hotel to ensure the highest quality and comfort standards.' },
              { icon: FaSmile, title: 'Happy Customers', desc: 'Join thousands of satisfied travelers who trust us for their dream vacations.' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-primary-500/30 transition-all duration-500 overflow-hidden"
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <feat.icon className="text-primary-500" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feat.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary-500 font-semibold tracking-wider uppercase text-sm">Gallery</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Our Moments
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              A glimpse into our company culture, events, and offices around the world
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {gallery.map((img, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative group overflow-hidden rounded-2xl cursor-pointer"
                whileHover={{ scale: 1.03 }}
              >
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Partners</h2>
            <p className="text-gray-500 dark:text-gray-400">Trusted by industry leaders worldwide</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center"
          >
            {partners.map((logo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-500"
              >
                <img src={logo} alt={`Partner ${i + 1}`} className="h-10 object-contain" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
