import { cn } from '@/lib/utils';

/**
 * The diagonal bar motif from Denisi Color's social ads: two light bars and one amber highlight.
 * Purely decorative — position it absolutely inside a navy block.
 */
export function Stripes({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'navy' }) {
  const bar = tone === 'light' ? '#ffffff' : 'var(--color-brand-700)';
  return (
    <svg viewBox="0 0 240 200" className={cn('pointer-events-none select-none', className)} aria-hidden preserveAspectRatio="xMidYMid slice">
      <g transform="skewX(-28)">
        <rect x="120" y="0" width="22" height="200" fill={bar} opacity={tone === 'light' ? 0.1 : 0.12} />
        <rect x="160" y="0" width="22" height="200" fill={bar} opacity={tone === 'light' ? 0.16 : 0.18} />
        <rect x="200" y="0" width="22" height="200" fill="#f5b100" />
      </g>
    </svg>
  );
}
