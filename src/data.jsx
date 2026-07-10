export const PALETTES = [
  {id:"indigo",  name:"Indigo",    primary:"#6366f1",primary2:"#4f46e5",  plight_d:"rgba(99,102,241,.18)",  plight_l:"#eef2ff",  from:"#6366f1",to:"#818cf8",  emoji:"💜"},
  {id:"violet",  name:"Violet",    primary:"#7c3aed",primary2:"#6d28d9",  plight_d:"rgba(124,58,237,.18)",  plight_l:"#f5f3ff",  from:"#7c3aed",to:"#a78bfa",  emoji:"🟣"},
  {id:"rose",    name:"Rose",      primary:"#e11d48",primary2:"#be123c",  plight_d:"rgba(225,29,72,.18)",   plight_l:"#fff1f2",  from:"#e11d48",to:"#fb7185",  emoji:"🌹"},
  {id:"pink",    name:"Pink",      primary:"#db2777",primary2:"#be185d",  plight_d:"rgba(219,39,119,.18)",  plight_l:"#fdf2f8",  from:"#db2777",to:"#f472b6",  emoji:"🌸"},
  {id:"orange",  name:"Sunrise",   primary:"#ea580c",primary2:"#c2410c",  plight_d:"rgba(234,88,12,.18)",   plight_l:"#fff7ed",  from:"#ea580c",to:"#fb923c",  emoji:"🟠"},
  {id:"amber",   name:"Amber",     primary:"#d97706",primary2:"#b45309",  plight_d:"rgba(217,119,6,.18)",   plight_l:"#fffbeb",  from:"#d97706",to:"#fbbf24",  emoji:"🟡"},
  {id:"lime",    name:"Lime",      primary:"#65a30d",primary2:"#4d7c0f",  plight_d:"rgba(101,163,13,.18)",  plight_l:"#f7fee7",  from:"#65a30d",to:"#a3e635",  emoji:"💚"},
  {id:"emerald", name:"Emerald",   primary:"#059669",primary2:"#047857",  plight_d:"rgba(5,150,105,.18)",   plight_l:"#ecfdf5",  from:"#059669",to:"#34d399",  emoji:"🍃"},
  {id:"cyan",    name:"Ocean",     primary:"#0891b2",primary2:"#0e7490",  plight_d:"rgba(8,145,178,.18)",   plight_l:"#ecfeff",  from:"#0891b2",to:"#22d3ee",  emoji:"🩵"},
  {id:"blue",    name:"Sky Blue",  primary:"#2563eb",primary2:"#1d4ed8",  plight_d:"rgba(37,99,235,.18)",   plight_l:"#eff6ff",  from:"#2563eb",to:"#60a5fa",  emoji:"🔵"},
  {id:"slate",   name:"Slate",     primary:"#475569",primary2:"#334155",  plight_d:"rgba(71,85,105,.18)",   plight_l:"#f8fafc",  from:"#475569",to:"#94a3b8",  emoji:"⚫"},
  {id:"teal",    name:"Teal",      primary:"#0d9488",primary2:"#0f766e",  plight_d:"rgba(13,148,136,.18)",  plight_l:"#f0fdfa",  from:"#0d9488",to:"#2dd4bf",  emoji:"🩵"},
];

export const BAGS0 = [
  {id:1,name:"Artisan Leather Tote",cat:"Tote Bags",price:1499,cost:680,pieces:48,min:10,sku:"TT-001",emoji:"👜",color:"#7c3aed",desc:"Hand-stitched full-grain cowhide leather tote with antique brass hardware. Fits A4 documents. Available in Tan, Black & Chocolate Brown.",gst:12,image:null},
  {id:2,name:"TechShield Backpack 40L",cat:"Backpacks",price:2799,cost:1180,pieces:6,min:15,sku:"BP-002",emoji:"🎒",color:"#2563eb",desc:"Military-grade waterproof 1680D nylon with TSA-lock laptop sleeve (fits upto 16\"). Anti-theft hidden pocket, USB charging port, rain cover included.",gst:12,image:null},
  {id:3,name:"Crossway Sling Pro",cat:"Sling Bags",price:899,cost:390,pieces:32,min:10,sku:"SL-003",emoji:"🧳",color:"#059669",desc:"Slim RFID-blocking crossbody with scratch-resistant YKK zippers. 2 main compartments + earphone slot. Ideal for daily commute and travel.",gst:12,image:null},
  {id:4,name:"Prestige Executive Case",cat:"Office Bags",price:4299,cost:1950,pieces:14,min:8,sku:"OB-004",emoji:"💼",color:"#1e293b",desc:"Structured full-grain PU leather briefcase with 3-digit combo lock, felt-lined laptop sleeve, pen organiser, and removable padded shoulder strap.",gst:18,image:null},
  {id:5,name:"TrailBoss Duffel 60L",cat:"Travel Bags",price:2199,cost:950,pieces:0,min:5,sku:"TB-005",emoji:"🚀",color:"#7c3aed",desc:"Heavy-duty waxed canvas duffel with side-entry shoe compartment, steel-frame mouth, and padded trolley pass-through sleeve. Perfect for weekend trips.",gst:12,image:null},
  {id:6,name:"ChampKids School Bag",cat:"School Bags",price:699,cost:295,pieces:75,min:20,sku:"SB-006",emoji:"🎓",color:"#ea580c",desc:"4.5 cm padded ergonomic back panel, reflective strips, built-in rain cover, ventilated air-mesh straps. For age group 6–14. BIS certified.",gst:12,image:null},
  {id:7,name:"Elara Chain Handbag",cat:"Handbags",price:6499,cost:2950,pieces:8,min:5,sku:"HB-007",emoji:"👛",color:"#db2777",desc:"Premium Italian-style genuine leather handbag with 24K gold-plated chain strap, suede lining, magnetic closure and detachable wrist strap.",gst:18,image:null},
  {id:8,name:"EcoFold Canvas Tote",cat:"Eco Bags",price:379,cost:130,pieces:200,min:50,sku:"ET-008",emoji:"🌿",color:"#0891b2",desc:"GOTS-certified 100% organic cotton, folds into its own pocket. Machine washable at 40°C. Printed with water-based inks. 15 kg load capacity.",gst:5,image:null},
];

