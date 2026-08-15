import {
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import type { Student, Activity, ProofSubmission, CompletedActivity } from '@/types/data';
import {
  totalPoints,
  totalRemaining,
  categoryComplete,
  categoryRemaining,
  isFullyComplete,
  buildRecommendations,
} from '@/types/progress';
import { CATEGORY_MIN, TOTAL_MIN } from '@/types/nav';
import { ProgressBar } from '@/components/ProgressBar';
import { CategoryBadge } from '@/components/CategoryBadge';
import { cn } from '@/lib/utils';

interface StudentDashboardProps {
  student: Student;
  activities: Activity[];
  registrations: Set<string>;
  proofs: ProofSubmission[];
  completed: CompletedActivity[];
  onNavigate: (key: string) => void;
}

export function StudentDashboard({
  student,
  activities,
  registrations,
  proofs,
  completed,
  onNavigate,
}: StudentDashboardProps) {
  const total = totalPoints(student);
  const remaining = totalRemaining(student);
  const fullyComplete = isFullyComplete(student);

  const categories = [
    { id: 1, value: student.points.c1, label: 'Category 1' },
    { id: 2, value: student.points.c2, label: 'Category 2' },
    { id: 3, value: student.points.c3, label: 'Category 3' },
  ];

  const recommendations = buildRecommendations({
    student,
    activities,
    registrations,
    proofs,
    completed,
  });
  const topRec = recommendations[0];

  return (
    <div className="space-y-6">
      {/* Hero progress card */}
      <div className="card relative overflow-hidden p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-48 w-48 -translate-y-12 translate-x-12 rounded-full bg-blue-50" />
        <div className="absolute right-16 top-20 h-32 w-32 rounded-full bg-blue-100/50" />
        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">Activity Progress</span>
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-bold text-slate-800 sm:text-6xl">{total}</span>
                <span className="mb-2 text-2xl font-semibold text-slate-400">/ {TOTAL_MIN}</span>
                <span className="mb-2 ml-1 text-lg text-slate-500">Activity Points</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {fullyComplete ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> All requirements completed!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="font-semibold text-amber-600">{remaining}</span> more total points required
                  </span>
                )}
              </p>
            </div>
            <div className="w-full max-w-md">
              <ProgressBar
                value={total}
                max={TOTAL_MIN}
                colorClass="bg-gradient-to-r from-blue-500 to-blue-600"
                height="h-4"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>0</span>
                <span className="font-semibold text-blue-600">{Math.round((total / TOTAL_MIN) * 100)}%</span>
                <span>{TOTAL_MIN}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const complete = categoryComplete(cat.value);
          const rem = categoryRemaining(cat.value);
          return (
            <div
              key={cat.id}
              className={cn(
                'card p-5 transition-all hover:shadow-md',
                complete ? 'ring-emerald-200' : 'ring-amber-200',
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{cat.label}</p>
                  <div className="mt-2 flex items-end gap-1.5">
                    <span className="text-3xl font-bold text-slate-800">{cat.value}</span>
                    <span className="mb-1 text-lg font-semibold text-slate-400">/ {CATEGORY_MIN}</span>
                  </div>
                </div>
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    complete ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500',
                  )}
                >
                  {complete ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar
                  value={cat.value}
                  max={CATEGORY_MIN}
                  colorClass={complete ? 'bg-emerald-500' : 'bg-amber-500'}
                  height="h-2"
                />
              </div>
              <p className="mt-3 text-sm font-medium">
                {complete ? (
                  <span className="text-emerald-600">Requirement Completed</span>
                ) : (
                  <span className="text-amber-600">{rem} More Points Required</span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* AI Recommendation highlight */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">AI Recommended Activities</h2>
              <p className="text-xs text-slate-500">Personalized based on your missing activity points</p>
            </div>
          </div>
          {recommendations.length > 0 && (
            <button
              onClick={() => onNavigate('student-ai')}
              className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Best match highlight */}
        {topRec ? (
          <>
            <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-transparent p-5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                  <Sparkles className="h-3 w-3" /> Best Match
                </span>
                <span className="text-xs font-semibold text-slate-400">Rank #{topRec.rank}</span>
              </div>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800">{topRec.activity.title}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <CategoryBadge category={topRec.activity.category} />
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                      <Award className="h-3 w-3" /> {topRec.activity.points} Points
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                      <Calendar className="h-3 w-3" /> {topRec.activity.date}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm text-slate-600">{topRec.reason}</p>
                </div>
                <div className="flex flex-col items-center sm:items-end">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <svg className="h-20 w-20 -rotate-90">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 34 * (topRec.matchScore / 100)} ${2 * Math.PI * 34}`}
                      />
                    </svg>
                    <span className="absolute text-lg font-bold text-blue-600">{topRec.matchScore}%</span>
                  </div>
                  <span className="mt-1 text-xs font-medium text-slate-400">Match Score</span>
                </div>
              </div>
            </div>

            {/* Other recommendations */}
            {recommendations.slice(1, 4).length > 0 && (
              <div className="divide-y divide-slate-100">
                {recommendations.slice(1, 4).map((rec) => (
                  <div key={rec.activity.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-500">
                      #{rec.rank}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate text-sm font-semibold text-slate-800">{rec.activity.title}</h4>
                        <CategoryBadge category={rec.activity.category} />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{rec.reason}</p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-3 sm:flex">
                      <span className="text-xs font-semibold text-slate-500">{rec.activity.points} pts</span>
                      <div className="w-16">
                        <ProgressBar value={rec.matchScore} max={100} colorClass="bg-blue-500" height="h-1.5" />
                      </div>
                      <span className="w-10 text-right text-xs font-bold text-blue-600">{rec.matchScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-slate-100 p-3 sm:hidden">
              <button onClick={() => onNavigate('student-ai')} className="btn-ghost w-full">
                View all recommendations <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
            <p className="mt-2 text-sm font-semibold text-slate-800">All Eligible Activities Registered or Completed</p>
            <p className="mt-1 text-xs text-slate-400">
              Check Registered Activities to submit proofs, or wait for new activities from providers.
            </p>
            <button onClick={() => onNavigate('student-registered')} className="btn-primary mt-4 text-xs">
              Go to Registered Activities
            </button>
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Progress</p>
            <p className="text-lg font-bold text-slate-800">{Math.round((total / TOTAL_MIN) * 100)}%</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Categories Completed</p>
            <p className="text-lg font-bold text-slate-800">
              {categories.filter((c) => categoryComplete(c.value)).length} / 3
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Points Remaining</p>
            <p className="text-lg font-bold text-slate-800">{remaining}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
