import { useState, useRef } from 'react';
import {
  FileCheck,
  Award,
  CalendarDays,
  Upload,
  X,
  FileText,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Loader2,
} from 'lucide-react';

import type {
  Activity,
  ProofSubmission,
  ProofStatus,
  Student,
} from '@/types/data';

import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';

interface RegisteredActivitiesPageProps {
  student: Student;
  registrations: Activity[];
  proofs: ProofSubmission[];

  onSubmitProof: (
    activityId: string,
    file: File,
    note: string,
  ) => Promise<boolean>;
}

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
];

const ACCEPTED_EXTS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.pdf',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function proofBadgeClass(
  status: ProofStatus,
): string {
  switch (status) {
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';

    case 'pending':
      return 'bg-amber-50 text-amber-700 ring-amber-200';

    case 'rejected':
      return 'bg-rose-50 text-rose-700 ring-rose-200';

    default:
      return 'bg-slate-100 text-slate-500 ring-slate-200';
  }
}

function proofLabel(
  status: ProofStatus,
): string {
  switch (status) {
    case 'approved':
      return 'Approved';

    case 'pending':
      return 'Pending Verification';

    case 'rejected':
      return 'Rejected';

    default:
      return 'Not Submitted';
  }
}

function proofIcon(status: ProofStatus) {
  switch (status) {
    case 'approved':
      return (
        <CheckCircle2 className="h-3 w-3" />
      );

    case 'pending':
      return (
        <Clock className="h-3 w-3" />
      );

    case 'rejected':
      return (
        <AlertCircle className="h-3 w-3" />
      );

    default:
      return (
        <span className="text-[10px]">
          {'\u25CF'}
        </span>
      );
  }
}

