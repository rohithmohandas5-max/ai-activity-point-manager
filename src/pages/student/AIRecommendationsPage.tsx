import { Sparkles, Award, Calendar, ArrowRight, Star, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { Student, Activity, ProofSubmission, CompletedActivity } from '@/types/data';
import { buildRecommendations } from '@/types/progress';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';
import { ProgressBar } from '@/components/ProgressBar';
import { cn } from '@/lib/utils';

interface AIRecommendationsPageProps {
  student: Student;
  activities: Activity[];
  registrations: Set<string>;
  proofs: ProofSubmission[];
  completed: CompletedActivity[];
  onNavigate: (key: string) => void;
}

function scoreColor(score: number): string {
  if (score >= 90) return 'text-blue-600';
  if (score >= 60) return 'text-indigo-500';
  return 'text-slate-500';
}

export function AIRecommendationsPage({
  student,
  activities,
  registrations,
  proofs,
  completed,
  onNavigate,
}: AIRecommendationsPageProps) {
  const recommendations = buildRecommendations({
    student,
    activities,
    registrations,
    proofs,
    completed,
  });

  return (
    <div>
      <PageHeader
        title="AI Recommended Activities"
        subtitle="Intelligent recommendations based on your missing activity points"
        icon={<Sparkles className="h-5 w-5" />}
      />

      {/* AI banner */}
      <div className="card mb-6 overflow-hidden">
        <div className="flex flex-col gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Recommendation Engine</h2>
              <p className="text-sm text-blue-100">
                Analyzing your activity points to suggest the best matches
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-2xl font-bold">{recommendations.length}</p>
              <p className="text-xs text-blue-100">Activities matched</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{recommendations[0]?.matchScore ?? 0}%</p>
              <p className="text-xs text-blue-100">Top match score</p>
            </div>
          </div>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="card p-12 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          <h3 className="mt-3 text-lg font-bold text-slate-800">No Pending Activity Recommendations</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            You have already registered for, completed, or submitted proof for all currently eligible activities!
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => onNavigate('student-registered')} className="btn-primary">
              View Registered Activities
            </button>
            <button onClick={() => onNavigate('student-activities')} className="btn-ghost">
              Browse All Activities
            </button>
          </div>
        </div>
      ) : (
        /* Ranked recommendations */
        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <div
              key={rec.activity.id}
              className={cn(
                'card animate-fade-in-up overflow-hidden transition-all hover:shadow-md',
                idx === 0 && 'ring-2 ring-blue-300',
              )}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row">
                {/* Rank */}
                <div className="flex items-center gap-3 sm:flex-col sm:items-center">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold',
                      idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {idx === 0 ? <Star className="h-5 w-5 fill-current" /> : `#${rec.rank}`}
                  </div>
                  {idx === 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                      <Sparkles className="h-3 w-3" /> Best Match
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-800">{rec.activity.title}</h3>
                    <CategoryBadge category={rec.activity.category} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{rec.activity.description}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-blue-500" /> {rec.activity.points} Points
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-500" /> {rec.activity.date}
                    </span>
                  </div>

                  <div className="mt-3 rounded-xl bg-blue-50/60 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                      Recommendation Reason
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{rec.reason}</p>
                  </div>
                </div>

                {/* Match score */}
                <div className="flex shrink-0 flex-row items-center gap-4 sm:flex-col sm:items-center sm:justify-center">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <svg className="h-20 w-20 -rotate-90">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke={rec.matchScore >= 90 ? '#2563eb' : rec.matchScore >= 60 ? '#6366f1' : '#94a3b8'}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 34 * (rec.matchScore / 100)} ${2 * Math.PI * 34}`}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className={cn('text-lg font-bold', scoreColor(rec.matchScore))}>
                        {rec.matchScore}%
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400">Match</span>
                </div>
              </div>

              {/* Match bar */}
              <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <ProgressBar value={rec.matchScore} max={100} colorClass="bg-blue-500" height="h-1.5" />
                </div>
                <button
                  onClick={() => onNavigate('student-activities')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Register <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
