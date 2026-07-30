"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { pointerState } from "@/lib/portfolio/pointerState";

const PLANE_Z = -28;
const FLOW_SIZE = 256;

/**
 * Alche 감성 참고 — 브랜드 없이 코드로 구현한 몽환 배경.
 * 화면 100% 고정 평면 + 곡면감 격자 + 모핑 색면 + 마우스 유체.
 */
export default function GiantGlassCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseSmooth = useRef(new THREE.Vector2(0, 0));
  const mouseVel = useRef(new THREE.Vector2(0, 0));
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const flowPos = useRef(new THREE.Vector2(0.5, 0.5));

  const { flowTexture, flowCtx } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = FLOW_SIZE;
    canvas.height = FLOW_SIZE;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, FLOW_SIZE, FLOW_SIZE);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return { flowTexture: texture, flowCtx: ctx };
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: false,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          uTime: { value: 0 },
          uAspect: { value: 1 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uMouseVel: { value: new THREE.Vector2(0, 0) },
          uFlow: { value: flowTexture },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform float uAspect;
          uniform vec2 uMouse;
          uniform vec2 uMouseVel;
          uniform sampler2D uFlow;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }

          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
            for (int i = 0; i < 5; i++) {
              v += a * noise(p);
              p = m * p;
              a *= 0.5;
            }
            return v;
          }

          // 오목한 구면감 — 안쪽으로 들어간 느낌
          vec2 curveUv(vec2 uv) {
            vec2 c = uv - 0.5;
            c.x *= uAspect;
            float r2 = dot(c, c);
            c *= 1.0 - r2 * 0.12;
            c.x /= uAspect;
            return c + 0.5;
          }

          void main() {
            vec2 uv = vUv;
            vec2 cuv = curveUv(uv);
            vec2 aspectUv = vec2(cuv.x * uAspect, cuv.y);

            float flow = texture2D(uFlow, clamp(uv, 0.0, 1.0)).r;
            vec2 m = uMouse * 0.5 + 0.5;
            vec2 toMouse = uv - m;
            toMouse.x *= uAspect;
            float md = length(toMouse);
            vec2 dir = normalize(toMouse + 1e-4);

            // 마우스 유체 + 붓 잔상 (flow가 남아 있으면 계속 일렁임)
            float speed = length(uMouseVel);
            float trail = smoothstep(0.015, 0.22, flow);
            float motionAmt = max(smoothstep(0.002, 0.02, speed), trail * 0.9);
            vec2 distort = vec2(0.0);
            vec2 vel = uMouseVel * vec2(1.0 / max(uAspect, 1.0), 1.0);
            distort += vel * flow * 0.045 * motionAmt;
            distort += dir * flow * 0.018 * trail; // 잔상 붓 밀림
            distort += dir * flow * 0.014 * motionAmt;
            distort += dir * flow * exp(-md * 2.5) * 0.008 * sin(md * 28.0 - uTime * 2.2) * motionAmt;

            float t = uTime * 0.1;

            vec2 duv = cuv + distort;
            vec2 fieldUv = vec2(duv.x * uAspect, duv.y);

            // ── 배경 무늬 A~E — 3초마다 순서 전환 ──
            vec3 deep = vec3(0.008, 0.012, 0.03);
            vec3 navy = vec3(0.015, 0.025, 0.07);
            vec3 indigo = vec3(0.025, 0.04, 0.11);
            vec3 blue = vec3(0.04, 0.065, 0.16);
            vec3 softBlue = vec3(0.05, 0.08, 0.18);

            // A: 마블 결
            float a1 = fbm(fieldUv * 1.4 + 2.0);
            float a2 = fbm(fieldUv * 2.2 + 19.0);
            float marble = smoothstep(0.05, 0.5, abs(a1 - a2));
            vec3 patA = deep;
            patA = mix(patA, navy, smoothstep(0.28, 0.7, a1));
            patA = mix(patA, indigo, marble * 0.4);
            patA = mix(patA, blue, smoothstep(0.55, 0.9, a2) * 0.2);

            // B: 큰 소프트 블롭
            float b1 = fbm(fieldUv * 0.7 + 5.0);
            float b2 = fbm(fieldUv * 1.1 + vec2(8.0, 3.0));
            vec3 patB = deep;
            patB = mix(patB, navy, smoothstep(0.35, 0.65, b1));
            patB = mix(patB, indigo, smoothstep(0.45, 0.8, b2) * 0.45);
            patB = mix(patB, softBlue, smoothstep(0.7, 0.95, b1 * b2) * 0.18);

            // C: 부드러운 물결 레이어 (유기적 흐름)
            float c1 = fbm(fieldUv * vec2(1.1, 2.4) + 40.0);
            float c2 = fbm(fieldUv * vec2(2.0, 0.9) + vec2(14.0, 6.0));
            float wave = smoothstep(0.3, 0.7, c1 * 0.55 + c2 * 0.45);
            vec3 patC = deep;
            patC = mix(patC, navy, smoothstep(0.2, 0.65, c1));
            patC = mix(patC, indigo, wave * 0.42);
            patC = mix(patC, blue, smoothstep(0.65, 0.92, c2) * 0.2);

            // D: 대각 밴드
            float band = fbm(vec2(fieldUv.x + fieldUv.y, fieldUv.x - fieldUv.y) * 1.8 + 22.0);
            float d1 = fbm(fieldUv * 1.2 + 27.0);
            vec3 patD = deep;
            patD = mix(patD, navy, smoothstep(0.25, 0.6, band));
            patD = mix(patD, indigo, abs(band - 0.5) * 0.7);
            patD = mix(patD, blue, smoothstep(0.6, 0.9, d1) * 0.22);

            // E: 셀/스페클
            float e1 = fbm(fieldUv * 3.2 + 50.0);
            float e2 = noise(fieldUv * 14.0 + 60.0);
            float cell = smoothstep(0.35, 0.75, e1) * (0.4 + 0.6 * e2);
            vec3 patE = deep;
            patE = mix(patE, navy, 0.5);
            patE = mix(patE, indigo, cell * 0.5);
            patE = mix(patE, softBlue, smoothstep(0.8, 1.0, e2) * 0.12);

            // 3초 주기, A→B→C→D→E→A… (0.6초 크로스페이드)
            float cycle = uTime / 3.0;
            float idx = mod(floor(cycle), 5.0);
            float fade = smoothstep(0.0, 0.2, fract(cycle)); // 앞 0.6초 페이드인
            // 이전 패턴과 현재 패턴 블렌드
            vec3 prevCol = patA;
            vec3 nextCol = patA;
            if (idx < 0.5) { prevCol = patE; nextCol = patA; }
            else if (idx < 1.5) { prevCol = patA; nextCol = patB; }
            else if (idx < 2.5) { prevCol = patB; nextCol = patC; }
            else if (idx < 3.5) { prevCol = patC; nextCol = patD; }
            else { prevCol = patD; nextCol = patE; }

            vec3 col = mix(prevCol, nextCol, fade);

            float glow = exp(-length((uv - 0.5) * vec2(uAspect * 0.55, 1.0)) * 2.8);
            col += vec3(0.025, 0.05, 0.14) * glow * 0.05;

            // ── 격자 — 화면에서 정사각 셀 ──
            float gridScale = 36.0;
            vec2 guv = (duv - 0.5);
            guv.x *= uAspect; // 가로·세로 셀 크기 동일
            vec2 gridUv = guv * gridScale;
            vec2 f = fract(gridUv);
            vec2 fw = max(fwidth(gridUv), vec2(1e-5));
            float px = 1.15; // ~1px 선
            float lx = 1.0 - smoothstep(0.0, px, min(f.x, 1.0 - f.x) / fw.x);
            float ly = 1.0 - smoothstep(0.0, px, min(f.y, 1.0 - f.y) / fw.y);
            float grid = max(lx, ly);

            vec2 majorUv = guv * (gridScale * 0.25);
            vec2 fm = fract(majorUv);
            vec2 fwm = max(fwidth(majorUv), vec2(1e-5));
            float mxL = 1.0 - smoothstep(0.0, px * 1.35, min(fm.x, 1.0 - fm.x) / fwm.x);
            float myL = 1.0 - smoothstep(0.0, px * 1.35, min(fm.y, 1.0 - fm.y) / fwm.y);
            float major = max(mxL, myL);

            float gridFade = smoothstep(1.15, 0.2, length((uv - 0.5) * vec2(uAspect * 0.7, 1.0)));
            float gridA = (grid * 0.11 + major * 0.07) * (0.65 + 0.35 * gridFade);
            gridA += flow * 0.03 * motionAmt;
            col += vec3(0.04, 0.06, 0.12) * gridA;

            // 비네팅
            float vig = smoothstep(1.2, 0.35, length((uv - 0.5) * vec2(uAspect * 0.75, 1.0)));
            col *= 0.72 + 0.28 * vig;

            // 미세 그레인
            col += (hash(uv * 1200.0 + fract(uTime) * 0.01) - 0.5) * 0.01;

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [flowTexture],
  );

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const v = state.viewport.getCurrentViewport(state.camera, [0, 0, PLANE_Z]);
    mesh.position.set(0, 0, PLANE_Z);
    mesh.scale.set(v.width, v.height, 1);

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uAspect.value = v.width / Math.max(v.height, 1);

    mouseTarget.current.set(
      pointerState.moved ? pointerState.ndcX : state.pointer.x,
      pointerState.moved ? pointerState.ndcY : state.pointer.y,
    );
    const px = mouseSmooth.current.x;
    const py = mouseSmooth.current.y;
    mouseSmooth.current.lerp(mouseTarget.current, 1 - Math.exp(-delta * 5));
    mouseVel.current.set(
      (mouseSmooth.current.x - px) / Math.max(delta, 0.001),
      (mouseSmooth.current.y - py) / Math.max(delta, 0.001),
    );
    mouseVel.current.multiplyScalar(0.018);
    material.uniforms.uMouse.value.copy(mouseSmooth.current);
    material.uniforms.uMouseVel.value.lerp(mouseVel.current, 1 - Math.exp(-delta * 8));

    const ctx = flowCtx;
    // 천천히 사라져 붓 잔상처럼 남김
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0,0,0,0.018)";
    ctx.fillRect(0, 0, FLOW_SIZE, FLOW_SIZE);

    const mx = (mouseSmooth.current.x * 0.5 + 0.5) * FLOW_SIZE;
    const my = (1 - (mouseSmooth.current.y * 0.5 + 0.5)) * FLOW_SIZE;
    const speed = Math.min(Math.hypot(mx - flowPos.current.x, my - flowPos.current.y), 40);

    if (speed > 0.2) {
      const aspect = Math.max(material.uniforms.uAspect.value as number, 0.01);
      const radius = 21 + speed * 0.84;
      ctx.save();
      ctx.translate(mx, my);
      ctx.scale(1 / aspect, 1);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      const strength = Math.min(0.9, 0.32 + speed * 0.022);
      grad.addColorStop(0, `rgba(255,255,255,${strength})`);
      grad.addColorStop(0.45, `rgba(255,255,255,${strength * 0.45})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    flowPos.current.set(mx, my);
    flowTexture.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} material={material} renderOrder={-10}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
