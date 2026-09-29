import { useState } from "react";
import { Stethoscope } from "lucide-react";
import type { Availability } from "./doctors-data";

/** Doctor photo with a graceful initials fallback if the image file is missing. */
export function DoctorPhoto({
  name, src, className = "", imgClassName = "",
}: { name: string; src: string; className?: string; imgClassName?: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name.replace(/^Dr\.?\s*/i, "").split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div className={`relative overflow-hidden dr-grad-soft ${className}`}>
      {failed ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-blue-600">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold shadow-md ring-4 ring-sky-100">
            {initials}
          </div>
          <Stethoscope className="h-5 w-5 opacity-60" aria-hidden />
        </div>
      ) : (
        <img
          src={src} alt={name} loading="lazy" onError={() => setFailed(true)}
          className={`h-full w-full object-cover object-top ${imgClassName}`}
        />
      )}
    </div>
  );
}

const STATUS: Record<Availability, { label: string; box: string; dot: string; ping: boolean }> = {
  today: { label: "Available Today", box: "bg-emerald-50 text-emerald-800 ring-emerald-200", dot: "bg-emerald-500", ping: true },
  week: { label: "Available This Week", box: "bg-sky-50 text-sky-800 ring-sky-200", dot: "bg-sky-500", ping: false },
  unavailable: { label: "Currently Unavailable", box: "bg-slate-100 text-slate-700 ring-slate-200", dot: "bg-slate-400", ping: false },
};

export function AvailabilityBadge({ status }: { status: Availability }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${s.box}`}>
      <span className="relative flex h-2 w-2">
        {s.ping && <span className={`dr-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${s.dot}`} />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
      </span>
      {s.label}
    </span>
  );
}
