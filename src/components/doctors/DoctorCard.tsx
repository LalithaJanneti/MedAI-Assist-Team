import type { ElementType, ReactNode } from "react";
import { Award, Building2, MapPin, Stethoscope } from "lucide-react";
import type { Doctor } from "./doctors-data";
import { AvailabilityBadge, DoctorPhoto } from "./DoctorShared";

function Meta({ icon: Icon, children }: { icon: ElementType; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

interface Props {
  doctor: Doctor;
  index: number;
  onView: (doctor: Doctor) => void;
  onBook: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor: d, index, onView, onBook }: Props) {
  const unavailable = d.availability === "unavailable";
  return (
    <article
      className="group dr-card-in flex h-full flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_8px_30px_-12px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-200 hover:shadow-[0_24px_48px_-18px_rgba(37,99,235,0.38)]"
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <div className="relative">
        <DoctorPhoto
          name={d.name} src={d.photo} className="aspect-[4/3] w-full"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3"><AvailabilityBadge status={d.availability} /></div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-slate-900">{d.name}</h3>
        <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
          <Stethoscope className="h-4 w-4" aria-hidden /> {d.specialty}
        </p>

        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <Meta icon={Award}>{d.experience} years experience</Meta>
          <Meta icon={Building2}>{d.hospital}</Meta>
          <Meta icon={MapPin}>{d.location}</Meta>
        </ul>

        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{d.summary}</p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <button type="button" onClick={() => onView(d)} className="dr-btn-ghost px-2 py-2.5 text-[13px]">
            View Profile
          </button>
          <button
            type="button" onClick={() => onBook(d)} disabled={unavailable}
            title={unavailable ? "This doctor is currently unavailable" : undefined}
            className="dr-btn-primary px-2 py-2.5 text-[13px]"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </article>
  );
}
