import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from 'react-icons/fa'
import { FiMapPin, FiPhone, FiMail, FiCalendar } from 'react-icons/fi'

const quickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Blog', path: '/blog' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Terms & Conditions', path: '/terms' },
  { name: 'Privacy Policy', path: '/privacy' },
]

const popularDestinations = [
  'Paris, France', 'Tokyo, Japan', 'New York, USA', 'Dubai, UAE',
  'Bangkok, Thailand', 'London, UK', 'Rome, Italy', 'Barcelona, Spain',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5" />

      <div className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Company Info */}
            <motion.div variants={itemVariants}>
              <Link to="/" className="flex items-center gap-2 group mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg">
                  <FiCalendar className="text-lg" />
                </div>
                <span className="text-xl font-bold text-white">
                  TravelBooking
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Your premier travel companion for unforgettable journeys. We curate the best travel experiences worldwide, 
                from luxury getaways to adventurous expeditions.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: FaFacebook, href: '#' },
                  { icon: FaTwitter, href: '#' },
                  { icon: FaInstagram, href: '#' },
                  { icon: FaYoutube, href: '#' },
                ].map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary-500/20 flex items-center justify-center text-gray-400 hover:text-primary-400 transition-all duration-300 hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
                Quick Links
                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-primary-400 text-sm transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-primary-500 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Destinations */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
                Popular Destinations
                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
              </h3>
              <ul className="space-y-3">
                {popularDestinations.map((dest) => (
                  <li key={dest}>
                    <Link
                      to={`/destination/${dest.toLowerCase().replace(/\s+/g, '-').replace(/,/g, '')}`}
                      className="text-gray-400 hover:text-primary-400 text-sm transition-all duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-500 group-hover:bg-primary-500 transition-all duration-300" />
                      {dest}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
                Contact Info
                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <FiMapPin className="text-primary-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-400 text-sm">
                    123 Travel Street, Adventure City, AC 10001, United States
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <FiPhone className="text-primary-400 flex-shrink-0" />
                  <a href="tel:+1234567890" className="text-gray-400 hover:text-primary-400 text-sm transition-all duration-300">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <FiMail className="text-primary-400 flex-shrink-0" />
                  <a href="mailto:info@travelbooking.com" className="text-gray-400 hover:text-primary-400 text-sm transition-all duration-300">
                    info@travelbooking.com
                  </a>
                </li>
                <li className="pt-2">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-primary-500/20 text-gray-300 hover:text-primary-400 rounded-xl text-sm transition-all duration-300"
                  >
                    <FiMapPin /> View on Map
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} TravelBooking. All rights reserved.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm">We Accept</span>
                <div className="flex items-center gap-2">
                  {[FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal].map((Icon, i) => (
                    <Icon key={i} className="text-2xl text-gray-400 hover:text-white transition-all duration-300" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
