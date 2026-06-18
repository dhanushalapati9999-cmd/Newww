import { useState, useEffect, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0];

const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

const HABITS = [
  { id: "wake",      group: "MORNING", label: "Woke up — zero snooze" },
  { id: "silence",   group: "MORNING", label: "5 min silence + intention set" },
  { id: "train",     group: "MORNING", label: "Physical training completed" },
  { id: "shower",    group: "MORNING", label: "Cold finish to shower" },
  { id: "vow",       group: "MORNING", label: "Read the vow out loud" },
  { id: "protein",   group: "MORNING", label: "Protein breakfast" },
  { id: "dw1",       group: "DAY",     label: "Deep work block #1 — 90 min" },
  { id: "notes",     group: "DAY",     label: "Class notes reviewed after lecture" },
  { id: "dw2",       group: "DAY",     label: "Deep work block #2 — 90 min" },
  { id: "noscroll",  group: "DAY",     label: "No mindless scrolling" },
  { id: "reading",   group: "NIGHT",   label: "Evening reading — 30 min" },
  { id: "journal",   group: "NIGHT",   label: "Journal completed" },
  { id: "noscreens", group: "NIGHT",   label: "No screens after 10 PM" },
  { id: "sleep",     group: "NIGHT",   label: "In bed by 10 PM" },
];

