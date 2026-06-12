"use client";

import type { ReactNode } from "react";

type MobileLandscapeLockProps = {
  children: ReactNode;
};

export default function MobileLandscapeLock({
  children,
}: MobileLandscapeLockProps) {
  return <>{children}</>;
}