// src/utils/api.js
// Central API client — all requests go through here.
// VITE_API_URL is used in production (e.g. https://api.atyant.in).
// In dev, Vite proxies /api → http://localhost:5000 so we use '' (empty base).

const API_BASE =
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '') // strip trailing slash
    : '';

export const resolveAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/api/')) {
    return `${API_BASE}${url}`;
  }
  return url;
};

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  // Try to parse JSON even on error so we can surface backend messages
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const message =
      data?.error || data?.message || `API error ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;

    // Single-device login: the backend rejects a token once a newer login
    // has replaced it. Clear local state and let the app show a "logged out
    // elsewhere" notice instead of a raw error.
    if (data?.code === 'SESSION_INVALIDATED') {
      localStorage.removeItem('user_token');
      window.dispatchEvent(new CustomEvent('sessionInvalidated', { detail: { message } }));
    }

    throw err;
  }

  return data;
}

// Helper for user auth header (kept alongside adminAuthHeader for consistency)
const userAuthHeader = () => {
  const token = localStorage.getItem('user_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper for admin auth header
const adminAuthHeader = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── Leads ───────────────────────────────────────────────────────────────────

/**
 * Submit a lead (public — no auth required).
 * @param {{ name, email, phone?, source?, stream?, rank?, confusion? }} payload
 */
export const createLead = (payload) =>
  request('/api/leads', { method: 'POST', body: JSON.stringify(payload) });

/** Admin: list leads with optional filters */
export const listLeads = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/leads${qs ? `?${qs}` : ''}`, { headers: adminAuthHeader() });
};

/** Admin: update lead status */
export const updateLead = (id, data) =>
  request(`/api/leads/${id}`, { method: 'PATCH', headers: adminAuthHeader(), body: JSON.stringify(data) });

/** Admin: delete lead */
export const deleteLead = (id) =>
  request(`/api/leads/${id}`, { method: 'DELETE', headers: adminAuthHeader() });

/** Admin: list all registered mentors */
export const listMentorsAdmin = () =>
  request('/api/admin/mentors', { headers: adminAuthHeader() });

/** Admin: delete any user or mentor account by ID */
export const deleteUserAdmin = (id) =>
  request(`/api/admin/users/${id}`, { method: 'DELETE', headers: adminAuthHeader() });

/**
 * Admin: replace a mentor's bundles wholesale. Bundles are no longer
 * mentor-self-service (see PATCH /api/users/me) — this is now the only way
 * to change what packages a mentor offers.
 * @param {string} mentorId
 * @param {string[]} bundles
 */
export const adminUpdateMentorBundles = (mentorId, bundles) =>
  request(`/api/admin/mentors/${mentorId}/bundles`, {
    method: 'PATCH',
    headers: adminAuthHeader(),
    body: JSON.stringify({ bundles }),
  });

/** Admin: export leads CSV — returns raw text, not JSON */
export const exportLeadsCSV = async () => {
  const url = `${API_BASE}/api/leads/export.csv`;
  const token = localStorage.getItem('admin_token');
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`CSV export failed: ${res.status}`);
  return res.blob();
};

// ─── Chat ─────────────────────────────────────────────────────────────────────

/**
 * Send a chat message to the AI backend.
 * @param {{ message: string, sessionId?: string }} payload
 */
export const sendChatMessage = (payload) =>
  request('/api/chat/message', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

/** Admin: list chat sessions */
export const listChatSessions = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/chat/sessions${qs ? `?${qs}` : ''}`, { headers: adminAuthHeader() });
};

/** Admin: get a single session */
export const getChatSession = (sessionId) =>
  request(`/api/chat/sessions/${sessionId}`, { headers: adminAuthHeader() });

// ─── Decision Engine ──────────────────────────────────────────────────────────

/**
 * Get a personalized college decision from the AI engine.
 * @param {{ stream, rank, confusion?, name?, email? }} payload
 */
export const getDecision = (payload) =>
  request('/api/decision', { method: 'POST', body: JSON.stringify(payload) });

// ─── Payments ─────────────────────────────────────────────────────────────────

/** Fetch available plans + Cashfree configuration */
export const getPaymentPlans = () => request('/api/payments/plans');

/**
 * Create a Cashfree order (public).
 * @param {{ planId, name, email, phone, mentorId? }} payload
 */
export const createPaymentOrder = (payload) =>
  request('/api/payments/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

/**
 * Verify a payment after Cashfree checkout (public).
 * @param {{ cashfreeOrderId }} payload
 */
export const verifyPayment = (payload) =>
  request('/api/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

/** Admin: list payments */
export const listPayments = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/payments${qs ? `?${qs}` : ''}`, { headers: adminAuthHeader() });
};

