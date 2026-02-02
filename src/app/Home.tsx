'use client';

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// 카테고리 색상(hex)을 Three.js에서 조명/블렌딩 계산에 더 자연스럽게 쓰기 위해
// sRGB → Linear 색공간으로 변환합니다.
function hexToLinearRGB(hex: string): THREE.Color {
	return new THREE.Color(hex).convertSRGBToLinear();
}


// WebGL 사용 가능 여부 체크(브라우저/환경에 따라 WebGL이 막혀있을 수 있음)
// 불가능하면 아예 배경 렌더링을 실행하지 않고 조용히 빠집니다.
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

export default function Home() {
	// rootRef: 페이지 루트(IntersectionObserver로 “화면에 보일 때만” 애니메이션 돌리기 용도)
	// mountRef: WebGL 캔버스를 붙일 DOM 컨테이너
	const rootRef = useRef<HTMLDivElement | null>(null);
	const mountRef = useRef<HTMLDivElement | null>(null);

	// requestAnimationFrame id / 가시성 플래그(보이지 않을 때는 렌더링 중지해서 성능 아끼기)
	const rafRef = useRef<number | null>(null);
	const visibleRef = useRef<boolean>(true);

	
	// 마우스 좌표(NDC: -1..1)를 “부드럽게” 따라가게 만들기 위한 두 벡터
	// - mouseTargetRef: 실제 포인터 위치(즉시 갱신)
	// - mouseNdcRef: 렌더링에서 쓰는 값(lerp로 부드럽게 따라감)
	const mouseNdcRef = useRef(new THREE.Vector2(0, 0));
	const mouseTargetRef = useRef(new THREE.Vector2(0, 0));

	// 스크롤도 마우스와 동일하게 “목표값 → 부드럽게 수렴” 방식으로 사용
	// (점 필드에 미세 드리프트를 주거나, 색/움직임 타이밍에 약간 섞는 용도)
	const scrollRef = useRef<number>(0);
	const scrollTargetRef = useRef<number>(0);

	useEffect(() => {
		if (!mountRef.current) return;

		// [성능/접근성 가드레일]
		// - reduced motion이면 애니메이션 강도를 낮추거나(여기선 isLowPower로 처리) 아예 생략
		// - WebGL이 불가능하면 배경 효과 자체를 실행하지 않음
		const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
		if (!isWebGLAvailable()) return;

		const isLowPower =
			prefersReducedMotion ||
			(typeof navigator !== "undefined" &&
				typeof navigator.hardwareConcurrency === "number" &&
				navigator.hardwareConcurrency <= 4);

		// [Three.js 기본 세팅]
		// 이 배경은 “3D 장면”처럼 보이지만 실제로는 화면 전체(2D)에 고정된 셰이더를 깔아두는 방식입니다.
		// 그래서 카메라는 Orthographic(직교)로 두고, geometry는 2x2 plane(풀스크린 쿼드)을 씁니다.
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xffffff);

		const renderer = new THREE.WebGLRenderer({
			// 저사양/저전력 환경이면 antialias를 끄고, powerPreference도 낮춰서 부담을 줄입니다.
			antialias: !isLowPower,
			alpha: true,
			powerPreference: isLowPower ? "low-power" : "high-performance",
		});

		// 고해상도 디스플레이에서 과도한 픽셀 렌더링을 막기 위해 dpr 상한을 둠
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		renderer.setPixelRatio(dpr);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0xffffff, 1);
		// 색이 hex 값과 최대한 동일하게 보이도록(톤매핑/색공간 영향 최소화)
		renderer.toneMapping = THREE.NoToneMapping;
		// three 버전에 따라 outputColorSpace가 없을 수도 있어서 안전하게 체크 후 설정
		if ("outputColorSpace" in renderer) {
			(renderer as unknown as { outputColorSpace: THREE.ColorSpace }).outputColorSpace =
				THREE.SRGBColorSpace;
		}
		// WebGL 캔버스를 mountRef DOM 아래에 붙임
		mountRef.current.appendChild(renderer.domElement);

		// [카메라(화면 고정)]
		// -1..1 사각형을 그대로 화면에 그리는 직교 카메라
		// (포스트프로세싱/풀스크린 셰이더에서 흔히 쓰는 패턴)
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
		camera.position.set(0, 0, 1);


		// [점 필드(풀스크린 셰이더)]
		// 아래 uniforms 값들은 JS → GLSL(셰이더)로 전달되는 파라미터입니다.
		// 셰이더 안에서 “점의 배치/크기/마우스 영향/색상”을 결정합니다.

		const uniforms = {
			// 셰이더 애니메이션용 시간(초). 매 프레임 증가
			u_time: { value: 0 },

			// 마우스 위치(NDC: -1..1). 셰이더에서 px 좌표로 변환해서 사용
			u_mouse: { value: new THREE.Vector2(0, 0) },

			// 스크롤 정규화 값(0..1). 미세 드리프트/움직임에 사용
			u_scroll: { value: 0 },

			// 현재 화면 해상도(디바이스 픽셀). gl_FragCoord와 맞추기 위해 dpr 반영
			u_resolution: { value: new THREE.Vector2(window.innerWidth * dpr, window.innerHeight * dpr) },

			// [전체 화면에 깔린 기본 점 색상]
			// "점 자체"의 기본색입니다. (배경색(scene.background)과는 별개)
			u_baseColor: { value: hexToLinearRGB("#fbfbfb") },

			// [마우스 근처에서 섞일 강조 색상]
			// "마우스 주변 왜곡(워프)" 버전에서는, 마우스 주변 점들만 이 색으로 물듭니다.
			u_color: { value: hexToLinearRGB("#1857D2") },

			// 전체 효과 강도(저사양/접근성 모드에서 낮춤)
			u_strength: { value: isLowPower ? 0.6 : 1.0 }, // 1.0이 기본값. 낮추면(예: 0.6) 마우스 워프/드리프트/색 틴트가 전반적으로 약해져서 덜 역동적으로 보임
			u_spacing: { value: isLowPower ? 10.0 : 10.0 }, // 점 사이 간격(px). 작을수록 점이 더 촘촘해짐
			u_dotSize: { value: isLowPower ? 5.0 : 5.0 }, // 점 크기(px). 사각 점 기준으로 대략 10x10 느낌

			// [마우스 주변 왜곡(워프) 파라미터]
			u_warp: { value: isLowPower ? 10.0 : 10.0 }, // px: 마우스 주변이 휘는 정도(클수록 더 크게 휘어짐)
			u_range: { value: isLowPower ? 2.0 : 3.2 }, // 배수: 마우스 영향 반경(클수록 범위 넓어짐)
		};

		
		// 2x2 Plane을 그리면, Orthographic 카메라에서 화면 전체를 딱 덮는 사각형(쿼드)이 됩니다.
		// 점의 “갯수”는 geometry가 아니라 fragment shader에서 픽셀 단위로 계산됩니다.
		const dotGeo = new THREE.PlaneGeometry(2, 2);
		const dotMat = new THREE.ShaderMaterial({
			uniforms,
			transparent: true,
			depthWrite: false,
			blending: THREE.NormalBlending,
			toneMapped: false,
			vertexShader: `
				// vertex shader는 여기서 “특별한 계산”을 하지 않습니다.
				// 그냥 풀스크린 쿼드를 클립공간(-1..1)에 그대로 찍어주는 역할만 합니다.
				void main() {
					gl_Position = vec4(position.xy, 0.0, 1.0);
				}
			`,
			fragmentShader: `
				uniform float u_time;
				uniform vec2 u_mouse; // NDC (-1..1). JS에서 전달된 마우스 위치
				uniform float u_scroll;
				uniform vec2 u_resolution;
				uniform vec3 u_baseColor;
				uniform vec3 u_color;
				uniform float u_strength;
				uniform float u_spacing;
				uniform float u_dotSize;
				uniform float u_warp;
				uniform float u_range;

				// 간단한 난수(해시) 함수: 셀(cell) 단위로 jitter/움직임 랜덤성을 주기 위해 사용
				float hash(vec2 p) {
					return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
				}

				// 2채널 난수
				vec2 hash2(vec2 p) {
					float n = hash(p);
					return vec2(n, hash(p + 17.0));
				}

				void main() {
					// res: 현재 화면 크기(px). 0으로 나누는 상황 방지용 max 처리
					vec2 res = max(u_resolution, vec2(1.0));

					// p: 현재 픽셀 좌표(px). gl_FragCoord는 왼쪽 아래가 (0,0)
					vec2 p = gl_FragCoord.xy;

					// 마우스 좌표(NDC) → UV(0..1) → px
					vec2 mouseUv = vec2(u_mouse.x * 0.5 + 0.5, u_mouse.y * 0.5 + 0.5);
					vec2 mousePx = mouseUv * res;

					// 아주 약한 드리프트(고정 패턴처럼 보이지 않게)
					float drift = (sin((p.x + p.y) * 0.004 + u_scroll * 6.2831 + u_time * 0.35)) * 0.65;
					p += vec2(drift, -drift) * (0.55 + 0.45 * u_strength);

					// 마우스 주변 워프(왜곡): 마우스 중심에서 바깥쪽으로 "밀어내는" 형태로 휘어짐
					vec2 toMouse = p - mousePx;
					float d = length(toMouse);
					float sigma = u_spacing * max(1.8, u_range) * 6.0; // px 기준(범위 크게)
					float falloff = exp(-(d * d) / (2.0 * sigma * sigma));
					vec2 dir = d > 0.001 ? (toMouse / d) : vec2(0.0);
					vec2 warped = p + dir * falloff * u_warp * u_strength;

					/**
					 * 점 배치 방식:
					 * - 화면을 spacing(px) 격자로 나누고
					 * - 각 격자의 가운데(center)에 점을 하나 둡니다.
					 */
					float spacing = max(8.0, u_spacing);
					vec2 cell = floor(warped / spacing);
					vec2 center = (cell + 0.5) * spacing;

					/**
					 * 셀(cell)마다 난수 기반 jitter를 줘서
					 * 완벽히 규칙적인 격자보다 “살짝 살아있는” 느낌을 만듭니다.
					 */
					vec2 rnd = hash2(cell);
					float t = u_time * 0.6 + rnd.x * 6.2831853;
					// 너무 “일렁이는” 느낌이 나지 않도록 jitter는 아주 약하게만 유지
					vec2 jitter = (rnd - 0.5) * (spacing * 0.06);
					jitter += vec2(sin(t), cos(t)) * (spacing * 0.02);
					center += jitter;

					/**
					 * 사각 점 마스크:
					 * warped 좌표가 center로부터 얼마나 떨어졌는지(dxy)를 보고
					 * halfSize 범위 안이면 점(불투명), 밖이면 투명하게 만듭니다.
					 * edge를 두어서 경계가 살짝 부드럽게 페이드되도록 처리합니다.
					 */
					vec2 dxy = abs(warped - center);
					float halfSize = max(1.0, u_dotSize) * 0.5;
					float edge = 2.0; // softness (px)
					float ax = smoothstep(halfSize, halfSize - edge, dxy.x);
					float ay = smoothstep(halfSize, halfSize - edge, dxy.y);
					float dotA = ax * ay;

					/**
					 * [전체 깔린 점 색상(기본색)]
					 * u_baseColor가 “평소에 화면 전체에 깔려있는 점”의 기본 색입니다.
					 * (배경이 흰색이므로, 너무 진하면 점이 과하게 튀고 너무 연하면 안 보입니다)
					 */
					vec3 base = u_baseColor;

					// 마우스 근처는 블루로, 멀어질수록 기본색으로(워프 범위와 동일한 falloff 사용)
					float ink = smoothstep(0.08, 0.85, falloff);
					vec3 col = mix(base, u_color, ink);

					/**
					 * 비네트(가장자리 살짝 눌러주기):
					 * 페이지 텍스트 가독성을 위해 화면 가장자리를 아주 약하게만 처리합니다.
					 */
					// 비네트(가장자리 살짝 눌러주기)
					vec2 uv = gl_FragCoord.xy / res;
					vec2 q = uv * 2.0 - 1.0;
					float v = smoothstep(1.25, 0.25, length(q));
					col *= mix(0.92, 1.0, v);

					// 최종 알파(투명도): 점 자체는 불투명하게 유지(흐려짐 최소화)
					float a = dotA;
					gl_FragColor = vec4(col, a);
					#include <tonemapping_fragment>
					#include <colorspace_fragment>
				}
			`,
		});

		// dotField: 화면 전체에 고정된 “점 셰이더” 오브젝트(프러스텀 컬링 끔 = 항상 그림)
		const dotField = new THREE.Mesh(dotGeo, dotMat);
		dotField.frustumCulled = false;
		scene.add(dotField);

		/**
		 * ---- 입력(인터랙션) ----
		 * pointermove: 마우스/터치/펜 모두 지원. 좌표를 NDC(-1..1)로 변환해서 저장합니다.
		 * 주의: 캔버스는 pointerEvents: "none"이라 UI 클릭에는 영향 없음(배경 전용)
		 */
		const handlePointerMove = (e: PointerEvent) => {
			const x = (e.clientX / window.innerWidth) * 2 - 1;
			const y = -((e.clientY / window.innerHeight) * 2 - 1);
			mouseTargetRef.current.set(x, y);
		};
		window.addEventListener("pointermove", handlePointerMove, { passive: true });

		/**
		 * 스크롤은 페이지 전체 높이를 기준으로 0..1로 정규화합니다.
		 * (페이지 길이가 달라져도 같은 스케일로 효과를 줄 수 있음)
		 */
		const updateScrollTarget = () => {
			const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
			scrollTargetRef.current = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
		};
		updateScrollTarget();
		window.addEventListener("scroll", updateScrollTarget, { passive: true });

		/**
		 * 리사이즈 시:
		 * - renderer 크기 업데이트
		 * - u_resolution 업데이트(셰이더가 해상도에 맞게 다시 계산하도록)
		 */
		const handleResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			const pd = Math.min(2, window.devicePixelRatio || 1);
			renderer.setPixelRatio(pd);
			renderer.setSize(width, height);
			uniforms.u_resolution.value.set(width * pd, height * pd);
		};
		window.addEventListener("resize", handleResize);

		/**
		 * ---- 보일 때만 렌더링 ----
		 * 페이지가 화면에 없는데도 계속 requestAnimationFrame을 돌리면 낭비라,
		 * IntersectionObserver로 root가 보일 때만 애니메이션을 돌립니다.
		 */
		const visibilityObserver = new IntersectionObserver(
			(entries) => {
				const isVisible = entries.some((en) => en.isIntersecting);
				visibleRef.current = isVisible;
				if (isVisible && rafRef.current == null) animate();
				if (!isVisible && rafRef.current != null) {
					window.cancelAnimationFrame(rafRef.current);
					rafRef.current = null;
				}
			},
			{ threshold: 0.05 },
		);
		if (rootRef.current) visibilityObserver.observe(rootRef.current);

		/**
		 * ---- 애니메이션 루프 ----
		 * - dt(프레임 간 시간)를 이용해 시간/보간을 “프레임레이트 독립적”으로 처리
		 * - 마우스/스크롤은 즉시 반영 대신 부드럽게 따라가게(lerp) 해서 고급스러운 느낌
		 */
		const clock = new THREE.Clock();
		// (워프 버전) rAF 루프는 uniforms 업데이트 + 렌더만 수행합니다.

		const animate = () => {
			if (!visibleRef.current) return;
			rafRef.current = window.requestAnimationFrame(animate);

			// dt: 이번 프레임까지 경과 시간(초)
			const dt = clock.getDelta();
			uniforms.u_time.value += dt;

			// 마우스: 목표값(mouseTarget) → 현재값(mouseNdc)로 부드럽게 수렴
			mouseNdcRef.current.lerp(mouseTargetRef.current, 1 - Math.pow(0.001, dt));
			uniforms.u_mouse.value.copy(mouseNdcRef.current);

			// 스크롤: 목표값(scrollTarget) → 현재값(scrollRef)로 부드럽게 수렴
			scrollRef.current = THREE.MathUtils.lerp(
				scrollRef.current,
				scrollTargetRef.current,
				1 - Math.pow(0.001, dt),
			);
			uniforms.u_scroll.value = scrollRef.current;

			// 최종 렌더링(풀스크린 쿼드 1장만 그림)
			renderer.render(scene, camera);
		};
		animate();

		/**
		 * ---- 정리(Cleanup) ----
		 * Next/React에서 컴포넌트가 언마운트되거나 의존성이 바뀔 때 호출됩니다.
		 * 이벤트 리스너/옵저버/애니메이션/리소스를 정리하지 않으면 메모리 누수나 중복 실행이 생길 수 있습니다.
		 */
		return () => {
			visibilityObserver.disconnect();

			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("scroll", updateScrollTarget);
			window.removeEventListener("resize", handleResize);

			// rAF 중지
			if (rafRef.current != null) {
				window.cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}

			// GPU 리소스 해제
			dotGeo.dispose();
			dotMat.dispose();

			// 렌더러 해제
			renderer.dispose();

			// DOM에서 캔버스 제거
			const canvas = renderer.domElement;
			if (canvas.parentElement) canvas.parentElement.removeChild(canvas);
		};
	}, []);

  return (
		<div ref={rootRef} style={{ position: "relative", height: "100vh" }}>
			{/* WebGL 배경(점 필드). position:fixed로 화면 전체에 깔고, pointerEvents:none으로 UI 클릭 방해 안 함 */}
			
			<div
				ref={mountRef}
				aria-hidden="true"
				style={{
					position: "fixed",
					inset: 0,
					width: "100vw",
					height: "100vh",
					overflow: "hidden",
					zIndex: 0,
					pointerEvents: "none",
				}}
			></div>


			</div>

  );
}