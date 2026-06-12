"use client";

import {
  CSSProperties,
  ReactNode,
  PointerEvent as ReactPointerEvent,
  UIEvent,
  WheelEvent as ReactWheelEvent,
  WheelEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

type AboutCardFrameProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  imageSrc?: string;
  scrollKey?: string | number;
};

type Corner = "tl" | "br";

type LAccentProps = {
  size?: number;
  thickness?: number;
  color?: string;
  glow?: boolean;
  offsetX?: number;
  offsetY?: number;
  corner?: Corner;
};

type TriangleAccentProps = {
  size?: number;
  color?: string;
  glow?: boolean;
};

type BottomBarAccentProps = {
  totalWidth?: number;
  barWidth?: number;
  barHeight?: number;
  leftOverhang?: number;
  rightCut?: number;
  color?: string;
  glow?: boolean;
};

type RightTabAccentProps = {
  width?: number;
  height?: number;
  cutTop?: number;
  cutBottom?: number;
  color?: string;
  glow?: boolean;
};

const PINK_RGB = "255, 0, 93";
const CYAN_RGB = "0, 255, 238";

const ABOUT_CARD_EFFECT_CSS = `
@keyframes epAboutCardFloat {
  0% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -8px, 0); }
  100% { transform: translate3d(0, 0, 0); }
}

@keyframes epNeonPinkPulse {
  0% {
    opacity: 0.82;
    filter:
      drop-shadow(0 0 3px rgba(255, 0, 93, 0.72))
      drop-shadow(0 0 8px rgba(255, 0, 93, 0.44))
      drop-shadow(0 0 18px rgba(255, 0, 93, 0.18));
  }
  48% {
    opacity: 1;
    filter:
      drop-shadow(0 0 5px rgba(255, 0, 93, 1))
      drop-shadow(0 0 14px rgba(255, 0, 93, 0.82))
      drop-shadow(0 0 32px rgba(255, 0, 93, 0.38));
  }
  52% {
    opacity: 0.72;
    filter:
      drop-shadow(0 0 2px rgba(255, 0, 93, 0.54))
      drop-shadow(0 0 7px rgba(255, 0, 93, 0.28));
  }
  100% {
    opacity: 0.96;
    filter:
      drop-shadow(0 0 4px rgba(255, 0, 93, 0.9))
      drop-shadow(0 0 12px rgba(255, 0, 93, 0.62))
      drop-shadow(0 0 26px rgba(255, 0, 93, 0.28));
  }
}

@keyframes epNeonFramePulse {
  0% {
    opacity: 0.9;
    filter:
      drop-shadow(0 0 4px rgba(255, 0, 93, 0.58))
      drop-shadow(0 0 12px rgba(255, 0, 93, 0.28));
  }
  50% {
    opacity: 1;
    filter:
      drop-shadow(0 0 6px rgba(255, 0, 93, 0.82))
      drop-shadow(0 0 18px rgba(255, 0, 93, 0.42))
      drop-shadow(0 0 36px rgba(255, 0, 93, 0.18));
  }
  100% {
    opacity: 0.94;
    filter:
      drop-shadow(0 0 5px rgba(255, 0, 93, 0.66))
      drop-shadow(0 0 14px rgba(255, 0, 93, 0.32));
  }
}

@keyframes epNeonLinePulse {
  0% {
    opacity: 0.82;
    box-shadow:
      0 0 4px rgba(255, 0, 93, 0.75),
      0 0 10px rgba(255, 0, 93, 0.38);
  }
  45% {
    opacity: 1;
    box-shadow:
      0 0 7px rgba(255, 0, 93, 1),
      0 0 18px rgba(255, 0, 93, 0.72),
      0 0 38px rgba(255, 0, 93, 0.28);
  }
  48% {
    opacity: 0.62;
    box-shadow:
      0 0 3px rgba(255, 0, 93, 0.5),
      0 0 8px rgba(255, 0, 93, 0.22);
  }
  100% {
    opacity: 0.95;
    box-shadow:
      0 0 6px rgba(255, 0, 93, 0.9),
      0 0 15px rgba(255, 0, 93, 0.52),
      0 0 30px rgba(255, 0, 93, 0.22);
  }
}

@keyframes epNeonCyanPulse {
  0% {
    opacity: 0.84;
    filter:
      drop-shadow(0 0 3px rgba(0, 255, 238, 0.62))
      drop-shadow(0 0 8px rgba(0, 255, 238, 0.32));
  }
  50% {
    opacity: 1;
    filter:
      drop-shadow(0 0 5px rgba(0, 255, 238, 0.98))
      drop-shadow(0 0 12px rgba(0, 255, 238, 0.62))
      drop-shadow(0 0 24px rgba(0, 255, 238, 0.24));
  }
  100% {
    opacity: 0.92;
    filter:
      drop-shadow(0 0 4px rgba(0, 255, 238, 0.74))
      drop-shadow(0 0 10px rgba(0, 255, 238, 0.4));
  }
}

.ep-about-card-float {
  animation: epAboutCardFloat 5.8s ease-in-out infinite;
  transform-style: preserve-3d;
  will-change: transform;
}

.ep-about-card-tilt {
  transform-style: preserve-3d;
  transition: transform 180ms ease, filter 180ms ease;
  will-change: transform, filter;
}

.ep-about-card-layer-panel { transform: translateZ(0px); }
.ep-about-card-layer-content { transform: translateZ(34px); }
.ep-about-card-layer-photo { transform: translateZ(38px); }
.ep-about-card-layer-info { transform: translateZ(44px); }
.ep-about-card-layer-scroll { transform: translateZ(52px); }
.ep-about-card-layer-accent { transform: translateZ(62px); }


@keyframes epMirrorSweep {
  0% {
    transform: translate3d(-170%, 0, 0) skewX(-18deg);
    opacity: 0;
  }
  12% { opacity: 0; }
  24% { opacity: 0.72; }
  44% {
    transform: translate3d(330%, 0, 0) skewX(-18deg);
    opacity: 0;
  }
  100% {
    transform: translate3d(330%, 0, 0) skewX(-18deg);
    opacity: 0;
  }
}

.ep-about-card-reflection {
  overflow: hidden;
  mix-blend-mode: screen;
  transform: translateZ(72px);
}

.ep-about-card-reflection::before {
  content: "";
  position: absolute;
  top: -42%;
  left: -42%;
  width: 26%;
  height: 188%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.00) 18%,
    rgba(255, 255, 255, 0.34) 46%,
    rgba(0, 255, 238, 0.24) 58%,
    rgba(255, 0, 93, 0.12) 70%,
    transparent 100%
  );
  filter: blur(1.2px);
  animation: epMirrorSweep 4.6s ease-in-out infinite;
}

.ep-about-card-reflection::after {
  content: "";
  position: absolute;
  top: -34%;
  left: -38%;
  width: 8%;
  height: 168%;
  background: rgba(255, 255, 255, 0.34);
  filter: blur(5px);
  animation: epMirrorSweep 4.6s ease-in-out infinite;
  animation-delay: 0.08s;
}

@media (prefers-reduced-motion: reduce) {
  .ep-about-card-float,
  .ep-neon-pink,
  .ep-neon-frame,
  .ep-neon-line,
  .ep-neon-cyan,
  .ep-about-card-reflection::before,
  .ep-about-card-reflection::after {
    animation: none !important;
  }
}

@keyframes epCyberFramePopOut {
  0% {
    opacity: 0;
    transform: scale(0.58) translate3d(-34px, 26px, 0) rotateX(16deg) rotateY(-12deg) skewX(-8deg);
    filter:
      blur(8px)
      brightness(1.9)
      drop-shadow(-18px 0 0 rgba(0, 255, 238, 0.7))
      drop-shadow(18px 0 0 rgba(255, 0, 93, 0.64));
  }

  18% {
    opacity: 1;
    transform: scale(1.06) translate3d(16px, -8px, 0) rotateX(-6deg) rotateY(8deg) skewX(7deg);
  }

  34% {
    transform: scale(0.97) translate3d(-12px, 5px, 0) rotateX(5deg) rotateY(-7deg) skewX(-5deg);
  }

  52% {
    transform: scale(1.025) translate3d(7px, -2px, 0) rotateX(-2deg) rotateY(4deg) skewX(3deg);
    filter:
      blur(1px)
      brightness(1.35)
      drop-shadow(-9px 0 0 rgba(0, 255, 238, 0.52))
      drop-shadow(9px 0 0 rgba(255, 0, 93, 0.46));
  }

  100% {
    opacity: 1;
    transform: scale(1) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) skewX(0deg);
    filter: none;
  }
}

@keyframes epCyberContentBoot {
  0% {
    opacity: 0;
    transform: translate3d(-10px, 8px, 34px) skewX(-7deg);
    filter:
      drop-shadow(-6px 0 0 rgba(0, 255, 238, 0.74))
      drop-shadow(6px 0 0 rgba(255, 0, 93, 0.62));
  }

  24% {
    opacity: 1;
    transform: translate3d(8px, -4px, 34px) skewX(5deg);
  }

  48% {
    transform: translate3d(-5px, 2px, 34px) skewX(-3deg);
    filter:
      drop-shadow(-3px 0 0 rgba(0, 255, 238, 0.48))
      drop-shadow(3px 0 0 rgba(255, 0, 93, 0.42));
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 34px) skewX(0deg);
    filter: none;
  }
}

@keyframes epCyberDataSweep {
  0% { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
  15% { opacity: 1; }
  65% { opacity: 0.85; }
  100% { transform: translateX(220%) skewX(-18deg); opacity: 0; }
}

.ep-about-card-pop-stage {
  overflow: visible;
  transform-style: preserve-3d;
  animation: epCyberFramePopOut 640ms cubic-bezier(0.16, 1.15, 0.32, 1) both;
  will-change: transform, filter, opacity;
}

.ep-about-card-perspective-space {
  overflow: visible;
  transform-style: preserve-3d;
  perspective: 1200px;
  perspective-origin: 42% 50%;
}

.ep-about-card-content-switch {
  animation: epCyberContentBoot 560ms steps(2, end) both;
  animation-delay: 420ms;
  will-change: transform, filter, opacity;
}

.ep-about-card-data-sweep {
  position: absolute;
  inset: 0;
  z-index: 21;
  pointer-events: none;
  overflow: hidden;
  mix-blend-mode: screen;
  transform: translateZ(76px);
}

.ep-about-card-data-sweep::before {
  content: "";
  position: absolute;
  top: -10%;
  bottom: -10%;
  left: -45%;
  width: 36%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 238, 0.72),
    rgba(255, 0, 93, 0.42),
    transparent
  );
  filter: blur(0.6px);
  animation: epCyberDataSweep 820ms ease-out both;
  animation-delay: 260ms;
}

@media (prefers-reduced-motion: reduce) {
  .ep-about-card-pop-stage,
  .ep-about-card-content-switch,
  .ep-about-card-data-sweep::before {
    animation: none !important;
  }
}
`;

