import type { Lang } from '@/lib/types';

// Storefront dates with explicit month names: some browsers ship without Albanian locale data and
// Intl would silently fall back to "Oct 23, 2026" on an Albanian page.
const MONTHS: Record<Lang, string[]> = {
  sq: ['janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor', 'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor'],
  me: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

/** "23 tetor 2026" · "23. oktobar 2026." · "23 October 2026"; `short` abbreviates the month to 3 letters. */
export function siteDate(iso: string | Date, lang: Lang, opts: { short?: boolean; year?: boolean } = {}) {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '';
  const m = MONTHS[lang][d.getMonth()];
  const month = opts.short ? m.slice(0, 3) : m;
  const year = opts.year === false ? '' : ` ${d.getFullYear()}`;
  return lang === 'me' ? `${d.getDate()}. ${month}${year}${year ? '.' : ''}` : `${d.getDate()} ${month}${year}`;
}
