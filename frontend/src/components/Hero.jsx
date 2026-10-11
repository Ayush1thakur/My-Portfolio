import React from 'react';
import { ArrowRight, Sparkles, Server, Database, Code, CheckCircle2 } from 'lucide-react';

export default function Hero({ onPingClick, pingLoading }) {
  return (
    <section style={{ padding: '4.5rem 0 3rem', textAlign: 'center' }}>
      <div className="container">
        <div style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
          <div className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem' }}>
            <span className="pulsing-dot" style={{ background: '#10b981' }}></span>
            <span>Production-Ready Fullstack Architecture</span>
          </div>
        </div>

        <h1 style={{ fontSize: '3.5rem', lineHeight: 1.15, marginBottom: '1.25rem', fontWeight: 800 }}>
          Engineering High-Performance Apps with <br />
          <span className="gradient-text">Java Spring Boot</span> &amp; <span style={{ color: '#38bdf8' }}>React</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '720px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          Clean enterprise-grade REST architecture with Spring Boot 3 &amp; Java 21, coupled with a fast modern React 19 frontend and powered by Neon Serverless PostgreSQL.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <button
            onClick={onPingClick}
            disabled={pingLoading}
            className="btn btn-primary"
            style={{ fontSize: '1rem', padding: '0.85rem 1.8rem' }}
          >
            <Sparkles size={18} />
            {pingLoading ? 'Testing /api/health...' : 'Test Backend Route Live'}
          </button>
          
          <a
            href="#projects"
            className="btn btn-secondary"
            style={{ fontSize: '1rem', padding: '0.85rem 1.8rem' }}
          >
            Explore Projects <ArrowRight size={18} />
          </a>
        </div>

        {/* Feature Badges Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginTop: '1rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Server size={20} color="#38bdf8" />
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Spring Boot 3.4</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Java 21 LTS runtime with Spring Data JPA, REST controllers &amp; HikariCP.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Code size={20} color="#818cf8" />
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>React + Vite</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Lightning fast HMR, componentized design tokens &amp; proxy setup.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Database size={20} color="#34d399" />
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Neon PostgreSQL</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Serverless Lakebase Postgres branching with automated schema migrations.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={20} color="#f59e0b" />
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Scalable Structure</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Clean separation of concerns with controllers, services, repositories &amp; models.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
