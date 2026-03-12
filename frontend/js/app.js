let currentPage = 'home';
let currentUser = api.getUser();
let userComplaints = [];
let publicComplaints = [];
let adminComplaints = [];
let selectedFile = null;
let refreshTimer = null;

const deptPreviewRules = [
  { test: /(garbage|trash|waste|dump|sanitation|sewage|drain)/i, department: 'Sanitation Department' },
  { test: /(water|leak|pipeline|tap|flood)/i, department: 'Water Department' },
  { test: /(street light|electric|power|wire|transformer)/i, department: 'Electrical Department' },
  { test: /(road|pothole|bridge|footpath|pavement|public works)/i, department: 'Public Works Department' },
  { test: /(traffic|signal|parking|transport|jam)/i, department: 'Traffic & Transport Department' }
];

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas fa-circle-info"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 20);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function setLoading(show) {
  document.getElementById('loading-overlay').classList.toggle('hidden', !show);
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function getPriorityLabel(priority) {
  if (priority === 'red') return '🔴 High Priority';
  if (priority === 'green') return '🟢 Resolved';
  return '🟡 Medium Priority';
}

function getProgressByStatus(status) {
  if (status === 'Pending') return 25;
  if (status === 'In Progress') return 65;
  return 100;
}

function toggleMobileMenu() {
  document.getElementById('nav-menu').classList.toggle('show');
}

function toggleUserMenu() {
  document.getElementById('user-dropdown').classList.toggle('hidden');
}

function updateAuthUI() {
  currentUser = api.getUser();
  const navAuth = document.getElementById('nav-auth');
  const navUser = document.getElementById('nav-user');

  if (currentUser) {
    navAuth.classList.add('hidden');
    navUser.classList.remove('hidden');
    document.getElementById('nav-username').textContent = currentUser.name;
    document.getElementById('nav-points').textContent = currentUser.reward_points || 0;
  } else {
    navAuth.classList.remove('hidden');
    navUser.classList.add('hidden');
  }
}

