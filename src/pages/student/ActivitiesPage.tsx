import { CalendarDays, MapPin, Clock, UserCheck, ExternalLink, Award } from 'lucide-react';
import type { Activity } from '@/types/data';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';

interface ActivitiesPageProps {
  activities: Activity[];
  registrations: Set<string>;
  onRegister: (activityId: string) => void;
}

export function ActivitiesPage({ activities, registrations, onRegister }: ActivitiesPageProps) {
  return (
    <div>
      <PageHeader
        title="Activities"
        subtitle="Browse and register for upcoming activities"
        icon={<CalendarDays className="h-5 w-5" />}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {activities.map((activity) => (
          <div key={activity.id} className="card flex flex-col p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-bold text-slate-800">{activity.title}</h3>
              <CategoryBadge category={activity.category} />
            </div>
            <p className="mt-2 flex-1 text-sm text-slate-500">{activity.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Award className="h-4 w-4 text-blue-500" />
                <span>{activity.points} Points</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarDays className="h-4 w-4 text-blue-500" />
                <span>{activity.date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="truncate">{activity.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Reg by {activity.deadline}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-slate-600">
                <UserCheck className="h-4 w-4 text-blue-500" />
                <span>{activity.eligibility}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => onRegister(activity.id)}
                className={registrations.has(activity.id) ? 'btn-ghost flex-1 text-emerald-600 ring-emerald-200' : 'btn-primary flex-1'}
              >
                {registrations.has(activity.id) ? 'Registered' : 'Register'}
              </button>
              <a
                href={activity.link}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
                onClick={(e) => e.preventDefault()}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
