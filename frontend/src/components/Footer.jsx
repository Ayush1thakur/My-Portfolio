import React from 'react';
import { Heart, Terminal } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      padding: '2.5rem 0',
      background: 'rgba(5, 8, 14, 0.95)',
      marginTop: '4rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.88rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Crafted by <strong>Ayush Thakur</strong> with Spring Boot 3 &amp; React</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="https://github.com/Ayush1thakur/My-Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}
          >
            <GithubIcon size={15} /> GitHub Repository
          </a>
          <span>&bull;</span>
          <span>Neon Lakebase Postgres</span>
        </div>
      </div>
    </footer>
  );
}
