import React, { useState, useEffect } from 'react';
import {
  fetchPortfolio,
  loginAdmin,
  verifyAdminSession,
  updateAdminProfile,
  createAdminProject,
  deleteAdminProject,
  createAdminSubProject,
  deleteAdminSubProject,
  updateAdminCertifications
} from './services/api';
import './App.css';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio_theme_mode') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolio_theme_mode', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Navigation & Page State ('portfolio' or 'admin')
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') return 'admin';
    }
    return 'portfolio';
  });

  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('ayush_admin_token') || '');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [adminTab, setAdminTab] = useState('profile');
  const [adminNotification, setAdminNotification] = useState('');

  // Handle browser back/forward and URL sync
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('portfolio');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Editable Profile Form
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    title: '',
    currentCompany: '',
    college: '',
    phone: '',
    email: '',
    location: '',
    resumeUrl: '',
    summary: '',
    statusBadge: ''
  });

  // New Project Form
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Personal Project',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    description: '',
    bullets: ''
  });

  // New Company Subproject Form
  const [newSubProject, setNewSubProject] = useState({
    name: '',
    technologies: '',
    bullets: ''
  });

  // Certifications Form
  const [newCertInput, setNewCertInput] = useState('');

  const loadData = async () => {
    try {
      const res = await fetchPortfolio();
      if (res && res.data) {
        setData(res.data);
        if (res.data.personalInfo) {
          const p = res.data.personalInfo;
          setProfileForm({
            fullName: p.fullName || '',
            title: p.title || '',
            currentCompany: p.currentCompany || '',
            college: p.college || '',
            phone: p.phone || '',
            email: p.email || '',
            location: p.location || '',
            resumeUrl: p.resumeUrl || '',
            summary: p.summary || '',
            statusBadge: p.statusBadge || ''
          });
        }
      }
    } catch (err) {
      console.warn('Backend not responding or offline fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Verify stored token on load
  useEffect(() => {
    if (adminToken) {
      verifyAdminSession(adminToken).then((valid) => {
        if (!valid) {
          setAdminToken('');
          localStorage.removeItem('ayush_admin_token');
        }
      });
    }
  }, [adminToken]);

  const handleCopy = (text, fieldName, e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 1800);
    }
  };

  // Auth: Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await loginAdmin(loginForm.username, loginForm.password);
      if (res && res.data && res.data.token) {
        setAdminToken(res.data.token);
        localStorage.setItem('ayush_admin_token', res.data.token);
        setLoginForm({ username: '', password: '' });
        showNotify('Successfully authenticated as Administrator (ROLE_ADMIN)!');
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid ID or password');
    }
  };

  const handleLogout = () => {
    setAdminToken('');
    localStorage.removeItem('ayush_admin_token');
    setShowAdminPortal(false);
    showNotify('Logged out successfully');
  };

  const showNotify = (msg) => {
    setAdminNotification(msg);
    setTimeout(() => setAdminNotification(''), 3000);
  };

  // Admin CRUD Actions
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateAdminProfile(adminToken, profileForm);
      await loadData();
      showNotify('Profile updated successfully! Phone number & details refreshed in DB.');
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newProject.title,
        category: newProject.category,
        technologies: newProject.technologies,
        githubUrl: newProject.githubUrl,
        liveUrl: newProject.liveUrl,
        description: newProject.description,
        featured: true,
        bullets: newProject.bullets
          .split('\n')
          .map((b) => b.trim())
          .filter((b) => b.length > 0)
      };
      await createAdminProject(adminToken, payload);
      await loadData();
      setNewProject({
        title: '',
        category: 'Personal Project',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        description: '',
        bullets: ''
      });
      showNotify('Project created and added to database!');
    } catch (err) {
      alert('Error creating project: ' + err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteAdminProject(adminToken, id);
      await loadData();
      showNotify('Project deleted from database.');
    } catch (err) {
      alert('Error deleting project: ' + err.message);
    }
  };

  const handleAddSubProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newSubProject.name,
        technologies: newSubProject.technologies,
        bullets: newSubProject.bullets
          .split('\n')
          .map((b) => b.trim())
          .filter((b) => b.length > 0)
      };
      await createAdminSubProject(adminToken, payload);
      await loadData();
      setNewSubProject({ name: '', technologies: '', bullets: '' });
      showNotify('Company sub-project added successfully!');
    } catch (err) {
      alert('Error adding company project: ' + err.message);
    }
  };

  const handleDeleteSubProject = async (id) => {
    if (!window.confirm('Delete this company sub-project?')) return;
    try {
      await deleteAdminSubProject(adminToken, id);
      await loadData();
      showNotify('Company sub-project deleted.');
    } catch (err) {
      alert('Error deleting company project: ' + err.message);
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!newCertInput.trim()) return;
    const updated = [...(data?.certifications || []), newCertInput.trim()];
    try {
      await updateAdminCertifications(adminToken, updated);
      await loadData();
      setNewCertInput('');
      showNotify('Certification added!');
    } catch (err) {
      alert('Error adding certification: ' + err.message);
    }
  };

  const handleDeleteCert = async (index) => {
    const list = [...(data?.certifications || [])];
    list.splice(index, 1);
    try {
      await updateAdminCertifications(adminToken, list);
      await loadData();
      showNotify('Certification removed.');
    } catch (err) {
      alert('Error deleting certification: ' + err.message);
    }
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
    resumeUrl: '#',
    summary:
      'Associate Software Engineer at MAQ Software specializing in distributed data pipelines, enterprise migration platforms, and scalable backend architectures. Experienced in processing 10M+ records with fault-tolerant retry workflows, automating Tableau-to-Power BI conversions for 1,000+ reports, and engineering robust APIs using Python, C#, Java Spring Boot, and AI agent frameworks.'
  };

  const companyProjects =
    data?.experiences?.[0]?.subProjects || [
      {
        id: 1,
        name: 'MigrateFAST',
        technologies: 'Python, Flask, LangGraph, React, Azure, Tableau, Power BI',
        bullets: [
          'Developed internal migration platform supporting 1,000+ report migrations.',
          'Built distributed data-processing pipelines handling 10M+ records with optimized retry workflows (+35% reliability).',
          'Architected microservice-oriented backend components for high availability.',
          'Automated E2E and regression suites using Playwright.',
          'Integrated telemetry and monitoring with Azure Application Insights.'
        ]
      },
      {
        id: 2,
        name: 'SaaS Tools License Manager',
        technologies: 'C#, ASP.NET Core, SQL, TypeScript',
        bullets: [
          'Built secure REST APIs for licensing with rate limiting and authentication across 10+ endpoints.',
          'Implemented server-clock SQL license validation across 100% of activation checks.',
          'Conducted load and performance stress testing to guarantee low-latency validation under load.'
        ]
      }
    ];

  const personalProjects = data?.projects || [
    {
      id: 1,
      title: 'MyShop',
      category: 'Full-Stack Backend',
      technologies: 'Java, Spring Boot, Spring Data JPA, Hibernate, SQL, Spring Security',
      githubUrl: 'https://github.com/Ayush1thakur',
      description:
        'High-performance E-commerce backend platform for user authentication, catalog management, shopping cart operations, and transactional order fulfillment.',
      bullets: [
        'Architected core microservice controllers and services for user, catalog, cart, and order processing.',
        'Optimized database queries and transactional consistency using JPA / Hibernate.',
        'Secured role-based access control (RBAC) and token authentication with Spring Security.'
      ]
    }
  ];

  const certificationsList = data?.certifications || [
    'Microsoft Certified: Azure Fundamentals (AZ-900) & Cloud Infrastructure Architecture',
    'Generative AI Engineering: LangChain, LangGraph, RAG Systems & FastMCP',
    'Enterprise Java Spring Boot, Microservices & Spring Data JPA Performance'
  ];

  return (
    <div className={`portfolio-page theme-${theme}`}>
      {/* Toast Notification Banner */}
      {adminNotification && (
        <div className="admin-toast-banner">
          <span>✓ {adminNotification}</span>
        </div>
      )}

      {currentPage === 'admin' ? (
        /* ========================================================
           DEDICATED ADMIN MANAGEMENT PAGE (/admin)
           ======================================================== */
        <div className="admin-page-view">
          {/* Dedicated Admin Page Header */}
          <nav className="top-nav admin-page-nav">
            <div className="container nav-content">
              <div className="admin-brand-group">
                <span className="admin-badge">ROLE_ADMIN</span>
                <span className="admin-nav-title">Ayush Thakur · Control Portal</span>
              </div>
              <div className="nav-actions">
                <button
                  onClick={() => navigateTo('portfolio')}
                  className="btn-outline btn-return"
                  title="Return to Public Portfolio"
                >
                  ← Return to Portfolio
                </button>
                <button onClick={toggleTheme} className="icon-button" title="Toggle Light/Dark Theme">
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </div>
            </div>
          </nav>

          <main className="container admin-page-container">
            {!adminToken ? (
              /* DEDICATED FULL-PAGE LOGIN CARD */
              <div className="admin-login-screen">
                <div className="admin-login-card">
                  <div className="login-card-header">
                    <div className="admin-lock-icon">🔐</div>
                    <h2 className="login-card-title">Administrator Sign In</h2>
                    <p className="login-card-subtitle">
                      Sign in with your administrator credentials to access the portfolio management dashboard.
                    </p>
                  </div>

                  {loginError && <div className="login-error-alert">⚠️ {loginError}</div>}

                  <form onSubmit={handleLoginSubmit} className="admin-login-form">
                    <div className="form-group">
                      <label>Username ID</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        autoFocus
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn-orange btn-full">
                      Authenticate &amp; Open Dashboard →
                    </button>
                  </form>

                  <div className="login-card-footer">
                    <button onClick={() => navigateTo('portfolio')} className="btn-return-link">
                      ← Cancel and return to public portfolio
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* DEDICATED FULL-PAGE CRUD DASHBOARD */
              <div className="admin-dashboard-screen">
                <div className="admin-screen-hero">
                  <div>
                    <span className="section-kicker">CONTROL CENTER</span>
                    <h1 className="admin-page-heading">Portfolio Control Dashboard</h1>
                    <p className="admin-page-desc">
                      Perform CRUD operations across projects, update your contact phone number, resume link, bio, and credentials.
                    </p>
                  </div>
                </div>

                <div className="admin-dashboard-card">
                  <div className="admin-tabs">
                    <button
                      className={`tab-btn ${adminTab === 'profile' ? 'active' : ''}`}
                      onClick={() => setAdminTab('profile')}
                    >
                      👤 Profile &amp; Contact
                    </button>
                    <button
                      className={`tab-btn ${adminTab === 'projects' ? 'active' : ''}`}
                      onClick={() => setAdminTab('projects')}
                    >
                      🚀 Personal Projects
                    </button>
                    <button
                      className={`tab-btn ${adminTab === 'company' ? 'active' : ''}`}
                      onClick={() => setAdminTab('company')}
                    >
                      🏢 Company Projects
                    </button>
                    <button
                      className={`tab-btn ${adminTab === 'certs' ? 'active' : ''}`}
                      onClick={() => setAdminTab('certs')}
                    >
                      🏆 Certifications
                    </button>
                    <button onClick={handleLogout} className="tab-btn logout-tab">
                      🚪 Logout
                    </button>
                  </div>

                  {/* TAB 1: PROFILE & CONTACT (Changing num, updating resume) */}
                  {adminTab === 'profile' && (
                    <form onSubmit={handleSaveProfile} className="admin-form-pane">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            value={profileForm.fullName}
                            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Professional Title</label>
                          <input
                            type="text"
                            value={profileForm.title}
                            onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Current Company</label>
                          <input
                            type="text"
                            value={profileForm.currentCompany}
                            onChange={(e) => setProfileForm({ ...profileForm, currentCompany: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>College / Alma Mater</label>
                          <input
                            type="text"
                            value={profileForm.college}
                            onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone Number (Directly Editable)</label>
                          <input
                            type="text"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Email Address</label>
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Location</label>
                          <input
                            type="text"
                            value={profileForm.location}
                            onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Resume Link / File URL (Directly Editable)</label>
                          <input
                            type="text"
                            value={profileForm.resumeUrl}
                            placeholder="e.g. /resume.pdf or https://..."
                            onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Brief Bio / Summary</label>
                        <textarea
                          rows="4"
                          value={profileForm.summary}
                          onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
                        ></textarea>
                      </div>
                      <button type="submit" className="btn-orange">
                        💾 Save Profile Changes to Database
                      </button>
                    </form>
                  )}

                  {/* TAB 2: PERSONAL PROJECTS CRUD */}
                  {adminTab === 'projects' && (
                    <div className="admin-form-pane">
                      <h4 className="pane-title">Add New Personal Project</h4>
                      <form onSubmit={handleAddProject} className="sub-form">
                        <div className="form-grid-2">
                          <div className="form-group">
                            <label>Project Title</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. AI Workflow Automator"
                              value={newProject.title}
                              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Category</label>
                            <input
                              type="text"
                              value={newProject.category}
                              onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Technologies (comma-separated)</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Java, Spring Boot, PostgreSQL, Docker"
                              value={newProject.technologies}
                              onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label>GitHub Repository URL</label>
                            <input
                              type="text"
                              placeholder="https://github.com/..."
                              value={newProject.githubUrl}
                              onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Short Description</label>
                          <input
                            type="text"
                            required
                            placeholder="High-performance backend system..."
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Key Bullets (one bullet per line)</label>
                          <textarea
                            rows="3"
                            placeholder="Bullet 1&#10;Bullet 2&#10;Bullet 3"
                            value={newProject.bullets}
                            onChange={(e) => setNewProject({ ...newProject, bullets: e.target.value })}
                          ></textarea>
                        </div>
                        <button type="submit" className="btn-orange">
                          + Add Project to Portfolio
                        </button>
                      </form>

                      <h4 className="pane-title" style={{ marginTop: '2rem' }}>
                        Existing Projects ({personalProjects.length})
                      </h4>
                      <div className="admin-list">
                        {personalProjects.map((p) => (
                          <div key={p.id} className="admin-list-item">
                            <div>
                              <strong>{p.title}</strong>
                              <div className="item-sub">{p.technologies}</div>
                            </div>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="btn-delete"
                              title="Delete this project"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: COMPANY SUB-PROJECTS CRUD */}
                  {adminTab === 'company' && (
                    <div className="admin-form-pane">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                        <span className="maq-logo-badge mini">
                          <img src="/maq-logo.png" alt="MAQ Software Logo" className="maq-company-logo mini" />
                        </span>
                        <h4 className="pane-title" style={{ margin: 0 }}>Add Company Project (under MAQ Software)</h4>
                      </div>
                      <form onSubmit={handleAddSubProject} className="sub-form">
                        <div className="form-grid-2">
                          <div className="form-group">
                            <label>Project Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Cloud Telemetry Pipeline"
                              value={newSubProject.name}
                              onChange={(e) => setNewSubProject({ ...newSubProject, name: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Technologies</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Python, Azure, Kafka"
                              value={newSubProject.technologies}
                              onChange={(e) => setNewSubProject({ ...newSubProject, technologies: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Impact Bullets (one bullet per line)</label>
                          <textarea
                            rows="3"
                            placeholder="Bullet point 1&#10;Bullet point 2"
                            value={newSubProject.bullets}
                            onChange={(e) => setNewSubProject({ ...newSubProject, bullets: e.target.value })}
                          ></textarea>
                        </div>
                        <button type="submit" className="btn-orange">
                          + Add Company Project
                        </button>
                      </form>

                      <h4 className="pane-title" style={{ marginTop: '2rem' }}>
                        Current Company Sub-Projects
                      </h4>
                      <div className="admin-list">
                        {companyProjects.map((sp) => (
                          <div key={sp.id} className="admin-list-item">
                            <div>
                              <strong>{sp.name}</strong>
                              <div className="item-sub">{sp.technologies}</div>
                            </div>
                            {sp.id && (
                              <button
                                onClick={() => handleDeleteSubProject(sp.id)}
                                className="btn-delete"
                                title="Delete subproject"
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: CERTIFICATIONS */}
                  {adminTab === 'certs' && (
                    <div className="admin-form-pane">
                      <h4 className="pane-title">Manage Certifications</h4>
                      <form onSubmit={handleAddCert} className="sub-form-row">
                        <input
                          type="text"
                          placeholder="e.g. AWS Certified Developer or CKA"
                          value={newCertInput}
                          onChange={(e) => setNewCertInput(e.target.value)}
                        />
                        <button type="submit" className="btn-orange">
                          + Add
                        </button>
                      </form>

                      <div className="admin-list" style={{ marginTop: '1.5rem' }}>
                        {certificationsList.map((c, idx) => (
                          <div key={idx} className="admin-list-item">
                            <span>★ {c}</span>
                            <button onClick={() => handleDeleteCert(idx)} className="btn-delete">
                              ✕ Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        /* ========================================================
           PUBLIC PORTFOLIO PAGE (/)
           ======================================================== */
        <>
          {/* Public Top Bar */}
          <nav className="top-nav">
            <div className="container nav-content">
              <div className="status-badge">
                <span className="pulsing-dot"></span>
                <span>Open to Roles · 2026</span>
              </div>
              <div className="nav-actions">
                <button
                  onClick={() => navigateTo('admin')}
                  className="admin-portal-btn"
                  title="Admin Portal (Dedicated Page)"
                >
                  🔐 {adminToken ? 'Admin Dashboard' : 'Admin Login'}
                </button>
                <button onClick={toggleTheme} className="icon-button" title="Toggle Light/Dark Theme">
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <button onClick={() => window.print()} className="icon-button" title="Print / PDF Resume">
                  🖨️
                </button>
              </div>
            </div>
          </nav>


      {/* MAIN PORTFOLIO */}
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
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="%23EA580C"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="60" font-weight="bold">AT</text></svg>';
              }}
            />
            <span className="avatar-online-dot"></span>
          </div>

          <h1 className="hero-name">{personal.fullName}</h1>
          <div className="hero-title">{personal.title}</div>

          {/* Current Company & College Badges */}
          <div className="affiliation-group">
            <div className="affiliation-chip">
              <span className="maq-logo-badge mini">
                <img src="/maq-logo.png" alt="MAQ Software Logo" className="maq-company-logo mini" />
              </span>
              <span>Company: <strong>{personal.currentCompany || 'MAQ Software'}</strong> (Noida)</span>
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
            <button
              onClick={() => {
                if (personal.resumeUrl && personal.resumeUrl !== '#') {
                  window.open(personal.resumeUrl, '_blank');
                } else {
                  window.print();
                }
              }}
              className="btn-outline btn-resume"
              title="View & print / download clean PDF resume"
            >
              📄 View Resume
            </button>
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
              <div className="company-brand-flex">
                <div className="maq-logo-badge">
                  <img src="/maq-logo.png" alt="MAQ Software Logo" className="maq-company-logo" />
                </div>
                <div>
                  <h3 className="company-brand">MAQ Software</h3>
                  <div className="company-subtitle">Associate Software Engineer · Noida, India</div>
                </div>
              </div>
              <span className="mono-date">Oct 2025 – Present</span>
            </div>

            <div className="subprojects-container">
              {companyProjects.map((sp) => (
                <div key={sp.id || sp.name} className="subproject-block">
                  <h4 className="subproject-title">{sp.name}</h4>
                  <div className="tech-tags">
                    {sp.technologies.split(',').map((t) => (
                      <span key={t.trim()} className="tech-tag">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                  <ul className="bullet-tree">
                    {sp.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. PERSONAL PROJECTS */}
        <section id="personal-projects" className="content-section">
          <div className="section-head">
            <span className="section-kicker">OPEN SOURCE &amp; FULL STACK</span>
            <h2 className="section-heading">Personal Projects</h2>
            <p className="section-subheading">Architected systems, microservices, and databases</p>
          </div>

          <div className="personal-projects-grid">
            {personalProjects.map((p) => (
              <div key={p.id} className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="featured-project-box">
                  <div className="project-meta-col">
                    <div>
                      <div className="project-top-row">
                        <h3 className="project-name">{p.title}</h3>
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="repo-pill"
                          >
                            GitHub Repository ↗
                          </a>
                        )}
                      </div>
                      <p className="project-abstract">{p.description}</p>
                      <div className="tech-tags">
                        {p.technologies.split(',').map((t) => (
                          <span key={t.trim()} className="tech-tag">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="project-details-col">
                    <div className="details-heading">Implementation Highlights</div>
                    <ul className="bullet-tree">
                      {p.bullets && p.bullets.length > 0 ? (
                        p.bullets.map((b, idx) => <li key={idx}>{b}</li>)
                      ) : (
                        <li>Optimized database queries and transactional consistency.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. ACHIEVEMENTS & CERTIFICATIONS */}
        <section id="achievements" className="content-section">
          <div className="section-head">
            <span className="section-kicker">MILESTONES &amp; CREDENTIALS</span>
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
            {certificationsList.map((cert, idx) => (
              <div key={idx} className="cert-tile">
                <span className="cert-star">★</span>
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SOCIALS & CONTACT */}
        <section id="socials" className="content-section">
          <div className="section-head">
            <span className="section-kicker">CONNECT &amp; REACH OUT</span>
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
            <span>REST API: Connected · RBAC Active</span>
          </div>
        </div>
      </footer>
        </>
      )}
    </div>
  );
}

