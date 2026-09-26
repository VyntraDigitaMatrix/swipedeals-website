import { useEffect, useState } from 'react'
import { ImagePlus, Star, Trash2, X } from 'lucide-react'
import Button from '../buttons/Button'
import { useVehicleImages } from '../../hooks/useVehicleImages'
import { PLACEHOLDER_IMAGE } from '../../utils/enumFormat'

export default function VehicleImagesManager({ slug, onClose }) {
  const { images, loading, fetchImages, uploadImages, deleteImage, setPrimaryImage } = useVehicleImages(slug)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchImages()
    }
  }, [slug, fetchImages])

  const handleFileChange = async (e) => {
    if (!e.target.files?.length) return
    setUploading(true)
    try {
      await uploadImages(Array.from(e.target.files))
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to upload vehicle images')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return
    try {
      await deleteImage(imageId)
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to delete image')
    }
  }

  const handleMakePrimary = async (imageId) => {
    try {
      await setPrimaryImage(imageId)
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to set primary image')
    }
  }

  const content = (
    <div className={onClose ? "max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8" : "w-full space-y-6"}>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-text">Vehicle Images</h2>
          <p className="mt-1 text-xs text-text-secondary">Upload photos of your vehicle. At least 1 photo is required before submitting for approval.</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-text-secondary hover:bg-surface-alt">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="rounded-2xl border-2 border-dashed border-border bg-surface-alt p-8 text-center transition-colors hover:border-primary hover:bg-primary/5">
        <label className="flex cursor-pointer flex-col items-center justify-center">
          <div className="mb-3 rounded-full bg-primary/10 p-4 text-primary">
            <ImagePlus size={28} />
          </div>
          <p className="font-bold text-text">{uploading ? 'Uploading...' : 'Click to upload vehicle photos'}</p>
          <p className="mt-1 text-xs text-text-light">PNG, JPG up to 10MB each</p>
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading || loading} />
        </label>
      </div>

      {loading && !uploading && images.length === 0 ? (
        <p className="py-8 text-center text-text-secondary">Loading vehicle images...</p>
      ) : images.length === 0 ? (
        <p className="py-8 text-center text-text-light">No images uploaded yet. Upload at least 1 image to submit for approval.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface-alt">
              <img src={img.imageUrl || PLACEHOLDER_IMAGE} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />

              {img.isPrimary && (
                <span className="absolute left-2 top-2 rounded bg-success px-2 py-1 text-[10px] font-bold tracking-wider text-white shadow-sm">
                  PRIMARY
                </span>
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                {!img.isPrimary && (
                  <Button size="xs" variant="primary" icon={Star} onClick={() => handleMakePrimary(img.id)}>
                    Make Primary
                  </Button>
                )}
                <Button size="xs" variant="outline" icon={Trash2} className="border-danger/50 text-white hover:bg-danger hover:border-danger" onClick={() => handleDelete(img.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {onClose && (
        <div className="mt-8 flex justify-end border-t border-border pt-4">
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
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
