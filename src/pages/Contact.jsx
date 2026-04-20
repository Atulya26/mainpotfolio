import Footer from '../components/Footer.jsx'
import { useContent } from '../context/ContentContext.jsx'

export default function Contact() {
  const { content } = useContent()
  const c = content.contact
  const site = content.site

  return (
    <div className="contact shell">
      <header className="contact__head">
        <span className="mono">{c.eyebrow}</span>
        <h1 className="display" style={{ whiteSpace: 'pre-line' }}>{c.heading}</h1>
      </header>

      <section className="contact__grid">
        <form className="contact__form" onSubmit={(e) => e.preventDefault()}>
          {c.formLabels.map((label, i) => (
            <label key={i}>
              <span className="mono">{String(i + 1).padStart(2, '0')} — {label}</span>
              {i < 2 ? (
                <input
                  type={i === 1 ? 'email' : 'text'}
                  placeholder={c.placeholders[i]}
                  data-cursor="text"
                />
              ) : (
                <textarea rows={5} placeholder={c.placeholders[i]} data-cursor="text" />
              )}
            </label>
          ))}
          <button type="submit" className="contact__submit display" data-cursor="button" data-cursor-label="Send">
            {c.submitLabel}
          </button>
        </form>

        <aside className="contact__aside">
          <div>
            <p className="eyebrow">{c.directEyebrow}</p>
            <a href={`mailto:${site.email}`} data-cursor="link">{site.email}</a>
          </div>
          <div>
            <p className="eyebrow">{c.calendarEyebrow}</p>
            <a href="#" data-cursor="link">{c.calendarLabel}</a>
          </div>
          <div>
            <p className="eyebrow">{c.officeEyebrow}</p>
            <p>{site.studio}</p>
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  )
}
