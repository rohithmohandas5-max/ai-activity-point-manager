import { PlusCircle, CalendarDays, Users, ListChecks, TrendingUp, ArrowRight } from 'lucide-react';
import type { Activity } from '@/types/data';
import { categoryName } from '@/types/data';
import { StatCard } from '@/components/StatCard';
import { PageHeader } from '@/components/PageHeader';
import { CategoryBadge } from '@/components/CategoryBadge';
import { StatusPill } from '@/components/StatusPill';

interface ProviderDashboardProps {
  activities: Activity[];
  onNavigate: (key: string) => void;
}

export function ProviderDashboard({ activities, onNavigate }: ProviderDashboardProps) {
  const totalCreated = activities.length;
  const upcoming = activities.filter((a) => a.status === 'approved').length;
  const totalParticipants = activities.reduce((sum, a) => sum + Math.floor(40 + (a.points * 7)), 0);

  return (
    <div>
      <PageHeader
        title="Provider Dashboard"
        subtitle="Manage your activities and track participation"
        icon={<ListChecks className="h-5 w-5" />}
        action={
          <button onClick={() => onNavigate('provider-add')} className="btn-primary">
            <PlusCircle className="h-4 w-4" /> Add Activity
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ListChecks className="h-5 w-5" />}
          label="Total Activities"
          value={totalCreated}
          sublabel="Created by you"
          accentClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Upcoming"
          value={upcoming}
          sublabel="Approved activities"
          accentClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Participants"
          value={totalParticipants}
          sublabel="Across all activities"
          accentClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Pending Approval"
          value={activities.filter((a) => a.status === 'pending').length}
          sublabel="Awaiting review"
          accentClass="bg-amber-50 text-amber-500"
        />
      </div>

      {/* Recently created */}
      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-bold text-slate-800">Recently Created Activities</h3>
          <button
            onClick={() => onNavigate('provider-activities')}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {activities.slice(0, 5).map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-semibold text-slate-800">{a.title}</h4>
                  <CategoryBadge category={a.category} />
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {a.points} points | {a.date} | {a.venue}
                </p>
              </div>
              <StatusPill status={a.status === 'approved' ? 'Approved' : a.status === 'pending' ? 'Pending' : 'Rejected'} />
            </div>
          ))}
          {activities.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              No activities yet. Click "Add Activity" to create your first.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
