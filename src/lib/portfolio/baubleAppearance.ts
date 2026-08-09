import * as THREE from "three";
import { baubleMaterial } from "@/lib/portfolio/pointerState";

/** 직물(리넨) 질감 + 인디고/오렌지 그라데이션 텍스처 생성 */
export function createFabricTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // 인디고 베이스 그라데이션
    const base = ctx.createLinearGradient(0, 0, size, size);
    base.addColorStop(0, "#3a5494");
    base.addColorStop(0.55, "#27407c");
    base.addColorStop(1, "#16224d");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    // 우상단 오렌지 글로우
    const glow = ctx.createRadialGradient(size * 0.78, size * 0.22, 0, size * 0.78, size * 0.22, size * 0.75);
    glow.addColorStop(0, "rgba(222, 124, 58, 0.95)");
    glow.addColorStop(0.45, "rgba(205, 108, 52, 0.4)");
    glow.addColorStop(1, "rgba(205, 108, 52, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    // 가로 위사 라인 — 밝고 어두운 실이 번갈아 가며 직물 결 표현
    ctx.lineWidth = 1;
    for (let y = 0; y < size; y += 2) {
      const alpha = 0.04 + Math.random() * 0.1;
      ctx.strokeStyle = Math.random() < 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(8, 12, 30, ${alpha + 0.05})`;
      ctx.beginPath();
      ctx.moveTo(0, y + Math.random());
      ctx.lineTo(size, y + Math.random());
      ctx.stroke();
    }

    // 세로 경사 라인 — 듬성듬성 교차하는 크로스해치
    for (let x = 0; x < size; x += 4) {
      if (Math.random() < 0.4) continue;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.02 + Math.random() * 0.05})`;
      ctx.beginPath();
      ctx.moveTo(x + Math.random(), 0);
      ctx.lineTo(x + Math.random(), size);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** 공유 baubleMaterial에 팔레트/커스텀 색 적용 */
export function applyBallColor(ballColor: string) {
  if (ballColor === "fabric") {
    const texture = createFabricTexture();
    baubleMaterial.map = texture;
    baubleMaterial.emissiveMap = texture;
    baubleMaterial.color.setHex(0xffffff);
    baubleMaterial.emissive.setHex(0xffffff).multiplyScalar(0.2);
    baubleMaterial.needsUpdate = true;
    return;
  }

  baubleMaterial.map = null;
  baubleMaterial.emissiveMap = null;

  const c = new THREE.Color(ballColor);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);

  if (hsl.l < 0.08) {
    // #000 — 순검정이면 Lambert 음영이 사라져 실루엣만 남음 → 약간 띄워 볼륨 유지
    baubleMaterial.color.setRGB(0.16, 0.16, 0.18);
    baubleMaterial.emissive.setRGB(0.02, 0.02, 0.025);
  } else if (hsl.l > 0.9) {
    // #fff — 순백+노출로 날아가지 않게 쿨 오프화이트 + 낮은 emissive
    baubleMaterial.color.setRGB(0.86, 0.88, 0.92);
    baubleMaterial.emissive.setRGB(0.035, 0.04, 0.05);
  } else {
    baubleMaterial.color.copy(c);
    const em = THREE.MathUtils.clamp(0.06 + (1 - hsl.l) * 0.18, 0.05, 0.22);
    baubleMaterial.emissive.copy(c).multiplyScalar(em);
  }
  baubleMaterial.needsUpdate = true;
}
