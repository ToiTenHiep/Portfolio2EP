export type AboutCardVariant = "about" | "experience" | "education";
export type InfoCardVariant = Exclude<AboutCardVariant, "experience">;

export type InfoCardDetail = {
  label: string;
  value: string | number;
};

export type InfoCardData = {
  eyebrow: string;
  title: string;
  details: InfoCardDetail[];
  description: string[];
};

export const infoCardData: Record<InfoCardVariant, InfoCardData> = {
  about: {
    eyebrow: "DATA PROFILE",
    title: "ABOUT ME",
    details: [
      { label: "Name", value: "CAM DUC HIEP" },
      { label: "Age", value: 23 },
      { label: "Birthday", value: "28/12/2003" },
    ],
    description: [
      "I am passionate about design and always strive to improve myself in this field every day. From video editing, graphic design, and coding to my ultimate goal and passion for UX/UI design.",
      "My design principle is to keep layouts clean, elements consistent, information clear, easy to read, and visually attractive. I enjoy building digital interfaces that feel modern, sharp, and easy to use.",
      "I focus on small interaction details, visual hierarchy, spacing, contrast, and motion to make each interface feel more alive. My current portfolio direction is cyberpunk, neon HUD, 3D depth, and futuristic UI systems.",
      "I also pay attention to motion design, micro-interactions, responsive layouts, and how visual effects support the message instead of distracting from it.",
    ],
  },

  education: {
    eyebrow: "EDUCATION DATA",
    title: "EDUCATION",
    details: [
      { label: "Major", value: "Information Technology" },
      { label: "University", value: "EAUT" },
      { label: "Degree", value: "Good" },
      { label: "Direction", value: "UX/UI Design" },
    ],
    description: [
      "I graduated in Information Technology, which gave me a solid foundation in programming, databases, software structure, and system thinking.",
      "Alongside my IT background, I continuously study UI/UX design, layout composition, visual hierarchy, color, typography, interaction design, and product thinking to move closer to my design career direction.",
      "My learning path combines technology and design, so I can create interfaces that are not only visually attractive but also practical, clear, and easy to develop.",
    ],
  },
};
