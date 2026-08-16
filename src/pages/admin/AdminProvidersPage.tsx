import { ShieldCheck, CalendarDays, Users } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';

export interface AdminProvider {
  id: string;
  name: string;
  activities: number;
  students: number;
}

interface AdminProvidersPageProps {
  providers: AdminProvider[];
}

export function AdminProvidersPage({
  providers,
}: AdminProvidersPageProps) {
  const totalActivities = providers.reduce(
    (sum, provider) => sum + provider.activities,
    0,
  );

  const totalStudents = providers.reduce(
    (sum, provider) => sum + provider.students,
    0,
  );

  return (
    <div>
      <PageHeader
        title="Activity Providers"
        subtitle="Organizations managing student activities"
        icon={<ShieldCheck className="h-5 w-5" />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Total Providers"
          value={providers.length}
          accentClass="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Total Activities"
          value={totalActivities}
          accentClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total Participants"
          value={totalStudents}
          accentClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">
                  Provider Name
                </th>
                <th className="px-5 py-3 font-semibold">
                  Activities Created
                </th>
                <th className="px-5 py-3 font-semibold">
                  Participating Students
                </th>
                <th className="px-5 py-3 font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {providers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-slate-400"
                  >
                    No activity providers found.
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr
                    key={provider.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <ShieldCheck className="h-4 w-4" />
                        </div>

                        <span className="font-medium text-slate-800">
                          {provider.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-slate-700">
                      {provider.activities}
                    </td>

                    <td className="px-5 py-3.5 text-slate-700">
                      {provider.students}
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}