import { useState, useEffect } from 'react';

/* ────────────────────────────────────────────────────────────────
   useIsOpen  —  Returns real-time open/closed state + next message
   Business hours:
     Every day  19:30 – 00:30  (30 min past midnight)
   ──────────────────────────────────────────────────────────────── */

// minutes since midnight: 19:30 = 19*60+30 = 1170, 00:30 = 30 (next day → 1470)
// 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const OPENS  = 1170; // 19:30
const CLOSES = 1470; // 00:30 next day (overflows midnight)

const SCHEDULE = {
  0: { opens: OPENS, closes: CLOSES }, // Dom  19:30–00:30
  1: { opens: OPENS, closes: CLOSES }, // Lun  19:30–00:30
  2: { opens: OPENS, closes: CLOSES }, // Mar  19:30–00:30
  3: { opens: OPENS, closes: CLOSES }, // Mié  19:30–00:30
  4: { opens: OPENS, closes: CLOSES }, // Jue  19:30–00:30
  5: { opens: OPENS, closes: CLOSES }, // Vie  19:30–00:30
  6: { opens: OPENS, closes: CLOSES }, // Sáb  19:30–00:30
};

// Converts hours + minutes to minutes since midnight
const toMinutes = (h, m) => h * 60 + m;

function checkIsOpen() {
  const now  = new Date();
  const day  = now.getDay();
  const mins = toMinutes(now.getHours(), now.getMinutes());

  // isMonday kept as false — open every day
  const isMonday = false;

  // Hungry hour: 19:30 (1170 min) to 20:30 (1230 min)
  const isHungryHour = mins >= OPENS && mins < OPENS + 60;

  const todaySlot = SCHEDULE[day];
  const prevDay   = (day + 6) % 7;
  const prevSlot  = SCHEDULE[prevDay];

  // Handle post-midnight overflow from previous day (00:00 – 00:30)
  if (prevSlot && prevSlot.closes > 1440) {
    const overflow = prevSlot.closes - 1440; // = 30 minutes
    if (mins < overflow) return { isOpen: true, isMonday, isHungryHour, message: null };
  }

  // Open window (same day)
  if (mins >= todaySlot.opens && mins < Math.min(todaySlot.closes, 1440)) {
    return { isOpen: true, isMonday, isHungryHour, message: null };
  }

  // Before opening
  if (mins < todaySlot.opens) {
    const hh = String(Math.floor(todaySlot.opens / 60)).padStart(2, '0');
    const mm = String(todaySlot.opens % 60).padStart(2, '0');
    return { isOpen: false, isMonday, isHungryHour, message: `Abrimos hoy a las ${hh}:${mm} 🕖` };
  }

  // After closing — next opening is always tomorrow (same schedule every day)
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const nextDay = (day + 1) % 7;
  const hh = String(Math.floor(OPENS / 60)).padStart(2, '0');
  const mm = String(OPENS % 60).padStart(2, '0');
  return {
    isOpen: false,
    isMonday,
    isHungryHour,
    message: `Abrimos el ${days[nextDay]} a las ${hh}:${mm} 🕖`,
  };
}

export function useIsOpen() {
  const [state, setState] = useState(checkIsOpen);

  useEffect(() => {
    // Re-check every 60 seconds
    const id = setInterval(() => setState(checkIsOpen()), 60_000);
    return () => clearInterval(id);
  }, []);

  return state;
}