const HUD = {
  frameWidth: 500,
  frameHeight: 326,

  bgColor: "transparent",
  panelColor: "#35151f",
  accentColor: "#ff005d",
  cyanColor: "#00ffee",

  borderSize: 1,

  outerCutY: "90%",
  outerCutX: "6.4%",
  innerCutY: "90%",
  innerCutX: "6.2%",

  topLeftL: {
    wrapperLeft: 6,
    wrapperTop: 6,
    size: 40,
    thickness: 5,
    offsetX: -8,
    offsetY: -8,
  },

  bottomRightL: {
    wrapperRight: 6,
    wrapperBottom: 6,
    size: 40,
    thickness: 5,
    offsetX: 8,
    offsetY: 8,
  },

  triangle: {
    left: 0,
    bottom: -10,
    size: 30,
  },

  bottomBar: {
    left: 40,
    bottom: -9,
    barWidth: 182,
    barHeight: 10,
    leftOverhang: 10,
    rightCut: 10,
    rightPadding: 0,
  },

  rightTab: {
    right: -10,
    top: 72,
    width: 10,
    height: 182,
    cutTop: 10,
    cutBottom: 10,
  },

  photo: {
    left: 20,
    top: 34,
    width: 190,
    height: 272,
    cut: 28,
    borderSize: 1,
    cornerDotSize: 6,
  },

  info: {
    left: 230,
    top: 36,
    width: 205,
    height: 238,
    titleSize: 22,
    detailSize: 12,
    bodySize: 13,
    scrollTextHeight: 106,
  },

  scroll: {
    left: 448,
    top: 36,
    width: 24,
    height: 218,
    thumbWidth: 22,
    thumbHeight: 28,
  },
};

