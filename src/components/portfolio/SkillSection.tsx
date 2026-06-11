"use client";

import * as THREE from "three";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SKILL_CATEGORIES } from "@/data/portfolio/skills";

gsap.registerPlugin(ScrollTrigger);

/** 배경에 떠다니는 와이어프레임 도형들 */
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  const shapes = useMemo(
    () =>
      [...Array(9)].map((_, i) => ({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 6,
          -2 - Math.random() * 4,
        ] as [number, number, number],
        scale: 0.5 + Math.random() * 1.1,
        rotationSpeed: 0.1 + Math.random() * 0.25,
        floatSpeed: 0.4 + Math.random() * 0.6,
        floatOffset: Math.random() * Math.PI * 2,
        isBox: i % 3 !== 0,
        color: i % 4 === 0 ? "#de7c3a" : "#27407c",
      })),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const shape = shapes[i];
      child.rotation.x = t * shape.rotationSpeed;
      child.rotation.y = t * shape.rotationSpeed * 1.4;
      child.position.y = shape.position[1] + Math.sin(t * shape.floatSpeed + shape.floatOffset) * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position} scale={shape.scale}>
          {shape.isBox ? <boxGeometry args={[1, 1, 1]} /> : <icosahedronGeometry args={[0.7, 0]} />}
          <meshBasicMaterial color={shape.color} wireframe transparent opacity={0.22} />
        </mesh>
      ))}
    </group>
  );
}

export default function SkillSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const enterReverse = {
        start: "top bottom",
        toggleActions: "play none none reverse",
      } as const;

      gsap.from(".skill_header", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".skill_header", ...enterReverse },
      });

      gsap.utils.toArray<HTMLElement>(".skill_category").forEach((category) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: category, ...enterReverse },
        });

        tl.from(category.querySelector(".skill_category_label"), {
          x: -40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        }).from(
          category.querySelectorAll(".skill_chip"),
          {
            opacity: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.4",
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="skill_section">
      <div className="skill_canvas">
        <Canvas dpr={1} gl={{ alpha: true, antialias: false }} camera={{ position: [0, 0, 8], fov: 40 }}>
          <FloatingShapes />
        </Canvas>
      </div>

      <div className="skill_inner">
        <div className="skill_header">
          <span className="skill_tag">SKILL</span>
          <h2 className="skill_title">What I can do</h2>
          {/* <p className="skill_desc">디자인부터 프론트, 백엔드, 개발 도구까지 — 제가 다루는 스택입니다.</p> */}
        </div>

        <div className="skill_category_list">
          {SKILL_CATEGORIES.map((category) => (
            <div key={category.id} className="skill_category">
              <h3 className="skill_category_label">{category.label}</h3>
              <div className="skill_chip_wrap">
                {category.skills.map((skill) => (
                  <span key={skill} className="skill_chip">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