export const WORKERS0 = [
  {id:1,name:"Rajan Kumar",    role:"Sr. Stitcher",    shift:"08:00",end:"17:00",bags:24,salary:18500,status:"Present",phone:"9876543210",joined:"Jan 2021",perf:[22,24,20,26,24,22,25]},
  {id:2,name:"Meenakshi Devi", role:"Stitcher",        shift:"08:00",end:"17:00",bags:18,salary:14200,status:"Present",phone:"9876543211",joined:"Mar 2022",perf:[16,18,15,19,18,17,18]},
  {id:3,name:"Suresh Babu",    role:"Pattern Cutter",  shift:"09:00",end:"18:00",bags:20,salary:15500,status:"Present",phone:"9876543212",joined:"Jun 2021",perf:[18,20,19,21,20,22,20]},
  {id:4,name:"Priya Sharma",   role:"Edge Finishing",  shift:"08:00",end:"16:00",bags:0, salary:13000,status:"On Leave",phone:"9876543213",joined:"Sep 2022",perf:[14,15,13,16,15,14,0]},
  {id:5,name:"Anbu Selvan",    role:"Sr. Pattern Cutter",shift:"08:00",end:"17:00",bags:22,salary:17200,status:"Present",phone:"9876543214",joined:"Feb 2020",perf:[20,22,21,23,22,24,22]},
  {id:6,name:"Lakshmi Vijay",  role:"QC Inspector",   shift:"09:00",end:"17:00",bags:30,salary:16000,status:"Present",phone:"9876543215",joined:"Apr 2021",perf:[28,30,29,31,30,32,30]},
];

export const ORDERS0 = [
  {id:"ORD-001",client:"Flipkart Wholesale",bag:"Campus Backpack Pro",qty:200,due:"2025-06-05",value:499800,status:"In Progress",priority:"High"},
  {id:"ORD-002",client:"Amazon Seller",     bag:"Classic Leather Tote",qty:150,due:"2025-06-08",value:194850,status:"Pending",priority:"Medium"},
  {id:"ORD-003",client:"Reliance Retail",  bag:"Kids School Bag",    qty:500,due:"2025-05-30",value:324500,status:"Completed",priority:"High"},
  {id:"ORD-004",client:"DMart Stores",     bag:"Weekend Duffel Bag", qty:80, due:"2025-06-15",value:151920,status:"Pending",priority:"Low"},
  {id:"ORD-005",client:"Gulf Export — Dubai",        bag:"Prestige Executive Case",  qty:60, due:"2025-06-20",value:257940,status:"In Progress",priority:"High"},
  {id:"ORD-006",client:"Nykaa Fashion Pvt Ltd",       bag:"Elara Chain Handbag",      qty:40, due:"2025-06-25",value:259960,status:"Pending",priority:"Medium"},
];

export const WEEK_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export const PROD_DATA   = [186,228,201,247,215,268,179];

export const REV_DATA    = [{m:"Jan",v:487000},{m:"Feb",v:392000},{m:"Mar",v:541000},{m:"Apr",v:508000},{m:"May",v:673000},{m:"Jun",v:612000}];

export const CAT_DATA    = [{name:"Backpacks",v:30,c:"#6366f1"},{name:"Tote",v:22,c:"#22c55e"},{name:"School",v:20,c:"#f59e0b"},{name:"Office",v:16,c:"#0ea5e9"},{name:"Others",v:12,c:"#ec4899"}];