const FRAME_SAFE_AREA = {
  left: 34,
  top: 26,
  right: 58,
  bottom: 52,
};

const FRAME_SAFE_WIDTH =
  HUD.frameWidth + FRAME_SAFE_AREA.left + FRAME_SAFE_AREA.right;

const FRAME_SAFE_HEIGHT =
  HUD.frameHeight + FRAME_SAFE_AREA.top + FRAME_SAFE_AREA.bottom;

function accentHighlightStyle(glow = true): CSSProperties {
  if (!glow) return {};

  return {
    overflow: "visible",
    animation: "epNeonPinkPulse 1.65s ease-in-out infinite alternate",
    willChange: "filter, opacity",
  };
}

function coreAccentStyle(color: string): CSSProperties {
  return { backgroundColor: color };
}

function cyanGlowStyle(): CSSProperties {
  return {
    animation: "epNeonCyanPulse 1.55s ease-in-out infinite alternate",
    boxShadow: `
      0 0 5px rgba(${CYAN_RGB}, 0.95),
      0 0 12px rgba(${CYAN_RGB}, 0.55),
      0 0 24px rgba(${CYAN_RGB}, 0.22)
    `,
    willChange: "filter, opacity",
  };
}

function LAccent({
  size = 40,
  thickness = 8,
  color = "#ff005d",
  glow = true,
  offsetX = 0,
  offsetY = 0,
  corner = "tl",
}: LAccentProps) {
  const clipPath =
    corner === "tl"
      ? `
        polygon(
          0 0,
          100% 0,
          100% ${thickness}px,
          ${thickness}px ${thickness}px,
          ${thickness}px 100%,
          0 100%
        )
      `
      : `
        polygon(
          calc(100% - ${thickness}px) 0,
          100% 0,
          100% 100%,
          0 100%,
          0 calc(100% - ${thickness}px),
          calc(100% - ${thickness}px) calc(100% - ${thickness}px)
        )
      `;

  return (
    <span
      className="absolute block pointer-events-none ep-neon-pink"
      style={{
        left: offsetX,
        top: offsetY,
        width: size,
        height: size,
        ...accentHighlightStyle(glow),
        zIndex: 2,
      }}
    >
      <span
        className="absolute inset-0 block pointer-events-none"
        style={{ clipPath, ...coreAccentStyle(color) }}
      />
    </span>
  );
}

