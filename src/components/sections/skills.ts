export type SkillGroup = "design" | "code" | "office";

export type SkillIconType = "text" | "svg";

export type SkillItem = {
  id: string;
  name: string;
  shortName: string;
  group: SkillGroup;
  color: string;
  description: string;
  iconType?: SkillIconType;
  iconSrc?: string;
};

export const skills: SkillItem[] = [
  {
    id: "ai",
    name: "Adobe Illustrator",
    shortName: "Ai",
    group: "design",
    color: "#ff8a00",
    description:
        "Vector design, logo creation, icon system, poster layout and branding visual development.",
    iconType: "svg",
    iconSrc: "/icons/skills/illustrator.svg",
    },
    {
    id: "pr",
    name: "Adobe Premiere Pro",
    shortName: "Pr",
    group: "design",
    color: "#5b2cff",
    description:
        "Video editing, cut scene arrangement, transition handling and short portfolio presentation video.",
    iconType: "svg",
    iconSrc: "/icons/skills/premiere.svg",
    },
    {
    id: "ae",
    name: "After Effects",
    shortName: "Ae",
    group: "design",
    color: "#7a3cff",
    description:
        "Motion graphic, HUD animation, intro effect, visual transition and basic dynamic composition.",
    iconType: "svg",
    iconSrc: "/icons/skills/after-effects.svg",
    },
    {
    id: "ps",
    name: "Adobe Photoshop",
    shortName: "Ps",
    group: "design",
    color: "#00a2ff",
    description:
        "Image editing, banner design, mockup editing, retouching and composition enhancement.",
    iconType: "svg",
    iconSrc: "/icons/skills/photoshop.svg",
    },
  {
    id: "figma",
    name: "Figma",
    shortName: "Fg",
    group: "design",
    color: "#00fff0",
    description:
      "UI/UX design, wireframe, prototype, auto layout, component system and design handoff.",
    iconType: "svg",
    iconSrc: "/icons/skills/Figma.svg",
  },
  {
    id: "blender",
    name: "Blender",
    shortName: "BL",
    group: "design",
    color: "#FF0049",
    description:
      "Basic 3D modeling, scene composition, object presentation and visual support for portfolio.",
    iconType: "svg",
    iconSrc: "/icons/skills/Blender.svg",
  },
  {
    id: "aseprite",
    name: "Aseprite",
    shortName: "As",
    group: "design",
    color: "#d000ff",
    description:
      "Pixel art, sprite design, frame animation and game visual asset creation.",
    iconType: "svg",
    iconSrc: "/icons/skills/Aseprite.svg",
  },

  {
    id: "html",
    name: "HTML",
    shortName: "HTML",
    group: "code",
    color: "#FF0049",
    description:
      "Semantic structure, accessible markup and clean foundational layout for websites.",
    iconType: "text",
  },
  {
    id: "css",
    name: "CSS",
    shortName: "CSS",
    group: "code",
    color: "#00fff0",
    description:
      "Responsive layout, visual styling, animation, cyber UI detail and reusable interface effects.",
    iconType: "text",
  },
  {
    id: "js",
    name: "JavaScript",
    shortName: "JS",
    group: "code",
    color: "#f7df1e",
    description:
      "Interactive frontend logic, DOM handling, event control and dynamic web behavior.",
    iconType: "text",
  },
  {
    id: "C#",
    name: "C#",
    shortName: "C#",
    group: "code",
    color: "#512BD4",
    description:
      "Interactive frontend logic, DOM handling, event control and dynamic web behavior.",
    iconType: "text",
  },

  {
    id: "react",
    name: "React",
    shortName: "React",
    group: "code",
    color: "#00fff0",
    description:
      "Component-based interface, state management, reusable UI blocks and interactive screens.",
    iconType: "text",
  },
  {
    id: "next",
    name: "Next.js",
    shortName: "Next",
    group: "code",
    color: "#ffffff",
    description:
      "Modern app routing, page composition, optimized frontend flow and portfolio structure.",
    iconType: "text",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    shortName: "TW",
    group: "code",
    color: "#38bdf8",
    description:
      "Utility-first styling, responsive UI, fast layout building and consistent design system.",
    iconType: "text",
  },

  {
    id: "php",
    name: "PHP",
    shortName: "PHP",
    group: "code",
    color: "#777bb4",
    description:
      "Server-side programming, form handling, backend processing and web application logic.",
    iconType: "text",
  },
  {
    id: "laravel",
    name: "Laravel",
    shortName: "LV",
    group: "code",
    color: "#ff2d20",
    description:
      "MVC structure, routing, controller logic, Blade template and database-driven web systems.",
    iconType: "text",
  },
  {
    id: "mysql",
    name: "MySQL",
    shortName: "SQL",
    group: "code",
    color: "#00fff0",
    description:
      "Database design, relational structure, queries and data management for web applications.",
    iconType: "text",
  },

  {
    id: "python",
    name: "Python",
    shortName: "PY",
    group: "code",
    color: "#460FD1",
    description:
      "Repository hosting, source control, project sharing and collaborative development.",
    iconType: "text",
  },

  {
    id: "word",
    name: "Microsoft Word",
    shortName: "W",
    group: "office",
    color: "#00FFEE",
    description:
      "Document formatting, report writing, table of contents and project documentation.",
    iconType: "svg",
    iconSrc: "/icons/skills/Word.svg",
  },
  {
    id: "excel",
    name: "Microsoft Excel",
    shortName: "X",
    group: "office",
    color: "#00FFEE",
    description:
      "Spreadsheet handling, formulas, data tracking, tables and simple statistics.",
    iconType: "svg",
    iconSrc: "/icons/skills/Excel.svg",
  },
  {
    id: "powerpoint",
    name: "PowerPoint",
    shortName: "P",
    group: "office",
    color: "#00FFEE",
    description:
      "Slide design, project pitching, visual storytelling and presentation support.",
    iconType: "svg",
    iconSrc: "/icons/skills/PowerPoint.svg",
  },
];