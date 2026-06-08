"use client";

import * as THREE from "three";
import { useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, useBox, usePlane, useSphere, Triplet } from "@react-three/cannon";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { ColorPalette } from "./ColorPalette";

const pointerState = { down: false, x: 0, y: 0, z: 2.5, ndcX: 0, ndcY: 0 };

const baubleMaterial = new THREE.MeshLambertMaterial({
  color: "#0322ab",
  emissive: "#010a4d",
});
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sizeSteps = [1.6, 1.2, 0.85]; // 엄청 큰, 큰, 기본

function Bauble({ vec = new THREE.Vector3(), ...props }: { vec?: THREE.Vector3;[key: string]: unknown }) {
  const [ref, api] = useBox(() => ({
    ...props,
    args: [props.args, props.args, props.args] as Triplet,
  }));

  useEffect(() => {
    const unsubscribe = api.position.subscribe((p) => {
      if (pointerState.down) {
        vec.set(pointerState.x - p[0], pointerState.y - p[1], pointerState.z - p[2]);
        const dist = vec.length();
        if (dist > 0.05) vec.normalize().multiplyScalar(props.args * Math.min(120, 40 + dist * 18));
        api.applyForce(vec.toArray(), [0, 0, 0]);
      } else {
        api.applyForce(vec.set(...p).normalize().multiplyScalar(-props.args * 35).toArray(), [0, 0, 0]);
      }
    });
    return () => unsubscribe();
  }, [api, props.args, vec]);

  return (
    <group ref={ref as React.Ref<THREE.Group>}>
      <mesh
        castShadow
        receiveShadow
        scale={props.args}
        geometry={boxGeometry}
        material={baubleMaterial}
      />
    </group>
  );
}

function PointerInput() {
  const viewport = useThree((state) => state.viewport);

  useEffect(() => {
    const setDown = (down: boolean) => {
      pointerState.down = down;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.button === 0) setDown(true);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.button === 0) setDown(false);
    };
    const onPointerMove = (e: PointerEvent) => {
      pointerState.ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerState.ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onBlur = () => setDown(false);

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  useFrame((state) => {
    const ndcX = pointerState.ndcX || state.pointer.x; // state.mouse.x is deprecated in newer R3F, replaced with state.pointer.x
    const ndcY = pointerState.ndcY || state.pointer.y;
    pointerState.x = (ndcX * viewport.width) / 2;
    pointerState.y = (ndcY * viewport.height) / 2;
    pointerState.z = 2.5;
  });

  return null;
}

function Collisions() {
  usePlane(() => ({ position: [0, 0, 0], rotation: [0, 0, 0] }));
  usePlane(() => ({ position: [0, 0, 8], rotation: [0, -Math.PI, 0] }));
  usePlane(() => ({ position: [0, -4, 0], rotation: [-Math.PI / 2, 0, 0] }));
  usePlane(() => ({ position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] }));
  const [, api] = useSphere(() => ({ type: "Kinematic", args: [2] }));

  useFrame(() => api.position.set(pointerState.x, pointerState.y, pointerState.z));
  return null;
}

