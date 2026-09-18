const icons = () => window.lucide && lucide.createIcons();

const supabaseConfig = window.VELO_SUPABASE_CONFIG || { url: '', anonKey: '' };
const supabaseClient = window.supabase && supabaseConfig.url && supabaseConfig.anonKey
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

function setView(view) {
  document.querySelectorAll('.content-view').forEach((panel) => {
    panel.classList.toggle('active-view', panel.dataset.panel === view);
  });
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.view === view);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  icons();
}

document.querySelectorAll('[data-view]').forEach((item) => {
  item.addEventListener('click', () => setView(item.dataset.view));
});

const authModal = document.querySelector('#authModal');
const authForm = document.querySelector('#authForm');
const authName = document.querySelector('#authName');
const authEmail = document.querySelector('#authEmail');
const authPassword = document.querySelector('#authPassword');
const authTitle = document.querySelector('#authTitle');
const authCopy = document.querySelector('#authCopy');
const authMessage = document.querySelector('#authMessage');
const authSubmit = document.querySelector('#authSubmit');
const nameField = document.querySelector('#nameField');
const authSwitch = document.querySelector('#authSwitch');
let authMode = 'signup';

function openAuth(mode = 'signup') {
  authMode = mode;
  const isSignup = mode === 'signup';
  authTitle.textContent = isSignup ? 'Create your account.' : 'Welcome back.';
  authCopy.textContent = isSignup ? 'Use your email to reserve scooters, start rides, and keep your trip history together.' : 'Log in with your Velo email to continue your ride.';
  authSubmit.innerHTML = isSignup ? 'Create account <i data-lucide="arrow-up-right"></i>' : 'Log in <i data-lucide="arrow-right"></i>';
  authSwitch.textContent = isSignup ? 'Already have an account? Log in' : 'Need an account? Sign up';
  nameField.hidden = !isSignup;
  authMessage.textContent = '';
  authForm.reset();
  authModal.classList.add('open');
  authModal.setAttribute('aria-hidden', 'false');
  icons();
}

function closeAuth() { authModal.classList.remove('open'); authModal.setAttribute('aria-hidden', 'true'); }
document.querySelector('#signupButton').addEventListener('click', () => openAuth('signup'));
document.querySelector('#loginButton').addEventListener('click', () => openAuth('login'));
document.querySelector('#authClose').addEventListener('click', closeAuth);
authModal.addEventListener('click', (event) => { if (event.target === authModal) closeAuth(); });
authSwitch.addEventListener('click', () => openAuth(authMode === 'signup' ? 'login' : 'signup'));

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  authMessage.className = 'auth-message';
  if (!supabaseClient) {
    authMessage.textContent = 'Supabase is not configured yet. Add your project URL and anon key to activate accounts.';
    authMessage.classList.add('error');
    return;
  }
  authSubmit.disabled = true;
  authSubmit.textContent = authMode === 'signup' ? 'Creating account...' : 'Logging in...';
  const result = authMode === 'signup'
    ? await supabaseClient.auth.signUp({ email: authEmail.value, password: authPassword.value, options: { data: { full_name: authName.value }, emailRedirectTo: window.location.origin } })
    : await supabaseClient.auth.signInWithPassword({ email: authEmail.value, password: authPassword.value });
  authSubmit.disabled = false;
  authSubmit.innerHTML = authMode === 'signup' ? 'Create account <i data-lucide="arrow-up-right"></i>' : 'Log in <i data-lucide="arrow-right"></i>';
  if (result.error) {
    authMessage.textContent = result.error.message === 'Failed to fetch'
      ? 'Supabase could not be reached. Check that your Project URL is copied exactly from Project Settings > API.'
      : result.error.message;
    authMessage.classList.add('error');
  } else {
    authMessage.textContent = authMode === 'signup' ? 'Account created. Check your email to verify your Velo account.' : 'You are logged in.';
    authMessage.classList.add('success');
    if (authMode === 'login') setTimeout(closeAuth, 800);
  }
  icons();
});

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    document.querySelector('#loginButton').textContent = session ? 'Log out' : 'Log in';
    document.querySelector('#signupButton').hidden = Boolean(session);
    if (session) document.querySelector('#loginButton').onclick = async () => { await supabaseClient.auth.signOut(); };
    else document.querySelector('#loginButton').onclick = () => openAuth('login');
  });
}

