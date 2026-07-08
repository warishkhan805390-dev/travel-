import { motion } from 'framer-motion'
import HeroBanner from '../components/home/HeroBanner'
import FeaturedDestinations from '../components/home/FeaturedDestinations'
import PopularTours from '../components/home/PopularTours'
import SearchHotels from '../components/home/SearchHotels'
import FlightSearchSection from '../components/home/FlightSearchSection'
import CarRentalSection from '../components/home/CarRentalSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import SpecialOffers from '../components/home/SpecialOffers'
import Testimonials from '../components/home/Testimonials'
import TravelBlog from '../components/home/TravelBlog'
import Newsletter from '../components/home/Newsletter'
import DestinationGrid from '../components/home/DestinationGrid'
import StatsCounter from '../components/home/StatsCounter'
import AppDownload from '../components/home/AppDownload'
import Partners from '../components/home/Partners'

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HeroBanner />
      <Partners />
      <FeaturedDestinations />
      <SearchHotels />
      <FlightSearchSection />
      <CarRentalSection />
      <PopularTours />
      <WhyChooseUs />
      <StatsCounter />
      <SpecialOffers />
      <DestinationGrid />
      <Testimonials />
      <TravelBlog />
      <AppDownload />
      <Newsletter />
    </motion.div>
  )
}
