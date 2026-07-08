import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaTimes, FaChevronDown, FaHeadset, FaChevronRight } from 'react-icons/fa'

const categories = ['General', 'Booking', 'Payments', 'Cancellation', 'Travel']

const faqData = {
  General: [
    { q: 'What is TravelBooking?', a: 'TravelBooking is a comprehensive travel platform that allows you to book tours, hotels, flights, and car rentals worldwide. We offer curated travel experiences with best price guarantees.' },
    { q: 'How do I create an account?', a: 'Click on the "Register" button at the top right corner. Fill in your details including name, email, and password. Verify your email address and you\'re ready to start booking.' },
    { q: 'Is my personal information secure?', a: 'Yes, we use industry-standard SSL encryption to protect your data. We never share your personal information with third parties without your consent.' },
    { q: 'How can I contact customer support?', a: 'You can reach us via email at support@travelbooking.com, call us at +1 (555) 123-4567, or use the contact form on our website. We\'re available 24/7.' },
    { q: 'Do you have a mobile app?', a: 'Yes, our mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store.' },
  ],
  Booking: [
    { q: 'How do I book a tour?', a: 'Browse our tours, select your preferred package, choose dates and number of guests, then proceed to checkout. You can pay securely using your preferred payment method.' },
    { q: 'Can I modify my booking?', a: 'Yes, you can modify your booking up to 48 hours before departure. Changes are subject to availability and may incur additional charges.' },
    { q: 'How do I know if my booking is confirmed?', a: 'After successful payment, you will receive a confirmation email with your booking details and a unique booking reference number.' },
    { q: 'Can I book for a group?', a: 'Absolutely! We offer special group rates for bookings of 10 or more people. Contact our sales team for custom quotes and group packages.' },
    { q: 'What documents do I need for booking?', a: 'You\'ll need a valid government-issued ID or passport. For international travel, ensure your passport is valid for at least 6 months beyond your travel dates.' },
  ],
  Payments: [
    { q: 'What payment methods do you accept?', a: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, Google Pay, Apple Pay, and bank transfers for certain bookings.' },
    { q: 'Is it safe to pay online?', a: 'Yes, our payment gateway uses 256-bit SSL encryption and is PCI-DSS compliant. Your payment information is fully secure.' },
    { q: 'Do you offer installment payments?', a: 'Yes, we offer flexible installment plans through our partner payment providers. You can split your payment into 3, 6, or 12 monthly installments.' },
    { q: 'Will I get a refund if I cancel?', a: 'Refund policies vary by booking type. Free cancellation is available within 48 hours of booking. After that, cancellation fees may apply.' },
    { q: 'How long does it take to process a refund?', a: 'Refunds are typically processed within 5-10 business days. The time for the amount to appear in your account depends on your payment provider.' },
  ],
  Cancellation: [
    { q: 'What is your cancellation policy?', a: 'Free cancellation up to 48 hours before the tour starts. 50% refund between 48-24 hours. No refund for cancellations within 24 hours of departure.' },
    { q: 'How do I cancel a booking?', a: 'Log into your account, go to "My Bookings", select the booking you wish to cancel, and click on the cancellation button. Follow the prompts to complete the process.' },
    { q: 'Can I cancel due to bad weather?', a: 'If a tour is canceled by the operator due to weather conditions, you will receive a full refund. Otherwise, our standard cancellation policy applies.' },
    { q: 'What if I miss my departure?', a: 'If you miss your scheduled departure, please contact our support team immediately. We will try to reschedule based on availability, but additional charges may apply.' },
    { q: 'Can I transfer my booking to someone else?', a: 'Yes, you can transfer your booking to another person up to 24 hours before departure. Contact our support team to initiate the transfer.' },
  ],
  Travel: [
    { q: 'Do I need travel insurance?', a: 'While travel insurance is not mandatory, we strongly recommend purchasing it to cover unexpected events like medical emergencies, trip cancellations, or lost baggage.' },
    { q: 'What should I pack for my trip?', a: 'Packing essentials include comfortable clothing, weather-appropriate gear, toiletries, medications, travel documents, power adapters, and a first-aid kit.' },
    { q: 'Do I need a visa for international travel?', a: 'Visa requirements vary by destination and nationality. Check your destination country\'s embassy website for specific visa requirements before booking.' },
    { q: 'Are airport transfers included?', a: 'Most of our tour packages include airport transfers. Check the "Included" section of your specific tour for detailed information.' },
    { q: 'What happens if there is an emergency during my trip?', a: 'Our 24/7 support team is always available. Save our emergency contact number: +1 (555) 987-6543. We also provide emergency contact details for each destination.' },
  ],
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('General')
  const [search, setSearch] = useState('')
  const [openItems, setOpenItems] = useState(new Set())

  const toggleItem = (key) => {
    setOpenItems(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const filteredFAQs = Object.entries(faqData).reduce((acc, [cat, items]) => {
    const filtered = items.filter(
      item => !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    )
    if (filtered.length > 0) acc[cat] = filtered
    return acc
  }, {})

  const displayedFAQs = search ? filteredFAQs : { [activeTab]: faqData[activeTab] }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold text-white mb-4">
            Frequently Asked Questions
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-200">
            Everything you need to know about TravelBooking
          </motion.p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search */}
        <div className="relative mb-8">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="input-field pl-12 pr-12 py-4 text-lg"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FaTimes />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        {!search && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === cat
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Items */}
        {Object.entries(displayedFAQs).length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FaSearch className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Results Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try a different search term</p>
          </motion.div>
        ) : (
          Object.entries(displayedFAQs).map(([cat, items]) => (
            <div key={cat}>
              {search && (
                <h3 className="text-lg font-bold text-primary-500 dark:text-primary-400 mb-4 mt-8 first:mt-0">{cat}</h3>
              )}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {items.map((faq, i) => {
                  const key = `${cat}-${i}`
                  const isOpen = openItems.has(key)
                  return (
                    <motion.div
                      key={key}
                      variants={itemVariants}
                      layout
                      className={`rounded-2xl border transition-all duration-300 ${
                        isOpen
                          ? 'border-primary-500/30 bg-primary-50/50 dark:bg-primary-900/10 shadow-lg shadow-primary-500/5'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                      >
                        <span className={`text-sm md:text-base font-medium transition-colors duration-300 ${
                          isOpen ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                        }`}>
                          {faq.q}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            isOpen
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          <FaChevronDown size={14} />
                        </motion.div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 pt-0 border-t border-primary-100/30 dark:border-primary-900/20">
                              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-3">{faq.a}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          ))
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-10 rounded-2xl bg-gradient-to-br from-primary-500/10 via-primary-500/5 to-accent-500/10 border border-primary-500/20 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <FaHeadset className="text-white text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Still Have Questions?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Our support team is ready to help you with any questions you might have.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center gap-2">
              Contact Us <FaChevronRight size={12} />
            </Link>
            <a href="tel:+1234567890" className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2">
              <FaHeadset /> Call Support
            </a>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}
