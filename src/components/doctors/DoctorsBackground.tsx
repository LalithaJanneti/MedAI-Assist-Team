import type { CSSProperties } from "react";
import { Stethoscope, Heart, Plus, Activity, Building2, Sparkles, HeartPulse, Brain } from "lucide-react";

const ITEMS = [
  { Icon: Stethoscope, left: "6%", top: "12%", size: 64, d: 11, delay: 0, r: -8 },
  { Icon: Plus, left: "88%", top: "9%", size: 46, d: 9, delay: 1.2, r: 0 },
  { Icon: Heart, left: "92%", top: "38%", size: 56, d: 12, delay: 2, r: 8 },
  { Icon: Building2, left: "3%", top: "46%", size: 58, d: 13, delay: 0.6, r: 0 },
  { Icon: Activity, left: "80%", top: "68%", size: 60, d: 10, delay: 1.8, r: 0 },
  { Icon: Sparkles, left: "12%", top: "80%", size: 44, d: 8, delay: 0.3, r: 0 },
  { Icon: HeartPulse, left: "48%", top: "4%", size: 40, d: 10, delay: 2.4, r: 0 },
  { Icon: Brain, left: "58%", top: "88%", size: 48, d: 12, delay: 1, r: 0 },
  { Icon: Plus, left: "28%", top: "92%", size: 30, d: 8, delay: 0.9, r: 0 },
  { Icon: Plus, left: "72%", top: "26%", size: 28, d: 9, delay: 1.6, r: 0 },
];

/** Very soft floating healthcare icons + an ECG line. Purely decorative. */
export function DoctorsBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      {ITEMS.map(({ Icon, left, top, size, d, delay, r }, i) => (
        <span
          key={i}
          className="dr-float absolute text-sky-400/25"
          style={{ left, top, "--d": `${d}s`, "--delay": `${delay}s`, "--r": `${r}deg` } as CSSProperties}
        >
          <Icon width={size} height={size} strokeWidth={1.3} />
        </span>
      ))}
      <svg className="absolute bottom-8 left-0 h-24 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          className="dr-ecg-line" fill="none" stroke="rgba(56,189,248,.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          d="M0 60 H300 L330 60 L350 20 L380 100 L405 40 L425 60 H700 L730 60 L750 15 L780 105 L805 45 L825 60 H1200"
        />
      </svg>
    </div>
  );
}
