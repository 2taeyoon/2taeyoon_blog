"use client";

import * as THREE from "three";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Billboard, Text, TrackballControls } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SKILL_CATEGORIES } from "@/data/portfolio/skills";

gsap.registerPlugin(ScrollTrigger);

/** 참조 샌드박스(App.js)와 동일 — public/Inter-Bold.ttf */
const WORD_FONT = "/Inter-Bold.ttf";

/** 카테고리별 포인트 컬러 (범례 점 표시용) */
const CATEGORY_COLORS: Record<string, string> = {
  design: "#de7c3a",
  frontend: "#27407c",
  backend: "#0322ab",
  devtools: "#631e76",
};

/** 배경에 떠다니는 와이어프레임 도형들 — 마우스 패럴랙스 반응 */
function FloatingShapes() {
  const gl = useThree((state) => state.gl);
  const parallaxRef = useRef<THREE.Group>(null);
  const shapesRef = useRef<THREE.Group>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const shapes = useMemo(
    () =>
      [...Array(12)].map((_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        return {
          position: [
            side * (7 + Math.random() * 8),
            (Math.random() - 0.5) * 9,
            -3 - Math.random() * 5,
          ] as [number, number, number],
          scale: 0.5 + Math.random() * 1.1,
          rotationSpeed: 0.1 + Math.random() * 0.25,
          floatSpeed: 0.4 + Math.random() * 0.6,
          floatOffset: Math.random() * Math.PI * 2,
          parallax: 0.4 + Math.random() * 0.8,
          isBox: i % 3 !== 0,
          color: i % 4 === 0 ? "#de7c3a" : "#27407c",
        };
      }),
    [],
  );

  useEffect(() => {
    const canvas = gl.domElement;
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) return;
      pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [gl]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const pointer = pointerRef.current;

    if (parallaxRef.current) {
      const lerp = 1 - Math.exp(-delta * 4);
      parallaxRef.current.rotation.x += (pointer.y * 0.18 - parallaxRef.current.rotation.x) * lerp;
      parallaxRef.current.rotation.y += (pointer.x * 0.24 - parallaxRef.current.rotation.y) * lerp;
    }

    if (shapesRef.current) {
      shapesRef.current.children.forEach((child, i) => {
        const shape = shapes[i];
        child.rotation.x = t * shape.rotationSpeed;
        child.rotation.y = t * shape.rotationSpeed * 1.4;
        child.position.x = shape.position[0] + pointer.x * shape.parallax;
        child.position.y =
          shape.position[1] + Math.sin(t * shape.floatSpeed + shape.floatOffset) * 0.5 + pointer.y * shape.parallax * 0.7;
      });
    }
  });

  return (
    <group ref={parallaxRef}>
      <group ref={shapesRef}>
        {shapes.map((shape, i) => (
          <mesh key={i} position={shape.position} scale={shape.scale}>
            {shape.isBox ? <boxGeometry args={[1, 1, 1]} /> : <icosahedronGeometry args={[0.7, 0]} />}
            <meshBasicMaterial color={shape.color} wireframe transparent opacity={0.22} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** 참조 App.js Word 컴포넌트와 동일 */
function Word({ children, ...props }: { children: string; position: THREE.Vector3 }) {
  const color = useMemo(() => new THREE.Color(), []);
  const fontProps = {
    font: WORD_FONT,
    fontSize: 2.5,
    letterSpacing: -0.05,
    lineHeight: 1,
    "material-toneMapped": false,
  } as const;
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  };
  const out = () => setHovered(false);

  useEffect(() => {
    if (hovered) document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useFrame(() => {
    const material = ref.current?.material as THREE.MeshBasicMaterial | undefined;
    material?.color.lerp(color.set(hovered ? "#fa2720" : "white"), 0.1);
  });

  return (
    <Billboard {...props}>
      <Text ref={ref} onPointerOver={over} onPointerOut={out} {...fontProps}>{children}</Text>
    </Billboard>
  );
}

/** 참조 App.js Cloud 컴포넌트와 동일 — count×count 구면 격자 분포 */
function Cloud({ count = 8, radius = 20 }: { count?: number; radius?: number }) {
  const words = useMemo(() => {
    const skills = SKILL_CATEGORIES.flatMap((category) => category.skills);
    const temp: [THREE.Vector3, string][] = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;
    let index = 0;
    for (let i = 1; i < count + 1; i += 1)
      for (let j = 0; j < count; j += 1)
        temp.push([
          new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)),
          skills[index++ % skills.length],
        ]);
    return temp;
  }, [count, radius]);

  return (
    <>
      {words.map(([pos, word], index) => (
        <Word key={index} position={pos}>{word}</Word>
      ))}
    </>
  );
}

/** 참조 App.js Canvas와 동일한 단어 구름 */
function SkillCloudCanvas() {
  return (
    <Canvas dpr={[1, 2]} gl={{ alpha: false, antialias: true }} camera={{ position: [0, 0, 35], fov: 90 }}>
      <color attach="background" args={["#202025"]} />
      <fog attach="fog" args={["#202025", 0, 80]} />
      <Suspense fallback={null}>
        <group rotation={[10, 10.5, 10]}>
          <Cloud count={8} radius={20} />
        </group>
      </Suspense>
      <TrackballControls noZoom noPan rotateSpeed={1.1} />
    </Canvas>
  );
}

export default function SkillSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skill_header", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".skill_header", start: "top 85%" },
      });

      gsap.from(".skill_legend_item", {
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".skill_legend", start: "top 88%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="skill_section">
      <div className="skill_bg_canvas">
        <Canvas dpr={1} gl={{ alpha: true, antialias: false }} camera={{ position: [0, 0, 8], fov: 40 }}>
          <FloatingShapes />
        </Canvas>
      </div>

      <div className="skill_inner">
        <div className="skill_header">
          <span className="skill_tag">SKILL</span>
          <h2 className="skill_title">What I can do</h2>
          <p className="skill_desc">디자인부터 프론트, 백엔드, 개발 도구까지 — 제가 다루는 스택입니다. 드래그해서 돌려보세요.</p>
        </div>

        <ul className="skill_legend">
          {SKILL_CATEGORIES.map((category) => (
            <li key={category.id} className="skill_legend_item">
              <span className="skill_legend_dot" style={{ backgroundColor: CATEGORY_COLORS[category.id] }} />
              <span className="skill_legend_label">{category.label}</span>
              <span className="skill_legend_count">{category.skills.length}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="skill_cloud">
        <SkillCloudCanvas />
      </div>
    </section>
  );
}