document.querySelector('[data-scroll-map]')?.addEventListener('click', () => {
  document.querySelector('#fleet-demo')?.scrollIntoView({ behavior: 'smooth' });
});

const scooters = {
  'V-104': { battery: 82, range: '16.4 mi', distance: '0.2 mi', location: 'Student Center' },
  'V-118': { battery: 74, range: '14.8 mi', distance: '0.4 mi', location: 'Rowan Boulevard' }
};
let selectedScooter = 'V-104';

function selectScooter(id) {
  const scooter = scooters[id];
  if (!scooter) return;
  selectedScooter = id;
  document.querySelectorAll('.scooter-option').forEach((option) => {
    option.classList.toggle('selected', option.dataset.scooter === id);
  });
  document.querySelector('.scooter-id').textContent = id;
  document.querySelector('.battery-label').innerHTML = `${scooter.battery}% <i data-lucide="battery-medium"></i>`;
  document.querySelector('.ride-info').innerHTML = `<div><span>Distance</span><strong>${scooter.distance}</strong></div><div><span>Est. range</span><strong>${scooter.range}</strong></div><div><span>Unlock</span><strong>Free</strong></div>`;
  document.querySelector('.ride-note').innerHTML = `<i data-lucide="map-pin"></i> ${scooter.location} · Scan the handlebar QR code`;
  icons();
}

document.querySelectorAll('.scooter-option').forEach((option) => {
  option.addEventListener('click', () => selectScooter(option.dataset.scooter));
});

const rideAction = document.querySelector('#rideAction');
let rideStarted = false;
rideAction.addEventListener('click', () => {
  rideStarted = !rideStarted;
  rideAction.innerHTML = rideStarted
    ? '<i data-lucide="lock"></i><span>End & lock ride</span>'
    : '<i data-lucide="lock-open"></i><span>Unlock scooter</span>';
  const battery = scooters[selectedScooter].battery;
  document.querySelector('.card-kicker').innerHTML = rideStarted
    ? `<span class="status-dot"></span> Ride in progress <span class="battery-label">${battery}% <i data-lucide="battery-medium"></i></span>`
    : `<span class="status-dot"></span> Ready to ride <span class="battery-label">${battery}% <i data-lucide="battery-medium"></i></span>`;
  icons();
});

const modal = document.querySelector('#supportModal');
const modalTitle = document.querySelector('#modalTitle');
const modalCopy = document.querySelector('#modalCopy');
const supportContent = {
  unlock: ['Scooter won’t lock or unlock', 'We can help troubleshoot the lock, Bluetooth, and GPS. Tell us what you see and we will take it from here.'],
  incident: ['Report a safety issue', 'For a crash, injury, fire, damage, or a hazard, share the details below. In an emergency, call 911 first.'],
  payment: ['Payment or refund request', 'Tell us about the charge you are questioning. Our team will review your ride and follow up by email.']
};
document.querySelectorAll('[data-open-support]').forEach((item) => {
  item.addEventListener('click', () => {
    const [title, copy] = supportContent[item.dataset.openSupport];
    modalTitle.textContent = title;
    modalCopy.textContent = copy;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

document.querySelector('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
document.querySelector('#sendSupport').addEventListener('click', () => {
  document.querySelector('#modalCopy').textContent = 'Thanks. Your request is in the queue. We will reply to jordan@email.com shortly.';
  document.querySelector('#sendSupport').innerHTML = 'Request sent <i data-lucide="check"></i>';
  icons();
});
icons();
