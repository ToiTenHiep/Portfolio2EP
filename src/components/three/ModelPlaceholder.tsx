"use client";

import { Component, Suspense, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Đặt file con tàu đã export từ Blender tại:
 * public/models/sci-fi-ship.glb
 */
const SHIP_URL = "/models/sci-fi-ship.glb";

/**
 * Chỉnh nhanh model ở đây.
 */
const SHIP_SCALE = 1.45;
const SHIP_ROTATION: [number, number, number] = [0, -Math.PI / 4, 0];
const SHIP_POSITION: [number, number, number] = [0, 0, 0];

/**
 * Auto rotate / floating.
 */
const AUTO_ROTATE_SPEED = 0.55;
const FLOAT_HEIGHT = 0.06;
const FLOAT_SPEED = 1.3;

/**
 * Highlight ánh sáng quét xuyên qua con tàu.
 */
const SHOW_SWEEP_HIGHLIGHT = true;
const SWEEP_SPEED = 1;
const SWEEP_RANGE = 2;

/**
 * Cứ 5s model bị nhiễu tín hiệu mạnh trong thời gian ngắn.
 * Không scale/phóng to model, chỉ giật vị trí + lệch màu + vạch nhiễu.
 */
const SHOW_SIGNAL_GLITCH = true;
const GLITCH_INTERVAL = 5;
const GLITCH_DURATION = 0.4;
const GLITCH_SHAKE_X = 0.1;
const GLITCH_SHAKE_Y = 0.1;
const GLITCH_SHAKE_Z = 0.1;
const GLITCH_ROTATION_SHAKE = 0.045;

/**
 * Vòng tròn projector phía dưới tàu + cột sáng chiếu lên.
 */
const SHOW_HOLOGRAM_PROJECTOR = true;
const PROJECTOR_OFFSET_Y = -2;
const PROJECTOR_RING_RADIUS = 0.5;
const PROJECTOR_RING_TUBE = 0.026;
const PROJECTOR_BEAM_HEIGHT = 1.15;
const PROJECTOR_BEAM_BOTTOM_RADIUS = 0.42;
const PROJECTOR_BEAM_TOP_RADIUS = 0.8;

/**
 * Bảng màu theo yêu cầu.
 */
const COLORS = {
  plane: "#ff0049",
  line: "#00ffee",
  rocketBack: "#00ffee",
  glass: "#ffffff",
};

const OPACITY = {
  plane: 0.2,
  line: 0.5,
  rocketBack: 1,
  glass: 0.5,
};

const EDGE_THRESHOLD_ANGLE = 18;

type PartType = "plane" | "line" | "rocketBack" | "glass";

type ModelErrorBoundaryProps = {
  children: ReactNode;
};

type ModelErrorBoundaryState = {
  hasError: boolean;
};

class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn(
      "Không tìm thấy model. Hãy export Blender sang .glb và đặt tại public/models/sci-fi-ship.glb",
      error,
    );
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function normalizeName(value?: string) {
  return (value ?? "").toLowerCase().replace(/[\s_\-.]+/g, "");
}

function includesAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function getObjectSearchText(object: THREE.Object3D, material?: THREE.Material) {
  const materialName = normalizeName(material?.name);
  const objectName = normalizeName(object.name);
  const parentName = normalizeName(object.parent?.name);
  return `${objectName} ${materialName} ${parentName}`;
}

function detectPartType(object: THREE.Object3D, material?: THREE.Material): PartType {
  const text = getObjectSearchText(object, material);

  if (
    includesAny(text, [
      "glass",
      "window",
      "canopy",
      "cockpit",
      "windshield",
      "screen",
      "visor",
      "kinh",
      "kính",
    ])
  ) {
    return "glass";
  }

  if (
    includesAny(text, [
      "engine",
      "thruster",
      "rocket",
      "back",
      "rear",
      "exhaust",
      "flame",
      "booster",
      "jet",
      "tail",
      "nozzle",
      "afterburner",
      "tenlua",
      "tênlửa",
    ])
  ) {
    return "rocketBack";
  }

  if (
    includesAny(text, [
      "line",
      "edge",
      "wire",
      "stroke",
      "outline",
      "border",
      "contour",
      "vien",
      "viền",
    ])
  ) {
    return "line";
  }

  return "plane";
}

function createPlaneMaterial() {
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(COLORS.plane),
    emissive: new THREE.Color(COLORS.plane),
    emissiveIntensity: 0.32,
    metalness: 0.42,
    roughness: 0.34,
    transparent: true,
    opacity: OPACITY.plane,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: true,
  });

  material.toneMapped = false;
  return material;
}

