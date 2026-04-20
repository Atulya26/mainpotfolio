import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn.js'
import { Check, ChevronDown, X } from 'lucide-react'

// -----------------------------------------------------------------------
// Button
// -----------------------------------------------------------------------
export function Button({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) {
  const variants = {
    default: 'bg-white text-black hover:bg-white/90',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
    ghost: 'bg-transparent text-white/80 hover:bg-white/5',
    outline: 'border border-white/20 text-white hover:bg-white/10',
    destructive: 'bg-red-500/90 text-white hover:bg-red-500',
    accent: 'bg-[#ff4a1c] text-white hover:bg-[#ff6638]',
  }
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-11 px-6 text-sm',
    icon: 'h-9 w-9',
  }
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  )
}

// -----------------------------------------------------------------------
// Input
// -----------------------------------------------------------------------
export function Input({ className, ...props }) {
  return (
    <input
      {...props}
      className={cn(
        'flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/20 transition-colors',
        className,
      )}
    />
  )
}

// -----------------------------------------------------------------------
// Textarea
// -----------------------------------------------------------------------
export function Textarea({ className, autoGrow = false, ...props }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!autoGrow || !ref.current) return
    const el = ref.current
    const resize = () => {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
    resize()
    el.addEventListener('input', resize)
    return () => el.removeEventListener('input', resize)
  }, [autoGrow, props.value])
  return (
    <textarea
      ref={ref}
      rows={3}
      {...props}
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:border-white/20 transition-colors resize-none',
        className,
      )}
    />
  )
}

// -----------------------------------------------------------------------
// Label + Field
// -----------------------------------------------------------------------
export function Label({ className, children, ...props }) {
  return (
    <label
      {...props}
      className={cn(
        'mono-font text-[10px] uppercase tracking-wider text-white/50',
        className,
      )}
    >
      {children}
    </label>
  )
}

export function Field({ label, hint, children, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <Label>{label}</Label>}
      {children}
      {hint && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  )
}

// -----------------------------------------------------------------------
// Card
// -----------------------------------------------------------------------
export function Card({ className, children, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-xl border border-white/10 bg-white/[0.03] p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-4 flex flex-col gap-1', className)}>{children}</div>
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-lg font-medium text-white', className)}>{children}</h3>
}

export function CardDescription({ className, children }) {
  return <p className={cn('text-sm text-white/50', className)}>{children}</p>
}

// -----------------------------------------------------------------------
// Switch (toggle)
// -----------------------------------------------------------------------
export function Switch({ checked, onChange, className }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
        checked ? 'bg-[#ff4a1c]' : 'bg-white/10',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

// -----------------------------------------------------------------------
// Select (native, styled)
// -----------------------------------------------------------------------
export function Select({ value, onChange, options, className }) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-full appearance-none rounded-md border border-white/10 bg-white/5 px-3 pr-8 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o} className="bg-zinc-900">
            {o.label ?? o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-white/40" />
    </div>
  )
}

// -----------------------------------------------------------------------
// Toast
// -----------------------------------------------------------------------
let toastListeners = []
export function toast(msg, opts = {}) {
  const entry = { id: Math.random().toString(36).slice(2), msg, ...opts }
  toastListeners.forEach((l) => l(entry))
}

export function Toaster() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const fn = (entry) => {
      setItems((s) => [...s, entry])
      setTimeout(() => {
        setItems((s) => s.filter((i) => i.id !== entry.id))
      }, entry.duration ?? 3000)
    }
    toastListeners.push(fn)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== fn)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur text-sm',
            item.variant === 'destructive'
              ? 'bg-red-500/10 border-red-500/30 text-red-100'
              : 'bg-white/10 border-white/20 text-white',
          )}
          style={{ minWidth: 280 }}
        >
          {item.variant === 'success' && <Check className="h-4 w-4 text-emerald-400" />}
          <span>{item.msg}</span>
        </div>
      ))}
    </div>
  )
}

// -----------------------------------------------------------------------
// Dialog
// -----------------------------------------------------------------------
export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onEsc = (e) => e.key === 'Escape' && onOpenChange?.(false)
    window.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onEsc)
    }
  }, [open, onOpenChange])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-10 w-full max-w-xl rounded-xl border border-white/10 bg-[#14141a] p-6 shadow-2xl max-h-[85vh] overflow-auto admin-scroll">
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, onClose }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>{children}</div>
      {onClose && (
        <button
          className="rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------
// Tabs (controlled)
// -----------------------------------------------------------------------
export function Tabs({ value, onChange, items, className }) {
  return (
    <div
      className={cn(
        'inline-flex rounded-lg border border-white/10 bg-white/5 p-1',
        className,
      )}
    >
      {items.map((it) => (
        <button
          key={it.value}
          onClick={() => onChange(it.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            value === it.value
              ? 'bg-white text-black'
              : 'text-white/60 hover:text-white',
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}
