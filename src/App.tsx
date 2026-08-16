import { useEffect, useState } from 'react';
import type { Role } from '@/types/nav';
import { LoginPage } from '@/pages/LoginPage';
import { AppShell } from '@/components/AppShell';
import { supabase } from '@/utils/supabase';

import {
  type Activity,
  type ProofSubmission,
  type CompletedActivity,
  type Student,
  type AdminStudent,
} from '@/types/data';

import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { MyPointsPage } from '@/pages/student/MyPointsPage';
import { ActivitiesPage } from '@/pages/student/ActivitiesPage';
import { AIRecommendationsPage } from '@/pages/student/AIRecommendationsPage';
import { CompletedActivitiesPage } from '@/pages/student/CompletedActivitiesPage';
import { ProfilePage } from '@/pages/student/ProfilePage';
import { RegisteredActivitiesPage } from '@/pages/student/RegisteredActivitiesPage';

import { ProviderDashboard } from '@/pages/provider/ProviderDashboard';
import { AddActivityPage } from '@/pages/provider/AddActivityPage';
import { MyActivitiesPage } from '@/pages/provider/MyActivitiesPage';
import { ParticipantsPage } from '@/pages/provider/ParticipantsPage';

import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminStudentsPage } from '@/pages/admin/AdminStudentsPage';

import {
  AdminProvidersPage,
  type AdminProvider,
} from '@/pages/admin/AdminProvidersPage';

import { AdminActivitiesPage } from '@/pages/admin/AdminActivitiesPage';
import { AdminApprovalsPage } from '@/pages/admin/AdminApprovalsPage';
import { PointVerificationsPage } from '@/pages/admin/PointVerificationsPage';

function getDashboardForRole(role: Role) {
  if (role === 'student') return 'student-dashboard';
  if (role === 'provider') return 'provider-dashboard';

  return 'admin-dashboard';
}

function pageBelongsToRole(key: string, role: Role) {
  if (role === 'student') {
    return key.startsWith('student-');
  }

  if (role === 'provider') {
    return key.startsWith('provider-');
  }

  return key.startsWith('admin-');
}

function getFileName(path: string) {
  const parts = path.split('/');
  return parts[parts.length - 1] || path;
}

