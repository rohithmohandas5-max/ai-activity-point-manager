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
  Loader2,
} from 'lucide-react';

import type { ProofSubmission } from '@/types/data';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';

interface PointVerificationsPageProps {
  proofs: ProofSubmission[];
  onApprove: (proofId: string) => Promise<boolean>;
  onReject: (
    proofId: string,
    reason: string,
  ) => Promise<boolean>;
}

export function PointVerificationsPage({
  proofs,
  onApprove,
  onReject,
}: PointVerificationsPageProps) {
  const [viewing, setViewing] =
    useState<ProofSubmission | null>(null);

  const [rejecting, setRejecting] =
    useState<ProofSubmission | null>(null);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState<
      'all' | 'pending' | 'approved' | 'rejected'
    >('all');

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const pending = proofs.filter(
    (p) => p.status === 'pending',
  );

  const approved = proofs.filter(
    (p) => p.status === 'approved',
  );

  const rejected = proofs.filter(
    (p) => p.status === 'rejected',
  );

  const filteredProofs = proofs.filter((p) => {
    const search =
      searchQuery.toLowerCase();

    const matchesSearch =
      p.studentName
        .toLowerCase()
        .includes(search) ||
      p.studentEmail
        .toLowerCase()
        .includes(search) ||
      p.activityTitle
        .toLowerCase()
        .includes(search) ||
      p.provider
        .toLowerCase()
        .includes(search);

    const matchesFilter =
      statusFilter === 'all' ||
      p.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  async function approveProof(
    proofId: string,
  ) {
    if (processingId) return;

    setProcessingId(proofId);

    const success =
      await onApprove(proofId);

    setProcessingId(null);

    if (success) {
      setViewing(null);
    }
  }

  async function rejectProof(
    proofId: string,
    reason: string,
  ) {
    if (processingId) return;

    setProcessingId(proofId);

    const success =
      await onReject(
        proofId,
        reason,
      );

    setProcessingId(null);

    if (success) {
      setRejecting(null);
      setViewing(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Point Verifications"
        subtitle="Review student proof submissions and approve activity points"
        icon={
          <ClipboardCheck className="h-5 w-5" />
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          onClick={() =>
            setStatusFilter('all')
          }
          className={cn(
            'card p-4 text-left transition-all',
            statusFilter === 'all' &&
              'ring-2 ring-blue-500',
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Total Proofs
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-800">
            {proofs.length}
          </p>
        </button>

        <button
          onClick={() =>
            setStatusFilter('pending')
          }
          className={cn(
            'card p-4 text-left transition-all',
            statusFilter === 'pending' &&
              'ring-2 ring-amber-500',
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
            Pending Review
          </p>

          <p className="mt-1 text-2xl font-bold text-amber-600">
            {pending.length}
          </p>
        </button>

        <button
          onClick={() =>
            setStatusFilter('approved')
          }
          className={cn(
            'card p-4 text-left transition-all',
            statusFilter === 'approved' &&
              'ring-2 ring-emerald-500',
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Points Awarded
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {approved.length}
          </p>
        </button>

        <button
          onClick={() =>
            setStatusFilter('rejected')
          }
          className={cn(
            'card p-4 text-left transition-all',
            statusFilter === 'rejected' &&
              'ring-2 ring-rose-500',
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
            Rejected
          </p>

          <p className="mt-1 text-2xl font-bold text-rose-600">
            {rejected.length}
          </p>
        </button>
      </div>

      {statusFilter !== 'approved' &&
        statusFilter !== 'rejected' &&
        pending.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-600">
              Awaiting Verification (
              {pending.length})
            </h3>

            <div className="space-y-3">
              {pending.map((p) => (
                <div
                  key={p.id}
                  className="card p-5 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                      <ClipboardCheck className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-slate-800">
                          {p.studentName}
                        </h4>

                        <CategoryBadge
                          category={p.category}
                        />

                        <span className="text-xs font-medium text-slate-400">
                          by {p.provider}
                        </span>
                      </div>

                      <p className="mt-0.5 text-sm font-medium text-slate-700">
                        {p.activityTitle}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        {p.studentEmail && (
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {p.studentEmail}
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
                          <Award className="h-3.5 w-3.5" />
                          {p.points} Points
                          to Award
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Submitted:{' '}
                          {p.submissionDate}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          {p.fileName
                            .toLowerCase()
                            .endsWith(
                              '.pdf',
                            ) ? (
                            <FileText className="h-3.5 w-3.5 text-rose-500" />
                          ) : (
                            <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
                          )}

                          {p.fileName}
                        </span>
                      </div>

                      {p.note && (
                        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                          <span className="font-semibold">
                            Student Note:
                          </span>{' '}
                          {p.note}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() =>
                          setViewing(p)
                        }
                        className="btn-ghost px-3.5 py-2 text-xs"
                      >
                        <Eye className="h-4 w-4" />
                        View Proof
                      </button>

                      <button
                        disabled={
                          processingId ===
                          p.id
                        }
                        onClick={() =>
                          setRejecting(p)
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100 disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>

                      <button
                        disabled={
                          processingId ===
                          p.id
                        }
                        onClick={() =>
                          void approveProof(
                            p.id,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {processingId ===
                        p.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}

                        Approve & Award
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value,
              )
            }
            className="input-field pl-10"
            placeholder="Search by student, activity, or provider..."
          />
        </div>

        <div className="flex gap-2">
          {(
            [
              'all',
              'pending',
              'approved',
              'rejected',
            ] as const
          ).map((filter) => (
            <button
              key={filter}
              onClick={() =>
                setStatusFilter(
                  filter,
                )
              }
              className={cn(
                'rounded-xl px-3.5 py-2 text-xs font-semibold capitalize transition-colors',
                statusFilter ===
                  filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3.5">
          <h3 className="text-sm font-bold text-slate-800">
            All Proof Verification
            Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">
                  Student
                </th>
                <th className="px-5 py-3">
                  Activity
                </th>
                <th className="px-5 py-3">
                  Category
                </th>
                <th className="px-5 py-3">
                  Points
                </th>
                <th className="px-5 py-3">
                  Provider
                </th>
                <th className="px-5 py-3">
                  Proof
                </th>
                <th className="px-5 py-3">
                  Status
                </th>
                <th className="px-5 py-3">
                  Submitted
                </th>
                <th className="px-5 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredProofs.map(
                (p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3.5 font-medium">
                      {p.studentName}
                    </td>

                    <td className="px-5 py-3.5">
                      {p.activityTitle}
                    </td>

                    <td className="px-5 py-3.5">
                      <CategoryBadge
                        category={
                          p.category
                        }
                      />
                    </td>

                    <td className="px-5 py-3.5 font-bold">
                      {p.points}
                    </td>

                    <td className="px-5 py-3.5 text-xs">
                      {p.provider}
                    </td>

                    <td className="px-5 py-3.5 text-xs">
                      {p.fileName}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                          p.status ===
                            'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.status ===
                                'pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700',
                        )}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-xs">
                      {p.submissionDate}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() =>
                          setViewing(p)
                        }
                        className="btn-ghost px-2.5 py-1 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {filteredProofs.length ===
          0 && (
          <div className="px-6 py-12 text-center text-sm text-slate-400">
            No proof verification
            records found.
          </div>
        )}
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() =>
              setViewing(null)
            }
          />

          <div className="relative z-10 w-full max-w-xl">
            <div className="card max-h-[92vh] overflow-y-auto p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold">
                  Proof Verification
                  Details
                </h3>

                <button
                  onClick={() =>
                    setViewing(null)
                  }
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <p>
                  <strong>
                    Student:
                  </strong>{' '}
                  {viewing.studentName}
                </p>

                <p>
                  <strong>
                    Activity:
                  </strong>{' '}
                  {viewing.activityTitle}
                </p>

                <p>
                  <strong>
                    Points:
                  </strong>{' '}
                  {viewing.points}
                </p>

                <p>
                  <strong>
                    Provider:
                  </strong>{' '}
                  {viewing.provider}
                </p>

                {viewing.note && (
                  <p>
                    <strong>
                      Student Note:
                    </strong>{' '}
                    {viewing.note}
                  </p>
                )}
              </div>

              {viewing.previewUrl && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex justify-end">
                    <a
                      href={
                        viewing.previewUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600"
                    >
                      Open in new tab
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {viewing.fileName
                    .toLowerCase()
                    .endsWith(
                      '.pdf',
                    ) ? (
                    <iframe
                      src={
                        viewing.previewUrl
                      }
                      className="h-80 w-full"
                      title="Proof"
                    />
                  ) : (
                    <img
                      src={
                        viewing.previewUrl
                      }
                      alt="Proof"
                      className="mx-auto max-h-80"
                    />
                  )}
                </div>
              )}

              {viewing.status ===
                'pending' && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setRejecting(
                        viewing,
                      );

                      setViewing(null);
                    }}
                    className="btn-ghost flex-1 text-rose-600"
                  >
                    Reject Proof
                  </button>

                  <button
                    disabled={
                      processingId ===
                      viewing.id
                    }
                    onClick={() =>
                      void approveProof(
                        viewing.id,
                      )
                    }
                    className="btn-primary flex-1 bg-emerald-600"
                  >
                    Approve & Award
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {rejecting && (
        <RejectModal
          proof={rejecting}
          busy={
            processingId ===
            rejecting.id
          }
          onClose={() =>
            setRejecting(null)
          }
          onReject={(reason) =>
            void rejectProof(
              rejecting.id,
              reason,
            )
          }
        />
      )}
    </div>
  );
}

interface RejectModalProps {
  proof: ProofSubmission;
  busy: boolean;
  onClose: () => void;
  onReject: (
    reason: string,
  ) => void;
}

const PRESET_REASONS = [
  'Invalid certificate',
  'Certificate unclear',
  'Incorrect document',
  'Activity not completed',
  'Student details do not match',
];

function RejectModal({
  proof,
  busy,
  onClose,
  onReject,
}: RejectModalProps) {
  const [reason, setReason] =
    useState('');

  const [custom, setCustom] =
    useState('');

  function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    const finalReason =
      reason === 'Custom'
        ? custom
        : reason;

    if (!finalReason.trim()) {
      return;
    }

    onReject(
      finalReason.trim(),
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40"
        onClick={
          busy
            ? undefined
            : onClose
        }
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="card p-6">
          <h3 className="text-lg font-bold">
            Reject Proof Submission
          </h3>

          <p className="mt-3 text-sm">
            {proof.studentName} —{' '}
            {proof.activityTitle}
          </p>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-4 space-y-3"
          >
            {PRESET_REASONS.map(
              (item) => (
                <label
                  key={item}
                  className="flex gap-2 text-sm"
                >
                  <input
                    type="radio"
                    value={item}
                    checked={
                      reason === item
                    }
                    onChange={(e) =>
                      setReason(
                        e.target.value,
                      )
                    }
                  />

                  {item}
                </label>
              ),
            )}

            <label className="flex gap-2 text-sm">
              <input
                type="radio"
                value="Custom"
                checked={
                  reason ===
                  'Custom'
                }
                onChange={(e) =>
                  setReason(
                    e.target.value,
                  )
                }
              />

              Custom reason
            </label>

            {reason ===
              'Custom' && (
              <textarea
                value={custom}
                onChange={(e) =>
                  setCustom(
                    e.target.value,
                  )
                }
                className="input-field"
                required
              />
            )}

            <button
              type="submit"
              disabled={
                busy ||
                !reason ||
                (reason ===
                  'Custom' &&
                  !custom.trim())
              }
              className="w-full rounded-xl bg-rose-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50"
            >
              {busy
                ? 'Rejecting...'
                : 'Reject Proof'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}