function Underlay() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 2,
        width: "100%",
        height: "100%",
        padding: 40,
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        pointerEvents: "none",
      }}
    >
      <div style={{ width: "100%", padding: 0, display: "inline-flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <p
          style={{
            // fontFamily: "'Antonio', sans-serif",
            flex: "1 1 0%",
            height: 30,
            fontSize: 30,
            fontWeight: "700",
            lineHeight: "30px",
            color: "black",
            letterSpacing: -2,
          }}
        >
          2taeyoon.com
        </p>
        <div style={{ flex: "1 1 0%", display: "flex", gap: "2em" }}>
          <p
            className="full"
            style={{ flex: "1 1 0%", height: 12, fontSize: 12, lineHeight: "12px", textAlign: "center", color: "black", whiteSpace: "nowrap" }}
          >
            HOME
          </p>
          <p className="full" style={{ flex: "1 1 0%", height: 12, fontSize: 12, lineHeight: "12px", textAlign: "center", color: "black" }}>
            ABOUT
          </p>
          <p className="full" style={{ flex: "1 1 0%", height: 12, fontSize: 12, lineHeight: "12px", textAlign: "center", color: "black" }}>
            PROJECT
          </p>
          <p className="full" style={{ flex: "1 1 0%", height: 12, fontSize: 12, lineHeight: "12px", textAlign: "center", color: "black" }}>
            SKILL
          </p>
        </div>
        <p style={{ flex: "1 1 0%", height: 30, fontSize: 30, lineHeight: "30px", textAlign: "right", color: "black" }}>⎑</p>
      </div>
      <div style={{ height: 60 }} />
      <div style={{ width: "100%", padding: 0, display: "inline-flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "center" }}>
        <p style={{ flex: "1 1 0%", height: "100%", fontSize: 12, lineHeight: "1.5em", color: "black" }}>
          A front-end developer with a sense of design
          <br />
          <b>—</b>
        </p>
        <div style={{ width: 10 }} />
      </div>
      <div style={{ height: 10 }} />
      <div
        className="full"
        style={{
          // fontFamily: "'Antonio', sans-serif",
          width: "100%",
          flex: "1 1 0%",
          padding: 0,
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <p style={{ flex: "1 1 0%", fontSize: 250, lineHeight: "1em", color: "black", margin: 0, letterSpacing: -10 }}>FRONT</p>
        <div style={{ width: 10 }} />
        <p style={{ flex: "1 1 0%", fontSize: 250, lineHeight: "100%", textAlign: "right", color: "black", margin: 0, letterSpacing: -10 }}>END</p>
      </div>
      <div style={{ height: 60 }} />
      <div
        style={{
          pointerEvents: "all",
          cursor: "auto",
          width: "100%",
          padding: 0,
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <p className="full" style={{ whiteSpace: "nowrap", flex: "1 1 0%", fontSize: 12, lineHeight: "1.5em", color: "black" }}>
          Designer
          <br />
          Publisher
          <br />
          Developer
        </p>
        <div style={{ width: 10 }} />
        <p
          className="full"
          style={{
            // fontFamily: "'Antonio', sans-serif",
            flex: "1 1 0%",
            fontSize: 16,
            fontWeight: "700",
            lineHeight: "1em",
            textAlign: "center",
            color: "black",
            letterSpacing: -0.5,
            whiteSpace: "nowrap",
          }}
        >
          Move and drag the mouse
        </p>
        <div style={{ width: 10 }} />
        <p className="full" style={{ flex: "1 1 0%", fontSize: 12, lineHeight: "1em", textAlign: "right", color: "black" }}></p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div style={{ position: "absolute", bottom: 40, right: 40, zIndex: 3 }}>
      <p style={{ flex: "1 1 0%", fontSize: 12, lineHeight: "1em", textAlign: "right", color: "black" }}>
        <a href="https://github.com/2taeyoon" target="_blank" rel="noreferrer">github</a>
      </p>
    </div>
  );
}

export default function MainSection() {
  const [ballColor, setBallColor] = useState("gradient");

  // Create baubles once
  const baubles = useMemo(() => {
    return [...Array(50)].map(() => ({
      args: sizeSteps[Math.floor(Math.random() * sizeSteps.length)],
      mass: 1,
      angularDamping: 0.2,
      linearDamping: 0.95,
    }));
  }, []);

  useEffect(() => {
    if (ballColor === "gradient") {
      const canvas = document.createElement("canvas");
      canvas.width = 2;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      if (context) {
        const gradient = context.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, "#b21210");
        gradient.addColorStop(1, "#0033ff");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 2, 256);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;

      baubleMaterial.map = texture;
      baubleMaterial.emissiveMap = texture;
      baubleMaterial.color.setHex(0xffffff);
      baubleMaterial.emissive.setHex(0xffffff).multiplyScalar(0.2);
      baubleMaterial.needsUpdate = true;
    } else {
      baubleMaterial.map = null;
      baubleMaterial.emissiveMap = null;
      const c = new THREE.Color(ballColor);
      baubleMaterial.color.copy(c);
      baubleMaterial.emissive.copy(c).multiplyScalar(0.2);
      baubleMaterial.needsUpdate = true;
    }
  }, [ballColor]);

  return (
    <div className="main-section-container">
      <Underlay />
      <ColorPalette value={ballColor} onChange={setBallColor} />

      <Canvas
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
        shadows
        dpr={1.5}
        gl={{ alpha: true, stencil: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 35, near: 10, far: 40 }}
        onCreated={(state) => {
          state.gl.toneMappingExposure = 1.7;
        }}
      >
        <ambientLight intensity={1.0 * Math.PI} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
          intensity={Math.PI}
        />
        <directionalLight position={[0, 5, -4]} intensity={4.5 * Math.PI} />
        <directionalLight position={[0, -15, -0]} intensity={1.5 * Math.PI} color="red" />
        <Physics gravity={[0, 0, 0]} iterations={10} broadphase="SAP">
          <PointerInput />
          <Collisions />
          {baubles.map((props, i) => (
            <Bauble key={i} {...props} />
          ))}
        </Physics>
        <Environment files="/adamsbridge.hdr" />
        <EffectComposer disableNormalPass={false} multisampling={0}>
          <N8AO aoRadius={2} intensity={10} luminanceInfluence={0.6} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Canvas>
      <Overlay />
    </div>
  );
}
