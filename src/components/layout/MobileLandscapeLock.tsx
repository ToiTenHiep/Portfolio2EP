"use client";

import type { ReactNode } from "react";

type MobileLandscapeLockProps = {
  children: ReactNode;
};

export default function MobileLandscapeLock({
  children,
}: MobileLandscapeLockProps) {
  return (
    <div className="mobile-landscape-shell">
      <div className="mobile-landscape-stage">{children}</div>
    </div>
  );
}