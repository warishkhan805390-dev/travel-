import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { IoLocationSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const destinations = [
  { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', size: 'large' },
  { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', size: 'small' },
  { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', size: 'small' },
  { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', size: 'small' },
  { name: 'Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800', size: 'small' },
  { name: 'India', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', size: 'large' },
  { name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', size: 'small' },
  { name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800', size: 'small' },
  { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', size: 'small' },
  { name: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', size: 'large' },
  { name: 'Cape Town, SA', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800', size: 'small' },
  { name: 'Sydney, Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', size: 'small' },
  { name: 'Rome, Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', size: 'small' },
  { name: 'Bora Bora', image: 'https://images.unsplash.com/photo-1519070994528-88c6b1d0e6c6?w=800', size: 'small' },
  { name: 'Barcelona, Spain', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', size: 'large' },
  { name: 'Machu Picchu', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', size: 'small' },
  { name: 'Egypt Pyramids', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800', size: 'small' },
  { name: 'Reykjavik, Iceland', image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800', size: 'small' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const DestinationGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Destinations</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Explore By Destination
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            From tropical beaches to historic cities, find your perfect destination
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {destinations.map((dest, i) => {
            const isLarge = dest.size === 'large';
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                  isLarge ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                }`}
                style={{ minHeight: isLarge ? '320px' : '150px' }}
              >
                <Link to={`/destination/${dest.name.toLowerCase().replace(/\s+/g, '-')}`} className="block w-full h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${dest.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-1.5 text-white">
                      <IoLocationSharp className="text-amber-400 shrink-0" size={isLarge ? 20 : 14} />
                      <h3 className={`font-bold ${isLarge ? 'text-lg' : 'text-sm'}`}>{dest.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default DestinationGrid;
