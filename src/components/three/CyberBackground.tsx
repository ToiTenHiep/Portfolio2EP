"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * CyberBackground - Continuous Synthwave Terrain
 *
 * Bản sửa theo yêu cầu:
 * - Không còn 2 lớp "đất riêng / núi riêng".
 * - Toàn bộ là 1 mặt lưới liên tục: line từ mặt đất đi lên/xuống để tạo núi.
 * - Giữa màn hình không có núi, núi chỉ nằm ở 2 rìa trái/phải.
 * - Chuyển động cuộn không bị ngắt ở cuối vì dùng nhiều tile lặp nối tiếp.
 * - Mỗi tile khớp mép với tile kế tiếp tại y=0 nên không bị hở/chênh chân núi.
 */

/* ======================================================
   1. CHỈNH MÀU NHANH
====================================================== */

const BG_DEEP = "#080014";
const SKY_TOP = "#880052";
const SKY_MID = "#3b0047";
const SKY_BOTTOM = "#100022";

const GRID_COLOR = "#FF0049";
const GRID_SOFT_COLOR = "#FF0049";
const GRID_HIGHLIGHT = "#ff9be5";

const CORNER_LINE = "rgba(185, 238, 255, 0.72)";
const STAR_COLOR = "#00FFEE";

/* ======================================================
   2. CHỈNH TERRAIN NHANH
====================================================== */

/**
 * Tốc độ cuộn của nền.
 */
const TERRAIN_SPEED = 1.2;

/**
 * Chiều dài mỗi đoạn terrain.
 */
const TERRAIN_TILE_DEPTH = 50;

/**
 * Số mẫu địa hình khác nhau.
 * Code sẽ render 2 vòng variant để khi loop không bị ngắt.
 */
const TERRAIN_VARIANT_COUNT = 5;

/**
 * Bề rộng lưới đất.
 * Tăng nếu phần dưới màn hình chưa phủ đủ.
 */
const TERRAIN_WIDTH = 126;

/**
 * Độ chi tiết lưới.
 * X càng cao -> nhiều line theo ngang.
 * Z càng cao -> nhiều line theo chiều sâu.
 */
const TERRAIN_SEGMENTS_X = 50;
const TERRAIN_SEGMENTS_Z = 20;

/**
 * Cao độ mặt đất.
 */
const FLOOR_Y = -2;

/**
 * Vùng giữa không có núi.
 * Núi chỉ được phép bắt đầu ngoài vùng này.
 */
const CENTER_SAFE_HALF_WIDTH = 11.5;

/**
 * Độ chuyển mềm từ vùng giữa phẳng sang vùng rìa có núi.
 */
const SIDE_RISE_BLEND = 10;

/**
 * Độ cao núi.
 * Tăng số này nếu muốn núi cao hơn.
 * Ví dụ:
 * 1.0 = thấp như bản cũ
 * 1.25 = cao vừa
 * 1.45 = cao rõ hơn
 */
const MOUNTAIN_HEIGHT_MULTIPLIER = 2;

/**
 * Opacity line terrain.
 * Vì đất và núi giờ là 1 mặt lưới liên tục nên line dùng chung opacity này.
 * Tăng nếu muốn line rõ hơn, giảm nếu muốn mờ hơn.
 */
const TERRAIN_LINE_OPACITY = 0.5;

/**
 * Chấm sao trên nền trời.
 */
const STAR_COUNT = 500;
const STAR_SIZE = 0.052;
const STAR_OPACITY = 0.72;

/**
 * Bật/tắt cuộn.
 */
const ENABLE_TERRAIN_SCROLL = true;

/* ======================================================
   3. TYPES
====================================================== */

type Hill = {
  x: number;
  z: number;
  height: number;
  radiusX: number;
  radiusZ: number;
};

type TerrainVariant = {
  id: string;
  color: string;
  hills: Hill[];
  detailPower: number;
};

/* ======================================================
   4. HEIGHTMAP HELPERS
====================================================== */

const TAU = Math.PI * 2;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function hillHeight(x: number, z01: number, hill: Hill) {
  const dx = (x - hill.x) / hill.radiusX;
  const dz = (z01 - hill.z) / hill.radiusZ;
  return hill.height * Math.exp(-(dx * dx + dz * dz));
}

