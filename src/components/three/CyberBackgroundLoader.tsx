"use client";

import dynamic from "next/dynamic";

const CyberBackground = dynamic(() => import("./CyberBackground"), {
  ssr: false,
});

export default function CyberBackgroundLoader() {
  return <CyberBackground />;
}