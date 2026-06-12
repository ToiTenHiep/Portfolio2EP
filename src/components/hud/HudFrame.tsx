type HudFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export default function HudFrame({ children, className = "" }: HudFrameProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-[28px] border border-[#ff0049]
        bg-[#2b0015]/75
        cyber-pink-glow
        ${className}
      `}
    >
      <span className="absolute left-0 top-0 h-10 w-1 bg-[#ff0049]" />
      <span className="absolute bottom-0 right-0 h-1 w-10 bg-[#ff0049]" />
      <span className="absolute left-4 top-4 h-2.5 w-2.5 rounded-full bg-[#00ffee] cyber-cyan-glow" />
      <span className="absolute right-4 bottom-4 h-2.5 w-2.5 rounded-full bg-[#00ffee] cyber-cyan-glow" />
      <span className="absolute right-0 top-16 h-[calc(100%-5rem)] w-0.5 bg-[#00ffee]/20" />

      {children}
    </div>
  );
}
