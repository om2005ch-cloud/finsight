function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#080d14] overflow-hidden pointer-events-none">
      {/* Precision architectural technical grid */}
      <div 
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Top Emerald Radial Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-500/18 via-teal-500/10 to-transparent blur-3xl rounded-full" />
      
      {/* Mid Left Teal Ambient Bloom */}
      <div className="absolute top-[40%] -left-48 w-[600px] h-[600px] bg-gradient-to-r from-teal-500/12 to-transparent blur-3xl rounded-full" />
      
      {/* Mid Right Cyan/Indigo Glow */}
      <div className="absolute top-[65%] -right-48 w-[650px] h-[650px] bg-gradient-to-l from-cyan-500/10 via-emerald-500/8 to-transparent blur-3xl rounded-full" />
      
      {/* Bottom Emerald Soft Anchor */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/12 blur-3xl rounded-full" />
    </div>
  );
}

export default AnimatedBackground;