function App() {
  const [role, setRole] = useState<Role | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [userProfile, setUserProfile] =
    useState<{
      id: string;
      full_name: string | null;
      department: string | null;
      email: string;
    } | null>(null);

  const [studentPoints, setStudentPoints] =
    useState({
      c1: 0,
      c2: 0,
      c3: 0,
    });

  const [adminStudents, setAdminStudents] =
    useState<AdminStudent[]>([]);

  const [adminProviders, setAdminProviders] =
    useState<AdminProvider[]>([]);

  const [activeKey, setActiveKey] =
    useState<string>(() => {
      return (
        sessionStorage.getItem(
          'activity-manager-active-page',
        ) ?? 'student-dashboard'
      );
    });

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [registrations, setRegistrations] =
    useState<Set<string>>(new Set());

  const [proofs, setProofs] =
    useState<ProofSubmission[]>([]);

  const [completed, setCompleted] =
    useState<CompletedActivity[]>([]);

  useEffect(() => {
    sessionStorage.setItem(
      'activity-manager-active-page',
      activeKey,
    );
  }, [activeKey]);

  const student: Student = {
    id:
      userProfile?.id ?? '',

    name:
      userProfile?.full_name ??
      'Student',

    email:
      userProfile?.email ?? '',

    department:
      userProfile?.department ??
      'Not specified',

    points:
      studentPoints,
  };

  function setDashboardForRole(r: Role) {
    setActiveKey(
      getDashboardForRole(r),
    );
  }

  function normalizeCategory(
    value: unknown,
  ) {
    const category = String(value)
      .trim()
      .toLowerCase();

    if (
      category === '1' ||
      category === 'c1' ||
      category === 'category 1'
    ) {
      return 'c1';
    }

    if (
      category === '2' ||
      category === 'c2' ||
      category === 'category 2'
    ) {
      return 'c2';
    }

    if (
      category === '3' ||
      category === 'c3' ||
      category === 'category 3'
    ) {
      return 'c3';
    }

    return null;
  }

  function databaseCategory(
    value: number,
  ) {
    return `Category ${value}`;
  }

  async function loadActivities() {
    const { data, error } =
      await supabase
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
        .order('activity_date', {
          ascending: true,
        });

    if (error) {
      console.error(
        'Unable to load activities:',
        error,
      );

      setActivities([]);
      return;
    }

    const providerIds = [
      ...new Set(
        (data ?? [])
          .map(
            (row) =>
              row.created_by,
          )
          .filter(Boolean),
      ),
    ];

    let providerNames = new Map<
      string,
      string
    >();

    if (providerIds.length > 0) {
      const {
        data: providers,
      } = await supabase
        .from('profiles')
        .select(
          'id, full_name',
        )
        .in(
          'id',
          providerIds,
        );

      providerNames = new Map(
        (providers ?? []).map(
          (provider) => [
            provider.id,

            provider.full_name ??
              'Activity Provider',
          ],
        ),
      );
    }

    const mappedActivities: Activity[] =
      (data ?? []).map((row) => {
        const status: Activity['status'] =
          row.approval_status ===
          'approved'
            ? 'approved'
            : row.approval_status ===
                'rejected'
              ? 'rejected'
              : 'pending';

        return {
          id: String(row.id),

          title:
            row.title,

          description:
            row.description ?? '',

          category:
            Number(row.category),

          points:
            Number(row.points),

          date:
            row.activity_date ?? '',

          venue:
            row.venue ?? '',

          deadline:
            row.registration_deadline ??
            '',

          eligibility:
            row.eligibility ?? '',

          link:
            row.registration_link ??
            '',

          status,

          provider:
            providerNames.get(
              row.created_by,
            ) ??
            'Activity Provider',
        };
      });

    setActivities(
      mappedActivities,
    );
  }

  async function loadStudentPoints(
    userId: string,
  ) {
    const { data, error } =
      await supabase
        .from(
          'point_transactions',
        )
        .select(
          'category, points',
        )
        .eq(
          'student_id',
          userId,
        );

    if (error) {
      console.error(
        'Unable to load student points:',
        error,
      );

      setStudentPoints({
        c1: 0,
        c2: 0,
        c3: 0,
      });

      return;
    }

    const totals = {
      c1: 0,
      c2: 0,
      c3: 0,
    };

    for (
      const transaction of
        data ?? []
    ) {
      const category =
        normalizeCategory(
          transaction.category,
        );

      const points =
        Number(
          transaction.points,
        ) || 0;

      if (category === 'c1') {
        totals.c1 += points;
      }

      if (category === 'c2') {
        totals.c2 += points;
      }

      if (category === 'c3') {
        totals.c3 += points;
      }
    }

    setStudentPoints(
      totals,
    );
  }

  async function loadStudentRegistrations(
    userId: string,
  ) {
    const { data, error } =
      await supabase
        .from(
          'student_activities',
        )
        .select(
          'activity_id',
        )
        .eq(
          'student_id',
          userId,
        );

    if (error) {
      console.error(
        'Unable to load registrations:',
        error,
      );

      setRegistrations(
        new Set(),
      );

      return;
    }

    const ids = new Set(
      (data ?? []).map(
        (row) =>
          String(
            row.activity_id,
          ),
      ),
    );

    setRegistrations(ids);
  }

  async function loadAdminStudents() {
    const {
      data: profiles,
      error: profileError,
    } = await supabase
      .from('profiles')
      .select(
        'id, full_name, student_id, department, role',
      )
      .eq(
        'role',
        'student',
      )
      .order('full_name', {
        ascending: true,
      });

    if (profileError) {
      console.error(
        'Unable to load students:',
        profileError,
      );

      setAdminStudents([]);
      return;
    }

    const {
      data: transactions,
      error: pointError,
    } = await supabase
      .from(
        'point_transactions',
      )
      .select(
        'student_id, category, points',
      );

    if (pointError) {
      console.error(
        'Unable to load point totals:',
        pointError,
      );

      setAdminStudents([]);
      return;
    }

    const pointsByStudent =
      new Map<
        string,
        {
          c1: number;
          c2: number;
          c3: number;
        }
      >();

    for (
      const transaction of
        transactions ?? []
    ) {
      const studentId =
        String(
          transaction.student_id,
        );

      if (
        !pointsByStudent.has(
          studentId,
        )
      ) {
        pointsByStudent.set(
          studentId,
          {
            c1: 0,
            c2: 0,
            c3: 0,
          },
        );
      }

      const totals =
        pointsByStudent.get(
          studentId,
        )!;

      const category =
        normalizeCategory(
          transaction.category,
        );

      const points =
        Number(
          transaction.points,
        ) || 0;

      if (category === 'c1') {
        totals.c1 += points;
      }

      if (category === 'c2') {
        totals.c2 += points;
      }

      if (category === 'c3') {
        totals.c3 += points;
      }
    }

    const realStudents: AdminStudent[] =
      (profiles ?? []).map(
        (profile) => {
          const points =
            pointsByStudent.get(
              profile.id,
            ) ?? {
              c1: 0,
              c2: 0,
              c3: 0,
            };

          return {
            id:
              profile.id,

            name:
              profile.full_name ??
              profile.student_id ??
              'Student',

            department:
              profile.department ??
              'Not specified',

            c1:
              points.c1,

            c2:
              points.c2,

            c3:
              points.c3,
          };
        },
      );

    setAdminStudents(
      realStudents,
    );
  }

  async function loadAdminProviders() {
    const {
      data: providerProfiles,
      error: providerError,
    } = await supabase
      .from('profiles')
      .select(
        'id, full_name',
      )
      .eq(
        'role',
        'activity_provider',
      )
      .order('full_name', {
        ascending: true,
      });

    if (providerError) {
      console.error(
        'Unable to load providers:',
        providerError,
      );

      setAdminProviders([]);
      return;
    }

    const {
      data: activityRows,
      error: activityError,
    } = await supabase
      .from('activities')
      .select(
        'id, created_by',
      );

    if (activityError) {
      console.error(
        'Unable to load provider activities:',
        activityError,
      );

      setAdminProviders([]);
      return;
    }

    const {
      data: studentActivities,
      error: participantError,
    } = await supabase
      .from(
        'student_activities',
      )
      .select(
        'activity_id, student_id',
      );

    if (participantError) {
      console.error(
        'Unable to load participants:',
        participantError,
      );

      setAdminProviders([]);
      return;
    }

    const realProviders: AdminProvider[] =
      (
        providerProfiles ?? []
      ).map((provider) => {
        const providerActivities =
          (
            activityRows ?? []
          ).filter(
            (activity) =>
              activity.created_by ===
              provider.id,
          );

        const activityIds =
          new Set(
            providerActivities.map(
              (activity) =>
                String(
                  activity.id,
                ),
            ),
          );

        const students =
          new Set(
            (
              studentActivities ??
              []
            )
              .filter(
                (
                  registration,
                ) =>
                  activityIds.has(
                    String(
                      registration.activity_id,
                    ),
                  ),
              )
              .map(
                (
                  registration,
                ) =>
                  registration.student_id,
              ),
          );

        return {
          id:
            provider.id,

          name:
            provider.full_name ??
            'Activity Provider',

          activities:
            providerActivities.length,

          students:
            students.size,
        };
      });

    setAdminProviders(
      realProviders,
    );
  }

  async function getSignedProofUrl(
    path: string,
  ) {
    if (!path) {
      return undefined;
    }

    const {
      data,
      error,
    } = await supabase.storage
      .from('proofs')
      .createSignedUrl(
        path,
        60 * 60,
      );

    if (error) {
      console.error(
        'Unable to create proof preview URL:',
        error,
      );

      return undefined;
    }

    return data.signedUrl;
  }

  async function loadProofs() {
    const {
      data: proofRows,
      error: proofError,
    } = await supabase
      .from(
        'proof_submissions',
      )
      .select(`
        id,
        student_activity_id,
        proof_type,
        file_path,
        student_note,
        status,
        rejection_reason,
        submitted_at
      `)
      .order(
        'submitted_at',
        {
          ascending: false,
        },
      );

    if (proofError) {
      console.error(
        'Unable to load proofs:',
        proofError,
      );

      setProofs([]);
      setCompleted([]);

      return;
    }

    if (
      !proofRows ||
      proofRows.length === 0
    ) {
      setProofs([]);
      setCompleted([]);

      return;
    }

    const studentActivityIds =
      proofRows.map((proof) =>
        Number(
          proof.student_activity_id,
        ),
      );

    const {
      data: studentActivityRows,
      error: saError,
    } = await supabase
      .from(
        'student_activities',
      )
      .select(`
        id,
        student_id,
        activity_id,
        points_awarded
      `)
      .in(
        'id',
        studentActivityIds,
      );

    if (saError) {
      console.error(
        'Unable to load student activities:',
        saError,
      );

      setProofs([]);
      setCompleted([]);

      return;
    }

    const studentIds = [
      ...new Set(
        (
          studentActivityRows ??
          []
        ).map(
          (row) =>
            row.student_id,
        ),
      ),
    ];

    const activityIds = [
      ...new Set(
        (
          studentActivityRows ??
          []
        ).map(
          (row) =>
            row.activity_id,
        ),
      ),
    ];

    let studentProfiles: {
      id: string;
      full_name: string | null;
      student_id: string | null;
    }[] = [];

    if (
      studentIds.length > 0
    ) {
      const {
        data,
        error,
      } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          student_id
        `)
        .in(
          'id',
          studentIds,
        );

      if (error) {
        console.error(
          'Unable to load proof students:',
          error,
        );
      } else {
        studentProfiles =
          data ?? [];
      }
    }

    let activityData: {
      id: number;
      title: string;
      category: string;
      points: number;
      created_by:
        | string
        | null;
    }[] = [];

    if (
      activityIds.length > 0
    ) {
      const {
        data,
        error,
      } = await supabase
        .from('activities')
        .select(`
          id,
          title,
          category,
          points,
          created_by
        `)
        .in(
          'id',
          activityIds,
        );

      if (error) {
        console.error(
          'Unable to load proof activities:',
          error,
        );
      } else {
        activityData =
          data ?? [];
      }
    }

    const providerIds = [
      ...new Set(
        activityData
          .map(
            (activity) =>
              activity.created_by,
          )
          .filter(
            (
              id,
            ): id is string =>
              Boolean(id),
          ),
      ),
    ];

    let providerProfiles: {
      id: string;
      full_name: string | null;
    }[] = [];

    if (
      providerIds.length > 0
    ) {
      const {
        data,
        error,
      } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name
        `)
        .in(
          'id',
          providerIds,
        );

      if (error) {
        console.error(
          'Unable to load proof providers:',
          error,
        );
      } else {
        providerProfiles =
          data ?? [];
      }
    }

    const studentActivityMap =
      new Map(
        (
          studentActivityRows ??
          []
        ).map((row) => [
          String(row.id),
          row,
        ]),
      );

    const studentMap =
      new Map(
        studentProfiles.map(
          (profile) => [
            profile.id,
            profile,
          ],
        ),
      );

    const activityMap =
      new Map(
        activityData.map(
          (activity) => [
            String(
              activity.id,
            ),
            activity,
          ],
        ),
      );

    const providerMap =
      new Map(
        providerProfiles.map(
          (provider) => [
            provider.id,

            provider.full_name ??
              'Activity Provider',
          ],
        ),
      );

    const realProofs =
      await Promise.all(
        proofRows.map(
          async (proof) => {
            const studentActivity =
              studentActivityMap.get(
                String(
                  proof.student_activity_id,
                ),
              );

            if (
              !studentActivity
            ) {
              return null;
            }

            const studentProfile =
              studentMap.get(
                studentActivity.student_id,
              );

            const activity =
              activityMap.get(
                String(
                  studentActivity.activity_id,
                ),
              );

            if (!activity) {
              return null;
            }

            const status:
              ProofSubmission['status'] =
              proof.status ===
              'approved'
                ? 'approved'
                : proof.status ===
                    'rejected'
                  ? 'rejected'
                  : 'pending';

            const signedUrl =
              proof.file_path
                ? await getSignedProofUrl(
                    proof.file_path,
                  )
                : undefined;

            const mappedProof: ProofSubmission =
              {
                id:
                  String(
                    proof.id,
                  ),

                activityId:
                  String(
                    activity.id,
                  ),

                studentId:
                  studentActivity.student_id,

                studentName:
                  studentProfile?.full_name ??
                  studentProfile?.student_id ??
                  'Student',

                studentEmail:
                  '',

                activityTitle:
                  activity.title,

                category:
                  Number(
                    activity.category,
                  ),

                points:
                  Number(
                    activity.points,
                  ),

                provider:
                  activity.created_by
                    ? providerMap.get(
                        activity.created_by,
                      ) ??
                      'Activity Provider'
                    : 'Activity Provider',

                fileName:
                  getFileName(
                    proof.file_path,
                  ),

                fileType:
                  proof.proof_type ??
                  '',

                previewUrl:
                  signedUrl,

                note:
                  proof.student_note ??
                  '',

                submissionDate:
                  proof.submitted_at
                    ? new Date(
                        proof.submitted_at,
                      ).toLocaleDateString(
                        'en-US',
                        {
                          month:
                            'short',

                          day:
                            'numeric',

                          year:
                            'numeric',
                        },
                      )
                    : '',

                status,

                pointsAwarded:
                  status ===
                  'approved',

                rejectionReason:
                  proof.rejection_reason ??
                  undefined,
              };

            return mappedProof;
          },
        ),
      );

    const finalProofs =
      realProofs.filter(
        (
          proof,
        ): proof is ProofSubmission =>
          proof !== null,
      );

    setProofs(
      finalProofs,
    );

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (user) {
      const realCompleted: CompletedActivity[] =
        finalProofs
          .filter(
            (proof) =>
              proof.studentId ===
                user.id &&
              proof.status ===
                'approved',
          )
          .map((proof) => ({
            id:
              `completed-${proof.id}`,

            title:
              proof.activityTitle,

            category:
              proof.category,

            points:
              proof.points,

            date:
              proof.submissionDate,

            status:
              'Completed',
          }));

      setCompleted(
        realCompleted,
      );
    } else {
      setCompleted([]);
    }
  }

  async function loadAdminData() {
    await Promise.all([
      loadAdminStudents(),
      loadAdminProviders(),
      loadProofs(),
    ]);
  }

  async function loadUserRole(
    userId: string,
  ) {
    const {
      data: profile,
      error,
    } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        department,
        role
      `)
      .eq(
        'id',
        userId,
      )
      .single();

    if (
      error ||
      !profile
    ) {
      setRole(null);
      setUserProfile(null);
      setActivities([]);
      setAdminStudents([]);
      setAdminProviders([]);
      setProofs([]);
      setCompleted([]);

      setRegistrations(
        new Set(),
      );

      setStudentPoints({
        c1: 0,
        c2: 0,
        c3: 0,
      });

      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    setUserProfile({
      id:
        profile.id,

      full_name:
        profile.full_name,

      department:
        profile.department,

      email:
        user?.email ?? '',
    });

    const appRole: Role =
      profile.role ===
      'activity_provider'
        ? 'provider'
        : (profile.role as Role);

    if (
      appRole === 'student'
    ) {
      await Promise.all([
        loadStudentPoints(
          userId,
        ),

        loadStudentRegistrations(
          userId,
        ),

        loadProofs(),
      ]);

      setAdminStudents([]);
      setAdminProviders([]);
    } else {
      setStudentPoints({
        c1: 0,
        c2: 0,
        c3: 0,
      });

      setRegistrations(
        new Set(),
      );

      setCompleted([]);
    }

    await loadActivities();

    if (
      appRole === 'admin'
    ) {
      await loadAdminData();
    } else {
      setAdminStudents([]);
      setAdminProviders([]);

      if (
        appRole !==
        'student'
      ) {
        setProofs([]);
      }
    }

    setRole(appRole);

    setActiveKey(
      (currentPage) => {
        if (
          pageBelongsToRole(
            currentPage,
            appRole,
          )
        ) {
          return currentPage;
        }

        return getDashboardForRole(
          appRole,
        );
      },
    );
  }

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (session?.user) {
        await loadUserRole(
          session.user.id,
        );
      } else {
        setRole(null);
        setUserProfile(null);
        setActivities([]);
        setAdminStudents([]);
        setAdminProviders([]);
        setProofs([]);
        setCompleted([]);

        setRegistrations(
          new Set(),
        );

        setStudentPoints({
          c1: 0,
          c2: 0,
          c3: 0,
        });
      }

      if (mounted) {
        setAuthLoading(
          false,
        );
      }
    }

    void restoreSession();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          session,
        ) => {
          if (
            event ===
            'SIGNED_OUT'
          ) {
            setRole(null);
            setUserProfile(
              null,
            );
            setActivities([]);
            setAdminStudents([]);
            setAdminProviders([]);
            setProofs([]);
            setCompleted([]);

            setRegistrations(
              new Set(),
            );

            setStudentPoints({
              c1: 0,
              c2: 0,
              c3: 0,
            });

            setAuthLoading(
              false,
            );

            return;
          }

          if (
            event ===
              'SIGNED_IN' &&
            session?.user
          ) {
            void loadUserRole(
              session.user.id,
            );
          }
        },
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function handleLogin(
    r: Role,
  ) {
    setRole(r);

    setDashboardForRole(
      r,
    );

    void loadActivities();

    if (r === 'admin') {
      void loadAdminData();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    setRole(null);
    setUserProfile(null);
    setActivities([]);
    setAdminStudents([]);
    setAdminProviders([]);
    setProofs([]);
    setCompleted([]);

    setRegistrations(
      new Set(),
    );

    setStudentPoints({
      c1: 0,
      c2: 0,
      c3: 0,
    });

    setActiveKey(
      'student-dashboard',
    );

    sessionStorage.removeItem(
      'activity-manager-active-page',
    );
  }

  function handleNavigate(
    key: string,
  ) {
    if (key === 'logout') {
      void handleLogout();
      return;
    }

    setActiveKey(key);
  }

  async function handleRegister(
    activityId: string,
  ) {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      alert(
        'You must be logged in to register.',
      );

      return;
    }

    if (
      registrations.has(
        activityId,
      )
    ) {
      return;
    }

    const { error } =
      await supabase
        .from(
          'student_activities',
        )
        .insert({
          student_id:
            user.id,

          activity_id:
            Number(
              activityId,
            ),

          status:
            'registered',

          points_awarded:
            0,
        });

    if (error) {
      console.error(
        'Unable to register:',
        error,
      );

      if (
        error.code ===
        '23505'
      ) {
        setRegistrations(
          (prev) => {
            const next =
              new Set(prev);

            next.add(
              activityId,
            );

            return next;
          },
        );

        return;
      }

      alert(
        `Unable to register: ${error.message}`,
      );

      return;
    }

    setRegistrations(
      (prev) => {
        const next =
          new Set(prev);

        next.add(
          activityId,
        );

        return next;
      },
    );
  }

  async function handleAddActivity(
    activity: Activity,
  ): Promise<boolean> {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      alert(
        'You must be logged in to create an activity.',
      );

      return false;
    }

    const { error } =
      await supabase
        .from('activities')
        .insert({
          title:
            activity.title,

          description:
            activity.description ||
            null,

          category:
            String(
              activity.category,
            ),

          activity_date:
            activity.date,

          venue:
            activity.venue ||
            null,

          eligibility:
            activity.eligibility ||
            null,

          registration_deadline:
            activity.deadline ||
            null,

          registration_link:
            activity.link ||
            null,

          points:
            activity.points,

          created_by:
            user.id,
        });

    if (error) {
      console.error(
        'Unable to create activity:',
        error,
      );

      alert(
        `Unable to create activity: ${error.message}`,
      );

      return false;
    }

    await loadActivities();

    setActiveKey(
      'provider-activities',
    );

    return true;
  }

  async function handleSubmitProof(
    activityId: string,
    file: File,
    note: string,
  ): Promise<boolean> {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      alert(
        'You must be logged in to submit proof.',
      );

      return false;
    }

    const {
      data: studentActivity,
      error:
        registrationError,
    } = await supabase
      .from(
        'student_activities',
      )
      .select('id')
      .eq(
        'student_id',
        user.id,
      )
      .eq(
        'activity_id',
        Number(
          activityId,
        ),
      )
      .single();

    if (
      registrationError ||
      !studentActivity
    ) {
      console.error(
        'Unable to find registration:',
        registrationError,
      );

      alert(
        'Your activity registration could not be found.',
      );

      return false;
    }

    const safeFileName =
      file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        '_',
      );

    const filePath =
      `${user.id}/` +
      `${studentActivity.id}/` +
      `${Date.now()}-${safeFileName}`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from('proofs')
        .upload(
          filePath,
          file,
          {
            cacheControl:
              '3600',

            upsert:
              false,

            contentType:
              file.type ||
              'application/octet-stream',
          },
        );

    if (uploadError) {
      console.error(
        'Unable to upload proof file:',
        uploadError,
      );

      alert(
        `Unable to upload proof: ${uploadError.message}`,
      );

      return false;
    }

    const {
      data: existingProof,
      error:
        existingProofError,
    } = await supabase
      .from(
        'proof_submissions',
      )
      .select(
        'id, file_path',
      )
      .eq(
        'student_activity_id',
        studentActivity.id,
      )
      .maybeSingle();

    if (
      existingProofError
    ) {
      await supabase.storage
        .from('proofs')
        .remove([
          filePath,
        ]);

      alert(
        `Unable to submit proof: ${existingProofError.message}`,
      );

      return false;
    }

    if (existingProof) {
      const {
        error: updateError,
      } = await supabase
        .from(
          'proof_submissions',
        )
        .update({
          proof_type:
            'Certificate',

          file_path:
            filePath,

          student_note:
            note || null,

          status:
            'pending',

          rejection_reason:
            null,

          reviewed_by:
            null,

          reviewed_at:
            null,

          submitted_at:
            new Date().toISOString(),
        })
        .eq(
          'id',
          existingProof.id,
        );

      if (updateError) {
        await supabase.storage
          .from('proofs')
          .remove([
            filePath,
          ]);

        alert(
          `Unable to submit proof: ${updateError.message}`,
        );

        return false;
      }

      if (
        existingProof.file_path &&
        existingProof.file_path !==
          filePath
      ) {
        await supabase.storage
          .from('proofs')
          .remove([
            existingProof.file_path,
          ]);
      }
    } else {
      const {
        error: insertError,
      } = await supabase
        .from(
          'proof_submissions',
        )
        .insert({
          student_activity_id:
            studentActivity.id,

          proof_type:
            'Certificate',

          file_path:
            filePath,

          student_note:
            note || null,

          status:
            'pending',
        });

      if (insertError) {
        await supabase.storage
          .from('proofs')
          .remove([
            filePath,
          ]);

        alert(
          `Unable to submit proof: ${insertError.message}`,
        );

        return false;
      }
    }

    await loadProofs();

    return true;
  }

  async function handleApproveProof(
    proofId: string,
  ): Promise<boolean> {
    const {
      data: { user: adminUser },
    } =
      await supabase.auth.getUser();

    if (!adminUser) {
      alert(
        'Admin session not found.',
      );

      return false;
    }

    const {
      data: proofRecord,
      error: proofError,
    } = await supabase
      .from(
        'proof_submissions',
      )
      .select(`
        id,
        student_activity_id,
        status
      `)
      .eq(
        'id',
        Number(proofId),
      )
      .single();

    if (
      proofError ||
      !proofRecord
    ) {
      console.error(
        'Unable to load proof:',
        proofError,
      );

      alert(
        'Unable to find the proof submission.',
      );

      return false;
    }

    const {
      data: studentActivity,
      error: studentActivityError,
    } = await supabase
      .from(
        'student_activities',
      )
      .select(`
        id,
        student_id,
        activity_id,
        points_awarded
      `)
      .eq(
        'id',
        proofRecord.student_activity_id,
      )
      .single();

    if (
      studentActivityError ||
      !studentActivity
    ) {
      console.error(
        'Unable to load student activity:',
        studentActivityError,
      );

      alert(
        'Unable to find the student activity.',
      );

      return false;
    }

    const {
      data: activity,
      error: activityError,
    } = await supabase
      .from('activities')
      .select(`
        id,
        category,
        points
      `)
      .eq(
        'id',
        studentActivity.activity_id,
      )
      .single();

    if (
      activityError ||
      !activity
    ) {
      console.error(
        'Unable to load activity:',
        activityError,
      );

      alert(
        'Unable to find the activity.',
      );

      return false;
    }

    const categoryNumber =
      Number(
        activity.category,
      );

    const points =
      Number(
        activity.points,
      );

    const category =
      databaseCategory(
        categoryNumber,
      );

    const {
      data: existingTransaction,
      error:
        transactionCheckError,
    } = await supabase
      .from(
        'point_transactions',
      )
      .select('id')
      .eq(
        'proof_submission_id',
        Number(proofId),
      )
      .maybeSingle();

    if (
      transactionCheckError
    ) {
      console.error(
        'Unable to check point transaction:',
        transactionCheckError,
      );

      alert(
        `Unable to verify point transaction: ${transactionCheckError.message}`,
      );

      return false;
    }

    if (
      !existingTransaction
    ) {
      const {
        error: insertPointError,
      } = await supabase
        .from(
          'point_transactions',
        )
        .insert({
          student_id:
            studentActivity.student_id,

          activity_id:
            studentActivity.activity_id,

          proof_submission_id:
            Number(proofId),

          category,

          points,

          awarded_by:
            adminUser.id,
        });

      if (insertPointError) {
        console.error(
          'Unable to award points:',
          insertPointError,
        );

        alert(
          `Unable to award points: ${insertPointError.message}`,
        );

        return false;
      }
    }

    const now =
      new Date().toISOString();

    const {
      error:
        studentActivityUpdateError,
    } = await supabase
      .from(
        'student_activities',
      )
      .update({
        points_awarded:
          points,

        verified_by:
          adminUser.id,

        verified_at:
          now,
      })
      .eq(
        'id',
        studentActivity.id,
      );

    if (
      studentActivityUpdateError
    ) {
      console.error(
        'Unable to update student activity:',
        studentActivityUpdateError,
      );

      alert(
        `Points were recorded, but the student activity could not be updated: ${studentActivityUpdateError.message}`,
      );

      return false;
    }

    const {
      error:
        approveProofError,
    } = await supabase
      .from(
        'proof_submissions',
      )
      .update({
        status:
          'approved',

        rejection_reason:
          null,

        reviewed_by:
          adminUser.id,

        reviewed_at:
          now,
      })
      .eq(
        'id',
        Number(proofId),
      );

    if (
      approveProofError
    ) {
      console.error(
        'Unable to mark proof approved:',
        approveProofError,
      );

      alert(
        `Points were recorded, but the proof status could not be updated: ${approveProofError.message}`,
      );

      return false;
    }

    await Promise.all([
      loadProofs(),
      loadAdminStudents(),
      loadAdminProviders(),
    ]);

    return true;
  }

  async function handleRejectProof(
    proofId: string,
    reason: string,
  ): Promise<boolean> {
    const {
      data: { user: adminUser },
    } =
      await supabase.auth.getUser();

    if (!adminUser) {
      alert(
        'Admin session not found.',
      );

      return false;
    }

    const {
      data: proofRecord,
      error: proofError,
    } = await supabase
      .from(
        'proof_submissions',
      )
      .select(`
        id,
        student_activity_id
      `)
      .eq(
        'id',
        Number(proofId),
      )
      .single();

    if (
      proofError ||
      !proofRecord
    ) {
      alert(
        'Unable to find the proof submission.',
      );

      return false;
    }

    const now =
      new Date().toISOString();

    const {
      error: rejectError,
    } = await supabase
      .from(
        'proof_submissions',
      )
      .update({
        status:
          'rejected',

        rejection_reason:
          reason,

        reviewed_by:
          adminUser.id,

        reviewed_at:
          now,
      })
      .eq(
        'id',
        Number(proofId),
      );

    if (rejectError) {
      console.error(
        'Unable to reject proof:',
        rejectError,
      );

      alert(
        `Unable to reject proof: ${rejectError.message}`,
      );

      return false;
    }

    const {
      error:
        studentActivityError,
    } = await supabase
      .from(
        'student_activities',
      )
      .update({
        points_awarded:
          0,

        verified_by:
          adminUser.id,

        verified_at:
          now,
      })
      .eq(
        'id',
        proofRecord.student_activity_id,
      );

    if (
      studentActivityError
    ) {
      console.error(
        'Unable to update student activity after rejection:',
        studentActivityError,
      );
    }

    await loadProofs();

    return true;
  }

  async function handleApproveActivity(
    id: string,
  ) {
    const { error } =
      await supabase
        .from('activities')
        .update({
          approval_status:
            'approved',

          rejection_reason:
            null,
        })
        .eq(
          'id',
          Number(id),
        );

    if (error) {
      console.error(
        'Unable to approve activity:',
        error,
      );

      alert(
        `Unable to approve activity: ${error.message}`,
      );

      return;
    }

    await loadActivities();
  }

  async function handleRejectActivity(
    id: string,
  ) {
    const { error } =
      await supabase
        .from('activities')
        .update({
          approval_status:
            'rejected',
        })
        .eq(
          'id',
          Number(id),
        );

    if (error) {
      console.error(
        'Unable to reject activity:',
        error,
      );

      alert(
        `Unable to reject activity: ${error.message}`,
      );

      return;
    }

    await loadActivities();
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  const approvedActivities =
    activities.filter(
      (activity) =>
        activity.status ===
        'approved',
    );

  const registeredActivities =
    activities.filter(
      (activity) =>
        registrations.has(
          activity.id,
        ),
    );

  function renderPage() {
    switch (activeKey) {
      case 'student-dashboard':
        return (
          <StudentDashboard
            student={student}
            activities={
              activities
            }
            registrations={
              registrations
            }
            proofs={proofs}
            completed={
              completed
            }
            onNavigate={
              setActiveKey
            }
          />
        );

      case 'student-points':
        return (
          <MyPointsPage
            student={student}
          />
        );

      case 'student-activities':
        return (
          <ActivitiesPage
            activities={
              approvedActivities
            }
            registrations={
              registrations
            }
            onRegister={
              handleRegister
            }
          />
        );

      case 'student-registered':
        return (
          <RegisteredActivitiesPage
            student={student}
            registrations={
              registeredActivities
            }
            proofs={proofs}
            onSubmitProof={
              handleSubmitProof
            }
          />
        );

      case 'student-ai':
        return (
          <AIRecommendationsPage
            student={student}
            activities={
              activities
            }
            registrations={
              registrations
            }
            proofs={proofs}
            completed={
              completed
            }
            onNavigate={
              setActiveKey
            }
          />
        );

      case 'student-completed':
        return (
          <CompletedActivitiesPage
            completed={
              completed
            }
          />
        );

      case 'student-profile':
        return (
          <ProfilePage
            student={student}
          />
        );

      case 'provider-dashboard':
        return (
          <ProviderDashboard
            activities={
              activities
            }
            onNavigate={
              setActiveKey
            }
          />
        );

      case 'provider-add':
        return (
          <AddActivityPage
            onSubmit={
              handleAddActivity
            }
            onCancel={() =>
              setActiveKey(
                'provider-dashboard',
              )
            }
          />
        );

      case 'provider-activities':
        return (
          <MyActivitiesPage
            activities={
              activities
            }
          />
        );

      case 'provider-participants':
        return (
          <ParticipantsPage
            activities={
              activities
            }
          />
        );

      case 'admin-dashboard':
        return (
          <AdminDashboard
            students={
              adminStudents
            }
            activities={
              activities
            }
            providerCount={
              adminProviders.length
            }
            onNavigate={
              setActiveKey
            }
          />
        );

      case 'admin-students':
        return (
          <AdminStudentsPage
            students={
              adminStudents
            }
          />
        );

      case 'admin-providers':
        return (
          <AdminProvidersPage
            providers={
              adminProviders
            }
          />
        );

      case 'admin-activities':
        return (
          <AdminActivitiesPage
            activities={
              activities
            }
          />
        );

      case 'admin-approvals':
        return (
          <AdminApprovalsPage
            activities={
              activities
            }
            onApprove={
              handleApproveActivity
            }
            onReject={
              handleRejectActivity
            }
          />
        );

      case 'admin-verifications':
        return (
          <PointVerificationsPage
            proofs={proofs}
            onApprove={
              handleApproveProof
            }
            onReject={
              handleRejectProof
            }
          />
        );

      default:
        return null;
    }
  }

  return (
    <AppShell
      role={role}
      activeKey={
        activeKey
      }
      onNavigate={
        handleNavigate
      }
    >
      {renderPage()}
    </AppShell>
  );
}

export default App;