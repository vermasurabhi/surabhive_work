import * as THREE from "three";
import { LIQUID_FRAGMENT_SHADER, LIQUID_VERTEX_SHADER } from "./shaders";

export type LiquidColorState = {
  colors: string[];
  darkNavy: string;
};

export const SCHEME_1_DEFAULTS: LiquidColorState = {
  colors: ["#6999A1", "#9295C0", "#AB82A4", "#F06E95", "#FC9390", "#FEE3CA"],
  darkNavy: "#FFFFFF",
};

function hexToColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

function hexToVector3(hex: string): THREE.Vector3 {
  const rgb = hexToRgb(hex);
  if (!rgb) return new THREE.Vector3(1, 1, 1);
  return new THREE.Vector3(rgb.r, rgb.g, rgb.b);
}

type TouchPoint = {
  x: number;
  y: number;
  age: number;
  force: number;
  vx: number;
  vy: number;
};

type PointerCoords = { x: number; y: number };

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function vectorToHex(v: THREE.Vector3): string {
  return rgbToHex(v.x, v.y, v.z);
}

class TouchTexture {
  private size = 64;
  private width: number;
  private height: number;
  private maxAge = 64;
  private radius: number;
  private speed: number;
  private trail: TouchPoint[] = [];
  private last: PointerCoords | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  readonly texture: THREE.Texture;

  constructor() {
    this.width = this.size;
    this.height = this.size;
    this.radius = 0.25 * this.size;
    this.speed = 1 / this.maxAge;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Could not create touch texture context");
    this.ctx = ctx;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture = new THREE.Texture(this.canvas);
  }

  update(): void {
    this.clear();
    const speed = this.speed;
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      const f = point.force * speed * (1 - point.age / this.maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      } else {
        this.drawPoint(point);
      }
    }
    this.texture.needsUpdate = true;
  }

  clear(): void {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addTouch(point: PointerCoords): void {
    let force = 0;
    let vx = 0;
    let vy = 0;
    const last = this.last;
    if (last) {
      const dx = point.x - last.x;
      const dy = point.y - last.y;
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

  private drawPoint(point: TouchPoint): void {
    const pos = {
      x: point.x * this.width,
      y: (1 - point.y) * this.height,
    };

    let intensity = 1;
    if (point.age < this.maxAge * 0.3) {
      intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
    } else {
      const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
      intensity = -t * (t - 2);
    }
    intensity *= point.force;

    const radius = this.radius;
    const color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = this.size * 5;
    this.ctx.shadowOffsetX = offset;
    this.ctx.shadowOffsetY = offset;
    this.ctx.shadowBlur = radius;
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;
    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  dispose(): void {
    this.texture.dispose();
  }
}

type SceneManager = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  getViewSize: () => { width: number; height: number };
};

class GradientBackground {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null = null;
  readonly uniforms: Record<string, THREE.IUniform>;
  private sceneManager: SceneManager;

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
    this.uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor1: { value: hexToVector3(SCHEME_1_DEFAULTS.colors[0]) },
      uColor2: { value: hexToVector3(SCHEME_1_DEFAULTS.colors[1]) },
      uColor3: { value: hexToVector3(SCHEME_1_DEFAULTS.colors[2]) },
      uColor4: { value: hexToVector3(SCHEME_1_DEFAULTS.colors[3]) },
      uColor5: { value: hexToVector3(SCHEME_1_DEFAULTS.colors[4]) },
      uColor6: { value: hexToVector3(SCHEME_1_DEFAULTS.colors[5]) },
      uSpeed: { value: 1.5 },
      uIntensity: { value: 1.35 },
      uTouchTexture: { value: null as THREE.Texture | null },
      uGrainIntensity: { value: 0.05 },
      uDarkNavy: { value: hexToVector3(SCHEME_1_DEFAULTS.darkNavy) },
      uGradientSize: { value: 0.45 },
      uGradientCount: { value: 12.0 },
      uColor1Weight: { value: 1.0 },
      uColor2Weight: { value: 1.0 },
    };
  }

  init(): void {
    const viewSize = this.sceneManager.getViewSize();
    const geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: LIQUID_VERTEX_SHADER,
      fragmentShader: LIQUID_FRAGMENT_SHADER,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.z = 0;
    this.sceneManager.scene.add(this.mesh);
  }

  update(delta: number): void {
    this.uniforms.uTime.value += delta;
  }

  onResize(width: number, height: number): void {
    const viewSize = this.sceneManager.getViewSize();
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
    }
    this.uniforms.uResolution.value.set(width, height);
  }

  dispose(): void {
    if (!this.mesh) return;
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.sceneManager.scene.remove(this.mesh);
    this.mesh = null;
  }
}

export class LiquidGradientEffect {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private touchTexture: TouchTexture;
  private gradientBackground: GradientBackground;
  private container: HTMLElement;
  private mountEl: HTMLElement;
  private rafId = 0;
  private running = false;
  private reducedMotion: boolean;
  private resizeObserver: ResizeObserver;
  private onMouseMoveBound: (ev: MouseEvent) => void;
  private onTouchMoveBound: (ev: TouchEvent) => void;
  private onVisibilityBound: () => void;

