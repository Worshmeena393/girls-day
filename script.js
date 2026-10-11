const config = {
  recipientName: 'Beautiful Soul',
  senderName: 'Your Cheerleader',
  mainTitle: "Happy Girls' Day",
  primaryMessage: 'Some people make the world beautiful. Some people make life meaningful. And some people do both.',
  enableMusic: true,
  enableParticles: true,
  enableTerminal: true,
};

const state = {
  musicOn: false,
  theme: localStorage.getItem('girls-day-theme') || 'midnight',
  hiddenUnlocked: false,
  secretKeys: [],
};

const bootLines = [
  'Initializing GirlsDay.exe...',
  'Loading happiness............. 100%',
  'Loading beautiful memories.... 100%',
  'Installing confidence......... DONE',
  'Removing sadness.............. DONE',
  'Generating smiles............. DONE',
  'Compiling dreams.............. SUCCESS',
  'BUILD SUCCESSFUL ✓',
  'Launching surprise...',
];

const terminalResponses = {
  help: [
    'Available commands:',
    'help',
    'whoami',
    'dreams',
    'future',
    'smile',
    'surprise',
    'clear',
  ].join('\n'),
  whoami: 'girl@future:~$ You are magic.',
  dreams: 'Status: Unlimited\nProgress: ∞\nPermission: Never give up',
  future: 'Compiling...\nResult: Beautiful ✨\nStatus: Success',
  smile: 'Executing smile()...\nSuccess 💖',
  surprise: 'Unlocking secret message...\nAccess granted ✨',
  clear: 'clear',
};

function setTheme(theme) {
  document.body.classList.toggle('theme-rose', theme === 'rose');
  document.body.classList.toggle('theme-midnight', theme === 'midnight');
  localStorage.setItem('girls-day-theme', theme);
  state.theme = theme;

  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    themeToggle.textContent = `Theme: ${theme === 'rose' ? 'Rose' : 'Midnight'}`;
  }
}

function updateMusicButtonText() {
  const button = document.querySelector('[data-music-toggle]');
  if (!button) return;
  button.textContent = `♫ Music: ${state.musicOn ? 'ON' : 'OFF'}`;
}

function renderBootSequence() {
  const list = document.querySelector('.boot-lines');
  if (!list) return;

  list.innerHTML = '';
  bootLines.forEach((line, index) => {
    const item = document.createElement('li');
    item.className = 'boot-line';
    item.innerHTML = `<span class="status-dot"></span><span>${line}</span>`;
    list.appendChild(item);

    setTimeout(() => item.classList.add('visible'), index * 420 + 260);
  });
}

function revealMessage() {
  const card = document.querySelector('.message-stage');
  if (!card) return;
  card.classList.add('visible');
  document.getElementById('message').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createParticles(x, y) {
  if (!config.enableParticles) return;

  const container = document.querySelector('.particles');
  if (!container) return;

  const icons = ['🌷', '✨', '💖', '🌸', '⭐'];
  const count = 16;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = `${10 + Math.random() * 18}px`;
    el.style.setProperty('--dx', `${(Math.random() - 0.5) * 220}px`);
    el.style.setProperty('--dy', `${-30 - Math.random() * 180}px`);
    container.appendChild(el);

    setTimeout(() => el.remove(), 2800);
  }
}

function bindParticleButtons() {
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      createParticles(x, y);
    });
  });
}

function bootTerminalOutput(command) {
  const output = document.querySelector('.terminal-output');
  if (!output) return;

  const prompt = 'girl@future:~$ ';
  const response = terminalResponses[command] || `Command not found: ${command}\nTry: help`;
  const current = output.innerHTML;
  output.innerHTML = current + `<div><span class="prompt">${prompt}</span>${command}</div><div class="output">${response.replace(/\n/g, '<br>')}</div>`;
  output.scrollTop = output.scrollHeight;
}