function TriangleAccent({
  size = 25,
  color = "#ff005d",
  glow = true,
}: TriangleAccentProps) {
  return (
    <span
      className="absolute block pointer-events-none ep-neon-pink"
      style={{
        width: size,
        height: size,
        ...accentHighlightStyle(glow),
        zIndex: 2,
      }}
    >
      <span
        className="absolute inset-0 block pointer-events-none"
        style={{
          clipPath: "polygon(0 0, 0 100%, 100% 100%)",
          ...coreAccentStyle(color),
        }}
      />
    </span>
  );
}

function BottomBarAccent({
  totalWidth = 284,
  barWidth = 110,
  barHeight = 12,
  leftOverhang = 13,
  rightCut = 13,
  color = "#ff005d",
  glow = true,
}: BottomBarAccentProps) {
  const shapeWidth = barWidth + leftOverhang;
  const lineStart = barWidth - rightCut;

  const trapezoidClip = `
    polygon(
      0 0,
      100% 0,
      calc(100% - ${rightCut}px) 100%,
      ${leftOverhang}px 100%
    )
  `;

  return (
    <div
      className="relative"
      style={{ width: totalWidth, height: barHeight, overflow: "visible" }}
    >
      <span
        className="absolute top-0 block pointer-events-none ep-neon-pink"
        style={{
          left: -leftOverhang,
          width: shapeWidth,
          height: barHeight,
          ...accentHighlightStyle(glow),
          zIndex: 2,
        }}
      >
        <span
          className="absolute inset-0 block pointer-events-none"
          style={{ clipPath: trapezoidClip, ...coreAccentStyle(color) }}
        />
      </span>

      <span
        className="absolute block pointer-events-none ep-neon-line"
        style={{
          left: lineStart,
          top: barHeight - 1,
          width: totalWidth - lineStart,
          height: 1,
          backgroundColor: color,
          animation: glow
            ? "epNeonLinePulse 1.75s ease-in-out infinite alternate"
            : "none",
          zIndex: 2,
        }}
      />
    </div>
  );
}

