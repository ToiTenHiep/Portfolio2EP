"use client";

import type { CSSProperties, ReactNode } from "react";

const FRAME_W = 509;
const FRAME_H = 178;

const OFFSET = 8;
const L_LENGTH = 40;
const L_THICKNESS = 8;
const DOT_SIZE = 8;
const DOT_GAP = 8;

type Corner = "tl" | "tr" | "bl" | "br";

function NeonBar({ style }: { style: CSSProperties }) {
  return (
    <span
      aria-hidden
      className="absolute bg-[#ff005d]"
      style={{
        ...style,
        boxShadow:
          "0 0 8px rgba(255,0,93,1), 0 0 18px rgba(255,0,93,.8), 0 0 34px rgba(255,0,93,.45)",
      }}
    />
  );
}

function CyanDot({ style }: { style: CSSProperties }) {
  return (
    <span
      aria-hidden
      className="absolute bg-[#00fff0]"
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        ...style,
        boxShadow:
          "0 0 7px rgba(0,255,240,1), 0 0 16px rgba(0,255,240,.85), 0 0 28px rgba(0,255,240,.5)",
      }}
    />
  );
}

function HudAccent({ corner }: { corner: Corner }) {
  const dotOffset = OFFSET + L_LENGTH + DOT_GAP;

  if (corner === "tl") {
    return (
      <>
        <NeonBar
          style={{ left: OFFSET, top: OFFSET, width: L_LENGTH, height: L_THICKNESS }}
        />
        <NeonBar
          style={{ left: OFFSET, top: OFFSET, width: L_THICKNESS, height: L_LENGTH }}
        />
        <CyanDot style={{ left: dotOffset, top: OFFSET }} />
        <CyanDot style={{ left: OFFSET, top: dotOffset }} />
      </>
    );
  }

  if (corner === "tr") {
    return (
      <>
        <NeonBar
          style={{ right: OFFSET, top: OFFSET, width: L_LENGTH, height: L_THICKNESS }}
        />
        <NeonBar
          style={{ right: OFFSET, top: OFFSET, width: L_THICKNESS, height: L_LENGTH }}
        />
        <CyanDot style={{ right: dotOffset, top: OFFSET }} />
        <CyanDot style={{ right: OFFSET, top: dotOffset }} />
      </>
    );
  }

  if (corner === "bl") {
    return (
      <>
        <NeonBar
          style={{ left: OFFSET, bottom: OFFSET, width: L_LENGTH, height: L_THICKNESS }}
        />
        <NeonBar
          style={{ left: OFFSET, bottom: OFFSET, width: L_THICKNESS, height: L_LENGTH }}
        />
        <CyanDot style={{ left: dotOffset, bottom: OFFSET }} />
        <CyanDot style={{ left: OFFSET, bottom: dotOffset }} />
      </>
    );
  }

  return (
    <>
      <NeonBar
        style={{ right: OFFSET, bottom: OFFSET, width: L_LENGTH, height: L_THICKNESS }}
      />
      <NeonBar
        style={{ right: OFFSET, bottom: OFFSET, width: L_THICKNESS, height: L_LENGTH }}
      />
      <CyanDot style={{ right: dotOffset, bottom: OFFSET }} />
      <CyanDot style={{ right: OFFSET, bottom: dotOffset }} />
    </>
  );
}

function SkillsHudFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="skill-frame relative overflow-hidden border border-[#00fff0] bg-[#120612]"
      style={{ width: FRAME_W, height: FRAME_H }}
    >
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="skill-frame-inner-glow absolute inset-0" />
        <div className="skill-frame-flash absolute inset-0" />
        <HudAccent corner="tl" />
        <HudAccent corner="tr" />
        <HudAccent corner="bl" />
        <HudAccent corner="br" />
      </div>

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function Pixel({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  return (
    <span
      className="absolute"
      style={{
        left: x * 4,
        top: y * 4,
        width: 4,
        height: 4,
        background: color,
        boxShadow: `0 0 6px ${color}`,
      }}
    />
  );
}

/* =========================
   SCENE 1: DINO RUNNER
========================= */

function DinoPixel({ className = "" }: { className?: string }) {
  const pixels = [
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [5, 3],
    [6, 3],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
    [6, 4],
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5],
    [6, 5],
    [3, 6],
    [4, 6],
    [5, 6],
    [6, 6],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
    [2, 8],
    [5, 8],
    [2, 9],
    [5, 9],
  ] as const;

  return (
    <div className={`absolute h-[40px] w-[32px] ${className}`}>
      {pixels.map(([x, y], index) => (
        <Pixel key={index} x={x} y={y} color="#00fff0" />
      ))}
    </div>
  );
}