  constructor(container: HTMLElement, mountEl: HTMLElement) {
    this.container = container;
    this.mountEl = mountEl;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
      stencil: false,
      depth: false,
    });
    this.renderer.domElement.className = "liquid-hub-canvas";
    this.mountEl.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
    this.camera.position.z = 50;
    this.scene = new THREE.Scene();
    this.scene.background = hexToColor(SCHEME_1_DEFAULTS.darkNavy);
    this.clock = new THREE.Clock();

    this.touchTexture = new TouchTexture();
    this.gradientBackground = new GradientBackground(this);
    this.gradientBackground.uniforms.uTouchTexture.value = this.touchTexture.texture;
    this.applyScheme1();

    this.onMouseMoveBound = (ev) => this.onPointerMove(ev.clientX, ev.clientY);
    this.onTouchMoveBound = (ev) => {
      const touch = ev.touches[0];
      if (touch) this.onPointerMove(touch.clientX, touch.clientY);
    };
    this.onVisibilityBound = () => {
      if (!document.hidden) this.renderFrame();
    };

    this.gradientBackground.init();
    this.resize();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);

    this.container.addEventListener("mousemove", this.onMouseMoveBound);
    this.container.addEventListener("touchmove", this.onTouchMoveBound, { passive: true });

    document.addEventListener("visibilitychange", this.onVisibilityBound);

    if (!this.reducedMotion) {
      this.running = true;
      this.tick();
    } else {
      this.renderFrame();
    }
  }

  getColorState(): LiquidColorState {
    const uniforms = this.gradientBackground.uniforms;
    const colors = [1, 2, 3, 4, 5, 6].map((i) => {
      const uniform = uniforms[`uColor${i}`] as THREE.IUniform<THREE.Vector3>;
      return vectorToHex(uniform.value);
    });
    const darkNavy = vectorToHex(uniforms.uDarkNavy.value as THREE.Vector3);
    return { colors, darkNavy };
  }

  setColor(index: number, hex: string): void {
    const rgb = hexToRgb(hex);
    if (!rgb || index < 1 || index > 6) return;
    const uniform = this.gradientBackground.uniforms[`uColor${index}`] as THREE.IUniform<THREE.Vector3>;
    uniform.value.set(rgb.r, rgb.g, rgb.b);
  }

  setBaseColor(hex: string): void {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    (this.gradientBackground.uniforms.uDarkNavy.value as THREE.Vector3).set(rgb.r, rgb.g, rgb.b);
    this.scene.background = hexToColor(hex);
  }

  applyScheme1(): void {
    SCHEME_1_DEFAULTS.colors.forEach((hex, index) => this.setColor(index + 1, hex));
    this.setBaseColor(SCHEME_1_DEFAULTS.darkNavy);
    this.gradientBackground.uniforms.uGradientSize.value = 0.45;
    this.gradientBackground.uniforms.uGradientCount.value = 12.0;
    this.gradientBackground.uniforms.uSpeed.value = 1.5;
    this.gradientBackground.uniforms.uIntensity.value = 1.35;
    this.gradientBackground.uniforms.uGrainIntensity.value = 0.05;
    this.gradientBackground.uniforms.uColor1Weight.value = 1.0;
    this.gradientBackground.uniforms.uColor2Weight.value = 1.0;
  }

  private onPointerMove(clientX: number, clientY: number): void {
    const rect = this.container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    this.touchTexture.addTouch({
      x: (clientX - rect.left) / rect.width,
      y: 1 - (clientY - rect.top) / rect.height,
    });
  }

  getViewSize(): { width: number; height: number } {
    const fovInRadians = (this.camera.fov * Math.PI) / 180;
    const height = Math.abs(this.camera.position.z * Math.tan(fovInRadians / 2) * 2);
    return { width: height * this.camera.aspect, height };
  }

  private resize(): void {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.gradientBackground.onResize(width, height);
    this.renderFrame();
  }

  private update(delta: number): void {
    this.touchTexture.update();
    this.gradientBackground.update(delta);
  }

  private renderFrame(): void {
    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.renderer.render(this.scene, this.camera);
    if (this.running) this.update(delta);
  }

  private tick = (): void => {
    this.renderFrame();
    this.rafId = requestAnimationFrame(this.tick);
  };

  dispose(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();
    this.container.removeEventListener("mousemove", this.onMouseMoveBound);
    this.container.removeEventListener("touchmove", this.onTouchMoveBound);
    document.removeEventListener("visibilitychange", this.onVisibilityBound);
    this.gradientBackground.dispose();
    this.touchTexture.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

export function createLiquidGradientEffect(
  container: HTMLElement,
  mountEl: HTMLElement,
): LiquidGradientEffect {
  return new LiquidGradientEffect(container, mountEl);
}