function periodicDetail(x: number, z01: number, detailPower: number) {
  /**
   * Detail này dùng sin theo chu kỳ TERRAIN_TILE_DEPTH,
   * nên đầu/cuối tile luôn khớp nhịp, không bị giật.
   */
  const p = z01 / TERRAIN_TILE_DEPTH;

  return (
    Math.sin(x * 0.28 + p * TAU * 2.0) * 0.07 +
    Math.cos(x * 0.16 - p * TAU * 3.0) * 0.055 +
    Math.sin(x * 0.42 + p * TAU * 4.0) * 0.035
  ) * detailPower;
}

function getHeightAt(x: number, z01: number, variant: TerrainVariant) {
  /**
   * Center mask:
   * - 0 ở giữa màn hình -> không có núi.
   * - tăng dần ra 2 rìa -> núi bắt đầu nhô lên.
   */
  const sideMask = smoothstep(
    CENTER_SAFE_HALF_WIDTH,
    CENTER_SAFE_HALF_WIDTH + SIDE_RISE_BLEND,
    Math.abs(x),
  );

  /**
   * Edge fade:
   * Đầu/cuối tile ép về mặt đất.
   * Nhờ vậy các tile nối với nhau không bị hở hoặc lệch cao độ.
   */
  const edgeFade = Math.pow(Math.sin((z01 / TERRAIN_TILE_DEPTH) * Math.PI), 0.42);

  let h = 0;

  for (const hill of variant.hills) {
    h += hillHeight(x, z01, hill);
  }

  h += periodicDetail(x, z01, variant.detailPower);

  return Math.max(0, h) * sideMask * edgeFade * MOUNTAIN_HEIGHT_MULTIPLIER;
}

/**
 * Tạo 1 mặt lưới liên tục.
 * Điểm quan trọng: không có Floor riêng và Mountain riêng nữa.
 * Cùng một grid sẽ có điểm y=0 ở giữa và y>0 ở 2 rìa.
 */