function RightTabAccent({
  width = 12,
  height = 182,
  cutTop = 14,
  cutBottom = 14,
  color = "#ff005d",
  glow = true,
}: RightTabAccentProps) {
  const clipPath = `
    polygon(
      0 0,
      100% ${cutTop}px,
      100% calc(100% - ${cutBottom}px),
      0 100%
    )
  `;

  return (
    <span
      className="relative block pointer-events-none ep-neon-pink"
      style={{
        width,
        height,
        overflow: "visible",
        ...accentHighlightStyle(glow),
      }}
    >
      <span
        className="absolute inset-0 block pointer-events-none"
        style={{ clipPath, ...coreAccentStyle(color) }}
      />
    </span>
  );
}

function PhotoBlock({ imageSrc }: { imageSrc?: string }) {
  const cut = HUD.photo.cut;

  const clipPath = `
    polygon(
      0 0,
      100% 0,
      100% 100%,
      ${cut}px 100%,
      0 calc(100% - ${cut}px)
    )
  `;

  return (
    <div
      className="absolute z-10 ep-about-card-layer-photo"
      style={{
        left: HUD.photo.left,
        top: HUD.photo.top,
        width: HUD.photo.width,
        height: HUD.photo.height,
        overflow: "visible",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: HUD.accentColor,
          clipPath,
          boxShadow: `
            0 0 4px rgba(${PINK_RGB}, 0.55),
            0 0 10px rgba(${PINK_RGB}, 0.22)
          `,
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          left: HUD.photo.borderSize,
          top: HUD.photo.borderSize,
          right: HUD.photo.borderSize,
          bottom: HUD.photo.borderSize,
          backgroundColor: HUD.panelColor,
          clipPath,
          overflow: "hidden",
        }}
      >
        {imageSrc && (
        <div className="photo-glitch-wrap relative h-full w-full overflow-hidden">
          <img
            src="/Profile/Me.png"
            alt="About profile"
            className="photo-glitch-main h-full w-full object-cover"
          />

          <img
            src="/Profile/Me.png"
            alt=""
            aria-hidden="true"
            className="photo-glitch-copy photo-glitch-copy-cyan h-full w-full object-cover"
          />

          <img
            src="/Profile/Me.png"
            alt=""
            aria-hidden="true"
            className="photo-glitch-copy photo-glitch-copy-pink h-full w-full object-cover"
          />

          <span className="photo-glitch-noise" />
          <span className="photo-glitch-scan" />
        </div>
      )}
      </div>

      <span
        className="absolute block pointer-events-none ep-neon-cyan"
        style={{
          left: -(HUD.photo.cornerDotSize / 2),
          top: -(HUD.photo.cornerDotSize / 2),
          width: HUD.photo.cornerDotSize,
          height: HUD.photo.cornerDotSize,
          backgroundColor: HUD.cyanColor,
          ...cyanGlowStyle(),
        }}
      />

      <span
        className="absolute block pointer-events-none ep-neon-cyan"
        style={{
          right: -(HUD.photo.cornerDotSize / 2),
          bottom: -(HUD.photo.cornerDotSize / 2),
          width: HUD.photo.cornerDotSize,
          height: HUD.photo.cornerDotSize,
          backgroundColor: HUD.cyanColor,
          ...cyanGlowStyle(),
        }}
      />
    </div>
  );
}

