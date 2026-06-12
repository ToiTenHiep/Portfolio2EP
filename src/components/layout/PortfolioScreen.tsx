import HeaderHUD from "@/components/hud/HeaderHUD";
import LeftPanel from "@/components/sections/LeftPanel";
import RightPanel from "@/components/sections/RightPanel";
import CyberBackgroundLoader from "@/components/three/CyberBackgroundLoader";

export default function PortfolioScreen() {
  return (
    <main className="relative h-full w-full overflow-hidden bg-[#05010d] text-white">
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <CyberBackgroundLoader />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] h-full w-full bg-[linear-gradient(rgba(255,0,93,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,240,0.018)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative z-10 mx-auto h-full w-full max-w-[1366px] px-2 pt-0">
        <HeaderHUD />

        <section className="grid h-[calc(100%_-_84px)] grid-cols-[520px_minmax(0,1fr)] gap-10 pt-5">
          <LeftPanel />
          <RightPanel />
        </section>
      </div>
    </main>
  );
}