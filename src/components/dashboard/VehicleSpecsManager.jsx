import { useEffect, useState } from 'react'
import { Pencil, Plus, Sliders, Trash2, X } from 'lucide-react'
import Button from '../buttons/Button'
import Input from '../forms/Input'
import Dropdown from '../forms/Dropdown'
import { useVehicleSpecifications } from '../../hooks/useVehicleSpecifications'
import { SPEC_CATEGORIES } from '../../services/vehicleListingService'

export default function VehicleSpecsManager({ slug, onClose }) {
  const { specifications, loading, fetchSpecifications, addSpecification, updateSpecification, deleteSpecification } = useVehicleSpecifications(slug)
  const [category, setCategory] = useState('ENGINE_AND_TRANSMISSION')
  const [specKey, setSpecKey] = useState('')
  const [specValue, setSpecValue] = useState('')
  const [displayOrder, setDisplayOrder] = useState(1)
  const [adding, setAdding] = useState(false)
  const [editingSpec, setEditingSpec] = useState(null) // { id, category, specKey, specValue, displayOrder }

  useEffect(() => {
    if (slug) fetchSpecifications()
  }, [slug, fetchSpecifications])

  // Auto-increment displayOrder as new specs are added
  useEffect(() => {
    setDisplayOrder(specifications.length + 1)
  }, [specifications.length])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!specKey.trim() || !specValue.trim()) {
      alert('Please enter both Spec Key and Spec Value.')
      return
    }
    setAdding(true)
    try {
      await addSpecification({
        category,
        specKey: specKey.trim(),
        specValue: specValue.trim(),
        displayOrder,
      })
      setSpecKey('')
      setSpecValue('')
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to add specification.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (specId) => {
    if (!window.confirm('Are you sure you want to delete this specification?')) return
    try {
      await deleteSpecification(specId)
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to delete specification.')
    }
  }

  const handleEdit = (spec) => {
    setEditingSpec({ ...spec })
  }

  const handleCancelEdit = () => {
    setEditingSpec(null)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingSpec.specKey?.trim() || !editingSpec.specValue?.trim()) {
      alert('Please enter both Spec Key and Spec Value.')
      return
    }
    try {
      await updateSpecification(editingSpec.id, {
        category: editingSpec.category,
        specKey: editingSpec.specKey.trim(),
        specValue: editingSpec.specValue.trim(),
        displayOrder: editingSpec.displayOrder,
      })
      setEditingSpec(null)
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to update specification.')
    }
  }

  const content = (
    <div className={onClose ? 'max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8' : 'w-full space-y-6'}>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-text">Technical Specifications</h2>
          <p className="mt-1 text-xs text-text-secondary">
            Add technical details such as Engine Displacement, Max Torque, Seating Capacity, etc.
          </p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-text-secondary hover:bg-surface-alt">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Add Spec Form — all 4 API fields from CreateVehicleSpecificationRequest */}
      <form onSubmit={handleAdd} className="rounded-2xl border border-border bg-surface-alt/60 p-5">


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* category — enum: DIMENSIONS_AND_CAPACITY | ENGINE_AND_TRANSMISSION | FUEL_AND_PERFORMANCE | SUSPENSION_STEERING_AND_BRAKES | OTHER */}
          <Dropdown
            label="Category"
            value={category}
            onChange={(v) => setCategory(v)}
            options={SPEC_CATEGORIES}
          />

          {/* displayOrder — int32 */}
          <Input
            label="Display Order"
            placeholder="e.g. 1"
            type="number"
            min={1}
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />

          {/* specKey — string [0, 100] */}
          <Input
            label="Spec Key"
            placeholder="e.g. Engine Displacement"
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            maxLength={100}
          />

          {/* specValue — string [0, 255] */}
          <Input
            label="Spec Value"
            placeholder="e.g. 1497 cc"
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
            maxLength={255}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            disabled={adding || !specKey.trim() || !specValue.trim()}
            type="submit"
          >
            {adding ? 'Adding...' : 'Add Specification'}
          </Button>
        </div>
      </form>

      {/* Current specifications list */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-text">Current Specifications ({specifications.length})</h3>
        {loading ? (
          <p className="py-8 text-center text-xs text-text-secondary">Loading specifications...</p>
        ) : specifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-text-light">
            <Sliders size={32} className="mx-auto mb-2 text-text-light/60" />
            No technical specifications added yet. Add specs to make your listing stand out!
          </div>
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border bg-surface">
            {specifications.map((spec) => {
              const categoryLabel = SPEC_CATEGORIES.find((c) => c.value === spec.category)?.label || spec.category
              const isEditing = editingSpec?.id === spec.id
              return (
                <div key={spec.id} className="p-4 hover:bg-surface-alt/50">
                  {isEditing ? (
                    <form onSubmit={handleUpdate} className="flex flex-col gap-2">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <select
                          value={editingSpec.category}
                          onChange={(e) => setEditingSpec((s) => ({ ...s, category: e.target.value }))}
                          className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {SPEC_CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                        <input
                          value={editingSpec.specKey}
                          onChange={(e) => setEditingSpec((s) => ({ ...s, specKey: e.target.value }))}
                          placeholder="Spec Key"
                          className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          value={editingSpec.specValue}
                          onChange={(e) => setEditingSpec((s) => ({ ...s, specValue: e.target.value }))}
                          placeholder="Spec Value"
                          className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={handleCancelEdit} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-alt">Cancel</button>
                        <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90">Save</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{categoryLabel}</span>
                          <span className="text-[10px] text-text-light">· Order: {spec.displayOrder ?? '—'}</span>
                        </div>
                        <p className="truncate text-sm font-bold text-text">{spec.specKey}</p>
                        <p className="truncate text-xs text-text-secondary">{spec.specValue}</p>
                      </div>
                      <div className="ml-3 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(spec)}
                          className="rounded-lg p-2 text-primary hover:bg-primary/10"
                          title="Edit Specification"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(spec.id)}
                          className="rounded-lg p-2 text-danger hover:bg-danger/10"
                          title="Delete Specification"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {onClose && (
        <div className="mt-8 flex justify-end border-t border-border pt-4">
          <Button variant="primary" onClick={onClose}>Done</Button>
        </div>
      )}
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
