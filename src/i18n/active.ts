import { useMemo } from 'react';
import { useDb } from '@/store/db';
import { LANGS } from './index';

/**
 * Languages switched on in Settings → Languages, Albanian always first and always on.
 * Every language switcher and translation tab (storefront and CMS) shows only these.
 */
export function useActiveLangs() {
  const enabled = useDb((s) => s.settings.languages);
  return useMemo(() => LANGS.filter((l) => l.code === 'sq' || enabled[l.code]), [enabled]);
}
