"use client";

/**
 * DotFieldCanvas
 * ----------------------------------------
 * 화면 전체를 덮는 "점박이" 배경을 WebGL(Three.js)로 그리는 컴포넌트입니다.
 * - 풀스크린 쿼드(2x2 plane)에 커스텀 셰이더를 적용해 픽셀 단위로 점을 그림.
 * - 마우스 위치에 따라 점이 휘어지고(워프) 색이 변하며, 스크롤/시간에 따라 미세하게 움직입니다.
 * - 화면에 보일 때만 애니메이션을 돌려 성능을 아끼고, WebGL 불가 환경에서는 조용히 렌더링하지 않습니다.
 */

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * hex 코드(예: "#fbfbfb")를 Three.js에서 셰이더에 넘길 때 쓰는 선형 RGB 색으로 변환합니다.
 * - 브라우저/CSS는 sRGB, WebGL 조명/블렌딩 계산은 선형 RGB를 쓰므로 변환이 필요합니다.
 * - 변환하지 않으면 셰이더에서 색이 진하게 또는 흐리게 보일 수 있습니다.
 */
function hexToLinearRGB(hex: string): THREE.Color {
	return new THREE.Color(hex).convertSRGBToLinear();
}

/**
 * 현재 환경에서 WebGL 사용 가능 여부를 반환합니다.
 * - 일부 브라우저·설정·기기에서는 WebGL이 비활성화되어 있을 수 있어,
 *   사용 불가 시 배경 효과를 아예 실행하지 않고 조용히 빠집니다.
 */
