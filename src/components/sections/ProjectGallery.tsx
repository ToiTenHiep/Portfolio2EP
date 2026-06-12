"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProjectPreviewModal from "./ProjectPreviewModal";
import {
  galleryItems,
  galleryTabs,
  type ProjectCategory,
  type ProjectPreviewItem,
} from "./projectGalleryData";

type ProjectGalleryProps = {
  onClose?: () => void;
};

type CornerPosition = "tl" | "tr" | "bl" | "br";

type GalleryItem = ProjectPreviewItem;

function HudCorner({ position }: { position: CornerPosition }) {
  const size = 44;
  const thickness = 5;

  const positionStyle: Record<CornerPosition, React.CSSProperties> = {
    tl: { left: 17, top: 17 },
    tr: { right: 17, top: 17 },
    bl: { left: 17, bottom: 17 },
    br: { right: 17, bottom: 17 },
  };

  const isTop = position === "tl" || position === "tr";
  const isLeft = position === "tl" || position === "bl";

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        width: size,
        height: size,
        ...positionStyle[position],
      }}
    >
      <div
        className="absolute bg-[#ff005d] shadow-[0_0_12px_rgba(255,0,93,0.9)]"
        style={{
          height: thickness,
          width: size,
          top: isTop ? 0 : undefined,
          bottom: isTop ? undefined : 0,
          left: isLeft ? 0 : undefined,
          right: isLeft ? undefined : 0,
        }}
      />

      <div
        className="absolute bg-[#ff005d] shadow-[0_0_12px_rgba(255,0,93,0.9)]"
        style={{
          width: thickness,
          height: size,
          top: isTop ? 0 : undefined,
          bottom: isTop ? undefined : 0,
          left: isLeft ? 0 : undefined,
          right: isLeft ? undefined : 0,
        }}
      />
    </div>
  );
}

function GalleryTab({
  label,
  width,
  active,
  onClick,
}: {
  label: string;
  width: number;
  active: boolean;
  onClick: () => void;
}) {
  const height = 30;
  const cut = 12;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-[30px] shrink-0"
      style={{ width }}
    >
      <svg
        className="absolute inset-0 overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-hidden="true"
      >
        <polygon
          points={`0,0 ${width - cut},0 ${width},10 ${width},${height} 0,${height}`}
          className={[
            "transition-all duration-300",
            active
              ? "fill-[#00fff0]"
              : "fill-[#34141f] group-hover:fill-[#451827]",
          ].join(" ")}
          stroke="#00fff0"
          strokeWidth="1"
          strokeLinejoin="miter"
          strokeLinecap="square"
          vectorEffect="non-scaling-stroke"
          style={{
            filter: "drop-shadow(0 0 6px rgba(0,255,240,0.75))",
          }}
        />
      </svg>

      <span
        className={[
          "relative z-10 flex h-full items-center justify-center text-[10px] font-black leading-none",
          active ? "text-[#080011]" : "text-[#00fff0] group-hover:text-white",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}

function CloseTabButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close project gallery"
      className="group absolute right-[55px] top-[58px] z-20 h-[36px] w-[36px]"
    >
      <div className="absolute inset-0 border border-[#ff005d] bg-transparent transition-all duration-300 group-hover:bg-[#ff005d]/10 group-hover:shadow-[0_0_14px_rgba(255,0,93,0.8)]" />

      <svg
        viewBox="0 0 36 36"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <path
          d="M11 11 L18 18 L25 11"
          fill="none"
          stroke="#ff005d"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="transition-all duration-300 group-hover:stroke-white"
        />

        <path
          d="M11 25 L18 18 L25 25"
          fill="none"
          stroke="#ff005d"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className="transition-all duration-300 group-hover:stroke-white"
        />

        <rect x="8" y="8" width="5" height="5" fill="#ff005d" />
        <rect x="23" y="8" width="5" height="5" fill="#ff005d" />
        <rect x="8" y="23" width="5" height="5" fill="#ff005d" />
        <rect x="23" y="23" width="5" height="5" fill="#ff005d" />
      </svg>
    </button>
  );
}

