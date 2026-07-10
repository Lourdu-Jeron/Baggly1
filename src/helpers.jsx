export const fmtN = n => Number(n).toLocaleString("en-IN");

export const fmtC = n => `₹${fmtN(Math.round(n))}`;

export const stockSt = (q,m) => {
  if (q===0)   return {l:"Out of Stock",bg:"#fee2e2",c:"#dc2626",bar:"#dc2626"};
  if (q<m)     return {l:"Low Stock",   bg:"#fef9c3",c:"#d97706",bar:"#f59e0b"};
  if (q<m*2)   return {l:"Adequate",   bg:"#dbeafe",c:"#1d4ed8",bar:"#3b82f6"};
  return              {l:"Healthy",    bg:"#dcfce7",c:"#15803d",bar:"#22c55e"};
};

export const ordSt  = s => ({Completed:{bg:"#dcfce7",c:"#15803d"},"In Progress":{bg:"#dbeafe",c:"#1d4ed8"},Pending:{bg:"#fef9c3",c:"#d97706"}}[s]||{bg:"#f1f5f9",c:"#64748b"});

export const prioSt = p => ({High:{bg:"#fee2e2",c:"#dc2626"},Medium:{bg:"#fef9c3",c:"#d97706"},Low:{bg:"#dcfce7",c:"#15803d"}}[p]||{bg:"#f1f5f9",c:"#64748b"});

export const wkSt   = s => ({Present:{bg:"#dcfce7",c:"#15803d"},"On Leave":{bg:"#fef9c3",c:"#d97706"},Absent:{bg:"#fee2e2",c:"#dc2626"}}[s]||{bg:"#f1f5f9",c:"#64748b"});

export const perf   = b => b>=22?"high":b>=12?"mid":"low";

export const perfC  = l => ({high:"#22c55e",mid:"#f59e0b",low:"#ef4444"}[l]);

export const perfBg = l => ({high:"#dcfce7",mid:"#fef9c3",low:"#fee2e2"}[l]);

export const downloadCSV = (data, name) => {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const rows = [keys.join(","), ...data.map(r=>keys.map(k=>`"${r[k]}"`).join(","))];
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([rows.join("\n")],{type:"text/csv"}));
  a.download = name; a.click();
};

// ═══════════════════════════════════════════════
//  MINI COMPONENTS
// ═══════════════════════════════════════════════
