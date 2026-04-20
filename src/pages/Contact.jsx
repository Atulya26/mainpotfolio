import Footer from '../components/Footer.jsx'

export default function Contact() {
  return (
    <div className="contact shell">
      <header className="contact__head">
        <span className="mono">(05) Contact</span>
        <h1 className="display">
          Let's make something
          <br /> honest together.
        </h1>
      </header>

      <section className="contact__grid">
        <form className="contact__form" onSubmit={(e) => e.preventDefault()}>
          <label>
            <span className="mono">01 — Name</span>
            <input type="text" placeholder="Your name" data-cursor="text" />
          </label>
          <label>
            <span className="mono">02 — Email</span>
            <input type="email" placeholder="you@company.com" data-cursor="text" />
          </label>
          <label>
            <span className="mono">03 — Project</span>
            <textarea rows={5} placeholder="A couple sentences is enough." data-cursor="text" />
          </label>
          <button type="submit" className="contact__submit display" data-cursor="button" data-cursor-label="Send">
            Send →
          </button>
        </form>

        <aside className="contact__aside">
          <div>
            <p className="eyebrow">Direct</p>
            <a href="mailto:hi@atulya.studio" data-cursor="link">hi@atulya.studio</a>
          </div>
          <div>
            <p className="eyebrow">Calendar</p>
            <a href="#" data-cursor="link">Book a 30-min intro ↗</a>
          </div>
          <div>
            <p className="eyebrow">Office</p>
            <p>Studio — Nørrebro, Copenhagen 2200</p>
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  )
}
