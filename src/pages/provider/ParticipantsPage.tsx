import {
  useEffect,
  useState,
} from 'react';

import {
  Users,
  Award,
  IdCard,
  Loader2,
} from 'lucide-react';

import type {
  Activity,
} from '@/types/data';

import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';
import { supabase } from '@/utils/supabase';

interface ParticipantsPageProps {
  activities: Activity[];
}

interface Participant {
  id: string;
  name: string;
  studentId: string;
  department: string;
  activities: Activity[];
}

export function ParticipantsPage({
  activities,
}: ParticipantsPageProps) {
  const [
    participants,
    setParticipants,
  ] = useState<Participant[]>([]);

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
    async function loadParticipants() {
      setLoading(true);
      setErrorMessage('');

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setParticipants([]);
        setProviderActivities([]);
        setErrorMessage(
          'Provider session not found.',
        );
        setLoading(false);

        return;
      }

      const {
        data: ownedActivityRows,
        error: activityError,
      } = await supabase
        .from('activities')
        .select(`
          id,
          title,
          description,
          category,
          points,
          activity_date,
          venue,
          registration_deadline,
          eligibility,
          registration_link,
          approval_status
        `)
        .eq(
          'created_by',
          user.id,
        )
        .order(
          'activity_date',
          {
            ascending: true,
          },
        );

      if (activityError) {
        console.error(
          'Unable to load provider activities:',
          activityError,
        );

        setParticipants([]);
        setProviderActivities([]);

        setErrorMessage(
          'Unable to load your activities.',
        );

        setLoading(false);

        return;
      }

      const ownedActivities: Activity[] =
        (
          ownedActivityRows ?? []
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
        ownedActivities,
      );

      if (
        ownedActivities.length === 0
      ) {
        setParticipants([]);
        setLoading(false);

        return;
      }

      const activityIds =
        ownedActivities.map(
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
          'Unable to load registrations:',
          registrationError,
        );

        setParticipants([]);

        setErrorMessage(
          'Unable to load registered students.',
        );

        setLoading(false);

        return;
      }

      if (
        !registrations ||
        registrations.length === 0
      ) {
        setParticipants([]);
        setLoading(false);

        return;
      }

      const studentIds = [
        ...new Set(
          registrations.map(
            (registration) =>
              registration.student_id,
          ),
        ),
      ];

      const {
        data: studentProfiles,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          student_id,
          department
        `)
        .in(
          'id',
          studentIds,
        );

      if (profileError) {
        console.error(
          'Unable to load participant profiles:',
          profileError,
        );

        setParticipants([]);

        setErrorMessage(
          'Unable to load student details.',
        );

        setLoading(false);

        return;
      }

      const activityMap =
        new Map<
          string,
          Activity
        >(
          ownedActivities.map(
            (activity) => [
              activity.id,
              activity,
            ],
          ),
        );

      const registrationMap =
        new Map<
          string,
          Set<string>
        >();

      for (
        const registration of
          registrations
      ) {
        const studentId =
          String(
            registration.student_id,
          );

        const activityId =
          String(
            registration.activity_id,
          );

        if (
          !registrationMap.has(
            studentId,
          )
        ) {
          registrationMap.set(
            studentId,
            new Set(),
          );
        }

        registrationMap
          .get(studentId)!
          .add(activityId);
      }

      const realParticipants: Participant[] =
        (
          studentProfiles ?? []
        ).map((profile) => {
          const registeredIds =
            registrationMap.get(
              profile.id,
            ) ??
            new Set<string>();

          const registeredActivities =
            Array.from(
              registeredIds,
            )
              .map(
                (activityId) =>
                  activityMap.get(
                    activityId,
                  ),
              )
              .filter(
                (
                  activity,
                ): activity is Activity =>
                  Boolean(
                    activity,
                  ),
              );

          return {
            id:
              profile.id,

            name:
              profile.full_name ??
              profile.student_id ??
              'Student',

            studentId:
              profile.student_id ??
              'Not specified',

            department:
              profile.department ??
              'Not specified',

            activities:
              registeredActivities,
          };
        });

      realParticipants.sort(
        (a, b) =>
          a.name.localeCompare(
            b.name,
          ),
      );

      setParticipants(
        realParticipants,
      );

      setLoading(false);
    }

    void loadParticipants();
  }, [activities]);

  return (
    <div>
      <PageHeader
        title="Participants"
        subtitle="Students registered for your activities"
        icon={
          <Users className="h-5 w-5" />
        }
      />

      {providerActivities.length >
        0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {providerActivities.map(
            (activity) => (
              <span
                key={
                  activity.id
                }
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
              >
                <CategoryBadge
                  category={
                    activity.category
                  }
                  className="px-1.5 py-0"
                />

                {
                  activity.title
                }
              </span>
            ),
          )}
        </div>
      )}

      {loading ? (
        <div className="card flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />

          Loading participants...
        </div>
      ) : errorMessage ? (
        <div className="card p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-3 text-sm text-rose-500">
            {errorMessage}
          </p>
        </div>
      ) : providerActivities.length ===
        0 ? (
        <div className="card p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-3 text-sm text-slate-400">
            You have not created
            any activities yet.
          </p>
        </div>
      ) : participants.length ===
        0 ? (
        <div className="card p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-3 text-sm text-slate-400">
            No students have
            registered for your
            activities yet.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-semibold">
                    Student Name
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Student ID
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Department
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Registered
                    Activities
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {participants.map(
                  (
                    participant,
                  ) => {
                    const initials =
                      participant.name
                        .split(
                          ' ',
                        )
                        .filter(
                          Boolean,
                        )
                        .map(
                          (
                            name,
                          ) =>
                            name[0],
                        )
                        .join('')
                        .slice(
                          0,
                          2,
                        )
                        .toUpperCase();

                    return (
                      <tr
                        key={
                          participant.id
                        }
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                              {initials ||
                                'S'}
                            </div>

                            <span className="font-medium text-slate-800">
                              {
                                participant.name
                              }
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-slate-600">
                            <IdCard className="h-3.5 w-3.5 text-slate-400" />

                            {
                              participant.studentId
                            }
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-slate-600">
                          {
                            participant.department
                          }
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {participant.activities.map(
                              (
                                activity,
                              ) => (
                                <span
                                  key={
                                    activity.id
                                  }
                                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                                >
                                  <Award className="h-3 w-3 text-blue-500" />

                                  {
                                    activity.title
                                  }
                                </span>
                              ),
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}