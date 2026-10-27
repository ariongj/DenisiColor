import { Link } from 'react-router';
import { ArrowUpRight, Calculator, CloudRain, Droplets, Home, PlugZap, Sun } from 'lucide-react';
import { Accent } from '@/components/ui/misc';
import { useDict } from '@/i18n';
import { LT, type LtKey } from './dict';
import { PRESETS } from './model';
import { ROOM_ICON } from './parts';

// Blog posts in src/data/content.ts (buildPosts)
const IP_POST = '/savjeti/cfare-do-te-thote-ip20-ip54-ip65';
const CCT_POST = '/savjeti/temperatura-e-drites-led-3000k-4000k-6500k';

/** The assumptions behind the estimate: target lux per space + formula + efficacy. */
export function HowWeEstimate() {
  const t = useDict(LT);
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
      <div className="card p-5">
        <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-ink">
          <Sun className="h-4 w-4 text-brand-600" />
          {t('luxTitle')}
        </h3>
        <ul className="mt-3 divide-y divide-line text-[13px]">
          {PRESETS.map((p) => {
            const Icon = ROOM_ICON[p.type];
            return (
              <li key={p.type} className="flex items-center gap-2.5 py-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0 text-muted" />
                <span className="flex-1 text-ink-soft">{t(`t_${p.type}` as LtKey)}</span>
                <span className="font-semibold tabular-nums text-ink">{p.lux[0] === p.lux[1] ? p.lux[0] : `${p.lux[0]}–${p.lux[1]}`} lx</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="card p-5">
        <h3 className="flex items-center gap-2 font-display text-[15px] font-bold text-ink">
          <Calculator className="h-4 w-4 text-brand-600" />
          {t('howTitle')}
        </h3>
        <ul className="mt-3 space-y-2.5 text-[13px] leading-relaxed text-ink-soft">
          {(['how1', 'how2', 'how3', 'how4'] as const).map((k) => (
            <li key={k} className="flex gap-2.5">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              {t(k)}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-paper p-3 text-[12.5px] leading-snug text-ink-soft ring-1 ring-line">
          <PlugZap className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          {t('electrician')}
        </div>
        <Link to={CCT_POST} className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-700 hover:underline">
          {t('cctMore')}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

/** IP20 / IP54 / IP65 in one line each, with a link to the blog post. */
export function IpExplainer() {
  const t = useDict(LT);
  const items = [
    { code: 'IP20', text: t('ip20'), Icon: Home },
    { code: 'IP54', text: t('ip54'), Icon: Droplets },
    { code: 'IP65', text: t('ip65'), Icon: CloudRain },
  ];
  return (
    <section className="relative isolate overflow-hidden bg-brand-900 py-14 text-white sm:py-16">
      <div className="bg-stripes absolute inset-0 -z-10" />
      <div className="container-x">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="display text-[30px] leading-[1.08] sm:text-[40px]">
            <Accent text={t('ipTitle')} accentClassName="text-amber-400!" />
          </h2>
          <Link to={IP_POST} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-amber-400 hover:underline">
            {t('ipMore')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map(({ code, text, Icon }) => (
            <div key={code} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <span className="font-display text-[26px] font-extrabold tracking-tight">{code}</span>
                <Icon className="h-5 w-5 text-amber-400" />
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-paper/75">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