function createContinuousTerrainGeometry(variant: TerrainVariant) {
  const points: number[] = [];

  const getPoint = (ix: number, iz: number) => {
    const x = (ix / TERRAIN_SEGMENTS_X - 0.5) * TERRAIN_WIDTH;
    const z01 = (iz / TERRAIN_SEGMENTS_Z) * TERRAIN_TILE_DEPTH;
    const z = z01 - TERRAIN_TILE_DEPTH / 2;
    const y = getHeightAt(x, z01, variant);

    return [x, y, z] as const;
  };

  /**
   * Line theo chiều X.
   * Các line này chính là mặt đất và khi gặp vùng rìa sẽ đi lên thành núi.
   */
  for (let iz = 0; iz <= TERRAIN_SEGMENTS_Z; iz += 1) {
    for (let ix = 0; ix < TERRAIN_SEGMENTS_X; ix += 1) {
      const a = getPoint(ix, iz);
      const b = getPoint(ix + 1, iz);
      points.push(...a, ...b);
    }
  }

  /**
   * Line theo chiều Z.
   */
  for (let ix = 0; ix <= TERRAIN_SEGMENTS_X; ix += 1) {
    for (let iz = 0; iz < TERRAIN_SEGMENTS_Z; iz += 1) {
      const a = getPoint(ix, iz);
      const b = getPoint(ix, iz + 1);
      points.push(...a, ...b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));

  return geometry;
}

/* ======================================================
   5. TERRAIN DATA
====================================================== */

/**
 * Lưu ý:
 * - Không có hill nào nằm ở giữa màn hình.
 * - Hill chỉ nằm ở x âm lớn hoặc x dương lớn.
 * - z luôn nằm trong khoảng 0 -> TERRAIN_TILE_DEPTH.
 */
const TERRAIN_VARIANTS: TerrainVariant[] = [
  {
    id: "variant-0",
    color: GRID_COLOR,
    detailPower: 0.7,
    hills: [
      { x: -28, z: 6.0, height: 2.4, radiusX: 4.2, radiusZ: 2.2 },
      { x: -42, z: 10.2, height: 1.55, radiusX: 3.6, radiusZ: 2.0 },
      { x: 27, z: 8.4, height: 2.65, radiusX: 4.6, radiusZ: 2.5 },
      { x: 43, z: 12.0, height: 1.8, radiusX: 3.8, radiusZ: 2.0 },
    ],
  },
  {
    id: "variant-1",
    color: GRID_SOFT_COLOR,
    detailPower: 0.62,
    hills: [
      { x: -24, z: 8.2, height: 2.1, radiusX: 4.4, radiusZ: 2.4 },
      { x: -47, z: 5.4, height: 1.35, radiusX: 3.4, radiusZ: 1.9 },
      { x: 23, z: 6.4, height: 1.8, radiusX: 3.8, radiusZ: 2.1 },
      { x: 39, z: 11.5, height: 2.35, radiusX: 4.8, radiusZ: 2.8 },
    ],
  },
  {
    id: "variant-2",
    color: GRID_COLOR,
    detailPower: 0.76,
    hills: [
      { x: -32, z: 9.3, height: 2.75, radiusX: 4.9, radiusZ: 2.7 },
      { x: -50, z: 12.5, height: 1.45, radiusX: 3.2, radiusZ: 1.8 },
      { x: 19, z: 5.8, height: 1.55, radiusX: 3.5, radiusZ: 2.0 },
      { x: 35, z: 9.8, height: 2.25, radiusX: 4.2, radiusZ: 2.3 },
      { x: 51, z: 13.2, height: 1.25, radiusX: 3.0, radiusZ: 1.8 },
    ],
  },
  {
    id: "variant-3",
    color: GRID_SOFT_COLOR,
    detailPower: 0.68,
    hills: [
      { x: -21, z: 5.6, height: 1.65, radiusX: 3.7, radiusZ: 2.0 },
      { x: -39, z: 10.4, height: 2.35, radiusX: 4.4, radiusZ: 2.4 },
      { x: 26, z: 7.8, height: 2.45, radiusX: 4.7, radiusZ: 2.5 },
      { x: 49, z: 10.8, height: 1.7, radiusX: 3.5, radiusZ: 1.9 },
    ],
  },
  {
    id: "variant-4",
    color: GRID_COLOR,
    detailPower: 0.72,
    hills: [
      { x: -27, z: 7.2, height: 2.25, radiusX: 4.2, radiusZ: 2.3 },
      { x: -45, z: 12.8, height: 1.65, radiusX: 3.9, radiusZ: 2.0 },
      { x: 22, z: 5.4, height: 1.75, radiusX: 3.8, radiusZ: 2.0 },
      { x: 41, z: 9.6, height: 2.55, radiusX: 4.8, radiusZ: 2.5 },
    ],
  },
];

/* ======================================================
   6. 3D COMPONENTS
====================================================== */

function TerrainTile({
  variant,
  index,
}: {
  variant: TerrainVariant;
  index: number;
}) {
  const geometry = useMemo(
    () => createContinuousTerrainGeometry(variant),
    [variant],
  );

  return (
    <lineSegments
      geometry={geometry}
      position={[0, FLOOR_Y, -index * TERRAIN_TILE_DEPTH]}
    >
      <lineBasicMaterial
        color={variant.color}
        transparent
        opacity={TERRAIN_LINE_OPACITY}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}

function LoopTerrain() {
  const groupRef = useRef<THREE.Group>(null);

  /**
   * Render 2 vòng variant:
   * Khi group reset sau 1 vòng, vòng thứ 2 đang ở đúng vị trí tương ứng,
   * vì vậy mắt không thấy bị cắt/ngắt.
   */
  const renderedTiles = useMemo(() => {
    const tiles: Array<{ variant: TerrainVariant; index: number; key: string }> = [];

    for (let loop = 0; loop < 2; loop += 1) {
      for (let i = 0; i < TERRAIN_VARIANT_COUNT; i += 1) {
        const index = loop * TERRAIN_VARIANT_COUNT + i;
        tiles.push({
          variant: TERRAIN_VARIANTS[i],
          index,
          key: `${loop}-${TERRAIN_VARIANTS[i].id}`,
        });
      }
    }

    return tiles;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current || !ENABLE_TERRAIN_SCROLL) return;

    const t = clock.elapsedTime;
    const loopLength = TERRAIN_TILE_DEPTH * TERRAIN_VARIANT_COUNT;

    /**
     * Cuộn không ngắt:
     * - group chạy theo z.
     * - reset đúng bằng độ dài 1 vòng variant.
     * - vì phía sau có vòng variant thứ 2 giống hệt nên reset không tạo cú nhảy thị giác.
     */
    groupRef.current.position.z = (t * TERRAIN_SPEED) % loopLength;

    const pulse = 0.96 + Math.sin(t * 1.1) * 0.035;

    groupRef.current.traverse((object) => {
      const line = object as THREE.LineSegments;
      if (!line.isLineSegments) return;

      const material = line.material as THREE.LineBasicMaterial;
      if (!material) return;

      material.opacity = THREE.MathUtils.clamp(
        TERRAIN_LINE_OPACITY * pulse,
        0,
        1,
      );
    });
  });

  return (
    <group ref={groupRef}>
      {renderedTiles.map((tile) => (
        <TerrainTile
          key={tile.key}
          variant={tile.variant}
          index={tile.index}
        />
      ))}
    </group>
  );
}

function StarsLayer() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = STAR_COUNT;
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const spread = i % 3 === 0 ? 18 : i % 3 === 1 ? 28 : 36;

      arr[i * 3 + 0] = Math.sin(i * 17.23) * spread;
      arr[i * 3 + 1] = 1.25 + Math.abs(Math.cos(i * 11.91)) * 7.2;
      arr[i * 3 + 2] = -4 - Math.abs(Math.sin(i * 7.77)) * 26;
    }

    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = STAR_OPACITY + Math.sin(clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color={STAR_COLOR}
        size={STAR_SIZE}
        sizeAttenuation
        transparent
        opacity={STAR_OPACITY}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}


