import { useState } from 'react';

import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  ExternalLink,
} from 'lucide-react';

import type { Activity } from '@/types/data';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';
import { StatusPill } from '@/components/StatusPill';
import { cn } from '@/lib/utils';

interface AdminApprovalsPageProps {
  activities: Activity[];

  onApprove: (
    id: string,
  ) => void | Promise<void>;

  onReject: (
    id: string,
    reason: string,
  ) => void | Promise<void>;
}

const REJECTION_REASONS = [
  'Activity details are incomplete',
  'Invalid activity information',
  'Activity does not meet university requirements',
  'Incorrect activity point category',
  'Points offered are not appropriate',
  'Registration details are incomplete',
];

export function AdminApprovalsPage({
  activities,
  onApprove,
  onReject,
}: AdminApprovalsPageProps) {
  const [
    viewing,
    setViewing,
  ] =
    useState<Activity | null>(
      null,
    );

  const [
    rejecting,
    setRejecting,
  ] =
    useState<Activity | null>(
      null,
    );

  const [
    selectedReason,
    setSelectedReason,
  ] = useState('');

  const [
    customReason,
    setCustomReason,
  ] = useState('');

  const [
    rejectingActivity,
    setRejectingActivity,
  ] = useState(false);

  const [
    approvingId,
    setApprovingId,
  ] =
    useState<string | null>(
      null,
    );

  const pending =
    activities.filter(
      (activity) =>
        activity.status ===
        'pending',
    );

  const reviewed =
    activities.filter(
      (activity) =>
        activity.status !==
        'pending',
    );

  function openRejectModal(
    activity: Activity,
  ) {
    setRejecting(activity);
    setSelectedReason('');
    setCustomReason('');
  }

  function closeRejectModal() {
    if (rejectingActivity) {
      return;
    }

    setRejecting(null);
    setSelectedReason('');
    setCustomReason('');
  }

  async function handleApprove(
    activity: Activity,
  ) {
    if (approvingId) {
      return;
    }

    setApprovingId(
      activity.id,
    );

    try {
      await onApprove(
        activity.id,
      );

      if (
        viewing?.id ===
        activity.id
      ) {
        setViewing(null);
      }
    } finally {
      setApprovingId(null);
    }
  }

  async function handleRejectSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (!rejecting) {
      return;
    }

    const finalReason =
      selectedReason ===
      'Custom'
        ? customReason.trim()
        : selectedReason.trim();

    if (!finalReason) {
      return;
    }

    setRejectingActivity(
      true,
    );

    try {
      await onReject(
        rejecting.id,
        finalReason,
      );

      if (
        viewing?.id ===
        rejecting.id
      ) {
        setViewing(null);
      }

      setRejecting(null);
      setSelectedReason('');
      setCustomReason('');
    } finally {
      setRejectingActivity(
        false,
      );
    }
  }

  return (
    <div>
      <PageHeader
        title="Approvals"
        subtitle="Review and approve activity submissions"
        icon={
          <ClipboardList className="h-5 w-5" />
        }
      />

      <div className="mb-4 flex gap-4 text-sm">
        <span className="text-slate-500">
          Pending:{' '}
          <span className="font-bold text-amber-600">
            {pending.length}
          </span>
        </span>

        <span className="text-slate-500">
          Reviewed:{' '}
          <span className="font-bold text-slate-800">
            {reviewed.length}
          </span>
        </span>
      </div>

      {pending.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-600">
            Awaiting Review
          </h3>

          <div className="space-y-3">
            {pending.map(
              (activity) => (
                <div
                  key={
                    activity.id
                  }
                  className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                    <ClipboardList className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800">
                        {
                          activity.title
                        }
                      </h4>

                      <CategoryBadge
                        category={
                          activity.category
                        }
                      />

                      <span className="text-xs text-slate-400">
                        by{' '}
                        {
                          activity.provider
                        }
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {
                        activity.description
                      }
                    </p>

                    <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>
                        {
                          activity.points
                        }{' '}
                        points
                      </span>

                      <span>
                        {
                          activity.date
                        }
                      </span>

                      <span>
                        {
                          activity.venue
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setViewing(
                          activity,
                        )
                      }
                      className="btn-ghost px-3 py-2 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />

                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openRejectModal(
                          activity,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
                    >
                      <XCircle className="h-3.5 w-3.5" />

                      Reject
                    </button>

                    <button
                      type="button"
                      disabled={
                        approvingId ===
                        activity.id
                      }
                      onClick={() =>
                        void handleApprove(
                          activity,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />

                      {approvingId ===
                      activity.id
                        ? 'Approving...'
                        : 'Approve'}
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Recently Reviewed
          </h3>

          <div className="card overflow-hidden">
            <div className="divide-y divide-slate-50">
              {reviewed.map(
                (activity) => (
                  <div
                    key={
                      activity.id
                    }
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50"
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        activity.status ===
                          'approved'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600',
                      )}
                    >
                      {activity.status ===
                      'approved' ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-slate-800">
                          {
                            activity.title
                          }
                        </span>

                        <CategoryBadge
                          category={
                            activity.category
                          }
                        />
                      </div>

                      <p className="text-xs text-slate-400">
                        by{' '}
                        {
                          activity.provider
                        }
                      </p>

                      {activity.status ===
                        'rejected' &&
                        activity.rejectionReason && (
                          <p className="mt-1 truncate text-xs text-rose-500">
                            Reason:{' '}
                            {
                              activity.rejectionReason
                            }
                          </p>
                        )}
                    </div>

                    <StatusPill
                      status={
                        activity.status ===
                        'approved'
                          ? 'Approved'
                          : 'Rejected'
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setViewing(
                          activity,
                        )
                      }
                      className="btn-ghost px-3 py-1.5 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {pending.length === 0 &&
        reviewed.length === 0 && (
          <div className="card p-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm text-slate-400">
              No activities to review.
            </p>
          </div>
        )}

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() =>
              setViewing(null)
            }
          />

          <div className="relative z-10 w-full max-w-lg">
            <div className="card max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">
                    {
                      viewing.title
                    }
                  </h3>

                  <StatusPill
                    status={
                      viewing.status ===
                      'approved'
                        ? 'Approved'
                        : viewing.status ===
                            'pending'
                          ? 'Pending'
                          : 'Rejected'
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setViewing(null)
                  }
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                {
                  viewing.description
                }
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500">
                    Category
                  </span>

                  <CategoryBadge
                    category={
                      viewing.category
                    }
                  />
                </div>

                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500">
                    Points Offered
                  </span>

                  <span className="font-semibold text-slate-800">
                    {
                      viewing.points
                    }
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500">
                    Activity Date
                  </span>

                  <span className="text-right font-medium text-slate-700">
                    {
                      viewing.date
                    }
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500">
                    Registration Deadline
                  </span>

                  <span className="text-right font-medium text-slate-700">
                    {
                      viewing.deadline
                    }
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500">
                    Venue
                  </span>

                  <span className="text-right font-medium text-slate-700">
                    {
                      viewing.venue
                    }
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500">
                    Eligibility
                  </span>

                  <span className="max-w-[65%] text-right font-medium text-slate-700">
                    {
                      viewing.eligibility
                    }
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500">
                    Provider
                  </span>

                  <span className="text-right font-medium text-slate-700">
                    {
                      viewing.provider
                    }
                  </span>
                </div>

                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="text-slate-500">
                    Registration Link
                  </span>

                  {viewing.link ? (
                    <a
                      href={
                        viewing.link
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex max-w-[65%] items-center gap-1 break-all text-right font-medium text-blue-600 hover:text-blue-700"
                    >
                      Open link

                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-slate-400">
                      Not provided
                    </span>
                  )}
                </div>

                {viewing.status ===
                  'rejected' &&
                  viewing.rejectionReason && (
                    <div className="flex justify-between gap-4 rounded-xl bg-rose-50 p-3">
                      <span className="text-rose-600">
                        Rejection Reason
                      </span>

                      <span className="max-w-[65%] text-right font-medium text-rose-700">
                        {
                          viewing.rejectionReason
                        }
                      </span>
                    </div>
                  )}
              </div>

              {viewing.status ===
                'pending' && (
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      openRejectModal(
                        viewing,
                      );
                    }}
                    className="btn-ghost flex-1 text-rose-600 ring-rose-200 hover:bg-rose-50"
                  >
                    <XCircle className="h-4 w-4" />

                    Reject
                  </button>

                  <button
                    type="button"
                    disabled={
                      approvingId ===
                      viewing.id
                    }
                    onClick={() =>
                      void handleApprove(
                        viewing,
                      )
                    }
                    className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" />

                    {approvingId ===
                    viewing.id
                      ? 'Approving...'
                      : 'Approve'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {rejecting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={
              rejectingActivity
                ? undefined
                : closeRejectModal
            }
          />

          <div className="relative z-10 w-full max-w-md">
            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <XCircle className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-800">
                    Reject Activity
                  </h3>
                </div>

                <button
                  type="button"
                  disabled={
                    rejectingActivity
                  }
                  onClick={
                    closeRejectModal
                  }
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">
                  Activity
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {
                    rejecting.title
                  }
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Provider:{' '}
                  <span className="font-medium text-slate-700">
                    {
                      rejecting.provider
                    }
                  </span>
                </p>
              </div>

              <form
                onSubmit={
                  handleRejectSubmit
                }
                className="mt-5 space-y-3"
              >
                <label className="block text-sm font-medium text-slate-700">
                  Reason for Rejection
                </label>

                <div className="space-y-2">
                  {REJECTION_REASONS.map(
                    (reason) => (
                      <label
                        key={
                          reason
                        }
                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-50"
                      >
                        <input
                          type="radio"
                          name="activity-rejection-reason"
                          value={
                            reason
                          }
                          disabled={
                            rejectingActivity
                          }
                          checked={
                            selectedReason ===
                            reason
                          }
                          onChange={(
                            event,
                          ) =>
                            setSelectedReason(
                              event
                                .target
                                .value,
                            )
                          }
                          className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                        />

                        <span className="text-slate-700">
                          {
                            reason
                          }
                        </span>
                      </label>
                    ),
                  )}

                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-50">
                    <input
                      type="radio"
                      name="activity-rejection-reason"
                      value="Custom"
                      disabled={
                        rejectingActivity
                      }
                      checked={
                        selectedReason ===
                        'Custom'
                      }
                      onChange={(
                        event,
                      ) =>
                        setSelectedReason(
                          event
                            .target
                            .value,
                        )
                      }
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                    />

                    <span className="text-slate-700">
                      Custom reason
                    </span>
                  </label>
                </div>

                {selectedReason ===
                  'Custom' && (
                  <textarea
                    rows={3}
                    required
                    disabled={
                      rejectingActivity
                    }
                    value={
                      customReason
                    }
                    onChange={(
                      event,
                    ) =>
                      setCustomReason(
                        event.target
                          .value,
                      )
                    }
                    className="input-field resize-none"
                    placeholder="Enter the reason for rejecting this activity..."
                  />
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={
                      rejectingActivity ||
                      !selectedReason ||
                      (selectedReason ===
                        'Custom' &&
                        !customReason.trim())
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />

                    {rejectingActivity
                      ? 'Rejecting...'
                      : 'Reject Activity'}
                  </button>

                  <button
                    type="button"
                    disabled={
                      rejectingActivity
                    }
                    onClick={
                      closeRejectModal
                    }
                    className="btn-ghost disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}