"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

type MobileLandscapeLockProps = {
  children: ReactNode;
};

const DESIGN_WIDTH = 1366;
const DESIGN_HEIGHT = 768;
const MOBILE_BREAKPOINT = 900;

/**
 * Giảm nhẹ để trên điện thoại không bị sát viền/cắt.
 * 1 = full sát màn
 * 0.96 = an toàn hơn
 * 0.92 = nhỏ hơn nữa
 */
const MOBILE_SAFE_SCALE = 0.94;

export default function MobileLandscapeLock({
  children,
}: MobileLandscapeLockProps) {
  const [mode, setMode] = useState<"desktop" | "mobile-portrait" | "mobile-landscape">(
    "desktop",
  );
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateStage() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
      const isMobile = Math.min(vw, vh) <= MOBILE_BREAKPOINT && isTouchDevice;
      const isPortrait = vh > vw;

      if (!isMobile) {
        setMode("desktop");
        setScale(1);
        return;
      }

      if (isPortrait) {
        const nextScale =
          Math.min(vw / DESIGN_HEIGHT, vh / DESIGN_WIDTH) * MOBILE_SAFE_SCALE;

        setMode("mobile-portrait");
        setScale(nextScale);
        return;
      }

      const nextScale =
        Math.min(vw / DESIGN_WIDTH, vh / DESIGN_HEIGHT) * MOBILE_SAFE_SCALE;

      setMode("mobile-landscape");
      setScale(nextScale);
    }

    updateStage();

    window.addEventListener("resize", updateStage);
    window.addEventListener("orientationchange", updateStage);

    return () => {
      window.removeEventListener("resize", updateStage);
      window.removeEventListener("orientationchange", updateStage);
    };
  }, []);

  if (mode === "desktop") {
    return <>{children}</>;
  }

  const rotatorStyle: CSSProperties = {
    width: `${DESIGN_WIDTH}px`,
    height: `${DESIGN_HEIGHT}px`,
    transform:
      mode === "mobile-portrait"
        ? "translate(-50%, -50%) rotate(90deg)"
        : "translate(-50%, -50%)",
  };

  const stageStyle: CSSProperties = {
    width: `${DESIGN_WIDTH}px`,
    height: `${DESIGN_HEIGHT}px`,
    transform: `scale(${scale})`,
  };

  return (
    <div className="mobile-landscape-shell">
      <div className="mobile-landscape-rotator" style={rotatorStyle}>
        <div className="mobile-landscape-stage" style={stageStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}