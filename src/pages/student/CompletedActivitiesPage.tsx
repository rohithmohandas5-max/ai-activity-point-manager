import { CheckCircle2, Award } from 'lucide-react';
import type { CompletedActivity } from '@/types/data';
import { categoryName } from '@/types/data';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';

interface CompletedActivitiesPageProps {
  completed: CompletedActivity[];
}

export function CompletedActivitiesPage({ completed }: CompletedActivitiesPageProps) {
  const totalEarned = completed.reduce((sum, c) => sum + c.points, 0);

  return (
    <div>
      <PageHeader
        title="Completed Activities"
        subtitle="Activities you have successfully completed"
        icon={<CheckCircle2 className="h-5 w-5" />}
      />

      <div className="card mb-6 flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Award className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Points Earned</p>
          <p className="text-2xl font-bold text-slate-800">{totalEarned} points</p>
        </div>
        <div className="ml-auto hidden text-right sm:block">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Activities Completed</p>
          <p className="text-2xl font-bold text-slate-800">{completed.length}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">Activity Name</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Points Earned</th>
                <th className="px-5 py-3 font-semibold">Completion Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {completed.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{c.title}</td>
                  <td className="px-5 py-3.5">
                    <CategoryBadge category={c.category} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                      <Award className="h-3.5 w-3.5 text-blue-500" /> {c.points}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{c.date}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
