"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import helvetikerBold from "three/examples/fonts/helvetiker_bold.typeface.json";

type SkillHologramCubeProps = {
  shortName: string;
  color: string;
  iconSrc?: string;
};

function getTextSize(text: string) {
  if (text.length <= 2) return 0.46;
  if (text.length <= 4) return 0.32;
  return 0.24;
}

function Real3DText({
  shortName,
  color,
}: {
  shortName: string;
  color: string;
}) {
  const font = useMemo(() => {
    const loader = new FontLoader();
    return loader.parse(helvetikerBold);
  }, []);

  const textGeometry = useMemo(() => {
    const geometry = new TextGeometry(shortName, {
      font,
      size: getTextSize(shortName),
      depth: 0.12,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.008,
      bevelOffset: 0,
      bevelSegments: 2,
    });

    geometry.computeBoundingBox();

    const box = geometry.boundingBox;

    if (box) {
      geometry.translate(
        -0.5 * (box.max.x - box.min.x),
        -0.5 * (box.max.y - box.min.y),
        -0.5 * (box.max.z - box.min.z)
      );
    }

    geometry.computeVertexNormals();

    return geometry;
  }, [font, shortName]);

  const frontMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.72,
      metalness: 0.22,
      roughness: 0.28,
      transparent: true,
      opacity: 0.98,
    });
  }, [color]);

  const sideMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.22,
      metalness: 0.12,
      roughness: 0.42,
      transparent: true,
      opacity: 0.55,
    });
  }, [color]);

  useEffect(() => {
    return () => {
      textGeometry.dispose();
      frontMaterial.dispose();
      sideMaterial.dispose();
    };
  }, [textGeometry, frontMaterial, sideMaterial]);

  return (
    <group>
      <mesh position={[0, 0, -0.09]}>
        <planeGeometry args={[1.55, 1]} />
        <meshBasicMaterial
          color="#05070c"
          transparent
          opacity={0.32}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={textGeometry} material={[frontMaterial, sideMaterial]} />

      <lineSegments>
        <edgesGeometry args={[textGeometry, 15]} />
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.22}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

function Real3DSvgIcon({
  iconSrc,
  color,
}: {
  iconSrc: string;
  color: string;
}) {
  const svgData = useLoader(SVGLoader, iconSrc);

  const frontMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.55,
      metalness: 0.2,
      roughness: 0.3,
      transparent: true,
      opacity: 0.96,
    });
  }, [color]);

  const sideMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.14,
      metalness: 0.08,
      roughness: 0.48,
      transparent: true,
      opacity: 0.52,
    });
  }, [color]);

  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
  }, [color]);

  const outlineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.28,
      toneMapped: false,
    });
  }, []);

  const geometries = useMemo(() => {
    const next: THREE.ExtrudeGeometry[] = [];
    const unionBox = new THREE.Box3();
    let hasAny = false;

    svgData.paths.forEach((path) => {
      const shapes = SVGLoader.createShapes(path);

      shapes.forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 5.5,
          bevelEnabled: true,
          bevelThickness: 0.55,
          bevelSize: 0.35,
          bevelOffset: 0,
          bevelSegments: 1,
          curveSegments: 8,
          steps: 1,
        });

        geometry.scale(1, -1, 1);
        geometry.computeBoundingBox();

        if (geometry.boundingBox) {
          if (!hasAny) {
            unionBox.copy(geometry.boundingBox);
            hasAny = true;
          } else {
            unionBox.union(geometry.boundingBox);
          }
        }

        next.push(geometry);
      });
    });

    if (!hasAny || next.length === 0) return [];

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();

    unionBox.getCenter(center);
    unionBox.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z || 1);
    const scale = 1.02 / maxDim;

    next.forEach((geometry) => {
      geometry.translate(-center.x, -center.y, -center.z);
      geometry.scale(scale, scale, scale);
      geometry.computeVertexNormals();
    });

    return next;
  }, [svgData]);

  const edgeGeometries = useMemo(() => {
    return geometries.map((geometry) => new THREE.EdgesGeometry(geometry, 15));
  }, [geometries]);

  useEffect(() => {
    return () => {
      geometries.forEach((geometry) => geometry.dispose());
      edgeGeometries.forEach((geometry) => geometry.dispose());
      frontMaterial.dispose();
      sideMaterial.dispose();
      glowMaterial.dispose();
      outlineMaterial.dispose();
    };
  }, [
    geometries,
    edgeGeometries,
    frontMaterial,
    sideMaterial,
    glowMaterial,
    outlineMaterial,
  ]);

  if (geometries.length === 0) return null;

  return (
    <group>
      {/* nền tối nhẹ sau icon để icon không bị lẫn với cube */}
      <mesh position={[0, 0, -0.14]}>
        <planeGeometry args={[1.55, 1.15]} />
        <meshBasicMaterial
          color="#05070c"
          transparent
          opacity={0.34}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* glow rất nhẹ phía sau */}
      <group position={[-0.035, -0.025, -0.1]} scale={[1.035, 1.035, 1.035]}>
        {geometries.map((geometry, index) => (
          <mesh
            key={`svg-glow-${index}`}
            geometry={geometry}
            material={glowMaterial}
          />
        ))}
      </group>

      {/* icon 3D chính */}
      {geometries.map((geometry, index) => (
        <mesh
          key={`svg-main-${index}`}
          geometry={geometry}
          material={[frontMaterial, sideMaterial]}
        />
      ))}

      {/* outline trắng rất mảnh để rõ shape */}
      {edgeGeometries.map((geometry, index) => (
        <lineSegments
          key={`svg-outline-${index}`}
          geometry={geometry}
          material={outlineMaterial}
        />
      ))}
    </group>
  );
}

