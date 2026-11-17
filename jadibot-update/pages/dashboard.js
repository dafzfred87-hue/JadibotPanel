import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [bots, setBots]   = useState([]);
  const [loading, setLoad]= useState(true);
  const [working, setWork]= useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => { if (status === "unauthenticated") router.replace("/"); }, [status]);
  useEffect(() => { if (status === "authenticated") fetchBots(); }, [status]);

  const fetchBots = useCallback(async () => {
    setLoad(true);
    const r = await fetch("/api/bots");
    const d = await r.json();
    setBots(Array.isArray(d) ? d : []);
    setLoad(false);
  }, []);

  async function action(bot, act) {
    setWork((p) => ({ ...p, [bot.id]: true }));
    const r = await fetch("/api/bots", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bot.id, action: act }),
    });
    setWork((p) => ({ ...p, [bot.id]: false }));
    if (r.ok) { toast_show(act + " berhasil"); fetchBots(); }
    else { const d = await r.json(); toast_show(d.error, true); }
  }

  async function del(bot) {
    if (!confirm(`Hapus "${bot.name}"?`)) return;
    setWork((p) => ({ ...p, [bot.id]: true }));
    const r = await fetch("/api/bots", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bot.id }),
    });
    if (r.ok) { toast_show("Server dihapus"); setBots((p) => p.filter((b) => b.id !== bot.id)); }
    else { const d = await r.json(); toast_show(d.error, true); }
    setWork((p) => ({ ...p, [bot.id]: false }));
  }

  function toast_show(msg, err = false) {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3000);
  }

  const active = bots.filter((b) => !b.suspended).length;

  return (
    <Layout bots={bots}>
      <div className="page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Kelola semua bot WhatsApp dari Pterodactyl panel</p>
          </div>
          <button className="btn-add" onClick={() => router.push("/add-bot")}>
            + Tambah Bot
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { label:"Total Server", val:bots.length, sub:"terdaftar", color:"" },
            { label:"Running",      val:active,       sub:"online",    color:"green" },
            { label:"Suspended",    val:bots.length - active, sub:"offline", color:"amber" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className={`stat-val ${s.color}`}>{s.val}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Bot grid */}
        {loading ? (
          <div className="loading-wrap">
            <div className="spin" />
            <span>Mengambil data dari Pterodactyl...</span>
          </div>
        ) : bots.length === 0 ? (
          <div className="empty-wrap">
            <div className="empty-icon">🤖</div>
            <h3>Belum ada bot</h3>
            <p>Tambah bot pertamamu sekarang</p>
            <button className="btn-prim" onClick={() => router.push("/add-bot")}>+ Tambah Bot</button>
          </div>
        ) : (
          <div className="bot-grid">
            {bots.map((bot) => (
              <div key={bot.id} className={`bot-card ${!bot.suspended ? "running" : ""}`}
                onClick={() => router.push(`/bot/${bot.id}`)}>
                {working[bot.id] && <div className="card-loading"><div className="spin sm"/></div>}

                <div className="card-top">
                  <div className="card-left">
                    <div className="bot-icon">🤖</div>
                    <div>
                      <div className="bot-name">{bot.name}</div>
                      <div className="bot-num">{bot.phone || "—"}</div>
                    </div>
                  </div>
                  <div className={`status-badge ${!bot.suspended ? "on" : "off"}`}>
                    <div className={`sdot ${!bot.suspended ? "on" : "off"}`}/>
                    {!bot.suspended ? "Running" : "Suspended"}
                  </div>
                </div>

                <div className="card-meta">
                  <span className="meta-tag">📁 {bot.folder || "Default"}</span>
                  <span className="meta-tag">🖥 ID: {bot.id}</span>
                </div>

                <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                  {!bot.suspended ? (
                    <>
                      <button className="ca-btn" onClick={() => action(bot,"restart")} disabled={working[bot.id]}>↺</button>
                      <button className="ca-btn" onClick={() => action(bot,"stop")} disabled={working[bot.id]}>⏹</button>
                      <button className="ca-btn amber" onClick={() => action(bot,"suspend")} disabled={working[bot.id]}>🔒</button>
                    </>
                  ) : (
                    <button className="ca-btn green" onClick={() => action(bot,"unsuspend")} disabled={working[bot.id]}>▶ Aktifkan</button>
                  )}
                  <button className="ca-btn red" onClick={() => del(bot)} disabled={working[bot.id]}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className={`toast ${toast.err ? "err" : ""}`}>
          <span className="toast-dot">{toast.err ? "✗" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      <style jsx>{`
        .page { padding:2rem; max-width:1100px; }
        .page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:2rem; gap:1rem; }
        .page-header h1 { font-family:'Space Grotesk',sans-serif; font-size:22px; font-weight:700; margin-bottom:4px; }
        .page-header p  { font-size:13px; color:var(--text2); }
        .btn-add {
          padding:9px 18px; border-radius:9px; border:1px solid var(--gold-border);
          background:var(--gold-bg); color:var(--gold);
          font-size:13px; font-weight:500; cursor:pointer; transition:all .15s;
          white-space:nowrap; flex-shrink:0;
        }
        .btn-add:hover { background:var(--gold); color:#000; }

        .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:2rem; }
        .stat-card { background:var(--card); border:1px solid var(--border); border-radius:var(--rl); padding:1.25rem 1.5rem; }
        .stat-label { font-size:11px; color:var(--text3); text-transform:uppercase; letter-spacing:.06em; margin-bottom:8px; }
        .stat-val { font-family:'Space Grotesk',sans-serif; font-size:28px; font-weight:700; }
        .stat-val.green { color:var(--green); }
        .stat-val.amber { color:#f59e0b; }
        .stat-sub { font-size:11px; color:var(--text3); margin-top:2px; }

        .bot-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
        .bot-card {
          background:var(--card); border:1px solid var(--border);
          border-radius:var(--rl); padding:1.25rem;
          cursor:pointer; transition:all .2s; position:relative; overflow:hidden;
        }
        .bot-card:hover { border-color:var(--border3); background:var(--bg2); transform:translateY(-1px); }
        .bot-card.running { border-color:rgba(34,197,94,0.15); }
        .bot-card.running::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,var(--green),transparent);
          opacity:.5;
        }

        .card-loading { position:absolute; inset:0; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:5; border-radius:var(--rl); }
        .card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
        .card-left { display:flex; align-items:center; gap:10px; }
        .bot-icon { width:36px; height:36px; border-radius:9px; background:var(--bg3); border:1px solid var(--border2); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
        .bot-name { font-size:14px; font-weight:500; margin-bottom:2px; }
        .bot-num  { font-size:11px; color:var(--text3); font-family:monospace; }
        .status-badge { font-size:11px; font-weight:500; padding:3px 9px; border-radius:20px; display:inline-flex; align-items:center; gap:5px; white-space:nowrap; }
        .status-badge.on  { background:var(--green-bg); color:var(--green); border:1px solid var(--green-border); }
        .status-badge.off { background:var(--bg3); color:var(--text3); border:1px solid var(--border); }
        .sdot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
        .sdot.on  { background:var(--green); box-shadow:0 0 5px var(--green); }
        .sdot.off { background:var(--text3); }

        .card-meta { display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
        .meta-tag { font-size:11px; color:var(--text3); background:var(--bg3); border:1px solid var(--border); padding:2px 8px; border-radius:5px; }

        .card-actions { display:flex; gap:6px; }
        .ca-btn { padding:6px 10px; border-radius:7px; border:1px solid var(--border2); background:none; color:var(--text2); font-size:12px; cursor:pointer; transition:all .15s; }
        .ca-btn:hover { background:var(--bg3); color:var(--text); border-color:var(--border3); }
        .ca-btn:disabled { opacity:.4; cursor:not-allowed; }
        .ca-btn.green { color:var(--green); border-color:var(--green-border); }
        .ca-btn.green:hover { background:var(--green-bg); }
        .ca-btn.amber:hover { border-color:rgba(245,158,11,.3); color:#f59e0b; background:rgba(245,158,11,.08); }
        .ca-btn.red:hover { border-color:var(--red-border); color:var(--red); background:var(--red-bg); }

        .loading-wrap { display:flex; align-items:center; gap:12px; padding:4rem 0; color:var(--text2); font-size:14px; }
        .empty-wrap { display:flex; flex-direction:column; align-items:center; padding:5rem 2rem; text-align:center; gap:0.75rem; }
        .empty-icon { font-size:48px; margin-bottom:0.5rem; }
        .empty-wrap h3 { font-size:18px; font-weight:600; }
        .empty-wrap p  { font-size:13px; color:var(--text2); }
        .btn-prim { margin-top:0.5rem; padding:10px 20px; background:var(--gold); color:#000; border:none; border-radius:9px; font-size:13px; font-weight:600; cursor:pointer; }

        .spin { width:20px; height:20px; border:2px solid var(--border2); border-top-color:var(--gold); border-radius:50%; animation:s 1s linear infinite; }
        .spin.sm { width:18px; height:18px; }
        @keyframes s { to{transform:rotate(360deg)} }

        .toast { position:fixed; bottom:1.5rem; right:1.5rem; background:var(--bg2); border:1px solid var(--border3); color:var(--text); border-radius:10px; padding:10px 16px; font-size:13px; display:flex; align-items:center; gap:8px; z-index:999; box-shadow:0 8px 32px rgba(0,0,0,0.5); }
        .toast.err { border-color:var(--red-border); }
        .toast-dot { width:18px; height:18px; border-radius:50%; background:var(--green); color:#000; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; flex-shrink:0; }
        .toast.err .toast-dot { background:var(--red); color:#fff; }

        @media(max-width:640px) { .stats-row{grid-template-columns:repeat(2,1fr)} .bot-grid{grid-template-columns:1fr} .page{padding:1.25rem} }
      `}</style>
    </Layout>
  );
}
