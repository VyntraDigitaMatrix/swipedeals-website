import { useEffect, useState, useRef } from 'react'
import {
  ImagePlus,
  Star,
  Trash2,
  X,
  Upload,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  Layers,
  Maximize2,
} from 'lucide-react'
import Button from '../buttons/Button'
import { useVehicleImages } from '../../hooks/useVehicleImages'
import { PLACEHOLDER_IMAGE } from '../../utils/enumFormat'

export default function VehicleImagesManager({ slug, onClose }) {
  const {
    images,
    primaryImage,
    loading,
    primaryLoading,
    uploading,
    actionLoadingId,
    error,
    setError,
    fetchImages,
    fetchPrimaryImage,
    uploadImages,
    updateImage,
    deleteImage,
    setPrimaryImage,
    updateImageOrder,
  } = useVehicleImages(slug)

  const [dragActive, setDragActive] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [activePreviewImage, setActivePreviewImage] = useState(null)
  const [editingOrderId, setEditingOrderId] = useState(null)
  const [orderInputValue, setOrderInputValue] = useState('')

  // Hidden file inputs for individual image replacement
  const replaceInputRefs = useRef({})
  const multiUploadInputRef = useRef(null)

  useEffect(() => {
    if (slug) {
      fetchImages()
      fetchPrimaryImage()
    }
  }, [slug, fetchImages, fetchPrimaryImage])

  // Clear success notification after 4s
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileChange = async (e) => {
    if (!e.target.files?.length) return
    handleFiles(Array.from(e.target.files))
    // Reset file input so same file can be re-selected if needed
    e.target.value = ''
  }

  const handleFiles = async (fileList) => {
    const validFiles = fileList.filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(f.type)
    )

    if (validFiles.length === 0) {
      setError('Please select valid image files (JPEG, PNG, or WebP).')
      return
    }

    // Check size limit (10MB max per file)
    const oversized = validFiles.find((f) => f.size > 10 * 1024 * 1024)
    if (oversized) {
      setError(`File "${oversized.name}" exceeds the 10MB size limit.`)
      return
    }

    try {
      await uploadImages(validFiles)
      setSuccessMessage(
        validFiles.length > 1
          ? `Successfully uploaded ${validFiles.length} vehicle images!`
          : 'Vehicle image uploaded successfully!'
      )
    } catch (err) {
      // Error already set by hook
    }
  }

  // Replace / Update an existing image
  const triggerReplaceFile = (imageId) => {
    if (replaceInputRefs.current[imageId]) {
      replaceInputRefs.current[imageId].click()
    }
  }

  const handleReplaceFileChange = async (imageId, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Selected image exceeds the 10MB size limit.')
      return
    }

    try {
      await updateImage(imageId, file)
      setSuccessMessage('Vehicle image replaced successfully!')
    } catch (err) {
      // Error already handled
    } finally {
      e.target.value = ''
    }
  }

  // Delete image
  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle photo?')) return
    try {
      await deleteImage(imageId)
      setSuccessMessage('Vehicle image deleted.')
    } catch (err) {
      // Error already handled
    }
  }

  // Set as primary image
  const handleMakePrimary = async (imageId) => {
    try {
      await setPrimaryImage(imageId)
      setSuccessMessage('Primary cover image updated successfully!')
    } catch (err) {
      // Error already handled
    }
  }

  // Move image order left (earlier) or right (later)
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= images.length) return

    const currentImg = images[index]
    const targetImg = images[targetIndex]
    if (!currentImg || !targetImg) return

    // Calculate new display order
    const currentOrder = typeof currentImg.displayOrder === 'number' ? currentImg.displayOrder : index + 1
    const targetOrder = typeof targetImg.displayOrder === 'number' ? targetImg.displayOrder : targetIndex + 1

    try {
      // Assign the target order to current image
      await updateImageOrder(currentImg.id, targetOrder)
      setSuccessMessage('Image order updated successfully!')
    } catch (err) {
      // Handled in hook
    }
  }

  // Save manual order edit
  const handleSaveOrder = async (imageId) => {
    const parsed = parseInt(orderInputValue, 10)
    if (isNaN(parsed) || parsed < 0) {
      setEditingOrderId(null)
      return
    }

    try {
      await updateImageOrder(imageId, parsed)
      setSuccessMessage(`Image order updated to #${parsed}!`)
    } catch (err) {
      // Handled in hook
    } finally {
      setEditingOrderId(null)
      setOrderInputValue('')
    }
  }

  const content = (
    <div
      className={
        onClose
          ? 'max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-8'
          : 'w-full space-y-6'
      }
    >
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Camera size={20} />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-text sm:text-2xl">
              Vehicle Images
            </h2>
            <span className="rounded-full bg-surface-alt px-2.5 py-0.5 text-xs font-semibold text-text-secondary border border-border">
              {images.length} {images.length === 1 ? 'photo' : 'photos'}
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            Manage, reorder, replace, and set the primary cover photo for your vehicle listing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={RefreshCw}
            loading={loading || primaryLoading}
            onClick={() => {
              fetchImages()
              fetchPrimaryImage()
            }}
            title="Refresh Images"
            className="text-xs"
          >
            Refresh
          </Button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-surface-alt hover:text-text"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* ALERT BANNERS */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-xs text-danger animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-danger hover:opacity-80"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-xs text-success animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-success hover:opacity-80"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* PRIMARY / COVER PHOTO SPOTLIGHT */}
      {primaryImage && (
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-alt shadow-sm">
                <img
                  src={primaryImage.imageUrl || PLACEHOLDER_IMAGE}
                  alt="Primary vehicle cover"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-semibold text-white">
                  Cover
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Star size={14} className="fill-primary" />
                  <span>Current Primary Cover Photo</span>
                </div>
                <p className="text-xs text-text-secondary">
                  This image appears as the main thumbnail in search results and card displays.
                </p>
                {typeof primaryImage.displayOrder === 'number' && (
                  <p className="text-[11px] text-text-light font-medium">
                    Display Order: #{primaryImage.displayOrder}
                  </p>
                )}
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              icon={Eye}
              onClick={() => setActivePreviewImage(primaryImage.imageUrl)}
              className="self-start text-xs sm:self-center"
            >
              View Full Size
            </Button>
          </div>
        </div>
      )}

      {/* DRAG & DROP UPLOAD ZONE */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? 'border-primary bg-primary/10 ring-4 ring-primary/10'
            : 'border-border bg-surface-alt/70 hover:border-primary hover:bg-primary/5'
        }`}
      >
        <input
          ref={multiUploadInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading || loading}
        />

        <div className="flex flex-col items-center justify-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm transition-transform duration-300 hover:scale-110">
            {uploading ? (
              <RefreshCw size={26} className="animate-spin" />
            ) : (
              <ImagePlus size={28} />
            )}
          </div>

          <h3 className="text-base font-bold text-text">
            {uploading ? 'Uploading Vehicle Photos...' : 'Drop vehicle photos here, or browse'}
          </h3>
          <p className="mt-1 text-xs text-text-secondary max-w-sm">
            Upload clear shots from front, sides, rear, interior, odometer and engine bay.
          </p>
          <p className="mt-1 text-[11px] text-text-light">
            PNG, JPG, JPEG, WEBP up to 10MB each.
          </p>

          <Button
            type="button"
            variant="primary"
            size="sm"
            icon={Upload}
            loading={uploading}
            disabled={uploading || loading}
            onClick={() => multiUploadInputRef.current?.click()}
            className="mt-4 shadow-sm"
          >
            Select Photos from Device
          </Button>
        </div>
      </div>

      {/* IMAGES GALLERY GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-text flex items-center gap-2">
            <Layers size={16} className="text-primary" />
            <span>Uploaded Photos ({images.length})</span>
          </h4>
          <span className="text-xs text-text-light">
            Tip: Use arrow buttons to reorder photos
          </span>
        </div>

        {loading && !uploading && images.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface-alt py-12">
            <RefreshCw size={24} className="animate-spin text-primary" />
            <p className="mt-3 text-xs text-text-secondary">Loading vehicle photos...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface-alt/40 py-12 text-center">
            <Camera size={32} className="mx-auto text-text-light" />
            <p className="mt-2 text-sm font-semibold text-text">No images uploaded yet</p>
            <p className="mt-1 text-xs text-text-secondary">
              At least 1 photo is required before submitting your listing for approval.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, index) => {
              const isActionLoading = actionLoadingId === img.id
              const displayNum = typeof img.displayOrder === 'number' ? img.displayOrder : index + 1

              return (
                <div
                  key={img.id}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 bg-surface shadow-sm ${
                    img.isPrimary
                      ? 'border-primary shadow-primary/10 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50 hover:shadow-md'
                  }`}
                >
                  {/* Hidden file input for Replace action */}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    ref={(el) => (replaceInputRefs.current[img.id] = el)}
                    onChange={(e) => handleReplaceFileChange(img.id, e)}
                    disabled={isActionLoading}
                  />

                  {/* THUMBNAIL CONTAINER */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-alt">
                    <img
                      src={img.imageUrl || PLACEHOLDER_IMAGE}
                      alt={`Vehicle angle ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* OVERLAY LOADING SPINNER */}
                    {isActionLoading && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white">
                        <RefreshCw size={24} className="animate-spin text-primary" />
                        <span className="mt-2 text-[11px] font-medium">Updating...</span>
                      </div>
                    )}

                    {/* BADGES */}
                    <div className="absolute left-2.5 top-2.5 z-10 flex flex-wrap items-center gap-1.5">
                      {/* Display Order Badge */}
                      <span className="flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white backdrop-blur-xs shadow-xs">
                        #{displayNum}
                      </span>

                      {/* Primary Badge */}
                      {img.isPrimary && (
                        <span className="flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-xs">
                          <Star size={11} className="fill-white" />
                          PRIMARY
                        </span>
                      )}
                    </div>

                    {/* Quick Preview Button */}
                    <button
                      type="button"
                      onClick={() => setActivePreviewImage(img.imageUrl)}
                      className="absolute right-2.5 top-2.5 z-10 rounded-lg bg-black/60 p-1.5 text-white opacity-0 backdrop-blur-xs transition-opacity hover:bg-black/90 group-hover:opacity-100"
                      title="Zoom Photo"
                      aria-label="Zoom Photo"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>

                  {/* CARD ACTIONS BAR */}
                  <div className="flex flex-col gap-2.5 p-3.5 bg-surface border-t border-border">
                    {/* Primary & Reorder Row */}
                    <div className="flex items-center justify-between gap-1">
                      {/* Reorder Left/Right Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'left')}
                          disabled={index === 0 || isActionLoading}
                          title="Move Earlier"
                          className="rounded-lg border border-border p-1.5 text-text-secondary transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ArrowLeft size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'right')}
                          disabled={index === images.length - 1 || isActionLoading}
                          title="Move Later"
                          className="rounded-lg border border-border p-1.5 text-text-secondary transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ArrowRight size={14} />
                        </button>

                        {/* Order Input / Edit */}
                        {editingOrderId === img.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={orderInputValue}
                              onChange={(e) => setOrderInputValue(e.target.value)}
                              placeholder="#"
                              className="h-7 w-12 rounded-lg border border-primary bg-surface px-1.5 text-center text-xs font-semibold text-text focus:outline-hidden"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveOrder(img.id)}
                              className="rounded-lg bg-primary px-2 py-1 text-[11px] font-bold text-white hover:brightness-110"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingOrderId(null)}
                              className="rounded-lg p-1 text-text-secondary hover:bg-surface-alt"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOrderId(img.id)
                              setOrderInputValue(String(displayNum))
                            }}
                            className="rounded-lg px-1.5 py-1 text-[11px] font-medium text-text-light hover:bg-surface-alt hover:text-text transition-colors"
                            title="Edit exact order number"
                          >
                            Order: #{displayNum}
                          </button>
                        )}
                      </div>

                      {/* Primary Toggle Action */}
                      {!img.isPrimary ? (
                        <button
                          type="button"
                          onClick={() => handleMakePrimary(img.id)}
                          disabled={isActionLoading}
                          className="flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/5 px-2 py-1 text-[11px] font-bold text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-50"
                          title="Set as vehicle primary cover photo"
                        >
                          <Star size={12} />
                          <span>Make Primary</span>
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-primary">
                          <CheckCircle2 size={13} />
                          <span>Primary</span>
                        </span>
                      )}
                    </div>

                    {/* Replace & Delete Buttons */}
                    <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        icon={Upload}
                        disabled={isActionLoading}
                        onClick={() => triggerReplaceFile(img.id)}
                        className="flex-1 text-xs py-1.5 h-8 font-medium"
                        title="Upload a new photo to replace this image"
                      >
                        Replace
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        icon={Trash2}
                        disabled={isActionLoading}
                        onClick={() => handleDelete(img.id)}
                        className="text-xs py-1.5 h-8 border-danger/30 text-danger hover:bg-danger hover:border-danger hover:text-white"
                        title="Delete vehicle photo"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      {onClose && (
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <p className="text-xs text-text-light">
            All changes, updates, and order changes are saved immediately.
          </p>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      )}

      {/* FULLSCREEN PREVIEW / LIGHTBOX MODAL */}
      {activePreviewImage && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActivePreviewImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePreviewImage(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition-colors"
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>
            <img
              src={activePreviewImage}
              alt="Vehicle preview"
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )

  if (onClose) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
        {content}
      </div>
    )
  }

  return content
}