function navigate(page) {
  if ((page === 'dashboard' || page === 'submit') && !api.getToken()) {
    showToast('Please login to continue.', 'warning');
    showAuthModal('login');
    return;
  }

  if (page === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
    showToast('Admin access required.', 'warning');
    return;
  }

  currentPage = page;
  document.querySelectorAll('.page').forEach((el) => el.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');

  document.querySelectorAll('.nav-link').forEach((el) => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  document.getElementById('nav-menu').classList.remove('show');

  if (page === 'dashboard') loadUserDashboard();
  if (page === 'admin') loadAdminComplaints();
}

async function loadPublicData() {
  try {
    const [allResult, insightResult] = await Promise.all([
      api.request('/complaints/all?limit=6'),
      api.request('/complaints/insights')
    ]);

    publicComplaints = allResult.complaints || [];
    renderPublicComplaints();

    const insights = insightResult.insights;
    if (!insights) return;

    document.getElementById('stat-total').textContent = insights.total || 0;
    document.getElementById('stat-resolved').textContent = insights.resolved || 0;
    document.getElementById('qs-total').textContent = insights.total || 0;
    document.getElementById('qs-resolved').textContent = insights.resolved || 0;
    document.getElementById('qs-rate').textContent = `${insights.resolutionRate || 0}%`;
    document.getElementById('qs-urgent').textContent = insights.highPriority || 0;

    renderPublicCharts(insights);
  } catch (error) {
    console.error(error);
  }
}

function renderPublicComplaints() {
  const container = document.getElementById('public-complaints');
  if (!publicComplaints.length) {
    container.innerHTML = '<p class="empty-state-inline">No public complaints available yet.</p>';
    return;
  }

  container.innerHTML = publicComplaints.map((c) => complaintCardTemplate(c, true)).join('');
}

function complaintCardTemplate(c, isPublic = false) {
  const progress = getProgressByStatus(c.status);
  const canFeedback = !isPublic && c.status === 'Resolved' && !c.feedback?.submitted_at;

  return `
    <article class="complaint-card priority-${c.priority_level}">
      <div class="complaint-card-header">
        <span class="complaint-priority">${getPriorityLabel(c.priority_level)}</span>
        <span class="complaint-status">${c.status}</span>
      </div>
      <p class="complaint-text">${c.complaint_text}</p>
      <div class="complaint-meta">
        <span><i class="fas fa-building"></i> ${c.department}</span>
        <span><i class="fas fa-location-dot"></i> ${c.location}</span>
        <span><i class="fas fa-calendar"></i> ${formatDate(c.created_at)}</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-label">Progress ${progress}%</div>
        <div class="progress-bar"><span style="width:${progress}%"></span></div>
      </div>
      ${c.ai_suggestion ? `<div class="ai-suggestion-card"><i class="fas fa-lightbulb"></i> ${c.ai_suggestion}</div>` : ''}
      <div class="complaint-actions">
        <button class="btn btn-sm" onclick="upvoteComplaint('${c._id}')"><i class="fas fa-thumbs-up"></i> ${c.upvotes || 0}</button>
        ${canFeedback ? `<button class="btn btn-sm btn-outline" onclick="submitFeedback('${c._id}')"><i class="fas fa-star"></i> Give Feedback</button>` : ''}
      </div>
    </article>
  `;
}

async function upvoteComplaint(complaintId) {
  if (!api.getToken()) {
    showToast('Please login to upvote complaints.', 'warning');
    return;
  }

  try {
    const result = await api.request('/complaints/upvote', {
      method: 'POST',
      body: JSON.stringify({ complaint_id: complaintId })
    });

    showToast(`Upvote added. +${result.points_earned || 2} points`, 'success');
    await loadInitialData();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function submitFeedback(complaintId) {
  const ratingRaw = prompt('Rate resolution from 1 to 5');
  if (!ratingRaw) return;
  const rating = Number(ratingRaw);
  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    showToast('Please enter a valid rating between 1 and 5.', 'warning');
    return;
  }

  const comment = prompt('Optional feedback comment') || '';

  try {
    await api.request('/complaints/feedback', {
      method: 'POST',
      body: JSON.stringify({ complaint_id: complaintId, rating, comment })
    });
    showToast('Feedback submitted. Thank you!', 'success');
    await loadUserDashboard();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  selectedFile = file;

  const preview = document.getElementById('file-preview');
  const img = document.getElementById('file-preview-img');
  preview.classList.remove('hidden');

  if (file.type.startsWith('image/')) {
    img.src = URL.createObjectURL(file);
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
}

function removeFile() {
  selectedFile = null;
  document.getElementById('complaint-file').value = '';
  document.getElementById('file-preview').classList.add('hidden');
}

function setupAIPreview() {
  const input = document.getElementById('complaint-text');
  if (!input) return;

  input.addEventListener('input', () => {
    const text = input.value.trim();
    const deptEl = document.getElementById('ai-preview-dept');
    const priEl = document.getElementById('ai-preview-priority');

    if (!text) {
      deptEl.textContent = 'Start typing to see AI department detection...';
      priEl.textContent = '';
      return;
    }

    const rule = deptPreviewRules.find((r) => r.test.test(text));
    const department = rule ? rule.department : 'General Department';

    let priority = '🟡 Medium';
    if (/(urgent|danger|hazard|emergency|critical)/i.test(text)) priority = '🔴 High';
    if (/(resolved|closed|minor|not urgent)/i.test(text)) priority = '🟢 Resolved/Low';

    deptEl.textContent = `Department: ${department}`;
    priEl.textContent = `Priority: ${priority}`;
  });
}

async function handleComplaintSubmit(event) {
  event.preventDefault();

  if (!api.getToken()) {
    showToast('Please login before submitting complaints.', 'warning');
    showAuthModal('login');
    return;
  }

  try {
    setLoading(true);

    let uploaded_image_url = '';
    if (selectedFile) {
      const upload = await api.uploadFile(selectedFile);
      uploaded_image_url = upload.url;
    }

    const payload = {
      complaint_text: document.getElementById('complaint-text').value.trim(),
      location: document.getElementById('complaint-location').value.trim(),
      language: document.getElementById('complaint-language').value,
      uploaded_image_url
    };

    const result = await api.request('/complaints/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    showToast(result.message || 'Complaint submitted!', 'success');

    const analysis = result.ai_analysis || {};
    document.getElementById('result-department').textContent = analysis.department || '-';
    document.getElementById('result-priority').textContent = getPriorityLabel(analysis.priority || 'yellow');
    document.getElementById('result-suggestion').textContent = analysis.suggestion || '-';
    document.getElementById('result-points').textContent = `+${result.points_earned || 10} 🎉`;
    document.getElementById('ai-result-panel').classList.remove('hidden');

    document.getElementById('complaint-form').reset();
    removeFile();
    await loadInitialData();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    setLoading(false);
  }
}

function resetSubmitForm() {
  document.getElementById('ai-result-panel').classList.add('hidden');
  document.getElementById('complaint-form').reset();
  removeFile();
}

async function loadUserDashboard() {
  if (!api.getToken()) return;

  try {
    const profileResult = await getProfile();
    currentUser = profileResult.user;
    api.setUser(currentUser);
    updateAuthUI();

    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-points').textContent = currentUser.reward_points || 0;

    const badgesEl = document.getElementById('profile-badges');
    badgesEl.innerHTML = (currentUser.badges || []).map((b) => `<span class="badge-pill">${b.icon} ${b.name}</span>`).join('');

    const complaintsResult = await api.request(`/complaints/user/${currentUser._id || currentUser.id}`);
    userComplaints = complaintsResult.complaints || [];

    document.getElementById('profile-complaints').textContent = userComplaints.length;
    renderUserComplaints(userComplaints);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function renderUserComplaints(list) {
  const container = document.getElementById('dashboard-complaints');
  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <h3>No complaints yet</h3>
        <p>Submit your first complaint to begin tracking.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((c) => complaintCardTemplate(c)).join('');
}

function filterComplaints() {
  const department = document.getElementById('filter-department').value;
  const priority = document.getElementById('filter-priority').value;
  const status = document.getElementById('filter-status').value;

  const filtered = userComplaints.filter((c) => {
    return (!department || c.department === department)
      && (!priority || c.priority_level === priority)
      && (!status || c.status === status);
  });

  renderUserComplaints(filtered);
}

async function showNotifications() {
  if (!api.getToken() || !currentUser) return;
  try {
    const result = await api.request(`/complaints/notifications/${currentUser._id || currentUser.id}`);
    const list = result.notifications || [];

    const panel = document.getElementById('notification-panel');
    const container = document.getElementById('notification-list');

    if (!list.length) {
      container.innerHTML = '<p class="notification-empty">No notifications yet</p>';
    } else {
      container.innerHTML = list.map((n) => `
        <div class="notification-item">
          <i class="fas fa-bell"></i>
          <div>
            <p>${n.message}</p>
            <small>${formatDate(n.created_at)}</small>
          </div>
        </div>
      `).join('');
    }

    panel.classList.remove('hidden');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function closeNotifications() {
  document.getElementById('notification-panel').classList.add('hidden');
}

async function loadAdminComplaints() {
  if (!api.getToken() || !currentUser || currentUser.role !== 'admin') return;

  try {
    const params = new URLSearchParams();
    const department = document.getElementById('admin-filter-department')?.value;
    const priority = document.getElementById('admin-filter-priority')?.value;
    const status = document.getElementById('admin-filter-status')?.value;

    if (department) params.append('department', department);
    if (priority) params.append('priority', priority);
    if (status) params.append('status', status);

    const result = await api.request(`/admin/complaints?${params.toString()}`);
    adminComplaints = result.complaints || [];

    renderAdminStats(adminComplaints);
    renderAdminTable(adminComplaints);
    renderAdminCharts(adminComplaints);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function renderAdminStats(list) {
  document.getElementById('admin-total').textContent = list.length;
  document.getElementById('admin-pending').textContent = list.filter((c) => c.status === 'Pending').length;
  document.getElementById('admin-progress').textContent = list.filter((c) => c.status === 'In Progress').length;
  document.getElementById('admin-resolved').textContent = list.filter((c) => c.status === 'Resolved').length;
}

function renderAdminTable(list) {
  const body = document.getElementById('admin-table-body');
  if (!list.length) {
    body.innerHTML = '<tr><td colspan="8" class="empty-cell">No complaints found.</td></tr>';
    return;
  }

  body.innerHTML = list.map((c) => `
    <tr>
      <td><span class="priority-dot ${c.priority_level}"></span></td>
      <td>${c.complaint_text.slice(0, 80)}${c.complaint_text.length > 80 ? '...' : ''}</td>
      <td>${c.department}</td>
      <td>${c.location}</td>
      <td><span class="status-badge status-${c.status.toLowerCase().replace(/\s+/g, '-')}">${c.status}</span></td>
      <td>👍 ${c.upvotes || 0}</td>
      <td>${formatDate(c.created_at)}</td>
      <td>
        <button class="btn btn-sm" onclick="openStatusModal('${c._id}', '${c.status}', '${(c.assigned_staff || '').replace(/'/g, '&apos;')}')">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function openStatusModal(id, status, staff = '') {
  document.getElementById('status-complaint-id').value = id;
  document.getElementById('status-select').value = status;
  document.getElementById('status-staff').value = staff;
  document.getElementById('status-modal').classList.remove('hidden');
}

function closeStatusModal() {
  document.getElementById('status-modal').classList.add('hidden');
}

async function updateComplaintStatus() {
  const complaint_id = document.getElementById('status-complaint-id').value;
  const status = document.getElementById('status-select').value;
  const assigned_staff = document.getElementById('status-staff').value.trim();

  try {
    await api.request('/admin/update-status', {
      method: 'PUT',
      body: JSON.stringify({ complaint_id, status, assigned_staff })
    });

    closeStatusModal();
    showToast('Complaint status updated.', 'success');
    await loadAdminComplaints();
    await loadPublicData();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function loadInitialData() {
  await loadPublicData();

  if (api.getToken()) {
    if (currentUser?.role === 'admin') {
      await loadAdminComplaints();
    } else {
      await loadUserDashboard();
    }
  }
}

function startAutoRefresh() {
  clearInterval(refreshTimer);
  refreshTimer = setInterval(async () => {
    if (currentPage === 'home') await loadPublicData();
    if (currentPage === 'dashboard' && api.getToken() && currentUser?.role !== 'admin') await loadUserDashboard();
    if (currentPage === 'admin' && api.getToken() && currentUser?.role === 'admin') await loadAdminComplaints();
  }, 30000);
}

window.addEventListener('click', (event) => {
  const authModal = document.getElementById('auth-modal');
  const statusModal = document.getElementById('status-modal');

  if (event.target === authModal) closeAuthModal();
  if (event.target === statusModal) closeStatusModal();
});

document.addEventListener('DOMContentLoaded', async () => {
  updateAuthUI();
  setupAIPreview();
  await loadInitialData();
  startAutoRefresh();
});