function RightScrollDecor({
  scrollPercent,
  canScroll,
  onChange,
}: {
  scrollPercent: number;
  canScroll: boolean;
  onChange: (percent: number) => void;
}) {
  const barRef = useRef<HTMLButtonElement | null>(null);

  const applyScrollByClientY = (clientY: number) => {
    const bar = barRef.current;
    if (!bar || !canScroll) return;

    const rect = bar.getBoundingClientRect();
    const thumbHeight = 34;
    const maxMove = rect.height - thumbHeight;
    const nextPercent = (clientY - rect.top - thumbHeight / 2) / maxMove;

    onChange(Math.max(0, Math.min(1, nextPercent)));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!canScroll) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    applyScrollByClientY(event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!canScroll || event.buttons !== 1) return;

    applyScrollByClientY(event.clientY);
  };

  const thumbTop = scrollPercent * 194;

  return (
    <button
      ref={barRef}
      type="button"
      aria-label="Project gallery scroll"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className={[
        "absolute right-[61px] top-[142px] z-20 h-[228px] w-[24px] select-none",
        canScroll ? "cursor-grab active:cursor-grabbing" : "cursor-default",
      ].join(" ")}
    >
      {/* Line chấm cyan cố định đúng kiểu HUD */}
      <div className="pointer-events-none absolute left-[11px] top-[40px] h-[188px] w-[2px]">
        <div className="project-gallery-hud-scroll-line h-full w-full opacity-95" />
      </div>

      {/* Đầu scroll cyan sẽ chạy lên/xuống theo vị trí cuộn */}
      <div
        className={[
          "pointer-events-none absolute left-0 top-0 h-[34px] w-[24px] bg-[#00fff0] transition-transform duration-150",
          canScroll ? "opacity-100" : "opacity-45",
        ].join(" ")}
        style={{
          transform: `translateY(${thumbTop}px)`,
          clipPath:
            "polygon(0 0, 50% 20%, 100% 0, 100% 72%, 50% 100%, 0 72%)",
          boxShadow:
            "0 0 12px rgba(0,255,240,0.95), 0 0 22px rgba(0,255,240,0.45)",
        }}
      />

      <div
        className="pointer-events-none absolute left-[10px] top-[3px] h-[4px] w-[4px] rounded-full bg-[#34141f]/80 transition-transform duration-150"
        style={{ transform: `translateY(${thumbTop}px)` }}
      />
    </button>
  );
}


function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: (item: GalleryItem) => void;
}) {
  const width = 128;
  const height = 81;
  const cut = 12;
  const isComingSoon = item.media.kind === "coming-soon";

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group w-[128px] text-left transition-transform duration-300 hover:-translate-y-[2px]"
    >
      <div className="relative h-[81px] w-[128px] overflow-visible">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="absolute inset-0 overflow-visible"
          aria-hidden="true"
        >
          <polygon
            points={`0,0 ${width - cut},0 ${width},${cut} ${width},${height} ${cut},${height} 0,${height - cut}`}
            className="fill-[#34141f] transition-all duration-300 group-hover:fill-[#421827]"
            stroke="#ff005d"
            strokeWidth="1"
            strokeLinejoin="miter"
            strokeLinecap="square"
            vectorEffect="non-scaling-stroke"
            style={{
              filter: "drop-shadow(0 0 6px rgba(255,0,93,0.75))",
            }}
          />
        </svg>

        <div
          className="absolute inset-[7px] grid place-items-center overflow-hidden bg-[#080011]/35"
          style={{
            clipPath: `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, ${cut}px 100%, 0 calc(100% - ${cut}px))`,
          }}
        >
          {item.media.kind === "image" && (
            <img
              src={item.media.src}
              alt={item.media.alt ?? item.name}
              className="h-full w-full object-cover opacity-80 transition-all duration-300 group-hover:scale-[1.06] group-hover:opacity-100"
            />
          )}

          {item.media.kind === "video" && (
            <div className="relative h-full w-full">
              {item.media.poster ? (
                <img
                  src={item.media.poster}
                  alt={item.name}
                  className="h-full w-full object-cover opacity-80 transition-all duration-300 group-hover:scale-[1.06] group-hover:opacity-100"
                />
              ) : (
                <div className="h-full w-full bg-[#140610]" />
              )}
              <div className="absolute inset-0 grid place-items-center bg-black/20">
                <span className="grid h-[24px] w-[24px] place-items-center border border-[#00fff0] text-[10px] text-[#00fff0] shadow-[0_0_10px_rgba(0,255,240,0.75)]">
                  ▶
                </span>
              </div>
            </div>
          )}

          {isComingSoon && (
            <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_center,rgba(0,255,240,0.12),rgba(8,0,17,0.9))]">
              <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#00fff0] drop-shadow-[0_0_8px_rgba(0,255,240,1)]">
                SOON
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-[8px] flex items-center gap-[6px]">
        <span className="h-[7px] w-[7px] bg-[#00fff0] shadow-[0_0_8px_rgba(0,255,240,1)]" />
        <span className="min-w-0 truncate text-[11px] font-semibold leading-none text-[#00fff0]">
          {item.name}
        </span>
      </div>
    </button>
  );
}

