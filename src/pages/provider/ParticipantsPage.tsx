import { Users, Mail, Award } from 'lucide-react';
import type { Activity } from '@/types/data';
import { CategoryBadge } from '@/components/CategoryBadge';
import { PageHeader } from '@/components/PageHeader';

interface ParticipantsPageProps {
  activities: Activity[];
}

const SAMPLE_PARTICIPANTS = [
  { id: 'p1', name: 'Rohith Mohandas', email: 'rohith.m@university.edu', dept: 'AI & Data Science' },
  { id: 'p2', name: 'Ananya Sharma', email: 'ananya.s@university.edu', dept: 'Computer Science' },
  { id: 'p3', name: 'Vikram Nair', email: 'vikram.n@university.edu', dept: 'Electronics' },
  { id: 'p4', name: 'Priya Iyer', email: 'priya.i@university.edu', dept: 'Mechanical' },
  { id: 'p5', name: 'Arjun Reddy', email: 'arjun.r@university.edu', dept: 'Information Tech' },
  { id: 'p6', name: 'Sneha Pillai', email: 'sneha.p@university.edu', dept: 'AI & Data Science' },
  { id: 'p7', name: 'Karthik Menon', email: 'karthik.m@university.edu', dept: 'Civil' },
  { id: 'p8', name: 'Divya Raghavan', email: 'divya.r@university.edu', dept: 'Computer Science' },
];

export function ParticipantsPage({ activities }: ParticipantsPageProps) {
  return (
    <div>
      <PageHeader title="Participants" subtitle="Students registered for your activities" icon={<Users className="h-5 w-5" />} />

      {/* Activity filter chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {activities.slice(0, 6).map((a) => (
          <span key={a.id} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            <CategoryBadge category={a.category} className="px-1.5 py-0" />
            {a.title}
          </span>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">Student Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Registered Activities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {SAMPLE_PARTICIPANTS.map((p, idx) => {
                const acts = activities.slice(0, ((idx % 3) + 1));
                return (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                          {p.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="font-medium text-slate-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> {p.email}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{p.dept}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {acts.map((a) => (
                          <span key={a.id} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            <Award className="h-3 w-3 text-blue-500" /> {a.title}
                          </span>
                        ))}
                      </div>
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
