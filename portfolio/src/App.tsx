import { useEffect, useRef, useState, type ReactNode } from "react"

const EMAIL = "malik@bemuzamil.com"

const social = [
  ["LinkedIn", "https://www.linkedin.com/in/malikmuzamil/"],
  ["Behance", "https://www.behance.net/bemuzamil"],
  ["Medium", "https://medium.com/@bemuzamil"],
  ["Instagram", "https://www.instagram.com/bemuzamil"],
  ["X", "https://x.com/bemuzamil"],
] as const

const navigation = [
  ["work", "Work"],
  ["about", "About"],
  ["notes", "Notes"],
] as const

type Project = {
  id: string
  number: string
  name: string
  kicker: string
  statement: string
  summary?: string
  disciplines: string
  caseStudy: string
  liveSite?: string
  image: { src: string; width: number; height: number; alt: string }
  caption: string
  notes?: [string, string][]
  layout: "feature" | "split" | "split-reverse" | "wide" | "dark"
}

const projects: Project[] = [
  {
    id: "shiftaan",
    number: "01",
    name: "Shiftaan",
    kicker: "Product design · Live product",
    statement:
      "Making shift and pay tracking less painful for security guards.",
    summary:
      "A product I took from a real problem I experienced myself, through research, UX and interface design, to a live working product.",
    disciplines: "Research · UX · Product Design · UI · Build",
    caseStudy:
      "https://www.behance.net/gallery/256203109/Shiftaan-Shits-Tracking-app-Case-Study",
    liveSite: "https://www.shiftaan.com/",
    image: {
      src: "/assets/shiftaan.webp",
      width: 1536,
      height: 1060,
      alt: "Shiftaan shift and pay tracking app shown on mobile and desktop screens",
    },
    caption: "Live product / Responsive web application",
    notes: [
      [
        "The problem",
        "Security guards often work across companies, sites and different pay rates, and lose track of what they are owed.",
      ],
      [
        "The idea",
        "One place to record shifts, earnings, expenses and outstanding pay.",
      ],
      [
        "The result",
        "A live, responsive product designed around the real workflow of a guard.",
      ],
    ],
    layout: "feature",
  },
  {
    id: "ojo",
    number: "02",
    name: "OJO",
    kicker: "Spatial UX · Mixed reality",
    statement:
      "What if controlling your smart home started with simply looking at it?",
    summary:
      "An intent-based interaction concept for controlling IoT devices in mixed reality, starting from where you look.",
    disciplines: "Spatial UX · Mixed Reality · Interaction Design",
    caseStudy:
      "https://www.behance.net/gallery/250189137/Spatial-Interactions-to-control-IOT-Devices-in-MR",
    image: {
      src: "/assets/ojo.webp",
      width: 1024,
      height: 576,
      alt: "OJO mixed reality interface floating beside a TV in a living room",
    },
    caption: "Intent-based interaction / Mixed reality",
    layout: "split",
  },
  {
    id: "opencircle",
    number: "03",
    name: "OpenCircle",
    kicker: "Social UX · Research",
    statement:
      "Designing social interaction around consent and emotional safety.",
    summary:
      "A consent-first social app that helps people connect with others nearby who share similar interests.",
    disciplines: "UX Research · Interaction Design · Social UX",
    caseStudy:
      "https://www.behance.net/gallery/241994481/UX-Case-Study-Emotional-Safety-in-Real-World-Social",
    image: {
      src: "/assets/opencircle.webp",
      width: 1536,
      height: 864,
      alt: "OpenCircle case study cover: consent-based gamified social interactions",
    },
    caption: "Consent / Proximity / Emotional safety",
    layout: "split-reverse",
  },
  {
    id: "number-plates",
    number: "04",
    name: "Number Plates 4 Less",
    kicker: "E-commerce UX · UK",
    statement:
      "Reducing uncertainty in a surprisingly complicated buying journey.",
    summary:
      "Reworking a UK custom number plate builder so buyers can configure, preview and order with confidence.",
    disciplines: "UX/UI · Information Architecture · E-commerce",
    caseStudy:
      "https://www.behance.net/gallery/241402865/UX-Case-Study-Number-Plates-4-Less-Uk-Builder",
    image: {
      src: "/assets/number-plates.webp",
      width: 1024,
      height: 677,
      alt: "Number Plates 4 Less custom number plate builder interface",
    },
    caption: "Product configuration / E-commerce",
    layout: "wide",
  },
  {
    id: "hive-mind",
    number: "05",
    name: "Life in Hive Mind",
    kicker: "Speculative design",
    statement: "What happens when privacy disappears?",
    summary:
      "A speculative look at everyday life in a future where everyone has all knowledge, and nobody has privacy.",
    disciplines: "Speculative Design · Future Interfaces · UX Concept",
    caseStudy:
      "https://www.behance.net/gallery/239903887/Life-in-Hive-Mind-With-All-Knowledge-But-Zero-Privacy",
    image: {
      src: "/assets/hive-mind.webp",
      width: 1536,
      height: 864,
      alt: "Life in Hive Mind speculative future interface illustration",
    },
    caption: "All knowledge / Zero privacy / Speculative future",
    layout: "dark",
  },
]

