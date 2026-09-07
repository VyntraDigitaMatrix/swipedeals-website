import { useEffect, useState } from 'react'

/**
 * Fetches a listing's real photo gallery by slug from one of the public
 * `*Service.getImages(slug)` functions and returns an array of image URLs,
 * primary photo first. Returns `fallback` (e.g. the placeholder array the
 * card mappers produce) while the request is in flight, on error, or when
 * the listing has no uploaded photos yet — so callers never have to branch
 * on a loading/empty state themselves.
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
        const list = res?.data
        if (!Array.isArray(list) || list.length === 0) return

        const ordered = [...list].sort((a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)))
        const urls = ordered.map((img) => img.imageUrl).filter(Boolean)
        if (urls.length) setImages(urls)
      })
      .catch(() => {
        // Keep the fallback image — a missing gallery shouldn't break the card/page.
      })

    return () => {
      cancelled = true
    }
    // Re-fetch only when the listing (or the endpoint used) changes; `fallback`
    // is applied synchronously above and intentionally isn't a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchImages, slug])

  return images
}
