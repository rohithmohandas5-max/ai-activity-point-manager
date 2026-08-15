import { useState } from 'react';
import { ClipboardCheck, Eye, CheckCircle2, XCircle, X, FileText, ImageIcon, Mail, Award, Calendar } from 'lucide-react';
import type { ProofSubmission } from '@/types/data';
import { categoryName } from '@/types/data';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';

interface VerificationRequestsPageProps {
  proofs: ProofSubmission[];
  onApprove: (proofId: string) => void;
  onReject: (proofId: string, reason: string) => void;
}

export function VerificationRequestsPage({ proofs, onApprove, onReject }: VerificationRequestsPageProps) {
  const [viewing, setViewing] = useState<ProofSubmission | null>(null);
  const [rejecting, setRejecting] = useState<ProofSubmission | null>(null);

  const pending = proofs.filter((p) => p.status === 'pending');
  const reviewed = proofs.filter((p) => p.status !== 'pending');

  return (
    <div>
      <PageHeader
        title="Verification Requests"
        subtitle="Review proof submissions for your activities"
        icon={<ClipboardCheck className="h-5 w-5" />}
      />

      <div className="mb-4 flex gap-4 text-sm">
        <span className="text-slate-500">
          Pending: <span className="font-bold text-amber-600">{pending.length}</span>
        </span>
        <span className="text-slate-500">
          Reviewed: <span className="font-bold text-slate-800">{reviewed.length}</span>
        </span>
      </div>

      {pending.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-600">Awaiting Verification</h3>
          <div className="space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="card p-5 transition-all hover:shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800">{p.studentName}</h4>
                      <CategoryBadge category={p.category} />
                      <span className="text-xs text-slate-400">{p.activityTitle}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {p.studentEmail}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Award className="h-3 w-3 text-blue-500" /> {p.points} pts
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {p.submissionDate}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {p.fileType.includes('pdf') ? <FileText className="h-3 w-3 text-rose-500" /> : <ImageIcon className="h-3 w-3 text-blue-500" />}
                        {p.fileName}
                      </span>
                    </div>
                    {p.note && <p className="mt-1.5 text-xs text-slate-500">Note: {p.note}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => setViewing(p)} className="btn-ghost px-3 py-2 text-xs">
                      <Eye className="h-3.5 w-3.5" /> View Proof
                    </button>
                    <button
                      onClick={() => setRejecting(p)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => onApprove(p.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Reviewed Submissions</h3>
          <div className="card overflow-hidden">
            <div className="divide-y divide-slate-50">
              {reviewed.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      p.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600',
                    )}
                  >
                    {p.status === 'approved' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-slate-800">{p.studentName}</span>
                      <CategoryBadge category={p.category} />
                    </div>
                    <p className="text-xs text-slate-400">{p.activityTitle}</p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
                      p.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : 'bg-rose-50 text-rose-700 ring-rose-200',
                    )}
                  >
                    {p.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                  <button onClick={() => setViewing(p)} className="btn-ghost px-3 py-1.5 text-xs">
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
          <ClipboardCheck className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-400">No verification requests yet.</p>
        </div>
      )}

      {/* View Proof Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewing(null)} />
          <div className="relative z-10 w-full max-w-lg">
            <div className="card max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Proof Details</h3>
                </div>
                <button onClick={() => setViewing(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Student</span>
                  <span className="font-semibold text-slate-800">{viewing.studentName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-slate-700">{viewing.studentEmail}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Activity</span>
                  <span className="font-semibold text-slate-800">{viewing.activityTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Category</span>
                  <CategoryBadge category={viewing.category} />
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Points</span>
                  <span className="font-semibold text-slate-800">{viewing.points}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">File Name</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    {viewing.fileType.includes('pdf') ? <FileText className="h-4 w-4 text-rose-500" /> : <ImageIcon className="h-4 w-4 text-blue-500" />}
                    {viewing.fileName}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">File Type</span>
                  <span className="font-medium text-slate-700">{viewing.fileType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Submission Date</span>
                  <span className="font-medium text-slate-700">{viewing.submissionDate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Status</span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
                      viewing.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                        : viewing.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 ring-amber-200'
                          : 'bg-rose-50 text-rose-700 ring-rose-200',
                    )}
                  >
                    {viewing.status === 'approved' ? 'Approved' : viewing.status === 'pending' ? 'Pending Verification' : 'Rejected'}
                  </span>
                </div>
                {viewing.note && (
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Student Note</span>
                    <span className="max-w-[60%] text-right font-medium text-slate-700">{viewing.note}</span>
                  </div>
                )}
                {viewing.rejectionReason && (
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Rejection Reason</span>
                    <span className="max-w-[60%] text-right font-medium text-rose-600">{viewing.rejectionReason}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-400">File preview is not available in this prototype.</p>
                <p className="mt-1 text-sm font-medium text-slate-600">{viewing.fileName}</p>
              </div>

              {viewing.status === 'pending' && (
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => { setRejecting(viewing); setViewing(null); }}
                    className="btn-ghost flex-1 text-rose-600 ring-rose-200"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                  <button
                    onClick={() => { onApprove(viewing.id); setViewing(null); }}
                    className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejecting && (
        <RejectModal
          proof={rejecting}
          onClose={() => setRejecting(null)}
          onReject={(reason) => {
            onReject(rejecting.id, reason);
            setRejecting(null);
          }}
        />
      )}
    </div>
  );
}

interface RejectModalProps {
  proof: ProofSubmission;
  onClose: () => void;
  onReject: (reason: string) => void;
}

const PRESET_REASONS = [
  'Invalid certificate',
  'Certificate unclear',
  'Incorrect document',
  'Activity not completed',
  'Student details do not match',
];

function RejectModal({ proof, onClose, onReject }: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [custom, setCustom] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalReason = reason === 'Custom' ? custom : reason;
    if (!finalReason.trim()) return;
    onReject(finalReason);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md">
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <XCircle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Reject Proof</h3>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">Student: <span className="font-semibold text-slate-800">{proof.studentName}</span></p>
            <p className="text-slate-500">Activity: <span className="font-semibold text-slate-800">{proof.activityTitle}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-slate-700">Reason for Rejection</label>
            <div className="space-y-2">
              {PRESET_REASONS.map((r) => (
                <label key={r} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-50">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-slate-700">{r}</span>
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-50">
                <input
                  type="radio"
                  name="reason"
                  value="Custom"
                  checked={reason === 'Custom'}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-slate-700">Custom reason</span>
              </label>
            </div>
            {reason === 'Custom' && (
              <textarea
                rows={2}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                className="input-field resize-none"
                placeholder="Enter custom reason..."
              />
            )}
            <div className="flex gap-3 pt-2">
              <button type="submit" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">
                <XCircle className="h-4 w-4" /> Reject Proof
              </button>
              <button type="button" onClick={onClose} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
