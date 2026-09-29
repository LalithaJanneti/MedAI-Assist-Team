import type { ElementType, ReactNode } from "react";
import {
  ArrowLeft, Award, Building2, CheckCircle2, Clock, GraduationCap, IndianRupee,
  MapPin, MessageCircle, Stethoscope, Video,
} from "lucide-react";
import { WEEKDAYS, type Doctor } from "./doctors-data";
import { AvailabilityBadge, DoctorPhoto } from "./DoctorShared";

function Title({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 font-display text-base font-bold uppercase tracking-wider text-blue-800">{children}</h3>;
}

function Info({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"><Icon className="h-4 w-4" aria-hidden /></span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
        <div className="mt-0.5 text-sm font-semibold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

interface Props {
  doctor: Doctor;
  onBack: () => void;
  onBook: (doctor: Doctor) => void;
}

export function DoctorProfile({ doctor: d, onBack, onBook }: Props) {
  const unavailable = d.availability === "unavailable";
  return (
    <section className="dr-view-in" aria-label={`${d.name} profile`}>
      <button type="button" onClick={onBack} className="dr-btn-ghost rounded-full px-4 py-2 text-sm">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Doctors
      </button>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        <div className="relative h-fit overflow-hidden rounded-3xl border border-sky-100 bg-white p-3 shadow-[0_18px_50px_-22px_rgba(37,99,235,0.4)] lg:sticky lg:top-6">
          <DoctorPhoto name={d.name} src={d.photo} className="aspect-[4/5] w-full rounded-2xl" />
          <div className="absolute left-6 top-6"><AvailabilityBadge status={d.availability} /></div>
        </div>

        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-[0_18px_50px_-24px_rgba(37,99,235,0.3)] sm:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-blue-800">
            <Stethoscope className="h-4 w-4" aria-hidden /> {d.specialty}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl">{d.name}</h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {d.qualifications.map((q) => (
              <span key={q} className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                <GraduationCap className="h-3.5 w-3.5 text-blue-500" aria-hidden /> {q}
              </span>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              [`${d.experience}+`, "Years experience"],
              [`₹${d.fee}`, "Consultation fee"],
              [d.mode, "Consultation mode"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-sky-50 p-3">
                <div className="font-display text-base font-bold text-blue-800 sm:text-xl">{v}</div>
                <div className="mt-0.5 text-[11px] font-medium text-slate-600 sm:text-xs">{l}</div>
              </div>
            ))}
          </div>

          <div className="mt-8"><Title>About doctor</Title><p className="leading-relaxed text-slate-700">{d.about}</p></div>

          <div className="mt-8">
            <Title>Areas of expertise</Title>
            <ul className="grid gap-2 sm:grid-cols-2">
              {d.expertise.map((e) => (
                <li key={e} className="flex items-center gap-2 text-sm text-slate-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden /> {e}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <Title>Consultation information</Title>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info icon={Building2} label="Hospital / clinic" value={d.hospital} />
              <Info icon={MapPin} label="Location" value={d.location} />
              <Info icon={IndianRupee} label="Consultation fee" value={`₹${d.fee} per visit`} />
              <Info icon={Video} label="Mode" value={d.mode} />
              <Info icon={MessageCircle} label="Languages" value={d.languages.join(", ")} />
              <Info icon={Award} label="Experience" value={`${d.experience} years`} />
            </div>
          </div>

          <div className="mt-8">
            <Title>Available days &amp; time</Title>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => {
                const on = d.days.includes(day);
                return (
                  <span key={day} className={`rounded-xl px-3.5 py-2 text-sm font-semibold ${on ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 line-through"}`}>
                    {day}
                  </span>
                );
              })}
            </div>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <Clock className="h-4 w-4 text-blue-500" aria-hidden /> {d.hours}
            </p>
          </div>

          <button type="button" onClick={() => onBook(d)} disabled={unavailable} className="dr-btn-primary mt-8 w-full px-6 py-3.5 text-base sm:w-auto">
            {unavailable ? "Currently Unavailable" : "Book Appointment"}
          </button>
        </div>
      </div>
    </section>
  );
}
