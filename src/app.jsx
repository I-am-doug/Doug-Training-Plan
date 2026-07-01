import { useState } from "react";

const ORANGE = "#FC4C02";

// ── PLAN DATA ─────────────────────────────────────────────────────────────
const PHASES = [
  { id: "overview", label: "Overview" },
  { id: "p1", label: "Phase 1 · Base" },
  { id: "p2", label: "Phase 2 · Build" },
  { id: "p3", label: "Phase 3 · Peak" },
  { id: "p4", label: "Phase 4 · Taper" },
  { id: "journal", label: "📓 Journal" },
];

const PACE_ZONES = [
  { zone: "EASY / RECOVERY", range: "6:30–7:30", color: "#22c55e", desc: "Mon/Thu/Fri runs. HR under 150 on flat. Conversational." },
  { zone: "FIXED — TUE 10K", range: "5:45–6:15", color: "#eab308", desc: "Fixed Tuesday afternoon. Comfortable but purposeful. Unchanged." },
  { zone: "TEMPO", range: "4:50–5:10", color: "#3b82f6", desc: "Workout sessions. Half marathon effort. Controlled finish." },
  { zone: "LONG RUN", range: "6:45–7:30", color: ORANGE, desc: "All Sunday long runs. Run/walk throughout. Never faster." },
  { zone: "RACE TARGET", range: "7:00–8:00", color: ORANGE, desc: "100 mile pace. Walk all uphills from km 1. Patience wins." },
  { zone: "RUCK MARCH", range: "9:00–11:00", color: "#a855f7", desc: "24kg → 31kg progressive load. No running. SAS standard." },
];

const NUTRITION = [
  { zone: "EVERY 25–30 MIN", val: "Eat something", desc: "Set a watch alert. Hunger = too late. 60–75g carb/hr from 30 min in." },
  { zone: "CARRY IN PACK", val: "Real food", desc: "Medjool dates · rice balls + soy + salt · boiled potatoes + salt · gels as backup." },
  { zone: "AID STATIONS", val: "Banana + Coke", desc: "Banana every station. Flat Coke from station 3 onward. Salty snacks." },
  { zone: "HYDRATION", val: "500–750ml/hr", desc: "Electrolyte tabs from hour 2. Never plain water only past 2 hours." },
  { zone: "PRE HARD SESSION", val: "Add carbs", desc: "Nutragrain + cappuccino + banana or toast with honey. 45 min before." },
  { zone: "PRE EASY SESSION", val: "Current fine", desc: "Nutragrain + cappuccino sufficient for easy runs under 75 min." },
];

const VOL = [
  { wk: "WK 1", km: "Walks only", pct: 10, note: "🦵 Knee recovery" },
  { wk: "WK 2", km: "57 km", pct: 57, note: "" },
  { wk: "WK 3", km: "60 km", pct: 60, note: "" },
  { wk: "WK 4", km: "35 km", pct: 35, note: "↓ Down" },
  { wk: "WK 5", km: "62 km", pct: 62, note: "" },
  { wk: "WK 6", km: "67 km", pct: 67, note: "" },
  { wk: "WK 7", km: "72 km", pct: 72, note: "" },
  { wk: "WK 8", km: "78 km", pct: 78, note: "" },
  { wk: "WK 9", km: "52 km", pct: 52, note: "↓ Down" },
  { wk: "WK 10", km: "82 km", pct: 82, note: "" },
  { wk: "WK 11", km: "85 km", pct: 85, note: "" },
  { wk: "WK 12", km: "92 km", pct: 92, note: "" },
  { wk: "WK 13", km: "100 km", pct: 100, note: "🔥 PEAK" },
  { wk: "WK 14", km: "55 km", pct: 55, note: "↓ Down" },
  { wk: "WK 15", km: "95 km", pct: 95, note: "🔥 PEAK" },
  { wk: "WK 16", km: "60 km", pct: 60, note: "Taper" },
  { wk: "WK 17", km: "40 km", pct: 40, note: "Taper" },
  { wk: "WK 18", km: "20 km", pct: 20, note: "Race week" },
];

const s = (type, text, detail, note) => ({ type, text, detail, note });
const gym = (label = "Gym") => s("gym", `🏋️ ${label}`, "", "");
const easy = (km, pace, detail = "", note = "") => s("easy", `🟢 Easy — ${km}`, detail || `${pace}. Flat to rolling.`, note);
const fixed = (detail = "") => s("fixed", "🟡 Fixed — 10 km steady", detail || "5:45–6:15/km. Unchanged every week.", "");
const ruck = (dur, kg, detail = "") => s("ruck", `🟣 Ruck — ${dur} · ${kg} kg`, detail, "");
const run = (km, pace, detail = "", note = "") => s("easy", `🟢 Run — ${km}`, detail || `${pace}. After ruck.`, note);
const long = (km, detail, note = "") => s("long", `🔴 Long Run — ${km}`, detail, note);
const tempo = (km, detail) => s("tempo", `🔵 ${km}`, detail, "");
const walk = (dur, detail = "") => s("rest", `🚶 Walk — ${dur}`, detail, "");
const rest = (detail = "") => s("rest", "Rest", detail, "");
const race = (text, detail, note = "") => s("race", text, detail, note);

