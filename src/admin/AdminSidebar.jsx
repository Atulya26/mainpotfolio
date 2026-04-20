import { NavLink } from 'react-router-dom'
import { cn } from './lib/cn.js'
import {
  LayoutDashboard, Settings2, Navigation, Sparkles, Palette,
  Briefcase, Archive, BookOpen, User, MessageSquare, Image as ImageIcon,
  Zap, Type, ExternalLink, LogOut,
} from 'lucide-react'
import { Button } from './components/ui.jsx'
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
  { to: '/admin/contact', icon: MessageSquare, label: 'Contact', group: 'Pages' },
  { to: '/admin/footer', icon: Settings2, label: 'Footer', group: 'Pages' },
]

export default function AdminSidebar({ onLock }) {
  const { content, dirty } = useContent()
  const groups = SECTIONS.reduce((acc, it) => {
    ;(acc[it.group] ||= []).push(it)
    return acc
  }, {})

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-white/10 bg-[#0c0c10]">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 shrink-0">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/40 mono-font">Portfolio</p>
          <p className="text-sm font-medium text-white">{content.site.name} Admin</p>
        </div>
        {dirty && (
          <span className="flex items-center gap-1.5 rounded-full bg-[#ff4a1c]/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#ff4a1c] mono-font">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4a1c]" />
            Unsaved
          </span>
        )}
      </div>

      {/* scrollable nav */}
      <nav className="flex-1 min-h-0 overflow-y-auto admin-scroll p-3">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="mb-4">
            <p className="mb-1 px-2 text-[10px] uppercase tracking-wider text-white/30 mono-font">
              {group}
            </p>
            {items.map((it) => {
              const Icon = it.icon
              return (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white',
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{it.label}</span>
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* footer */}
      <div className="border-t border-white/10 p-3 flex flex-col gap-2 shrink-0">
        <a href="/" target="_blank" rel="noreferrer" className="inline-block">
          <Button variant="outline" size="sm" className="w-full justify-start">
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