const notes = [
  {
    title: "Apple Ring vs Oura Ring: What to Expect From Apple’s Wearable",
    description:
      "An honest look at what Apple could bring to the smart ring market.",
    href: "https://bemuzamil.com/apple-ring-vs-oura-ring-what-to-expect-from-apples-wearable/",
  },
  {
    title: "Apple Smart Ring: Release Date, Features, and Everything We Know",
    description:
      "What the latest reports tell us about Apple’s possible next wearable.",
    href: "https://bemuzamil.com/apple-smart-ring-release-date-features-and-everything-we-know/",
  },
  {
    title: "Did Apple Raise iPhone Prices in 2026?",
    description:
      "A direct answer, with context on changes across Apple’s product line.",
    href: "https://bemuzamil.com/did-apple-raise-iphone-prices-in-2026/",
  },
]

const principles = [
  ["01", "Understand before designing.", "Start from how people actually behave, not how we assume they do."],
  ["02", "Test before assuming.", "Put ideas in front of real users early, and let the evidence decide."],
  ["03", "Remove before adding.", "The clearest interface is usually the one with less in it."],
]

const capabilities = [
  ["UX design", ["Research", "User flows", "Information architecture", "Usability testing"]],
  ["Product", ["MVPs", "Product thinking", "Interaction design", "Design systems"]],
  ["Interface", ["UI design", "Responsive design", "Prototyping"]],
  ["Emerging", ["Spatial interfaces", "Mixed reality", "AI-assisted experiences"]],
] as const

const references = [
  {
    quote:
      "I had the pleasure to work with Malik to build my brand identity from Italy. He followed the project with dedication and made the process easy to understand.",
    name: "Alice Case",
    role: "ICLO · Italy",
  },
  {
    quote:
      "Working with Malik for nearly a year, what truly sets him apart is his remarkable project management skills.",
    name: "Sardar Asad Khan",
    role: "CEO, KTS",
  },
  {
    quote:
      "This gentleman does great work and quickly. Great prices and awesome time management.",
    name: "Bert’s A1UE",
    role: "Client",
  },
]

function ExternalLink({
  href,
  children,
  className = "",
  tabIndex,
  ariaHidden,
}: {
  href: string
  children: ReactNode
  className?: string
  tabIndex?: number
  ariaHidden?: boolean
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

function OutLink({
  href,
  children,
  variant = "line",
}: {
  href: string
  children: ReactNode
  variant?: "line" | "solid"
}) {
  return (
    <ExternalLink href={href} className={`out-link out-link-${variant}`}>
      <span>{children}</span>
      <span aria-hidden="true" className="arrow">
        ↗
      </span>
    </ExternalLink>
  )
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("")

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    // A thin band across the middle of the viewport: whichever section
    // crosses it is "current", so the indicator never lags a section behind.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids.join(",")])

  return active
}

function Header({ active }: { active: string }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => {
      if (window.innerWidth > 767) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    document.body.classList.add("menu-open")
    return () => {
      document.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
      document.body.classList.remove("menu-open")
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`site-header${scrolled || open ? " is-scrolled" : ""}`}>
      <div className="nav-frame">
        <a href="#top" className="identity" onClick={close}>
          <strong>Malik Muzamil</strong>
          <span>UX / Product Designer</span>
        </a>

        <nav className="desktop-navigation" aria-label="Primary">
          {navigation.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
            >
              {label}
            </a>
          ))}
          <a href="#contact" className="button button-small">
            Let&apos;s talk
          </a>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span className="menu-icon" aria-hidden="true" />
        </button>
      </div>

      <nav
        id="mobile-menu"
        className="mobile-navigation"
        aria-label="Mobile"
        hidden={!open}
      >
        {navigation.map(([id, label], index) => (
          <a key={id} href={`#${id}`} onClick={close}>
            <span>0{index + 1}</span>
            {label}
          </a>
        ))}
        <a href="#contact" onClick={close}>
          <span>0{navigation.length + 1}</span>
          Contact
        </a>
        <p>{EMAIL}</p>
      </nav>
    </header>
  )
}

