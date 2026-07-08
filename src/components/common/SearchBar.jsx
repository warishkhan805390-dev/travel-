import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineUser, HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi'
import { FiPlane, FiHome, FiCompass, FiTruck } from 'react-icons/fi'
import { DateRange } from 'react-date-range'
import { format } from 'date-fns'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const tabs = [
  { id: 'tours', label: 'Tours', icon: FiCompass },
  { id: 'hotels', label: 'Hotels', icon: FiHome },
  { id: 'flights', label: 'Flights', icon: FiPlane },
  { id: 'cars', label: 'Cars', icon: FiTruck },
]

const destinations = [
  'Paris, France', 'Tokyo, Japan', 'New York, USA', 'Dubai, UAE',
  'Bangkok, Thailand', 'London, UK', 'Rome, Italy', 'Barcelona, Spain',
  'Sydney, Australia', 'Bali, Indonesia',
]

export default function SearchBar({ onSearch }) {
  const [activeTab, setActiveTab] = useState('tours')
  const [destination, setDestination] = useState('')
  const [showDestinations, setShowDestinations] = useState(false)
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), key: 'selection' },
  ])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 })
  const [showGuests, setShowGuests] = useState(false)

  const filteredDestinations = destinations.filter((d) =>
    d.toLowerCase().includes(destination.toLowerCase())
  )

  const guestCount = guests.adults + guests.children

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        type: activeTab,
        destination,
        checkIn: dateRange[0].startDate,
        checkOut: dateRange[0].endDate,
        guests,
      })
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto glass-card p-2">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl mb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-primary-500 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="text-base" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search Fields */}
      <div className="flex flex-col lg:flex-row gap-2 p-2">
        {/* Destination */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-transparent focus-within:border-primary-500 transition-all duration-300">
            <HiOutlineLocationMarker className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={activeTab === 'flights' ? 'From where?' : activeTab === 'cars' ? 'Pick-up location' : 'Where to?'}
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setShowDestinations(true) }}
              onFocus={() => setShowDestinations(true)}
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
          <AnimatePresence>
            {showDestinations && filteredDestinations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden"
              >
                {filteredDestinations.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => { setDestination(dest); setShowDestinations(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    {dest}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Date Range */}
        <div className="relative flex-1">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-transparent hover:border-primary-500 transition-all duration-300 w-full text-left"
          >
            <HiOutlineCalendar className="text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {format(dateRange[0].startDate, 'MMM dd')} - {format(dateRange[0].endDate, 'MMM dd, yyyy')}
            </span>
          </button>
          <AnimatePresence>
            {showDatePicker && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute top-full left-0 mt-1 z-20 shadow-2xl rounded-2xl overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-800 p-2">
                  <DateRange
                    editableDateInputs
                    onChange={(item) => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    className="!font-sans"
                    rangeColors={['#3b82f6']}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guests */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowGuests(!showGuests)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-transparent hover:border-primary-500 transition-all duration-300 w-full min-w-[140px] text-left"
          >
            <HiOutlineUser className="text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
            </span>
          </button>
          <AnimatePresence>
            {showGuests && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 p-4"
              >
                {[
                  { label: 'Adults', key: 'adults', min: 1 },
                  { label: 'Children', key: 'children', min: 0 },
                  { label: 'Rooms', key: 'rooms', min: 1 },
                ].map(({ label, key, min }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests((prev) => ({ ...prev, [key]: Math.max(min, prev[key] - 1) }))}
                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        <HiOutlineMinus className="text-sm" />
                      </button>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-6 text-center">
                        {guests[key]}
                      </span>
                      <button
                        onClick={() => setGuests((prev) => ({ ...prev, [key]: prev[key] + 1 }))}
                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        <HiOutlinePlus className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowGuests(false)}
                  className="w-full mt-3 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 flex-shrink-0"
        >
          <HiOutlineSearch className="text-lg" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </div>
  )
}
