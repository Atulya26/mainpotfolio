import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './admin.css'
import AdminAuth from './AdminAuth.jsx'
import AdminShell from './AdminShell.jsx'
import { isUnlocked } from './lib/auth.js'

// Pages
import Dashboard from './pages/Dashboard.jsx'
import SitePage from './pages/SitePage.jsx'
import ThemePage from './pages/ThemePage.jsx'
import NavPage from './pages/NavPage.jsx'
import HeroPage from './pages/HeroPage.jsx'
import MarqueePage from './pages/MarqueePage.jsx'
import CapabilitiesPage from './pages/CapabilitiesPage.jsx'
import AboutTeaserPage from './pages/AboutTeaserPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ProjectEditPage from './pages/ProjectEditPage.jsx'
import ArchivePage from './pages/ArchivePage.jsx'
import PublishedPage from './pages/PublishedPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import FooterPage from './pages/FooterPage.jsx'

export default function AdminApp() {
  const [unlocked, setUnlocked] = useState(() => isUnlocked())

  if (!unlocked) {
    return <AdminAuth onUnlock={() => setUnlocked(true)} />
  }

  return (
    <AdminShell onLock={() => setUnlocked(false)}>
      <Routes>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/site" element={<SitePage />} />
        <Route path="/admin/theme" element={<ThemePage />} />
        <Route path="/admin/nav" element={<NavPage />} />
        <Route path="/admin/hero" element={<HeroPage />} />
        <Route path="/admin/marquee" element={<MarqueePage />} />
        <Route path="/admin/capabilities" element={<CapabilitiesPage />} />
        <Route path="/admin/about-teaser" element={<AboutTeaserPage />} />
        <Route path="/admin/projects" element={<ProjectsPage />} />
        <Route path="/admin/projects/:slug" element={<ProjectEditPage />} />
        <Route path="/admin/archive" element={<ArchivePage />} />
        <Route path="/admin/published" element={<PublishedPage />} />
        <Route path="/admin/about" element={<AboutPage />} />
        <Route path="/admin/contact" element={<ContactPage />} />
        <Route path="/admin/footer" element={<FooterPage />} />
      </Routes>
    </AdminShell>
  )
}
