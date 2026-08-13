import Breadcrumb from '../components/common/Breadcrumb'
import FAQ from '../components/common/FAQ'

export default function FAQPage() {
  return (
    <div>
      <div className="container-page pt-8">
        <Breadcrumb items={[{ label: 'FAQ' }]} />
      </div>
      <FAQ />
    </div>
  )
}
