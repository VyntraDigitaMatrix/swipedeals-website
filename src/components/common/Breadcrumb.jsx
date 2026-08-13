import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-text-secondary">
        <li className="flex items-center gap-1.5">
          <Link to="/" className="flex items-center gap-1 hover:text-primary" aria-label="Home">
            <Home size={14} aria-hidden="true" />
          </Link>
          <ChevronRight size={14} className="text-text-light" aria-hidden="true" />
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {item.to && i !== items.length - 1 ? (
              <Link to={item.to} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-text">{item.label}</span>
            )}
            {i !== items.length - 1 && <ChevronRight size={14} className="text-text-light" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}
