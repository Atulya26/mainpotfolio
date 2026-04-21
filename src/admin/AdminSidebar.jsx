import { NavLink } from 'react-router-dom'
import {
  Archive,
  BookOpen,
  Briefcase,
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Navigation,
  Palette,
  Settings2,
  Sparkles,
  Type,
  User,
  Zap,
} from 'lucide-react'
import { Button, Badge } from './components/ui.jsx'
import { cn } from './lib/cn.js'
import { lock } from './lib/auth.js'
import { useContent } from '../context/ContentContext.jsx'

const SECTIONS = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard', group: 'Overview' },
  { to: '/admin/site', icon: Settings2, label: 'Site settings', group: 'Global' },
  { to: '/admin/theme', icon: Palette, label: 'Theme & type', group: 'Global' },
  { to: '/admin/nav', icon: Navigation, label: 'Navigation', group: 'Global' },
  { to: '/admin/hero', icon: Sparkles, label: 'Hero', group: 'Home' },
  { to: '/admin/marquee', icon: Type, label: 'Marquee', group: 'Home' },
  { to: '/admin/capabilities', icon: Zap, label: 'Capabilities', group: 'Home' },
  { to: '/admin/about-teaser', icon: ImageIcon, label: 'About teaser', group: 'Home' },
  { to: '/admin/projects', icon: Briefcase, label: 'Projects', group: 'Work' },
  { to: '/admin/archive', icon: Archive, label: 'Archive', group: 'Work' },
  { to: '/admin/published', icon: BookOpen, label: 'Published', group: 'Work' },
  { to: '/admin/about', icon: User, label: 'About page', group: 'Pages' },
  { to: '/admin/contact', icon: MessageSquare, label: 'Contact page', group: 'Pages' },
  { to: '/admin/footer', icon: Settings2, label: 'Footer', group: 'Pages' },
]

export default function AdminSidebar({ onLock }) {
  const { content, dirty } = useContent()
  const groups = SECTIONS.reduce((acc, item) => {
    ;(acc[item.group] ||= []).push(item)
    return acc
  }, {})

  return (
    <aside className="admin-scroll hidden w-[300px] shrink-0 flex-col overflow-y-auto border-r border-[var(--admin-border)] bg-[rgba(7,8,12,0.86)] px-4 py-5 backdrop-blur-xl lg:flex">
      <div className="rounded-[24px] border border-[var(--admin-border)] bg-[var(--admin-panel)] p-4 shadow-[var(--admin-shadow)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mono-font text-[10px] uppercase tracking-[0.12em] text-[var(--admin-subtle)]">
              Portfolio admin
            </p>
            <p className="mt-2 text-base font-medium tracking-[-0.02em] text-white">
              {content.site.name}
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--admin-muted)]">
              {content.site.role}
            </p>
          </div>
          {dirty ? <Badge variant="accent">Draft</Badge> : <Badge>Live</Badge>}
        </div>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-5 pb-5">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <p className="mono-font mb-2 px-2 text-[10px] uppercase tracking-[0.12em] text-[var(--admin-subtle)]">
              {group}
            </p>
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-[background-color,color,border-color,transform] duration-200',
                        isActive
                          ? 'border border-[var(--admin-border-strong)] bg-[var(--admin-panel-strong)] text-white shadow-[var(--admin-shadow)]'
                          : 'border border-transparent text-[var(--admin-muted)] hover:border-[var(--admin-border)] hover:bg-[var(--admin-panel-muted)] hover:text-white',
                      )
                    }
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-white/[0.04]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-3 rounded-[24px] border border-[var(--admin-border)] bg-[var(--admin-panel)] p-4 shadow-[var(--admin-shadow)]">
        <div>
          <p className="mono-font text-[10px] uppercase tracking-[0.12em] text-[var(--admin-subtle)]">
            Shortcuts
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--admin-muted)]">
            Preview the public site or lock the editor when you step away.
          </p>
        </div>

        <a href="/" target="_blank" rel="noreferrer" className="block">
          <Button variant="secondary" size="sm" className="w-full justify-start">
            <ExternalLink className="h-3.5 w-3.5" /> Open site
          </Button>
        </a>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            lock()
            onLock?.()
          }}
        >
          <LogOut className="h-3.5 w-3.5" /> Lock admin
        </Button>
      </div>
    </aside>
  )
}
