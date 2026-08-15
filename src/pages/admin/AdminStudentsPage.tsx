import { useState } from 'react';
import { Users, Search } from 'lucide-react';
import type { AdminStudent } from '@/types/data';
import { adminStudentStatus } from '@/types/progress';
import { PageHeader } from '@/components/PageHeader';
import { StatusPill } from '@/components/StatusPill';

interface AdminStudentsPageProps {
  students: AdminStudent[];
}

export function AdminStudentsPage({ students }: AdminStudentsPageProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'Completed' | 'Incomplete'>('all');

  const filtered = students.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase()) || s.department.toLowerCase().includes(query.toLowerCase());
    const status = adminStudentStatus(s.c1, s.c2, s.c3);
    const matchesFilter = filter === 'all' || status === filter;
    return matchesQuery && matchesFilter;
  });

  const completed = students.filter((s) => adminStudentStatus(s.c1, s.c2, s.c3) === 'Completed').length;

  return (
    <div>
      <PageHeader title="Students" subtitle="All registered students and their activity points" icon={<Users className="h-5 w-5" />} />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field pl-10"
            placeholder="Search by name or department..."
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'Completed', 'Incomplete'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? 'rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white'
                  : 'rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex gap-4 text-sm">
        <span className="text-slate-500">
          Total: <span className="font-bold text-slate-800">{students.length}</span>
        </span>
        <span className="text-slate-500">
          Completed: <span className="font-bold text-emerald-600">{completed}</span>
        </span>
        <span className="text-slate-500">
          Incomplete: <span className="font-bold text-rose-600">{students.length - completed}</span>
        </span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-semibold">Student Name</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Category 1</th>
                <th className="px-5 py-3 font-semibold">Category 2</th>
                <th className="px-5 py-3 font-semibold">Category 3</th>
                <th className="px-5 py-3 font-semibold">Total Points</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s) => {
                const total = s.c1 + s.c2 + s.c3;
                const status = adminStudentStatus(s.c1, s.c2, s.c3);
                return (
                  <tr key={s.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                          {s.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="font-medium text-slate-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{s.department}</td>
                    <td className="px-5 py-3.5 text-slate-700">{s.c1}</td>
                    <td className="px-5 py-3.5 text-slate-700">{s.c2}</td>
                    <td className="px-5 py-3.5 text-slate-700">{s.c3}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{total}</td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-slate-400">No students match your search.</div>
        )}
      </div>
    </div>
  );
}
