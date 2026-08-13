import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Clock, Mic, Search, TrendingUp, X } from 'lucide-react'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useRecentSearches } from '../../hooks/useRecentSearches'
import { searchCategories, popularSearches } from '../../data/search'
import { cn } from '../../utils/cn'

export default function SmartSearchBar({ variant = 'hero' }) {
  const [activeCategory, setActiveCategory] = useState(searchCategories[0].id)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [listening, setListening] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const { recent, addSearch, clearSearches } = useRecentSearches()

  useOnClickOutside(containerRef, () => setFocused(false))

  const category = searchCategories.find((c) => c.id === activeCategory)

  const runSearch = (term) => {
    const value = term ?? query
    if (!value.trim()) return
    addSearch(value)
    setFocused(false)
    navigate(`${category.path}?q=${encodeURIComponent(value.trim())}`)
  }

  const handleVoiceSearch = () => {
    setListening(true)
    // Simulated voice capture (Web Speech API requires user's own browser permissions).
    setTimeout(() => setListening(false), 1600)
  }

  const isHero = variant === 'hero'

  return (
    <div ref={containerRef} className={cn('relative w-full', isHero ? 'max-w-3xl' : 'max-w-xl')}>
      {isHero && (
        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
          {searchCategories.map((cat) => {
            const Icon = Icons[cat.icon] || Icons.Search
            const active = cat.id === activeCategory
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                  active ? 'bg-white text-primary shadow-soft' : 'bg-white/15 text-white hover:bg-white/25'
                )}
              >
                <Icon size={14} aria-hidden="true" />
                {cat.label}
              </button>
            )
          })}
        </div>
      )}

      <div
        className={cn(
          'flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lift',
          isHero ? 'sm:gap-3 sm:p-2.5' : 'rounded-xl shadow-soft'
        )}
      >
        <Search size={isHero ? 20 : 17} className="ml-2 shrink-0 text-text-light" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => e.key === 'Enter' && runSearch()}
          placeholder={`Search ${category.label.toLowerCase()}...  e.g. "${popularSearches[0]}"`}
          aria-label="Search"
          className={cn('flex-1 bg-transparent text-text placeholder:text-text-light outline-none', isHero ? 'py-2 text-sm sm:text-base' : 'py-1.5 text-sm')}
        />
        <button
          type="button"
          onClick={handleVoiceSearch}
          aria-label="Search by voice"
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full p-2 transition-colors',
            listening ? 'animate-pulse bg-danger/10 text-danger' : 'text-text-light hover:bg-surface-alt hover:text-primary'
          )}
        >
          <Mic size={isHero ? 18 : 16} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => runSearch()}
          className={cn(
            'shrink-0 rounded-xl bg-gradient-primary font-bold text-white shadow-soft transition-transform hover:brightness-110',
            isHero ? 'px-5 py-2.5 text-sm sm:px-6' : 'px-4 py-2 text-xs'
          )}
        >
          Search
        </button>
      </div>

      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-surface p-4 text-left shadow-lift"
          >
            {recent.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-text-secondary">
                    <Clock size={13} aria-hidden="true" /> Recent Searches
                  </p>
                  <button type="button" onClick={clearSearches} className="text-xs text-text-light hover:text-danger">
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => runSearch(term)}
                      className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-primary hover:text-primary"
                    >
                      {term}
                      <X
                        size={11}
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-text-secondary">
                <TrendingUp size={13} aria-hidden="true" /> Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => runSearch(term)}
                    className="rounded-full bg-surface-alt px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-primary/10 hover:text-primary"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