export default function ProjectGallery({ onClose }: ProjectGalleryProps) {
  const [activeTab, setActiveTab] = useState<ProjectCategory>("image");
  const [selectedProject, setSelectedProject] = useState<GalleryItem | null>(
    null
  );
  const scrollBoxRef = useRef<HTMLDivElement | null>(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  const visibleItems = useMemo(
    () => galleryItems.filter((item) => item.category === activeTab),
    [activeTab]
  );

  const selectedIndex = selectedProject
    ? visibleItems.findIndex((item) => item.id === selectedProject.id)
    : -1;

  const syncHudScroll = () => {
    const scrollBox = scrollBoxRef.current;
    if (!scrollBox) return;

    const maxScroll = scrollBox.scrollHeight - scrollBox.clientHeight;
    const hasScroll = maxScroll > 1;

    setCanScroll(hasScroll);
    setScrollPercent(hasScroll ? scrollBox.scrollTop / maxScroll : 0);
  };

  const handleHudScrollChange = (percent: number) => {
    const scrollBox = scrollBoxRef.current;
    if (!scrollBox) return;

    const maxScroll = scrollBox.scrollHeight - scrollBox.clientHeight;
    scrollBox.scrollTop = maxScroll * percent;

    syncHudScroll();
  };

  useEffect(() => {
    const scrollBox = scrollBoxRef.current;
    if (!scrollBox) return;

    scrollBox.scrollTop = 0;
    const frame = requestAnimationFrame(syncHudScroll);

    return () => cancelAnimationFrame(frame);
  }, [activeTab, visibleItems.length]);

  const handleTabClick = (tabId: ProjectCategory) => {
    setActiveTab(tabId);
    setSelectedProject(null);
  };

  const handlePrev = () => {
    if (selectedIndex < 0 || visibleItems.length <= 1) return;

    const prevIndex =
      selectedIndex === 0 ? visibleItems.length - 1 : selectedIndex - 1;
    setSelectedProject(visibleItems[prevIndex]);
  };

  const handleNext = () => {
    if (selectedIndex < 0 || visibleItems.length <= 1) return;

    const nextIndex =
      selectedIndex === visibleItems.length - 1 ? 0 : selectedIndex + 1;
    setSelectedProject(visibleItems[nextIndex]);
  };

  return (
    <>
      <section className="relative z-50 mt-5 h-[427px] w-[800px] shrink-0 overflow-visible">
        {/* Khung nền chính */}
        <div className="absolute left-[30px] top-[30px] h-[367px] w-[740px] border border-[#ff005d] bg-[#34141f]" />

        {/* Light chạy chậm chỉ ở viền khung ngoài */}
        <svg
          className="pointer-events-none absolute left-[30px] top-[30px] z-[4] h-[367px] w-[740px] overflow-visible"
          viewBox="0 0 740 367"
          aria-hidden="true"
        >
          <rect
            x="0.5"
            y="0.5"
            width="739"
            height="366"
            fill="none"
            stroke="#ff005d"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          <rect
            className="project-gallery-outer-light project-gallery-outer-light-cyan"
            x="0.5"
            y="0.5"
            width="739"
            height="366"
            pathLength="1000"
            fill="none"
            stroke="#00fff0"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          <rect
            className="project-gallery-outer-light project-gallery-outer-light-pink"
            x="0.5"
            y="0.5"
            width="739"
            height="366"
            pathLength="1000"
            fill="none"
            stroke="#ff005d"
            strokeWidth="2.4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* 4 accent chữ L ngoài */}
        <HudCorner position="tl" />
        <HudCorner position="tr" />
        <HudCorner position="bl" />
        <HudCorner position="br" />

        {/* Accent đỏ dọc bên trái */}
        <div
          className="absolute left-[17px] top-[88px] h-[150px] w-[13px] bg-[#ff005d] shadow-[0_0_14px_rgba(255,0,93,0.9)]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />

        <div className="absolute left-[23px] top-[238px] h-[66px] w-px bg-[#ff005d] shadow-[0_0_8px_rgba(255,0,93,0.85)]" />

        <div className="absolute left-[21px] top-[300px] h-[5px] w-[5px] rounded-full bg-[#ff005d] shadow-[0_0_10px_rgba(255,0,93,1)]" />

        {/* Button tabs */}
        <div className="absolute left-[49px] top-[62px] z-10 flex h-[30px] items-center">
          {galleryTabs.map((tab) => (
            <GalleryTab
              key={tab.id}
              label={tab.label}
              width={tab.width}
              active={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
            />
          ))}
        </div>

        {/* Line đỏ dưới buttons */}
        <div className="absolute left-[49px] top-[102px] z-[5] flex items-center">
          <div className="h-[3px] w-[16px] bg-[#ff005d] shadow-[0_0_10px_rgba(255,0,93,0.95)]" />
          <div className="h-px w-[624px] bg-[#ff005d] shadow-[0_0_8px_rgba(255,0,93,0.85)]" />
        </div>

        {/* Danh sách project item - chính xác 4 cục / hàng, có scroll thật */}
        <div
          ref={scrollBoxRef}
          onScroll={syncHudScroll}
          className="project-gallery-scroll absolute left-[49px] top-[145px] z-10 h-[220px] w-[640px] overflow-y-auto overflow-x-hidden pr-[18px]"
        >
          <div className="grid grid-cols-4 justify-between gap-y-[30px] pb-[16px]">
            {visibleItems.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={setSelectedProject}
              />
            ))}
          </div>
        </div>

        <CloseTabButton onClick={onClose} />
        <RightScrollDecor
          scrollPercent={scrollPercent}
          canScroll={canScroll}
          onChange={handleHudScrollChange}
        />
      </section>

      <ProjectPreviewModal
        key={selectedProject?.id ?? "empty"}
        item={selectedProject}
        onClose={() => setSelectedProject(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <style jsx global>{`
        .project-gallery-outer-light {
          opacity: 0.95;
          stroke-dashoffset: 0;
          animation-name: projectGalleryOuterLightRun;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .project-gallery-outer-light-cyan {
          stroke-dasharray: 74 926;
          animation-duration: 10.5s;
          filter:
            drop-shadow(0 0 4px rgba(0, 255, 240, 1))
            drop-shadow(0 0 12px rgba(0, 255, 240, 0.85))
            drop-shadow(0 0 24px rgba(0, 255, 240, 0.45));
        }

        .project-gallery-outer-light-pink {
          stroke-dasharray: 42 958;
          animation-duration: 14s;
          animation-delay: -4.2s;
          filter:
            drop-shadow(0 0 4px rgba(255, 0, 93, 0.95))
            drop-shadow(0 0 12px rgba(255, 0, 93, 0.7))
            drop-shadow(0 0 22px rgba(255, 0, 93, 0.38));
        }



        .project-gallery-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .project-gallery-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }

        .project-gallery-hud-scroll-line {
          background-image: repeating-linear-gradient(
            to bottom,
            #00fff0 0 1px,
            transparent 1px 4px
          );
          filter:
            drop-shadow(0 0 4px rgba(0, 255, 240, 0.95))
            drop-shadow(0 0 10px rgba(0, 255, 240, 0.35));
        }

        @keyframes projectGalleryOuterLightRun {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </>
  );
}
