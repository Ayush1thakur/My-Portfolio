import React, { useState } from 'react';
import { Activity, CheckCircle, AlertTriangle, RefreshCw, Server, Database, Clock, Copy, Check } from 'lucide-react';

export default function BackendStatusCard({ healthData, loading, onRefresh, latency }) {
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const isUp = healthData?.data?.status === 'UP';
  const data = healthData?.data || {};

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(healthData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="status" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1.25rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <Activity size={22} color={isUp ? '#10b981' : '#f43f5e'} />
                <h3 style={{ fontSize: '1.4rem' }}>Live Backend Route Test: <code style={{ color: '#38bdf8', fontSize: '1.1rem' }}>GET /api/health</code></h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Real-time connection handshake between React (Vite) and Spring Boot backend.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className={`badge ${isUp ? 'badge-emerald' : 'badge-amber'}`}>
                <span className="pulsing-dot" style={{ background: isUp ? '#10b981' : '#f59e0b' }}></span>
                {isUp ? 'OPERATIONAL' : (loading ? 'PINGING...' : 'DISCONNECTED')}
              </div>
              <button
                onClick={onRefresh}
                disabled={loading}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                title="Refresh Health Route"
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                <span>Re-test</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Server size={14} /> Backend Framework
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                {data.framework || 'Spring Boot 3.4.3'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Runtime: Java {data.javaVersion || '21'}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Database size={14} /> Database Status
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: data.databaseConnected ? '#34d399' : '#f87171' }}>
                {data.databaseConnected ? 'Connected (Active)' : 'Disconnected'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={data.databaseDetails}>
                {data.databaseDetails || 'Checking...'}
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Database size={14} /> Neon Project Link
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8' }}>
                {data.neonProjectId || 'green-lab-52718513'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Branch: <code>{data.neonBranch || 'production'}</code>
              </div>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} /> Round-trip Latency
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#a5b4fc' }}>
                {latency ? `${latency} ms` : 'Measuring...'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Vite Proxy: <code>/api -&gt; :8081</code>
              </div>
            </div>
          </div>

          {/* Collapsible JSON Inspector */}
          <div style={{
            background: '#040711',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 1rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <button
                onClick={() => setShowJson(!showJson)}
                style={{
                  background: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{showJson ? '▼ Hide' : '▶ Inspect'} Raw JSON Response payload</span>
              </button>

              <button
                onClick={handleCopy}
                style={{
                  background: 'none',
                  color: copied ? '#34d399' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            {showJson && (
              <pre style={{
                margin: 0,
                padding: '1rem',
                fontSize: '0.82rem',
                color: '#38bdf8',
                fontFamily: 'monospace',
                overflowX: 'auto',
                lineHeight: 1.5
              }}>
                {JSON.stringify(healthData, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
