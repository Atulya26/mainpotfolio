export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-[var(--admin-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mono-font mb-2 text-[10px] uppercase tracking-[0.12em] text-[var(--admin-subtle)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-medium tracking-[-0.03em] text-white md:text-[2.15rem]">{title}</h1>
        {description && <p className="mt-2 max-w-[68ch] text-sm leading-6 text-[var(--admin-muted)]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