const WEEKS = [
  // ── PHASE 1 ──
  {
    num: "WK 01", title: "Knee Recovery — 29 Jun", km: "Gym + walks", phase: "p1",
    days: [
      { day: "MON", date: "30 Jun", am: gym("Cardio + Athletic Endurance"), pm: walk("30 min", "No running. Knee discomfort post-50K. Flat only.") },
      { day: "TUE", date: "1 Jul", am: gym("Strength + Athletic Endurance"), pm: walk("30 min", "No running. Knee recovery week.") },
      { day: "WED", date: "2 Jul", am: gym("Cardio + Athletic Endurance"), pm: walk("30 min", "No running.") },
      { day: "THU", date: "3 Jul", am: gym("Strength + Athletic Endurance"), pm: rest("Swim fine — zero impact.") },
      { day: "FRI", date: "4 Jul", am: gym("Cardio + Athletic Endurance"), pm: walk("30 min", "Rest if any sharp discomfort.") },
      { day: "SAT", date: "5 Jul", am: walk("45 min · no pack", "No ruck, no run. Keep knees unloaded."), pm: null },
      { day: "SUN", date: "6 Jul", am: walk("60–90 min · no pack", "Time on feet without impact. Flat route. Physio assessment on the 2nd determines when running resumes."), pm: null },
    ]
  },
  {
    num: "WK 02", title: "Aerobic Foundation — 7 Jul", km: "57 km", phase: "p1",
    days: [
      { day: "MON", am: gym("Cardio + Athletic Endurance"), pm: easy("7 km", "6:30–7:15/km", "Physio cleared. First run back — take it easy.") },
      { day: "TUE", am: gym("Strength + Athletic Endurance"), pm: fixed("6:15–6:30/km. Easy end of steady first week back.") },
      { day: "WED", am: gym("Cardio + Athletic Endurance"), pm: easy("8 km", "6:30–7:00/km", "Medium easy. Flat to rolling.") },
      { day: "THU", am: gym("Strength + Athletic Endurance"), pm: rest("Swim or complete rest.") },
      { day: "FRI", am: gym("Cardio + Athletic Endurance"), pm: easy("7 km", "6:30–7:15/km") },
      { day: "SAT", am: ruck("50 min", 24), pm: run("10 km", "6:45–7:15/km", "Walk first 5 min after ruck before running.") },
      { day: "SUN", am: long("22 km", "6:45–7:30/km. Run 25 min / walk 2 min. Eat real food — banana, dates every 30–40 min.", "~2h50m on feet"), pm: null },
    ]
  },
  {
    num: "WK 03", title: "Building Rhythm — 14 Jul", km: "60 km", phase: "p1",
    days: [
      { day: "MON", am: gym(), pm: easy("7 km", "6:30–7:15/km") },
      { day: "TUE", am: gym(), pm: fixed() },
      { day: "WED", am: gym(), pm: easy("10 km", "6:30–7:00/km", "Medium easy. Include some hills.") },
      { day: "THU", am: gym(), pm: easy("6 km", "6:45/km", "Or swim.") },
      { day: "FRI", am: gym(), pm: easy("7 km", "6:30–7:15/km") },
      { day: "SAT", am: ruck("55 min", 26), pm: run("12 km", "6:45–7:15/km", "Hilly. Walk all climbs.") },
      { day: "SUN", am: long("25 km", "6:45–7:30/km. Run 25 min / walk 2 min. Hills mandatory. 60g carb/hr from 45 min in.", "~3h10m on feet"), pm: null },
    ]
  },
  {
    num: "WK 04", title: "First Down Week — 21 Jul", km: "35 km", phase: "p1",
    days: [
      { day: "MON", am: gym(), pm: easy("6 km", "6:45/km") },
      { day: "TUE", am: gym(), pm: fixed("6:00–6:30/km. Easy end of steady.") },
      { day: "WED", am: gym(), pm: easy("8 km", "6:45/km", "Easy down week.") },
      { day: "THU", am: gym(), pm: rest("Complete rest.") },
      { day: "FRI", am: gym(), pm: rest("Rest or short walk.") },
      { day: "SAT", am: ruck("45 min", 24), pm: run("6 km", "6:45/km", "Short and easy. Ruck is enough stimulus.") },
      { day: "SUN", am: long("18 km", "7:00–7:30/km. Easy. Run/walk. Let the body absorb 3 weeks of work.", "~2h20m on feet"), pm: null },
    ]
  },
  {
    num: "WK 05", title: "Back to Business — 28 Jul", km: "62 km", phase: "p1",
    days: [
      { day: "MON", am: gym(), pm: easy("8 km", "6:30–7:15/km") },
      { day: "TUE", am: gym(), pm: fixed() },
      { day: "WED", am: gym(), pm: tempo("Medium Tempo — 12 km total", "2 km warm-up + 8 km at 5:45–6:00/km + 2 km cool-down.") },
      { day: "THU", am: gym(), pm: easy("8 km", "6:30–7:15/km") },
      { day: "FRI", am: gym(), pm: easy("8 km", "6:30–7:15/km") },
      { day: "SAT", am: ruck("60 min", 26), pm: run("14 km", "6:45–7:15/km", "Hilly. Walk all climbs.") },
      { day: "SUN", am: long("28 km", "6:45–7:30/km. Run 30 min / walk 2 min. Race nutrition mandatory. 3h30m+ on feet.", "~3h30m · Key session"), pm: null },
    ]
  },
  // ── PHASE 2 ──
  {
    num: "WK 06", title: "Into Build — 3 Aug", km: "67 km", phase: "p2",
    days: [
      { day: "MON", am: gym(), pm: easy("9 km", "6:30–7:15/km") },
      { day: "TUE", am: gym(), pm: fixed() },
      { day: "WED", am: gym(), pm: easy("12 km", "6:30–7:00/km", "Medium easy. Aerobic volume. Hills if possible.") },
      { day: "THU", am: gym(), pm: easy("9 km", "6:30–7:15/km") },
      { day: "FRI", am: gym(), pm: easy("8 km", "6:30–7:15/km") },
      { day: "SAT", am: ruck("60 min", 27), pm: run("15 km", "6:45–7:15/km", "Hilly. Walk all climbs.") },
      { day: "SUN", am: long("32 km", "6:45–7:30/km. Run/walk. Full nutrition protocol. 4h+ on feet."), pm: null },
    ]
  },
  {
    num: "WK 07", title: "Sustained Load — 10 Aug", km: "72 km", phase: "p2",
    days: [
      { day: "MON", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "TUE", am: gym(), pm: fixed() },
      { day: "WED", am: gym(), pm: tempo("Tempo — 13 km total", "2 km warm-up + 9 km at 5:45–6:00/km + 2 km cool-down.") },
      { day: "THU", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "FRI", am: gym(), pm: easy("8 km", "6:30–7:15/km") },
      { day: "SAT", am: ruck("60 min", 27), pm: run("16 km", "6:45–7:15/km", "Practice walking uphills fast — this is a race skill.") },
      { day: "SUN", am: long("35 km", "6:45–7:30/km. Back-to-back with yesterday — fatigue is intentional. Eat early and often. 4h30m+ on feet.", "First true back-to-back load week"), pm: null },
    ]
  },
  {
    num: "WK 08", title: "Biggest Build Week — 17 Aug", km: "78 km", phase: "p2",
    days: [
      { day: "MON", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "TUE", am: gym(), pm: tempo("Workout — 10 km total", "2 km warm-up + 3×2 km at 4:50/km with 90s jog recovery + 2 km cool-down.") },
      { day: "WED", am: gym(), pm: easy("12 km", "6:30–7:00/km", "Volume day between two hard sessions.") },
      { day: "THU", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "FRI", am: gym(), pm: easy("8 km", "6:30–7:15/km") },
      { day: "SAT", am: ruck("60 min", 28), pm: run("18 km", "6:45–7:15/km", "Hilly.") },
      { day: "SUN", am: long("38 km", "First race simulation long run. Start at 7:30/km. Don't pick up until km 30. Full nutrition. ~5h on feet.", "Eat real food from km 10. Practise patience."), pm: null },
    ]
  },
  {
    num: "WK 09", title: "Down Week — 24 Aug", km: "52 km", phase: "p2",
    days: [
      { day: "MON", am: gym(), pm: easy("6 km", "6:45/km", "Down week — capped at 6km.") },
      { day: "TUE", am: gym(), pm: fixed("6:15–6:30/km. Easy this week.") },
      { day: "WED", am: gym(), pm: easy("8 km", "6:45/km", "Easy down week.") },
      { day: "THU", am: gym(), pm: rest("Complete rest.") },
      { day: "FRI", am: gym(), pm: easy("6 km", "6:45/km") },
      { day: "SAT", am: ruck("45 min", 25), pm: run("10 km", "6:45/km", "Short and easy.") },
      { day: "SUN", am: long("22 km", "No pressure. Run/walk. Let the body absorb 8 weeks of work."), pm: null },
    ]
  },
  {
    num: "WK 10", title: "Back Up Hard — 31 Aug", km: "82 km", phase: "p2",
    days: [
      { day: "MON", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "TUE", am: gym(), pm: fixed() },
      { day: "WED", am: gym(), pm: s("long", "🔴 Medium Long — 15 km", "6:30–7:00/km. Hilly. Mid-week aerobic stimulus.", "") },
      { day: "THU", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "FRI", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "SAT", am: ruck("60 min", 29), pm: run("18 km", "6:45–7:15/km", "Hilly.") },
      { day: "SUN", am: long("40 km", "First 40km long run. 7:00–7:30/km. Walk every uphill and every 25 min on flat. 60–80g carb/hr. ~5h15m on feet.", "Milestone session"), pm: null },
    ]
  },
  {
    num: "WK 11", title: "Consolidation — 7 Sep", km: "85 km", phase: "p2",
    days: [
      { day: "MON", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "TUE", am: gym(), pm: tempo("Workout — 10 km total", "2 km warm-up + 4×1.5 km at 4:55/km with 90s jog + 2 km cool-down.") },
      { day: "WED", am: gym(), pm: tempo("Workout — 13 km total", "2 km warm-up + 3×3 km at 5:50/km with 90s jog + 2 km cool-down.") },
      { day: "THU", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "FRI", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "SAT", am: ruck("60 min", 29), pm: run("18 km", "6:45–7:15/km", "Hilly.") },
      { day: "SUN", am: long("38 km", "Consolidation. Focus on the last 10km — don't stop, keep eating. ~5h on feet."), pm: null },
    ]
  },
  // ── PHASE 3 ──
  {
    num: "WK 12", title: "Peak Entry — 14 Sep", km: "92 km", phase: "p3",
    days: [
      { day: "MON", am: gym(), pm: easy("11 km", "6:30–7:15/km") },
      { day: "TUE", am: gym(), pm: fixed() },
      { day: "WED", am: gym(), pm: s("long", "🔴 Medium Long — 16 km", "6:30–7:00/km. Hilly. Mid-week long run builds aerobic ceiling.", "") },
      { day: "THU", am: gym(), pm: easy("11 km", "6:30–7:15/km") },
      { day: "FRI", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "SAT", am: ruck("60 min", 30), pm: run("20 km", "6:45–7:15/km", "Hilly. This is a serious long run before tomorrow.") },
      { day: "SUN", am: long("42 km", "Full race simulation. 7:00–8:00/km. Walk breaks on all climbs and every 25 min. 5h30m+ on feet. The last 10km will be hard — that's the training."), pm: null },
    ]
  },
  {
    num: "WK 13", title: "100km Week — 21 Sep", km: "100 km 🔥", phase: "p3",
    days: [
      { day: "MON", am: gym(), pm: easy("12 km", "6:30–7:15/km", "Genuine easy effort. HR under 145 on flat.") },
      { day: "TUE", am: gym(), pm: tempo("Workout — 11 km total", "2 km warm-up + 5×1 km at 4:40–4:45/km with 60s rest + 4 km cool-down.") },
      { day: "WED", am: gym(), pm: easy("10 km", "6:45–7:15/km", "100km week — Wednesday must be genuinely easy. HR under 145.") },
      { day: "THU", am: gym(), pm: easy("12 km", "6:30–7:15/km") },
      { day: "FRI", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "SAT", am: ruck("60 min", 30), pm: run("20 km", "6:45–7:15/km", "Walk every climb. Running on a week of high volume — the fatigue is the adaptation.") },
      { day: "SUN", am: long("50 km", "Peak long run. 7:00–8:00/km. Walk from km 1. Full nutrition every 30 min. Finish controlled — not destroyed. If you finish this well, you finish the 100.", "~6h30m on feet · Milestone. Eat real food from km 10."), pm: null },
    ]
  },
  {
    num: "WK 14", title: "Down Week — 28 Sep", km: "55 km", phase: "p3",
    days: [
      { day: "MON", am: gym(), pm: easy("7 km", "6:45/km", "Down week — 7km only.") },
      { day: "TUE", am: gym(), pm: fixed("6:00–6:15/km. Controlled, not racing.") },
      { day: "WED", am: gym(), pm: easy("8 km", "6:45/km", "Easy. No intensity.") },
      { day: "THU", am: gym(), pm: rest("Complete rest.") },
      { day: "FRI", am: gym(), pm: easy("7 km", "6:45/km") },
      { day: "SAT", am: ruck("45 min", 25), pm: run("10 km", "6:45/km", "Short and easy.") },
      { day: "SUN", am: long("22 km", "Recovery with movement. Run/walk. Body absorbs the 100km week."), pm: null },
    ]
  },
  {
    num: "WK 15", title: "Final Peak — 5 Oct", km: "95 km 🔥", phase: "p3",
    days: [
      { day: "MON", am: gym(), pm: easy("12 km", "6:30–7:15/km") },
      { day: "TUE", am: gym(), pm: fixed() },
      { day: "WED", am: gym(), pm: tempo("Workout — 12 km total", "2 km warm-up + 4×2 km at 5:45/km with 90s jog + 2 km cool-down. Last quality Wednesday session.") },
      { day: "THU", am: gym(), pm: easy("12 km", "6:30–7:15/km") },
      { day: "FRI", am: gym(), pm: easy("10 km", "6:30–7:15/km") },
      { day: "SAT", am: ruck("60 min", 31), pm: run("20 km", "6:45–7:15/km", "Hilly.") },
      { day: "SUN", am: long("38 km", "Last big long run. Confidence run — you know how to do this now. Relaxed, controlled, fuelled. Finish strong.", "~5h on feet · Last major session before taper"), pm: null },
    ]
  },
  // ── PHASE 4 ──
  {
    num: "WK 16", title: "Taper Begins — 12 Oct", km: "60 km", phase: "p4",
    days: [
      { day: "MON", am: gym(), pm: easy("8 km", "6:30–7:15/km") },
      { day: "TUE", am: gym(), pm: tempo("Short Tempo — 8 km total", "2 km warm-up + 3×1 km at 4:45/km + 3 km easy. Keep the legs sharp.") },
      { day: "WED", am: gym(), pm: easy("10 km", "6:45–7:15/km", "Taper — easy effort only.") },
      { day: "THU", am: gym(), pm: easy("6 km", "6:45/km") },
      { day: "FRI", am: gym(), pm: easy("6 km", "6:45/km") },
      { day: "SAT", am: ruck("45 min", 27), pm: run("10 km", "6:45/km", "Easy.") },
      { day: "SUN", am: long("28 km", "7:00–7:30/km. Comfortable run/walk. Last long effort. Enjoy it."), pm: null },
    ]
  },
  {
    num: "WK 17", title: "Sharpening — 19 Oct", km: "40 km", phase: "p4",
    days: [
      { day: "MON", am: gym(), pm: easy("6 km", "6:45/km") },
      { day: "TUE", am: gym(), pm: tempo("Strides — 6 km", "Easy jog with 6×20s strides. Not a workout — just keeping legs sharp.") },
      { day: "WED", am: gym(), pm: easy("6 km", "7:00/km", "Very easy.") },
      { day: "THU", am: gym(), pm: rest("Complete rest.") },
      { day: "FRI", am: gym(), pm: easy("5 km", "6:45/km") },
      { day: "SAT", am: ruck("30 min", 20, "Reduced load."), pm: run("6 km", "6:45/km", "Easy jog.") },
      { day: "SUN", am: long("18 km", "Easy. Last real run before race week. Note how good the legs feel."), pm: null },
    ]
  },
  {
    num: "WK 18", title: "Race Week — 2 Nov", km: "~20 km + race", phase: "p4",
    days: [
      { day: "MON", am: gym("Gym — light"), pm: walk("5 km shakeout easy") },
      { day: "TUE", am: gym("Gym — light"), pm: s("easy", "🟢 Easy — 5 km + 4×30s strides", "", "") },
      { day: "WED", am: gym("Gym — light"), pm: s("easy", "🟢 Shakeout — 5 km only", "5km easy only this week — race week, no intensity.", "") },
      { day: "THU", am: rest("Complete rest · eat well · sleep early"), pm: null },
      { day: "FRI", date: "", am: s("easy", "🟢 Shakeout — 3 km + 4 strides", "Just to move the legs. Nothing more.", ""), pm: null },
      { day: "SAT", am: rest("Rest · gear check · early dinner · early bed. No ruck. No run. Save every joule."), pm: null },
      { day: "SUN", date: "7 Nov", am: race("🏆 RACE DAY — 100 MILES", "Start at 7:00–8:00/km. Walk every uphill from km 1. Eat every 30 min. Never think about the finish — only the next aid station.\n\nYou've done the work. Go run 100 miles."), pm: null },
    ]
  },
];

