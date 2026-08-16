import {
  useState,
} from 'react';

import {
  CalendarDays,
  MapPin,
  Clock,
  UserCheck,
  ExternalLink,
  Award,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import type {
  Activity,
} from '@/types/data';

import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';

interface ActivitiesPageProps {
  activities: Activity[];
  registrations: Set<string>;
  onRegister: (
    activityId: string,
  ) => void | Promise<void>;
}

function isRegistrationClosed(
  deadline: string,
): boolean {
  if (!deadline) {
    return false;
  }

  const deadlineDate =
    new Date(
      `${deadline}T23:59:59`,
    );

  if (
    Number.isNaN(
      deadlineDate.getTime(),
    )
  ) {
    return false;
  }

  return (
    new Date().getTime() >
    deadlineDate.getTime()
  );
}

export function ActivitiesPage({
  activities,
  registrations,
  onRegister,
}: ActivitiesPageProps) {
  const [
    registeringId,
    setRegisteringId,
  ] = useState<string | null>(
    null,
  );

  async function handleRegister(
    activityId: string,
  ) {
    if (
      registrations.has(
        activityId,
      )
    ) {
      return;
    }

    if (
      registeringId !== null
    ) {
      return;
    }

    setRegisteringId(
      activityId,
    );

    try {
      await onRegister(
        activityId,
      );
    } finally {
      setRegisteringId(
        null,
      );
    }
  }

  return (
    <div>
      <PageHeader
        title="Activities"
        subtitle="Browse and register for upcoming activities"
        icon={
          <CalendarDays className="h-5 w-5" />
        }
      />

      {activities.length ===
      0 ? (
        <div className="card p-12 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-3 text-sm text-slate-400">
            No approved activities
            are currently available.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {activities.map(
            (activity) => {
              const registered =
                registrations.has(
                  activity.id,
                );

              const closed =
                isRegistrationClosed(
                  activity.deadline,
                );

              const registering =
                registeringId ===
                activity.id;

              return (
                <div
                  key={
                    activity.id
                  }
                  className="card flex flex-col p-5 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-slate-800">
                      {
                        activity.title
                      }
                    </h3>

                    <CategoryBadge
                      category={
                        activity.category
                      }
                    />
                  </div>

                  <p className="mt-2 flex-1 text-sm text-slate-500">
                    {activity.description ||
                      'No description provided.'}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Award className="h-4 w-4 shrink-0 text-blue-500" />

                      <span>
                        {
                          activity.points
                        }{' '}
                        Points
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <CalendarDays className="h-4 w-4 shrink-0 text-blue-500" />

                      <span>
                        {activity.date ||
                          'Date not specified'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4 shrink-0 text-blue-500" />

                      <span className="truncate">
                        {activity.venue ||
                          'Venue not specified'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="h-4 w-4 shrink-0 text-blue-500" />

                      <span>
                        Reg by{' '}
                        {activity.deadline ||
                          'Not specified'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 sm:col-span-2">
                      <UserCheck className="h-4 w-4 shrink-0 text-blue-500" />

                      <span>
                        {activity.eligibility ||
                          'Eligibility not specified'}
                      </span>
                    </div>
                  </div>

                  {closed &&
                    !registered && (
                      <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                        <AlertCircle className="h-4 w-4 shrink-0" />

                        Registration deadline has passed.
                      </div>
                    )}

                  <div className="mt-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        void handleRegister(
                          activity.id,
                        )
                      }
                      disabled={
                        registered ||
                        closed ||
                        registering
                      }
                      className={
                        registered
                          ? 'btn-ghost flex-1 cursor-default text-emerald-600 ring-emerald-200'
                          : closed
                            ? 'btn-ghost flex-1 cursor-not-allowed opacity-50'
                            : 'btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60'
                      }
                    >
                      {registered ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />

                          Registered
                        </>
                      ) : registering ? (
                        'Registering...'
                      ) : closed ? (
                        'Registration Closed'
                      ) : (
                        'Register'
                      )}
                    </button>

                    {activity.link && (
                      <a
                        href={
                          activity.link
                        }
                        target="_blank"
                        rel="noreferrer"
                        title="Open external activity link"
                        className="btn-ghost"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}