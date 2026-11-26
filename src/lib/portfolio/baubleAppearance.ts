import * as THREE from "three";
import { baubleMaterial, coreGlow } from "@/lib/portfolio/pointerState";

/** 물결치는 나뭇결을 가로로 그린다. color가 null이면 밝기(범프용 회색)로 그린다 */
function drawWoodGrain(ctx: CanvasRenderingContext2D, size: number, tinted: boolean) {
  ctx.lineWidth = 1;
  for (let y = 0; y < size; y += 1.5) {
    const light = Math.random() < 0.45;
    const alpha = 0.03 + Math.random() * (light ? 0.07 : 0.12);
    ctx.strokeStyle = tinted
      ? light
        ? `rgba(150, 170, 255, ${alpha})`
        : `rgba(4, 8, 30, ${alpha + 0.04})`
      : light
        ? `rgba(255, 255, 255, ${alpha * 2.4})`
        : `rgba(0, 0, 0, ${alpha * 2.4})`;
    const wave = 1.5 + Math.random() * 2.5;
    const period = 90 + Math.random() * 140;
    const phase = Math.random() * Math.PI * 2;
    ctx.beginPath();
    for (let x = 0; x <= size; x += 16) {
      const yy = y + Math.sin(x / period + phase) * wave;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
}

/** 배경 그림처럼 결이 살아 있는 인디고 나무 질감 텍스처 생성 */
export function createFabricTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // 그림 속 퍼즐처럼 짙고 채도가 조금 빠진 인디고
    const base = ctx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, "#3a4088");
    base.addColorStop(0.55, "#2c3274");
    base.addColorStop(1, "#1f2458");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    // 꽃송이 안쪽 빛은 셰이더(coreGlow)가 담당한다. 여기서는 옅은 반사광만 남긴다
    const bounce = ctx.createRadialGradient(size * 0.3, size * 0.32, 0, size * 0.3, size * 0.32, size * 0.6);
    bounce.addColorStop(0, "rgba(214, 120, 62, 0.22)");
    bounce.addColorStop(1, "rgba(214, 120, 62, 0)");
    ctx.fillStyle = bounce;
    ctx.fillRect(0, 0, size, size);

    drawWoodGrain(ctx, size, true);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/** 나뭇결 요철용 범프 텍스처 */
function createGrainBumpTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);
    drawWoodGrain(ctx, size, false);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/** 공유 baubleMaterial에 팔레트/커스텀 색 적용 */
export function applyBallColor(ballColor: string) {
  if (ballColor === "fabric") {
    const texture = createFabricTexture();
    baubleMaterial.map = texture;
    baubleMaterial.emissiveMap = texture;
    baubleMaterial.bumpMap = createGrainBumpTexture();
    baubleMaterial.bumpScale = 0.6;
    baubleMaterial.color.setHex(0xffffff);
    // 자체 발광을 낮춰야 조명 음영이 살아나 그림처럼 차분해진다
    baubleMaterial.emissive.setHex(0xffffff).multiplyScalar(0.07);
    coreGlow.strength.value = 1;
    baubleMaterial.needsUpdate = true;
    return;
  }

  coreGlow.strength.value = 0;
  baubleMaterial.map = null;
  baubleMaterial.emissiveMap = null;
  baubleMaterial.bumpMap = null;

  const c = new THREE.Color(ballColor);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);

  const achromatic = hsl.s < 0.08;

  if (achromatic && hsl.l < 0.08) {
    // #000 — 순검정이면 Lambert 음영이 사라져 실루엣만 남음 → 약간 띄워 볼륨 유지
    baubleMaterial.color.setRGB(0.16, 0.16, 0.18);
    baubleMaterial.emissive.setRGB(0.02, 0.02, 0.025);
  } else if (achromatic && hsl.l > 0.9) {
    // #fff — 순백+노출로 날아가지 않게 쿨 오프화이트 + 낮은 emissive
    baubleMaterial.color.setRGB(0.86, 0.88, 0.92);
    baubleMaterial.emissive.setRGB(0.035, 0.04, 0.05);
  } else {
    const visibleColor = c.clone();
    const minimumSurfaceLightness = 0.14;
    const isDarkChromatic = !achromatic && hsl.l < minimumSurfaceLightness;

    if (isDarkChromatic) {
      visibleColor.setHSL(hsl.h, hsl.s, minimumSurfaceLightness);
    }

    baubleMaterial.color.copy(visibleColor);
    const emissiveStrength = isDarkChromatic
      ? 0.32
      : THREE.MathUtils.clamp(0.06 + (1 - hsl.l) * 0.18, 0.05, 0.22);
    baubleMaterial.emissive
      .copy(visibleColor)
      .multiplyScalar(emissiveStrength);
  }
  baubleMaterial.needsUpdate = true;
}
