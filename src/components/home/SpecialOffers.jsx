import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiClock, FiTag } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const offers = [
  {
    title: 'Early Bird Special',
    description: 'Book 60 days in advance and save big on your dream vacation',
    discount: 30,
    validUntil: 'Aug 30, 2026',
    terms: 'Min 3 nights stay',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    gradient: 'from-emerald-500/80 to-teal-800/80',
  },
  {
    title: 'Family Getaway Deal',
    description: 'Bring the whole family! Kids stay and eat free at select resorts',
    discount: 25,
    validUntil: 'Sep 15, 2026',
    terms: 'Up to 2 kids under 12',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    gradient: 'from-blue-500/80 to-indigo-800/80',
  },
  {
    title: 'Luxury Escape',
    description: 'Upgrade to premium suites with complimentary airport transfers',
    discount: 20,
    validUntil: 'Oct 01, 2026',
    terms: 'Luxury collection only',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b0c2f9b?w=800',
    gradient: 'from-purple-500/80 to-rose-800/80',
  },
  {
    title: 'Honeymoon Package',
    description: 'Romantic getaways with candlelight dinners and spa credits',
    discount: 35,
    validUntil: 'Dec 31, 2026',
    terms: 'Valid for couples',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    gradient: 'from-pink-500/80 to-red-800/80',
  },
];

const SpecialOffers = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Deals</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Latest Offers & Deals
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Exclusive limited-time offers to make your travel more affordable
          </p>
        </motion.div>

        <div className="hidden lg:grid grid-cols-2 gap-6">
          {offers.map((offer, i) => (
            <motion.div
              key={i}
              className="relative rounded-3xl overflow-hidden h-72 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${offer.image}')` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient}`} />

              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <span className="text-white font-bold text-lg">{offer.discount}% OFF</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{offer.title}</h3>
                <p className="text-white/80 mb-4">{offer.description}</p>
                <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
                  <span className="flex items-center gap-1.5">
                    <FiClock size={14} />
                    Valid until {offer.validUntil}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiTag size={14} />
                    {offer.terms}
                  </span>
                </div>
                <button className="bg-white text-gray-900 hover:bg-white/90 font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-lg">
                  Grab Offer
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:hidden">
          <Swiper spaceBetween={16} slidesPerView={1.1} breakpoints={{ 640: { slidesPerView: 1.5 } }}>
            {offers.map((offer, i) => (
              <SwiperSlide key={i}>
                <div className="relative rounded-3xl overflow-hidden h-80 group cursor-pointer">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${offer.image}')` }} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient}`} />
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                    <span className="text-white font-bold text-lg">{offer.discount}% OFF</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{offer.title}</h3>
                    <p className="text-white/80 text-sm mb-3">{offer.description}</p>
                    <div className="flex items-center gap-3 text-white/60 text-xs mb-3">
                      <span className="flex items-center gap-1"><FiClock size={12} />Until {offer.validUntil}</span>
                      <span className="flex items-center gap-1"><FiTag size={12} />{offer.terms}</span>
                    </div>
                    <button className="bg-white text-gray-900 hover:bg-white/90 font-bold px-5 py-2.5 rounded-full text-sm transition-all">Grab Offer</button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