export function RegisteredActivitiesPage({
  student,
  registrations,
  proofs,
  onSubmitProof,
}: RegisteredActivitiesPageProps) {
  const [
    modalActivity,
    setModalActivity,
  ] = useState<Activity | null>(null);

  function getProof(
    activityId: string,
  ): ProofSubmission | undefined {
    return proofs.find(
      (proof) =>
        proof.activityId ===
          activityId &&
        proof.studentId ===
          student.id,
    );
  }

  return (
    <div>
      <PageHeader
        title="Registered Activities"
        subtitle="Activities you have registered for. Submit proof to earn points."
        icon={
          <FileCheck className="h-5 w-5" />
        }
      />

      {registrations.length === 0 ? (
        <div className="card p-12 text-center">
          <FileCheck className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-3 text-sm text-slate-400">
            You haven't registered for any
            activities yet. Browse the
            Activities page to register.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map(
            (activity) => {
              const proof =
                getProof(activity.id);

              const status: ProofStatus =
                proof?.status ??
                'not_submitted';

              const completed =
                status === 'approved';

              return (
                <div
                  key={activity.id}
                  className="card p-5 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <CalendarDays className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-800">
                          {activity.title}
                        </h3>

                        <CategoryBadge
                          category={
                            activity.category
                          }
                        />
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-blue-500" />
                          {activity.points}{' '}
                          Points
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                          {activity.date}
                        </span>

                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-semibold ring-1 ring-inset',
                            completed
                              ? 'bg-emerald-100 text-emerald-700 ring-emerald-300'
                              : 'bg-emerald-50 text-emerald-700 ring-emerald-200',
                          )}
                        >
                          {completed ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              Completed
                            </>
                          ) : (
                            'Registered'
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
                          proofBadgeClass(
                            status,
                          ),
                        )}
                      >
                        {proofIcon(status)}
                        {proofLabel(status)}
                      </span>

                      {status ===
                        'not_submitted' && (
                        <button
                          onClick={() =>
                            setModalActivity(
                              activity,
                            )
                          }
                          className="btn-primary px-3 py-2 text-xs"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Submit Proof for
                          Activity Points
                        </button>
                      )}

                      {status ===
                        'pending' && (
                        <span className="text-xs font-medium text-amber-600">
                          Pending
                          Verification
                        </span>
                      )}

                      {status ===
                        'approved' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Points Awarded
                        </span>
                      )}

                      {status ===
                        'rejected' && (
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-xs text-rose-600">
                            Reason:{' '}
                            {proof?.rejectionReason ??
                              'Proof rejected'}
                          </span>

                          <button
                            onClick={() =>
                              setModalActivity(
                                activity,
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Resubmit Proof
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}

      {modalActivity && (
        <ProofModal
          activity={modalActivity}
          student={student}
          onClose={() =>
            setModalActivity(null)
          }
          onSubmit={async (
            file,
            note,
          ) => {
            const success =
              await onSubmitProof(
                modalActivity.id,
                file,
                note,
              );

            if (success) {
              setModalActivity(null);
            }

            return success;
          }}
        />
      )}
    </div>
  );
}

interface ProofModalProps {
  activity: Activity;
  student: Student;
  onClose: () => void;

  onSubmit: (
    file: File,
    note: string,
  ) => Promise<boolean>;
}

function ProofModal({
  activity,
  student,
  onClose,
  onSubmit,
}: ProofModalProps) {
  const [file, setFile] =
    useState<File | null>(null);

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState<string>();

  const [note, setNote] =
    useState('');

  const [error, setError] =
    useState('');

  const [submitting, setSubmitting] =
    useState(false);

  const fileRef =
    useRef<HTMLInputElement>(null);

  function clearPreview() {
    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl,
      );
    }
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    setError('');

    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) {
      clearPreview();

      setFile(null);
      setPreviewUrl(undefined);
      return;
    }

    const extension =
      '.' +
      selectedFile.name
        .split('.')
        .pop()
        ?.toLowerCase();

    if (
      !ACCEPTED_TYPES.includes(
        selectedFile.type,
      ) &&
      !ACCEPTED_EXTS.includes(
        extension,
      )
    ) {
      setError(
        'Please upload a JPG, JPEG, PNG, or PDF file.',
      );

      setFile(null);

      clearPreview();
      setPreviewUrl(undefined);

      if (fileRef.current) {
        fileRef.current.value = '';
      }

      return;
    }

    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {
      setError(
        'File must be smaller than 10 MB.',
      );

      setFile(null);

      clearPreview();
      setPreviewUrl(undefined);

      if (fileRef.current) {
        fileRef.current.value = '';
      }

      return;
    }

    clearPreview();

    setFile(selectedFile);

    if (
      selectedFile.type.startsWith(
        'image/',
      )
    ) {
      setPreviewUrl(
        URL.createObjectURL(
          selectedFile,
        ),
      );
    } else {
      setPreviewUrl(undefined);
    }
  }

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (!file) {
      setError(
        'Please upload a JPG, JPEG, PNG, or PDF file.',
      );

      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const success =
        await onSubmit(
          file,
          note.trim(),
        );

      if (!success) {
        setError(
          'Proof could not be submitted. Please try again.',
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        'Proof could not be submitted. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={
          submitting
            ? undefined
            : onClose
        }
      />

      <div className="relative z-10 w-full max-w-lg">
        <div className="card max-h-[90vh] overflow-y-auto p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Upload className="h-5 w-5" />
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                Submit Proof
              </h3>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Activity Name
              </span>

              <span className="text-right font-semibold text-slate-800">
                {activity.title}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">
                Student Name
              </span>

              <span className="font-semibold text-slate-800">
                {student.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Category
              </span>

              <CategoryBadge
                category={
                  activity.category
                }
              />
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Points Offered
              </span>

              <span className="font-semibold text-slate-800">
                {activity.points}{' '}
                points
              </span>
            </div>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-5 space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Upload Certificate /
                Proof{' '}
                <span className="text-rose-500">
                  *
                </span>
              </label>

              <div
                onClick={() => {
                  if (!submitting) {
                    fileRef.current?.click();
                  }
                }}
                className={cn(
                  'rounded-xl border-2 border-dashed border-slate-200 p-5 text-center transition-colors',
                  submitting
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer hover:border-blue-400 hover:bg-blue-50/30',
                )}
              >
                <input
                  ref={fileRef}
                  type="file"
                  disabled={submitting}
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  onChange={
                    handleFileChange
                  }
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-sm text-slate-700">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-28 w-auto max-w-full rounded-lg object-contain shadow-sm"
                      />
                    ) : (
                      <FileText className="h-10 w-10 text-rose-500" />
                    )}

                    <div className="flex items-center gap-2">
                      {file.type ===
                      'application/pdf' ? (
                        <FileText className="h-4 w-4 text-rose-500" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                      )}

                      <span className="max-w-[250px] truncate font-medium text-slate-800">
                        {file.name}
                      </span>

                      <span className="text-xs text-slate-400">
                        {(
                          file.size /
                          1024
                        ).toFixed(1)}{' '}
                        KB
                      </span>
                    </div>

                    <span className="text-xs text-blue-600">
                      Click to change
                      file
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-2 text-sm text-slate-500">
                      Click to upload
                      a file
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      JPG, JPEG, PNG
                      or PDF — maximum
                      10 MB
                    </p>
                  </>
                )}
              </div>

              {error && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Note (optional)
              </label>

              <textarea
                rows={2}
                disabled={submitting}
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value,
                  )
                }
                className="input-field resize-none"
                placeholder="Add a note about your submission..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Submit Proof
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={onClose}
                className="btn-ghost disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}