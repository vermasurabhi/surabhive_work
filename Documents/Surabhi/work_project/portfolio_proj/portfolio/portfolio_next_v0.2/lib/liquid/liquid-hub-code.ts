import { LIQUID_FRAGMENT_SHADER, LIQUID_VERTEX_SHADER } from "./shaders";
import type { LiquidColorState } from "./liquid-gradient";

function escapeForTemplate(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

export function buildLiquidExportHtml(): string {
  return `<div id="liquid-gradient-root">
  <div id="webGLApp"></div>
  <p class="liquid-demo-hint">Move your cursor or finger to disturb the gradient.</p>
</div>`;
}

export function buildLiquidExportCss(state: LiquidColorState): string {
  const base = state.darkNavy.toLowerCase();
  return `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: ${base};
}

#liquid-gradient-root {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

#webGLApp {
  position: absolute;
  inset: 0;
}

#webGLApp canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.liquid-demo-hint {
  position: absolute;
  left: 50%;
  bottom: 2rem;
  transform: translateX(-50%);
  margin: 0;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(12, 11, 9, 0.12);
  color: rgba(12, 11, 9, 0.72);
  font: 500 0.75rem/1.4 system-ui, sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  pointer-events: none;
}`;
}

export function buildLiquidExportJs(state: LiquidColorState): string {
  const colors = state.colors.map((hex) => hex.toUpperCase());
  const darkNavy = state.darkNavy.toUpperCase();

  return `import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const SCHEME = {
  colors: ${JSON.stringify(colors)},
  baseColor: "${darkNavy}",
  darkNavy: "${darkNavy}",
};

const vertexShader = \`${escapeForTemplate(LIQUID_VERTEX_SHADER)}\`;

const fragmentShader = \`${escapeForTemplate(LIQUID_FRAGMENT_SHADER)}\`;

function hexToRgb(hex) {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : null;
}

class TouchTexture {
  constructor() {
    this.size = 64;
    this.width = this.height = this.size;
    this.maxAge = 64;
    this.radius = 0.25 * this.size;
    this.speed = 1 / this.maxAge;
    this.trail = [];
    this.last = null;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture = new THREE.Texture(this.canvas);
  }

  update() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      const f = point.force * this.speed * (1 - point.age / this.maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > this.maxAge) this.trail.splice(i, 1);
      else this.drawPoint(point);
    }
    this.texture.needsUpdate = true;
  }

  addTouch(point) {
    let force = 0;
    let vx = 0;
    let vy = 0;
    if (this.last) {
      const dx = point.x - this.last.x;
      const dy = point.y - this.last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / d;
      vy = dy / d;
      force = Math.min(dd * 20000, 2.0);
    }
    this.last = { x: point.x, y: point.y };
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }

  drawPoint(point) {
    const pos = { x: point.x * this.width, y: (1 - point.y) * this.height };
    let intensity = point.age < this.maxAge * 0.3
      ? Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2))
      : (() => {
          const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
          return -t * (t - 2);
        })();
    intensity *= point.force;
    const offset = this.size * 5;
    this.ctx.shadowOffsetX = offset;
    this.ctx.shadowOffsetY = offset;
    this.ctx.shadowBlur = this.radius;
    this.ctx.shadowColor = \`rgba(255,255,255,\${0.2 * intensity})\`;
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(pos.x - offset, pos.y - offset, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

const mount = document.getElementById("webGLApp");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
mount.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(SCHEME.baseColor);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
camera.position.z = 50;

const touchTexture = new TouchTexture();
const uniforms = {
  uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2(1, 1) },
  uColor1: { value: new THREE.Vector3() },
  uColor2: { value: new THREE.Vector3() },
  uColor3: { value: new THREE.Vector3() },
  uColor4: { value: new THREE.Vector3() },
  uColor5: { value: new THREE.Vector3() },
  uColor6: { value: new THREE.Vector3() },
  uSpeed: { value: 1.5 },
  uIntensity: { value: 1.35 },
  uTouchTexture: { value: touchTexture.texture },
  uGrainIntensity: { value: 0.05 },
  uDarkNavy: { value: new THREE.Vector3() },
  uGradientSize: { value: 0.45 },
  uGradientCount: { value: 12.0 },
  uColor1Weight: { value: 1.0 },
  uColor2Weight: { value: 1.0 },
};

SCHEME.colors.forEach((hex, index) => {
  const rgb = hexToRgb(hex);
  if (rgb) uniforms[\`uColor\${index + 1}\`].value.set(rgb.r, rgb.g, rgb.b);
});
const dark = hexToRgb(SCHEME.baseColor);
if (dark) uniforms.uDarkNavy.value.set(dark.r, dark.g, dark.b);

function viewSize() {
  const fov = (camera.fov * Math.PI) / 180;
  const height = Math.abs(camera.position.z * Math.tan(fov / 2) * 2);
  return { width: height * camera.aspect, height };
}

let mesh;
function resize() {
  const width = mount.clientWidth;
  const height = mount.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  uniforms.uResolution.value.set(width, height);
  const size = viewSize();
  if (mesh) mesh.geometry.dispose();
  mesh.geometry = new THREE.PlaneGeometry(size.width, size.height, 1, 1);
}

const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
const size = viewSize();
mesh = new THREE.Mesh(new THREE.PlaneGeometry(size.width, size.height, 1, 1), material);
scene.add(mesh);
resize();
window.addEventListener("resize", resize);

function pointer(ev) {
  const rect = mount.getBoundingClientRect();
  touchTexture.addTouch({
    x: (ev.clientX - rect.left) / rect.width,
    y: 1 - (ev.clientY - rect.top) / rect.height,
  });
}

mount.addEventListener("mousemove", pointer);
mount.addEventListener("touchmove", (ev) => pointer(ev.touches[0]), { passive: true });

const clock = new THREE.Clock();
function tick() {
  const delta = Math.min(clock.getDelta(), 0.1);
  touchTexture.update();
  uniforms.uTime.value += delta;
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();`;
}

export function buildLiquidExportBundle(state: LiquidColorState): {
  html: string;
  css: string;
  js: string;
  all: string;
} {
  const html = buildLiquidExportHtml();
  const css = buildLiquidExportCss(state);
  const js = buildLiquidExportJs(state);
  const all = `<!-- HTML -->\n${html}\n\n<!-- CSS -->\n<style>\n${css}\n</style>\n\n<!-- JS -->\n<script type="module">\n${js}\n</script>`;
  return { html, css, js, all };
}
