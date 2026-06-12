import { infoCardData, type InfoCardVariant } from "./aboutCardData";

type InfoCardProps = {
  variant: InfoCardVariant;
};

export default function InfoCard({ variant }: InfoCardProps) {
  const data = infoCardData[variant];

  return (
    <div className="text-left">
      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ff005d] drop-shadow-[0_0_7px_rgba(255,0,93,0.7)]">
        {data.eyebrow}
      </p>

      <h2 className="mt-2 font-black uppercase leading-none tracking-[0.06em] text-[#00ffee] drop-shadow-[0_0_12px_rgba(0,255,238,0.82)]">
        {data.title}
      </h2>

      <div className="mt-2 h-px w-full bg-[#ff005d] shadow-[0_0_8px_rgba(255,0,93,0.65)]" />

      <div className="mt-3 space-y-2 font-bold text-[#00ffee] drop-shadow-[0_0_6px_rgba(0,255,238,0.35)]">
        {data.details.map((item) => (
          <p
            key={item.label}
            className="text-[12px] leading-none"
          >
            - {item.label}: {item.value}
          </p>
        ))}
      </div>

      <div className="mt-3 h-px w-full bg-[#ff005d] shadow-[0_0_8px_rgba(255,0,93,0.65)]" />

      <div className="mt-3 space-y-3 pb-1 text-[13px] leading-[1.35] text-[#aaa]">
        {data.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
