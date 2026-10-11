import React from 'react';
import { Terminal, Database, Cpu, ExternalLink } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function Navbar({ onPingBackend, isConnected }) {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: 'rgba(9, 13, 22, 0.8)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1rem 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.1rem',
            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)'
          }}>
            AT
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              Ayush Thakur
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Fullstack Architect</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: isConnected ? '#34d399' : '#f87171' }}>
                {isConnected ? 'API Live' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#status" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={15} /> System Status
          </a>
          <a href="#projects" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Terminal size={15} /> Projects
          </a>
          <a href="#neon" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Database size={15} /> Neon DB
          </a>
          
          <a
            href="https://github.com/Ayush1thakur/My-Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            <GithubIcon size={16} /> GitHub Repo
          </a>
        </div>
      </div>
    </nav>
  );
}
