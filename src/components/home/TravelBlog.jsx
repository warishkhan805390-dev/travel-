import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaUser, FaClock, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    title: '10 Hidden Gems in Southeast Asia You Must Visit',
    excerpt: 'Discover off-the-beaten-path destinations that offer authentic experiences away from the tourist crowds.',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    category: 'Travel Tips',
    date: 'Jul 5, 2026',
    author: 'Maria Gonzalez',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    readTime: '8 min read',
  },
  {
    title: 'Ultimate Guide to Luxury Travel in the Maldives',
    excerpt: 'Everything you need to know about planning the perfect luxury getaway to the Maldives.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    category: 'Luxury Travel',
    date: 'Jun 28, 2026',
    author: 'David Kim',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    readTime: '12 min read',
  },
  {
    title: 'Budget-Friendly Europe: Travel Tips & Tricks',
    excerpt: 'Explore Europe without breaking the bank with these insider tips and money-saving hacks.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    category: 'Budget Travel',
    date: 'Jun 20, 2026',
    author: 'Sophie Turner',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    readTime: '6 min read',
  },
];

const TravelBlog = () => {
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
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Blog</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Latest Travel Articles
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Inspiration, guides, and tips from our travel experts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <motion.article
              key={i}
              className="group bg-gray-800/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
            >
              <div className="relative h-52 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${post.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {post.category}
                </div>
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full">
                  {post.date}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-700">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                      />
                    </div>
                    <span className="text-white/70 text-sm font-medium">{post.author}</span>
                  </div>
                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    <FaClock size={12} />
                    {post.readTime}
                  </span>
                </div>

                <Link
                  to="/blog"
                  className="mt-4 inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-sm transition-colors"
                >
                  Read More
                  <FaArrowRight size={12} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
          >
            View All Articles
            <FaArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TravelBlog;