function CustomScrollBar({
  ratio,
  onWheel,
}: {
  ratio: number;
  onWheel: WheelEventHandler<HTMLDivElement>;
}) {
  const maxThumbTop = HUD.scroll.height - HUD.scroll.thumbHeight;
  const thumbTop = ratio * maxThumbTop;

  return (
    <div
      onWheel={onWheel}
      className="absolute z-30 ep-about-card-layer-scroll"
      style={{
        left: HUD.scroll.left,
        top: HUD.scroll.top,
        width: HUD.scroll.width,
        height: HUD.scroll.height,
        cursor: "default",
        userSelect: "none",
        pointerEvents: "auto",
        touchAction: "pan-y",
        zIndex: 90,
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          left: HUD.scroll.width / 2,
          top: HUD.scroll.thumbHeight + 8,
          height: HUD.scroll.height - HUD.scroll.thumbHeight - 8,
          borderLeft: `2px dotted rgba(${CYAN_RGB}, 0.65)`,
          filter: `
            drop-shadow(0 0 5px rgba(${CYAN_RGB}, 0.55))
            drop-shadow(0 0 10px rgba(${CYAN_RGB}, 0.25))
          `,
        }}
      />

      <span
        className="absolute block ep-neon-cyan pointer-events-none"
        style={{
          left: (HUD.scroll.width - HUD.scroll.thumbWidth) / 2,
          top: thumbTop,
          width: HUD.scroll.thumbWidth,
          height: HUD.scroll.thumbHeight,
          backgroundColor: HUD.cyanColor,
          clipPath: `
            polygon(
              0 0,
              50% 25%,
              100% 0,
              100% 72%,
              50% 100%,
              0 72%
            )
          `,
          transition: "top 120ms ease-out",
          ...cyanGlowStyle(),
        }}
      />
    </div>
  );
}

