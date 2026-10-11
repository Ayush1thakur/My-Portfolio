import React, { useState, useEffect } from 'react';
import { fetchPortfolio } from './services/api';
import './App.css';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchPortfolio();
        if (res && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.warn('Backend not responding, using bundled fallback data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopy = (text, fieldName, e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 1800);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const personal = data?.personalInfo || {
    fullName: 'Ayush Thakur',
    title: 'Associate Software Engineer',
    currentCompany: 'MAQ Software',
    college: 'Chitkara University',
    location: 'Noida, India',
    email: 'ayush.thaku7@gmail.com',
    phone: '+91-9877247382',
    linkedInUrl: 'https://linkedin.com/in/ayush-thakur1',
    githubUrl: 'https://github.com/Ayush1thakur',
    avatarUrl: '/profile.jpg',
    summary:
      'Associate Software Engineer at MAQ Software specializing in distributed data pipelines, enterprise migration platforms, and scalable backend architectures. Experienced in processing 10M+ records with fault-tolerant retry workflows, automating Tableau-to-Power BI conversions for 1,000+ reports, and engineering robust APIs using Python, C#, Java Spring Boot, and AI agent frameworks.'
  };

  return (
    <div className={`portfolio-page theme-${theme}`}>
      {/* Top Bar */}
      <nav className="top-nav">
        <div className="container nav-content">
          <div className="status-badge">
            <span className="pulsing-dot"></span>
            <span>Open to Roles · 2026</span>
          </div>
          <div className="nav-actions">
            <button onClick={toggleTheme} className="icon-button" title="Toggle Light/Dark Theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={() => window.print()} className="icon-button" title="Print / PDF Resume">
              🖨️
            </button>
          </div>
        </div>
      </nav>

      <main className="container main-content">
        {/* HERO: CENTERED CIRCLE IMAGE & BRIEF DESCRIPTION */}
        <section className="hero-section">
          <div className="avatar-wrapper">
            <img
              src="/profile.jpg"
              alt={personal.fullName}
              className="avatar-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140"><rect width="140" height="140" fill="%23EA580C"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="48" font-weight="bold">AT</text></svg>';
              }}
            />
            <span className="avatar-online-dot"></span>
          </div>

          <h1 className="hero-name">{personal.fullName}</h1>
          <div className="hero-title">{personal.title}</div>

          {/* Current Company & College Badges */}
          <div className="affiliation-group">
            <div className="affiliation-chip">
              🏢 Current Company: <strong>{personal.currentCompany || 'MAQ Software'}</strong> (Noida)
            </div>
            <div className="affiliation-chip">
              🎓 College: <strong>{personal.college || 'Chitkara University'}</strong> (CGPA: 8.41)
            </div>
          </div>

          {/* Brief Description About Me */}
          <p className="hero-summary">{personal.summary}</p>

          <div className="hero-cta-row">
            <a href="#company-projects" className="btn-orange">
              View Company Projects ↓
            </a>
            <a href="#socials" className="btn-outline">
              Contact &amp; Socials
            </a>
          </div>
        </section>

        {/* 1. COMPANY PROJECTS */}
        <section id="company-projects" className="content-section">
          <div className="section-head">
            <span className="section-kicker">MAQ SOFTWARE · PRODUCTION</span>
            <h2 className="section-heading">Company Projects</h2>
            <p className="section-subheading">Enterprise platforms, high-throughput pipelines, and licensing microservices</p>
          </div>

          <div className="card">
            <div className="company-title-row">
              <div>
                <h3 className="company-brand">MAQ Software</h3>
                <div className="company-subtitle">Associate Software Engineer · Noida, India</div>
              </div>
              <span className="mono-date">Oct 2025 – Present</span>
            </div>

            {/* Subproject 1: MigrateFAST */}
            <div className="subproject-block">
              <h4 className="subproject-title">MigrateFAST</h4>
              <div className="tech-tags">
                {['Python', 'Flask', 'LangGraph', 'React', 'Azure', 'Tableau', 'Power BI'].map((t) => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>
              <ul className="bullet-tree">
                <li>Developed internal migration platform supporting <strong>1,000+ report migrations</strong>.</li>
                <li>Built distributed data-processing pipelines handling <strong>10M+ records</strong> with optimized retry workflows <strong>(+35% reliability)</strong>.</li>
                <li>Architected microservice-oriented backend components for high availability.</li>
                <li>Automated E2E and regression suites using Playwright.</li>
                <li>Integrated telemetry and monitoring with Azure Application Insights.</li>
              </ul>
            </div>

            {/* Subproject 2: SaaS Tools License Manager */}
            <div className="subproject-block">
              <h4 className="subproject-title">SaaS Tools License Manager</h4>
              <div className="tech-tags">
                {['C#', 'ASP.NET Core', 'SQL', 'TypeScript'].map((t) => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>
              <ul className="bullet-tree">
                <li>Built secure REST APIs for licensing with rate limiting and authentication across <strong>10+ endpoints</strong>.</li>
                <li>Implemented server-clock SQL license validation across <strong>100% of activation checks</strong>.</li>
                <li>Conducted load and performance stress testing to guarantee low-latency validation under load.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. PERSONAL PROJECTS */}
        <section id="personal-projects" className="content-section">
          <div className="section-head">
            <span className="section-kicker">INDEPENDENT SYSTEMS &amp; ARCHITECTURE</span>
            <h2 className="section-heading">Personal Projects</h2>
            <p className="section-subheading">Open-source applications, microservices, and databases</p>
          </div>

          <div className="card">
            <div className="project-top-row">
              <h3 className="project-name">MyShop</h3>
              <a
                href={personal.githubUrl || 'https://github.com/Ayush1thakur'}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-pill"
              >
                GitHub Repository ↗
              </a>
            </div>
            <p className="project-abstract">
              High-concurrency E-commerce backend platform for user authentication, catalog management, shopping cart operations, and transactional order fulfillment.
            </p>
            <div className="tech-tags">
              {['Java', 'Spring Boot', 'Spring Data JPA', 'Hibernate', 'SQL', 'Spring Security'].map((t) => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <ul className="bullet-tree">
              <li>Architected core microservice controllers and services for user, catalog, cart, and order processing.</li>
              <li>Optimized database queries and transactional consistency using JPA / Hibernate.</li>
              <li>Secured role-based access control (RBAC) and token authentication with Spring Security.</li>
            </ul>
          </div>
        </section>

        {/* 3. ACHIEVEMENTS & CERTIFICATIONS */}
        <section id="achievements" className="content-section">
          <div className="section-head">
            <span className="section-kicker">QUANTIFIED IMPACT &amp; CREDENTIALS</span>
            <h2 className="section-heading">Achievements &amp; Certifications</h2>
          </div>

          <div className="metrics-grid">
            <div className="metric-box">
              <div className="metric-stat">10M<span className="orange-plus">+</span></div>
              <div className="metric-caption">Records processed through fault-tolerant data pipelines (+35% reliability gain).</div>
            </div>
            <div className="metric-box">
              <div className="metric-stat">1,000<span className="orange-plus">+</span></div>
              <div className="metric-caption">Automated Tableau-to-Power BI reports migrated through dedicated migration engine.</div>
            </div>
            <div className="metric-box">
              <div className="metric-stat">8.41 <span className="orange-sub">CGPA</span></div>
              <div className="metric-caption">Academic distinction in B.E. Computer Science from Chitkara University (2022–2026).</div>
            </div>
          </div>

          <div className="cert-stack">
            <div className="cert-tile">
              <span className="cert-star">★</span>
              <span>Microsoft Certified: Azure Fundamentals (AZ-900) &amp; Cloud Infrastructure Architecture</span>
            </div>
            <div className="cert-tile">
              <span className="cert-star">★</span>
              <span>Generative AI Engineering: LangChain, LangGraph, RAG Systems &amp; FastMCP</span>
            </div>
            <div className="cert-tile">
              <span className="cert-star">★</span>
              <span>Enterprise Java Spring Boot, Microservices &amp; Spring Data JPA Performance</span>
            </div>
          </div>
        </section>

        {/* 4. SOCIALS & CONTACT */}
        <section id="socials" className="content-section">
          <div className="section-head">
            <span className="section-kicker">GET IN TOUCH</span>
            <h2 className="section-heading">Socials &amp; Contact</h2>
            <p className="section-subheading">Feel free to reach out for opportunities or technical discussion</p>
          </div>

          <div className="contact-grid">
            <a
              href={`mailto:${personal.email}`}
              onClick={(e) => handleCopy(personal.email, 'email', e)}
              className="contact-tile"
            >
              <div className="contact-avatar-icon">✉️</div>
              <div className="contact-texts">
                <span className="contact-small">Email (Click to copy)</span>
                <span className="contact-main">{personal.email}</span>
              </div>
              {copiedField === 'email' && <span className="copied-bubble">Copied!</span>}
            </a>

            <a
              href={`tel:${personal.phone.replace(/[^0-9+]/g, '')}`}
              onClick={(e) => handleCopy(personal.phone, 'phone', e)}
              className="contact-tile"
            >
              <div className="contact-avatar-icon">📞</div>
              <div className="contact-texts">
                <span className="contact-small">Phone (Click to copy)</span>
                <span className="contact-main">{personal.phone}</span>
              </div>
              {copiedField === 'phone' && <span className="copied-bubble">Copied!</span>}
            </a>

            <a
              href={personal.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-tile"
            >
              <div className="contact-avatar-icon">💼</div>
              <div className="contact-texts">
                <span className="contact-small">LinkedIn</span>
                <span className="contact-main">Ayush Thakur</span>
              </div>
            </a>

            <a
              href={personal.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-tile"
            >
              <div className="contact-avatar-icon">🐙</div>
              <div className="contact-texts">
                <span className="contact-small">GitHub</span>
                <span className="contact-main">github.com/Ayush1thakur</span>
              </div>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer-wrap">
        <div className="container footer-content">
          <div>&copy; {new Date().getFullYear()} Ayush Thakur · Associate Software Engineer</div>
          <div className="footer-status">
            <span className="footer-dot"></span>
            <span>REST API: /api/portfolio (Connected)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
