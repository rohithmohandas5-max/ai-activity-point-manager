import { useEffect, useState } from 'react';
import type { Role } from '@/types/nav';
import { LoginPage } from '@/pages/LoginPage';
import { AppShell } from '@/components/AppShell';
import { supabase } from '@/utils/supabase';

import {
  SAMPLE_STUDENT,
  SAMPLE_ACTIVITIES,
  SAMPLE_COMPLETED,
  SAMPLE_ADMIN_STUDENTS,
  SAMPLE_PROOFS,
  type Activity,
  type ProofSubmission,
  type CompletedActivity,
  type Student,
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
import { AdminProvidersPage } from '@/pages/admin/AdminProvidersPage';
import { AdminActivitiesPage } from '@/pages/admin/AdminActivitiesPage';
import { AdminApprovalsPage } from '@/pages/admin/AdminApprovalsPage';
import { PointVerificationsPage } from '@/pages/admin/PointVerificationsPage';

const BASE_POINTS = { c1: 32, c2: 18, c3: 27 };

function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [userProfile, setUserProfile] = useState<{
    id: string;
    full_name: string | null;
    department: string | null;
    email: string;
  } | null>(null);

  const [activeKey, setActiveKey] = useState<string>('student-dashboard');
  const [activities, setActivities] = useState<Activity[]>(SAMPLE_ACTIVITIES);
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());
  const [proofs, setProofs] = useState<ProofSubmission[]>(SAMPLE_PROOFS);

  const [bonusPoints, setBonusPoints] = useState({
    c1: 0,
    c2: 0,
    c3: 0,
  });

  const [extraCompleted, setExtraCompleted] = useState<CompletedActivity[]>([]);

  const student: Student = {
    ...SAMPLE_STUDENT,
    id: userProfile?.id ?? SAMPLE_STUDENT.id,
    name: userProfile?.full_name ?? SAMPLE_STUDENT.name,
    email: userProfile?.email ?? SAMPLE_STUDENT.email,
    department: userProfile?.department ?? SAMPLE_STUDENT.department,
    points: {
      c1: BASE_POINTS.c1 + bonusPoints.c1,
      c2: BASE_POINTS.c2 + bonusPoints.c2,
      c3: BASE_POINTS.c3 + bonusPoints.c3,
    },
  };

  const adminStudents = SAMPLE_ADMIN_STUDENTS.map((s) =>
    s.id === 's-1'
      ? {
          ...s,
          name: student.name,
          department: student.department,
          c1: student.points.c1,
          c2: student.points.c2,
          c3: student.points.c3,
        }
      : s,
  );

  const completed = [...SAMPLE_COMPLETED, ...extraCompleted];

  function setDashboardForRole(r: Role) {
    if (r === 'student') {
      setActiveKey('student-dashboard');
    }

    if (r === 'provider') {
      setActiveKey('provider-dashboard');
    }

    if (r === 'admin') {
      setActiveKey('admin-dashboard');
    }
  }

  async function loadUserRole(userId: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, department, role')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      setRole(null);
      setUserProfile(null);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUserProfile({
      id: profile.id,
      full_name: profile.full_name,
      department: profile.department,
      email: user?.email ?? '',
    });

    const appRole: Role =
      profile.role === 'activity_provider'
        ? 'provider'
        : (profile.role as Role);

    setRole(appRole);
    setDashboardForRole(appRole);
  }

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        await loadUserRole(session.user.id);
      } else {
        setRole(null);
        setUserProfile(null);
      }

      if (mounted) {
        setAuthLoading(false);
      }
    }

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setRole(null);
        setUserProfile(null);
        setActiveKey('student-dashboard');
        setAuthLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' && session?.user) {
        loadUserRole(session.user.id);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function handleLogin(r: Role) {
    setRole(r);
    setDashboardForRole(r);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setRole(null);
    setUserProfile(null);
    setActiveKey('student-dashboard');
  }

  function handleNavigate(key: string) {
    if (key === 'logout') {
      void handleLogout();
      return;
    }

    setActiveKey(key);
  }

  function handleRegister(activityId: string) {
    setRegistrations((prev) => {
      const next = new Set(prev);
      next.add(activityId);
      return next;
    });
  }

  function handleAddActivity(activity: Activity) {
    setActivities((prev) => [activity, ...prev]);
  }

  function handleSubmitProof(
    activityId: string,
    fileName: string,
    fileType: string,
    previewUrl: string | undefined,
    note: string,
  ) {
    const activity = activities.find((a) => a.id === activityId);

    if (!activity) return;

    const newProof: ProofSubmission = {
      id: `proof-${Date.now()}`,
      activityId,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      activityTitle: activity.title,
      category: activity.category,
      points: activity.points,
      provider: activity.provider,
      fileName,
      fileType,
      previewUrl,
      note,
      submissionDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'pending',
    };

    setProofs((prev) => {
      const filtered = prev.filter(
        (p) =>
          !(p.activityId === activityId && p.studentId === student.id),
      );

      return [...filtered, newProof];
    });
  }

  function handleApproveProof(proofId: string) {
    setProofs((prev) => {
      const proof = prev.find((p) => p.id === proofId);

      if (!proof) return prev;

      if (proof.status === 'approved' && proof.pointsAwarded) {
        return prev;
      }

      const updated = prev.map((p) =>
        p.id === proofId
          ? {
              ...p,
              status: 'approved' as const,
              pointsAwarded: true,
              rejectionReason: undefined,
            }
          : p,
      );

      const key = `c${proof.category}` as keyof typeof bonusPoints;

      setBonusPoints((bp) => ({
        ...bp,
        [key]: bp[key] + proof.points,
      }));

      setExtraCompleted((ec) => [
        ...ec,
        {
          id: `comp-${proofId}`,
          title: proof.activityTitle,
          category: proof.category,
          points: proof.points,
          date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          status: 'Completed',
        },
      ]);

      return updated;
    });
  }

  function handleRejectProof(proofId: string, reason: string) {
    setProofs((prev) =>
      prev.map((p) =>
        p.id === proofId
          ? {
              ...p,
              status: 'rejected' as const,
              rejectionReason: reason,
            }
          : p,
      ),
    );
  }

  function handleApproveActivity(id: string) {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'approved' } : a,
      ),
    );
  }

  function handleRejectActivity(id: string) {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'rejected' } : a,
      ),
    );
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
    return <LoginPage onLogin={handleLogin} />;
  }

  const approvedActivities = activities.filter(
    (a) => a.status === 'approved',
  );

  const registeredActivities = activities.filter((a) =>
    registrations.has(a.id),
  );

  function renderPage() {
    switch (activeKey) {
      // Student
      case 'student-dashboard':
        return (
          <StudentDashboard
            student={student}
            activities={activities}
            registrations={registrations}
            proofs={proofs}
            completed={completed}
            onNavigate={setActiveKey}
          />
        );

      case 'student-points':
        return <MyPointsPage student={student} />;

      case 'student-activities':
        return (
          <ActivitiesPage
            activities={approvedActivities}
            registrations={registrations}
            onRegister={handleRegister}
          />
        );

      case 'student-registered':
        return (
          <RegisteredActivitiesPage
            student={student}
            registrations={registeredActivities}
            proofs={proofs}
            onSubmitProof={handleSubmitProof}
          />
        );

      case 'student-ai':
        return (
          <AIRecommendationsPage
            student={student}
            activities={activities}
            registrations={registrations}
            proofs={proofs}
            completed={completed}
            onNavigate={setActiveKey}
          />
        );

      case 'student-completed':
        return <CompletedActivitiesPage completed={completed} />;

      case 'student-profile':
        return <ProfilePage student={student} />;

      // Provider
      case 'provider-dashboard':
        return (
          <ProviderDashboard
            activities={activities}
            onNavigate={setActiveKey}
          />
        );

      case 'provider-add':
        return (
          <AddActivityPage
            onSubmit={handleAddActivity}
            onCancel={() => setActiveKey('provider-dashboard')}
          />
        );

      case 'provider-activities':
        return <MyActivitiesPage activities={activities} />;

      case 'provider-participants':
        return <ParticipantsPage activities={activities} />;

      // Admin
      case 'admin-dashboard':
        return (
          <AdminDashboard
            students={adminStudents}
            activities={activities}
            onNavigate={setActiveKey}
          />
        );

      case 'admin-students':
        return <AdminStudentsPage students={adminStudents} />;

      case 'admin-providers':
        return <AdminProvidersPage />;

      case 'admin-activities':
        return <AdminActivitiesPage activities={activities} />;

      case 'admin-approvals':
        return (
          <AdminApprovalsPage
            activities={activities}
            onApprove={handleApproveActivity}
            onReject={handleRejectActivity}
          />
        );

      case 'admin-verifications':
        return (
          <PointVerificationsPage
            proofs={proofs}
            onApprove={handleApproveProof}
            onReject={handleRejectProof}
          />
        );

      default:
        return null;
    }
  }

  return (
    <AppShell
      role={role}
      activeKey={activeKey}
      onNavigate={handleNavigate}
    >
      {renderPage()}
    </AppShell>
  );
}

export default App;