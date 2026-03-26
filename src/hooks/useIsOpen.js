import { useState, useEffect } from 'react';

/* ────────────────────────────────────────────────────────────────
   useIsOpen  —  Returns real-time open/closed state + next message
   Business hours:
     Tue–Thu  19:30 – 00:00
     Fri–Sun  19:30 – 01:00
     Monday   CLOSED
   ──────────────────────────────────────────────────────────────── */

// 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const SCHEDULE = {
  0: { opens: 1200, closes: 1470 }, // Sun  20:00–00:30
  1: null,                           // Mon  CLOSED
  2: { opens: 1200, closes: 1470 }, // Tue  20:00–00:30
  3: { opens: 1200, closes: 1470 }, // Wed  20:00–00:30
  4: { opens: 1200, closes: 1470 }, // Thu  20:00–00:30
  5: { opens: 1200, closes: 1470 }, // Fri  20:00–00:30
  6: { opens: 1200, closes: 1470 }, // Sat  20:00–00:30
};

// Converts "HH:MM" to minutes since midnight
const toMinutes = (h, m) => h * 60 + m;

function checkIsOpen() {
  const now = new Date();
  const day = now.getDay();
  const mins = toMinutes(now.getHours(), now.getMinutes());

  const isMonday = day === 3;
  // Hungry hour: 20:00 (1200 min) to 21:00 (1260 min)
  const isHungryHour = mins >= 1200 && mins < 1260;

  const todaySlot = SCHEDULE[day];
  const prevDay = (day + 6) % 7;
  const prevSlot = SCHEDULE[prevDay];

  // Handle post-midnight window from previous day (e.g. Fri 01:00 stretch)
  if (prevSlot && prevSlot.closes > 1440) {
    const overflow = prevSlot.closes - 1440;
    if (mins < overflow) return { isOpen: true, isMonday, isHungryHour, message: null };
  }

  if (!todaySlot) {
    return { isOpen: false, isMonday, isHungryHour, message: 'Hoy estamos cerrados. Volvemos el martes 🍣' };
  }

  if (!isMonday && mins >= todaySlot.opens && mins < Math.min(todaySlot.closes, 1440)) {
    return { isOpen: true, isMonday, isHungryHour, message: null };
  }

  if (mins < todaySlot.opens) {
    const hh = String(Math.floor(todaySlot.opens / 60)).padStart(2, '0');
    const mm = String(todaySlot.opens % 60).padStart(2, '0');
    return { isOpen: false, isMonday, isHungryHour, message: `Abrimos hoy a las ${hh}:${mm} 🕖` };
  }

  // After closing — find next open day
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7;
    if (SCHEDULE[next]) {
      const hh = String(Math.floor(SCHEDULE[next].opens / 60)).padStart(2, '0');
      const mm = String(SCHEDULE[next].opens % 60).padStart(2, '0');
      return { isOpen: false, isMonday, isHungryHour, message: `Abrimos el ${days[next]} a las ${hh}:${mm} 🕖` };
    }
  }

  return { isOpen: false, isMonday, isHungryHour, message: 'Por ahora estamos cerrados 🍣' };
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
