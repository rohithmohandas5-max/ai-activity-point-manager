import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: number;
  className?: string;
}

const STYLES: Record<number, string> = {
  1: 'bg-blue-50 text-blue-700 ring-blue-200',
  2: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  3: 'bg-amber-50 text-amber-700 ring-amber-200',
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        STYLES[category] ?? 'bg-slate-50 text-slate-700 ring-slate-200',
        className,
      )}
    >
      Category {category}
    </span>
  );
}
