import {
  useEffect,
  useState,
} from 'react';

import {
  PlusCircle,
  CalendarDays,
  Users,
  ListChecks,
  TrendingUp,
  ArrowRight,
  Loader2,
} from 'lucide-react';

import type {
  Activity,
} from '@/types/data';

import { StatCard } from '@/components/StatCard';
import { PageHeader } from '@/components/PageHeader';
import { CategoryBadge } from '@/components/CategoryBadge';
import { StatusPill } from '@/components/StatusPill';
import { supabase } from '@/utils/supabase';

interface ProviderDashboardProps {
  activities: Activity[];
  onNavigate: (key: string) => void;
}

export function ProviderDashboard({
  activities,
  onNavigate,
}: ProviderDashboardProps) {
  const [
    providerActivities,
    setProviderActivities,
  ] = useState<Activity[]>([]);

  const [
    totalParticipants,
    setTotalParticipants,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    async function loadProviderDashboard() {
      setLoading(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setProviderActivities([]);
        setTotalParticipants(0);
        setLoading(false);

        return;
      }

      const {
        data: activityRows,
        error: activityError,
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

      if (activityError) {
        console.error(
          'Unable to load provider activities:',
          activityError,
        );

        setProviderActivities([]);
        setTotalParticipants(0);
        setLoading(false);

        return;
      }

      const mappedActivities: Activity[] =
        (
          activityRows ?? []
        ).map((row) => {
          const existingActivity =
            activities.find(
              (activity) =>
                activity.id ===
                String(row.id),
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
              String(row.id),

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
        });

      setProviderActivities(
        mappedActivities,
      );

      if (
        mappedActivities.length === 0
      ) {
        setTotalParticipants(0);
        setLoading(false);

        return;
      }

      const activityIds =
        mappedActivities.map(
          (activity) =>
            Number(
              activity.id,
            ),
        );

      const {
        data: registrations,
        error: registrationError,
      } = await supabase
        .from(
          'student_activities',
        )
        .select(`
          student_id,
          activity_id
        `)
        .in(
          'activity_id',
          activityIds,
        );

      if (registrationError) {
        console.error(
          'Unable to load participant count:',
          registrationError,
        );

        setTotalParticipants(0);
        setLoading(false);

        return;
      }

      const uniqueStudents =
        new Set(
          (
            registrations ?? []
          ).map(
            (registration) =>
              registration.student_id,
          ),
        );

      setTotalParticipants(
        uniqueStudents.size,
      );

      setLoading(false);
    }

    void loadProviderDashboard();
  }, [activities]);

  const totalCreated =
    providerActivities.length;

  const approved =
    providerActivities.filter(
      (activity) =>
        activity.status ===
        'approved',
    ).length;

  const pending =
    providerActivities.filter(
      (activity) =>
        activity.status ===
        'pending',
    ).length;

  return (
    <div>
      <PageHeader
        title="Provider Dashboard"
        subtitle="Manage your activities and track participation"
        icon={
          <ListChecks className="h-5 w-5" />
        }
        action={
          <button
            onClick={() =>
              onNavigate(
                'provider-add',
              )
            }
            className="btn-primary"
          >
            <PlusCircle className="h-4 w-4" />

            Add Activity
          </button>
        }
      />

      {loading ? (
        <div className="card flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />

          Loading provider dashboard...
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={
                <ListChecks className="h-5 w-5" />
              }
              label="Total Activities"
              value={
                totalCreated
              }
              sublabel="Created by you"
              accentClass="bg-blue-50 text-blue-600"
            />

            <StatCard
              icon={
                <CalendarDays className="h-5 w-5" />
              }
              label="Approved"
              value={
                approved
              }
              sublabel="Approved activities"
              accentClass="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              icon={
                <Users className="h-5 w-5" />
              }
              label="Participants"
              value={
                totalParticipants
              }
              sublabel="Unique registered students"
              accentClass="bg-indigo-50 text-indigo-600"
            />

            <StatCard
              icon={
                <TrendingUp className="h-5 w-5" />
              }
              label="Pending Approval"
              value={
                pending
              }
              sublabel="Awaiting review"
              accentClass="bg-amber-50 text-amber-500"
            />
          </div>

          <div className="card mt-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-base font-bold text-slate-800">
                Recently Created Activities
              </h3>

              <button
                onClick={() =>
                  onNavigate(
                    'provider-activities',
                  )
                }
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all

                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {providerActivities
                .slice(0, 5)
                .map(
                  (
                    activity,
                  ) => (
                    <div
                      key={
                        activity.id
                      }
                      className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-sm font-semibold text-slate-800">
                            {
                              activity.title
                            }
                          </h4>

                          <CategoryBadge
                            category={
                              activity.category
                            }
                          />
                        </div>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {
                            activity.points
                          }{' '}
                          points |{' '}
                          {
                            activity.date
                          }{' '}
                          |{' '}
                          {
                            activity.venue ||
                            'Venue not specified'
                          }
                        </p>
                      </div>

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
                  ),
                )}

              {providerActivities.length ===
                0 && (
                <div className="px-6 py-12 text-center text-sm text-slate-400">
                  No activities yet.
                  Click "Add
                  Activity" to
                  create your first.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}