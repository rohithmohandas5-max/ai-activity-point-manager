import { useState } from 'react';
import {
  ClipboardCheck,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  ImageIcon,
  Mail,
  Award,
  Calendar,
  Search,
  ExternalLink,
} from 'lucide-react';
import type { ProofSubmission } from '@/types/data';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';

interface PointVerificationsPageProps {
  proofs: ProofSubmission[];
  onApprove: (proofId: string) => void;
  onReject: (proofId: string, reason: string) => void;
}

export function PointVerificationsPage({ proofs, onApprove, onReject }: PointVerificationsPageProps) {
  const [viewing, setViewing] = useState<ProofSubmission | null>(null);
  const [rejecting, setRejecting] = useState<ProofSubmission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const pending = proofs.filter((p) => p.status === 'pending');
  const approved = proofs.filter((p) => p.status === 'approved');
  const rejected = proofs.filter((p) => p.status === 'rejected');

  const filteredProofs = proofs.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.activityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <PageHeader
        title="Point Verifications"
        subtitle="Review student proof submissions and approve activity points"
        icon={<ClipboardCheck className="h-5 w-5" />}
      />

      {/* Summary Stat Counters */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={cn(
            'card p-4 text-left transition-all',
            statusFilter === 'all' && 'ring-2 ring-blue-500',
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Proofs</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{proofs.length}</p>
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={cn(
            'card p-4 text-left transition-all',
            statusFilter === 'pending' && 'ring-2 ring-amber-500',
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Pending Review</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{pending.length}</p>
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={cn(
            'card p-4 text-left transition-all',
            statusFilter === 'approved' && 'ring-2 ring-emerald-500',
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Points Awarded</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{approved.length}</p>
        </button>
        <button
          onClick={() => setStatusFilter('rejected')}
          className={cn(
            'card p-4 text-left transition-all',
            statusFilter === 'rejected' && 'ring-2 ring-rose-500',
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-rose-600">{rejected.length}</p>
        </button>
      </div>

      {/* Pending Proofs Awaiting Verification Action Cards */}
      {statusFilter !== 'approved' && statusFilter !== 'rejected' && pending.length > 0 && (
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-amber-600">
              Awaiting Verification ({pending.length})
            </h3>
          </div>
          <div className="space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="card p-5 transition-all hover:shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-800">{p.studentName}</h4>
                      <CategoryBadge category={p.category} />
                      <span className="text-xs font-medium text-slate-400">by {p.provider}</span>
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-slate-700">{p.activityTitle}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> {p.studentEmail}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
                        <Award className="h-3.5 w-3.5" /> {p.points} Points to Award
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> Submitted: {p.submissionDate}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {p.fileType.includes('pdf') ? (
                          <FileText className="h-3.5 w-3.5 text-rose-500" />
                        ) : (
                          <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
                        )}
                        {p.fileName}
                      </span>
                    </div>
                    {p.note && (
                      <p className="mt-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                        <span className="font-semibold text-slate-500">Student Note:</span> {p.note}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button onClick={() => setViewing(p)} className="btn-ghost px-3.5 py-2 text-xs">
                      <Eye className="h-4 w-4" /> View Proof
                    </button>
                    <button
                      onClick={() => setRejecting(p)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                    <button
                      onClick={() => onApprove(p.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-95"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve & Award
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
            placeholder="Search by student, activity, or provider..."
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={cn(
                'rounded-xl px-3.5 py-2 text-xs font-semibold capitalize transition-colors',
                statusFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* All Submissions Table */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3.5">
          <h3 className="text-sm font-bold text-slate-800">All Proof Verification Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-5 py-3 font-semibold">Activity</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Points</th>
                <th className="px-5 py-3 font-semibold">Provider</th>
                <th className="px-5 py-3 font-semibold">Proof File</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Submitted</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProofs.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">{p.studentName}</span>
                      <span className="text-xs text-slate-400">{p.studentEmail}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">{p.activityTitle}</td>
                  <td className="px-5 py-3.5">
                    <CategoryBadge category={p.category} />
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-700">{p.points}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-600">{p.provider}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      {p.fileType.includes('pdf') ? (
                        <FileText className="h-3.5 w-3.5 text-rose-500" />
                      ) : (
                        <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
                      )}
                      <span className="max-w-[120px] truncate">{p.fileName}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
                        p.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                          : p.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 ring-amber-200'
                            : 'bg-rose-50 text-rose-700 ring-rose-200',
                      )}
                    >
                      {p.status === 'approved' ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Approved
                        </>
                      ) : p.status === 'pending' ? (
                        <>
                          <span className="text-[10px]">{'\u25CF'}</span> Pending
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> Rejected
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{p.submissionDate}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewing(p)} className="btn-ghost px-2.5 py-1 text-xs">
                        <Eye className="h-3.5 w-3.5" /> Details
                      </button>
                      {p.status === 'pending' && (
                        <>
                          <button
                            onClick={() => setRejecting(p)}
                            title="Reject Proof"
                            className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onApprove(p.id)}
                            title="Approve and Award Points"
                            className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProofs.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-slate-400">
            No proof verification records found matching your filters.
          </div>
        )}
      </div>

      {/* View Proof Details Modal with Image/PDF Preview */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewing(null)} />
          <div className="relative z-10 w-full max-w-xl">
            <div className="card max-h-[92vh] overflow-y-auto p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Proof Verification Details</h3>
                </div>
                <button onClick={() => setViewing(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Student Name</span>
                  <span className="font-semibold text-slate-800">{viewing.studentName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Email Address</span>
                  <span className="font-medium text-slate-700">{viewing.studentEmail}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Activity Name</span>
                  <span className="font-semibold text-slate-800">{viewing.activityTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Point Category</span>
                  <CategoryBadge category={viewing.category} />
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Points to Award</span>
                  <span className="font-bold text-blue-600">{viewing.points} Points</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Activity Provider</span>
                  <span className="font-medium text-slate-700">{viewing.provider}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Uploaded File</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    {viewing.fileType.includes('pdf') ? (
                      <FileText className="h-4 w-4 text-rose-500" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-blue-500" />
                    )}
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
                  <span className="text-slate-500">Current Status</span>
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
                    {viewing.status === 'approved'
                      ? 'Approved'
                      : viewing.status === 'pending'
                        ? 'Pending Verification'
                        : 'Rejected'}
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
                    <span className="max-w-[60%] text-right font-medium text-rose-600">
                      {viewing.rejectionReason}
                    </span>
                  </div>
                )}
              </div>

              {/* Document / Image / PDF Preview Section */}
              <div className="mt-4">
                {viewing.previewUrl ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Document Preview
                      </span>
                      <a
                        href={viewing.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Open in new tab <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    {viewing.fileType.includes('pdf') || viewing.fileName.toLowerCase().endsWith('.pdf') ? (
                      <div className="space-y-2">
                        <iframe
                          src={viewing.previewUrl}
                          className="h-80 w-full rounded-lg border border-slate-200 bg-white"
                          title={`Proof PDF - ${viewing.fileName}`}
                        />
                        <p className="text-center text-xs text-slate-400">
                          Viewing {viewing.fileName}. If PDF does not display, click 'Open in new tab'.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg bg-slate-900/5 p-2">
                        <img
                          src={viewing.previewUrl}
                          alt={`Proof - ${viewing.fileName}`}
                          className="max-h-80 w-auto max-w-full rounded-lg object-contain shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-4 text-center">
                    <p className="text-xs text-slate-400">File preview is not available for this sample record.</p>
                    <p className="mt-1 text-sm font-medium text-slate-600">{viewing.fileName}</p>
                  </div>
                )}
              </div>

              {viewing.status === 'pending' && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setRejecting(viewing);
                      setViewing(null);
                    }}
                    className="btn-ghost flex-1 text-rose-600 ring-rose-200 hover:bg-rose-50"
                  >
                    <XCircle className="h-4 w-4" /> Reject Proof
                  </button>
                  <button
                    onClick={() => {
                      onApprove(viewing.id);
                      setViewing(null);
                    }}
                    className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve & Award Points
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
              <h3 className="text-lg font-bold text-slate-800">Reject Proof Submission</h3>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">
              Student: <span className="font-semibold text-slate-800">{proof.studentName}</span>
            </p>
            <p className="text-slate-500">
              Activity: <span className="font-semibold text-slate-800">{proof.activityTitle}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-slate-700">Reason for Rejection</label>
            <div className="space-y-2">
              {PRESET_REASONS.map((r) => (
                <label
                  key={r}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-50"
                >
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
                required
              />
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={!reason || (reason === 'Custom' && !custom.trim())}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
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
