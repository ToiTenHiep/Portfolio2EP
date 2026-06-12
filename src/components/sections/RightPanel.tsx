import ProjectPreviewRow from "./ProjectPreviewRow";
import ModelPlaceholder from "@/components/three/ModelPlaceholder";

export default function RightPanel() {
  return (
    <section className="relative h-full overflow-hidden">
      <ProjectPreviewRow />

      <div className="absolute inset-x-0 top-[120px] h-[460px]">
        <ModelPlaceholder />
      </div>

      <div className="absolute bottom-8 left-0 h-[2px] w-full bg-[#ff005d]">
        <span className="absolute left-0 top-0 h-[6px] w-12 -translate-y-1 bg-[#ff005d]" />
      </div>
    </section>
  );
}