const BOOKS = [
  { id: "meditations",  cat: "PHILOSOPHY & DISCIPLINE", title: "Meditations", author: "Marcus Aurelius" },
  { id: "mans_search",  cat: "PHILOSOPHY & DISCIPLINE", title: "Man's Search for Meaning", author: "Viktor Frankl" },
  { id: "obstacle",     cat: "PHILOSOPHY & DISCIPLINE", title: "The Obstacle Is the Way", author: "Ryan Holiday" },
  { id: "cant_hurt",    cat: "PHILOSOPHY & DISCIPLINE", title: "Can't Hurt Me", author: "David Goggins" },
  { id: "martian",      cat: "SCIENCE & ISRO PATH",     title: "The Martian", author: "Andy Weir" },
  { id: "astrophysics", cat: "SCIENCE & ISRO PATH",     title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson" },
  { id: "wings_fire",   cat: "SCIENCE & ISRO PATH",     title: "Wings of Fire", author: "A.P.J. Abdul Kalam" },
  { id: "feynman",      cat: "SCIENCE & ISRO PATH",     title: "Feynman Lectures on Physics", author: "Richard Feynman" },
  { id: "thinking",     cat: "PSYCHOLOGY & PEOPLE",     title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
  { id: "48laws",       cat: "PSYCHOLOGY & PEOPLE",     title: "48 Laws of Power", author: "Robert Greene" },
  { id: "carnegie",     cat: "PSYCHOLOGY & PEOPLE",     title: "How to Win Friends & Influence People", author: "Dale Carnegie" },
  { id: "da_vinci",     cat: "BIOGRAPHY",               title: "Leonardo da Vinci", author: "Walter Isaacson" },
  { id: "musk",         cat: "BIOGRAPHY",               title: "Elon Musk", author: "Walter Isaacson" },
  { id: "gandhi",       cat: "BIOGRAPHY",               title: "My Experiments with Truth", author: "Gandhi" },
];

const MILESTONES = [
  { id: "ncc_c",      phase: "NOW", label: "NCC 'C' Certificate obtained" },
  { id: "cgpa",       phase: "NOW", label: "CGPA 8.5+ maintained" },
  { id: "domain",     phase: "NOW", label: "Domain chosen (Propulsion / Avionics / GNC / Structures)" },
  { id: "python",     phase: "NOW", label: "Python proficiency — projects built" },
  { id: "matlab",     phase: "NOW", label: "MATLAB proficiency achieved" },
  { id: "isro_apply", phase: "NOW", label: "First VSSC / ISRO internship application sent" },
  { id: "10km",       phase: "NOW", label: "First 10km run completed" },
  { id: "pullups",    phase: "NOW", label: "20 consecutive pull-ups" },
  { id: "martial_6m", phase: "NOW", label: "6 months consistent martial arts" },
  { id: "paper_read", phase: "NOW", label: "First ISRO research paper read & understood" },
  { id: "gate",       phase: "GRADUATION", label: "GATE exam cleared" },
  { id: "icrb",       phase: "GRADUATION", label: "ISRO ICRB exam attempted" },
  { id: "chandrayaan",phase: "GRADUATION", label: "Chandrayaan mission studied end-to-end" },
  { id: "pslv",       phase: "GRADUATION", label: "PSLV engineering decisions mastered" },
  { id: "intern",     phase: "GRADUATION", label: "First aerospace internship completed" },
  { id: "joining",    phase: "MISSION",    label: "ISRO joining letter received" },
  { id: "mission1",   phase: "MISSION",    label: "Assigned to first mission" },
  { id: "publish",    phase: "MISSION",    label: "First research paper published" },
  { id: "intl",       phase: "MISSION",    label: "First international collaboration" },
];

const QUOTES = [
  { text: "Why do we fall, Bruce? So we can learn to pick ourselves up.", src: "— Thomas Wayne" },
  { text: "It's not who I am underneath, but what I do that defines me.", src: "— Bruce Wayne" },
  { text: "If you make yourself more than just a man, devote yourself to an ideal — you become something else entirely.", src: "— Ra's al Ghul" },
  { text: "The training is nothing. The will is everything. The will to act.", src: "— Ra's al Ghul" },
  { text: "Endure, Master Wayne. Take it. They'll hate you for it, but that's the point of Batman.", src: "— Alfred Pennyworth" },
  { text: "A hero can be anyone. Even a man doing something as simple and reassuring as putting a coat around a young boy's shoulders.", src: "— Bruce Wayne" },
  { text: "Rise.", src: "— The Dark Knight Rises" },
  { text: "The night is darkest just before the dawn. And I promise you, the dawn is coming.", src: "— Commissioner Gordon" },
  { text: "Batman has no limits. Bruce Wayne does.", src: "— Bruce Wayne" },
  { text: "You either die a hero, or live long enough to see yourself become the villain.", src: "— Harvey Dent" },
];

const TRAIN_TYPES = ["Strength", "Run", "Long Run", "Martial Arts", "Yoga / Stretch", "Rest Day"];

const ACCENT = { command: "#C8A951", protocols: "#7A9BB5", training: "#9B6B6B", mission: "#B8942A", intel: "#8B7BAA", notes: "#6B8C7A" };
const TABS = [
  { id: "command",   icon: "◈", label: "COMMAND"  },
  { id: "protocols", icon: "⬡", label: "PROTOCOLS" },
  { id: "training",  icon: "◉", label: "TRAINING"  },
  { id: "mission",   icon: "◎", label: "MISSION"   },
  { id: "intel",     icon: "◆", label: "INTEL"     },
  { id: "notes",     icon: "◐", label: "NOTES"     },
];

// ─── STORAGE ─────────────────────────────────────────────────────────────────

const S = {
  async get(key) {
    try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async set(key, val) {
    try { await window.storage.set(key, JSON.stringify(val)); } catch(e) { console.error(e); }
  }
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function Ring({ pct, color, size = 80 }) {
  const r = (size - 10) / 2, circ = 2 * Math.PI * r, dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#111" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }} />
    </svg>
  );
}

function Tag({ children, color }) {
  return (
    <span style={{ fontFamily: "Courier New", fontSize: 8, letterSpacing: 3,
      color, border: `1px solid ${color}40`, padding: "2px 7px" }}>{children}</span>
  );
}

function Btn({ children, onClick, accent, small, outline }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: outline ? "none" : hov ? accent : `${accent}18`,
        border: `1px solid ${hov || !outline ? accent : "#222"}`,
        color: hov ? "#060607" : accent,
        padding: small ? "6px 14px" : "9px 20px",
        cursor: "pointer", fontFamily: "Courier New",
        fontSize: small ? 9 : 10, letterSpacing: 3,
        transition: "all 0.18s", outline: "none" }}>
      {children}
    </button>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function BatmanTracker() {
  const [tab, setTab] = useState("command");
  const [loaded, setLoaded] = useState(false);
  const [todayHabits, setTodayHabits] = useState({});
  const [training, setTraining] = useState([]);
  const [reading, setReading] = useState({});
  const [missions, setMissions] = useState({});
  const [journals, setJournals] = useState({});
  const [meta, setMeta] = useState({ startDate: TODAY });
  const [quoteIdx] = useState(() => new Date().getDate() % QUOTES.length);
  // training form
  const [tForm, setTForm] = useState({ type: "Strength", duration: "", notes: "" });
  const [tOpen, setTOpen] = useState(false);
  // notes form
  const [notesDate, setNotesDate] = useState(TODAY);

  // ── LOAD ──
  useEffect(() => {
    (async () => {
      const [h, tr, rd, ms, j, m] = await Promise.all([
        S.get(`batman:daily:${TODAY}`),
        S.get("batman:training"),
        S.get("batman:reading"),
        S.get("batman:missions"),
        S.get("batman:journals"),
        S.get("batman:meta"),
      ]);
      if (h) setTodayHabits(h);
      if (tr) setTraining(tr);
      if (rd) setReading(rd);
      if (ms) setMissions(ms);
      if (j) setJournals(j);
      if (m) setMeta(m); else { const nm = { startDate: TODAY }; setMeta(nm); S.set("batman:meta", nm); }
      setLoaded(true);
    })();
  }, []);

  // ── SAVE habits on change ──
  useEffect(() => { if (loaded) S.set(`batman:daily:${TODAY}`, todayHabits); }, [todayHabits, loaded]);
  useEffect(() => { if (loaded) S.set("batman:training", training); }, [training, loaded]);
  useEffect(() => { if (loaded) S.set("batman:reading", reading); }, [reading, loaded]);
  useEffect(() => { if (loaded) S.set("batman:missions", missions); }, [missions, loaded]);
  useEffect(() => { if (loaded) S.set("batman:journals", journals); }, [journals, loaded]);

  // ── COMPUTED ──
  const totalHabits = HABITS.length;
  const doneHabits = HABITS.filter(h => todayHabits[h.id]).length;
  const pct = Math.round((doneHabits / totalHabits) * 100);

  const streak = useCallback(() => {
    let s = 0, d = new Date();
    for (let i = 0; i < 365; i++) {
      const key = d.toISOString().split("T")[0];
      const isToday = key === TODAY;
      // for today, partial counts if at least 1 done
      // for past days, need majority done
      const habits = i === 0 ? todayHabits : null;
      if (i > 0) break; // simplified — just count from what we have loaded
      if (isToday && doneHabits > 0) { s = 1; }
      d.setDate(d.getDate() - 1);
    }
    return s;
  }, [doneHabits, todayHabits]);

  const daysActive = Math.max(1, Math.ceil((new Date(TODAY) - new Date(meta.startDate)) / 86400000) + 1);
  const booksRead = Object.values(reading).filter(v => v === "done").length;
  const milestoneDone = Object.values(missions).filter(Boolean).length;
  const trainCount = training.filter(t => t.date === TODAY).length;
  const accent = ACCENT[tab];
  const noteEntry = journals[notesDate] || { wins: "", improve: "", tomorrow: "", free: "" };

  const toggleHabit = (id) => setTodayHabits(p => ({ ...p, [id]: !p[id] }));
  const toggleBook = (id) => {
    const cur = reading[id];
    const next = !cur ? "reading" : cur === "reading" ? "done" : null;
    setReading(p => { const n = { ...p }; if (next) n[id] = next; else delete n[id]; return n; });
  };
  const toggleMission = (id) => setMissions(p => ({ ...p, [id]: !p[id] }));
  const saveTraining = () => {
    if (!tForm.duration) return;
    const entry = { id: Date.now(), date: TODAY, ...tForm };
    setTraining(p => [entry, ...p]);
    setTForm({ type: "Strength", duration: "", notes: "" });
    setTOpen(false);
  };
  const updateNote = (field, val) => {
    setJournals(p => ({ ...p, [notesDate]: { ...(p[notesDate] || {}), [field]: val } }));
  };

  const groups = ["MORNING", "DAY", "NIGHT"];

  // ── STYLES (brightened for readability) ──
  const C = {
    bg: "#060607", surf: "#0A0A0B", border: "#141418",
    textP: "#F5EFE1",   // bright off-white (was #D4C9B8)
    textS: "#B8B0A0",   // light warm gray (was #6A6456)
    textM: "#8A8278",   // medium gray (was #2C2A26)
  };
  const mono = { fontFamily: "Courier New, monospace" };
  const serif = { fontFamily: "Georgia, Times New Roman, serif" };

  if (!loaded) return (
    <div style={{ height: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...mono, fontSize: 10, letterSpacing: 5, color: C.textM }}>LOADING DOSSIER...</div>
    </div>
  );

  // ── VIEWS ──────────────────────────────────────────────────────────────────

  const Command = () => (
    <div style={{ padding: "24px 20px" }}>
      {/* Date + greeting */}
      <div style={{ ...mono, fontSize: 9, letterSpacing: 4, color: C.textM, marginBottom: 4 }}>{fmt(TODAY).toUpperCase()}</div>
      <h2 style={{ ...serif, fontSize: 24, color: C.textP, margin: "0 0 24px", fontWeight: 400 }}>Command Center</h2>

      {/* Progress ring + stats */}
      <div style={{ background: C.surf, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16,
        borderLeft: `3px solid ${accent}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Ring pct={pct} color={accent} size={88} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center" }}>
              <div style={{ ...mono, fontSize: 18, color: accent, lineHeight: 1 }}>{pct}</div>
              <div style={{ ...mono, fontSize: 7, color: C.textM, letterSpacing: 2 }}>TODAY</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...mono, fontSize: 9, letterSpacing: 3, color: C.textM, marginBottom: 12 }}>TODAY'S PROTOCOLS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "HABITS", val: `${doneHabits}/${totalHabits}`, c: accent },
                { label: "TRAINING", val: trainCount > 0 ? "LOGGED" : "PENDING", c: trainCount > 0 ? ACCENT.training : C.textM },
                { label: "JOURNAL", val: noteEntry.wins ? "DONE" : "PENDING", c: noteEntry.wins ? ACCENT.notes : C.textM },
                { label: "DAY", val: `+${daysActive}`, c: C.textS },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ ...mono, fontSize: 7, letterSpacing: 3, color: C.textM }}>{item.label}</div>
                  <div style={{ ...mono, fontSize: 13, color: item.c, marginTop: 2 }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div style={{ border: `1px solid ${C.border}`, borderLeft: `2px solid ${C.textM}`,
        padding: "16px 18px", marginBottom: 16 }}>
        <div style={{ ...mono, fontSize: 8, letterSpacing: 4, color: C.textM, marginBottom: 8 }}>TODAY'S DIRECTIVE</div>
        <div style={{ ...serif, fontSize: 14, color: C.textS, lineHeight: 1.8, fontStyle: "italic", marginBottom: 6 }}>
          "{QUOTES[quoteIdx].text}"
        </div>
        <div style={{ ...mono, fontSize: 8, color: C.textM, letterSpacing: 2 }}>{QUOTES[quoteIdx].src}</div>
      </div>

      {/* Overall stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { label: "BOOKS READ", val: booksRead, total: BOOKS.length, color: ACCENT.intel },
          { label: "MILESTONES", val: milestoneDone, total: MILESTONES.length, color: ACCENT.mission },
          { label: "SESSIONS", val: training.length, total: "total", color: ACCENT.training },
        ].map(s => (
          <div key={s.label} style={{ background: C.surf, border: `1px solid ${C.border}`, padding: "14px 12px", textAlign: "center" }}>
            <div style={{ ...mono, fontSize: 20, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ ...mono, fontSize: 6, letterSpacing: 2, color: C.textM, marginTop: 4 }}>
              {s.label}{typeof s.total === "number" ? ` / ${s.total}` : ""}
            </div>
          </div>
        ))}
      </div>

      {/* The code */}
      <div style={{ border: `1px solid ${C.border}`, padding: "16px 18px" }}>
        <div style={{ ...mono, fontSize: 8, letterSpacing: 4, color: C.textM, marginBottom: 12 }}>THE CODE — READ DAILY</div>
        {["Keep your word. Always.",
          "Do not complain. Solve, or accept.",
          "Treat every person with dignity.",
          "Act with integrity when no one is watching.",
          "Never sacrifice long-term growth for comfort.",
          "Own failures completely. Extract the lesson.",
          "Remain the same person in triumph and defeat.",
          "Never touch what destroys the mind.",
          "Protect those who cannot protect themselves.",
          "Never stop becoming."
        ].map((rule, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "flex-start" }}>
            <div style={{ ...mono, fontSize: 9, color: C.textM, flexShrink: 0, marginTop: 2 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ ...serif, fontSize: 13, color: C.textS, lineHeight: 1.6 }}>{rule}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const Protocols = () => (
    <div style={{ padding: "24px 20px" }}>
      <div style={{ ...mono, fontSize: 9, letterSpacing: 4, color: C.textM, marginBottom: 4 }}>DAILY DISCIPLINE</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <h2 style={{ ...serif, fontSize: 24, color: C.textP, margin: 0, fontWeight: 400 }}>Daily Protocols</h2>
        <div style={{ ...mono, fontSize: 11, color: accent }}>{doneHabits}/{totalHabits}</div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 2, background: "#111", marginBottom: 28, borderRadius: 1 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: accent, transition: "width 0.4s ease" }} />
      </div>

      {groups.map(g => (
        <div key={g} style={{ marginBottom: 28 }}>
          <div style={{ ...mono, fontSize: 8, letterSpacing: 5, color: accent, marginBottom: 14 }}>{g} PROTOCOL</div>
          {HABITS.filter(h => h.group === g).map(h => {
            const done = !!todayHabits[h.id];
            return (
              <div key={h.id} onClick={() => toggleHabit(h.id)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
                  marginBottom: 4, cursor: "pointer",
                  background: done ? `${accent}08` : "transparent",
                  border: `1px solid ${done ? `${accent}30` : C.border}`,
                  borderLeft: `2px solid ${done ? accent : "transparent"}`,
                  transition: "all 0.2s" }}>
                <div style={{ width: 18, height: 18, border: `1px solid ${done ? accent : "#222"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.2s",
                  background: done ? accent : "none" }}>
                  {done && <span style={{ color: "#060607", fontSize: 10, lineHeight: 1 }}>✓</span>}
                </div>
                <div style={{ ...serif, fontSize: 14, color: done ? C.textS : C.textP,
                  textDecoration: done ? "line-through" : "none",
                  transition: "all 0.2s", lineHeight: 1.4 }}>{h.label}</div>
              </div>
            );
          })}
        </div>
      ))}

      {pct === 100 && (
        <div style={{ textAlign: "center", padding: "20px", border: `1px solid ${accent}40`,
          background: `${accent}06`, marginTop: 8 }}>
          <div style={{ ...mono, fontSize: 9, letterSpacing: 4, color: accent }}>PROTOCOLS COMPLETE</div>
          <div style={{ ...serif, fontSize: 13, color: C.textS, fontStyle: "italic", marginTop: 8 }}>
            "The training is nothing. The will is everything."
          </div>
        </div>
      )}
    </div>
  );

  const Training = () => (
    <div style={{ padding: "24px 20px" }}>
      <div style={{ ...mono, fontSize: 9, letterSpacing: 4, color: C.textM, marginBottom: 4 }}>PHYSICAL DEVELOPMENT</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ ...serif, fontSize: 24, color: C.textP, margin: 0, fontWeight: 400 }}>Training Log</h2>
        <Btn accent={accent} small onClick={() => setTOpen(o => !o)}>{tOpen ? "CANCEL" : "+ LOG SESSION"}</Btn>
      </div>

      {tOpen && (
        <div style={{ border: `1px solid ${accent}40`, padding: "18px", marginBottom: 20,
          borderLeft: `3px solid ${accent}`, background: C.surf }}>
          <div style={{ ...mono, fontSize: 8, letterSpacing: 4, color: accent, marginBottom: 14 }}>NEW SESSION</div>
          {/* Type */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ ...mono, fontSize: 8, color: C.textM, letterSpacing: 3, marginBottom: 8 }}>TYPE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {TRAIN_TYPES.map(t => (
                <button key={t} onClick={() => setTForm(p => ({ ...p, type: t }))}
                  style={{ ...mono, fontSize: 9, letterSpacing: 2, padding: "6px 12px",
                    background: tForm.type === t ? accent : "none",
                    border: `1px solid ${tForm.type === t ? accent : "#1E1E1E"}`,
                    color: tForm.type === t ? "#060607" : C.textM,
                    cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* Duration */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ ...mono, fontSize: 8, color: C.textM, letterSpacing: 3, marginBottom: 6 }}>DURATION (MINUTES)</div>
            <input type="number" value={tForm.duration} onChange={e => setTForm(p => ({ ...p, duration: e.target.value }))}
              placeholder="45"
              style={{ ...mono, width: "100%", background: "#0A0A0C", border: `1px solid #1E1E1E`,
                color: C.textP, padding: "8px 12px", fontSize: 13, outline: "none",
                boxSizing: "border-box" }} />
          </div>
          {/* Notes */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...mono, fontSize: 8, color: C.textM, letterSpacing: 3, marginBottom: 6 }}>NOTES (OPTIONAL)</div>
            <textarea value={tForm.notes} onChange={e => setTForm(p => ({ ...p, notes: e.target.value }))}
              rows={2} placeholder="e.g. 5km in 24:30. Pushed through last km."
              style={{ ...serif, width: "100%", background: "#0A0A0C", border: `1px solid #1E1E1E`,
                color: C.textS, padding: "8px 12px", fontSize: 13, outline: "none", resize: "none",
                boxSizing: "border-box", lineHeight: 1.6 }} />
          </div>
          <Btn accent={accent} onClick={saveTraining}>SAVE SESSION</Btn>
        </div>
      )}

      {/* Fitness targets */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ ...mono, fontSize: 8, letterSpacing: 4, color: C.textM, marginBottom: 12 }}>BATMAN STANDARDS</div>
        {[
          { label: "20 consecutive pull-ups", done: !!missions["pullups"] },
          { label: "5km under 22 minutes", done: false },
          { label: "10km completed", done: !!missions["10km"] },
          { label: "100 push-ups unbroken", done: false },
          { label: "6 months martial arts", done: !!missions["martial_6m"] },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0",
            borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%",
              background: s.done ? accent : "#1A1A1A", flexShrink: 0 }} />
            <div style={{ ...serif, fontSize: 13, color: s.done ? C.textS : C.textP,
              textDecoration: s.done ? "line-through" : "none" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Log history */}
      <div style={{ ...mono, fontSize: 8, letterSpacing: 4, color: C.textM, marginBottom: 12 }}>SESSION HISTORY</div>
      {training.length === 0 && (
        <div style={{ ...serif, fontSize: 13, color: C.textM, fontStyle: "italic", textAlign: "center", padding: "24px 0" }}>
          No sessions logged yet. Begin today.
        </div>
      )}
      {training.slice(0, 20).map(t => (
        <div key={t.id} style={{ padding: "12px 14px", border: `1px solid ${C.border}`,
          marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: t.notes ? 6 : 0 }}>
              <Tag color={accent}>{t.type.toUpperCase()}</Tag>
              <span style={{ ...mono, fontSize: 9, color: C.textM }}>{t.duration} MIN</span>
            </div>
            {t.notes && <div style={{ ...serif, fontSize: 12, color: C.textS, lineHeight: 1.5 }}>{t.notes}</div>}
          </div>
          <div style={{ ...mono, fontSize: 9, color: C.textM, flexShrink: 0, marginLeft: 12 }}>
            {fmt(t.date).toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );

  const Mission = () => {
    const phases = ["NOW", "GRADUATION", "MISSION"];
    const phaseLabels = { NOW: "PHASE I — NOW (Age 19–21)", GRADUATION: "PHASE II — GRADUATION (21–22)", MISSION: "PHASE III — MISSION (22+)" };
    return (
      <div style={{ padding: "24px 20px" }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 4, color: C.textM, marginBottom: 4 }}>ISRO ROADMAP</div>
        <h2 style={{ ...serif, fontSize: 24, color: C.textP, margin: "0 0 8px", fontWeight: 400 }}>The Mission</h2>
        <div style={{ ...serif, fontSize: 13, color: C.textS, fontStyle: "italic", marginBottom: 28, lineHeight: 1.7 }}>
          "{QUOTES[3].text}"<br />
          <span style={{ ...mono, fontSize: 8, color: C.textM, letterSpacing: 2 }}>— Ra's al Ghul</span>
        </div>

        {phases.map(phase => {
          const items = MILESTONES.filter(m => m.phase === phase);
          const done = items.filter(m => missions[m.id]).length;
          return (
            <div key={phase} style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ ...mono, fontSize: 8, letterSpacing: 3, color: accent }}>{phaseLabels[phase]}</div>
                <div style={{ ...mono, fontSize: 9, color: C.textM }}>{done}/{items.length}</div>
              </div>
              <div style={{ height: 1, background: `${accent}30`, marginBottom: 14 }} />
              {items.map(m => {
                const done = !!missions[m.id];
                return (
                  <div key={m.id} onClick={() => toggleMission(m.id)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                      marginBottom: 4, cursor: "pointer",
                      background: done ? `${accent}06` : "transparent",
                      border: `1px solid ${done ? `${accent}20` : C.border}`,
                      transition: "all 0.2s" }}>
                    <div style={{ width: 16, height: 16, border: `1px solid ${done ? accent : "#1E1E1E"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, background: done ? accent : "none" }}>
                      {done && <span style={{ color: "#060607", fontSize: 9 }}>✓</span>}
                    </div>
                    <div style={{ ...serif, fontSize: 13, color: done ? C.textS : C.textP,
                      textDecoration: done ? "line-through" : "none", lineHeight: 1.4 }}>
                      {m.label}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div style={{ border: `1px solid ${C.border}`, padding: "16px 18px", marginTop: 8 }}>
          <div style={{ ...mono, fontSize: 8, letterSpacing: 4, color: C.textM, marginBottom: 10 }}>THE KALAM STANDARD</div>
          <div style={{ ...serif, fontSize: 13, color: C.textS, lineHeight: 1.8, fontStyle: "italic" }}>
            Born in Rameswari, Tamil Nadu. Son of a boat owner. No money. No connections. No path.<br /><br />
            He became the Missile Man of India. Then the President.<br /><br />
            You share his roots. You share his starting point. The path exists.
          </div>
        </div>
      </div>
    );
  };

  const Intel = () => {
    const cats = [...new Set(BOOKS.map(b => b.cat))];
    const booksDone = Object.values(reading).filter(v => v === "done").length;
    const booksReading = Object.values(reading).filter(v => v === "reading").length;
    return (
      <div style={{ padding: "24px 20px" }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 4, color: C.textM, marginBottom: 4 }}>INTELLIGENCE FILES</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <h2 style={{ ...serif, fontSize: 24, color: C.textP, margin: 0, fontWeight: 400 }}>Reading Intel</h2>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <div style={{ ...mono, fontSize: 9, color: ACCENT.intel }}>{booksRead} COMPLETED</div>
          <div style={{ ...mono, fontSize: 9, color: C.textS }}>{booksReading} IN PROGRESS</div>
          <div style={{ ...mono, fontSize: 9, color: C.textM }}>{BOOKS.length - booksRead - booksReading} TO READ</div>
        </div>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 3, color: C.textM, marginBottom: 10 }}>TAP: TO READ → READING → DONE</div>

        {cats.map(cat => (
          <div key={cat} style={{ marginBottom: 24 }}>
            <div style={{ ...mono, fontSize: 8, letterSpacing: 4, color: accent, marginBottom: 12 }}>{cat}</div>
            {BOOKS.filter(b => b.cat === cat).map(book => {
              const status = reading[book.id];
              const colors = { reading: ACCENT.training, done: ACCENT.notes };
              const labels = { reading: "READING", done: "COMPLETE" };
              return (
                <div key={book.id} onClick={() => toggleBook(book.id)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 14px", marginBottom: 4, cursor: "pointer",
                    border: `1px solid ${status ? `${colors[status]}30` : C.border}`,
                    background: status === "done" ? `${ACCENT.notes}06` : "transparent",
                    transition: "all 0.2s" }}>
                  <div>
                    <div style={{ ...serif, fontSize: 14, color: status === "done" ? C.textS : C.textP,
                      textDecoration: status === "done" ? "line-through" : "none", marginBottom: 2 }}>
                      {book.title}
                    </div>
                    <div style={{ ...mono, fontSize: 9, color: C.textM, letterSpacing: 1 }}>{book.author}</div>
                  </div>
                  {status && <Tag color={colors[status]}>{labels[status]}</Tag>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const Notes = () => {
    const entry = journals[notesDate] || {};
    const fields = [
      { key: "wins", label: "WHAT DID I DO WELL TODAY?", placeholder: "Three things you executed with discipline..." },
      { key: "improve", label: "WHAT MUST I IMPROVE?", placeholder: "One honest, specific answer..." },
      { key: "tomorrow", label: "TOMORROW'S SINGLE MOST IMPORTANT ACTION", placeholder: "One thing. Not three." },
      { key: "free", label: "FIELD NOTES", placeholder: "Anything else. Thoughts, observations, decisions..." },
    ];
    const pastEntries = Object.keys(journals).filter(d => d !== TODAY && journals[d]?.wins).sort().reverse().slice(0, 5);

    return (
      <div style={{ padding: "24px 20px" }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 4, color: C.textM, marginBottom: 4 }}>DAILY REFLECTION</div>
        <h2 style={{ ...serif, fontSize: 24, color: C.textP, margin: "0 0 20px", fontWeight: 400 }}>Field Notes</h2>

        {/* Date selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
          <Btn accent={accent} small outline={notesDate !== TODAY} onClick={() => setNotesDate(TODAY)}>TODAY</Btn>
          {pastEntries.map(d => (
            <Btn key={d} accent={C.textM} small outline={notesDate !== d} onClick={() => setNotesDate(d)}>
              {new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }).toUpperCase()}
            </Btn>
          ))}
        </div>

        {fields.map(f => (
          <div key={f.key} style={{ marginBottom: 18 }}>
            <div style={{ ...mono, fontSize: 8, letterSpacing: 3, color: notesDate === TODAY ? accent : C.textM,
              marginBottom: 8 }}>{f.label}</div>
            <textarea value={entry[f.key] || ""} onChange={e => { if (notesDate === TODAY) updateNote(f.key, e.target.value); }}
              rows={f.key === "free" ? 4 : 2} placeholder={notesDate === TODAY ? f.placeholder : ""}
              readOnly={notesDate !== TODAY}
              style={{ ...serif, width: "100%", background: C.surf, border: `1px solid ${C.border}`,
                borderLeft: `2px solid ${notesDate === TODAY ? `${accent}40` : C.border}`,
                color: C.textS, padding: "12px 14px", fontSize: 14, outline: "none", resize: "none",
                boxSizing: "border-box", lineHeight: 1.8,
                opacity: notesDate !== TODAY && !entry[f.key] ? 0.3 : 1 }} />
          </div>
        ))}

        <div style={{ marginTop: 24, border: `1px solid ${C.border}`, padding: "14px 16px" }}>
          <div style={{ ...mono, fontSize: 8, letterSpacing: 4, color: C.textM, marginBottom: 6 }}>THE VOW</div>
          <div style={{ ...serif, fontSize: 13, fontStyle: "italic", color: C.textS, lineHeight: 1.8 }}>
            "I will not waste what I was given. I will become the most capable, most disciplined, most valuable version of myself — for the people who need what only I can build. I will not stop."
          </div>
        </div>
      </div>
    );
  };

  const VIEWS = { command: Command, protocols: Protocols, training: Training, mission: Mission, intel: Intel, notes: Notes };
  const ActiveView = VIEWS[tab];

  return (
    <div style={{ height: "100vh", background: C.bg, display: "flex", flexDirection: "column",
      fontFamily: "Georgia, serif", color: C.textP, overflow: "hidden", position: "relative" }}>

      {/* Grain */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px" }} />

      {/* Header */}
      <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}`,
        padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, position: "relative", zIndex: 2 }}>
        <div>
          <div style={{ fontFamily: "Courier New", fontSize: 7, letterSpacing: 5, color: C.textM, marginBottom: 2 }}>
            BUILT WITH DISCIPLINE
          </div>
          <div style={{ fontFamily: "Courier New", fontSize: 11, letterSpacing: 4, color: accent,
            transition: "color 0.3s" }}>
            BATMAN PROTOCOL
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Courier New", fontSize: 9, color: accent, letterSpacing: 2, transition: "color 0.3s" }}>
            {pct}% TODAY
          </div>
          <div style={{ fontFamily: "Courier New", fontSize: 7, letterSpacing: 2, color: C.textM, marginTop: 2 }}>
            DAY +{daysActive}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", position: "relative", zIndex: 1 }}>
        <ActiveView />
        <div style={{ height: 80 }} />
      </div>

      {/* Bottom tab bar */}
      <div style={{ background: C.bg, borderTop: `1px solid ${C.border}`,
        display: "flex", flexShrink: 0, position: "relative", zIndex: 2 }}>
        {TABS.map(t => {
          const active = tab === t.id;
          const tc = ACCENT[t.id];
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, background: "none", border: "none",
                borderTop: `2px solid ${active ? tc : "transparent"}`,
                padding: "10px 4px 8px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                transition: "all 0.2s" }}>
              <span style={{ fontSize: 14, color: active ? tc : "#222", transition: "color 0.2s" }}>{t.icon}</span>
              <span style={{ fontFamily: "Courier New", fontSize: 6, letterSpacing: 2,
                color: active ? tc : "#222", transition: "color 0.2s" }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { display: none; } textarea, input { caret-color: #C8A951; } button { outline: none; }`}</style>
    </div>
  );
}
