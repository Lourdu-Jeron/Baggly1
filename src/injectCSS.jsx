import { PALETTES } from "./data";

export const injectCSS = (dark, pal = PALETTES[0]) => {
  const p = pal.primary;
  const p2 = pal.primary2;
  const pl = dark ? pal.plight_d : pal.plight_l;
  const focusRgb = `${parseInt(p.slice(1, 3), 16)},${parseInt(p.slice(3, 5), 16)},${parseInt(p.slice(5, 7), 16)}`;

  let el = document.getElementById("baggly-theme-css");
  if (!el) {
    el = document.createElement("style");
    el.id = "baggly-theme-css";
    document.head.appendChild(el);
  }

  el.textContent = `
    :root {
      --bg: ${dark ? "#0a0f1e" : "#f0f4f8"};
      --card: ${dark ? "#111827" : "#ffffff"};
      --card2: ${dark ? "#1f2937" : "#f8fafc"};
      --card3: ${dark ? "#374151" : "#f1f5f9"};
      --border: ${dark ? "#374151" : "#e2e8f0"};
      --text: ${dark ? "#f1f5f9" : "#0f172a"};
      --text2: ${dark ? "#94a3b8" : "#475569"};
      --text3: ${dark ? "#64748b" : "#94a3b8"};
      --primary: ${p};
      --primary2: ${p2};
      --plight: ${pl};
      --success: #22c55e;
      --warn: #f59e0b;
      --danger: #ef4444;
      --info: #0ea5e9;
    }

    * { box-sizing: border-box; }
    html, body, #root { margin: 0; min-height: 100%; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: Inter, sans-serif;
      transition: background 0.3s ease, color 0.3s ease;
    }

    button, input, select, textarea { font: inherit; }
    button { cursor: pointer; }

    .card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; }
    .card2 { background: var(--card2); border: 1px solid var(--border); border-radius: 10px; }
    .btn { background: var(--primary); color: #fff; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 600; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
    .btn:hover { background: var(--primary2); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(${focusRgb}, 0.35); }
    .btn-sm { padding: 7px 13px; font-size: 12px; border-radius: 8px; }
    .btn-outline { background: transparent; border: 1.5px solid var(--border) !important; color: var(--text2); padding: 8px 14px; border-radius: 10px; font-size: 12px; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; }
    .btn-outline:hover { background: var(--card2); color: var(--text); border-color: var(--primary) !important; }
    .btn-ghost { background: var(--card2); border: 1px solid var(--border) !important; color: var(--text2); width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
    .btn-ghost:hover { background: var(--plight); color: var(--primary); border-color: var(--primary) !important; }
    .btn-red { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca !important; padding: 7px 13px; border-radius: 8px; font-size: 12px; font-weight: 600; }
    .btn-green { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0 !important; padding: 7px 13px; border-radius: 8px; font-size: 12px; font-weight: 600; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: none; background: transparent; color: var(--text2); font-size: 13px; font-weight: 500; border-radius: 10px; width: 100%; text-align: left; white-space: nowrap; overflow: hidden; }
    .nav-item:hover { background: var(--plight); color: var(--primary); }
    .nav-item.on { background: var(--plight); color: var(--primary); font-weight: 700; }
    .tag { display: inline-flex; align-items: center; gap: 3px; padding: 3px 9px; border-radius: 6px; font-size: 10px; font-weight: 700; }
    .trow:hover td { background: var(--card2) !important; }

    input, select, textarea {
      background: var(--card2) !important;
      border: 1.5px solid var(--border) !important;
      color: var(--text) !important;
      border-radius: 9px !important;
      padding: 9px 13px !important;
      width: 100%;
      outline: none;
    }

    input:focus,
    select:focus,
    textarea:focus {
      border-color: var(--primary) !important;
      box-shadow: 0 0 0 3px rgba(${focusRgb}, 0.14) !important;
    }
  `;
};