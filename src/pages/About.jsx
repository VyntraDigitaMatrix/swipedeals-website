import { motion } from 'framer-motion'
import { Award, Heart, ShieldCheck, Target } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import SectionHeader from '../components/common/SectionHeader'
import Statistics from '../components/common/Statistics'
import Testimonials from '../components/common/Testimonials'

const values = [
  { icon: ShieldCheck, title: 'Trust First', description: 'Every dealer and listing is verified before it reaches you — no exceptions.' },
  { icon: Target, title: 'Radical Simplicity', description: 'Buying and selling should take minutes, not weeks. We design for speed and clarity.' },
  { icon: Heart, title: 'Customer Obsession', description: 'We measure success by how confidently our users can make life\'s biggest purchases.' },
  { icon: Award, title: 'Excellence', description: 'From inspection standards to customer support, we hold ourselves to the highest bar.' },
]

const team = [
  { name: 'Arjun Kapoor', role: 'Co-Founder & CEO', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80' },
  { name: 'Meera Bhatt', role: 'Co-Founder & CPO', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' },
  { name: 'Rahul Deshmukh', role: 'VP of Engineering', image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=300&q=80' },
  { name: 'Neha Kulkarni', role: 'VP of Operations', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
]

export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-hero py-20 sm:py-28">
        <div className="container-page relative text-center">
          <Breadcrumb items={[{ label: 'About Us' }]} />
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-3xl font-extrabold text-white sm:text-5xl"
          >
            Building India&rsquo;s most trusted marketplace, one verified deal at a time
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-sm text-white/80 sm:text-base"
          >
            SwipeDeals was founded in 2019 with a simple mission: make buying and selling cars, properties and
            everyday essentials as easy as swiping right.
          </motion.p>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80"
            alt="SwipeDeals team collaborating"
            className="rounded-3xl shadow-lift"
            loading="lazy"
          />
          <div>
            <SectionHeader eyebrow="Our Story" title="From a garage idea to India's marketplace of choice" align="left" className="mb-0" />
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              What started as a small classifieds site for used cars in Mumbai has grown into a full-scale marketplace
              spanning six categories and over 120 cities. Along the way, we built the verification infrastructure,
              dealer tools and buyer protections that today power hundreds of thousands of transactions every month.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              We&rsquo;re backed by leading investors and a team of over 400 people obsessed with removing friction from
              one of life&rsquo;s most stressful experiences: making a big purchase decision.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-alt/60 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader eyebrow="What Drives Us" title="Our core values" align="center" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <v.icon size={22} aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-text">{v.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Statistics />

      <section className="container-page py-16 sm:py-20">
        <SectionHeader eyebrow="Leadership" title="Meet the team" align="center" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <img src={member.image} alt={member.name} className="mx-auto h-28 w-28 rounded-2xl object-cover shadow-soft" loading="lazy" />
              <p className="mt-3 text-sm font-bold text-text">{member.name}</p>
              <p className="text-xs text-text-secondary">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />
    </div>
  )
}
