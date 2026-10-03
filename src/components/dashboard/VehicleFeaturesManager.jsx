import { useEffect, useState } from 'react'
import { Check, ShieldCheck, Sparkles, X } from 'lucide-react'
import Button from '../buttons/Button'
import { useVehicleFeatures } from '../../hooks/useVehicleFeatures'
import { FEATURE_CATEGORIES } from '../../services/vehicleListingService'

export default function VehicleFeaturesManager({ slug, vehicleType, onClose }) {
  const { featureCategories, loading, fetchFeatures, updateFeatures } = useVehicleFeatures(slug, vehicleType)
  const [localFeatures, setLocalFeatures] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchFeatures()
    }
  }, [slug, fetchFeatures])

  useEffect(() => {
    if (Array.isArray(featureCategories)) {
      setLocalFeatures(featureCategories)
    }
  }, [featureCategories])

  const toggleFeatureAvailability = (categoryIdx, featureIdx) => {
    setLocalFeatures((prev) => {
      const next = JSON.parse(JSON.stringify(prev))
      if (next[categoryIdx]?.features[featureIdx]) {
        next[categoryIdx].features[featureIdx].available = !next[categoryIdx].features[featureIdx].available
      }
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Only send features that are checked (available=true).
      // The backend validates every featureMasterId against the vehicle type,
      // so including unchecked features from other types causes a 400 error.
      const featuresList = []
      localFeatures.forEach((cat) => {
        if (Array.isArray(cat.features)) {
          cat.features.forEach((feat) => {
            if (feat.featureMasterId && feat.available) {
              featuresList.push({
                featureMasterId: feat.featureMasterId,
                available: true,
              })
            }
          })
        }
      })
      await updateFeatures({ features: featuresList })
      alert('Vehicle features updated successfully!')
      if (onClose) onClose()
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to update vehicle features.')
    } finally {
      setSaving(false)
    }
  }

  const content = (
    <div className={onClose ? "max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8" : "w-full space-y-6"}>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-text">Vehicle Features &amp; Equipment</h2>
          <p className="mt-1 text-xs text-text-secondary">Select safety, comfort, and interior features available in your vehicle.</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-text-secondary hover:bg-surface-alt">
            <X size={20} />
          </button>
        )}
      </div>

      {loading ? (
        <p className="py-12 text-center text-xs text-text-secondary">Loading vehicle features...</p>
      ) : localFeatures.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-12 text-center text-xs text-text-light">
          <Sparkles size={32} className="mx-auto mb-2 text-primary" />
          <p className="font-semibold text-text-secondary">No feature master catalog found.</p>
          <p className="mt-1 text-text-light">The feature list is loaded from the admin master catalog. Please check back later.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {localFeatures.map((cat, catIdx) => {
            const categoryLabel = FEATURE_CATEGORIES.find((c) => c.value === cat.category)?.label || cat.category
            return (
              <div key={cat.category || catIdx} className="rounded-2xl border border-border bg-surface-alt/40 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary">{categoryLabel}</h3>
                  <span className="text-[10px] font-mono text-text-secondary">
                    {cat.features?.filter((f) => f.available).length ?? 0} / {cat.features?.length ?? 0} selected
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {cat.features?.map((feat, featIdx) => (
                    <label
                      key={feat.featureMasterId || featIdx}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-surface p-3 transition-colors hover:bg-surface-alt"
                    >
                      <div>
                        <p className="text-xs font-bold text-text">{feat.featureName}</p>
                        {feat.description && <p className="text-[11px] text-text-light">{feat.description}</p>}
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(feat.available)}
                        onChange={() => toggleFeatureAvailability(catIdx, featIdx)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button variant="primary" disabled={saving || loading} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save Features'}
        </Button>
      </div>
    </div>
  )

  if (onClose) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}