function setMessageReveal() {
  const envelope = document.querySelector('.envelope');
  const reveal = document.querySelector('.message-reveal');
  if (!envelope || !reveal) return;

  envelope.classList.add('open');
  reveal.classList.add('visible');
}

function revealSecretMessage() {
  const overlay = document.querySelector('.hidden-message');
  if (!overlay) return;

  overlay.classList.add('visible');
  state.hiddenUnlocked = true;
  console.log('You are awesome!');
}

function compileDream() {
  const input = document.querySelector('#dream-input');
  const output = document.querySelector('.compiler-output');
  if (!input || !output) return;

  const dream = input.value.trim() || 'Dream bigger';
  output.innerHTML = [
    'Scanning dream...',
    'Checking possibilities...',
    'Removing self-doubt...',
    'Installing courage...',
    'Building future...',
    '',
    'Compilation Successful ✓',
    '',
    `Output: ${dream}`,
    'Your dream is possible. Keep building it.'
  ].join('<br>');
}

function setupRevealObserver() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.18 });

  items.forEach((item) => observer.observe(item));
}

function setupThemeControls() {
  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const nextTheme = state.theme === 'midnight' ? 'rose' : 'midnight';
    setTheme(nextTheme);
  });

  setTheme(state.theme);
}

function setupMusicToggle() {
  const button = document.querySelector('[data-music-toggle]');
  if (!button) return;

  updateMusicButtonText();
  button.addEventListener('click', () => {
    state.musicOn = !state.musicOn;
    updateMusicButtonText();
  });
}

function setupTerminalCommands() {
  const buttons = document.querySelectorAll('[data-command]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const command = button.dataset.command;
      if (command === 'clear') {
        document.querySelector('.terminal-output').innerHTML = '';
        return;
      }
      bootTerminalOutput(command);
    });
  });
}

function setupEventBindings() {
  const runSurprise = document.querySelector('#run-surprise');
  const runCode = document.querySelector('#run-code');
  const envelopeButton = document.querySelector('#open-message');
  const compileButton = document.querySelector('#compile-dream');
  const secretTrigger = document.querySelector('.secret-trigger');
  const hiddenWindow = document.querySelector('.hidden-message');
  const replayBoot = document.querySelector('#replay-boot');
  const scrollStory = document.querySelector('#scroll-story');

  runSurprise?.addEventListener('click', () => {
    document.getElementById('boot-sequence').scrollIntoView({ behavior: 'smooth', block: 'start' });
    renderBootSequence();
  });

  replayBoot?.addEventListener('click', () => {
    renderBootSequence();
    document.getElementById('boot-sequence').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  scrollStory?.addEventListener('click', () => {
    document.getElementById('message').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  runCode?.addEventListener('click', () => {
    revealMessage();
  });

  envelopeButton?.addEventListener('click', () => {
    setMessageReveal();
  });

  compileButton?.addEventListener('click', compileDream);

  secretTrigger?.addEventListener('click', () => {
    revealSecretMessage();
  });

  hiddenWindow?.addEventListener('click', (event) => {
    if (event.target === hiddenWindow) {
      hiddenWindow.classList.remove('visible');
    }
  });
}

function handleKeyboardSecrets(event) {
  const secretCombo = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
  state.secretKeys.push(event.key);

  if (state.secretKeys.length > secretCombo.length) {
    state.secretKeys.shift();
  }

  const current = state.secretKeys.slice(-secretCombo.length);

  if (current.join(',') === secretCombo.join(',')) {
    revealSecretMessage();
    state.secretKeys = [];
  }
}

function init() {
  setupThemeControls();
  setupMusicToggle();
  setupTerminalCommands();
  setupEventBindings();
  setupRevealObserver();
  bindParticleButtons();
  renderBootSequence();
  setMessageReveal();

  window.addEventListener('keydown', handleKeyboardSecrets);
}

window.addEventListener('DOMContentLoaded', init);
