const icons = () => window.lucide && lucide.createIcons();

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

document.querySelector('[data-scroll-map]')?.addEventListener('click', () => {
  document.querySelector('#fleet-demo')?.scrollIntoView({ behavior: 'smooth' });
});

const rideAction = document.querySelector('#rideAction');
let rideStarted = false;
rideAction.addEventListener('click', () => {
  rideStarted = !rideStarted;
  rideAction.innerHTML = rideStarted
    ? '<i data-lucide="lock"></i><span>End & lock ride</span>'
    : '<i data-lucide="lock-open"></i><span>Unlock scooter</span>';
  document.querySelector('.card-kicker').innerHTML = rideStarted
    ? '<span class="status-dot"></span> Ride in progress <span class="battery-label">82% <i data-lucide="battery-medium"></i></span>'
    : '<span class="status-dot"></span> Ready to ride <span class="battery-label">82% <i data-lucide="battery-medium"></i></span>';
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