function createRocketBackMaterial() {
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(COLORS.rocketBack),
    emissive: new THREE.Color(COLORS.rocketBack),
    emissiveIntensity: 0.85,
    metalness: 0.18,
    roughness: 0.22,
    transparent: true,
    opacity: OPACITY.rocketBack,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: true,
  });

  material.toneMapped = false;
  return material;
}

function createGlassMaterial() {
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(COLORS.glass),
    emissive: new THREE.Color(COLORS.glass),
    emissiveIntensity: 0.12,
    metalness: 0,
    roughness: 0.05,
    transmission: 0.18,
    thickness: 0.28,
    transparent: true,
    opacity: OPACITY.glass,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: true,
  });

  material.toneMapped = false;
  return material;
}

function createCyanMeshMaterial() {
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(COLORS.line),
    transparent: true,
    opacity: OPACITY.line,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
  });

  material.toneMapped = false;
  return material;
}

function createLineMaterial() {
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(COLORS.line),
    transparent: true,
    opacity: OPACITY.line,
    depthWrite: false,
    depthTest: false,
  });

  material.toneMapped = false;
  return material;
}

function createMaterialByType(type: PartType) {
  if (type === "glass") return createGlassMaterial();
  if (type === "rocketBack") return createRocketBackMaterial();
  if (type === "line") return createCyanMeshMaterial();
  return createPlaneMaterial();
}

function addCyberEdges(mesh: THREE.Mesh<THREE.BufferGeometry>) {
  if (!mesh.geometry) return;

  const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry, EDGE_THRESHOLD_ANGLE);
  const edges = new THREE.LineSegments(edgesGeometry, createLineMaterial());
  edges.name = `${mesh.name || "mesh"}_cyan_edges`;
  edges.renderOrder = 999;
  edges.frustumCulled = false;
  mesh.add(edges);
}

function applyCyberShipMaterials(source: THREE.Group) {
  const scene = source.clone(true);

  scene.traverse((object) => {
    const line = object as THREE.LineSegments;

    if (line.isLine || line.isLineSegments) {
      line.material = createLineMaterial();
      line.renderOrder = 999;
      line.frustumCulled = false;
      return;
    }

    const mesh = object as THREE.Mesh<
      THREE.BufferGeometry,
      THREE.Material | THREE.Material[]
    >;

    if (!mesh.isMesh) return;

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;

    const oldMaterials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    const newMaterials = oldMaterials.map((oldMaterial) => {
      const type = detectPartType(mesh, oldMaterial);
      return createMaterialByType(type);
    });

    const mainType = detectPartType(mesh, oldMaterials[0]);

    mesh.material = Array.isArray(mesh.material) ? newMaterials : newMaterials[0];

    if (mainType === "line") {
      mesh.renderOrder = 900;
    } else if (mainType === "glass") {
      mesh.renderOrder = 12;
    } else if (mainType === "rocketBack") {
      mesh.renderOrder = 8;
    } else {
      mesh.renderOrder = 4;
    }

    addCyberEdges(mesh);
  });

  return scene;
}

function createGhostScene(source: THREE.Group, color: string, opacity: number) {
  const ghost = source.clone(true);

  ghost.traverse((object) => {
    const line = object as THREE.LineSegments;

    if (line.isLine || line.isLineSegments) {
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      });
      material.toneMapped = false;
      line.material = material;
      line.renderOrder = 1300;
      line.frustumCulled = false;
      return;
    }

    const mesh = object as THREE.Mesh<THREE.BufferGeometry>;
    if (!mesh.isMesh) return;

    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    material.toneMapped = false;

    mesh.material = material;
    mesh.renderOrder = 1250;
    mesh.frustumCulled = false;
  });

  return ghost;
}

