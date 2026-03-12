function showAuthModal(mode = 'login') {
  const modal = document.getElementById('auth-modal');
  modal.classList.remove('hidden');
  switchAuthTab(mode);
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function switchAuthTab(mode) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  const isLogin = mode === 'login';
  loginForm.classList.toggle('hidden', !isLogin);
  registerForm.classList.toggle('hidden', isLogin);
  tabLogin.classList.toggle('active', isLogin);
  tabRegister.classList.toggle('active', !isLogin);
}

function fillDemo(type) {
  if (type === 'admin') {
    document.getElementById('login-email').value = 'admin@grievance.gov';
    document.getElementById('login-password').value = 'password123';
    return;
  }

  document.getElementById('login-email').value = 'rahul@example.com';
  document.getElementById('login-password').value = 'password123';
}

async function handleLogin(event) {
  event.preventDefault();
  try {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const result = await api.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    api.setToken(result.token);
    api.setUser(result.user);

    closeAuthModal();
    updateAuthUI();
    showToast('Login successful!', 'success');
    navigate(result.user.role === 'admin' ? 'admin' : 'dashboard');
    await loadInitialData();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  try {
    const payload = {
      name: document.getElementById('register-name').value.trim(),
      email: document.getElementById('register-email').value.trim(),
      phone: document.getElementById('register-phone').value.trim(),
      password: document.getElementById('register-password').value,
      role: 'citizen'
    };

    const result = await api.request('/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    api.setToken(result.token);
    api.setUser(result.user);

    closeAuthModal();
    updateAuthUI();
    showToast('Registration successful! Welcome aboard.', 'success');
    navigate('dashboard');
    await loadInitialData();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function logout() {
  api.clearToken();
  api.clearUser();
  updateAuthUI();
  showToast('Logged out successfully.', 'info');
  navigate('home');
}

async function getProfile() {
  return api.request('/user/profile');
}
