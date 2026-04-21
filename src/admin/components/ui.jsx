/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn.js'
import { Check, ChevronDown, X } from 'lucide-react'

const buttonBase =
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium tracking-[-0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]'

const buttonVariants = {
  default: 'bg-[var(--admin-ink)] text-[var(--admin-bg)] shadow-[var(--admin-shadow)] hover:bg-white',
  secondary: 'border border-[var(--admin-border)] bg-[var(--admin-panel)] text-white shadow-[var(--admin-shadow)] hover:bg-[var(--admin-panel-strong)]',
  ghost: 'bg-transparent text-[var(--admin-muted)] hover:bg-white/5 hover:text-white',
  outline: 'border border-[var(--admin-border-strong)] bg-transparent text-white hover:bg-white/5',
  destructive: 'bg-red-500/90 text-white shadow-[var(--admin-shadow)] hover:bg-red-500',
  accent: 'bg-[var(--admin-accent)] text-white shadow-[var(--admin-shadow)] hover:bg-[var(--admin-accent-strong)]',
}

const buttonSizes = {
  sm: 'h-9 px-3.5 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
  icon: 'h-10 w-10',
}

export function Button({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <button
      {...props}
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
    >
      {children}
    </button>
  )
}

export function Badge({ variant = 'neutral', className, children, ...props }) {
  const variants = {
    neutral: 'bg-white/8 text-[var(--admin-muted)] ring-1 ring-inset ring-[var(--admin-border)]',
    accent: 'bg-[color:color-mix(in_srgb,var(--admin-accent)_16%,transparent)] text-[var(--admin-accent-strong)] ring-1 ring-inset ring-[color:color-mix(in_srgb,var(--admin-accent)_28%,transparent)]',
    success: 'bg-emerald-500/12 text-emerald-300 ring-1 ring-inset ring-emerald-400/20',
    destructive: 'bg-red-500/12 text-red-300 ring-1 ring-inset ring-red-400/20',
  }

  return (
    <span
      {...props}
      className={cn(
        'mono-font inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Input({ className, ...props }) {
  return (
    <input
      {...props}
      className={cn(
        'flex h-11 w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-panel-muted)] px-3.5 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-[var(--admin-subtle)] transition-[border-color,background-color,box-shadow] duration-200 focus-visible:border-[var(--admin-border-strong)] focus-visible:bg-[var(--admin-panel)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10',
        className,
      )}
    />
  )
}

export function Textarea({ className, autoGrow = false, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!autoGrow || !ref.current) return
    const el = ref.current
    const resize = () => {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
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
        'flex min-h-[104px] w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-panel-muted)] px-3.5 py-3 text-sm leading-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-[var(--admin-subtle)] transition-[border-color,background-color,box-shadow] duration-200 focus-visible:border-[var(--admin-border-strong)] focus-visible:bg-[var(--admin-panel)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10 resize-none',
        className,
      )}
    />
  )
}

export function Label({ className, children, ...props }) {
  return (
    <label
      {...props}
      className={cn(
        'mono-font text-[10px] uppercase tracking-[0.12em] text-[var(--admin-subtle)]',
        className,
      )}
    >
      {children}
    </label>
  )
}

export function Field({ label, hint, children, className }) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {label && <Label>{label}</Label>}
      {children}
      {hint && <p className="text-xs leading-5 text-[var(--admin-subtle)]">{hint}</p>}
    </div>
  )
}

export function Card({ className, children, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-[24px] border border-[var(--admin-border)] bg-[var(--admin-panel)] p-6 shadow-[var(--admin-shadow)] backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-5 flex flex-col gap-2', className)}>{children}</div>
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-lg font-medium tracking-[-0.02em] text-white', className)}>{children}</h3>
}

export function CardDescription({ className, children }) {
  return <p className={cn('max-w-[68ch] text-sm leading-6 text-[var(--admin-muted)]', className)}>{children}</p>
}

export function Switch({ checked, onChange, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full border border-white/10 transition-[background-color,border-color,transform] duration-200 active:scale-[0.97]',
        checked ? 'bg-[var(--admin-accent)] border-transparent' : 'bg-white/10 border-[var(--admin-border)]',
        className,
      )}
    >
      <span
        className={cn(
          'inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-[22px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  )
}

export function Select({ value, onChange, options, className }) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-11 w-full appearance-none rounded-xl border border-[var(--admin-border)] bg-[var(--admin-panel-muted)] px-3.5 pr-10 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[border-color,background-color,box-shadow] duration-200 focus-visible:border-[var(--admin-border-strong)] focus-visible:bg-[var(--admin-panel)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10"
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o} className="bg-[#0f1115] text-white">
            {o.label ?? o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[var(--admin-subtle)]" />
    </div>
  )
}

let toastListeners = []

export function toast(msg, opts = {}) {
  const entry = { id: Math.random().toString(36).slice(2), msg, ...opts }
  toastListeners.forEach((listener) => listener(entry))
}

export function Toaster() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const handle = (entry) => {
      setItems((current) => [...current, entry])
      setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== entry.id))
      }, entry.duration ?? 3200)
    }

    toastListeners.push(handle)
    return () => {
      toastListeners = toastListeners.filter((listener) => listener !== handle)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex max-w-sm flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-[var(--admin-shadow-strong)] backdrop-blur-xl',
            item.variant === 'destructive'
              ? 'border-red-400/20 bg-red-500/10 text-red-100'
              : 'border-[var(--admin-border-strong)] bg-[rgba(10,12,16,0.92)] text-white',
          )}
        >
          {item.variant === 'success' && <Check className="h-4 w-4 text-emerald-300" />}
          <span className="leading-6">{item.msg}</span>
        </div>
      ))}
    </div>
  )
}

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onEsc = (event) => {
      if (event.key === 'Escape') onOpenChange?.(false)
    }
    window.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onEsc)
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 md:p-6">
      <div
        className="absolute inset-0 bg-black/72 backdrop-blur-md"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="admin-scroll relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-auto rounded-[28px] border border-[var(--admin-border-strong)] bg-[rgba(12,14,18,0.96)] p-6 shadow-[var(--admin-shadow-strong)] backdrop-blur-2xl">
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, onClose }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>{children}</div>
      {onClose && (
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-white/5 text-[var(--admin-subtle)] transition-[background-color,color,border-color,transform] duration-200 hover:border-[var(--admin-border-strong)] hover:bg-white/10 hover:text-white active:scale-[0.96]"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export function Tabs({ value, onChange, items, className }) {
  return (
    <div
      className={cn(
        'inline-flex flex-wrap gap-1 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-panel-muted)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            'rounded-xl px-3 py-2 text-xs font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.98]',
            value === item.value
              ? 'bg-[var(--admin-accent)] text-white shadow-[var(--admin-shadow)]'
              : 'text-[var(--admin-muted)] hover:bg-white/6 hover:text-white',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