function getGlitchPower(t: number) {
  if (!SHOW_SIGNAL_GLITCH) return 0;

  const age = t % GLITCH_INTERVAL;
  if (age > GLITCH_DURATION) return 0;

  const fadeOut = 1 - age / GLITCH_DURATION;
  const pulse = 0.55 + Math.abs(Math.sin(t * 92)) * 0.45;
  return fadeOut * pulse;
}

function steppedNoise(seed: number, t: number) {
  const step = Math.floor(t * 45);
  return (
    Math.sin(step * 12.9898 + seed * 78.233) * 0.5 +
    Math.sin(step * 4.1414 + seed * 19.17) * 0.5
  );
}

function ShipSweepHighlight() {
  const groupRef = useRef<THREE.Group>(null);
  const cyanMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const whiteMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const hotLineMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!SHOW_SWEEP_HIGHLIGHT || !groupRef.current) return;

    const t = clock.elapsedTime;
    const raw = (t * SWEEP_SPEED) % 1;
    const z = THREE.MathUtils.lerp(SWEEP_RANGE / 2, -SWEEP_RANGE / 2, raw);
    const edgeFade = Math.sin(raw * Math.PI);
    const flicker = 0.72 + Math.sin(t * 28) * 0.16 + Math.sin(t * 47) * 0.08;
    const opacityPower = THREE.MathUtils.clamp(edgeFade * flicker, 0, 1);

    groupRef.current.visible = true;
    groupRef.current.position.z = z;
    groupRef.current.rotation.z = Math.sin(t * 1.6) * 0.08;

    if (cyanMatRef.current) cyanMatRef.current.opacity = 0.12 * opacityPower;
    if (whiteMatRef.current) whiteMatRef.current.opacity = 0.58 * opacityPower;
    if (hotLineMatRef.current) hotLineMatRef.current.opacity = 0.92 * opacityPower;
    if (lightRef.current) lightRef.current.intensity = 1.8 * opacityPower;
  });

  if (!SHOW_SWEEP_HIGHLIGHT) return null;

  return (
    <group ref={groupRef} renderOrder={1100}>
      <mesh renderOrder={1100}>
        <planeGeometry args={[3.35, 1.72]} />
        <meshBasicMaterial
          ref={cyanMatRef}
          color={COLORS.line}
          transparent
          opacity={0.12}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.02, 0.01]} renderOrder={1110}>
        <planeGeometry args={[2.85, 0.11]} />
        <meshBasicMaterial
          ref={whiteMatRef}
          color="#ffffff"
          transparent
          opacity={0.58}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.02, 0.02]} renderOrder={1120}>
        <planeGeometry args={[3.05, 0.025]} />
        <meshBasicMaterial
          ref={hotLineMatRef}
          color={COLORS.line}
          transparent
          opacity={0.92}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        position={[0, 0.25, 0.35]}
        color={COLORS.line}
        intensity={1.8}
        distance={2.4}
      />
    </group>
  );
}

