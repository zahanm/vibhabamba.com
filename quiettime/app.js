let DURATION_MS = 30 * 60 * 1000;

const DURATIONS = [
  { label: '30 sec', ms: 30 * 1000 },
  { label: '1 min', ms: 60 * 1000 },
  { label: '5 min', ms: 5 * 60 * 1000 },
  { label: '30 min', ms: 30 * 60 * 1000 },
];

const fluid = document.getElementById('fluid');
const shine = document.getElementById('shine');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const clock = document.querySelector('.clock');

let startTime = null;
let elapsedBeforePause = 0;
let running = false;
let raf = null;
let devMenu = null;
let pressTimer = null;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function fluidPath(progress, t) {
  const cx = 150;
  const cy = 150;
  const baseR = 126;

  if (progress <= 0.004) return '';

  const breathe = 1 + Math.sin(t * 0.00035) * 0.012;
  const phase = t * 0.00045;

  // Full moon: no outer gray stroke needed; just a living black shape.
  if (progress >= 0.985) {
    let d = '';
    const steps = 64;

    for (let i = 0; i <= steps; i++) {
      const a = (Math.PI * 2 * i) / steps;
      const drift =
        Math.sin(a * 3 + phase) * 2.8 +
        Math.sin(a * 5 - phase * 0.7) * 1.8 +
        Math.sin(a * 7 + phase * 0.35) * 1.2;

      const r = (baseR + drift) * breathe;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;

      d += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
    }

    return d + ' Z';
  }

  // Waning moon: right edge slowly eats into the black moon.
  const reveal = 1 - progress;
  const cutX = cx + baseR - reveal * baseR * 2.15;

  const points = [];
  const steps = 44;

  for (let i = 0; i <= steps; i++) {
    const a = Math.PI / 2 + (Math.PI * i) / steps;
    const drift =
      Math.sin(a * 3 + phase) * 3.2 +
      Math.sin(a * 6 - phase * 0.9) * 2.0 +
      Math.sin(a * 9 + phase * 0.4) * 1.1;

    const r = (baseR + drift) * breathe;
    points.push([
      cx + Math.cos(a) * r,
      cy + Math.sin(a) * r
    ]);
  }

  const topY = cy - baseR + 16;
  const bottomY = cy + baseR - 16;
  const edgePoints = [];
  const edgeSteps = 12;

  for (let i = 0; i <= edgeSteps; i++) {
    const p = i / edgeSteps;
    const y = topY + (bottomY - topY) * p;

    const softBulge =
      Math.sin(p * Math.PI) * 28 * progress +
      Math.sin(p * Math.PI * 5 + phase * 2.2) * 7 +
      Math.sin(p * Math.PI * 3 - phase * 1.4) * 5;

    edgePoints.push([
      cutX + softBulge,
      y
    ]);
  }

  let d = `M ${points[0][0]},${points[0][1]}`;

  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i][0]},${points[i][1]}`;
  }

  for (let i = edgePoints.length - 1; i >= 0; i--) {
    d += ` L ${edgePoints[i][0]},${edgePoints[i][1]}`;
  }

  return d + ' Z';
}

function currentElapsed(now) {
  return running ? elapsedBeforePause + (now - startTime) : elapsedBeforePause;
}

function currentProgress(now) {
  return clamp(1 - currentElapsed(now) / DURATION_MS, 0, 1);
}

function draw(now = performance.now()) {
  const progress = currentProgress(now);

  fluid.setAttribute('d', fluidPath(progress, now));

  // Minimal shine; set to 0 if you want pure matte black.
  shine.setAttribute('opacity', progress > .05 ? .18 : 0);
  shine.setAttribute('cx', 76 + 80 * progress + Math.sin(now * 0.00045) * 4);
  shine.setAttribute('cy', 70 + Math.cos(now * 0.0004) * 5);

  document.body.classList.toggle('finished', progress <= 0);

  startBtn.textContent =
    running ? 'Pause' :
    progress < 1 && progress > 0 ? 'Continue' :
    'Start quiet time';

  raf = requestAnimationFrame(draw);
}

function toggleTimer() {
  const now = performance.now();

  if (running) {
    elapsedBeforePause += now - startTime;
    running = false;
  } else {
    if (elapsedBeforePause >= DURATION_MS) elapsedBeforePause = 0;
    startTime = now;
    running = true;
  }
}

function resetTimer() {
  running = false;
  elapsedBeforePause = 0;
  startTime = null;
}

function setDuration(ms) {
  DURATION_MS = ms;
  resetTimer();
  updateDevMenu();
}

function createDevMenu() {
  devMenu = document.createElement('div');
  devMenu.style.position = 'fixed';
  devMenu.style.left = '50%';
  devMenu.style.bottom = '24px';
  devMenu.style.transform = 'translateX(-50%)';
  devMenu.style.background = 'rgba(255,255,255,.94)';
  devMenu.style.border = '1px solid rgba(0,0,0,.08)';
  devMenu.style.boxShadow = '0 18px 50px rgba(0,0,0,.12)';
  devMenu.style.borderRadius = '24px';
  devMenu.style.padding = '14px';
  devMenu.style.display = 'none';
  devMenu.style.gap = '8px';
  devMenu.style.zIndex = '999';
  devMenu.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';

  document.body.appendChild(devMenu);
  updateDevMenu();
}

function updateDevMenu() {
  if (!devMenu) return;

  devMenu.innerHTML = '';

  DURATIONS.forEach(duration => {
    const button = document.createElement('button');
    button.textContent = duration.label;
    button.style.border = '0';
    button.style.borderRadius = '999px';
    button.style.padding = '10px 14px';
    button.style.fontSize = '14px';
    button.style.background = duration.ms === DURATION_MS ? '#000' : '#f1f1f1';
    button.style.color = duration.ms === DURATION_MS ? '#fff' : '#111';

    button.addEventListener('click', event => {
      event.stopPropagation();
      setDuration(duration.ms);
    });

    devMenu.appendChild(button);
  });
}

function showDevMenu() {
  if (!devMenu) createDevMenu();
  devMenu.style.display = devMenu.style.display === 'none' ? 'flex' : 'none';
}

startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);

clock.addEventListener('click', () => startBtn.click());

clock.addEventListener('pointerdown', () => {
  pressTimer = setTimeout(showDevMenu, 3000);
});

clock.addEventListener('pointerup', () => {
  clearTimeout(pressTimer);
});

clock.addEventListener('pointerleave', () => {
  clearTimeout(pressTimer);
});

draw();
