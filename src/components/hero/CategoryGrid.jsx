import SectionHeader from '../common/SectionHeader'
import CategoryCard from '../cards/CategoryCard'
import { categories } from '../../data/categories'

export default function CategoryGrid() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeader
        eyebrow="Browse Categories"
        title="Everything you need, in one place"
        description="Six premium marketplaces, one seamless experience. Verified listings, trusted dealers."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <CategoryCard key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </section>
  )
}
