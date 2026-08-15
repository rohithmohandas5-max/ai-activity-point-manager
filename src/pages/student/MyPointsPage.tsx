import { Award, CheckCircle2, AlertTriangle, BarChart3 } from 'lucide-react';
import type { Student } from '@/types/data';
import { totalPoints, totalRemaining, categoryComplete, categoryRemaining, isFullyComplete } from '@/types/progress';
import { CATEGORY_MIN, TOTAL_MIN } from '@/types/nav';
import { ProgressBar } from '@/components/ProgressBar';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';

interface MyPointsPageProps {
  student: Student;
}

export function MyPointsPage({ student }: MyPointsPageProps) {
  const total = totalPoints(student);
  const remaining = totalRemaining(student);
  const fullyComplete = isFullyComplete(student);

  const categories = [
    { id: 1, value: student.points.c1, label: 'Category 1' },
    { id: 2, value: student.points.c2, label: 'Category 2' },
    { id: 3, value: student.points.c3, label: 'Category 3' },
  ];

  const maxBar = Math.max(CATEGORY_MIN, ...categories.map((c) => c.value), 40);

  return (
    <div>
      <PageHeader
        title="My Activity Points"
        subtitle="Track your progress toward graduation requirements"
        icon={<Award className="h-5 w-5" />}
      />

      {/* Total card */}
      <div className="card mb-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Activity Points</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-4xl font-bold text-slate-800">{total}</span>
              <span className="mb-1 text-xl font-semibold text-slate-400">/ {TOTAL_MIN}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Remaining</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">{remaining}</p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={total} max={TOTAL_MIN} colorClass="bg-gradient-to-r from-blue-500 to-blue-600" height="h-3" />
        </div>
        {fullyComplete && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> All requirements completed!
          </p>
        )}
      </div>

      {/* Category breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        {categories.map((cat) => {
          const complete = categoryComplete(cat.value);
          const rem = categoryRemaining(cat.value);
          return (
            <div key={cat.id} className={cn('card p-5', complete ? 'ring-emerald-200' : 'ring-amber-200')}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">{cat.label}</p>
                {complete ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <div className="mt-2 flex items-end gap-1.5">
                <span className="text-3xl font-bold text-slate-800">{cat.value}</span>
                <span className="mb-1 text-lg font-semibold text-slate-400">/ {CATEGORY_MIN}</span>
              </div>
              <div className="mt-3">
                <ProgressBar value={cat.value} max={CATEGORY_MIN} colorClass={complete ? 'bg-emerald-500' : 'bg-amber-500'} height="h-2" />
              </div>
              <p className="mt-2 text-xs font-medium">
                {complete ? (
                  <span className="text-emerald-600">Completed</span>
                ) : (
                  <span className="text-amber-600">{rem} points required</span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Requirements summary */}
      <div className="card mt-6 p-6">
        <h3 className="text-base font-bold text-slate-800">Requirements Summary</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="text-sm font-medium text-slate-600">Total points remaining</span>
            <span className="text-sm font-bold text-amber-600">{remaining}</span>
          </div>
          {categories.map((cat) => {
            const complete = categoryComplete(cat.value);
            const rem = categoryRemaining(cat.value);
            return (
              <div key={cat.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-600">{cat.label}</span>
                <span className={cn('text-sm font-bold', complete ? 'text-emerald-600' : 'text-amber-600')}>
                  {complete ? 'Completed' : `${rem} points required`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual chart */}
      <div className="card mt-6 p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-800">Points by Category</h3>
        </div>
        <div className="flex items-end justify-around gap-4 pt-6" style={{ height: '220px' }}>
          {categories.map((cat) => {
            const h = (cat.value / maxBar) * 160;
            const complete = categoryComplete(cat.value);
            return (
              <div key={cat.id} className="flex flex-1 flex-col items-center justify-end gap-2">
                <span className="text-lg font-bold text-slate-800">{cat.value}</span>
                <div
                  className={cn(
                    'w-full max-w-[80px] rounded-t-lg transition-all duration-700',
                    complete ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' : 'bg-gradient-to-t from-amber-500 to-amber-400',
                  )}
                  style={{ height: `${h}px` }}
                />
                <span className="text-xs font-medium text-slate-500">{cat.label}</span>
                <div className="mt-1 w-full max-w-[80px] border-t-2 border-dashed border-slate-300" />
                <span className="text-[10px] text-slate-400">min {CATEGORY_MIN}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
