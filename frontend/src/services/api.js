const API_BASE = (import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api` 
  : '/api');

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

export async function fetchPortfolio() {
  const res = await fetch(`${API_BASE}/portfolio`);
  if (!res.ok) throw new Error(`Failed to fetch portfolio: ${res.status}`);
  return await res.json();
}

// Authentication API
export async function loginAdmin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Authentication failed');
  }
  return data;
}

export async function verifyAdminSession(token) {
  const res = await fetch(`${API_BASE}/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.ok;
}

// Protected Admin CRUD Operations
export async function updateAdminProfile(token, profile) {
  const res = await fetch(`${API_BASE}/admin/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(profile)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
}

export async function createAdminProject(token, project) {
  const res = await fetch(`${API_BASE}/admin/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(project)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create project');
  return data;
}

export async function updateAdminProject(token, id, project) {
  const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(project)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update project');
  return data;
}

export async function deleteAdminProject(token, id) {
  const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete project');
  return data;
}

export async function createAdminSubProject(token, subProject) {
  const res = await fetch(`${API_BASE}/admin/subprojects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(subProject)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create sub-project');
  return data;
}

export async function deleteAdminSubProject(token, id) {
  const res = await fetch(`${API_BASE}/admin/subprojects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete sub-project');
  return data;
}

export async function updateAdminCertifications(token, certs) {
  const res = await fetch(`${API_BASE}/admin/certifications`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(certs)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update certifications');
  return data;
}