function isWebGLAvailable(): boolean {
	try {
		const canvas = document.createElement("canvas");
		return !!(
			window.WebGLRenderingContext &&
			(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
		);
	} catch {
		return false;
	}
}

export default function DotFieldCanvas() {
	// ----------------------------------------
	// Ref 정리
	// ----------------------------------------
	// rootRef: IntersectionObserver가 관찰할 DOM. 이 영역이 뷰포트에 보일 때만 rAF를 돌립니다.
	const rootRef = useRef<HTMLDivElement | null>(null);
	// mountRef: WebGL 캔버스(renderer.domElement)를 붙일 div. 마운트 후 여기에 appendChild 합니다.
	const mountRef = useRef<HTMLDivElement | null>(null);
	// rafRef: requestAnimationFrame 반환값. cleanup 시 cancelAnimationFrame(rafRef.current)로 중지합니다.
	const rafRef = useRef<number | null>(null);
	// visibleRef: 현재 이 컴포넌트 영역이 화면에 보이는지. false면 animate() 안에서 렌더를 건너뜁니다.
	const visibleRef = useRef<boolean>(true);
	// 마우스는 "목표값"과 "현재값" 두 개로 관리해, 셰이더에 넘길 때 부드럽게(lerp) 따라가게 합니다.
	// mouseTargetRef: pointermove 이벤트에서 즉시 갱신되는 실제 마우스 위치(NDC -1~1).
	const mouseTargetRef = useRef(new THREE.Vector2(0, 0));
	// mouseNdcRef: 매 프레임 mouseTarget 쪽으로 lerp. 이 값을 uniforms.u_mouse로 셰이더에 전달합니다.
	const mouseNdcRef = useRef(new THREE.Vector2(0, 0));
	// 스크롤도 마우스와 동일하게 "목표값 → 현재값" 보간. 페이지 전체 스크롤을 0~1로 정규화합니다.
	const scrollRef = useRef<number>(0);
	const scrollTargetRef = useRef<number>(0);

	useEffect(() => {
		if (!mountRef.current) return;

		// ----------------------------------------
		// [1] 가드: 접근성·환경 체크
		// ----------------------------------------
		// prefers-reduced-motion: 사용자가 "동작 감소"를 선호하면 애니메이션 부담을 줄입니다.
		const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
		if (!isWebGLAvailable()) return;

		// isLowPower: reduced motion 이거나 CPU 코어 4개 이하일 때.
		// → antialias 끄기, powerPreference "low-power", 셰이더 u_strength/u_range 낮춤.
		const isLowPower =
			prefersReducedMotion ||
			(typeof navigator !== "undefined" &&
				typeof navigator.hardwareConcurrency === "number" &&
				navigator.hardwareConcurrency <= 4);

		// ----------------------------------------
		// [2] Three.js 씬·렌더러 초기화
		// ----------------------------------------
		const scene = new THREE.Scene();
		// [배경색] 화면 배경 흰색. 여기서 0xffffff 를 바꾸면 전체 배경색이 바뀝니다.
		// 검정 0x000000, 흰색 0xffffff
		scene.background = new THREE.Color(0xffffff);

		const renderer = new THREE.WebGLRenderer({
			antialias: !isLowPower, // 저사양이면 앤티앨리어싱 끔.
			alpha: true, // 투명 배경 허용.
			powerPreference: isLowPower ? "low-power" : "high-performance",
		});

		// dpr(디바이스 픽셀 비율) 상한 2. 고해상도에서 과도한 픽셀 수를 막습니다.
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		renderer.setPixelRatio(dpr);
		renderer.setSize(window.innerWidth, window.innerHeight);
		// [배경색] WebGL 캔버스 클리어 시 사용하는 색(흰색). 투명 영역 뒤에 보이는 색이기도 합니다.
		// 검정 0x000000, 흰색 0xffffff
		renderer.setClearColor(0xffffff, 1);
		renderer.toneMapping = THREE.NoToneMapping; // 톤매핑 없이 hex 색이 그대로 보이게.
		if ("outputColorSpace" in renderer) {
			(renderer as unknown as { outputColorSpace: THREE.ColorSpace }).outputColorSpace =
				THREE.SRGBColorSpace;
		}
		mountRef.current.appendChild(renderer.domElement);

		// 직교 카메라: 클립공간 -1~1을 화면에 그대로 매핑. 풀스크린 쿼드용 표준 설정입니다.
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
		camera.position.set(0, 0, 1);

		// ----------------------------------------
		// [3] 셰이더 uniforms (JS → GLSL로 전달되는 값)
		// ----------------------------------------
		// 마우스 근처는 셰이더에서 hue(0~1)로 hue-rotate처럼 색상 회전. 별도 색 uniform 없음.
		const uniforms = {
			u_time: { value: 0 }, // 매 프레임 증가(초). 셰이더에서 드리프트·jitter·hue 회전에 사용.
			u_mouse: { value: new THREE.Vector2(0, 0) }, // 마우스 위치 NDC(-1~1). lerp된 값 전달.
			u_scroll: { value: 0 }, // 스크롤 0~1 정규화. 드리프트 위상(파동)에 사용.
			u_resolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) }, // 픽셀 해상도. gl_FragCoord와 맞추기 위해 dpr 반영.
			// [도트 색] 마우스에서 멀리 있을 때 점의 색. 여기 hex를 바꾸면 도트 기본색이 바뀝니다.
			u_baseColor: { value: hexToLinearRGB("#ffffff") },
			u_strength: { value: isLowPower ? 0.6 : 1.0 }, // 효과 전체 강도. 저사양일 때 낮춤.
			u_spacing: { value: 10.0 }, // 점 사이 간격(px). 작을수록 점이 촘촘해짐.
			u_dotSize: { value: 5.0 }, // 점 한 변 크기(px) 대략값.
			u_warp: { value: 15.0 }, // 마우스 주변 픽셀을 휘는 정도(px). 클수록 더 휘어짐.
			u_range: { value: isLowPower ? 1.0 : 2.0 }, // 마우스 영향 반경 배수. 클수록 넓은 범위에 워프/색 적용.
		};

		// ----------------------------------------
		// [4] 점 필드 geometry + ShaderMaterial
		// ----------------------------------------
		// 2x2 plane: 직교 카메라에서 화면 전체(-1~1)를 덮는 쿼드. 실제 "점"은 fragment shader에서 픽셀 단위로 그림.
		const dotGeo = new THREE.PlaneGeometry(2, 2);
		const dotMat = new THREE.ShaderMaterial({
			uniforms,
			transparent: true,
			depthWrite: false,
			blending: THREE.NormalBlending,
			toneMapped: false,
			// vertex: 풀스크린 쿼드이므로 position을 그대로 클립공간(-1~1)에 넘깁니다.
			vertexShader: `
				void main() {
					gl_Position = vec4(position.xy, 0.0, 1.0);
				}
			`,
			// fragment: 각 픽셀마다 "이 위치에 점을 그릴지, 무슨 색으로" 계산합니다.
			fragmentShader: `
				uniform float u_time;
				uniform vec2 u_mouse;   // NDC (-1~1)
				uniform float u_scroll;
				uniform vec2 u_resolution;
				uniform vec3 u_baseColor;
				uniform float u_strength;
				uniform float u_spacing;
				uniform float u_dotSize;
				uniform float u_warp;
				uniform float u_range;

				// 셀(cell) 단위 난수. 격자마다 다른 jitter·위상으로 "살아있는" 느낌을 냅니다.
				float hash(vec2 p) {
					return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
				}
				vec2 hash2(vec2 p) {
					float n = hash(p);
					return vec2(n, hash(p + 17.0));
				}

				// hue(0~1) → RGB. 채도·명도 고정, hue만 돌리면 filter: hue-rotate 같은 효과.
				vec3 hueToRgb(float h) {
					float r = abs(h * 6.0 - 3.0) - 1.0;
					float g = 2.0 - abs(h * 6.0 - 2.0);
					float b = 2.0 - abs(h * 6.0 - 4.0);
					return clamp(vec3(r, g, b), 0.0, 1.0);
				}

				void main() {
					// res: 화면 해상도(px). 0 나눔 방지를 위해 max(1.0) 적용.
					vec2 res = max(u_resolution, vec2(1.0));
					// p: 현재 픽셀 좌표(px). gl_FragCoord는 왼쪽 아래가 (0,0), y 위로 증가.
					vec2 p = gl_FragCoord.xy;
					// 마우스 NDC(-1~1) → 0~1 UV → 픽셀 좌표로 변환.
					vec2 mouseUv = vec2(u_mouse.x * 0.5 + 0.5, u_mouse.y * 0.5 + 0.5);
					vec2 mousePx = mouseUv * res;

					// ---- 드리프트: 시간·스크롤·위치에 따라 p를 살짝 밀어 고정 패턴처럼 보이지 않게 ----
					float drift = (sin((p.x + p.y) * 0.004 + u_scroll * 6.2831 + u_time * 0.35)) * 0.65;
					p += vec2(drift, -drift) * (0.55 + 0.45 * u_strength);

					// ---- 마우스 주변: 크기 커졌다 작아졌다 + 형태가 원→사각→삼각→오각→원 순으로 ----
					vec2 toMouse = p - mousePx;
					float d = length(toMouse);
					float ang = atan(toMouse.y, toMouse.x);
					float sigmaBase = u_spacing * max(1.8, u_range) * 10.0;
					float sigma = sigmaBase * (1.0 + 0.12 * sin(u_time * 1.5));
					float falloffBase = exp(-(d * d) / (2.0 * sigma * sigma));
					vec2 dir = d > 0.001 ? (toMouse / d) : vec2(0.0);
					vec2 warped = p + dir * falloffBase * u_warp * u_strength;

					// 형태: 원 / 사각(Chebyshev) / 삼각 / 오각 거리, 시간에 따라 블렌딩 (크기 비슷하게 스케일)
					float dCircle = d;
					float dSquare = max(abs(toMouse.x), abs(toMouse.y)) * 1.1;
					float pi = 3.14159265;
					float r3 = cos(pi/3.0) / max(0.001, cos(mod(ang + pi/3.0, 2.0*pi/3.0) - pi/3.0));
					float dTri = (d / r3) * 0.55;
					float r5 = cos(pi/5.0) / max(0.001, cos(mod(ang + pi/5.0, 2.0*pi/5.0) - pi/5.0));
					float dPent = (d / r5) * 0.62;
					float tShape = fract(u_time * 0.12);
					float b0 = smoothstep(0.0, 0.25, tShape);
					float b1 = smoothstep(0.25, 0.5, tShape);
					float b2 = smoothstep(0.5, 0.75, tShape);
					float b3 = smoothstep(0.75, 1.0, tShape);
					float dEff = mix(dCircle, dSquare, b0);
					dEff = mix(dEff, dTri, b1);
					dEff = mix(dEff, dPent, b2);
					dEff = mix(dEff, dCircle, b3);
					float falloff = exp(-(dEff * dEff) / (2.0 * sigma * sigma));

					// ---- 점 배치: 화면을 spacing(px) 격자로 나누고, 각 격자 중심에 점 하나 ----
					float spacing = max(8.0, u_spacing);
					vec2 cell = floor(warped / spacing);
					vec2 center = (cell + 0.5) * spacing;

					// 셀마다 난수 jitter + 시간에 따른 미세 움직임(sin/cos). 규칙적인 격자보다 자연스럽게.
					vec2 rnd = hash2(cell);
					float t = u_time * 0.6 + rnd.x * 6.2831853;
					vec2 jitter = (rnd - 0.5) * (spacing * 0.06);
					jitter += vec2(sin(t), cos(t)) * (spacing * 0.02);
					center += jitter;

					// 사각 점 마스크: warped가 center 근처면 점(불투명), 멀면 투명. smoothstep으로 경계 부드럽게.
					vec2 dxy = abs(warped - center);
					float halfSize = max(1.0, u_dotSize) * 0.5;
					// 셀마다 점 크기 랜덤 (0.7~1.3배) → 격자감 줄이고 자연스러운 느낌.
					halfSize *= (0.7 + 0.6 * hash(cell + 2.0));
					float edge = 2.0;
					float ax = smoothstep(halfSize, halfSize - edge, dxy.x);
					float ay = smoothstep(halfSize, halfSize - edge, dxy.y);
					float dotA = ax * ay;
					// 반짝임: 시간에 따라 일부 점이 잠깐 밝아졌다가 돌아옴.
					float twinkle = smoothstep(0.88, 1.0, fract(hash(cell) + u_time * 0.2));
					dotA *= (1.0 + 0.25 * twinkle);

					// ---- 마우스 근처: hue-rotate처럼 색이 돌아가되, 진한 색상 위주 ----
					// baseHue가 천천히 드리프트 → 전체 톤이 살짝 변하는 느낌.
					float baseHue = 0.55 + 0.12 * sin(u_time * 0.18);
					float hue = fract(baseHue + u_time * 0.25);
					vec3 hueRgb = hueToRgb(hue);
					vec3 darkBase = vec3(0.12, 0.12, 0.22);
					vec3 gradientColor = mix(darkBase, hueRgb, 0.35);

					// 마우스에서 퍼져 나가는 펄스 링 (거리·시간으로 링이 밝았다가 사라짐).
					float pulseWave = smoothstep(0.35, 0.65, sin(d * 0.018 - u_time * 2.5) * 0.5 + 0.5);
					float pulseInk = pulseWave * smoothstep(0.02, 0.5, falloff) * 0.14 * u_strength;

					// 색: 기본색 + 마우스 근처일수록 그라데이션(크기·형태 변하는 falloff) + 펄스 링.
					float ink = smoothstep(0.02, 0.92, falloff);
					vec3 col = mix(u_baseColor, gradientColor, ink);
					col += gradientColor * pulseInk;

					// 비네트: 화면 가장자리를 살짝 어둡게 해 가독성·초점을 유지합니다.
					vec2 uv = gl_FragCoord.xy / res;
					col *= mix(0.92, 1.0, smoothstep(1.25, 0.25, length(uv * 2.0 - 1.0)));

					gl_FragColor = vec4(col, dotA);
					#include <tonemapping_fragment>
					#include <colorspace_fragment>
				}
			`,
		});

		// 메시를 씬에 추가. frustumCulled 끔 → 항상 그리기(풀스크린이므로 컬링 대상 아님).
		const dotField = new THREE.Mesh(dotGeo, dotMat);
		dotField.frustumCulled = false;
		scene.add(dotField);

		// ----------------------------------------
		// [5] 입력 이벤트: 마우스(포인터) · 스크롤
		// ----------------------------------------
		// 화면 좌표(clientX/Y)를 NDC(-1~1)로 변환해 mouseTarget에 저장. 셰이더에는 lerp된 mouseNdc를 넘깁니다.
		const handlePointerMove = (e: PointerEvent) => {
			mouseTargetRef.current.set(
				(e.clientX / window.innerWidth) * 2 - 1,
				-((e.clientY / window.innerHeight) * 2 - 1),
			);
		};
		window.addEventListener("pointermove", handlePointerMove, { passive: true });

		// 스크롤을 페이지 전체 높이 기준 0~1로 정규화. 셰이더 드리프트 위상에 사용합니다.
		const updateScrollTarget = () => {
			scrollTargetRef.current = THREE.MathUtils.clamp(
				window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
				0,
				1,
			);
		};
		updateScrollTarget();
		window.addEventListener("scroll", updateScrollTarget, { passive: true });

		// ----------------------------------------
		// [6] 리사이즈: 렌더러 크기 + u_resolution 갱신
		// ----------------------------------------
		// 창 크기가 바뀌면 캔버스 크기와 셰이더 해상도(u_resolution)를 맞춥니다.
		const handleResize = () => {
			const w = window.innerWidth;
			const h = window.innerHeight;
			const pd = Math.min(2, window.devicePixelRatio || 1);
			renderer.setPixelRatio(pd);
			renderer.setSize(w, h);
			uniforms.u_resolution.value.set(w * pd, h * pd);
		};
		window.addEventListener("resize", handleResize);

		// ----------------------------------------
		// [7] 가시성 관찰: 보일 때만 rAF 실행
		// ----------------------------------------
		// 탭 전환·스크롤로 화면 밖으로 나가면 애니메이션을 중지해 CPU/GPU 부담을 줄입니다.
		const visibilityObserver = new IntersectionObserver(
			(entries) => {
				visibleRef.current = entries.some((en) => en.isIntersecting);
				if (visibleRef.current && rafRef.current == null) animate();
				if (!visibleRef.current && rafRef.current != null) {
					window.cancelAnimationFrame(rafRef.current);
					rafRef.current = null;
				}
			},
			{ threshold: 0.05 },
		);
		if (rootRef.current) visibilityObserver.observe(rootRef.current);

		// ----------------------------------------
		// [8] 애니메이션 루프
		// ----------------------------------------
		const clock = new THREE.Clock();
		const animate = () => {
			if (!visibleRef.current) return;
			rafRef.current = window.requestAnimationFrame(animate);

			const dt = clock.getDelta();
			uniforms.u_time.value += dt;
			// 마우스·스크롤을 부드럽게 보간(lerp). 0.001^dt 로 프레임레이트 독립적으로 수렴합니다.
			mouseNdcRef.current.lerp(mouseTargetRef.current, 1 - Math.pow(0.001, dt));
			uniforms.u_mouse.value.copy(mouseNdcRef.current);
			uniforms.u_scroll.value = scrollRef.current = THREE.MathUtils.lerp(
				scrollRef.current,
				scrollTargetRef.current,
				1 - Math.pow(0.001, dt),
			);
			renderer.render(scene, camera);
		};
		animate();

		// ----------------------------------------
		// [9] 클린업: 이벤트·옵저버·rAF·GPU·DOM 해제
		// ----------------------------------------
		return () => {
			visibilityObserver.disconnect();
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("scroll", updateScrollTarget);
			window.removeEventListener("resize", handleResize);
			if (rafRef.current != null) {
				window.cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
			dotGeo.dispose();
			dotMat.dispose();
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, []);

	// rootRef: 가시성 관찰 대상. mountRef: WebGL 캔버스가 붙는 div.
	return (
		<div ref={rootRef} className="dot-field-canvas">
			<div ref={mountRef} className="dot-field-canvas__mount" aria-hidden="true" />
		</div>
	);
}
