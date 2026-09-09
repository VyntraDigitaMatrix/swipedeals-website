import { motion } from 'framer-motion'

// Latest value is called out top-right like a ticker readout, and the endpoint
// gets a small pulse to draw the eye to "where you are now" on the trend.
export default function SimpleLineChart({ data, title, subtitle, color = 'var(--color-primary)' }) {
  const width = 600
  const height = 220
  const padding = 20
  const max = Math.max(...data.map((d) => d.value), 1)
  const min = Math.min(...data.map((d) => d.value), 0)
  const range = max - min || 1
  const latest = data[data.length - 1]

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2)
    return { x, y, ...d }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
  const lastPoint = points[points.length - 1]

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          {subtitle && <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-light">{subtitle}</p>}
          {title && <h3 className="text-sm font-bold text-text">{title}</h3>}
        </div>
        <p className="font-mono text-lg font-extrabold tabular-nums text-primary">{latest?.value}</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={title}>
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={areaD} fill="url(#lineFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        {points.map((p) => (
          <circle key={p.label} cx={p.x} cy={p.y} r={4} fill="var(--color-surface)" stroke={color} strokeWidth={2} />
        ))}
        <motion.circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={7}
          fill={color}
          fillOpacity={0.15}
          animate={{ r: [7, 11, 7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx={lastPoint.x} cy={lastPoint.y} r={4} fill={color} />
      </svg>
      <div className="mt-2 flex justify-between px-1">
        {data.map((d) => (
          <span key={d.label} className="text-[10px] font-medium text-text-secondary">{d.label}</span>
        ))}
      </div>
    </div>
  )
}