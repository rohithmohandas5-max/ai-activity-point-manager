import { CalendarDays, Award, MapPin, Clock, UserCheck } from 'lucide-react';
import type { Activity } from '@/types/data';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';
import { StatusPill } from '@/components/StatusPill';

interface AdminActivitiesPageProps {
  activities: Activity[];
}

export function AdminActivitiesPage({ activities }: AdminActivitiesPageProps) {
  return (
    <div>
      <PageHeader title="Activities" subtitle="All activities across the university" icon={<CalendarDays className="h-5 w-5" />} />

      <div className="grid gap-5 md:grid-cols-2">
        {activities.map((a) => (
          <div key={a.id} className="card flex flex-col p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-bold text-slate-800">{a.title}</h3>
              <StatusPill status={a.status === 'approved' ? 'Approved' : a.status === 'pending' ? 'Pending' : 'Rejected'} />
            </div>
            <p className="mt-2 flex-1 text-sm text-slate-500">{a.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CategoryBadge category={a.category} />
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                <Award className="h-3 w-3" /> {a.points} Points
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-500" /> {a.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" /> Reg by {a.deadline}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" /> {a.venue}
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-blue-500" /> {a.eligibility}
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
              Created by <span className="font-medium text-slate-600">{a.provider}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
