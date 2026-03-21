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
  0: { opens: 1170, closes: 1500 }, // Sun  19:30–01:00  (01:00 = 1500 min next day → 60)
  1: null,                           // Mon  CLOSED
  2: { opens: 1170, closes: 1440 }, // Tue  19:30–00:00
  3: { opens: 1170, closes: 1440 }, // Wed  19:30–00:00
  4: { opens: 1170, closes: 1440 }, // Thu  19:30–00:00
  5: { opens: 1170, closes: 1500 }, // Fri  19:30–01:00
  6: { opens: 1170, closes: 1500 }, // Sat  19:30–01:00
};

// Converts "HH:MM" to minutes since midnight
const toMinutes = (h, m) => h * 60 + m;

function checkIsOpen() {
  const now = new Date();
  const day = now.getDay();
  const mins = toMinutes(now.getHours(), now.getMinutes());

  const isMonday = day === 1;
  // Hungry hour: 19:30 (1170 min) to 21:00 (1260 min)
  const isHungryHour = mins >= 1170 && mins < 1260;

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

  if (mins >= todaySlot.opens && mins < Math.min(todaySlot.closes, 1440)) {
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
