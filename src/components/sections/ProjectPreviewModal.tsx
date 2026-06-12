"use client";

import { useEffect } from "react";
import type { ProjectPreviewItem } from "./projectGalleryData";

export type { ProjectPreviewItem } from "./projectGalleryData";

type ProjectPreviewModalProps = {
  item: ProjectPreviewItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

const VIEW_W = 728;
const VIEW_H = 482;

const MODAL_RENDER_W = 560;

const INNER_W = 460;
const INNER_H = 285;
const INNER_CUT = 34;

const L_SIZE = 52;
const L_THICKNESS = 8;
const L_OFFSET = 20;

const DOT_SIZE = 8;
const DOT_GAP = 6;

const rightX = VIEW_W - L_OFFSET;
const topY = L_OFFSET;
const bottomY = VIEW_H - L_OFFSET;

function ProjectMediaContent({ item }: { item: ProjectPreviewItem }) {
  if (item.media.kind === "image") {
    return (
      <img
        src={item.media.src}
        alt={item.media.alt ?? item.name}
        className="h-full w-full object-contain"
        draggable={false}
      />
    );
  }

  if (item.media.kind === "video") {
    return (
      <video
        key={item.media.src}
        className="h-full w-full object-contain"
        src={item.media.src}
        poster={item.media.poster}
        controls
        autoPlay
        muted={item.media.autoPlayMuted ?? true}
        playsInline
      />
    );
  }

  return (
    <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_center,rgba(0,255,240,0.14),rgba(53,20,31,0.48)_42%,rgba(8,0,17,0.7))] text-center">
      <div>
        <p className="mb-3 text-[28px] font-black uppercase leading-none tracking-[0.12em] text-[#00fff0] drop-shadow-[0_0_14px_rgba(0,255,240,0.95)]">
          {item.media.title ?? "COMING SOON"}
        </p>
        <p className="text-[13px] font-black uppercase tracking-[0.28em] text-[#ff005d] drop-shadow-[0_0_10px_rgba(255,0,93,0.95)]">
          {item.media.description ?? "COMING SOON"}
        </p>
      </div>
    </div>
  );
}

