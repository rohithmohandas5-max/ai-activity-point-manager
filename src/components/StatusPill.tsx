import { cn } from '@/lib/utils';

interface StatusPillProps {
  status: 'Completed' | 'Incomplete' | 'Approved' | 'Pending' | 'Rejected';
  className?: string;
}

const STYLES: Record<StatusPillProps['status'], string> = {
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Incomplete: 'bg-rose-50 text-rose-700 ring-rose-200',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
};

const ICONS: Record<StatusPillProps['status'], string> = {
  Completed: '\u2713',
  Approved: '\u2713',
  Incomplete: '\u2717',
  Rejected: '\u2717',
  Pending: '\u25CF',
};

export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        STYLES[status],
        className,
      )}
    >
      <span className="text-[10px]">{ICONS[status]}</span>
      {status}
    </span>
  );
}
