"use client";

import { useState } from "react";
import ProjectGallery from "./ProjectGallery";
import SkillGallery from "./SkillGallery";

type ActivePanel = "project" | "skill" | "file-sharing" | null;

type ProjectPreviewItem = {
  key: "project" | "skill" | "file-sharing";
  title: string;
  label: string;
  active: boolean;
  iconSrc: string;
  iconAlt: string;
};

const projects: ProjectPreviewItem[] = [
  {
    key: "project",
    title: "Project",
    label: "My project",
    active: true,
    iconSrc: "/icons/ICON-03.svg",
    iconAlt: "Project icon",
  },
  {
    key: "skill",
    title: "Skill",
    label: "Skill",
    active: true,
    iconSrc: "/icons/ICON-02.svg",
    iconAlt: "Skill icon",
  },
  {
    key: "file-sharing",
    title: "File Sharing",
    label: "Coming soon",
    active: false,
    iconSrc: "/icons/ICON-01.svg",
    iconAlt: "Coming soon icon",
  },
];

export default function ProjectPreviewRow() {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  const handleOpenPanel = (project: ProjectPreviewItem) => {
    if (!project.active) return;

    if (project.key === "project") {
      setActivePanel((prev) => (prev === "project" ? null : "project"));
      return;
    }

    if (project.key === "skill") {
      setActivePanel((prev) => (prev === "skill" ? null : "skill"));
      return;
    }
  };

  return (
    <div className="relative flex flex-col items-end">
      <div className="flex justify-end gap-10 pt-6">
        {projects.map((project) => {
          const isSelected = activePanel === project.key;

          return (
            <button
              key={project.key}
              type="button"
              disabled={!project.active}
              onClick={() => handleOpenPanel(project)}
              className={[
                "group relative h-[88px] w-[198px] shrink-0",
                project.active
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-55",
              ].join(" ")}
              title={project.title}
            >
              {/* Ô đỏ 80x80 - icon SVG */}
              <div
                className={[
                  "absolute left-[118px] top-0",
                  "grid h-[80px] w-[80px] place-items-center",
                  "border border-[#ff005d] bg-[#2b0015]/70",
                  "transition-all duration-300 ease-out",
                  project.active
                    ? "group-hover:-translate-y-[2px] group-hover:border-[#ff2f7d] group-hover:bg-[#3a001b]/90 group-hover:shadow-[0_0_16px_rgba(255,0,93,0.65),inset_0_0_14px_rgba(255,0,93,0.14)]"
                    : "",
                  isSelected
                    ? "-translate-y-[2px] border-[#ff2f7d] bg-[#3a001b]/90 shadow-[0_0_18px_rgba(255,0,93,0.75),inset_0_0_16px_rgba(255,0,93,0.18)]"
                    : "",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative grid h-[70px] w-[70px] place-items-center",
                    "transition-all duration-300",
                    project.active
                      ? "group-hover:scale-110"
                      : "opacity-65 grayscale",
                    isSelected ? "scale-110" : "",
                  ].join(" ")}
                >
                  {/* Glow phía sau icon */}
                  <span
                    aria-hidden
                    className={[
                      "absolute inset-[8px] bg-[#00fff0]/10 blur-md transition-opacity duration-300",
                      isSelected
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100",
                    ].join(" ")}
                  />

                  <img
                    src={project.iconSrc}
                    alt={project.iconAlt}
                    className={[
                      "relative z-10 h-full w-full object-contain",
                      "drop-shadow-[0_0_8px_rgba(0,255,240,0.45)]",
                      "transition-all duration-300",
                      project.active
                        ? "group-hover:drop-shadow-[0_0_14px_rgba(0,255,240,0.95)]"
                        : "",
                      isSelected
                        ? "drop-shadow-[0_0_16px_rgba(0,255,240,1)]"
                        : "",
                    ].join(" ")}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Khối chữ nhật xanh 82x23 */}
              <div
                className={[
                  "absolute left-0 top-[15px]",
                  "flex h-[23px] w-[82px] items-center justify-center",
                  "border border-[#00fff0] bg-[#080011]",
                  "text-[12px] font-black leading-none text-[#00fff0]",
                  "transition-all duration-300 ease-out",
                  "shadow-[0_0_8px_rgba(0,255,240,0.25)]",
                  project.active
                    ? "group-hover:-translate-x-[2px] group-hover:border-white group-hover:text-white group-hover:shadow-[0_0_14px_rgba(0,255,240,0.75)]"
                    : "",
                  isSelected
                    ? "-translate-x-[2px] border-white text-white shadow-[0_0_16px_rgba(0,255,240,0.9)]"
                    : "",
                ].join(" ")}
              >
                {project.label}
              </div>

              {/* Accent nối - nhỏ gọn 53x23 */}
              <div className="absolute left-[50px] top-[45px] h-[23px] w-[53px] transition-all duration-300 group-hover:translate-x-[2px]">
                <div className="absolute left-0 top-0 h-[4px] w-[4px] bg-[#ff005d] shadow-[0_0_5px_rgba(255,0,93,0.85)]" />

                <div
                  className={[
                    "absolute left-[3px] top-[3px] h-[1px] w-[30px] origin-left rotate-45 bg-[#ff005d]",
                    "shadow-[0_0_5px_rgba(255,0,93,0.75)] transition-all duration-300 group-hover:bg-[#ff2f7d]",
                    isSelected ? "bg-[#ff2f7d]" : "",
                  ].join(" ")}
                />

                <div
                  className={[
                    "absolute left-[24px] top-[24px] h-[1px] w-[20px] bg-[#ff005d]",
                    "shadow-[0_0_5px_rgba(255,0,93,0.75)] transition-all duration-300 group-hover:w-[23px] group-hover:bg-[#ff2f7d]",
                    isSelected ? "w-[23px] bg-[#ff2f7d]" : "",
                  ].join(" ")}
                />

                <div
                  className={[
                    "absolute left-[43px] top-[20px] h-0 w-0 border-y-[4px] border-y-transparent border-r-[8px] border-r-[#ff005d]",
                    "drop-shadow-[0_0_5px_rgba(255,0,93,0.8)] transition-all duration-300 group-hover:border-r-[#ff2f7d]",
                    isSelected ? "border-r-[#ff2f7d]" : "",
                  ].join(" ")}
                />
              </div>

              {/* Chấm sáng cyan */}
              <div
                className={[
                  "absolute left-[105px] top-[65px] h-[6px] w-[6px] bg-[#00fff0]",
                  "shadow-[0_0_8px_rgba(0,255,240,1),0_0_16px_rgba(0,255,240,0.75)]",
                  "transition-all duration-300 group-hover:scale-125 group-hover:bg-white group-hover:shadow-[0_0_10px_rgba(0,255,240,1),0_0_22px_rgba(0,255,240,1)]",
                  isSelected
                    ? "scale-125 bg-white shadow-[0_0_10px_rgba(0,255,240,1),0_0_22px_rgba(0,255,240,1)]"
                    : "",
                ].join(" ")}
              />

              {/* Hiệu ứng quét sáng khi hover */}
              <div className="pointer-events-none absolute left-[118px] top-0 h-[80px] w-[80px] overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -left-8 top-0 h-full w-5 rotate-12 bg-white/10 blur-sm transition-transform duration-500 group-hover:translate-x-[120px]" />
              </div>
            </button>
          );
        })}
      </div>

      {activePanel === "project" && (
        <ProjectGallery onClose={() => setActivePanel(null)} />
      )}

      {activePanel === "skill" && (
        <SkillGallery onClose={() => setActivePanel(null)} />
      )}
    </div>
  );
}