import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, FileSearch, Landmark, Receipt, Umbrella } from 'lucide-react'
import SectionHeader from './SectionHeader'

const services = [
  {
    icon: Receipt,
    title: 'Challan Payment',
    description: 'Check pending traffic challans and pay them online in seconds.',
    to: '/challan-payment',
    iconBg: 'bg-danger',
    glowBg: 'bg-danger',
  },
  {
    icon: FileSearch,
    title: 'RC / Vehicle Details',
    description: 'Look up any vehicle’s registration, insurance and RC status.',
    to: '/vehicle-info',
    iconBg: 'bg-info',
    glowBg: 'bg-info',
  },
  {
    icon: Landmark,
    title: 'Car Finance',
    description: 'Compare loan offers from top banks and calculate your EMI.',
    to: '/finance',
    iconBg: 'bg-primary',
    glowBg: 'bg-primary',
  },
  {
    icon: Umbrella,
    title: 'Car Insurance',
    description: 'Compare plans from leading insurers and get an instant quote.',
    to: '/insurance',
    iconBg: 'bg-success',
    glowBg: 'bg-success',
  },
]

export default function VehicleServices() {
  return (
    <section className="container-page py-16 sm:py-20">
      <SectionHeader
        eyebrow="Vehicle Services"
        title="More than just buying & selling"
        description="Everything a vehicle owner needs, in one place — challans, RC details, finance and insurance."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
          >
            <Link
              to={service.to}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift"
            >
              <div
                className={`pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-[0.08] blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-[0.16] ${service.glowBg}`}
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lift transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 ${service.iconBg}`}>
                  <service.icon size={24} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-alt text-text-light transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-white">
                  <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </div>
              <h3 className="relative mt-5 text-base font-bold text-text">{service.title}</h3>
              <p className="relative mt-1.5 text-xs leading-relaxed text-text-secondary">{service.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
