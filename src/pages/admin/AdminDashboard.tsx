import {
  Users,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';

import type {
  Activity,
  AdminStudent,
} from '@/types/data';

import { adminStudentStatus } from '@/types/progress';
import { StatCard } from '@/components/StatCard';
import { PageHeader } from '@/components/PageHeader';
import { StatusPill } from '@/components/StatusPill';

interface AdminDashboardProps {
  students: AdminStudent[];
  activities: Activity[];
  providerCount: number;
  onNavigate: (key: string) => void;
}

export function AdminDashboard({
  students,
  activities,
  providerCount,
  onNavigate,
}: AdminDashboardProps) {
  const totalStudents = students.length;
  const totalProviders = providerCount;
  const totalActivities = activities.length;

  const completed = students.filter(
    (s) =>
      adminStudentStatus(
        s.c1,
        s.c2,
        s.c3,
      ) === 'Completed',
  ).length;

  const incomplete =
    totalStudents - completed;

  const pendingApproval =
    activities.filter(
      (a) => a.status === 'pending',
    ).length;

  return (
    <div>
      <PageHeader
        title="Administrator Dashboard"
        subtitle="University-wide activity point management"
        icon={
          <ShieldCheck className="h-5 w-5" />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={
            <Users className="h-5 w-5" />
          }
          label="Total Students"
          value={totalStudents}
          accentClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={
            <ShieldCheck className="h-5 w-5" />
          }
          label="Activity Providers"
          value={totalProviders}
          accentClass="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          icon={
            <CalendarDays className="h-5 w-5" />
          }
          label="Total Activities"
          value={totalActivities}
          accentClass="bg-slate-100 text-slate-600"
        />

        <StatCard
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
          label="Completed Requirements"
          value={completed}
          sublabel="Students meeting all criteria"
          accentClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          icon={
            <AlertTriangle className="h-5 w-5" />
          }
          label="Not Completed"
          value={incomplete}
          sublabel="Students below requirements"
          accentClass="bg-rose-50 text-rose-600"
        />

        <StatCard
          icon={
            <ClipboardList className="h-5 w-5" />
          }
          label="Awaiting Approval"
          value={pendingApproval}
          sublabel="Pending activities"
          accentClass="bg-amber-50 text-amber-500"
        />
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-bold text-slate-800">
            Student Overview
          </h3>

          <button
            onClick={() =>
              onNavigate(
                'admin-students',
              )
            }
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">
                  Student Name
                </th>

                <th className="px-5 py-3 font-semibold">
                  Department
                </th>

                <th className="px-5 py-3 font-semibold">
                  Cat 1
                </th>

                <th className="px-5 py-3 font-semibold">
                  Cat 2
                </th>

                <th className="px-5 py-3 font-semibold">
                  Cat 3
                </th>

                <th className="px-5 py-3 font-semibold">
                  Total
                </th>

                <th className="px-5 py-3 font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {students
                .slice(0, 6)
                .map((s) => {
                  const total =
                    s.c1 +
                    s.c2 +
                    s.c3;

                  const status =
                    adminStudentStatus(
                      s.c1,
                      s.c2,
                      s.c3,
                    );

                  return (
                    <tr
                      key={s.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        {s.name}
                      </td>

                      <td className="px-5 py-3.5 text-slate-600">
                        {s.department}
                      </td>

                      <td className="px-5 py-3.5 text-slate-700">
                        {s.c1}
                      </td>

                      <td className="px-5 py-3.5 text-slate-700">
                        {s.c2}
                      </td>

                      <td className="px-5 py-3.5 text-slate-700">
                        {s.c3}
                      </td>

                      <td className="px-5 py-3.5 font-semibold text-slate-800">
                        {total}
                      </td>

                      <td className="px-5 py-3.5">
                        <StatusPill
                          status={
                            status
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}