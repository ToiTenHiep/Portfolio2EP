export type ProjectCategory =
  | "image"
  | "video"
  | "web-app"
  | "ai"
  | "model-3d"
  | "more-1"
  | "more-2"
  | "more-3";

export type ProjectMedia =
  | {
      kind: "image";
      src: string;
      alt?: string;
    }
  | {
      kind: "video";
      src: string;
      poster?: string;
      autoPlayMuted?: boolean;
    }
  | {
      kind: "coming-soon";
      title?: string;
      description?: string;
    };

export type ProjectPreviewItem = {
  id: number;
  name: string;
  type: string;
  category: ProjectCategory;
  media: ProjectMedia;
};

export type GalleryTabItem = {
  id: ProjectCategory;
  label: string;
  width: number;
};

export const galleryTabs: GalleryTabItem[] = [
  { id: "image", label: "Image", width: 80 },
  { id: "video", label: "Video", width: 80 },
  { id: "web-app", label: "Web/App", width: 80 },
  { id: "ai", label: "AI", width: 80 },
  { id: "model-3d", label: "Model 3D", width: 80 },
  { id: "more-1", label: "...", width: 80 },
  { id: "more-2", label: "...", width: 80 },
  { id: "more-3", label: "...", width: 80 },
];

const imageItems: ProjectPreviewItem[] = Array.from(
  { length: 46 },
  (_, index): ProjectPreviewItem => {
    const number = index + 1;

    return {
      id: number,
      name: `Project ${number}`,
      type: "IMAGE",
      category: "image",
      media: {
        kind: "image",
        src: `/projects/project_${number}.png`,
        alt: `Project ${number}`,
      },
    };
  },
);

const videoItems: ProjectPreviewItem[] = [
  {
    id: 101,
    name: "RECAP EB",
    type: "VIDEO",
    category: "video",
    media: {
      kind: "video",
      src: "/videos/recap-eb.mp4",
      poster: "/videos/VID.png",
      autoPlayMuted: true,
    },
  },
  {
    id: 102,
    name: "UI Animation",
    type: "VIDEO",
    category: "video",
    media: {
      kind: "video",
      src: "/projects/videos/ui-animation.mp4",
      poster: "/videos/VID.png",
      autoPlayMuted: true,
    },
  },
];

const comingSoonItems: ProjectPreviewItem[] = [
  {
    id: 201,
    name: "Web/App Project",
    type: "WEB / APP",
    category: "web-app",
    media: {
      kind: "coming-soon",
      title: "WEB / APP",
      description: "COMING SOON",
    },
  },
  {
    id: 301,
    name: "AI Project",
    type: "AI",
    category: "ai",
    media: {
      kind: "coming-soon",
      title: "AI",
      description: "COMING SOON",
    },
  },
  {
    id: 401,
    name: "Model 3D Project",
    type: "MODEL 3D",
    category: "model-3d",
    media: {
      kind: "coming-soon",
      title: "MODEL 3D",
      description: "COMING SOON",
    },
  },
  {
    id: 501,
    name: "Coming Soon",
    type: "COMING SOON",
    category: "more-1",
    media: {
      kind: "coming-soon",
      title: "COMING SOON",
      description: "PROJECT MODULE IS LOCKED",
    },
  },
  {
    id: 502,
    name: "Coming Soon",
    type: "COMING SOON",
    category: "more-2",
    media: {
      kind: "coming-soon",
      title: "COMING SOON",
      description: "PROJECT MODULE IS LOCKED",
    },
  },
  {
    id: 503,
    name: "Coming Soon",
    type: "COMING SOON",
    category: "more-3",
    media: {
      kind: "coming-soon",
      title: "COMING SOON",
      description: "PROJECT MODULE IS LOCKED",
    },
  },
];

export const galleryItems: ProjectPreviewItem[] = [
  ...imageItems,
  ...videoItems,
  ...comingSoonItems,
];