const TYPE_STYLES = {
  gym:   { bg: "rgba(255,255,255,0.04)", color: "#666", border: "1px solid #222" },
  easy:  { bg: "rgba(34,197,94,0.1)",   color: "#22c55e", border: "none" },
  fixed: { bg: "rgba(234,179,8,0.1)",   color: "#eab308", border: "none" },
  tempo: { bg: "rgba(59,130,246,0.1)",  color: "#3b82f6", border: "none" },
  long:  { bg: "rgba(252,76,2,0.12)",   color: ORANGE,    border: "none" },
  ruck:  { bg: "rgba(168,85,247,0.1)",  color: "#a855f7", border: "none" },
  rest:  { bg: "transparent",           color: "#555",    border: "1px dashed #2a2a2a" },
  race:  { bg: "rgba(252,76,2,0.2)",    color: ORANGE,    border: `1px solid ${ORANGE}` },
};

// ── COMPONENTS ────────────────────────────────────────────────────────────
function SessionBlock({ session }) {
  if (!session) return null;
  const st = TYPE_STYLES[session.type] || TYPE_STYLES.rest;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{
        display: "inline-block", padding: "3px 10px", borderRadius: 3,
        fontSize: 12, fontWeight: 600, marginBottom: 3,
        background: st.bg, color: st.color, border: st.border,
      }}>{session.text}</div>
      {session.detail && <div style={{ fontSize: 11, color: "#666", lineHeight: 1.5, whiteSpace: "pre-line" }}>{session.detail}</div>}
      {session.note && <div style={{ fontSize: 10, color: "#444", fontStyle: "italic", marginTop: 2 }}>{session.note}</div>}
    </div>
  );
}

