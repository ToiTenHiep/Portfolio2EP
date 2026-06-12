const experiences = [
  {
    time: "2022 - 2023 / CYBERKID VIETNAM",
    role: "UI/UX DESIGNER",
    desc: "Comming soon.",
    tags: ["Figma"],
  },
  {
    time: "2023 - 2025 / EAST BRIDGE",
    role: "DESIGNER",
    desc: "Comming soon.",
    tags: ["Illustrator", "Photoshop", "Figma","After Effects","Premiere", "Design System", "Branding", "Poster", "Layout", "Visual Identity", "Typography",  "Composition", "Color Theory", "Design Principle", "..."],
  },
  {
    time: "2025 - 2025 / ECOFLOWMEDIA",
    role: "UXUI DESIGNER & VIDEO EDITOR",
    desc: "Comming soon.",
    tags: [ "UX/UI Design", "Motion Design", "Video Editing", "Figma", "Blender", "After Effects", "Premiere", "Visual Effects", "..."],
  },
  {
    time: "2020 - NOW",
    role: "FREELANCER",
    desc: "Comming soon.",
    tags: [ "Graphic Design", "Video Editing", "Motion Design", "Branding", "Poster", "Layout", "Visual Identity", "Typography",  "Composition", "Color Theory", "Design Principle", "..."],
  },
];

export default function ExperienceCard() {
  return (
    <div className="text-left">
      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ff005d] drop-shadow-[0_0_7px_rgba(255,0,93,0.7)]">
        WORK LOG
      </p>

      <h2 className="mt-2 font-black uppercase leading-none tracking-[0.06em] text-[#00ffee] drop-shadow-[0_0_12px_rgba(0,255,238,0.82)]">
        EXPERIENCE
      </h2>

      <div className="mt-2 h-px w-full bg-[#ff005d] shadow-[0_0_8px_rgba(255,0,93,0.65)]" />

      <div className="mt-4 space-y-3">
        {experiences.map((item) => (
          <article
            key={item.role}
            className="relative overflow-hidden border border-[#ff005d]/55 bg-[#ff005d]/8 px-3 py-3 shadow-[0_0_18px_rgba(255,0,93,0.16)]"
          >
            <span className="absolute left-0 top-0 h-full w-[3px] bg-[#00ffee] shadow-[0_0_12px_rgba(0,255,238,0.85)]" />

            <p className="pl-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#ff005d] drop-shadow-[0_0_6px_rgba(255,0,93,0.65)]">
              {item.time}
            </p>

            <h3 className="mt-2 pl-2 text-[13px] font-black uppercase leading-snug tracking-[0.06em] text-white">
              {item.role}
            </h3>

            <p className="mt-2 pl-2 text-[12px] leading-[1.35] text-white/60">
              {item.desc}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5 pl-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-[#00ffee]/40 bg-[#00ffee]/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#00ffee] shadow-[0_0_10px_rgba(0,255,238,0.12)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
