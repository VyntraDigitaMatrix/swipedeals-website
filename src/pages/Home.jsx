import Hero from '../components/home/Hero'
import CategoryGrid from '../components/home/CategoryGrid'
import FeaturedCars from '../components/home/FeaturedCars'
import FeaturedProperties from '../components/home/FeaturedProperties'
import FeaturedElectronics from '../components/home/FeaturedElectronics'
import FeaturedSpareParts from '../components/home/FeaturedSpareParts'
import WhyChoose from '../components/home/WhyChoose'
import CTA from '../components/home/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedCars />
      <FeaturedProperties />
      <FeaturedElectronics />
      <FeaturedSpareParts />
      <WhyChoose />
      <CTA />
    </>
  )
}
