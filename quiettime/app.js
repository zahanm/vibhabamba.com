const DURATION_MS = 30 * 60 * 1000;
const fluid = document.getElementById('fluid');
const shine = document.getElementById('shine');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

let startTime = null;
let elapsedBeforePause = 0;
let running = false;
let raf = null;

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function fluidPath(progress, t) {
  // progress: 1 full, 0 empty. Shape wanes from right to left, with a soft drifting edge.
  const left = 24;
  const right = 276;
  const top = 24;
  const bottom = 276;
  const width = right - left;
  const xEdge = left + width * progress;

  if (progress <= 0.004) return '';
  if (progress >= 0.995) {
    return `M150,24 C220,24 276,80 276,150 C276,220 220,276 150,276 C80,276 24,220 24,150 C24,80 80,24 150,24 Z`;
  }

  const amp = 7 + 4 * Math.sin(t * 0.00045);
  const phase = t * 0.0011;
  const y1 = 38;
  const y2 = 262;

  // Wavy right boundary: rounded ferrofluid drift, intentionally slow and soft.
  const points = [];
  const steps = 9;
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const y = y1 + (y2 - y1) * p;
    const wave = Math.sin(p * Math.PI * 5 + phase) * amp + Math.sin(p * Math.PI * 2.5 - phase * .7) * amp * .5;
    const curveBias = Math.sin((p - .5) * Math.PI) * 16;
    points.push([xEdge + wave + curveBias, y]);
  }

  let d = `M ${left},${top}`;
  d += ` C ${left},${top} ${xEdge},${top - 6} ${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i];
    const [px, py] = points[i - 1];
    const cx = (px + x) / 2;
    const cy = (py + y) / 2;
    d += ` Q ${px},${py} ${cx},${cy}`;
  }
  d += ` C ${xEdge},${bottom + 5} ${left},${bottom} ${left},${bottom}`;
  d += ` C ${8},${220} ${8},${80} ${left},${top} Z`;
  return d;
}

function currentProgress(now) {
  const elapsed = running ? elapsedBeforePause + (now - startTime) : elapsedBeforePause;
  return clamp(1 - elapsed / DURATION_MS, 0, 1);
}

function draw(now = performance.now()) {
  const progress = currentProgress(now);
  fluid.setAttribute('d', fluidPath(progress, now));
  shine.setAttribute('opacity', progress > .05 ? .55 : 0);
  shine.setAttribute('cx', 70 + 90 * progress + Math.sin(now * 0.0008) * 3);
  shine.setAttribute('cy', 68 + Math.cos(now * 0.0007) * 4);

  document.body.classList.toggle('finished', progress <= 0);
  startBtn.textContent = running ? 'Pause' : progress < 1 && progress > 0 ? 'Continue' : 'Start quiet time';

  raf = requestAnimationFrame(draw);
}

startBtn.addEventListener('click', () => {
  const now = performance.now();
  if (running) {
    elapsedBeforePause += now - startTime;
    running = false;
  } else {
    if (elapsedBeforePause >= DURATION_MS) elapsedBeforePause = 0;
    startTime = now;
    running = true;
  }
});

resetBtn.addEventListener('click', () => {
  running = false;
  elapsedBeforePause = 0;
  startTime = null;
});

// Tap the clock to start/pause, useful for a phone home-screen app.
document.querySelector('.clock').addEventListener('click', () => startBtn.click());

draw();