function ProjectRail({ active, inverse }: { active: string; inverse: boolean }) {
  return (
    <aside
      className={`project-rail${inverse ? " project-rail-inverse" : ""}`}
      aria-label="Project index"
    >
      <span className="rail-label">Projects</span>
      <nav>
        {projects.map(({ id, number, name }) => (
          <a
            key={id}
            href={`#${id}`}
            className={active === id ? "active" : ""}
            aria-current={active === id ? "true" : undefined}
          >
            <span>{number}</span>
            <span>{name}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}

function ProjectImage({ project, eager = false }: { project: Project; eager?: boolean }) {
  const { image, caption, caseStudy } = project
  return (
    <figure className="project-visual">
      {/* The image repeats the case-study link below, so it is hidden
          from assistive tech and the tab order to avoid a duplicate stop. */}
      <ExternalLink href={caseStudy} tabIndex={-1} ariaHidden className="visual-link">
        <img
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
        <span className="visual-hint" aria-hidden="true">
          View case study ↗
        </span>
      </ExternalLink>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function ProjectStory({ project, next }: { project: Project; next?: Project }) {
  const { id, number, name, kicker, statement, summary, disciplines, caseStudy, liveSite, notes, layout } =
    project

  return (
    <article
      className={`project-story project-${layout}`}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <div className="project-inner">
        <header className="project-header">
          <span className="project-kicker">
            {number} / {kicker}
          </span>
          <h3 id={`${id}-title`}>{name}</h3>
        </header>

        <div className="project-copy">
          <p className="project-statement">{statement}</p>
          {summary && <p className="project-summary">{summary}</p>}
          <p className="project-disciplines">{disciplines}</p>
          <div className="project-actions">
            <OutLink href={caseStudy} variant="solid">
              View case study
            </OutLink>
            {liveSite && <OutLink href={liveSite}>Visit live product</OutLink>}
          </div>
        </div>

        <ProjectImage project={project} eager={number === "01"} />

        {notes && (
          <dl className="feature-notes">
            {notes.map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        )}

        {next && (
          <a href={`#${next.id}`} className="next-project">
            <span className="next-label">Next project</span>
            <span className="next-number">{next.number}</span>
            <span className="next-name">{next.name}</span>
            <span aria-hidden="true" className="next-arrow">
              ↓
            </span>
          </a>
        )}
      </div>
    </article>
  )
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2400)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <>
      <button type="button" className="button button-ghost" onClick={copy}>
        {copied ? "Copied ✓" : "Copy email"}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </>
  )
}

const sectionIds = ["work", "about", "notes", "contact"]
const projectIds = projects.map((project) => project.id)

export default function App() {
  const activeSection = useActiveSection(sectionIds)
  const activeProject = useActiveSection(projectIds)
  const year = new Date().getFullYear()

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header active={activeSection === "contact" ? "" : activeSection} />

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div className="hero-meta">
              <span>UX / Product Designer</span>
              <span>London, UK</span>
            </div>
            <div className="hero-copy">
              <h1 id="hero-title">
                I design digital experiences for the way people actually think,
                move and interact.
              </h1>
              <p className="hero-intro">
                From real-world products like Shiftaan to experimental
                interfaces for mixed reality, I work across UX, interaction
                design and emerging technology.
              </p>
              <div className="hero-actions">
                <a href="#work" className="button">
                  View selected work <span aria-hidden="true">↓</span>
                </a>
                <a href="#contact" className="text-link">
                  Get in touch
                </a>
              </div>
              <p className="availability">
                <span aria-hidden="true" />
                Open to UX / Product Design roles and freelance projects.
              </p>
            </div>
            <figure className="hero-image">
              <img
                src="/assets/hero-portrait.webp"
                width={493}
                height={618}
                alt="Malik Muzamil, UX and product designer"
                fetchPriority="high"
              />
              <figcaption>Malik Muzamil / London</figcaption>
            </figure>
          </div>
        </section>

        <section className="work" id="work" aria-labelledby="work-title">
          <div className="work-intro">
            <div className="work-intro-copy">
              <span className="section-label">Selected work / 01—05</span>
              <h2 id="work-title">
                A selection of things I&apos;ve designed, tested and shipped.
              </h2>
            </div>
            <nav className="project-index" aria-label="Selected work">
              {projects.map(({ id, number, name, kicker }) => (
                <a href={`#${id}`} key={id}>
                  <span className="index-number">{number}</span>
                  <strong>{name}</strong>
                  <span className="index-kicker">{kicker}</span>
                  <span aria-hidden="true" className="index-arrow">
                    ↓
                  </span>
                </a>
              ))}
            </nav>
          </div>

          <div className="work-body">
            <ProjectRail
              active={activeProject}
              inverse={activeProject === "hive-mind"}
            />
            <div className="project-stories">
              {projects.map((project, index) => (
                <ProjectStory
                  key={project.id}
                  project={project}
                  next={projects[index + 1]}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="thinking" aria-labelledby="thinking-title">
          <div className="split-heading">
            <span className="section-label">How I think</span>
            <h2 id="thinking-title">Make the complex feel obvious.</h2>
          </div>
          <ol className="principles">
            {principles.map(([number, title, text]) => (
              <li key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="about" id="about" aria-labelledby="about-title">
          <div className="split-heading">
            <span className="section-label">About</span>
            <h2 id="about-title">
              I care about the part people don&apos;t notice.
            </h2>
          </div>

          <div className="about-body">
            <figure className="about-image">
              <img
                src="/assets/about-portrait.webp"
                width={768}
                height={768}
                alt="Black and white portrait of Malik Muzamil"
                loading="lazy"
                decoding="async"
              />
            </figure>

            <div className="about-copy">
              <p className="about-manifesto">
                The moment an interface makes sense. The moment a confusing
                task becomes simple. The moment technology stops getting in the
                way.
              </p>
              <p>
                I&apos;m a UX designer based in London with a background in UI
                design, branding and real-world digital products. My work spans
                product design, spatial interaction, smart environments and
                emerging interfaces.
              </p>
              <p>
                I enjoy working from the problem first: understanding how people
                behave, testing ideas and refining the details until the
                experience feels natural. I also work closely with developers to
                take ideas beyond prototypes and into working products.
              </p>

              <dl className="credentials">
                {[
                  ["7+ years", "Design experience"],
                  ["London", "Currently based"],
                  ["UX → Product", "Research through to live products"],
                ].map(([value, label]) => (
                  <div key={value}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="capabilities" aria-labelledby="capabilities-title">
          <div>
            <span className="section-label">Capabilities</span>
            <h2 id="capabilities-title">What I work across</h2>
            <p className="tools-note">
              Primarily working in Figma and Adobe Creative Cloud, and closely
              with development tools.
            </p>
          </div>
          <ul className="capability-list">
            {capabilities.map(([title, items], index) => (
              <li className="capability" key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{items.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="testimonials" aria-labelledby="references-title">
          <div className="split-heading">
            <span className="section-label">References</span>
            <h2 id="references-title">
              Words from people I&apos;ve worked with.
            </h2>
          </div>
          <div className="reference-list">
            {references.map(({ quote, name, role }) => (
              <figure className="reference" key={name}>
                <blockquote>
                  <p>“{quote}”</p>
                </blockquote>
                <figcaption>
                  <strong>{name}</strong>
                  <span>{role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="notes" id="notes" aria-labelledby="notes-title">
          <div>
            <span className="section-label">Notes</span>
            <h2 id="notes-title">Things I&apos;m thinking about.</h2>
          </div>
          <ul className="note-list">
            {notes.map((note, index) => (
              <li key={note.title}>
                <ExternalLink href={note.href} className="note">
                  <span className="note-number">0{index + 1}</span>
                  <span className="note-body">
                    <span className="note-title">{note.title}</span>
                    <span className="note-description">{note.description}</span>
                  </span>
                  <span className="note-read" aria-hidden="true">
                    Read <span>↗</span>
                  </span>
                </ExternalLink>
              </li>
            ))}
          </ul>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <span className="section-label">Contact</span>
          <h2 id="contact-title">Have something worth solving?</h2>
          <p>
            I&apos;m open to UX / Product Design roles and interesting digital
            projects. The quickest way to reach me is
            email.
          </p>
          <a href={`mailto:${EMAIL}`} className="email">
            {EMAIL}
          </a>
          <div className="contact-actions">
            <a href={`mailto:${EMAIL}`} className="button">
              Email me
            </a>
            <CopyEmail />
            <OutLink href={social[0][1]}>LinkedIn</OutLink>
            <OutLink href={social[1][1]}>Behance</OutLink>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-identity">
          <strong>Malik Muzamil</strong>
          <span>UX / Product Designer · London, UK</span>
        </div>
        <nav aria-label="Social media">
          {social.map(([name, href]) => (
            <ExternalLink href={href} key={name}>
              {name}
            </ExternalLink>
          ))}
        </nav>
        <div className="footer-meta">
          <span>© {year} Malik Muzamil</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  )
}