function CactusPixel({ className = "" }: { className?: string }) {
  const pixels = [
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [1, 2],
    [1, 3],
    [3, 4],
    [3, 5],
    [1, 6],
    [2, 7],
    [3, 7],
  ] as const;

  return (
    <div className={`absolute h-[32px] w-[20px] ${className}`}>
      {pixels.map(([x, y], index) => (
        <Pixel key={index} x={x} y={y} color="#ff5f93" />
      ))}
    </div>
  );
}

function DinoRunnerScene() {
  return (
    <div className="skill-scene skill-scene-dino absolute inset-0">
      <div className="absolute inset-[18px] overflow-hidden border border-[#00fff0]/35 bg-[#080814]">
        <div className="runner-grid absolute inset-0" />

        <div className="absolute left-[18px] top-[14px] inline-flex border border-[#ff005d] px-3 py-[2px] text-[10px] font-black tracking-[0.18em] text-[#00fff0] shadow-[0_0_12px_rgba(255,0,93,.35)]">
          DINO RUNNER
        </div>

        <div className="absolute right-[16px] top-[14px] text-right text-[8px] font-bold tracking-[0.18em] text-[#9dfef8]">
          PIXEL MODE
          <br />
          AUTO RUN
          <br />
          JUMP ACTIVE
        </div>

        <div className="absolute bottom-[36px] left-[0] h-[2px] w-full bg-[#00fff0] shadow-[0_0_8px_rgba(0,255,240,.85)]" />

        <div className="runner-dino absolute left-[88px] top-[88px]">
          <DinoPixel />
        </div>

        <div className="runner-cactus cactus-1 absolute left-[560px] top-[96px]">
          <CactusPixel />
        </div>

        <div className="runner-cactus cactus-2 absolute left-[760px] top-[92px]">
          <CactusPixel />
        </div>

        <div className="runner-cactus cactus-3 absolute left-[950px] top-[96px]">
          <CactusPixel />
        </div>

        <div className="absolute bottom-[14px] left-[18px] right-[18px] flex items-center justify-between text-[8px] font-bold tracking-[0.18em] text-[#00fff0]/80">
          <span>RUN / JUMP / LOOP</span>
          <span>TIME 10S</span>
          <span>NO HIT</span>
        </div>
      </div>
    </div>
  );
}

/* =========================
   SCENE 2: SPACE BATTLE
========================= */

function PlayerShip({ className = "" }: { className?: string }) {
  const pixels = [
    [0, 3],
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [3, 0],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 2],
    [4, 3],
    [4, 4],
    [5, 3],
  ] as const;

  return (
    <div className={`absolute h-[28px] w-[24px] ${className}`}>
      {pixels.map(([x, y], index) => (
        <Pixel key={index} x={x} y={y} color="#00fff0" />
      ))}
    </div>
  );
}

function EnemyShip({
  className = "",
  tone = "#ff5f93",
}: {
  className?: string;
  tone?: string;
}) {
  const pixels = [
    [5, 3],
    [4, 2],
    [4, 3],
    [4, 4],
    [3, 1],
    [3, 2],
    [3, 3],
    [3, 4],
    [3, 5],
    [2, 1],
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [1, 2],
    [1, 3],
    [1, 4],
    [0, 1],
    [0, 5],
  ] as const;

  return (
    <div className={`absolute h-[28px] w-[24px] ${className}`}>
      {pixels.map(([x, y], index) => (
        <Pixel key={index} x={x} y={y} color={tone} />
      ))}
    </div>
  );
}