function HologramProjector() {
  const groupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.ShaderMaterial | null>(null);
  const baseGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const beamLightRef = useRef<THREE.PointLight>(null);

  const beamMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(COLORS.line) },
        uOpacity: { value: 0.34 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          float bottomFade = pow(1.0 - vUv.y, 1.15);
          float topFade = 1.0 - smoothstep(0.72, 1.0, vUv.y);
          float pulse = 0.88 + sin(vUv.y * 16.0 - uTime * 4.5) * 0.08;
          float edgeBoost = 0.76 + abs(sin(vUv.x * 18.0 + uTime * 2.0)) * 0.24;
          float alpha = bottomFade * topFade * pulse * edgeBoost * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    material.toneMapped = false;
    return material;
  }, []);

  useFrame(({ clock }) => {
    if (!SHOW_HOLOGRAM_PROJECTOR || !groupRef.current) return;

    const t = clock.elapsedTime;
    const pulse = 0.84 + Math.sin(t * 2.2) * 0.08 + Math.sin(t * 5.6) * 0.03;

    if (beamRef.current) {
      beamRef.current.uniforms.uTime.value = t;
      beamRef.current.uniforms.uOpacity.value = 0.3 + (pulse - 0.8) * 0.35;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += 0.01;
      outerRingRef.current.scale.setScalar(1 + Math.sin(t * 2.4) * 0.025);
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= 0.016;
      innerRingRef.current.scale.setScalar(1 + Math.sin(t * 3.2 + 0.8) * 0.045);
    }

    if (baseGlowRef.current) {
      baseGlowRef.current.opacity = 0.2 + Math.max(0, Math.sin(t * 2.6)) * 0.09;
    }

    if (beamLightRef.current) {
      beamLightRef.current.intensity = 1.3 + Math.max(0, Math.sin(t * 3.1)) * 0.55;
    }
  });

  if (!SHOW_HOLOGRAM_PROJECTOR) return null;

  return (
    <group ref={groupRef} position={[0, PROJECTOR_OFFSET_Y, 0]} renderOrder={1000}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={1000}>
        <circleGeometry args={[PROJECTOR_RING_RADIUS * 1.25, 48]} />
        <meshBasicMaterial
          ref={baseGlowRef}
          color={COLORS.line}
          transparent
          opacity={0.22}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1010}>
        <torusGeometry args={[PROJECTOR_RING_RADIUS, PROJECTOR_RING_TUBE, 16, 64]} />
        <meshBasicMaterial
          color={COLORS.line}
          transparent
          opacity={0.95}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1020}>
        <torusGeometry args={[PROJECTOR_RING_RADIUS * 0.62, PROJECTOR_RING_TUBE * 0.58, 12, 48]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.45}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, PROJECTOR_BEAM_HEIGHT / 2, 0]} renderOrder={1030}>
        <cylinderGeometry
          args={[
            PROJECTOR_BEAM_TOP_RADIUS,
            PROJECTOR_BEAM_BOTTOM_RADIUS,
            PROJECTOR_BEAM_HEIGHT,
            48,
            1,
            true,
          ]}
        />
        <primitive
          ref={beamRef}
          object={beamMaterial}
          attach="material"
        />
      </mesh>

      <mesh
        position={[0, PROJECTOR_BEAM_HEIGHT - 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={1040}
      >
        <ringGeometry args={[0.06, 0.16, 32]} />
        <meshBasicMaterial
          color={COLORS.line}
          transparent
          opacity={0.12}
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={beamLightRef}
        position={[0, 0.08, 0]}
        color={COLORS.line}
        intensity={1.4}
        distance={3.2}
      />
    </group>
  );
}

