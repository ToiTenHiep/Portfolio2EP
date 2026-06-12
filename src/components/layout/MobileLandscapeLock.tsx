"use client";

import { useEffect, useState, type ReactNode } from "react";

type MobileLandscapeLockProps = {
  children: ReactNode;
};

const DESIGN_WIDTH = 1366;
const DESIGN_HEIGHT = 768;
const MOBILE_BREAKPOINT = 900;

export default function MobileLandscapeLock({
  children,
}: MobileLandscapeLockProps) {
  const [stageStyle, setStageStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    function updateStage() {
     const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isPortrait = vh > vw;

        const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

        const isMobile =
        Math.min(vw, vh) <= MOBILE_BREAKPOINT && isTouchDevice;

        if (!isMobile) {
        setStageStyle(null);
        return;
        }

      /**
       * Khi điện thoại dọc:
       * UI 1366x768 sẽ xoay 90 độ.
       * Sau khi xoay:
       * - DESIGN_WIDTH khớp với chiều cao màn hình
       * - DESIGN_HEIGHT khớp với chiều rộng màn hình
       */
      const scale = isPortrait
        ? Math.min(vh / DESIGN_WIDTH, vw / DESIGN_HEIGHT)
        : Math.min(vw / DESIGN_WIDTH, vh / DESIGN_HEIGHT);

      setStageStyle({
        width: DESIGN_WIDTH,
        height: DESIGN_HEIGHT,
        transform: isPortrait
          ? `translate(-50%, -50%) rotate(90deg) scale(${scale})`
          : `translate(-50%, -50%) scale(${scale})`,
      });
    }

    updateStage();

    window.addEventListener("resize", updateStage);
    window.addEventListener("orientationchange", updateStage);

    return () => {
      window.removeEventListener("resize", updateStage);
      window.removeEventListener("orientationchange", updateStage);
    };
  }, []);

  if (!stageStyle) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-landscape-shell">
      <div className="mobile-landscape-stage" style={stageStyle}>
        {children}
      </div>
    </div>
  );
}