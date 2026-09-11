import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BadgeCheck, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import Breadcrumb from '../common/Breadcrumb'
import ImageGallery from '../common/ImageGallery'
import Rating from '../common/Rating'
import Badge from '../common/Badge'
import WishlistButton from '../common/WishlistButton'
import Button from '../buttons/Button'
import SellerReviewSection from '../seller/SellerReviewSection'
import ChatDrawer from '../chat/ChatDrawer'
import { getDealerById } from '../../data/dealers'

/**
 * Shared shell for every product/property detail page — gallery, title block,
 * dealer contact card and a slot for category-specific spec content.
 */
export default function DetailLayout({
  item,
  breadcrumbLabel,
  breadcrumbTo,
  badges = [],
  priceBlock,
  specs = [],
  description,
  children,
  similar,
  sellerCard,
  belowContact,
}) {
  const [chatOpen, setChatOpen] = useState(false)
  const dealer = getDealerById(item.dealerId)
  const effectiveSellerId = item.sellerId || dealer?.id || item.id || '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  const sellerName = dealer?.name || item.sellerName || item.brand || 'Seller'

  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: breadcrumbLabel, to: breadcrumbTo }, { label: item.title }]} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <ImageGallery images={item.images} title={item.title} />

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {badges.map((b) => (
                    <Badge key={b.label} variant={b.variant} icon={b.icon}>
                      {b.label}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-2xl font-extrabold text-text sm:text-3xl">{item.title}</h1>
                {item.location && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-text-secondary">
                    <MapPin size={14} aria-hidden="true" /> {item.location}
                  </p>
                )}
                <Rating value={item.rating} reviews={dealer?.reviews} className="mt-2" />
              </div>
              <WishlistButton id={item.id} size={20} className="shrink-0 !bg-surface-alt" />
            </div>

            {specs.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="rounded-xl border border-border bg-surface p-3.5">
                    <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                      {spec.icon && <spec.icon size={13} aria-hidden="true" />}
                      {spec.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-text">{spec.value}</p>
                  </div>
                ))}
              </div>
            )}

            {description && (
              <div className="mt-8">
                <h2 className="mb-3 text-lg font-bold text-text">Description</h2>
                <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
              </div>
            )}

            {children}

            <div className="mt-10">
              <SellerReviewSection sellerId={effectiveSellerId} sellerName={sellerName} />
            </div>
          </motion.div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            {priceBlock}
            <div className="mt-5 flex flex-col gap-2.5">
              <Button variant="primary" fullWidth icon={Phone} onClick={() => setChatOpen(true)}>
                Contact Seller
              </Button>
              <Button variant="outline" fullWidth icon={MessageCircle} onClick={() => setChatOpen(true)}>
                Chat Now
              </Button>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-secondary">
              <ShieldCheck size={13} className="text-success" aria-hidden="true" /> Safe & secure transaction guaranteed
            </p>
          </div>

          {belowContact}

          {sellerCard || dealer ? (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-secondary">Listed By</p>
              <Link to={dealer?.slug ? `/${dealer.slug}` : '#'} className="flex items-center gap-3 group">
                <img src={dealer.logo} alt={dealer.name} className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-bold text-text group-hover:text-primary">{dealer.name}</p>
                    {dealer.verified && <BadgeCheck size={14} className="shrink-0 text-info" aria-hidden="true" />}
                  </div>
                  <Rating value={dealer.rating} reviews={dealer.reviews} size={11} />
                </div>
              </Link>
            </div>
          ) : (item.sellerName || sellerName) ? (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-secondary">Listed By</p>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-hero text-lg font-black text-white shadow-soft">
                  {(item.sellerName || sellerName).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-bold text-text">{item.sellerName || sellerName}</p>
                    <BadgeCheck size={14} className="shrink-0 text-info" aria-hidden="true" />
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                    {item.sellerType && (
                      <span className="rounded bg-surface-alt px-1.5 py-0.5 font-semibold text-[10px] uppercase text-primary">
                        {item.sellerType}
                      </span>
                    )}
                    {item.rating != null && item.rating > 0 && (
                      <span className="font-semibold text-amber-500">★ {item.rating.toFixed(1)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {similar && (
        <div className="mt-16">
          <h2 className="mb-6 text-xl font-extrabold text-text sm:text-2xl">You may also like</h2>
          {similar}
        </div>
      )}

      <ChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        recipientId={effectiveSellerId}
        title={`Chat with ${sellerName}`}
      />
    </div>
  )
}
