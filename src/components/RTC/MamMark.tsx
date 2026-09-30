export default function MamMark({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  if (compact) {
    return (
      <div className="text-center py-4">
        <div className={`font-black tracking-[0.25em] ${light ? "text-white" : "text-[#0F2A5C]"} text-2xl md:text-3xl`}>M.A.M</div>
        <div className={`${light ? "text-white/80" : "text-[#0F2A5C]/60"} text-[11px] tracking-widest mt-1 font-medium`}>انما الانسان اثر</div>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-center justify-center py-8 md:py-10 select-none">
      <div className="font-black tracking-[0.18em] md:tracking-[0.28em] text-[#0F2A5C] text-5xl md:text-7xl lg:text-8xl leading-none drop-shadow-sm">M.A.M</div>
      <div className="mt-2 text-[#0F2A5C]/70 text-sm md:text-xl font-medium tracking-[0.2em]">انما الانسان اثر</div>
      <div className="mt-3 h-1 w-24 md:w-32 rounded-full bg-[#FFD600]" />
    </div>
  );
}
