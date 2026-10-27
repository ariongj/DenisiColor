import { cn } from '@/lib/utils';

/**
 * Vector re-draw of the Denisi Color mark: a thin open "D" with two short posts
 * (reads as "ID"), a hairline divider and the stacked DENISI / COLOR wordmark.
 */
export function Logo({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const ink = tone === 'dark' ? 'var(--color-ink-soft)' : '#ffffff';
  const word = tone === 'dark' ? 'var(--color-brand-700)' : '#ffffff';
  return (
    <svg viewBox="0 0 196 64" className={cn('h-11 w-auto', className)} role="img" aria-label="Denisi Color">
      <Mark stroke={ink} />
      <path d="M68 6 V58" stroke={ink} strokeWidth="1.6" opacity="0.8" />
      <text x="78" y="30" fill={word} style={{ font: '800 25px var(--font-display)', letterSpacing: '0.5px' }}>
        DENISI
      </text>
      <text x="78" y="57" fill={word} style={{ font: '800 25px var(--font-display)', letterSpacing: '0.5px' }}>
        COLOR
      </text>
    </svg>
  );
}

function Mark({ stroke }: { stroke: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6 H28 A26 26 0 0 1 28 58 H6" />
      <path d="M6 58 V36" />
      <path d="M17 58 V36" />
    </g>
  );
}

export function LogoMark({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const ink = tone === 'dark' ? 'var(--color-brand-700)' : '#ffffff';
  return (
    <svg viewBox="0 0 60 64" className={cn('h-8 w-auto', className)} aria-hidden>
      <Mark stroke={ink} />
    </svg>
  );
}
