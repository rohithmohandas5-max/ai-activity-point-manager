import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  colorClass?: string;
  height?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  value,
  max,
  colorClass = 'bg-blue-600',
  height = 'h-3',
  showLabel = false,
  label,
}: ProgressBarProps) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>{label}</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-slate-100', height)}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', colorClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