export const AI_TIPS = [
  "📈 TechShield Backpack demand is up 38% this week — consider adding a second shift on Tue–Thu.",
  "⚠️ TechShield Backpack Pro has only 6 units left. Restock from Krishna Leather Suppliers within 2 days.",
  "💡 Friday orders spike 26% vs Monday. Prepare extra material on Thursday evening for peak runs.",
  "🌍 Gulf Export orders (Dubai) grew 44% this month — explore Saudi Arabia & Qatar distributors next.",
  "♻️ EcoFold Canvas Tote has 66% gross margin — highest in your catalogue. Scale production to 300 units.",
  "🔔 ORD-003 (Reliance Retail) is due tomorrow. Assign Rajan + Suresh to complete the 500-unit batch.",
];

// ═══════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════

export const INIT_LISTINGS = [
  {id:1,name:"Classic Leather Tote",price:1299,mrp:1599,stock:48,sold:12,cat:"Tote Bags",emoji:"👜",color:"#8b4513",desc:"Premium full-grain leather tote with gold hardware.",image:null,gst:12,badge:"Bestseller"},
  {id:2,name:"Campus Backpack Pro",price:2499,mrp:2999,stock:6,sold:34,cat:"Backpacks",emoji:"🎒",color:"#6366f1",desc:"Waterproof nylon backpack with padded laptop sleeve.",image:null,gst:12,badge:"Low Stock"},
  {id:3,name:"Executive Briefcase",price:3999,mrp:4999,stock:14,sold:8,cat:"Office Bags",emoji:"💼",color:"#374151",desc:"Structured PU briefcase with combo lock.",image:null,gst:18,badge:"Premium"},
  {id:4,name:"Kids School Bag",price:649,mrp:799,stock:75,sold:56,cat:"School Bags",emoji:"🎓",color:"#ea580c",desc:"Lightweight ergonomic bag with reflective strips.",image:null,gst:12,badge:"Top Rated"},
  {id:5,name:"Luxury Handbag",price:5999,mrp:7499,stock:8,sold:3,cat:"Handbags",emoji:"👛",color:"#db2777",desc:"Genuine leather luxury handbag with gold chain strap.",image:null,gst:18,badge:"Luxury"},
  {id:6,name:"Foldable Eco Tote",price:349,mrp:449,stock:200,sold:89,cat:"Eco Bags",emoji:"🌿",color:"#0891b2",desc:"100% organic cotton foldable tote. Machine washable.",image:null,gst:5,badge:"Eco Pick"},
];

export const INIT_SALES = [
  {id:"SL-001",listing:"Classic Leather Tote",qty:5,  price:1299,total:6495, date:"2025-06-01",customer:"Riya S.",channel:"Direct",status:"Delivered"},
  {id:"SL-002",listing:"Campus Backpack Pro", qty:10, price:2499,total:24990,date:"2025-06-02",customer:"Arjun M.",channel:"Online",status:"Delivered"},
  {id:"SL-003",listing:"Kids School Bag",     qty:20, price:649, total:12980,date:"2025-06-03",customer:"Priya K.",channel:"Wholesale",status:"Shipped"},
  {id:"SL-004",listing:"Executive Briefcase", qty:3,  price:3999,total:11997,date:"2025-06-04",customer:"Vikram R.",channel:"Direct",status:"Processing"},
  {id:"SL-005",listing:"Luxury Handbag",      qty:2,  price:5999,total:11998,date:"2025-06-05",customer:"Sneha D.",channel:"Online",status:"Delivered"},
];

export const PAGES = [
  {id:"dashboard", label:"Dashboard",  icon:"📊",desc:"Overview, KPIs, charts & AI insights",      keywords:["home","kpi","charts","overview"]},
  {id:"inventory", label:"Inventory",  icon:"📦",desc:"Manage bags, stock levels & pricing",        keywords:["bags","stock","products","price","add"]},
  {id:"labour",    label:"Labour",     icon:"👷",desc:"Workers, shifts, attendance & payroll",      keywords:["workers","salary","payroll","employees","shift"]},
  {id:"orders",    label:"Orders",     icon:"🛍️",desc:"Track orders & invoice generation",          keywords:["orders","clients","invoice","kanban"]},
  {id:"analytics", label:"Analytics",  icon:"📈",desc:"Revenue charts & performance trends",        keywords:["charts","revenue","trends","heatmap"]},
  {id:"cost",      label:"Cost Calc",  icon:"🧮",desc:"Calculate prices, profit & GST",             keywords:["cost","profit","gst","margin","formula"]},
  {id:"sales",     label:"Sales",      icon:"🏪",desc:"Bag catalogue, cart & sales history",       keywords:["sales","catalogue","cart","listings","revenue","price"]},
  {id:"settings",  label:"Settings",   icon:"⚙️",desc:"Company profile & preferences",             keywords:["settings","profile","theme","dark","shortcuts"]},
];

// ═══════════════════════════════════════════════
//  APP SHELL
// ═══════════════════════════════════════════════
