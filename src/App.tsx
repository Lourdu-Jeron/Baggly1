import { useCallback, useEffect, useState } from "react";
import { PAGES } from "./data";
import { injectCSS } from "./injectCSS";
import { Toast } from "./Toast";
import { CommandPalette } from "./CommandPalette";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Dashboard } from "./Dashboard";
import { Inventory } from "./Inventory";
import { Labour } from "./Labour";
import { Orders } from "./Orders";
import { Analytics } from "./Analytics";
import { CostCalc } from "./CostCalc";
import { Sales } from "./Sales";
import { Settings } from "./Settings";

type ToastType = "ok" | "error" | "warn" | "info" | string;
type ToastItem = { id: number; msg: string; type: ToastType };
type PageId = string;

type Profile = {
  name: string;
  role: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  avatar: string | null;
  cover: string | null;
};

type NotificationItem = {
  icon: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  dot: string;
};

export default function App() {
  const [page, setPage] = useState<PageId>("dashboard");
  const [dark, setDark] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [notifOpen, setNotif] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [clock, setClock] = useState(new Date());
  const [profile, setProfile] = useState<Profile>({
    name: "Jeron R.",
    role: "Owner & Founder",
    email: "owner@baggly.in",
    phone: "9876543210",
    city: "Mumbai",
    bio: "Bag manufacturer since 2018. Running Baggly - crafting quality bags for India and beyond.",
    avatar: null,
    cover: null,
  });

  useEffect(() => {
    injectCSS(dark);
  }, [dark]);

  useEffect(() => {
    const id = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        setPage("dashboard");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        setPage("inventory");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "l") {
        e.preventDefault();
        setPage("labour");
      }
    };

    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const addToast = useCallback((msg: string, type: ToastType = "ok") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const NOTIFS: NotificationItem[] = [
    { icon: "⚠️", title: "Low Stock Alert", desc: "Campus Backpack Pro - only 6 pieces left", time: "2m", read: false, dot: "#ef4444" },
    { icon: "📦", title: "New Order Received", desc: "ORD-005 from Dubai Export - Rs.2,39,940", time: "15m", read: false, dot: "#6366f1" },
    { icon: "✅", title: "Order Completed", desc: "ORD-003 Reliance Retail - 500 bags shipped", time: "1h", read: true, dot: "#22c55e" },
    { icon: "👷", title: "Attendance Update", desc: "Priya Sharma marked On Leave for today", time: "2h", read: true, dot: "#f59e0b" },
    { icon: "💰", title: "Payroll Processed", desc: "Rs.77,000 salary processed for 6 workers", time: "3h", read: true, dot: "#ec4899" },
  ];

  const unread = NOTIFS.filter((notification) => !notification.read).length;
  const cur = PAGES.find((item: { id: string }) => item.id === page);

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard dark={dark} />;
      case "inventory":
        return <Inventory addToast={addToast} />;
      case "labour":
        return <Labour addToast={addToast} />;
      case "orders":
        return <Orders addToast={addToast} />;
      case "analytics":
        return <Analytics dark={dark} />;
      case "cost":
        return <CostCalc addToast={addToast} />;
      case "sales":
        return <Sales addToast={addToast} />;
      case "settings":
        return <Settings dark={dark} setDark={setDark} addToast={addToast} profile={profile} setProfile={setProfile} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Inter',sans-serif" }}>
      <Toast toasts={toasts} />
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        setPage={(id: string) => {
          setPage(id);
          addToast(`Navigated to ${PAGES.find((item: { id: string }) => item.id === id)?.label}`, "info");
        }}
        pages={PAGES}
      />
      <Sidebar sidebar={sidebar} page={page} pages={PAGES} setPage={setPage} setCmdOpen={setCmdOpen} dark={dark} setDark={setDark} addToast={addToast} setSidebar={setSidebar} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Topbar cur={cur} setCmdOpen={setCmdOpen} addToast={addToast} notifOpen={notifOpen} setNotif={setNotif} unread={unread} notifs={NOTIFS} dark={dark} setDark={setDark} profile={profile} clock={clock} setPage={setPage} />
        <main style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>{renderPage()}</main>
        <footer style={{ height: 40, background: "var(--card)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>👜</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>Baggly</span>
            </div>
            <span style={{ color: "var(--border)" }}>·</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>Manufacturing Platform v3.0</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>{clock.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {["Ctrl+K Quick Nav", "Export", "Alerts"].map((label) => (
              <span key={label} style={{ fontSize: 11, color: "var(--text3)" }}>{label}</span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