function BrightStarsLayer() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 42;
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const spread = i % 2 === 0 ? 20 : 34;

      arr[i * 3 + 0] = Math.cos(i * 9.67) * spread;
      arr[i * 3 + 1] = 1.8 + Math.abs(Math.sin(i * 12.41)) * 6.6;
      arr[i * 3 + 2] = -5 - Math.abs(Math.cos(i * 5.39)) * 24;
    }

    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = 0.45 + Math.max(0, Math.sin(clock.elapsedTime * 1.7)) * 0.45;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#ffffff"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.48} />
      <pointLight
        position={[0, 4.2, 2.5]}
        intensity={1.25}
        color={GRID_HIGHLIGHT}
      />

      <StarsLayer />
      <BrightStarsLayer />

      {/* Một mặt lưới liên tục: đất ở giữa, núi nổi lên ở 2 rìa. */}
      <LoopTerrain />

      <mesh position={[0, 0.5, -24]}>
        <planeGeometry args={[86, 9]} />
        <meshBasicMaterial
          color="#21002c"
          transparent
          opacity={0.34}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

/* ======================================================
   7. MAIN BACKGROUND
====================================================== */

export default function CyberBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#080014]">
      <div
        className="absolute inset-0"
        style={{
          background:
            `linear-gradient(180deg, ${SKY_TOP} 0%, ${SKY_MID} 27%, ${SKY_BOTTOM} 55%, ${BG_DEEP} 100%)`,
        }}
      />

      {/* Dải mây/núi tối phía trên giống ảnh mẫu. */}
      <div className="absolute inset-x-0 top-0 h-[32%] overflow-hidden">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48 C12 30 21 43 32 28 C45 10 57 28 67 40 C78 53 88 30 100 39 L100 0 L0 0 Z"
            fill="#270039"
            opacity="0.9"
          />
          <path
            d="M0 62 C13 45 23 54 35 39 C48 24 58 42 68 50 C80 62 90 46 100 51 L100 0 L0 0 Z"
            fill="#12002a"
            opacity="0.82"
          />
        </svg>
      </div>

      <Canvas
        className="!absolute !inset-0 !h-full !w-full"
        camera={{
          /**
           * Camera hạ thấp + FOV vừa phải để lưới phủ full phần dưới màn.
           */
          position: [0, 2.08, 9.6],
          fov: 50,
          near: 0.1,
          far: 150,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={[BG_DEEP]} />
        <Scene />
      </Canvas>

      {/* Vòng line góc phải. */}
      <div className="absolute right-0 top-0 h-[30%] w-[27%]">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          <g fill="none" stroke={CORNER_LINE} strokeWidth="0.52">
            <path d="M100 0 A54 54 0 0 0 46 54" />
            <path d="M100 0 A66 66 0 0 0 34 66" opacity="0.76" />
            <path d="M100 0 A78 78 0 0 0 22 78" opacity="0.55" />
            <path d="M100 0 A90 90 0 0 0 10 90" opacity="0.38" />
          </g>
        </svg>
      </div>

      {/* Vòng line góc trái. */}
      <div className="absolute left-0 top-0 h-[18%] w-[18%] opacity-70">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          <g fill="none" stroke={CORNER_LINE} strokeWidth="0.45">
            <path d="M0 0 A58 58 0 0 1 58 58" />
            <path d="M0 0 A72 72 0 0 1 72 72" opacity="0.62" />
            <path d="M0 0 A88 88 0 0 1 88 88" opacity="0.42" />
          </g>
        </svg>
      </div>

      <div className="absolute inset-x-0 top-[48%] h-[18%] bg-[radial-gradient(ellipse_at_center,rgba(255,0,143,0.18),transparent_60%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}
