import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 5,
    text: 'Absolutely incredible experience! The team planned every detail perfectly. From the moment we landed to our departure, everything was seamless. The hotels were stunning and the local guides were knowledgeable.',
    date: 'March 2026',
  },
  {
    name: 'James Mitchell',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    text: 'This was our best vacation ever! The Maldives trip exceeded all expectations. The water villas were breathtaking, and the excursions were well-organized. Already planning our next trip!',
    date: 'February 2026',
  },
  {
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 5,
    text: 'The Bali trip was magical! Every aspect was thoughtfully curated. The private pool villa, the temple tours, the cooking class - everything was perfect. Highly recommend their services!',
    date: 'January 2026',
  },
  {
    name: 'Michael Chen',
    location: 'Singapore',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 4,
    text: 'Great service and amazing destinations. The customer support was responsive and helped us customize our itinerary. The Dubai tour was particularly well-organized with excellent guides.',
    date: 'December 2025',
  },
  {
    name: 'Emma Williams',
    location: 'Sydney, Australia',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 5,
    text: 'From booking to return, everything was flawless. The Paris and Switzerland combo was dreamy. The hotels were centrally located and the transport arrangements were smooth.',
    date: 'November 2025',
  },
  {
    name: 'Ahmed Hassan',
    location: 'Dubai, UAE',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    rating: 5,
    text: 'Exceptional travel agency! They arranged a wonderful family vacation to Thailand. The kids loved every moment. Great value for money and the attention to detail was remarkable.',
    date: 'October 2025',
  },
];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,146,60,0.06),transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Reviews</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Real experiences from real travelers who trusted us with their journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-14"
          >
            {testimonials.map((item, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500 h-full"
                  whileHover={{ y: -5 }}
                >
                  <FaQuoteLeft className="text-amber-400/30 mb-4" size={32} />
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <FaStar
                        key={j}
                        size={16}
                        className={j < item.rating ? 'text-amber-400' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-6 line-clamp-4">
                    "{item.text}"
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${item.avatar}')` }}
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{item.name}</h4>
                      <p className="text-gray-400 text-sm">{item.location}</p>
                    </div>
                    <div className="ml-auto text-gray-500 text-xs">{item.date}</div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