function HorizontalBullet({
  className = "",
  color = "#ffe45e",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span
      className={`absolute h-[3px] w-[22px] ${className}`}
      style={{
        background: color,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
      }}
    />
  );
}

function HitExplosion({ className = "" }: { className?: string }) {
  return <span className={`hit-explosion absolute ${className}`} />;
}

function SpaceBattleScene() {
  return (
    <div className="skill-scene skill-scene-space absolute inset-0">
      <div className="absolute inset-[18px] overflow-hidden border border-[#00fff0]/35 bg-[#050916]">
        <div className="space-grid absolute inset-0" />
        <div className="space-stars absolute inset-0" />

        <div className="absolute left-[18px] top-[14px] inline-flex border border-[#ff005d] px-3 py-[2px] text-[10px] font-black tracking-[0.18em] text-[#00fff0] shadow-[0_0_12px_rgba(255,0,93,.35)]">
          SIDE BATTLE
        </div>

        <div className="absolute right-[16px] top-[14px] text-right text-[8px] font-bold tracking-[0.18em] text-[#9dfef8]">
          HORIZONTAL MODE
          <br />
          LASER HIT LOCK
          <br />
          TARGET DESTROY
        </div>

        <div className="player-horizontal absolute left-[64px] top-[70px]">
          <PlayerShip />
        </div>

        <EnemyShip className="enemy enemy-hit-1 left-[326px] top-[70px]" />
        <EnemyShip
          className="enemy enemy-hit-2 left-[374px] top-[40px]"
          tone="#ff85aa"
        />
        <EnemyShip
          className="enemy enemy-hit-3 left-[390px] top-[98px]"
          tone="#ff4f86"
        />

        <HorizontalBullet className="bullet-horizontal bullet-h-1 left-[88px] top-[82px]" />
        <HorizontalBullet
          className="bullet-horizontal bullet-h-2 left-[88px] top-[88px]"
          color="#00fff0"
        />
        <HorizontalBullet
          className="bullet-horizontal bullet-h-3 left-[88px] top-[94px]"
          color="#ffe45e"
        />

        <HitExplosion className="explosion-h-1 left-[326px] top-[73px]" />
        <HitExplosion className="explosion-h-2 left-[374px] top-[43px]" />
        <HitExplosion className="explosion-h-3 left-[390px] top-[101px]" />

        <div className="absolute bottom-[14px] left-[18px] right-[18px] flex items-center justify-between text-[8px] font-bold tracking-[0.18em] text-[#00fff0]/80">
          <span>PLAYER 01</span>
          <span>LASER / HIT / EXPLODE</span>
          <span>READY</span>
        </div>
      </div>
    </div>
  );
}

function AnimatedScenes() {
  return (
    <div className="relative h-full w-full">
      <DinoRunnerScene />
      <SpaceBattleScene />
    </div>
  );
}

