import { useState } from 'react';
import {
  PlusCircle,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';

import type { Activity } from '@/types/data';
import { CATEGORY_NAMES } from '@/types/nav';
import { PageHeader } from '@/components/PageHeader';

interface AddActivityPageProps {
  onSubmit: (activity: Activity) => Promise<boolean>;
  onCancel: () => void;
}

function convertDateToISO(
  value: string,
): string | null {
  const match = value
    .trim()
    .match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(
    year,
    month - 1,
    day,
  );

  const valid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!valid) {
    return null;
  }

  const yyyy = String(year);
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

export function AddActivityPage({
  onSubmit,
  onCancel,
}: AddActivityPageProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 1,
    points: '',
    date: '',
    deadline: '',
    venue: '',
    eligibility: '',
    link: '',
  });

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  function update<
    K extends keyof typeof form,
  >(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setErrorMessage('');
    setSubmitted(false);
  }

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setErrorMessage('');
    setSubmitted(false);

    const title =
      form.title.trim();

    const description =
      form.description.trim();

    const venue =
      form.venue.trim();

    const eligibility =
      form.eligibility.trim();

    const link =
      form.link.trim();

    if (!title) {
      setErrorMessage(
        'Activity name is required.',
      );

      return;
    }

    if (!description) {
      setErrorMessage(
        'Description is required.',
      );

      return;
    }

    const activityDate =
      convertDateToISO(
        form.date,
      );

    if (!activityDate) {
      setErrorMessage(
        'Enter a valid Activity Date in DD/MM/YYYY format, for example 25/08/2026.',
      );

      return;
    }

    const registrationDeadline =
      convertDateToISO(
        form.deadline,
      );

    if (!registrationDeadline) {
      setErrorMessage(
        'Enter a valid Registration Deadline in DD/MM/YYYY format, for example 23/08/2026.',
      );

      return;
    }

    if (
      registrationDeadline >
      activityDate
    ) {
      setErrorMessage(
        'Registration deadline cannot be after the activity date.',
      );

      return;
    }

    const points =
      Number(form.points);

    if (
      !Number.isInteger(points) ||
      points < 1 ||
      points > 50
    ) {
      setErrorMessage(
        'Points offered must be a whole number between 1 and 50.',
      );

      return;
    }

    if (!venue) {
      setErrorMessage(
        'Venue is required.',
      );

      return;
    }

    if (!eligibility) {
      setErrorMessage(
        'Eligibility is required.',
      );

      return;
    }

    const newActivity: Activity = {
      id: '',
      title,
      description,
      category:
        Number(
          form.category,
        ),
      points,
      date:
        activityDate,
      venue,
      deadline:
        registrationDeadline,
      eligibility,
      link,
      status:
        'pending',
      provider:
        '',
    };

    setSubmitting(true);

    try {
      const success =
        await onSubmit(
          newActivity,
        );

      if (!success) {
        return;
      }

      setSubmitted(true);

      setForm({
        title: '',
        description: '',
        category: 1,
        points: '',
        date: '',
        deadline: '',
        venue: '',
        eligibility: '',
        link: '',
      });
    } catch (error) {
      console.error(
        'Unable to submit activity:',
        error,
      );

      setErrorMessage(
        'Something went wrong while submitting the activity.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Add Activity"
        subtitle="Create a new activity for students"
        icon={
          <PlusCircle className="h-5 w-5" />
        }
      />

      {submitted && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-700 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />

          <span className="text-sm font-semibold">
            Activity submitted successfully!
            It is now awaiting administrator approval.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700 ring-1 ring-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />

          <span className="text-sm font-semibold">
            {errorMessage}
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="card max-w-3xl p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Activity Name
            </label>

            <input
              type="text"
              required
              value={
                form.title
              }
              onChange={(event) =>
                update(
                  'title',
                  event.target.value,
                )
              }
              className="input-field"
              placeholder="e.g. AI Workshop"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              required
              rows={3}
              value={
                form.description
              }
              onChange={(event) =>
                update(
                  'description',
                  event.target.value,
                )
              }
              className="input-field resize-none"
              placeholder="Describe the activity..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Activity Point Category
            </label>

            <select
              value={
                form.category
              }
              onChange={(event) =>
                update(
                  'category',
                  Number(
                    event.target.value,
                  ),
                )
              }
              className="input-field"
            >
              {CATEGORY_NAMES.map(
                (category) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.id
                    }
                  >
                    {
                      category.name
                    }
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Points Offered
            </label>

            <input
              type="number"
              required
              min={1}
              max={50}
              step={1}
              value={
                form.points
              }
              onChange={(event) =>
                update(
                  'points',
                  event.target.value,
                )
              }
              className="input-field"
              placeholder="e.g. 10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Activity Date
            </label>

            <input
              type="text"
              required
              value={
                form.date
              }
              onChange={(event) =>
                update(
                  'date',
                  event.target.value,
                )
              }
              className="input-field"
              placeholder="DD/MM/YYYY e.g. 25/08/2026"
              maxLength={10}
            />

            <p className="mt-1 text-xs text-slate-400">
              Format: DD/MM/YYYY
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Registration Deadline
            </label>

            <input
              type="text"
              required
              value={
                form.deadline
              }
              onChange={(event) =>
                update(
                  'deadline',
                  event.target.value,
                )
              }
              className="input-field"
              placeholder="DD/MM/YYYY e.g. 23/08/2026"
              maxLength={10}
            />

            <p className="mt-1 text-xs text-slate-400">
              Format: DD/MM/YYYY
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Venue
            </label>

            <input
              type="text"
              required
              value={
                form.venue
              }
              onChange={(event) =>
                update(
                  'venue',
                  event.target.value,
                )
              }
              className="input-field"
              placeholder="e.g. Seminar Hall 2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Eligibility
            </label>

            <input
              type="text"
              required
              value={
                form.eligibility
              }
              onChange={(event) =>
                update(
                  'eligibility',
                  event.target.value,
                )
              }
              className="input-field"
              placeholder="e.g. All students"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Registration Link (optional)
            </label>

            <input
              type="url"
              value={
                form.link
              }
              onChange={(event) =>
                update(
                  'link',
                  event.target.value,
                )
              }
              className="input-field"
              placeholder="https://example.com/register"
            />

            <p className="mt-1 text-xs text-slate-400">
              Leave blank if registration is handled only through this application.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={
              submitting
            }
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <PlusCircle className="h-4 w-4" />

            {submitting
              ? 'Submitting...'
              : 'Submit Activity'}
          </button>

          <button
            type="button"
            onClick={
              onCancel
            }
            disabled={
              submitting
            }
            className="btn-ghost disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-4 w-4" />

            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}