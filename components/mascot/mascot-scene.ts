import * as THREE from "three";
import { createMascot } from "./create-mascot";

function createBrandTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = "#f2c14e";
  ctx.fillStyle = "#f2c14e";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  // The crescent, wave, and constellation of the reference brand mark.
  ctx.beginPath();
  ctx.arc(110, 127, 77, 0.2, 4.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(147, 165);
  ctx.bezierCurveTo(230, 54, 92, 29, 89, 127);
  ctx.bezierCurveTo(119, 78, 178, 130, 147, 165);
  ctx.fill();
  for (const [x, y, r] of [[96, 27, 6], [130, 19, 8], [166, 34, 8], [188, 66, 6], [73, 49, 5]]) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.font = "500 84px Arial, sans-serif";
  ctx.fillStyle = "#fffaf0";
  ctx.fillText("ODAY", 230, 152);
  ctx.fillStyle = "#f2c14e";
  ctx.fillRect(473, 84, 3, 80);
  ctx.font = "500 64px Arial, sans-serif";
  ctx.fillText("TOURISM", 497, 146);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function mountMascot(canvas: HTMLCanvasElement, onReady: () => void, onFailure: () => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.7, 1.7, 3.75, -0.25, 0.1, 30);
  camera.position.set(0, 1.75, 10);
  camera.lookAt(0, 1.75, 0);
  scene.add(new THREE.HemisphereLight(0xe8f6ff, 0x57709a, 1.6));
  const key = new THREE.DirectionalLight(0xfff4dd, 2.8);
  key.position.set(-3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x99d9ff, 2.7);
  rim.position.set(4, 3, -2);
  scene.add(rim);

  const brandTexture = createBrandTexture();
  const mascot = createMascot(brandTexture);
  scene.add(mascot.root);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let disposed = false;
  let contextLost = false;
  let lastFrame = 0;
  let seconds = 0;
  let waveUntil = 2;
  let lookX = 0;
  let lookY = 0;
  let targetX = 0;
  let targetY = 0;

  function draw() {
    if (disposed || contextLost) return;
    mascot.animate(reducedMotion.matches ? 0 : seconds, reducedMotion.matches ? 0 : (seconds < waveUntil || seconds % 10 < 1.8 ? 1 : 0), lookX, lookY);
    renderer.render(scene, camera);
  }

  function tick(now: number) {
    if (now - lastFrame < 1000 / 30) return;
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
    lastFrame = now;
    seconds += delta;
    lookX = THREE.MathUtils.lerp(lookX, targetX, 0.12);
    lookY = THREE.MathUtils.lerp(lookY, targetY, 0.12);
    draw();
  }

  function updatePlayback() {
    if (disposed) return;
    lastFrame = 0;
    renderer.setAnimationLoop(!document.hidden && !reducedMotion.matches && !contextLost ? tick : null);
    if (!document.hidden) draw();
  }

  function resize() {
    if (disposed || contextLost) return;
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    // Maintain the full silhouette at any viewport size, including a raised hand.
    const halfHeight = Math.max(2, 1.7 / (width / height));
    camera.left = -halfHeight * width / height;
    camera.right = halfHeight * width / height;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    draw();
  }

  function loseContext(event: Event) {
    event.preventDefault();
    contextLost = true;
    renderer.setAnimationLoop(null);
    onFailure();
  }
  function restoreContext() {
    contextLost = false;
    resize();
    updatePlayback();
    onReady();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  canvas.addEventListener("webglcontextlost", loseContext);
  canvas.addEventListener("webglcontextrestored", restoreContext);
  reducedMotion.addEventListener("change", updatePlayback);
  document.addEventListener("visibilitychange", updatePlayback);
  resize();
  updatePlayback();
  onReady();

  return {
    wave() {
      waveUntil = seconds + 2.2;
    },
    look(x: number, y: number) {
      if (reducedMotion.matches) return;
      targetX = x;
      targetY = y;
    },
    dispose() {
      disposed = true;
      renderer.setAnimationLoop(null);
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", loseContext);
      canvas.removeEventListener("webglcontextrestored", restoreContext);
      reducedMotion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      mascot.dispose();
      brandTexture.dispose();
      renderer.dispose();
    },
  };
}
