import { ArrowRight, Check, Phone } from 'lucide-react';
import { Accent } from '@/components/ui/misc';
import { AdImage } from '@/site/components/AdImage';
import { WhatsAppLink } from '@/site/components/quote';
import { useMeasureHref } from '@/site/components/company/data';
import { ButtonLink, buttonClass } from '@/components/ui/Button';
import { useDict } from '@/i18n';
import { useSettings } from '@/store/hooks';
import { cn } from '@/lib/utils';
import { C } from './dict';
import { telHref } from './posts';

/** Navy call-to-action box: request a price / offer (homepage form at /#kerkesa) or WhatsApp. */
export function MeasureCta({ image, className }: { image?: string; className?: string }) {
  const c = useDict(C);
  const settings = useSettings();
  const formHref = useMeasureHref();
  return (
    <div className={cn('relative isolate grid overflow-hidden rounded-[32px] bg-brand-900 text-white lg:grid-cols-[1.12fr_1fr]', className)}>
      <div className="bg-stripes pointer-events-none absolute inset-0 -z-10" />
      <div className="relative z-10 order-last p-7 sm:p-12 lg:order-first lg:p-14">
        <div className="eyebrow text-amber-400!">{c('cta_eyebrow')}</div>
        <h2 className="display mt-4 text-[34px] leading-[1.04] sm:text-[46px]">
          <Accent text={c('cta_title')} accentClassName="text-amber-400!" />
        </h2>
        <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-paper/70">{c('cta_text')}</p>
        <ul className="mt-7 space-y-3">
          {[c('cta_b1'), c('cta_b2'), c('cta_b3')].map((b) => (
            <li key={b} className="flex items-center gap-3 text-[15px] font-medium text-white/90">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-400 text-brand-900">
                <Check className="h-3.5 w-3.5" />
              </span>
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink to={formHref} size="lg" iconRight={<ArrowRight className="h-4 w-4" />} className="bg-amber-400! text-brand-900! hover:bg-amber-300!">
            {c('cta_button')}
          </ButtonLink>
          <WhatsAppLink size="lg" label="WhatsApp" />
          <a href={telHref(settings.phone)} className={buttonClass({ variant: 'outlineLight', size: 'lg' })}>
            <Phone className="h-4 w-4" />
            {settings.phone}
          </a>
        </div>
      </div>
      {image && (
        <div className="relative grid place-items-center p-7 pb-0 sm:p-12 sm:pb-0 lg:p-12">
          <div className="w-full max-w-[360px] -rotate-2 overflow-hidden rounded-[22px] bg-white p-2 shadow-[0_40px_80px_-30px_rgb(5_14_28/0.7)]">
            <AdImage src={image} className="aspect-square w-full rounded-[16px]" />
          </div>
        </div>
      )}
    </div>
  );
}