export default function SkillsPanel() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center border border-[#ff005d] text-[#ff005d] shadow-[0_0_14px_rgba(255,0,93,0.45)]">
          ×
        </div>

        <h2 className="cyber-text-glow text-2xl font-black text-[#00fff0]">
          CHILL TABLE
        </h2>
      </div>

      <SkillsHudFrame>
        <AnimatedScenes />
      </SkillsHudFrame>

      <style>{`
        .skill-frame {
          box-shadow:
            0 0 10px rgba(0, 255, 240, 0.24),
            0 0 24px rgba(0, 255, 240, 0.16);
          animation: framePulse 1.25s ease-in-out infinite;
        }

        .skill-frame-inner-glow {
          box-shadow:
            inset 0 0 14px rgba(0, 255, 240, 0.18),
            inset 0 0 36px rgba(0, 255, 240, 0.08);
        }

        .skill-frame-flash {
          border: 1px solid rgba(0, 255, 240, 0.45);
          box-shadow:
            inset 0 0 10px rgba(0, 255, 240, 0.2),
            0 0 18px rgba(0, 255, 240, 0.15);
          animation: frameBlink 1.8s steps(1, end) infinite;
        }

        .skill-scene {
          opacity: 0;
          pointer-events: none;
        }

        /* 15s total: Dino 10s + Space 5s */
        .skill-scene-dino {
          animation: sceneDinoCycle 15s linear infinite;
        }

        .skill-scene-space {
          animation: sceneSpaceCycle 15s linear infinite;
        }

        .runner-grid {
          background-image:
            linear-gradient(rgba(0, 255, 240, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 240, 0.06) 1px, transparent 1px);
          background-size: 18px 18px;
        }

        .runner-dino {
          animation: dinoJump 2.4s linear infinite;
        }

        .runner-cactus.cactus-1 {
          animation: cactusRun 3.2s linear infinite;
        }

        .runner-cactus.cactus-2 {
          animation: cactusRun 3.2s linear infinite 1.05s;
        }

        .runner-cactus.cactus-3 {
          animation: cactusRun 3.2s linear infinite 2.1s;
        }

        .space-grid {
          background-image:
            linear-gradient(rgba(0, 255, 240, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 240, 0.06) 1px, transparent 1px);
          background-size: 18px 18px;
        }

        .space-stars {
          background-image:
            radial-gradient(circle at 12% 28%, rgba(255,255,255,.8) 0 1px, transparent 1.5px),
            radial-gradient(circle at 26% 74%, rgba(255,255,255,.6) 0 1px, transparent 1.5px),
            radial-gradient(circle at 54% 22%, rgba(255,255,255,.8) 0 1px, transparent 1.5px),
            radial-gradient(circle at 76% 58%, rgba(255,255,255,.65) 0 1px, transparent 1.5px),
            radial-gradient(circle at 92% 84%, rgba(255,255,255,.75) 0 1px, transparent 1.5px);
          animation: starsMove 2.4s linear infinite;
        }

        .player-horizontal {
          animation: playerHorizontalMove 2.2s ease-in-out infinite;
        }

        .enemy {
          animation: enemyShake 0.9s steps(2, end) infinite;
        }

        .enemy-hit-1 {
          animation:
            enemyShake 0.9s steps(2, end) infinite,
            enemyHitBlink1 1.6s steps(1, end) infinite;
        }

        .enemy-hit-2 {
          animation:
            enemyShake 1s steps(2, end) infinite,
            enemyHitBlink2 1.8s steps(1, end) infinite;
        }

        .enemy-hit-3 {
          animation:
            enemyShake 0.8s steps(2, end) infinite,
            enemyHitBlink3 1.7s steps(1, end) infinite;
        }

        .bullet-h-1 {
          animation: bulletHit1 1.6s linear infinite;
        }

        .bullet-h-2 {
          animation: bulletHit2 1.8s linear infinite;
        }

        .bullet-h-3 {
          animation: bulletHit3 1.7s linear infinite;
        }

        .hit-explosion {
          width: 24px;
          height: 24px;
          opacity: 0;
        }

        .hit-explosion::before,
        .hit-explosion::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 24px;
          height: 3px;
          background: #ffe45e;
          transform: translate(-50%, -50%);
          box-shadow:
            0 0 8px rgba(255, 228, 94, 1),
            0 0 18px rgba(255, 0, 93, 0.8);
        }

        .hit-explosion::after {
          transform: translate(-50%, -50%) rotate(90deg);
        }

        .explosion-h-1 {
          animation: explosionHit1 1.6s steps(1, end) infinite;
        }

        .explosion-h-2 {
          animation: explosionHit2 1.8s steps(1, end) infinite;
        }

        .explosion-h-3 {
          animation: explosionHit3 1.7s steps(1, end) infinite;
        }

        @keyframes framePulse {
          0%, 100% {
            box-shadow:
              0 0 10px rgba(0, 255, 240, 0.24),
              0 0 24px rgba(0, 255, 240, 0.16);
          }
          50% {
            box-shadow:
              0 0 16px rgba(0, 255, 240, 0.36),
              0 0 34px rgba(0, 255, 240, 0.24);
          }
        }

        @keyframes frameBlink {
          0%, 100% {
            opacity: 0.88;
          }
          12% {
            opacity: 0.42;
          }
          16% {
            opacity: 1;
          }
          48% {
            opacity: 0.7;
          }
          52% {
            opacity: 1;
          }
          76% {
            opacity: 0.54;
          }
        }

        @keyframes sceneDinoCycle {
          0%, 64% {
            opacity: 1;
          }
          67%, 100% {
            opacity: 0;
          }
        }

        @keyframes sceneSpaceCycle {
          0%, 66% {
            opacity: 0;
          }
          70%, 100% {
            opacity: 1;
          }
        }

        @keyframes dinoJump {
          0%, 18%, 100% {
            transform: translateY(0);
          }
          28% {
            transform: translateY(-34px);
          }
          38% {
            transform: translateY(-44px);
          }
          52% {
            transform: translateY(0);
          }
          70% {
            transform: translateY(0);
          }
          80% {
            transform: translateY(-18px);
          }
          90% {
            transform: translateY(0);
          }
        }

        @keyframes cactusRun {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          2% {
            opacity: 1;
          }
          100% {
            transform: translateX(-620px);
            opacity: 1;
          }
        }

        @keyframes starsMove {
          0% {
            transform: translateX(0);
            opacity: 0.95;
          }
          100% {
            transform: translateX(-18px);
            opacity: 0.7;
          }
        }

        @keyframes playerHorizontalMove {
          0%, 100% {
            transform: translateY(0);
          }
          35% {
            transform: translateY(-5px);
          }
          70% {
            transform: translateY(6px);
          }
        }

        @keyframes enemyShake {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-2px, 1px);
          }
        }

        @keyframes bulletHit1 {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          78% {
            transform: translateX(220px);
            opacity: 1;
          }
          80%, 100% {
            transform: translateX(220px);
            opacity: 0;
          }
        }

        @keyframes bulletHit2 {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          78% {
            transform: translateX(268px) translateY(-40px);
            opacity: 1;
          }
          80%, 100% {
            transform: translateX(268px) translateY(-40px);
            opacity: 0;
          }
        }

        @keyframes bulletHit3 {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          78% {
            transform: translateX(284px) translateY(28px);
            opacity: 1;
          }
          80%, 100% {
            transform: translateX(284px) translateY(28px);
            opacity: 0;
          }
        }

        @keyframes enemyHitBlink1 {
          0%, 78%, 100% {
            opacity: 1;
          }
          80%, 88% {
            opacity: 0;
          }
        }

        @keyframes enemyHitBlink2 {
          0%, 78%, 100% {
            opacity: 1;
          }
          80%, 88% {
            opacity: 0;
          }
        }

        @keyframes enemyHitBlink3 {
          0%, 78%, 100% {
            opacity: 1;
          }
          80%, 88% {
            opacity: 0;
          }
        }

        @keyframes explosionHit1 {
          0%, 77%, 100% {
            opacity: 0;
            transform: scale(0.4);
          }
          80% {
            opacity: 1;
            transform: scale(1);
          }
          86% {
            opacity: 0.8;
            transform: scale(1.35);
          }
          90% {
            opacity: 0;
            transform: scale(1.7);
          }
        }

        @keyframes explosionHit2 {
          0%, 77%, 100% {
            opacity: 0;
            transform: scale(0.4);
          }
          80% {
            opacity: 1;
            transform: scale(1);
          }
          86% {
            opacity: 0.8;
            transform: scale(1.35);
          }
          90% {
            opacity: 0;
            transform: scale(1.7);
          }
        }

        @keyframes explosionHit3 {
          0%, 77%, 100% {
            opacity: 0;
            transform: scale(0.4);
          }
          80% {
            opacity: 1;
            transform: scale(1);
          }
          86% {
            opacity: 0.8;
            transform: scale(1.35);
          }
          90% {
            opacity: 0;
            transform: scale(1.7);
          }
        }
      `}</style>
    </section>
  );
}