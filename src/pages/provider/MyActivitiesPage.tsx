import {
  useEffect,
  useState,
} from 'react';

import {
  ListChecks,
  CalendarDays,
  MapPin,
  Award,
  Clock,
  UserCheck,
  ExternalLink,
  Loader2,
} from 'lucide-react';

import type {
  Activity,
} from '@/types/data';

import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';
import { StatusPill } from '@/components/StatusPill';
import { supabase } from '@/utils/supabase';

interface MyActivitiesPageProps {
  activities: Activity[];
}

export function MyActivitiesPage({
  activities,
}: MyActivitiesPageProps) {
  const [
    providerActivities,
    setProviderActivities,
  ] = useState<Activity[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  useEffect(() => {
    async function loadProviderActivities() {
      setLoading(true);
      setErrorMessage('');

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setProviderActivities([]);
        setErrorMessage(
          'Provider session not found.',
        );
        setLoading(false);

        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from('activities')
        .select(`
          id,
          title,
          description,
          category,
          activity_date,
          venue,
          eligibility,
          registration_deadline,
          registration_link,
          points,
          created_by,
          approval_status
        `)
        .eq(
          'created_by',
          user.id,
        )
        .order(
          'activity_date',
          {
            ascending: false,
          },
        );

      if (error) {
        console.error(
          'Unable to load provider activities:',
          error,
        );

        setProviderActivities([]);

        setErrorMessage(
          'Unable to load your activities.',
        );

        setLoading(false);

        return;
      }

      const mappedActivities: Activity[] =
        (data ?? []).map(
          (row) => {
            const existingActivity =
              activities.find(
                (activity) =>
                  activity.id ===
                  String(
                    row.id,
                  ),
              );

            const status: Activity['status'] =
              row.approval_status ===
              'approved'
                ? 'approved'
                : row.approval_status ===
                    'rejected'
                  ? 'rejected'
                  : 'pending';

            return {
              id:
                String(
                  row.id,
                ),

              title:
                row.title,

              description:
                row.description ??
                '',

              category:
                Number(
                  row.category,
                ),

              points:
                Number(
                  row.points,
                ),

              date:
                row.activity_date ??
                '',

              venue:
                row.venue ??
                '',

              deadline:
                row.registration_deadline ??
                '',

              eligibility:
                row.eligibility ??
                '',

              link:
                row.registration_link ??
                '',

              status,

              provider:
                existingActivity?.provider ??
                'Activity Provider',
            };
          },
        );

      setProviderActivities(
        mappedActivities,
      );

      setLoading(false);
    }

    void loadProviderActivities();
  }, [activities]);

  return (
    <div>
      <PageHeader
        title="My Activities"
        subtitle="All activities you have created"
        icon={
          <ListChecks className="h-5 w-5" />
        }
      />

      {loading ? (
        <div className="card flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />

          Loading your activities...
        </div>
      ) : errorMessage ? (
        <div className="card p-12 text-center">
          <ListChecks className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-3 text-sm text-rose-500">
            {errorMessage}
          </p>
        </div>
      ) : providerActivities.length ===
        0 ? (
        <div className="card p-12 text-center">
          <ListChecks className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-3 text-sm text-slate-400">
            No activities yet.
            Create one from the
            Add Activity page.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {providerActivities.map(
            (activity) => (
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

                  <StatusPill
                    status={
                      activity.status ===
                      'approved'
                        ? 'Approved'
                        : activity.status ===
                            'pending'
                          ? 'Pending'
                          : 'Rejected'
                    }
                  />
                </div>

                <p className="mt-2 flex-1 text-sm text-slate-500">
                  {
                    activity.description ||
                    'No description provided.'
                  }
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <CategoryBadge
                    category={
                      activity.category
                    }
                  />

                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    <Award className="h-3 w-3" />

                    {
                      activity.points
                    }{' '}
                    Points
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-xs text-slate-600 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-blue-500" />

                    <span>
                      {activity.date ||
                        'Date not specified'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-blue-500" />

                    <span>
                      Reg by{' '}
                      {activity.deadline ||
                        'Not specified'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-blue-500" />

                    <span>
                      {activity.venue ||
                        'Venue not specified'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 shrink-0 text-blue-500" />

                    <span>
                      {activity.eligibility ||
                        'Eligibility not specified'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400">
                    By{' '}
                    {
                      activity.provider
                    }
                  </span>

                  {activity.link ? (
                    <a
                      href={
                        activity.link
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View link

                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">
                      No external link
                    </span>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}