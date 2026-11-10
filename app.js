const checks = [...document.querySelectorAll('[data-check]')];
const scoreValue = document.getElementById('score-value');
const meterRing = document.getElementById('meter-ring');
const completionTag = document.getElementById('completion-tag');
const navCount = document.getElementById('nav-count');

function updateChecklist() {
  const completed = checks.filter((check) => check.checked).length;
  const score = Math.round((completed / checks.length) * 100);
  scoreValue.textContent = String(score);
  meterRing.style.setProperty('--score', `${score * 3.6}deg`);
  completionTag.textContent = `${completed} of ${checks.length} done`;
  navCount.textContent = `${completed}/${checks.length}`;
  checks.forEach((check) => check.closest('.check-item').classList.toggle('is-complete', check.checked));
}

checks.forEach((check) => check.addEventListener('change', updateChecklist));

function updateAlertCount() {
  const remaining = document.querySelectorAll('.alert-item:not([hidden])').length;
  document.getElementById('alert-count').textContent = String(remaining);
}

document.querySelectorAll('[data-dismiss]').forEach((button) => {
  button.addEventListener('click', () => {
    const alert = document.getElementById(button.dataset.dismiss);
    if (alert) alert.hidden = true;
    updateAlertCount();
  });
});

const modal = document.getElementById('help-modal');
const closeButton = document.querySelector('[data-close-help]');
let lastFocusedElement;

document.querySelectorAll('[data-open-help]').forEach((button) => {
  button.addEventListener('click', () => {
    lastFocusedElement = button;
    modal.hidden = false;
    closeButton.focus();
  });
});

function closeModal() {
  modal.hidden = true;
  if (lastFocusedElement) lastFocusedElement.focus();
}

closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

const today = new Date();
document.getElementById('today-label').textContent = new Intl.DateTimeFormat(undefined, {
  weekday: 'short', month: 'short', day: 'numeric',
}).format(today);
updateChecklist();

if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // The dashboard remains usable if offline setup is unavailable.
    });
  });
}