function CubeScene({
  shortName,
  color,
  iconSrc,
}: {
  shortName: string;
  color: string;
  iconSrc?: string;
}) {
  const cubeRef = useRef<THREE.Group>(null);
  const iconRef = useRef<THREE.Group>(null);

  const outerBoxGeometry = useMemo(() => {
    return new THREE.BoxGeometry(2.18, 2.18, 2.18);
  }, []);

  const outerEdgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(outerBoxGeometry);
  }, [outerBoxGeometry]);

  const innerBoxGeometry = useMemo(() => {
    return new THREE.BoxGeometry(1.34, 1.34, 1.34);
  }, []);

  const innerEdgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(innerBoxGeometry);
  }, [innerBoxGeometry]);

  useEffect(() => {
    return () => {
      outerBoxGeometry.dispose();
      outerEdgesGeometry.dispose();
      innerBoxGeometry.dispose();
      innerEdgesGeometry.dispose();
    };
  }, [
    outerBoxGeometry,
    outerEdgesGeometry,
    innerBoxGeometry,
    innerEdgesGeometry,
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    const cubeY = t * 0.72;
    const cubeX = -0.32 + Math.sin(t * 0.85) * 0.045;

    if (cubeRef.current) {
      cubeRef.current.rotation.y = cubeY;
      cubeRef.current.rotation.x = cubeX;
      cubeRef.current.rotation.z = Math.sin(t * 0.55) * 0.025;
      cubeRef.current.position.y = Math.sin(t * 1.2) * 0.045;
    }

    if (iconRef.current) {
      /*
        Icon vẫn nằm trong cube nhưng xoay ngược nhẹ theo Y
        để khi cube quay, icon không bị nghiêng quá và dễ đọc hơn.
      */
      iconRef.current.rotation.y = -cubeY + Math.sin(t * 0.65) * 0.08;
      iconRef.current.rotation.x = 0.08 + Math.sin(t * 0.55) * 0.035;
      iconRef.current.position.z = 0.04;
      iconRef.current.position.y = Math.sin(t * 1.05) * 0.025;
    }
  });

  return (
    <>
      <ambientLight intensity={0.62} />

      <pointLight position={[3, 4, 5]} intensity={1.8} color={color} />
      <pointLight position={[-3, -2, 4]} intensity={0.85} color={color} />
      <pointLight position={[0, 0, -4]} intensity={0.65} color="#ff005d" />
      <pointLight position={[0, 3, 2]} intensity={0.75} color="#ffffff" />

      <group ref={cubeRef} position={[0, -0.05, 0]} scale={0.92}>
        {/* cube ngoài */}
        <mesh geometry={outerBoxGeometry}>
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.028}
            emissive={color}
            emissiveIntensity={0.18}
            roughness={0.22}
            metalness={0.18}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <lineSegments geometry={outerEdgesGeometry}>
          <lineBasicMaterial
            color={color}
            transparent
            opacity={0.62}
            toneMapped={false}
          />
        </lineSegments>

        {/* cube trong */}
        <mesh geometry={innerBoxGeometry}>
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.018}
            emissive={color}
            emissiveIntensity={0.14}
            roughness={0.24}
            metalness={0.12}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <lineSegments geometry={innerEdgesGeometry}>
          <lineBasicMaterial
            color={color}
            transparent
            opacity={0.26}
            toneMapped={false}
          />
        </lineSegments>

        <group ref={iconRef} position={[0, 0, 0]}>
          <Suspense fallback={<Real3DText shortName={shortName} color={color} />}>
            {iconSrc ? (
              <Real3DSvgIcon iconSrc={iconSrc} color={color} />
            ) : (
              <Real3DText shortName={shortName} color={color} />
            )}
          </Suspense>
        </group>
      </group>

      {/* đế glow giảm sáng */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
        <ringGeometry args={[0.58, 1.05, 96]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.46, 0]}>
        <circleGeometry args={[0.68, 96]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.035}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

export default function SkillHologramCube({
  shortName,
  color,
  iconSrc,
}: SkillHologramCubeProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{
          position: [0, 0, 5.2],
          fov: 42,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <CubeScene shortName={shortName} color={color} iconSrc={iconSrc} />
      </Canvas>
    </div>
  );
}