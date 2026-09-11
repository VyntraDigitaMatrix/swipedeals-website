import { useEffect, useState } from 'react'

/**
 * Fetches a listing's real photo gallery by slug from one of the public
 * `*Service.getImages(slug)` functions and returns an array of image URLs,
 * primary photo first. Returns `fallback` while the request is in flight, on
 * error, or when the listing has no uploaded photos yet. If API images exist,
 * only the API images are displayed.
 */
export function usePublicImages(fetchImages, slug, fallback) {
  const [images, setImages] = useState(fallback)

  useEffect(() => {
    setImages(fallback)

    if (!slug || typeof fetchImages !== 'function') return

    let cancelled = false

    fetchImages(slug)
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data?.content)
          ? res.data.content
          : Array.isArray(res)
          ? res
          : []
        if (!list || list.length === 0) return

        const ordered = [...list].sort(
          (a, b) =>
            Number(Boolean(b?.isPrimary)) - Number(Boolean(a?.isPrimary)) ||
            (a?.displayOrder || 0) - (b?.displayOrder || 0)
        )
        const urls = ordered.map((img) => (typeof img === 'string' ? img : img?.imageUrl)).filter(Boolean)
        
        // If API images exist, use only API images (do not append fallback URLs)
        if (urls.length > 0) {
          setImages(urls)
        }
      })
      .catch(() => {
        // Keep fallback images on error
      })

    return () => {
      cancelled = true
    }
  }, [fetchImages, slug])

  return images
}
