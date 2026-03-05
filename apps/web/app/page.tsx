import Link from "next/link";

const Homepage = () => {
  return (
    <div
      className="relative bg-[#0d0d0f] min-h-screen w-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(14px) rotate(-4deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeUp 0.7s ease both 0.1s; }
        .anim-2 { animation: fadeUp 0.7s ease both 0.25s; }
        .anim-3 { animation: fadeUp 0.7s ease both 0.4s; }
        .anim-4 { animation: fadeUp 0.7s ease both 0.55s; }
        .btn-primary { transition: box-shadow 0.25s, transform 0.2s; }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 28px 4px rgba(99,102,241,0.45);
        }
        .btn-secondary { transition: background 0.2s, transform 0.2s; }
        .btn-secondary:hover {
          background: rgba(99,102,241,0.08);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient blobs */}
      <div className="absolute top-[-120px] left-[-100px] w-[480px] h-[480px] rounded-full bg-indigo-700/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-60px] w-[360px] h-[360px] rounded-full bg-violet-800/10 blur-[80px] pointer-events-none" />

      {/* Floating decorative shapes */}
      <div className="absolute top-[12%] left-[8%] w-16 h-16 rounded-xl border border-white/[0.07] pointer-events-none"
        style={{ animation: "float 6s ease-in-out infinite" }} />
      <div className="absolute top-[20%] right-[10%] w-10 h-10 rounded-full border border-indigo-500/20 pointer-events-none"
        style={{ animation: "float2 5s ease-in-out infinite" }} />
      <div className="absolute bottom-[18%] left-[12%] w-8 h-8 border border-white/[0.06] pointer-events-none"
        style={{ animation: "float 8s ease-in-out infinite 1s", transform: "rotate(45deg)" }} />
      <div className="absolute bottom-[22%] right-[14%] w-14 h-14 rounded-lg border border-violet-500/15 pointer-events-none"
        style={{ animation: "float2 7s ease-in-out infinite 0.5s" }} />

      {/* Live badge */}
      <div className="anim-1 mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white/40 text-xs tracking-widest uppercase"
          style={{ fontFamily: "'DM Mono', monospace" }}>
          Real-time collaboration
        </span>
      </div>

      {/* Headline */}
      <h1 className="anim-2 text-5xl sm:text-6xl md:text-7xl font-light text-white tracking-tight leading-[1.05] mb-5">
        Draw together,
        <br />
        <span className="text-transparent bg-clip-text"
          style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)" }}>
          think together.
        </span>
      </h1>

      {/* Subline */}
      <p className="anim-3 text-base sm:text-lg text-white/35 mb-12 max-w-md leading-relaxed font-light">
        A collaborative infinite canvas for teams. Sketch ideas, diagram flows,
        and build together — live.
      </p>

      {/* CTA */}
      <div className="anim-4 flex flex-col sm:flex-row gap-3 w-full max-w-xs mx-auto">
        <Link href="/signup" className="w-full">
          <button className="btn-primary w-full px-8 py-3 bg-indigo-500 text-white rounded-xl font-medium text-sm">
            Get started free
          </button>
        </Link>
        <Link href="/signin" className="w-full">
          <button className="btn-secondary w-full px-8 py-3 border border-white/10 text-white/55 rounded-xl font-medium text-sm">
            Sign in
          </button>
        </Link>
      </div>

      {/* Footer */}
      <p className="anim-4 absolute bottom-7 text-white/15 text-xs tracking-widest"
        style={{ fontFamily: "'DM Mono', monospace" }}>
        collaborative-canvas · v1
      </p>
    </div>
  );
};

export default Homepage;