function WeekCard({ week }) {
  const [open, setOpen] = useState(false);
  const isPeak = week.km.includes("🔥");
  return (
    <div style={{ marginBottom: 10, borderRadius: 6, overflow: "hidden", border: "1px solid #1e1e1e" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px", background: "#131313", cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: 10, color: ORANGE, minWidth: 48 }}>{week.num}</span>
        <span style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>{week.title}</span>
        {isPeak && <span style={{ background: "rgba(252,76,2,0.15)", color: ORANGE, fontSize: 9, padding: "2px 6px", borderRadius: 2, fontFamily: "monospace" }}>PEAK</span>}
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#555", marginRight: 8 }}>{week.km}</span>
        <span style={{ color: "#444", fontSize: 10, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </div>
      {open && (
        <div style={{ background: "#0f0f0f" }}>
          {week.days.map((d, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "72px 1fr",
              borderTop: "1px solid #1a1a1a",
            }}>
              <div style={{
                padding: "10px 10px", background: "#131313",
                borderRight: "1px solid #1a1a1a",
                fontFamily: "monospace", fontSize: 10, color: "#555",
              }}>
                <div style={{ color: "#ccc", fontWeight: 600, fontSize: 11 }}>{d.day}</div>
                {d.date && <div style={{ marginTop: 2 }}>{d.date}</div>}
              </div>
              <div style={{ padding: "10px 12px", background: "#111" }}>
                {d.am && (
                  <div style={{ marginBottom: d.pm ? 8 : 0 }}>
                    <div style={{ fontSize: 9, fontFamily: "monospace", color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Morning</div>
                    <SessionBlock session={d.am} />
                  </div>
                )}
                {d.pm && (
                  <div>
                    <div style={{ fontSize: 9, fontFamily: "monospace", color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Afternoon</div>
                    <SessionBlock session={d.pm} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Overview() {
  const raceDate = new Date("2026-11-07");
  const days = Math.ceil((raceDate - new Date()) / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  return (
    <div>
      {/* Countdown */}
      <div style={{ background: "#131313", border: "1px solid #1e1e1e", borderRadius: 8, padding: "18px 20px", marginBottom: 20, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ textAlign: "center", minWidth: 60 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: ORANGE, fontFamily: "monospace" }}>{weeks}</div>
          <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Weeks</div>
        </div>
        <div style={{ color: "#222", fontSize: 24 }}>·</div>
        <div style={{ textAlign: "center", minWidth: 60 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: ORANGE, fontFamily: "monospace" }}>{days}</div>
          <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Days</div>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Building to 100km/week → 100 Miles</div>
          <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>Peak weeks hit 95–100km via longer Mon/Thu/Fri afternoon runs. Engine is proven — this plan builds the durability to go twice as far.</div>
        </div>
      </div>

      {/* Volume bars */}
      <div style={{ fontSize: 11, fontFamily: "monospace", color: ORANGE, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Volume Progression</div>
      <div style={{ background: "#131313", border: "1px solid #1e1e1e", borderRadius: 8, padding: "18px 20px", marginBottom: 20 }}>
        {VOL.map((v, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: "#555", width: 52 }}>{v.wk}</div>
            <div style={{ flex: 1, height: 5, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${v.pct}%`, height: "100%", background: v.note.includes("🔥") ? ORANGE : v.note.includes("↓") ? "#3b82f6" : v.note.includes("🦵") ? "#a855f7" : "#FC4C0266", borderRadius: 3 }} />
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: "#555", width: 70, textAlign: "right" }}>{v.km}</div>
            {v.note && <div style={{ fontFamily: "monospace", fontSize: 9, color: v.note.includes("🔥") ? ORANGE : "#444", minWidth: 80 }}>{v.note}</div>}
          </div>
        ))}
      </div>

      {/* Pace zones */}
      <div style={{ fontSize: 11, fontFamily: "monospace", color: ORANGE, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Pace Zones</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginBottom: 20 }}>
        {PACE_ZONES.map((z, i) => (
          <div key={i} style={{ background: "#131313", border: "1px solid #1e1e1e", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: "#555", marginBottom: 3, letterSpacing: "0.08em" }}>{z.zone}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: z.color }}>{z.range}</div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 4, lineHeight: 1.5 }}>{z.desc}</div>
          </div>
        ))}
      </div>

      {/* Nutrition */}
      <div style={{ fontSize: 11, fontFamily: "monospace", color: ORANGE, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Race Nutrition Protocol</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
        {NUTRITION.map((n, i) => (
          <div key={i} style={{ background: "#131313", border: "1px solid #1e1e1e", borderRadius: 6, padding: "12px 14px" }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", color: "#555", marginBottom: 3, letterSpacing: "0.08em" }}>{n.zone}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#ccc" }}>{n.val}</div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 4, lineHeight: 1.5 }}>{n.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEEL_OPTIONS = [
  { val: "great", label: "💪 Great", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  { val: "good",  label: "😊 Good",  color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  { val: "ok",    label: "😐 OK",    color: "#eab308", bg: "rgba(234,179,8,0.1)" },
  { val: "bad",   label: "😓 Bad",   color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  { val: "terrible", label: "💀 Terrible", color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
];

function Journal() {
  const [entries, setEntries] = useState([]);
  const [feel, setFeel] = useState("");
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "", distance: "", duration: "", pace: "", hr: "", nutrition: "", notes: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.date || !form.type) return;
    setEntries(e => [{ id: Date.now(), ...form, feel }, ...e]);
    setForm({ date: new Date().toISOString().split("T")[0], type: "", distance: "", duration: "", pace: "", hr: "", nutrition: "", notes: "" });
    setFeel("");
  };

  const del = (id) => setEntries(e => e.filter(x => x.id !== id));

  const totalKm = entries.reduce((s, e) => s + (parseFloat(e.distance) || 0), 0);
  const feltEntries = entries.filter(e => e.feel);
  const feelScores = { great: 5, good: 4, ok: 3, bad: 2, terrible: 1 };
  const avgFeel = feltEntries.length ? Math.round(feltEntries.reduce((s, e) => s + feelScores[e.feel], 0) / feltEntries.length) : null;
  const feelEmoji = { 5: "💪", 4: "😊", 3: "😐", 2: "😓", 1: "💀" };

  const inp = { background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 4, color: "#ccc", fontSize: 13, padding: "8px 10px", outline: "none", width: "100%", fontFamily: "inherit", boxSizing: "border-box" };
  const lbl = { fontSize: 10, fontFamily: "monospace", color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 4 };

  return (
    <div>
      {/* Stats */}
      {entries.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { num: entries.length, label: "Sessions" },
            { num: totalKm.toFixed(1), label: "km Logged" },
            { num: avgFeel ? feelEmoji[avgFeel] : "—", label: "Avg Feel" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#131313", border: "1px solid #1e1e1e", borderRadius: 6, padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: ORANGE }}>{s.num}</div>
              <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <div style={{ background: "#131313", border: "1px solid #1e1e1e", borderRadius: 8, padding: "18px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontFamily: "monospace", color: ORANGE, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Log a Session</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div><label style={lbl}>Date</label><input type="date" style={inp} value={form.date} onChange={e => set("date", e.target.value)} /></div>
          <div>
            <label style={lbl}>Session Type</label>
            <select style={inp} value={form.type} onChange={e => set("type", e.target.value)}>
              <option value="">Select...</option>
              {["Easy Run","Tempo Run","Long Run","Ruck","Ruck + Run","Gym","Walk","Swim","Race","Rest"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div><label style={lbl}>Distance (km)</label><input type="number" step="0.1" style={inp} value={form.distance} onChange={e => set("distance", e.target.value)} placeholder="0.0" /></div>
          <div><label style={lbl}>Duration</label><input type="text" style={inp} value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="e.g. 45m" /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div><label style={lbl}>Avg Pace (/km)</label><input type="text" style={inp} value={form.pace} onChange={e => set("pace", e.target.value)} placeholder="e.g. 6:30" /></div>
          <div><label style={lbl}>Avg HR (bpm)</label><input type="number" style={inp} value={form.hr} onChange={e => set("hr", e.target.value)} placeholder="0" /></div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>How did you feel?</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {FEEL_OPTIONS.map(f => (
              <button key={f.val} onClick={() => setFeel(v => v === f.val ? "" : f.val)} style={{
                background: feel === f.val ? f.bg : "transparent",
                border: `1px solid ${feel === f.val ? f.color : "#1e1e1e"}`,
                borderRadius: 4, color: feel === f.val ? f.color : "#555",
                fontSize: 11, padding: "5px 10px", cursor: "pointer", fontFamily: "inherit",
              }}>{f.label}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>What did you eat? (pre / during / post)</label>
          <textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={form.nutrition} onChange={e => set("nutrition", e.target.value)} placeholder="e.g. Pre: toast + cappuccino. During: dates every 30 min. Post: eggs + sourdough" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Notes (soreness, conditions, observations)</label>
          <textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="e.g. Knees feeling better. Hot morning. Legs loosened up after 3km." />
        </div>
        <button onClick={save} style={{
          background: ORANGE, border: "none", borderRadius: 6, color: "#fff",
          fontSize: 13, fontWeight: 700, padding: "10px 20px", cursor: "pointer", width: "100%",
        }}>Save Session</button>
      </div>

      {/* Entries */}
      <div style={{ fontSize: 11, fontFamily: "monospace", color: ORANGE, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Session Log</div>
      {entries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#444" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>📓</div>
          <div style={{ fontSize: 13 }}>No sessions logged yet. Log your first session above.</div>
        </div>
      ) : entries.map(e => {
        const fo = FEEL_OPTIONS.find(f => f.val === e.feel);
        return (
          <div key={e.id} style={{ background: "#131313", border: "1px solid #1e1e1e", borderRadius: 8, marginBottom: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #1a1a1a", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: ORANGE }}>{new Date(e.date + "T12:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginTop: 2 }}>{e.type}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {fo && <span style={{ background: fo.bg, color: fo.color, fontSize: 10, padding: "3px 8px", borderRadius: 3, fontFamily: "monospace" }}>{fo.label}</span>}
                <button onClick={() => del(e.id)} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: 14, padding: "2px 6px" }}>✕</button>
              </div>
            </div>
            <div style={{ padding: "10px 14px" }}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                {e.distance && <div style={{ fontSize: 12, color: "#666" }}>Distance <strong style={{ color: "#ccc" }}>{e.distance} km</strong></div>}
                {e.duration && <div style={{ fontSize: 12, color: "#666" }}>Time <strong style={{ color: "#ccc" }}>{e.duration}</strong></div>}
                {e.pace && <div style={{ fontSize: 12, color: "#666" }}>Pace <strong style={{ color: "#ccc" }}>{e.pace}/km</strong></div>}
                {e.hr && <div style={{ fontSize: 12, color: "#666" }}>HR <strong style={{ color: "#ccc" }}>{e.hr} bpm</strong></div>}
              </div>
              {e.nutrition && <div style={{ fontSize: 12, color: "#555", marginBottom: 6, lineHeight: 1.5 }}><span style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em" }}>Nutrition</span><br />{e.nutrition}</div>}
              {e.notes && <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}><span style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em" }}>Notes</span><br />{e.notes}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("overview");
  const phaseWeeks = WEEKS.filter(w => w.phase === phase);

  const phaseInfo = {
    p1: { name: "Base", weeks: "Weeks 1–5 · 29 Jun – 2 Aug", desc: "Week 1 is knee recovery — gym and walking only until physio on July 2. From Week 2, volume builds from 57 to 62 km/wk. July 19 50km removed. 100 mile on November 7 is the priority." },
    p2: { name: "Build", weeks: "Weeks 6–11 · 3 Aug – 13 Sep", desc: "Volume climbs from 67 to 85 km/wk. Afternoon easy runs extend to 10km. Sunday long runs push toward 40km. Race nutrition mandatory on every run over 90 min. Down week at Week 9." },
    p3: { name: "Peak", weeks: "Weeks 12–15 · 14 Sep – 11 Oct", desc: "Week 13 hits 100km — the target. Mon/Thu/Fri afternoons extend to 12km. Sunday long runs reach 50km. Everything is race simulation. Down week at Week 14, then 95km final peak." },
    p4: { name: "Taper", weeks: "Weeks 16–18 · 12 Oct – 7 Nov", desc: "Volume drops sharply — 60 → 40 → 20 km. A few short sharp sessions keep the legs awake. Taper madness is real — you'll feel slow. Trust the work." },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e8", fontFamily: "'Inter','Helvetica Neue',sans-serif", fontSize: 14, lineHeight: 1.6 }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "22px 20px 16px", position: "sticky", top: 0, background: "#0a0a0a", zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", color: ORANGE, marginBottom: 5 }}>18-Week Build · 100km Peak</div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>Doug's 100 Mile Plan</div>
            <div style={{ color: "#555", fontSize: 12, marginTop: 5 }}>7 November 2026 · Western Australia</div>
          </div>
          <div style={{ background: ORANGE, color: "#fff", fontFamily: "monospace", fontSize: 11, padding: "6px 12px", borderRadius: 4, textAlign: "center", lineHeight: 1.6 }}>RACE DAY<br />7 NOV</div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
          {PHASES.map(p => (
            <button key={p.id} onClick={() => setPhase(p.id)} style={{
              background: phase === p.id ? ORANGE : "transparent",
              border: `1px solid ${phase === p.id ? ORANGE : "#1e1e1e"}`,
              borderRadius: 3, color: phase === p.id ? "#fff" : "#555",
              fontFamily: "monospace", fontSize: 10, padding: "5px 11px",
              cursor: "pointer", whiteSpace: "nowrap", letterSpacing: "0.06em",
              transition: "all 0.15s",
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", padding: "12px 20px", borderBottom: "1px solid #131313", background: "#0d0d0d" }}>
        {[["#22c55e","Easy"],["#3b82f6","Tempo"],["#FC4C02","Long Run"],["#a855f7","Ruck"],["#eab308","Fixed"],["#333","Gym"]].map(([c, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#555" }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c, flexShrink: 0 }} />{l}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 60px" }}>
        {phase === "overview" && <Overview />}
        {phase === "journal" && <Journal />}
        {["p1","p2","p3","p4"].includes(phase) && phaseInfo[phase] && (
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #1a1a1a", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: ORANGE, letterSpacing: "0.12em", textTransform: "uppercase" }}>Phase {phase.slice(1)}</span>
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{phaseInfo[phase].name}</span>
              <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{phaseInfo[phase].weeks}</span>
            </div>
            <p style={{ color: "#555", fontSize: 13, marginBottom: 20, maxWidth: 640, lineHeight: 1.7 }}>{phaseInfo[phase].desc}</p>
            {phaseWeeks.map(w => <WeekCard key={w.num} week={w} />)}
          </div>
        )}
      </div>
    </div>
  );
}
