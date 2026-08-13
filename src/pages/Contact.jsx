import { useState } from 'react'
import { CheckCircle2, Headset, Mail, MapPin, Phone } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import Input from '../components/forms/Input'
import TextArea from '../components/forms/TextArea'
import Button from '../components/buttons/Button'

const contactPoints = [
  { icon: Phone, title: 'Call Us', detail: '+91 98765 43210', sub: 'Mon–Sat, 9am–7pm IST' },
  { icon: Mail, title: 'Email Us', detail: 'support@swipedeals.in', sub: 'We reply within 24 hours' },
  { icon: MapPin, title: 'Visit Us', detail: 'Bandra Kurla Complex, Mumbai', sub: 'India, 400051' },
  { icon: Headset, title: 'Live Chat', detail: 'Available in-app', sub: '24/7 automated + human support' },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Contact' }]} />

      <div className="mb-10 text-center">
        <h1 className="text-2xl font-extrabold text-text sm:text-4xl">We&rsquo;d love to hear from you</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
          Whether you have a question about a listing, a dealer account, or just want to say hello — our team is here to help.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {contactPoints.map((point) => (
          <div key={point.title} className="rounded-2xl border border-border bg-surface p-6 text-center shadow-soft">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <point.icon size={20} aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-text">{point.title}</h3>
            <p className="mt-1.5 text-sm font-semibold text-text">{point.detail}</p>
            <p className="mt-0.5 text-xs text-text-secondary">{point.sub}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-10">
        {submitted ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CheckCircle2 size={40} className="mb-4 text-success" aria-hidden="true" />
            <h2 className="text-lg font-bold text-text">Message sent!</h2>
            <p className="mt-2 text-sm text-text-secondary">We&rsquo;ll get back to you at {form.email} within 24 hours.</p>
            <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="Full Name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <Input label="Subject" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            <TextArea label="Message" rows={5} placeholder="Tell us more..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            <Button type="submit" variant="primary" size="lg" fullWidth>
              Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
