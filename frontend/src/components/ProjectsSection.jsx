import React, { useState } from 'react';
import { FolderGit2, Plus, ExternalLink, Tag, Layers, CheckCircle } from 'lucide-react';
import { GithubIcon } from './Icons';
import { createProject } from '../services/api';

export default function ProjectsSection({ projects, onProjectCreated }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    category: 'Backend',
    featured: true
  });

  const categories = ['All', 'Backend', 'Fullstack', 'AI & Cloud'];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    setSubmitting(true);
    try {
      await createProject(formData);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        category: 'Backend',
        featured: true
      });
      if (onProjectCreated) onProjectCreated();
    } catch (err) {
      alert('Error creating project: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="projects" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>
              <Layers size={12} /> REST Data Pipeline
            </div>
            <h2 style={{ fontSize: '2.25rem' }}>Featured Projects</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Retrieved directly from Spring Boot JPA repository &amp; PostgreSQL.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Filter pills */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '0.25rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-subtle)'
            }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '9999px',
                    background: activeCategory === cat ? 'linear-gradient(135deg, #0284c7, #6366f1)' : 'transparent',
                    color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add Project
            </button>
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>
                    {project.category || 'Engineering'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--text-secondary)' }}
                        title="GitHub"
                      >
                        <GithubIcon size={17} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#38bdf8' }}
                        title="Live Preview"
                      >
                        <ExternalLink size={17} />
                      </a>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem', color: '#f8fafc' }}>
                  {project.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {project.description}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.9rem' }}>
                  {project.technologies?.split(',').map((tech, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#94a3b8'
                      }}
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for adding a project to test POST /api/projects */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}>
            <div className="glass-panel" style={{
              background: '#0e1526',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '2rem',
              maxWidth: '520px',
              width: '100%',
              borderRadius: 'var(--radius-lg)'
            }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Add New Project (POST API)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Test the Spring Boot <code>POST /api/projects</code> endpoint with dynamic data insertion.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Distributed Task Queue"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what the project accomplishes..."
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      resize: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="Java, Spring Boot, PostgreSQL, Kafka"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        background: '#162035',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    >
                      <option value="Backend">Backend</option>
                      <option value="Fullstack">Fullstack</option>
                      <option value="AI & Cloud">AI &amp; Cloud</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>GitHub URL</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                  >
                    {submitting ? 'Saving to Database...' : 'Save Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
