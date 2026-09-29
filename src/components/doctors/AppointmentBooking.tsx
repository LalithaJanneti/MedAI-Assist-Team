import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Building2, CalendarDays, CheckCircle2, Clock, Mail, MapPin, Phone, Stethoscope, User } from "lucide-react";
import { DAY_NAMES, TIME_SLOTS, type Doctor } from "./doctors-data";
import { DoctorPhoto } from "./DoctorShared";

export interface AppointmentPayload {
  doctorId: string; date: string; time: string;
  name: string; email: string; phone: string; reason: string;
}

const keyOf = (dt: Date) =>
  `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

/** Next `count` dates that fall on the doctor's working days. */
function upcomingDates(days: string[], count = 7) {
  const out: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; out.length < count && i < 45; i++) {
    const dt = new Date(today);
    dt.setDate(today.getDate() + i);
    if (days.includes(DAY_NAMES[dt.getDay()])) out.push(dt);
  }
  return out;
}

/** Demo-only: deterministic "already booked" slots. Replace with real availability from your API. */
function isBooked(doctorId: string, dateKey: string, index: number) {
  let h = 0;
  for (const c of doctorId + dateKey) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (h + index * 5) % 4 === 0;
}

const INPUT =
  "h-12 w-full rounded-2xl border bg-white pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-500 hover:border-sky-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="mt-7 first:mt-0">
      <h3 className="mb-3 flex items-center gap-2.5 font-display text-base font-bold text-slate-900">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs text-white">{n}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Labeled({ id, label, icon, error, children }: { id: string; label: string; icon?: ReactNode; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-800">{label}</label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-4 top-3.5 text-blue-500">{icon}</span>}
        {children}
      </div>
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

interface Props {
  doctor: Doctor;
  onBack: () => void;
  onDone: () => void;
  /** Hook this up to your API to actually save the appointment. */
  onConfirm?: (payload: AppointmentPayload) => void;
}

export function AppointmentBooking({ doctor: d, onBack, onDone, onConfirm }: Props) {
  const dates = useMemo(() => upcomingDates(d.days), [d.days]);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", reason: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<{ payload: AppointmentPayload; ref: string } | null>(null);

  const setField = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const prettyDate = (key: string) =>
    new Date(`${key}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  function submit(e: FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!date) err.date = "Please choose a date.";
    if (!slot) err.slot = "Please choose a time slot.";
    if (form.name.trim().length < 2) err.name = "Please enter the patient's name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Please enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 10) err.phone = "Please enter a valid phone number.";
    if (form.reason.trim().length < 5) err.reason = "Please briefly describe the reason for consultation.";
    setErrors(err);
    if (Object.keys(err).length) return;

    const payload: AppointmentPayload = { doctorId: d.id, date, time: slot, ...form };
    onConfirm?.(payload);
    setConfirmed({ payload, ref: `MA-${Math.random().toString(36).slice(2, 8).toUpperCase()}` });
  }

  if (confirmed) {
    const { payload, ref } = confirmed;
    return (
      <section className="dr-view-in mx-auto max-w-xl text-center" aria-live="polite">
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-[0_18px_50px_-24px_rgba(16,185,129,0.45)] sm:p-10">
          <div className="dr-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
            <CheckCircle2 className="h-10 w-10" aria-hidden />
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold text-slate-900">Appointment Confirmed</h2>
          <p className="mt-2 text-slate-600">
            Your appointment with <strong className="text-slate-900">{d.name}</strong> has been booked successfully.
          </p>
          <dl className="mt-6 divide-y divide-sky-100 rounded-2xl bg-sky-50/70 text-left text-sm">
            {[
              ["Reference", ref], ["Doctor", `${d.name} · ${d.specialty}`],
              ["Date", prettyDate(payload.date)], ["Time", payload.time],
              ["Patient", payload.name], ["Location", `${d.hospital}, ${d.location}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-3">
                <dt className="font-medium text-slate-600">{k}</dt>
                <dd className="text-right font-semibold text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
          <button type="button" onClick={onDone} className="dr-btn-primary mt-7 px-6 py-3 text-sm">Back to Doctors</button>
        </div>
      </section>
    );
  }

  return (
    <section className="dr-view-in" aria-label={`Book appointment with ${d.name}`}>
      <button type="button" onClick={onBack} className="dr-btn-ghost rounded-full px-4 py-2 text-sm">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back
      </button>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
        <aside className="h-fit overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_18px_50px_-24px_rgba(37,99,235,0.35)] lg:sticky lg:top-6">
          <DoctorPhoto name={d.name} src={d.photo} className="aspect-[4/3] w-full" />
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Booking with</p>
            <h2 className="mt-1 font-display text-xl font-bold text-slate-900">{d.name}</h2>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-blue-800">
              <Stethoscope className="h-4 w-4" aria-hidden /> {d.specialty}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2"><Building2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden />{d.hospital}</li>
              <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden />{d.location}</li>
              <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden />{d.days.join(", ")} · {d.hours}</li>
            </ul>
            <p className="mt-4 rounded-xl bg-sky-50 px-3 py-2 text-sm font-semibold text-blue-800">Consultation fee: ₹{d.fee}</p>
          </div>
        </aside>

        <form onSubmit={submit} noValidate className="rounded-3xl border border-sky-100 bg-white p-6 shadow-[0_18px_50px_-24px_rgba(37,99,235,0.3)] sm:p-8">
          <h2 className="font-display text-2xl font-bold text-slate-900">Book Appointment</h2>
          <p className="mb-6 mt-1 text-sm text-slate-600">Choose a date and time, then share the patient details.</p>

          <Step n={1} title="Select date">
            <div className="flex gap-2 overflow-x-auto pb-1" role="radiogroup" aria-label="Appointment date">
              {dates.map((dt) => {
                const k = keyOf(dt);
                const on = date === k;
                return (
                  <button
                    key={k} type="button" role="radio" aria-checked={on}
                    onClick={() => { setDate(k); setSlot(""); setErrors((e) => ({ ...e, date: "", slot: "" })); }}
                    className={`flex w-[72px] shrink-0 flex-col items-center rounded-2xl border px-2 py-3 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                      on ? "border-blue-600 bg-blue-600 text-white shadow-md" : "border-sky-100 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50"
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase">{DAY_NAMES[dt.getDay()]}</span>
                    <span className="text-xl font-bold">{dt.getDate()}</span>
                    <span className="text-xs">{dt.toLocaleDateString("en-IN", { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
            {errors.date && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.date}</p>}
          </Step>

          <Step n={2} title="Available time slots">
            {date ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4" role="radiogroup" aria-label="Time slot">
                {TIME_SLOTS.map((t, i) => {
                  const booked = isBooked(d.id, date, i);
                  const on = slot === t;
                  return (
                    <button
                      key={t} type="button" role="radio" aria-checked={on} disabled={booked}
                      onClick={() => { setSlot(t); setErrors((e) => ({ ...e, slot: "" })); }}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                        booked ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400 line-through"
                          : on ? "border-blue-600 bg-blue-600 text-white shadow-md"
                          : "border-sky-100 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" aria-hidden /> {t}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-3 text-sm text-slate-600">
                <CalendarDays className="h-4 w-4 text-blue-500" aria-hidden /> Select a date to see available slots.
              </p>
            )}
            {errors.slot && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.slot}</p>}
          </Step>

          <Step n={3} title="Patient details">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Labeled id="bk-specialty" label="Selected specialty" icon={<Stethoscope className="h-4 w-4" />}>
                  <input id="bk-specialty" readOnly value={`${d.specialty} — ${d.name}`} className={`${INPUT} border-sky-100 bg-sky-50/70 font-semibold`} />
                </Labeled>
              </div>
              <Labeled id="bk-name" label="Patient name" icon={<User className="h-4 w-4" />} error={errors.name}>
                <input id="bk-name" autoComplete="name" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Full name" aria-invalid={!!errors.name} className={`${INPUT} ${errors.name ? "border-red-300" : "border-sky-100"}`} />
              </Labeled>
              <Labeled id="bk-email" label="Patient email" icon={<Mail className="h-4 w-4" />} error={errors.email}>
                <input id="bk-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="name@example.com" aria-invalid={!!errors.email} className={`${INPUT} ${errors.email ? "border-red-300" : "border-sky-100"}`} />
              </Labeled>
              <div className="sm:col-span-2">
                <Labeled id="bk-phone" label="Patient phone" icon={<Phone className="h-4 w-4" />} error={errors.phone}>
                  <input id="bk-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+91 98765 43210" aria-invalid={!!errors.phone} className={`${INPUT} ${errors.phone ? "border-red-300" : "border-sky-100"}`} />
                </Labeled>
              </div>
              <div className="sm:col-span-2">
                <Labeled id="bk-reason" label="Reason for consultation" error={errors.reason}>
                  <textarea id="bk-reason" rows={4} value={form.reason} onChange={(e) => setField("reason", e.target.value)} placeholder="Briefly describe symptoms or the purpose of your visit" aria-invalid={!!errors.reason} className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-500 hover:border-sky-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${errors.reason ? "border-red-300" : "border-sky-100"}`} />
                </Labeled>
              </div>
            </div>
          </Step>

          <button type="submit" className="dr-btn-primary mt-8 w-full px-6 py-3.5 text-base">Confirm Appointment</button>
        </form>
      </div>
    </section>
  );
}
