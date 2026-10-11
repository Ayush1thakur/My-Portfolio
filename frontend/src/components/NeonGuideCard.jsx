import React, { useState } from 'react';
import { Database, CheckCircle, Copy, Check, Terminal, ShieldCheck, Zap } from 'lucide-react';

export default function NeonGuideCard() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const steps = [
    {
      title: '1. Authenticate CLI with your Neon account',
      cmd: 'neon login',
      desc: 'Opens your browser for one-click authentication.'
    },
    {
      title: '2. Link this workspace to production branch',
      cmd: 'neon link --project-id green-lab-52718513 --branch production -y',
      desc: 'Connects your local environment to the green-lab-52718513 Lakebase Postgres project.'
    },
    {
      title: '3. Deploy and synchronize policies',
      cmd: 'neon deploy',
      desc: 'Applies neon.ts configuration to your Neon project branch.'
    }
  ];

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="neon" style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="glass-panel" style={{ padding: '2.25rem', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '0.6rem',
              borderRadius: '12px',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.6rem' }}>Neon Serverless Postgres Architecture</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Target Project ID: <code style={{ color: '#38bdf8' }}>green-lab-52718513</code> &bull; Target Branch: <code style={{ color: '#34d399' }}>production</code>
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '1rem 0 1.5rem', lineHeight: 1.6 }}>
            The workspace is configured with <code>neon.ts</code>, MCP tools, and Spring Boot PostgreSQL datasource bindings.
            When you're ready to authenticate with your personal browser session, run the quick commands below in your terminal:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.2rem' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {step.desc}
                  </div>
                  <div style={{ marginTop: '0.4rem', fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.85rem' }}>
                    $ {step.cmd}
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(step.cmd, idx)}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  {copiedIndex === idx ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
