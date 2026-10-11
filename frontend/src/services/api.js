const API_BASE = '/api';

export async function checkBackendHealth() {
  const startTime = performance.now();
  try {
    const res = await fetch(`${API_BASE}/health`);
    const duration = Math.round(performance.now() - startTime);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return { ok: true, data, duration };
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);
    return { ok: false, error: err.message, duration };
  }
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
  return await res.json();
}

export async function createProject(project) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error(`Failed to create project: ${res.status}`);
  return await res.json();
}