function ProjectInnerBlock({ item }: { item: ProjectPreviewItem }) {
  return (
    <div
      className="inner-hud-card relative overflow-hidden"
      style={{
        width: INNER_W,
        height: INNER_H,
      }}
    >
      <svg
        viewBox={`0 0 ${INNER_W} ${INNER_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <polygon
          points={`1,1 ${INNER_W - 1},1 ${INNER_W - 1},${INNER_H - 1} ${INNER_CUT},${INNER_H - 1} 1,${INNER_H - INNER_CUT}`}
          fill="#35141f"
          stroke="#ff005d"
          strokeWidth="1"
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div
        className="absolute inset-[10px] z-10 overflow-hidden bg-[#080011]/55"
        style={{
          clipPath: `polygon(0 0, 100% 0, 100% 100%, ${INNER_CUT - 8}px 100%, 0 calc(100% - ${INNER_CUT - 8}px))`,
        }}
      >
        <ProjectMediaContent item={item} />
      </div>

      <div className="pointer-events-none absolute inset-[10px] z-20 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent_24%,rgba(0,255,240,0.06)_50%,transparent_78%)] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-[10px] z-20 inner-media-scanline" />

      <div className="pointer-events-none absolute bottom-[14px] left-[18px] z-30 max-w-[300px]">
        <p className="truncate text-[11px] font-black uppercase tracking-[0.08em] text-[#00fff0] drop-shadow-[0_0_8px_rgba(0,255,240,0.95)]">
          {item.name}
        </p>
      </div>
    </div>
  );
}

function SideHudNav({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick?: () => void;
}) {
  const isLeft = side === "left";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        "side-hud-nav group absolute top-1/2 z-40 -translate-y-1/2",
        "flex items-center gap-[10px] overflow-visible",
        "transition-transform duration-300 hover:scale-[1.06]",
        isLeft ? "left-0" : "right-0 flex-row-reverse",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 88 120"
        className={[
          "h-[112px] w-[82px] overflow-visible",
          isLeft ? "" : "scale-x-[-1]",
        ].join(" ")}
        aria-hidden="true"
      >
        <defs>
          <filter
            id={`sideNavGlow-${side}`}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="2.4"
              floodColor="#ff005d"
              floodOpacity="0.95"
            />
          </filter>
        </defs>

        <path
          d="M70 10 L24 60 L70 110"
          fill="none"
          stroke="#ff005d"
          strokeWidth="2.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter={`url(#sideNavGlow-${side})`}
        />

        <path
          d="M52 10 L6 60 L52 110"
          fill="none"
          stroke="#ff005d"
          strokeWidth="2.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter={`url(#sideNavGlow-${side})`}
        />

        <polygon
          points="47,6 58,14 51,-1"
          fill="#ff005d"
          filter={`url(#sideNavGlow-${side})`}
        />
        <polygon
          points="65,6 76,14 69,-1"
          fill="#ff005d"
          filter={`url(#sideNavGlow-${side})`}
        />
        <polygon
          points="47,114 58,106 51,121"
          fill="#ff005d"
          filter={`url(#sideNavGlow-${side})`}
        />
        <polygon
          points="65,114 76,106 69,121"
          fill="#ff005d"
          filter={`url(#sideNavGlow-${side})`}
        />

        <rect
          x="2"
          y="56"
          width="7"
          height="7"
          fill="#ff005d"
          filter={`url(#sideNavGlow-${side})`}
        />
      </svg>

      <span className="select-none text-[13px] font-black uppercase tracking-[0.02em] text-[#00fff0] drop-shadow-[0_0_8px_rgba(0,255,240,0.95)] transition-all duration-300 group-hover:tracking-[0.08em]">
        {label}
      </span>
    </button>
  );
}

export default function ProjectPreviewModal({
  item,
  onClose,
  onPrev,
  onNext,
}: ProjectPreviewModalProps) {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev?.();
      if (event.key === "ArrowRight") onNext?.();
    };

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center overflow-hidden">
      <button
        type="button"
        aria-label="Close project preview"
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-[3px]"
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="cyber-bg-light cyber-bg-light-cyan" />
        <div className="cyber-bg-light cyber-bg-light-red" />
      </div>

      {/* Wrapper rộng hơn modal để 2 nút không đè vào khối */}
      <div className="preview-layout relative z-10 flex w-[min(900px,calc(100vw-32px))] items-center justify-center overflow-visible">
        <SideHudNav side="left" label="PREVIOUS" onClick={onPrev} />
        <SideHudNav side="right" label="NEXT" onClick={onNext} />

        <div
          className="hud-open-stage relative overflow-visible"
          style={{
            width: `min(${MODAL_RENDER_W}px, calc(100vw - 250px))`,
            aspectRatio: `${VIEW_W} / ${VIEW_H}`,
          }}
        >
          <div className="hud-float h-full w-full overflow-visible">
            <div className="hud-tilt group relative h-full w-full overflow-visible">
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full overflow-visible"
                aria-hidden="true"
              >
                <defs>
                  <filter
                    id="previewRedGlow"
                    x="-80%"
                    y="-80%"
                    width="260%"
                    height="260%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="4"
                      floodColor="#ff005d"
                      floodOpacity="0.95"
                    />
                  </filter>

                  <filter
                    id="previewCyanGlow"
                    x="-80%"
                    y="-80%"
                    width="260%"
                    height="260%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="3"
                      floodColor="#00fff0"
                      floodOpacity="1"
                    />
                  </filter>

                  <filter
                    id="previewScreenNoise"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.9"
                      numOctaves="2"
                      seed="8"
                    />
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                      <feFuncA type="table" tableValues="0 0.22" />
                    </feComponentTransfer>
                  </filter>
                </defs>

                <polygon
                  points="22,25 704,25 704,116 719,132 719,352 704,368 704,456 62,456 22,416"
                  fill="#35141f"
                  stroke="#ff005d"
                  strokeWidth="1.4"
                  strokeLinejoin="miter"
                  vectorEffect="non-scaling-stroke"
                />

                <polygon
                  points="704,116 719,132 719,352 704,368"
                  fill="#ff005d"
                  filter="url(#previewRedGlow)"
                />

                <polygon
                  points="21,430 50,457 21,457"
                  fill="#ff005d"
                  filter="url(#previewRedGlow)"
                />

                <g filter="url(#previewRedGlow)">
                  <rect
                    x={rightX - L_SIZE}
                    y={topY}
                    width={L_SIZE}
                    height={L_THICKNESS}
                    fill="#ff005d"
                  />
                  <rect
                    x={rightX - L_THICKNESS}
                    y={topY}
                    width={L_THICKNESS}
                    height={L_SIZE}
                    fill="#ff005d"
                  />
                </g>

                <g filter="url(#previewCyanGlow)">
                  <rect
                    x={rightX - L_SIZE - DOT_GAP - DOT_SIZE}
                    y={topY}
                    width={DOT_SIZE}
                    height={DOT_SIZE}
                    fill="#00fff0"
                  />
                  <rect
                    x={rightX - L_THICKNESS}
                    y={topY + L_SIZE + DOT_GAP}
                    width={DOT_SIZE}
                    height={DOT_SIZE}
                    fill="#00fff0"
                  />
                </g>

                <g filter="url(#previewRedGlow)">
                  <rect
                    x={rightX - L_SIZE}
                    y={bottomY - L_THICKNESS}
                    width={L_SIZE}
                    height={L_THICKNESS}
                    fill="#ff005d"
                  />
                  <rect
                    x={rightX - L_THICKNESS}
                    y={bottomY - L_SIZE}
                    width={L_THICKNESS}
                    height={L_SIZE}
                    fill="#ff005d"
                  />
                </g>

                <g filter="url(#previewCyanGlow)">
                  <rect
                    x={rightX - L_SIZE - DOT_GAP - DOT_SIZE}
                    y={bottomY - L_THICKNESS}
                    width={DOT_SIZE}
                    height={DOT_SIZE}
                    fill="#00fff0"
                  />
                  <rect
                    x={rightX - L_THICKNESS}
                    y={bottomY - L_SIZE - DOT_GAP - DOT_SIZE}
                    width={DOT_SIZE}
                    height={DOT_SIZE}
                    fill="#00fff0"
                  />
                </g>

                <rect
                  x="22"
                  y="25"
                  width="697"
                  height="431"
                  fill="#ffffff"
                  opacity="0.04"
                  filter="url(#previewScreenNoise)"
                />
              </svg>

              <div className="pointer-events-none absolute inset-0 shadow-[0_0_34px_rgba(255,0,93,0.18)]" />

              <div className="pointer-events-none absolute inset-0 cyber-glitch cyber-glitch-cyan" />
              <div className="pointer-events-none absolute inset-0 cyber-glitch cyber-glitch-red" />

              <div className="pointer-events-none absolute inset-0 cyber-scanlines" />
              <div className="pointer-events-none absolute inset-0 cyber-light-sweep" />

              <div className="absolute inset-[42px] z-10 grid place-items-center overflow-visible">
                <ProjectInnerBlock item={item} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .preview-layout {
          min-height: 390px;
        }

        .side-hud-nav {
          opacity: 0;
          animation: navBoot 620ms ease-out 520ms forwards;
          will-change: opacity, transform, filter;
        }

        .side-hud-nav:hover svg {
          filter: drop-shadow(0 0 12px rgba(255, 0, 93, 0.8));
        }

        .hud-open-stage {
          opacity: 0;
          transform-origin: center center;
          animation:
            hudBoot 720ms cubic-bezier(0.16, 1, 0.3, 1) forwards,
            hudBootJitter 720ms steps(2, end) forwards;
          will-change: opacity, transform, filter, clip-path;
        }

        .hud-float {
          animation: hudFloat 3.8s ease-in-out 720ms infinite;
          will-change: transform;
        }

        .hud-tilt {
          transform-style: preserve-3d;
          transform-origin: center center;
          transform: perspective(1100px) rotateX(3deg) rotateY(-0.7deg) scale(1);
          transition:
            transform 360ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 360ms ease;
          will-change: transform, filter;
        }

        .hud-tilt:hover {
          transform: perspective(1100px) rotateX(3deg) rotateY(-0.7deg)
            scale(1.035);
          filter:
            drop-shadow(0 0 18px rgba(255, 0, 93, 0.32))
            drop-shadow(0 0 18px rgba(0, 255, 240, 0.18));
        }

        .inner-hud-card {
          transform-origin: center center;
          transform: translateZ(18px);
          filter: drop-shadow(0 0 8px rgba(255, 0, 93, 0.32));
          transition:
            transform 360ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 360ms ease;
          animation: innerFloat 3.2s ease-in-out 900ms infinite;
        }

        .hud-tilt:hover .inner-hud-card {
          transform: translateZ(18px) translateY(-3px) scale(1.012);
          filter:
            drop-shadow(0 0 12px rgba(255, 0, 93, 0.5))
            drop-shadow(0 0 10px rgba(0, 255, 240, 0.18));
        }

        .inner-media-scanline {
          opacity: 0.28;
          mix-blend-mode: screen;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0, 255, 240, 0.14) 0px,
            rgba(0, 255, 240, 0.14) 1px,
            transparent 1px,
            transparent 7px
          );
          animation: innerMediaScanMove 1000ms linear infinite;
        }

        .cyber-scanlines {
          opacity: 0.34;
          mix-blend-mode: screen;
          background:
            linear-gradient(
              to bottom,
              transparent 0px,
              rgba(0, 255, 240, 0.07) 1px,
              transparent 3px
            ),
            repeating-linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.025) 0px,
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px,
              transparent 7px
            );
          background-size:
            100% 9px,
            100% 8px;
          animation: scanMove 1100ms linear infinite;
        }

        .cyber-light-sweep {
          opacity: 0;
          mix-blend-mode: screen;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 255, 240, 0) 35%,
            rgba(0, 255, 240, 0.22) 48%,
            rgba(255, 0, 93, 0.18) 52%,
            transparent 66%,
            transparent 100%
          );
          transform: translateX(-120%);
          animation: lightSweep 720ms ease-out forwards;
        }

        .cyber-glitch {
          opacity: 0;
          mix-blend-mode: screen;
          background:
            linear-gradient(
              to bottom,
              transparent 0%,
              transparent 14%,
              currentColor 14.5%,
              transparent 15.5%,
              transparent 31%,
              currentColor 31.5%,
              transparent 32.3%,
              transparent 58%,
              currentColor 58.4%,
              transparent 59.5%,
              transparent 79%,
              currentColor 79.4%,
              transparent 80.4%,
              transparent 100%
            );
          clip-path: polygon(0 6%, 100% 6%, 100% 94%, 0 94%);
          animation: glitchFlash 720ms steps(2, end) forwards;
        }

        .cyber-glitch-cyan {
          color: rgba(0, 255, 240, 0.42);
          transform: translateX(-8px);
        }

        .cyber-glitch-red {
          color: rgba(255, 0, 93, 0.36);
          transform: translateX(8px);
          animation-delay: 40ms;
        }

        .cyber-bg-light {
          position: absolute;
          top: 50%;
          width: 38vw;
          height: 18vh;
          opacity: 0;
          filter: blur(22px);
          mix-blend-mode: screen;
          transform: translateY(-50%) scaleX(0.35);
          animation: bgLightBoot 820ms ease-out forwards;
        }

        .cyber-bg-light-cyan {
          left: -8vw;
          background: linear-gradient(
            90deg,
            rgba(0, 255, 240, 0.32),
            transparent
          );
        }

        .cyber-bg-light-red {
          right: -8vw;
          background: linear-gradient(
            270deg,
            rgba(255, 0, 93, 0.28),
            transparent
          );
          animation-delay: 70ms;
        }

        @keyframes navBoot {
          0% {
            opacity: 0;
            filter: brightness(2.2) blur(2px);
          }

          28% {
            opacity: 1;
            filter: brightness(2.8) blur(0px);
          }

          46% {
            opacity: 0.45;
          }

          68% {
            opacity: 1;
          }

          100% {
            opacity: 1;
            filter: brightness(1) blur(0px);
          }
        }

        @keyframes hudBoot {
          0% {
            opacity: 0;
            clip-path: inset(48% 48% 48% 48%);
            filter: brightness(2.4) saturate(1.8) blur(2px);
            transform: scale(0.92);
          }

          16% {
            opacity: 1;
            clip-path: inset(44% 0 44% 0);
            filter: brightness(2.8) saturate(2.4) blur(0px);
            transform: scale(1.02);
          }

          26% {
            opacity: 0.62;
            clip-path: inset(20% 0 55% 0);
            filter: brightness(1.8) saturate(2);
            transform: scale(0.985);
          }

          38% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
            filter: brightness(2.2) saturate(2.2);
            transform: scale(1.015);
          }

          52% {
            opacity: 0.82;
            clip-path: inset(-24px -24px -24px -24px);
            filter: brightness(1.3) saturate(1.4);
            transform: scale(0.995);
          }

          72% {
            opacity: 1;
            clip-path: inset(-48px -48px -48px -48px);
            filter: brightness(1.1) saturate(1.2);
            transform: scale(1.004);
          }

          100% {
            opacity: 1;
            clip-path: inset(-120px -120px -120px -120px);
            filter: brightness(1) saturate(1);
            transform: scale(1);
          }
        }

        @keyframes hudBootJitter {
          0% {
            translate: 0 0;
          }

          8% {
            translate: -10px 2px;
          }

          14% {
            translate: 8px -2px;
          }

          20% {
            translate: -4px 1px;
          }

          28% {
            translate: 6px 0;
          }

          36% {
            translate: -2px -1px;
          }

          46%,
          100% {
            translate: 0 0;
          }
        }

        @keyframes hudFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes innerFloat {
          0%,
          100% {
            translate: 0 0;
          }

          50% {
            translate: 0 -4px;
          }
        }

        @keyframes innerMediaScanMove {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 0 14px;
          }
        }

        @keyframes scanMove {
          from {
            background-position:
              0 0,
              0 0;
          }

          to {
            background-position:
              0 18px,
              0 8px;
          }
        }

        @keyframes lightSweep {
          0% {
            opacity: 0;
            transform: translateX(-120%);
          }

          18% {
            opacity: 0.95;
          }

          100% {
            opacity: 0;
            transform: translateX(120%);
          }
        }

        @keyframes glitchFlash {
          0% {
            opacity: 0;
          }

          10% {
            opacity: 0.8;
          }

          18% {
            opacity: 0;
          }

          25% {
            opacity: 0.65;
          }

          32% {
            opacity: 0.12;
          }

          44% {
            opacity: 0.55;
          }

          58% {
            opacity: 0;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes bgLightBoot {
          0% {
            opacity: 0;
            transform: translateY(-50%) scaleX(0.15);
          }

          22% {
            opacity: 0.9;
            transform: translateY(-50%) scaleX(1);
          }

          100% {
            opacity: 0.18;
            transform: translateY(-50%) scaleX(1.25);
          }
        }

        @media (max-width: 760px) {
          .preview-layout {
            width: min(100vw - 20px, 680px);
          }

          .side-hud-nav {
            transform: translateY(-50%) scale(0.78);
          }

          .side-hud-nav:hover {
            transform: translateY(-50%) scale(0.84);
          }
        }
      `}</style>
    </div>
  );
}
