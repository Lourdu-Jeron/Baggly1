import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { BAGS0, WORKERS0, ORDERS0, WEEK_LABELS, PROD_DATA, REV_DATA, CAT_DATA, AI_TIPS } from './data';
import { fmtC, fmtN, stockSt } from './helpers';
import { KPICard } from './KPICard';
import { ProgressBar } from './ProgressBar';
import { Skeleton } from './Skeleton';
import { Tag } from './Tag';
export const Dashboard = ({ dark }) => {
  const [aiIdx, setAiIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const iv = setInterval(() => setAiIdx(i => (i + 1) % AI_TIPS.length), 4500); return () => clearInterval(iv); }, []);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const areaData = WEEK_LABELS.map((day, i) => ({ day, bags: PROD_DATA[i], target: 200 }));
  const totalBags = PROD_DATA.reduce((a, b) => a + b, 0);

  if (loading) return (
    <div className="fade" style={{ padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[0, 1, 2, 3].map(i => <div key={i} className="card" style={{ padding: 20 }}><Skeleton h={70} /></div>)}
      </div>
      <Skeleton h={260} r={14} />
    </div>
  );
  const present = WORKERS0.filter(w => w.status === "Present").length;
  const active = ORDERS0.filter(o => o.status !== "Completed").length;
  return (
    <div className="fade" style={{ padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <KPICard label="Bags This Week" value={fmtN(totalBags)} icon="🎒" color="#6366f1" trend={12} sub="vs last week" />
        <KPICard label="Monthly Revenue" value={fmtC(2500000)} icon="💰" color="#22c55e" trend={8} sub="vs last month" />
        <KPICard label="Active Orders" value={active} icon="🛍️" color="#f59e0b" trend={-3} sub="need action" />
        <KPICard label="Workers Present" value={`${present} / ${WORKERS0.length}`} icon="👷" color="#0ea5e9" sub="on duty today" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Weekly Production</p>
              <p style={{ fontSize: 12, color: "var(--text2)" }}>Bags made vs 200/day target</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="areag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#374151" : "#f1f5f9"} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--text3)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text3)" }} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
              <Area type="monotone" dataKey="bags" stroke="#6366f1" strokeWidth={2.5} fill="url(#areag)" name="Produced" />
              <Area type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={1.5} fill="none" strokeDasharray="5 4" name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: "18px 20px" }}>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Category Mix</p>
          <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 10 }}>Production share this month</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={CAT_DATA} cx="50%" cy="50%" innerRadius={36} outerRadius={56} dataKey="v" paddingAngle={3}>
                {CAT_DATA.map((c, i) => <Cell key={i} fill={c.c} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} formatter={v => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          {CAT_DATA.map(c => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.c, display: "inline-block" }} />
                <span style={{ fontSize: 12, color: "var(--text2)" }}>{c.name}</span>
              </div>
              <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{c.v}%</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 16 }}>
        {/* AI Advisor */}
        <div className="card" style={{ padding: "18px 20px", borderLeft: "3px solid var(--primary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <p style={{ fontWeight: 700, fontSize: 14 }}>Insights</p>
            <Tag bg="var(--plight)" c="var(--primary)" style={{ marginLeft: "auto", fontSize: 9 }}>sample</Tag>
          </div>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75, minHeight: 72 }}>{AI_TIPS[aiIdx]}</p>
          <div style={{ display: "flex", gap: 4, marginTop: 14 }}>
            {AI_TIPS.map((_, i) => (
              <div key={i} style={{ height: 4, flex: i === aiIdx ? 2 : 1, borderRadius: 3, background: i === aiIdx ? "var(--primary)" : "var(--border)", transition: "all .4s" }} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ padding: "18px 20px" }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>⚡ Quick Actions</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { icon: "➕", label: "Add Bag", bg: "#eef2ff", c: "#6366f1" },
              { icon: "📊", label: "Export", bg: "#f0fdf4", c: "#15803d" },
              { icon: "🧮", label: "Cost Calc", bg: "#fff7ed", c: "#c2410c" },
              { icon: "📦", label: "New Order", bg: "#f0f9ff", c: "#0369a1" },
              { icon: "👷", label: "Add Worker", bg: "#fdf4ff", c: "#7e22ce" },
              { icon: "📈", label: "Analytics", bg: "#fff1f2", c: "#be185d" },
            ].map(a => (
              <button key={a.label} style={{ padding: "10px 8px", border: "1.5px solid var(--border)", borderRadius: 10, background: a.bg, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, color: a.c, fontWeight: 600, fontSize: 11, transition: "all .15s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <span style={{ fontSize: 22 }}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column" }}>
          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>🕐 Recent Activity</p>
          <div style={{ maxHeight: 260, overflowY: "auto" }}>            {[
            { icon: "📦", text: "ORD-005 received — Gulf Export Dubai, ₹2,57,940", time: "2m", dot: "#6366f1" },
            { icon: "⚠️", text: "TechShield Backpack critically low — only 6 units left", time: "15m", dot: "#ef4444" },
            { icon: "✅", text: "ORD-003 completed — 500 School Bags dispatched", time: "1h", dot: "#22c55e" },
            { icon: "👷", text: "Priya Sharma marked On Leave for today", time: "2h", dot: "#f59e0b" },
            { icon: "💰", text: "Monthly payroll ₹94,200 processed for 6 workers", time: "3h", dot: "#ec4899" },
            { icon: "🎒", text: "268 bags produced — new Baggly weekly record!", time: "5h", dot: "#0ea5e9" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: i < 5 ? "1px solid var(--border)" : "none" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <span style={{ position: "absolute", bottom: -1, right: -2, width: 7, height: 7, borderRadius: "50%", background: a.dot, border: "1.5px solid var(--card)" }} />
              </div>
              <div>
                <p style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5 }}>{a.text}</p>
                <p style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{a.time} ago</p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
//  INVENTORY PAGE
// ═══════════════════════════════════════════════