export default function AboutCardFrame({
  children,
  className = "",
  contentClassName = "",
  imageSrc,
  scrollKey,
}: AboutCardFrameProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);

  const bottomBarTotalWidth =
    HUD.frameWidth - HUD.bottomBar.left - HUD.bottomBar.rightPadding;

  const baseRotateY = 5;

  function handleCardPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const element = cardRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    const rotateY = (px - 0.5) * 4;
    const rotateX = (0.5 - py) * 4;

    setTilt({ rotateX, rotateY });
  }

  function handleCardPointerEnter() {
    setIsHovering(true);
  }

  function handleCardPointerLeave() {
    setIsHovering(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }

  function updateRatioFromScrollElement(element: HTMLDivElement) {
    const maxScroll = element.scrollHeight - element.clientHeight;

    if (maxScroll <= 0) {
      setScrollRatio(0);
      return;
    }

    setScrollRatio(element.scrollTop / maxScroll);
  }

  function handleContentScroll(event: UIEvent<HTMLDivElement>) {
    updateRatioFromScrollElement(event.currentTarget);
  }

  function scrollContentByDelta(deltaY: number) {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;

    if (maxScroll <= 0) {
      setScrollRatio(0);
      return;
    }

    const wheelSpeed = 1.15;
    const nextScrollTop = Math.max(
      0,
      Math.min(scrollElement.scrollTop + deltaY * wheelSpeed, maxScroll),
    );

    scrollElement.scrollTop = nextScrollTop;
    setScrollRatio(nextScrollTop / maxScroll);
  }

  function handleAboutCardWheel(event: ReactWheelEvent<HTMLDivElement>) {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
    if (maxScroll <= 0) return;

    event.preventDefault();
    event.stopPropagation();

    scrollContentByDelta(event.deltaY);
  }

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    scrollElement.scrollTop = 0;
    updateRatioFromScrollElement(scrollElement);
  }, [scrollKey]);

  return (
    <div
      className={`relative z-20 shrink-0 overflow-visible ${className}`}
      style={{
        width: HUD.frameWidth,
        height: HUD.frameHeight,
        overflow: "visible",
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
      <style>{ABOUT_CARD_EFFECT_CSS}</style>

      <div
        className="pointer-events-none absolute overflow-visible"
        style={{
          left: -FRAME_SAFE_AREA.left,
          top: -FRAME_SAFE_AREA.top,
          width: FRAME_SAFE_WIDTH,
          height: FRAME_SAFE_HEIGHT,
          overflow: "visible",
          perspective: 1200,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="ep-about-card-float pointer-events-auto absolute overflow-visible"
          style={{
            left: FRAME_SAFE_AREA.left,
            top: FRAME_SAFE_AREA.top,
            width: HUD.frameWidth,
            height: HUD.frameHeight,
            overflow: "visible",
            perspective: 1200,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="ep-about-card-pop-stage"
            style={{
              width: HUD.frameWidth,
              height: HUD.frameHeight,
              overflow: "visible",
              transformStyle: "preserve-3d",
              perspective: 1200,
              perspectiveOrigin: "42% 50%",
            }}
          >
            <div
              className="ep-about-card-perspective-space"
              style={{
                width: HUD.frameWidth,
                height: HUD.frameHeight,
                overflow: "visible",
                transformStyle: "preserve-3d",
                perspective: 1200,
                perspectiveOrigin: "42% 50%",
              }}
            >
              <div
                ref={cardRef}
                className="ep-about-card-tilt relative isolate overflow-visible"
                onPointerEnter={handleCardPointerEnter}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={handleCardPointerLeave}
                onWheel={handleAboutCardWheel}
                style={{
                  width: HUD.frameWidth,
                  height: HUD.frameHeight,
                  backgroundColor: HUD.bgColor,
                  transform: `
                perspective(1200px)
                rotateX(${tilt.rotateX}deg)
                rotateY(${baseRotateY + tilt.rotateY}deg)
                scale(${isHovering ? 1.018 : 1})
              `,
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d",
                  filter: isHovering
                    ? "drop-shadow(0 20px 34px rgba(0, 0, 0, 0.34))"
                    : "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.22))",
                }}
              >
                <div
                  className="absolute inset-0 z-0 pointer-events-none ep-about-card-layer-panel ep-neon-frame"
                  style={{
                    backgroundColor: HUD.accentColor,
                    clipPath: `polygon(
                  0 0,
                  100% 0,
                  100% 100%,
                  ${HUD.outerCutX} 100%,
                  0 ${HUD.outerCutY}
                )`,
                    animation:
                      "epNeonFramePulse 2.2s ease-in-out infinite alternate",
                  }}
                />

                <div
                  className="absolute z-[1] pointer-events-none ep-about-card-layer-panel"
                  style={{
                    left: HUD.borderSize,
                    top: HUD.borderSize,
                    right: HUD.borderSize,
                    bottom: HUD.borderSize,
                    backgroundColor: HUD.panelColor,
                    clipPath: `polygon(
                  0 0,
                  100% 0,
                  100% 100%,
                  ${HUD.innerCutX} 100%,
                  0 ${HUD.innerCutY}
                )`,
                  }}
                />

                <div
                  className={`absolute inset-0 z-10 ep-about-card-layer-content ep-about-card-content-switch ${contentClassName}`}
                >
                  <PhotoBlock imageSrc={"/Profile/Me.png"} />

                  <div
                    ref={scrollRef}
                    onScroll={handleContentScroll}
                    className="absolute z-10 ep-about-card-layer-info pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    style={{
                      left: HUD.info.left,
                      top: HUD.info.top,
                      width: HUD.info.width,
                      height: HUD.info.height,
                      overflowY: "hidden",
                      msOverflowStyle: "none",
                    }}
                  >
                    <div style={{ paddingBottom: 18 }}>{children}</div>
                  </div>

                  <CustomScrollBar
                    ratio={scrollRatio}
                    onWheel={handleAboutCardWheel}
                  />
                </div>

                <div
                  className="absolute inset-0 pointer-events-none ep-about-card-reflection"
                  style={{
                    zIndex: 18,
                    clipPath: `polygon(
                  0 0,
                  100% 0,
                  100% 100%,
                  ${HUD.innerCutX} 100%,
                  0 ${HUD.innerCutY}
                )`,
                  }}
                />

                <div
                  className="absolute inset-0 pointer-events-none ep-about-card-data-sweep"
                  style={{
                    clipPath: `polygon(
                  0 0,
                  100% 0,
                  100% 100%,
                  ${HUD.innerCutX} 100%,
                  0 ${HUD.innerCutY}
                )`,
                  }}
                />

                <div
                  className="absolute z-20 ep-about-card-layer-accent"
                  style={{
                    left: HUD.topLeftL.wrapperLeft,
                    top: HUD.topLeftL.wrapperTop,
                    width: HUD.topLeftL.size,
                    height: HUD.topLeftL.size,
                  }}
                >
                  <LAccent
                    corner="tl"
                    size={HUD.topLeftL.size}
                    thickness={HUD.topLeftL.thickness}
                    color={HUD.accentColor}
                    glow
                    offsetX={HUD.topLeftL.offsetX}
                    offsetY={HUD.topLeftL.offsetY}
                  />
                </div>

                <div
                  className="absolute z-20 ep-about-card-layer-accent"
                  style={{
                    left: HUD.triangle.left,
                    bottom: HUD.triangle.bottom,
                    width: HUD.triangle.size,
                    height: HUD.triangle.size,
                  }}
                >
                  <TriangleAccent
                    size={HUD.triangle.size}
                    color={HUD.accentColor}
                    glow
                  />
                </div>

                <div
                  className="absolute z-20 ep-about-card-layer-accent"
                  style={{
                    left: HUD.bottomBar.left,
                    bottom: HUD.bottomBar.bottom,
                  }}
                >
                  <BottomBarAccent
                    totalWidth={bottomBarTotalWidth}
                    barWidth={HUD.bottomBar.barWidth}
                    barHeight={HUD.bottomBar.barHeight}
                    leftOverhang={HUD.bottomBar.leftOverhang}
                    rightCut={HUD.bottomBar.rightCut}
                    color={HUD.accentColor}
                    glow
                  />
                </div>

                <div
                  className="absolute z-20 ep-about-card-layer-accent"
                  style={{
                    right: HUD.rightTab.right,
                    top: HUD.rightTab.top,
                    width: HUD.rightTab.width,
                    height: HUD.rightTab.height,
                  }}
                >
                  <RightTabAccent
                    width={HUD.rightTab.width}
                    height={HUD.rightTab.height}
                    cutTop={HUD.rightTab.cutTop}
                    cutBottom={HUD.rightTab.cutBottom}
                    color={HUD.accentColor}
                    glow
                  />
                </div>

                <div
                  className="absolute z-20 ep-about-card-layer-accent"
                  style={{
                    right: HUD.bottomRightL.wrapperRight,
                    bottom: HUD.bottomRightL.wrapperBottom,
                    width: HUD.bottomRightL.size,
                    height: HUD.bottomRightL.size,
                  }}
                >
                  <LAccent
                    corner="br"
                    size={HUD.bottomRightL.size}
                    thickness={HUD.bottomRightL.thickness}
                    color={HUD.accentColor}
                    glow
                    offsetX={HUD.bottomRightL.offsetX}
                    offsetY={HUD.bottomRightL.offsetY}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
