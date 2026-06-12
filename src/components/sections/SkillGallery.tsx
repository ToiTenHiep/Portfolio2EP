"use client";

import {
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import SkillHologramCube from "./SkillHologramCube";
import { skills, type SkillItem } from "./skills";

type SkillGalleryProps = {
  onClose?: () => void;
};

const SCROLL_TRACK_H = 300;
const SCROLL_THUMB_H = 32;

function CornerAccent({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const wrapClass = {
    tl: "left-[8px] top-[8px]",
    tr: "right-[8px] top-[8px]",
    bl: "bottom-[8px] left-[8px]",
    br: "bottom-[8px] right-[8px]",
  }[corner];

  const horizontalClass = {
    tl: "left-0 top-0",
    tr: "right-0 top-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  }[corner];

  const verticalClass = {
    tl: "left-0 top-0",
    tr: "right-0 top-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  }[corner];

  const dotAClass = {
    tl: "left-[50px] top-0",
    tr: "right-[50px] top-0",
    bl: "left-[50px] bottom-0",
    br: "right-[50px] bottom-0",
  }[corner];

  const dotBClass = {
    tl: "left-0 top-[50px]",
    tr: "right-0 top-[50px]",
    bl: "left-0 bottom-[50px]",
    br: "right-0 bottom-[50px]",
  }[corner];

  return (
    <div
      className={`pointer-events-none absolute z-20 h-[58px] w-[58px] ${wrapClass}`}
    >
      <div
        className={`absolute h-[6px] w-[42px] bg-[#ff005d] shadow-[0_0_8px_rgba(255,0,93,0.95),0_0_18px_rgba(255,0,93,0.5)] ${horizontalClass}`}
      />

      <div
        className={`absolute h-[42px] w-[6px] bg-[#ff005d] shadow-[0_0_8px_rgba(255,0,93,0.95),0_0_18px_rgba(255,0,93,0.5)] ${verticalClass}`}
      />

      <div
        className={`absolute h-[6px] w-[6px] bg-[#00fff0] shadow-[0_0_7px_rgba(0,255,240,1),0_0_15px_rgba(0,255,240,0.8)] ${dotAClass}`}
      />

      <div
        className={`absolute h-[6px] w-[6px] bg-[#00fff0] shadow-[0_0_7px_rgba(0,255,240,1),0_0_15px_rgba(0,255,240,0.8)] ${dotBClass}`}
      />
    </div>
  );
}

function CloseHudButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close skill gallery"
      className="absolute right-[24px] top-[22px] z-30 grid h-[36px] w-[36px] place-items-center border border-[#ff005d] bg-transparent text-[#ff005d] transition-all duration-300 hover:bg-[#ff005d]/10 hover:shadow-[0_0_14px_rgba(255,0,93,0.8)]"
    >
      <span className="relative h-[20px] w-[20px]">
        <span className="absolute left-[1px] top-[9px] h-[1.5px] w-[18px] rotate-45 bg-current shadow-[0_0_6px_currentColor]" />
        <span className="absolute left-[1px] top-[9px] h-[1.5px] w-[18px] -rotate-45 bg-current shadow-[0_0_6px_currentColor]" />

        <span className="absolute left-0 top-0 h-[4px] w-[4px] bg-current shadow-[0_0_6px_currentColor]" />
        <span className="absolute right-0 top-0 h-[4px] w-[4px] bg-current shadow-[0_0_6px_currentColor]" />
        <span className="absolute bottom-0 left-0 h-[4px] w-[4px] bg-current shadow-[0_0_6px_currentColor]" />
        <span className="absolute bottom-0 right-0 h-[4px] w-[4px] bg-current shadow-[0_0_6px_currentColor]" />
      </span>
    </button>
  );
}

function RightScrollBar({
  progress,
  onThumbPointerDown,
}: {
  progress: number;
  onThumbPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
}) {
  const thumbY = progress * (SCROLL_TRACK_H - SCROLL_THUMB_H);

  return (
    <div
      className="absolute right-[18px] top-[92px] z-30 w-[18px]"
      style={{ height: SCROLL_TRACK_H }}
    >
      <div
        className="absolute left-[9px] top-[0px] w-px"
        style={{
          height: SCROLL_TRACK_H - 48,
          backgroundImage:
            "repeating-linear-gradient(to bottom, #00fff0 0px, #00fff0 1px, transparent 1px, transparent 4px)",
          filter:
            "drop-shadow(0 0 4px rgba(0,255,240,1)) drop-shadow(0 0 9px rgba(0,255,240,0.65))",
        }}
      />

      <button
        type="button"
        onPointerDown={onThumbPointerDown}
        className="absolute left-0 top-0 h-[32px] w-[18px] cursor-grab touch-none active:cursor-grabbing"
        style={{
          transform: `translateY(${thumbY}px)`,
        }}
        aria-label="Drag skill scroll"
      >
        <span
          className="absolute inset-0 bg-[#00fff0] shadow-[0_0_8px_rgba(0,255,240,1),0_0_18px_rgba(0,255,240,0.55)]"
          style={{
            clipPath:
              "polygon(0 6%, 42% 18%, 50% 10%, 58% 18%, 100% 6%, 100% 74%, 50% 100%, 0 74%)",
          }}
        />

        <span
          className="absolute left-[3px] top-[5px] h-[22px] w-[5px] bg-[#aafffb]/70"
          style={{
            clipPath: "polygon(0 0, 100% 18%, 100% 76%, 0 62%)",
          }}
        />

        <span
          className="absolute right-[3px] top-[5px] h-[22px] w-[5px] bg-[#3ffff0]/90"
          style={{
            clipPath: "polygon(0 18%, 100% 0, 100% 62%, 0 76%)",
          }}
        />

        <span className="absolute left-[6px] top-[2px] h-[2px] w-[2px] bg-[#320d18]" />
        <span className="absolute right-[6px] top-[2px] h-[2px] w-[2px] bg-[#320d18]" />
      </button>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="cyber-text-glow text-[22px] font-black uppercase leading-none text-[#00fff0]">
      {children}
    </h3>
  );
}

function PinkRule({ width }: { width: number }) {
  return (
    <div className="relative mt-[8px] h-[8px]" style={{ width }}>
      <div className="absolute left-0 top-[3px] h-[1px] w-full bg-[#ff005d] shadow-[0_0_7px_rgba(255,0,93,0.9)]" />
      <div className="absolute left-0 top-[1px] h-0 w-0 border-y-[3px] border-l-[6px] border-y-transparent border-l-[#ff005d]" />
      <div className="absolute right-0 top-[1px] h-0 w-0 border-y-[3px] border-r-[6px] border-y-transparent border-r-[#ff005d]" />
    </div>
  );
}

function SkillIcon({ item }: { item: SkillItem }) {
  const [hasSvgError, setHasSvgError] = useState(false);

  if (item.iconType === "svg" && item.iconSrc && !hasSvgError) {
    return (
      <img
        src={item.iconSrc}
        alt={item.name}
        onError={() => setHasSvgError(true)}
        className={[
          "object-contain",
          item.group === "office" ? "h-[25px] w-[25px]" : "h-[28px] w-[28px]",
        ].join(" ")}
      />
    );
  }

  return (
    <span
      className={[
        "font-black leading-none drop-shadow-[0_0_7px_currentColor]",
        item.group === "design"
          ? "text-[27px] tracking-[-0.09em]"
          : item.group === "office"
            ? "text-[21px]"
            : "text-[9px] tracking-[0.02em]",
      ].join(" ")}
    >
      {item.shortName}
    </span>
  );
}

function SkillButton({
  item,
  selected,
  onClick,
}: {
  item: SkillItem;
  selected: boolean;
  onClick: () => void;
}) {
  const sizeClass = {
    design: "h-[46px] w-[46px]",
    code: "h-[28px] w-[56px]",
    office: "h-[45px] w-[45px]",
  }[item.group];

  return (
    <button
      type="button"
      onClick={onClick}
      title={item.name}
      className={[
        "group relative grid place-items-center border bg-[#170017]/80 transition-all duration-300 hover:-translate-y-[2px]",
        sizeClass,
        selected
          ? "shadow-[0_0_15px_rgba(0,255,240,0.62),inset_0_0_8px_rgba(0,255,240,0.12)]"
          : "",
      ].join(" ")}
      style={{
        borderColor: item.color,
        color: item.color,
      }}
    >
      <SkillIcon item={item} />
    </button>
  );
}

function PreviewDisplay({
  item,
  width,
  height,
}: {
  item: SkillItem;
  width: number;
  height: number;
}) {
  return (
    <div
      className="absolute left-0 top-0 overflow-hidden"
      style={{
        width,
        height,
      }}
    >
      <div className="preview-grid absolute inset-0" />
      <div className="preview-grid-glow absolute inset-0" />
      <div className="preview-scanline absolute inset-0" />
      <div className="preview-flicker absolute inset-0" />

      <SkillHologramCube
        shortName={item.shortName}
        color={item.color}
        iconSrc={item.iconSrc}
      />
    </div>
  );
}

function SoftwarePreviewFrame({ item }: { item: SkillItem }) {
  const frameW = 286;
  const frameH = 306;

  const labelW = 102;
  const labelH = 22;

  const margin = 4;
  const gap = 8;

  const cutW = margin + labelW + gap;
  const cutH = margin + labelH + gap;

  const notchTop = frameH - cutH;
  const labelLeft = margin;
  const labelTop = frameH - margin - labelH;

  const fillClipPath = `polygon(
    0 0,
    100% 0,
    100% 100%,
    ${cutW}px 100%,
    ${cutW}px ${notchTop}px,
    0 ${notchTop}px
  )`;

  return (
    <div className="relative w-[286px]">
      <div
        className="relative"
        style={{
          width: frameW,
          height: frameH,
        }}
      >
        <div
          className="absolute inset-0 overflow-hidden bg-[#10161b]"
          style={{
            clipPath: fillClipPath,
          }}
        >
          <PreviewDisplay item={item} width={frameW} height={frameH} />
        </div>

        <div
          className="absolute bg-[#00fff0] shadow-[0_0_8px_rgba(0,255,240,0.45)]"
          style={{
            left: 0,
            top: 0,
            width: frameW,
            height: 1,
          }}
        />

        <div
          className="absolute bg-[#00fff0] shadow-[0_0_8px_rgba(0,255,240,0.45)]"
          style={{
            left: 0,
            top: 0,
            width: 1,
            height: notchTop,
          }}
        />

        <div
          className="absolute bg-[#00fff0] shadow-[0_0_8px_rgba(0,255,240,0.45)]"
          style={{
            right: 0,
            top: 0,
            width: 1,
            height: frameH,
          }}
        />

        <div
          className="absolute bg-[#00fff0] shadow-[0_0_8px_rgba(0,255,240,0.45)]"
          style={{
            left: 0,
            top: notchTop,
            width: cutW,
            height: 1,
          }}
        />

        <div
          className="absolute bg-[#00fff0] shadow-[0_0_8px_rgba(0,255,240,0.45)]"
          style={{
            left: cutW,
            top: notchTop,
            width: 1,
            height: cutH,
          }}
        />

        <div
          className="absolute bg-[#00fff0] shadow-[0_0_8px_rgba(0,255,240,0.45)]"
          style={{
            left: cutW,
            top: frameH - 1,
            width: frameW - cutW,
            height: 1,
          }}
        />

        <div
          className="absolute flex items-center justify-center border border-[#ff005d] bg-[#320d18] px-2 text-center text-[8px] font-black leading-none text-[#00fff0] shadow-[0_0_9px_rgba(255,0,93,0.45)]"
          style={{
            left: labelLeft,
            top: labelTop,
            width: labelW,
            height: labelH,
          }}
        >
          <span className="truncate">{item.name}</span>
        </div>
      </div>

      <div className="mt-[10px] w-[286px]">
        <p className="w-[255px] text-[11px] leading-[1.4] text-[#00fff0]">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function SkillGallery({ onClose }: SkillGalleryProps) {
  const [selectedId, setSelectedId] = useState("word");
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const selectedSkill = useMemo(() => {
    return skills.find((item) => item.id === selectedId) ?? skills[0];
  }, [selectedId]);

  const designSkills = skills.filter((item) => item.group === "design");
  const codeSkills = skills.filter((item) => item.group === "code");
  const officeSkills = skills.filter((item) => item.group === "office");

  const updateScrollProgress = () => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollHeight - el.clientHeight;
    setScrollProgress(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
  };

  const handleThumbPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>
  ) => {
    const el = scrollRef.current;
    if (!el) return;

    event.preventDefault();

    const startY = event.clientY;
    const startScrollTop = el.scrollTop;
    const maxScroll = el.scrollHeight - el.clientHeight;

    if (maxScroll <= 0) return;

    const maxThumbMove = SCROLL_TRACK_H - SCROLL_THUMB_H;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const nextScrollTop =
        startScrollTop + (deltaY / maxThumbMove) * maxScroll;

      el.scrollTop = Math.max(0, Math.min(maxScroll, nextScrollTop));
      updateScrollProgress();
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <section className="skill-gallery-boot relative z-50 mt-5 h-[400px] w-[700px] shrink-0 overflow-hidden border border-[#00fff0] bg-[#320d18] shadow-[0_0_20px_rgba(0,255,240,0.28),inset_0_0_26px_rgba(255,0,93,0.08)]">
      <CornerAccent corner="tl" />
      <CornerAccent corner="tr" />
      <CornerAccent corner="bl" />
      <CornerAccent corner="br" />

      <div className="skill-border-runners pointer-events-none absolute inset-0 z-[24]">
        <span className="skill-border-run skill-border-run-top" />
        <span className="skill-border-run skill-border-run-right" />
        <span className="skill-border-run skill-border-run-bottom" />
        <span className="skill-border-run skill-border-run-left" />
      </div>

      {/* Hiệu ứng điện tử khi bảng xuất hiện */}
      <div className="pointer-events-none absolute inset-0 z-[80]">
        <div className="skill-boot-flash absolute inset-0" />

        <div className="skill-boot-scan absolute left-0 top-0 h-full w-full" />

        <div className="skill-boot-line skill-boot-line-1" />
        <div className="skill-boot-line skill-boot-line-2" />
        <div className="skill-boot-line skill-boot-line-3" />
        <div className="skill-boot-line skill-boot-line-4" />

        <div className="skill-boot-corner skill-boot-corner-tl" />
        <div className="skill-boot-corner skill-boot-corner-tr" />
        <div className="skill-boot-corner skill-boot-corner-bl" />
        <div className="skill-boot-corner skill-boot-corner-br" />

        <div className="skill-boot-text absolute left-[34px] top-[24px] text-[9px] font-black uppercase tracking-[0.28em] text-[#00fff0]">
          SYSTEM LOAD
        </div>
      </div>

      <CloseHudButton onClick={onClose} />

      <RightScrollBar
        progress={scrollProgress}
        onThumbPointerDown={handleThumbPointerDown}
      />

      <div className="relative z-10 flex h-full gap-[58px] px-[26px] py-[28px]">
        <div className="w-[286px] shrink-0">
          <SoftwarePreviewFrame item={selectedSkill} />
        </div>

        <div className="flex flex-1 flex-col pt-[26px]">
          <div
            ref={scrollRef}
            onScroll={updateScrollProgress}
            className="skill-scroll-area h-[306px] overflow-y-auto pr-[44px]"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="pb-[52px]">
              <div>
                <SectionTitle>Design/ Edit</SectionTitle>
                <PinkRule width={248} />

                <div className="mt-[14px] grid w-[248px] grid-cols-4 gap-x-[18px] gap-y-[12px]">
                  {designSkills.map((item) => (
                    <SkillButton
                      key={item.id}
                      item={item}
                      selected={selectedId === item.id}
                      onClick={() => setSelectedId(item.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-[22px]">
                <SectionTitle>Code</SectionTitle>
                <PinkRule width={248} />

                <div className="mt-[14px] grid w-[248px] grid-cols-4 gap-x-[8px] gap-y-[8px]">
                  {codeSkills.map((item) => (
                    <SkillButton
                      key={item.id}
                      item={item}
                      selected={selectedId === item.id}
                      onClick={() => setSelectedId(item.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-[22px]">
                <SectionTitle>Microsoft Office</SectionTitle>

                <div className="mt-[16px] flex gap-[14px]">
                  {officeSkills.map((item) => (
                    <SkillButton
                      key={item.id}
                      item={item}
                      selected={selectedId === item.id}
                      onClick={() => setSelectedId(item.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .skill-scroll-area::-webkit-scrollbar {
          display: none;
        }

        .preview-grid {
          background:
            linear-gradient(rgba(0, 255, 240, 0.08) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(0, 255, 240, 0.08) 1px,
              transparent 1px
            ),
            radial-gradient(
              circle at center,
              rgba(0, 255, 240, 0.06),
              transparent 60%
            );
          background-size: 22px 22px, 22px 22px, 100% 100%;
        }

        .preview-grid-glow {
          background:
            radial-gradient(
              circle at center,
              rgba(0, 255, 240, 0.12),
              transparent 50%
            ),
            linear-gradient(
              180deg,
              rgba(0, 255, 240, 0.05),
              transparent 55%
            );
          mix-blend-mode: screen;
        }

        .preview-scanline {
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.018) 0px,
            rgba(255, 255, 255, 0.018) 2px,
            transparent 2px,
            transparent 6px
          );
          animation: scanFlicker 0.16s linear infinite;
          opacity: 0.62;
        }

        .preview-flicker {
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 48%,
            transparent 100%
          );
          animation: monitorPulse 3s ease-in-out infinite;
          opacity: 0.68;
        }

        @keyframes scanFlicker {
          0% {
            opacity: 0.5;
            transform: translateY(0);
          }

          50% {
            opacity: 0.72;
            transform: translateY(0.5px);
          }

          100% {
            opacity: 0.5;
            transform: translateY(0);
          }
        }

        @keyframes monitorPulse {
          0%,
          100% {
            opacity: 0.34;
          }

          30% {
            opacity: 0.56;
          }

          58% {
            opacity: 0.28;
          }

          78% {
            opacity: 0.64;
          }
        }

        .skill-gallery-boot {
  animation:
    skillPanelBoot 0.72s cubic-bezier(0.16, 1, 0.3, 1) both,
    skillPanelGlitch 0.72s steps(2, end) both;
  will-change: opacity, clip-path, filter;
}

.skill-gallery-boot::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 70;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 255, 240, 0.16) 48%,
      rgba(255, 255, 255, 0.28) 50%,
      rgba(0, 255, 240, 0.16) 52%,
      transparent 100%
    );
  transform: translateX(-120%);
  animation: skillPanelSweep 0.62s ease-out both;
}

.skill-gallery-boot::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 69;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.04) 0px,
      rgba(255, 255, 255, 0.04) 1px,
      transparent 1px,
      transparent 6px
    );
  opacity: 0;
  animation: skillPanelNoise 0.78s linear both;
}

.skill-boot-flash {
  background:
    radial-gradient(circle at 50% 50%, rgba(0, 255, 240, 0.22), transparent 38%),
    linear-gradient(90deg, rgba(255, 0, 93, 0.18), transparent 45%, rgba(0, 255, 240, 0.18));
  opacity: 0;
  animation: bootFlash 0.58s ease-out both;
}

.skill-boot-scan {
  background:
    linear-gradient(
      to bottom,
      transparent 0%,
      transparent 42%,
      rgba(0, 255, 240, 0.38) 48%,
      rgba(255, 255, 255, 0.36) 50%,
      rgba(255, 0, 93, 0.28) 52%,
      transparent 60%,
      transparent 100%
    );
  transform: translateY(-120%);
  animation: bootScan 0.72s ease-out both;
}

.skill-boot-line {
  position: absolute;
  left: 0;
  height: 1px;
  width: 100%;
  background: #00fff0;
  box-shadow:
    0 0 8px rgba(0, 255, 240, 1),
    0 0 18px rgba(0, 255, 240, 0.65);
  opacity: 0;
}

.skill-boot-line-1 {
  top: 18%;
  animation: bootLineX 0.34s 0.05s ease-out both;
}

.skill-boot-line-2 {
  top: 43%;
  background: #ff005d;
  box-shadow:
    0 0 8px rgba(255, 0, 93, 1),
    0 0 18px rgba(255, 0, 93, 0.65);
  animation: bootLineX 0.3s 0.12s ease-out both;
}

.skill-boot-line-3 {
  top: 66%;
  animation: bootLineX 0.34s 0.18s ease-out both;
}

.skill-boot-line-4 {
  top: 82%;
  background: #ff005d;
  box-shadow:
    0 0 8px rgba(255, 0, 93, 1),
    0 0 18px rgba(255, 0, 93, 0.65);
  animation: bootLineX 0.28s 0.24s ease-out both;
}

.skill-boot-corner {
  position: absolute;
  height: 24px;
  width: 24px;
  opacity: 0;
}

.skill-boot-corner::before,
.skill-boot-corner::after {
  content: "";
  position: absolute;
  background: #00fff0;
  box-shadow:
    0 0 8px rgba(0, 255, 240, 1),
    0 0 18px rgba(0, 255, 240, 0.65);
}

.skill-boot-corner::before {
  height: 2px;
  width: 24px;
}

.skill-boot-corner::after {
  height: 24px;
  width: 2px;
}

.skill-boot-corner-tl {
  left: 22px;
  top: 22px;
  animation: bootCorner 0.32s 0.08s ease-out both;
}

.skill-boot-corner-tr {
  right: 22px;
  top: 22px;
  transform: scaleX(-1);
  animation: bootCorner 0.32s 0.12s ease-out both;
}

.skill-boot-corner-bl {
  left: 22px;
  bottom: 22px;
  transform: scaleY(-1);
  animation: bootCorner 0.32s 0.16s ease-out both;
}

.skill-boot-corner-br {
  right: 22px;
  bottom: 22px;
  transform: scale(-1);
  animation: bootCorner 0.32s 0.2s ease-out both;
}

.skill-boot-text {
  opacity: 0;
  text-shadow:
    0 0 8px rgba(0, 255, 240, 1),
    0 0 18px rgba(0, 255, 240, 0.6);
  animation: bootText 0.68s ease-out both;
}

@keyframes skillPanelBoot {
  0% {
    opacity: 0;
    clip-path: polygon(100% 48%, 100% 48%, 100% 54%, 100% 54%);
    filter: brightness(1.6) contrast(1.4);
  }

  16% {
    opacity: 1;
    clip-path: polygon(0 48%, 100% 48%, 100% 54%, 0 54%);
    filter: brightness(1.5) contrast(1.35);
  }

  34% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    filter: brightness(1.32) contrast(1.25);
  }

  48% {
    clip-path: polygon(
      0 0,
      100% 0,
      100% 42%,
      96% 42%,
      96% 46%,
      100% 46%,
      100% 100%,
      0 100%,
      0 62%,
      4% 62%,
      4% 58%,
      0 58%
    );
  }

  58% {
    clip-path: polygon(
      0 0,
      100% 0,
      100% 100%,
      0 100%
    );
    filter: brightness(1.18) contrast(1.15);
  }

  72% {
    filter: brightness(1.08) contrast(1.08);
  }

  100% {
    opacity: 1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    filter: brightness(1) contrast(1);
  }
}

@keyframes skillPanelGlitch {
  0%,
  42% {
    box-shadow:
      0 0 20px rgba(0, 255, 240, 0.28),
      inset 0 0 26px rgba(255, 0, 93, 0.08);
  }

  48% {
    box-shadow:
      8px 0 0 rgba(255, 0, 93, 0.3),
      -8px 0 0 rgba(0, 255, 240, 0.26),
      0 0 26px rgba(0, 255, 240, 0.45);
  }

  54%,
  100% {
    box-shadow:
      0 0 20px rgba(0, 255, 240, 0.28),
      inset 0 0 26px rgba(255, 0, 93, 0.08);
  }
}

@keyframes skillPanelSweep {
  0% {
    opacity: 0;
    transform: translateX(-120%);
  }

  18% {
    opacity: 1;
  }

  72% {
    opacity: 1;
    transform: translateX(120%);
  }

  100% {
    opacity: 0;
    transform: translateX(130%);
  }
}

@keyframes skillPanelNoise {
  0%,
  100% {
    opacity: 0;
  }

  16% {
    opacity: 0.45;
  }

  28% {
    opacity: 0.15;
  }

  42% {
    opacity: 0.32;
  }

  54% {
    opacity: 0.12;
  }
}

@keyframes bootFlash {
  0% {
    opacity: 0;
  }

  12% {
    opacity: 1;
  }

  48% {
    opacity: 0.4;
  }

  100% {
    opacity: 0;
  }
}

@keyframes bootScan {
  0% {
    opacity: 0;
    transform: translateY(-120%);
  }

  16% {
    opacity: 1;
  }

  72% {
    opacity: 1;
    transform: translateY(120%);
  }

  100% {
    opacity: 0;
    transform: translateY(130%);
  }
}

@keyframes bootLineX {
  0% {
    opacity: 0;
    transform: translateX(-100%) scaleX(0.2);
  }

  45% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(100%) scaleX(1);
  }
}

@keyframes bootCorner {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }

  45% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: scale(1.15);
  }
}

@keyframes bootText {
  0% {
    opacity: 0;
    transform: translateX(-8px);
  }

  20% {
    opacity: 1;
  }

  62% {
    opacity: 1;
    transform: translateX(0);
  }

  100% {
    opacity: 0;
  }
}

.skill-border-runners {
  overflow: hidden;
}

.skill-border-run {
  position: absolute;
  display: block;
  opacity: 0.95;
  filter:
    drop-shadow(0 0 5px rgba(0, 255, 240, 1))
    drop-shadow(0 0 14px rgba(0, 255, 240, 0.85))
    drop-shadow(0 0 26px rgba(0, 255, 240, 0.45));
  mix-blend-mode: screen;
}

.skill-border-run-top,
.skill-border-run-bottom {
  height: 2px;
  width: 150px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 255, 240, 0.15) 18%,
    rgba(255, 255, 255, 0.95) 48%,
    #00fff0 62%,
    transparent 100%
  );
}

.skill-border-run-left,
.skill-border-run-right {
  width: 2px;
  height: 150px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 255, 240, 0.15) 18%,
    rgba(255, 255, 255, 0.95) 48%,
    #00fff0 62%,
    transparent 100%
  );
}

.skill-border-run-top {
  left: -160px;
  top: -1px;
  animation: skillBorderRunTop 2.8s linear infinite;
}

.skill-border-run-right {
  right: -1px;
  top: -160px;
  animation: skillBorderRunRight 2.8s linear infinite 0.7s;
}

.skill-border-run-bottom {
  right: -160px;
  bottom: -1px;
  animation: skillBorderRunBottom 2.8s linear infinite 1.4s;
}

.skill-border-run-left {
  left: -1px;
  bottom: -160px;
  animation: skillBorderRunLeft 2.8s linear infinite 2.1s;
}

@keyframes skillBorderRunTop {
  0% {
    left: -160px;
  }

  100% {
    left: 100%;
  }
}

@keyframes skillBorderRunRight {
  0% {
    top: -160px;
  }

  100% {
    top: 100%;
  }
}

@keyframes skillBorderRunBottom {
  0% {
    right: -160px;
  }

  100% {
    right: 100%;
  }
}

@keyframes skillBorderRunLeft {
  0% {
    bottom: -160px;
  }

  100% {
    bottom: 100%;
  }
}
      `}</style>
    </section>
  );
}