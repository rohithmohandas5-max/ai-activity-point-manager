import { UserCircle, Mail, Building2, GraduationCap, Award, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Student } from '@/types/data';
import { totalPoints, totalRemaining, categoryComplete, categoryRemaining, isFullyComplete } from '@/types/progress';
import { CATEGORY_MIN, TOTAL_MIN } from '@/types/nav';
import { ProgressBar } from '@/components/ProgressBar';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';

interface ProfilePageProps {
  student: Student;
}

export function ProfilePage({ student }: ProfilePageProps) {
  const total = totalPoints(student);
  const remaining = totalRemaining(student);
  const fullyComplete = isFullyComplete(student);

  const categories = [
    { id: 1, value: student.points.c1, label: 'Category 1' },
    { id: 2, value: student.points.c2, label: 'Category 2' },
    { id: 3, value: student.points.c3, label: 'Category 3' },
  ];

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your account and activity summary" icon={<UserCircle className="h-5 w-5" />} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="card p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-3xl font-bold text-white">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-800">{student.name}</h3>
            <p className="text-sm text-slate-500">Student</p>

            <div className="mt-5 w-full space-y-3 text-left">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">{student.email}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">{student.department}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">Year {student.year}</span>
              </div>
            </div>

            <div
              className={cn(
                'mt-5 w-full rounded-xl px-4 py-3 text-center',
                fullyComplete ? 'bg-emerald-50' : 'bg-amber-50',
              )}
            >
              <p className={cn('text-sm font-bold', fullyComplete ? 'text-emerald-700' : 'text-amber-700')}>
                {fullyComplete ? 'Requirements Completed' : 'Requirements Incomplete'}
              </p>
              <p className={cn('mt-0.5 text-xs', fullyComplete ? 'text-emerald-600' : 'text-amber-600')}>
                {fullyComplete ? 'You have met all graduation requirements' : `${remaining} points remaining`}
              </p>
            </div>
          </div>
        </div>

        {/* Progress card */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-base font-bold text-slate-800">Activity Progress</h3>
          <p className="mt-0.5 text-sm text-slate-500">Your current standing toward graduation requirements</p>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Total Points</span>
              <span className="text-sm font-bold text-slate-800">
                {total} / {TOTAL_MIN}
              </span>
            </div>
            <ProgressBar value={total} max={TOTAL_MIN} colorClass="bg-gradient-to-r from-blue-500 to-blue-600" height="h-3" />
          </div>

          <div className="mt-6 space-y-4">
            {categories.map((cat) => {
              const complete = categoryComplete(cat.value);
              const rem = categoryRemaining(cat.value);
              return (
                <div key={cat.id}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      {complete ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                      {cat.label}
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {cat.value} / {CATEGORY_MIN}
                    </span>
                  </div>
                  <ProgressBar value={cat.value} max={CATEGORY_MIN} colorClass={complete ? 'bg-emerald-500' : 'bg-amber-500'} height="h-2" />
                  <p className={cn('mt-1 text-xs font-medium', complete ? 'text-emerald-600' : 'text-amber-600')}>
                    {complete ? 'Completed' : `${rem} points required`}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <Award className="mx-auto h-5 w-5 text-blue-600" />
              <p className="mt-1 text-lg font-bold text-slate-800">{total}</p>
              <p className="text-xs text-slate-500">Total Points</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-center">
              <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-600" />
              <p className="mt-1 text-lg font-bold text-slate-800">
                {categories.filter((c) => categoryComplete(c.value)).length}
              </p>
              <p className="text-xs text-slate-500">Categories Done</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-center">
              <AlertTriangle className="mx-auto h-5 w-5 text-amber-500" />
              <p className="mt-1 text-lg font-bold text-slate-800">{remaining}</p>
              <p className="text-xs text-slate-500">Points Left</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