function SignalGlitchBars() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!SHOW_SIGNAL_GLITCH || !groupRef.current) return;

    const t = clock.elapsedTime;
    const power = getGlitchPower(t);
    const active = power > 0.035;

    groupRef.current.visible = active;
    if (!active) return;

    groupRef.current.children.forEach((child, index) => {
      const mesh = child as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
      const n1 = steppedNoise(index + 1, t);
      const n2 = steppedNoise(index + 11, t);
      const n3 = steppedNoise(index + 31, t);

      mesh.position.x = n1 * 0.23 * power;
      mesh.position.y = -0.82 + index * 0.17 + n2 * 0.055 * power;
      mesh.position.z = n3 * 0.18;
      mesh.scale.x = 0.55 + Math.abs(n2) * 1.25;
      mesh.rotation.z = n3 * 0.055;

      if (mesh.material) {
        mesh.material.opacity = (0.16 + Math.abs(n1) * 0.7) * power;
      }
    });
  });

  if (!SHOW_SIGNAL_GLITCH) return null;

  const bars = Array.from({ length: 11 }, (_, index) => {
    const color = index % 3 === 0 ? COLORS.plane : index % 3 === 1 ? COLORS.line : "#ffffff";
    const width = index % 2 === 0 ? 1.55 : 1.08;
    const height = index % 4 === 0 ? 0.028 : 0.018;

    return (
      <mesh key={index} renderOrder={1400} position={[0, -0.82 + index * 0.17, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    );
  });

  return (
    <group ref={groupRef} visible={false} renderOrder={1400}>
      {bars}
    </group>
  );
}

function ShipModel() {
  const groupRef = useRef<THREE.Group>(null);
  const cyanGhostRef = useRef<THREE.Group>(null);
  const redGhostRef = useRef<THREE.Group>(null);
  const yawRef = useRef(SHIP_ROTATION[1]);
  const gltf = useGLTF(SHIP_URL);

  const scene = useMemo(() => applyCyberShipMaterials(gltf.scene), [gltf.scene]);
  const cyanGhostScene = useMemo(() => createGhostScene(scene, COLORS.line, 0.34), [scene]);
  const redGhostScene = useMemo(() => createGhostScene(scene, COLORS.plane, 0.28), [scene]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    const t = clock.elapsedTime;
    const glitch = getGlitchPower(t);
    const nX = steppedNoise(2, t);
    const nY = steppedNoise(5, t);
    const nZ = steppedNoise(8, t);

    yawRef.current += delta * AUTO_ROTATE_SPEED;

    const jitterX = nX * GLITCH_SHAKE_X * glitch;
    const jitterY = nY * GLITCH_SHAKE_Y * glitch;
    const jitterZ = nZ * GLITCH_SHAKE_Z * glitch;
    const jitterRot = nX * GLITCH_ROTATION_SHAKE * glitch;

    groupRef.current.position.set(
      SHIP_POSITION[0] + jitterX,
      SHIP_POSITION[1] + Math.sin(t * FLOAT_SPEED) * FLOAT_HEIGHT + jitterY,
      SHIP_POSITION[2] + jitterZ,
    );

    groupRef.current.rotation.set(
      SHIP_ROTATION[0] + Math.sin(t * 0.75) * 0.015 + nY * GLITCH_ROTATION_SHAKE * 0.55 * glitch,
      yawRef.current + jitterRot,
      SHIP_ROTATION[2] + Math.sin(t * 1.05) * 0.02 + nZ * GLITCH_ROTATION_SHAKE * 0.5 * glitch,
    );

    const ghostVisible = glitch > 0.045 && Math.sin(t * 120) > -0.65;

    if (cyanGhostRef.current) {
      cyanGhostRef.current.visible = ghostVisible;
      cyanGhostRef.current.position.set(0.085 * glitch + nX * 0.025, nY * 0.018, 0);
      cyanGhostRef.current.rotation.z = nZ * 0.025 * glitch;
    }

    if (redGhostRef.current) {
      redGhostRef.current.visible = ghostVisible && Math.sin(t * 76) > -0.25;
      redGhostRef.current.position.set(-0.075 * glitch + nY * 0.022, -nX * 0.018, 0);
      redGhostRef.current.rotation.z = -nZ * 0.022 * glitch;
    }
  });

  return (
    <group
      ref={groupRef}
      position={SHIP_POSITION}
      rotation={SHIP_ROTATION}
      scale={SHIP_SCALE}
    >
      <Center>
        <HologramProjector />
        <primitive object={scene} />

        <group ref={cyanGhostRef} visible={false}>
          <primitive object={cyanGhostScene} />
        </group>
        <group ref={redGhostRef} visible={false}>
          <primitive object={redGhostScene} />
        </group>

        <ShipSweepHighlight />
        <SignalGlitchBars />
      </Center>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <hemisphereLight args={[COLORS.line, COLORS.plane, 0.7]} />

      <directionalLight position={[5, 7, 6]} intensity={1.35} color={COLORS.line} />
      <directionalLight position={[-5, 4, -4]} intensity={0.95} color={COLORS.plane} />
      <pointLight position={[3.8, 2.2, 3.6]} intensity={1.55} distance={7} color={COLORS.line} />
      <pointLight position={[-3.5, 1.8, 2.4]} intensity={1.05} distance={7} color={COLORS.plane} />

      <ModelErrorBoundary>
        <Suspense fallback={null}>
          <ShipModel />
        </Suspense>
      </ModelErrorBoundary>

      <OrbitControls
        target={[0, 0, 0]}
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
      />
    </>
  );
}

export default function ModelPlaceholder() {
  return (
    <div className="pointer-events-none h-full w-full overflow-visible bg-transparent">
      <Canvas
        orthographic
        camera={{
          position: [5.7, 3.85, 6.4],
          zoom: 94,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor(0x000000, 0);
          gl.setClearAlpha(0);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

useGLTF.preload(SHIP_URL);
