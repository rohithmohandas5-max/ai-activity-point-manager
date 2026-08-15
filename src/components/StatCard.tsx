import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  sublabel?: string;
  accentClass?: string;
}

export function StatCard({ icon, label, value, sublabel, accentClass = 'bg-blue-50 text-blue-600' }: StatCardProps) {
  return (
    <div className="card p-5 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
          {sublabel && <p className="mt-1 text-xs text-slate-400">{sublabel}</p>}
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', accentClass)}>{icon}</div>
      </div>
    </div>
  );
}