/** User: fetch my paid packages and selected mentors */
export const getMyBookings = () => {
  const token = localStorage.getItem('user_token');
  return request('/api/payments/my-bookings', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Admin login — stores JWT in localStorage on success.
 * @param {{ email, password }} payload
 */
export const adminLogin = async (payload) => {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (data.token) localStorage.setItem('admin_token', data.token);
  return data;
};

/** Verify stored JWT + fetch current admin */
export const getMe = () => request('/api/auth/me', { headers: adminAuthHeader() });

/** Clear stored token */
export const adminLogout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('user_token');
};

export const userSignup = async (payload) => {
  const data = await request('/api/users/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (data.token) localStorage.setItem('user_token', data.token);
  return data;
};

export const userLogin = async (payload) => {
  const data = await request('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (data.token) localStorage.setItem('user_token', data.token);
  return data;
};

export const googleLogin = async (credential) => {
  const data = await request('/api/users/google-auth', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });
  if (data.token) localStorage.setItem('user_token', data.token);
  return data;
};

export const googleSignup = async (payload) => {
  const data = await request('/api/users/google-signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (data.token) localStorage.setItem('user_token', data.token);
  return data;
};

export const getUserMe = () => {
  const token = localStorage.getItem('user_token');
  return request('/api/users/me', { 
    headers: token ? { Authorization: `Bearer ${token}` } : {} 
  });
};

export const updateUser = (payload) => {
  const token = localStorage.getItem('user_token');
  return request('/api/users/me', {
    method: 'PATCH',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(payload)
  });
};

export const getMentors = () => request('/api/users/mentors');

// ─── Uploads ──────────────────────────────────────────────────────────────────

export const uploadProfilePhoto = async (file) => {
  const token = localStorage.getItem('user_token');
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE}/api/upload/profile-photo`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  
  let data;
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
};

export const uploadIdDoc = async (file) => {
  const token = localStorage.getItem('user_token');
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE}/api/upload/id-doc`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  
  let data;
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
};

export const deleteIdDoc = async () => {
  const token = localStorage.getItem('user_token');
  const res = await fetch(`${API_BASE}/api/upload/id-doc`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  let data;
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok) throw new Error(data.error || 'Delete failed');
  return data;
};

// Admin ID Document Verification Operations
export const viewIdDocAdmin = async (mentorId) => {
  const token = localStorage.getItem('admin_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/api/upload/id-doc/${mentorId}`, {
    headers
  });
  if (!res.ok) {
    let errData;
    try { errData = await res.json(); } catch { errData = {}; }
    throw new Error(errData.error || `Failed to fetch document: ${res.status}`);
  }
  const blob = await res.blob();
  const fileUrl = window.URL.createObjectURL(blob);
  window.open(fileUrl, '_blank');
};

export const verifyIdDocAdmin = (mentorId) =>
  request(`/api/upload/id-doc/${mentorId}/verify`, {
    method: 'PATCH',
    headers: adminAuthHeader()
  });

export const rejectIdDocAdmin = (mentorId) =>
  request(`/api/upload/id-doc/${mentorId}/reject`, {
    method: 'PATCH',
    headers: adminAuthHeader()
  });


// ─── Health ───────────────────────────────────────────────────────────────────

export const healthCheck = () => request('/health');

export default API_BASE;


// ─── Roadmap (progress, streaks, batch/cohort, pillars & content) ───────

export const getRoadmapPillars = () =>
  request('/api/roadmap/pillars', { headers: userAuthHeader() });

export const completeRoadmapItem = (itemId) =>
  request(`/api/roadmap/items/${itemId}/complete`, {
    method: 'POST',
    headers: userAuthHeader(),
  });

export const roadmapCheckIn = () =>
  request('/api/roadmap/checkin', { method: 'POST', headers: userAuthHeader() });

export const getStreak = () =>
  request('/api/roadmap/streak', { headers: userAuthHeader() });

export const getMyBatch = () =>
  request('/api/roadmap/batch/me', { headers: userAuthHeader() });

// ─── Session ────────────────────────────────────────────────────────────

export const logoutUser = async () => {
  try {
    await request('/api/users/logout', { method: 'POST', headers: userAuthHeader() });
  } finally {
    localStorage.removeItem('user_token');
  }
};


export const getCareerPaths = () => request('/api/roadmap/career-paths');


// ─── Referral & FAQ videos (public + student) ────────────────────────────

export const getFaqVideos = () => request('/api/roadmap/faq-videos');

export const getReferralStatus = () =>
  request('/api/roadmap/referral', { headers: userAuthHeader() });

// ─── Admin: Roadmap content management ──────────────────────────────────

export const adminListPillars = () => request('/api/admin/roadmap/pillars', { headers: adminAuthHeader() });
export const adminCreatePillar = (payload) =>
  request('/api/admin/roadmap/pillars', { method: 'POST', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminUpdatePillar = (id, payload) =>
  request(`/api/admin/roadmap/pillars/${id}`, { method: 'PATCH', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminDeletePillar = (id) =>
  request(`/api/admin/roadmap/pillars/${id}`, { method: 'DELETE', headers: adminAuthHeader() });

export const adminListItems = (pillarId) =>
  request(`/api/admin/roadmap/items${pillarId ? `?pillar=${pillarId}` : ''}`, { headers: adminAuthHeader() });
export const adminCreateItem = (payload) =>
  request('/api/admin/roadmap/items', { method: 'POST', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminUpdateItem = (id, payload) =>
  request(`/api/admin/roadmap/items/${id}`, { method: 'PATCH', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminDeleteItem = (id) =>
  request(`/api/admin/roadmap/items/${id}`, { method: 'DELETE', headers: adminAuthHeader() });

export const adminListCareerPaths = () => request('/api/admin/career-paths', { headers: adminAuthHeader() });
export const adminCreateCareerPath = (payload) =>
  request('/api/admin/career-paths', { method: 'POST', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminUpdateCareerPath = (id, payload) =>
  request(`/api/admin/career-paths/${id}`, { method: 'PATCH', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminDeleteCareerPath = (id) =>
  request(`/api/admin/career-paths/${id}`, { method: 'DELETE', headers: adminAuthHeader() });

// ─── Admin: Career Path Content Items ────────────────────────────────────────
export const adminListCareerPathItems = (careerPathId) =>
  request(`/api/admin/career-path-items${careerPathId ? `?careerPath=${careerPathId}` : ''}`, { headers: adminAuthHeader() });
export const adminCreateCareerPathItem = (payload) =>
  request('/api/admin/career-path-items', { method: 'POST', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminUpdateCareerPathItem = (id, payload) =>
  request(`/api/admin/career-path-items/${id}`, { method: 'PATCH', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminDeleteCareerPathItem = (id) =>
  request(`/api/admin/career-path-items/${id}`, { method: 'DELETE', headers: adminAuthHeader() });

export const adminListFaqVideos = () => request('/api/admin/faq-videos', { headers: adminAuthHeader() });
export const adminCreateFaqVideo = (payload) =>
  request('/api/admin/faq-videos', { method: 'POST', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminUpdateFaqVideo = (id, payload) =>
  request(`/api/admin/faq-videos/${id}`, { method: 'PATCH', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminDeleteFaqVideo = (id) =>
  request(`/api/admin/faq-videos/${id}`, { method: 'DELETE', headers: adminAuthHeader() });

// Admin uploads a document/video file and gets back a URL to attach to a
// RoadmapItem or FaqVideo via the CRUD calls above.
export const uploadRoadmapContent = async (file) => {
  const token = localStorage.getItem('admin_token');
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/upload/roadmap-content`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  let data;
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
};

// ─── Public: Career Paths (detail + list) ─────────────────────────────────────

export const getCareersList = () => request('/api/careers');
export const getCareerDetail = (slug) => request(`/api/careers/${slug}`);
export const getRelatedCareers = (slug) => request(`/api/careers/${slug}/related`);

// ─── Public: Quiz ─────────────────────────────────────────────────────────────

export const getQuizQuestions = () => request('/api/quiz/questions');

export const submitQuizAnswers = (payload) =>
  request('/api/quiz/submit', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export async function submitClarityForm(data) {
  return request('/api/leads/clarity', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


export const getQuizResult = (id) => request(`/api/quiz/results/${id}`);
export const submitQuizEmail = (id, email) =>
  request(`/api/quiz/results/${id}/email`, {
    method: 'PATCH',
    body: JSON.stringify({ email }),
  });

// ─── Admin: Quiz question management ──────────────────────────────────────────

export const adminListQuizQuestions = () =>
  request('/api/admin/quiz-questions', { headers: adminAuthHeader() });
export const adminCreateQuizQuestion = (payload) =>
  request('/api/admin/quiz-questions', { method: 'POST', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminUpdateQuizQuestion = (id, payload) =>
  request(`/api/admin/quiz-questions/${id}`, { method: 'PATCH', headers: adminAuthHeader(), body: JSON.stringify(payload) });
export const adminDeleteQuizQuestion = (id) =>
  request(`/api/admin/quiz-questions/${id}`, { method: 'DELETE', headers: adminAuthHeader() });

// ─── Admin: Career detail content management ──────────────────────────────────
// (uses the existing adminUpdateCareerPath endpoint which now accepts rich fields)
export const adminGetCareerDetail = (slug) =>
  request(`/api/careers/${slug}`, { headers: adminAuthHeader() });
export const adminUpdateCareerDetail = (id, payload) =>
  request(`/api/admin/career-paths/${id}`, { method: 'PATCH', headers: adminAuthHeader(), body: JSON.stringify(payload) });

