import { ListChecks, CalendarDays, MapPin, Award, Clock, UserCheck, ExternalLink } from 'lucide-react';
import type { Activity } from '@/types/data';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';
import { StatusPill } from '@/components/StatusPill';

interface MyActivitiesPageProps {
  activities: Activity[];
}

export function MyActivitiesPage({ activities }: MyActivitiesPageProps) {
  return (
    <div>
      <PageHeader title="My Activities" subtitle="All activities you have created" icon={<ListChecks className="h-5 w-5" />} />

      {activities.length === 0 ? (
        <div className="card p-12 text-center">
          <ListChecks className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-400">No activities yet. Create one from the Add Activity page.</p>
        </div>
      ) : (
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

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-400">By {a.provider}</span>
                <a
                  href={a.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  onClick={(e) => e.preventDefault()}
                >
                  View link <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
