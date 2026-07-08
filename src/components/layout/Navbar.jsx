import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineMenu, HiOutlineX, HiOutlineHeart, HiOutlineMoon, HiOutlineSun, HiOutlineUser, HiOutlineChevronDown } from 'react-icons/hi'
import { FiLogOut, FiSettings, FiUser, FiCalendar } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const destinations = [
  'Paris, France', 'Tokyo, Japan', 'New York, USA', 'Dubai, UAE',
  'Bangkok, Thailand', 'London, UK', 'Rome, Italy', 'Barcelona, Spain',
  'Sydney, Australia', 'Bali, Indonesia', 'Maldives', 'Swiss Alps',
  'Santorini, Greece', 'Machu Picchu, Peru', 'Cape Town, South Africa',
  'Reykjavik, Iceland', 'Kyoto, Japan', 'Banff, Canada'
]

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Tours', path: '/tours' },
  { name: 'Hotels', path: '/hotels' },
  { name: 'Flights', path: '/flights' },
  { name: 'Cars', path: '/cars' },
]

const pageLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pagesOpen, setPagesOpen] = useState(false)
  const [destOpen, setDestOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const pagesRef = useRef(null)
  const destRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pagesRef.current && !pagesRef.current.contains(e.target)) setPagesOpen(false)
      if (destRef.current && !destRef.current.contains(e.target)) setDestOpen(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [])

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-300 ${
      isActive
        ? 'text-primary-500 dark:text-primary-400'
        : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400'
    }`

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <FiCalendar className="text-lg" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                TravelBooking
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className={linkClass}>
                  {({ isActive }) => (
                    <span className={`px-4 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      {link.name}
                    </span>
                  )}
                </NavLink>
              ))}

              {/* Pages Dropdown */}
              <div ref={pagesRef} className="relative">
                <button
                  onClick={() => { setPagesOpen(!pagesOpen); setDestOpen(false) }}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pagesOpen ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Pages <HiOutlineChevronDown className={`transition-transform duration-300 ${pagesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {pagesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2"
                    >
                      {pageLinks.map((page) => (
                        <NavLink
                          key={page.path}
                          to={page.path}
                          className={({ isActive }) =>
                            `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30'
                                : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`
                          }
                          onClick={() => setPagesOpen(false)}
                        >
                          {page.name}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Destinations Dropdown */}
              <div ref={destRef} className="relative">
                <button
                  onClick={() => { setDestOpen(!destOpen); setPagesOpen(false) }}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    destOpen ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Destinations <HiOutlineChevronDown className={`transition-transform duration-300 ${destOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {destOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4"
                    >
                      <div className="grid grid-cols-3 gap-1">
                        {destinations.map((dest) => (
                          <Link
                            key={dest}
                            to={`/destination/${dest.toLowerCase().replace(/\s+/g, '-').replace(/,/g, '')}`}
                            className="px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                            onClick={() => setDestOpen(false)}
                          >
                            {dest}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {darkMode ? <HiOutlineSun className="text-lg" /> : <HiOutlineMoon className="text-lg" />}
              </button>

              {/* Wishlist */}
              <Link
                to="/dashboard"
                className="w-10 h-10 hidden sm:flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 relative"
              >
                <HiOutlineHeart className="text-lg" />
              </Link>

              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-medium shadow-md">
                        {user.name?.charAt(0).toUpperCase() || <HiOutlineUser />}
                      </div>
                      <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user.name?.split(' ')[0]}
                      </span>
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2"
                        >
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                          >
                            <FiUser className="text-base" /> My Profile
                          </Link>
                          <Link
                            to="/dashboard/bookings"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                          >
                            <FiCalendar className="text-base" /> My Bookings
                          </Link>
                          <Link
                            to="/dashboard/wishlist"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                          >
                            <HiOutlineHeart className="text-base" /> Wishlist
                          </Link>
                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                            >
                              <FiSettings className="text-base" /> Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false) }}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all duration-200"
                          >
                            <FiLogOut className="text-base" /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <HiOutlineMenu className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                <span className="text-lg font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <HiOutlineX className="text-xl" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                  <div className="pt-2">
                    <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Pages
                    </p>
                    {pageLinks.map((page) => (
                      <NavLink
                        key={page.path}
                        to={page.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`
                        }
                      >
                        {page.name}
                      </NavLink>
                    ))}
                  </div>
                  <div className="pt-2">
                    <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Destinations
                    </p>
                    {destinations.map((dest) => (
                      <Link
                        key={dest}
                        to={`/destination/${dest.toLowerCase().replace(/\s+/g, '-').replace(/,/g, '')}`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                      >
                        {dest}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
