export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] uppercase tracking-wider text-white/40 mono-font">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-medium text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-white/50">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
