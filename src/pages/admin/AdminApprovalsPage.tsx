import { useState } from 'react';
import { ClipboardList, CheckCircle2, XCircle, Eye, X } from 'lucide-react';
import type { Activity } from '@/types/data';
import { categoryName } from '@/types/data';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';
import { StatusPill } from '@/components/StatusPill';
import { cn } from '@/lib/utils';

interface AdminApprovalsPageProps {
  activities: Activity[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function AdminApprovalsPage({ activities, onApprove, onReject }: AdminApprovalsPageProps) {
  const [viewing, setViewing] = useState<Activity | null>(null);

  const pending = activities.filter((a) => a.status === 'pending');
  const reviewed = activities.filter((a) => a.status !== 'pending');

  return (
    <div>
      <PageHeader title="Approvals" subtitle="Review and approve activity submissions" icon={<ClipboardList className="h-5 w-5" />} />

      <div className="mb-4 flex gap-4 text-sm">
        <span className="text-slate-500">
          Pending: <span className="font-bold text-amber-600">{pending.length}</span>
        </span>
        <span className="text-slate-500">
          Reviewed: <span className="font-bold text-slate-800">{reviewed.length}</span>
        </span>
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-600">Awaiting Review</h3>
          <div className="space-y-3">
            {pending.map((a) => (
              <div key={a.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800">{a.title}</h4>
                    <CategoryBadge category={a.category} />
                    <span className="text-xs text-slate-400">by {a.provider}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">{a.description}</p>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{a.points} points</span>
                    <span>{a.date}</span>
                    <span>{a.venue}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => setViewing(a)} className="btn-ghost px-3 py-2 text-xs">
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  <button onClick={() => onReject(a.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button onClick={() => onApprove(a.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Recently Reviewed</h3>
          <div className="card overflow-hidden">
            <div className="divide-y divide-slate-50">
              {reviewed.map((a) => (
                <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50">
                  <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', a.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}>
                    {a.status === 'approved' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-slate-800">{a.title}</span>
                      <CategoryBadge category={a.category} />
                    </div>
                    <p className="text-xs text-slate-400">by {a.provider}</p>
                  </div>
                  <StatusPill status={a.status === 'approved' ? 'Approved' : 'Rejected'} />
                  <button onClick={() => setViewing(a)} className="btn-ghost px-3 py-1.5 text-xs">
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {pending.length === 0 && reviewed.length === 0 && (
        <div className="card p-12 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-400">No activities to review.</p>
        </div>
      )}

      {/* Detail modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewing(null)} />
          <div className="relative z-10 w-full max-w-lg">
            <div className="card max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">{viewing.title}</h3>
                  <StatusPill status={viewing.status === 'approved' ? 'Approved' : viewing.status === 'pending' ? 'Pending' : 'Rejected'} />
                </div>
                <button onClick={() => setViewing(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-3 text-sm text-slate-600">{viewing.description}</p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Category</span>
                  <CategoryBadge category={viewing.category} />
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Points Offered</span>
                  <span className="font-semibold text-slate-800">{viewing.points}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Activity Date</span>
                  <span className="font-medium text-slate-700">{viewing.date}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Registration Deadline</span>
                  <span className="font-medium text-slate-700">{viewing.deadline}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Venue</span>
                  <span className="font-medium text-slate-700">{viewing.venue}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Eligibility</span>
                  <span className="font-medium text-slate-700">{viewing.eligibility}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Provider</span>
                  <span className="font-medium text-slate-700">{viewing.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registration Link</span>
                  <span className="font-medium text-blue-600">{viewing.link}</span>
                </div>
              </div>

              {viewing.status === 'pending' && (
                <div className="mt-6 flex gap-3">
                  <button onClick={() => { onReject(viewing.id); setViewing(null); }} className="btn-ghost flex-1 text-rose-600 ring-rose-200">
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                  <button onClick={() => { onApprove(viewing.id); setViewing(null); }} className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
