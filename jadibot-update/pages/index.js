import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Landing() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [status, router]);

  async function handleStart() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="wrap">
      {/* Background grid */}
      <div className="grid-bg" />
      <div className="glow-top" />
      <div className="glow-bottom" />

      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-mark">D</div>
          <span>Dafz <span className="gold">Hosting</span></span>
        </div>
        <div className="nav-badge">Bot Panel v2</div>
      </nav>

      {/* Hero */}
      <main className="hero">
        <div className="hero-tag">
          <span className="dot-pulse" /> Platform Manajemen Bot WA
        </div>

        <h1 className="hero-title">
          Kelola Bot<br />
          <span className="gold">WhatsApp</span> Kamu<br />
          Dari Satu Panel
        </h1>

        <p className="hero-desc">
          Powered by Pterodactyl. Deploy, monitor, dan kontrol<br />
          semua bot WhatsApp kamu dalam satu dashboard elegan.
        </p>

        <div className="hero-actions">
          <button className="btn-start" onClick={handleStart} disabled={loading}>
            {loading ? (
              <><div className="spin" /> Memuat...</>
            ) : (
              <><span>Mulai Sekarang</span> <span className="arr">→</span></>
            )}
          </button>
          <div className="hero-note">Login dengan Google · Gratis</div>
        </div>

        {/* Stats */}
        <div className="stats">
          {[
            { val: "99.9%", label: "Uptime" },
            { val: "< 1s",  label: "Response" },
            { val: "∞",     label: "Bot Slots" },
          ].map((s) => (
            <div key={s.label} className="stat">
              <div className="stat-val">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <section className="features">
        {[
          { icon: "⚡", title: "Instant Deploy", desc: "Bot baru langsung aktif di Pterodactyl dalam hitungan detik" },
          { icon: "📊", title: "Live Monitor", desc: "Pantau CPU, RAM, dan disk usage bot kamu secara realtime" },
          { icon: "🔒", title: "Secure Login", desc: "Autentikasi Google OAuth, data terisolasi per akun" },
          { icon: "🎛️", title: "Full Control", desc: "Start, stop, restart, suspend langsung dari dashboard" },
        ].map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-desc">{f.desc}</div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>© 2026 Dafz Hosting</span>
        <span className="sep">·</span>
        <span>Powered by Pterodactyl</span>
      </footer>

      <style jsx>{`
        .wrap { min-height:100vh; display:flex; flex-direction:column; align-items:center; position:relative; overflow:hidden; }

        .grid-bg {
          position:fixed; inset:0; z-index:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glow-top {
          position:fixed; top:-200px; left:50%; transform:translateX(-50%);
          width:600px; height:400px; z-index:0;
          background: radial-gradient(ellipse, rgba(245,200,66,0.08) 0%, transparent 70%);
          pointer-events:none;
        }
        .glow-bottom {
          position:fixed; bottom:-200px; right:-100px;
          width:500px; height:400px; z-index:0;
          background: radial-gradient(ellipse, rgba(34,197,94,0.05) 0%, transparent 70%);
          pointer-events:none;
        }

        .nav {
          width:100%; max-width:1000px; padding:1.5rem 2rem;
          display:flex; align-items:center; justify-content:space-between;
          position:relative; z-index:10;
        }
        .nav-logo { display:flex; align-items:center; gap:10px; font-family:'Space Grotesk',sans-serif; font-size:17px; font-weight:600; }
        .logo-mark {
          width:32px; height:32px; border-radius:8px;
          background:linear-gradient(135deg,#f5c842,#e8b800);
          display:flex; align-items:center; justify-content:center;
          font-size:15px; font-weight:700; color:#000;
        }
        .gold { color:var(--gold); }
        .nav-badge {
          font-size:11px; padding:4px 10px; border-radius:20px;
          border:1px solid var(--border3); color:var(--text2);
          background:var(--bg3);
        }

        .hero {
          flex:1; display:flex; flex-direction:column; align-items:center;
          justify-content:center; text-align:center;
          padding:4rem 2rem 3rem; position:relative; z-index:10;
          max-width:700px;
        }
        .hero-tag {
          display:inline-flex; align-items:center; gap:8px;
          font-size:12px; color:var(--text2);
          border:1px solid var(--border3);
          background:var(--bg3);
          padding:6px 14px; border-radius:20px; margin-bottom:2rem;
        }
        .dot-pulse {
          width:6px; height:6px; border-radius:50%; background:var(--green);
          box-shadow:0 0 8px var(--green);
          animation:pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

        .hero-title {
          font-family:'Space Grotesk',sans-serif;
          font-size:clamp(2.2rem,8vw,3.8rem);
          font-weight:700; line-height:1.1;
          letter-spacing:-0.02em; margin-bottom:1.5rem;
        }
        .hero-desc {
          font-size:15px; color:var(--text2); line-height:1.7;
          margin-bottom:2.5rem;
        }
        .hero-actions { display:flex; flex-direction:column; align-items:center; gap:12px; margin-bottom:3rem; }
        .btn-start {
          display:flex; align-items:center; gap:10px;
          padding:14px 32px; border-radius:12px; border:none;
          background:linear-gradient(135deg,#f5c842,#e8a800);
          color:#000; font-size:15px; font-weight:600;
          cursor:pointer; transition:all .2s;
          font-family:'Space Grotesk',sans-serif;
          box-shadow:0 0 40px rgba(245,200,66,0.2);
        }
        .btn-start:hover { transform:translateY(-2px); box-shadow:0 0 60px rgba(245,200,66,0.35); }
        .btn-start:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .arr { font-size:18px; }
        .hero-note { font-size:12px; color:var(--text3); }

        .stats { display:flex; gap:2rem; }
        .stat { text-align:center; }
        .stat-val { font-family:'Space Grotesk',sans-serif; font-size:22px; font-weight:700; color:var(--gold); }
        .stat-label { font-size:11px; color:var(--text3); margin-top:2px; }

        .features {
          display:grid; grid-template-columns:repeat(4,1fr); gap:12px;
          max-width:900px; width:100%; padding:0 2rem 4rem;
          position:relative; z-index:10;
        }
        .feature-card {
          background:var(--card); border:1px solid var(--border);
          border-radius:var(--rl); padding:1.25rem;
          transition:border-color .2s;
        }
        .feature-card:hover { border-color:var(--border3); }
        .feature-icon { font-size:22px; margin-bottom:10px; }
        .feature-title { font-size:13px; font-weight:600; margin-bottom:6px; }
        .feature-desc { font-size:12px; color:var(--text2); line-height:1.5; }

        .footer {
          width:100%; text-align:center; padding:1.5rem;
          font-size:12px; color:var(--text3);
          border-top:1px solid var(--border);
          position:relative; z-index:10;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .sep { color:var(--border3); }

        .spin { width:14px; height:14px; border:2px solid rgba(0,0,0,0.3); border-top-color:#000; border-radius:50%; animation:s 1s linear infinite; }
        @keyframes s { to{transform:rotate(360deg)} }

        @media(max-width:640px) {
          .features { grid-template-columns:repeat(2,1fr); }
          .stats { gap:1.5rem; }
        }
      `}</style>
    </div>
  );
}
