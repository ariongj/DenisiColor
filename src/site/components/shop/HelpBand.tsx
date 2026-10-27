import { Check, Clock, MessageSquareText, Phone } from 'lucide-react';
import { Accent, Reveal } from '@/components/ui/misc';
import { AdImage } from '@/site/components/AdImage';
import { WhatsAppLink } from '@/site/components/quote';
import { ButtonLink, buttonClass } from '@/components/ui/Button';
import { useDict } from '@/i18n';
import { useSettings } from '@/store/hooks';
import { T } from './dict';

/** "Need help choosing?" band under the product grid. */
export function HelpBand() {
  const t = useDict(T);
  const settings = useSettings();
  return (
    <section className="container-x mt-20 sm:mt-28">
      <Reveal>
        <div className="grid overflow-hidden rounded-[32px] bg-sand lg:grid-cols-[1.12fr_0.88fr]">
          <div className="relative p-7 sm:p-12 lg:p-14">
            <div className="eyebrow">{t('helpEyebrow')}</div>
            <h2 className="display mt-3 max-w-xl text-[34px] leading-[1.04] text-ink sm:text-[48px]">
              <Accent text={t('helpTitle')} />
            </h2>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted">{t('helpText')}</p>
            <ul className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {[t('helpPoint1'), t('helpPoint2'), t('helpPoint3')].map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-[14.5px] font-semibold text-ink">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <WhatsAppLink size="lg" label="WhatsApp" />
              <ButtonLink to="/kontakt#kerkesa" size="lg" icon={<MessageSquareText className="h-4 w-4" />}>
                {t('helpCta')}
              </ButtonLink>
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className={buttonClass({ variant: 'outline', size: 'lg', className: 'tabular-nums' })}>
                <Phone className="h-4 w-4" /> {settings.phone}
              </a>
            </div>
          </div>
          <div className="relative min-h-[300px] bg-brand-900 lg:min-h-full">
            <div className="bg-stripes absolute inset-0" />
            <div className="absolute inset-0 grid place-items-center p-8 pb-24">
              <div className="w-full max-w-[300px] -rotate-2 overflow-hidden rounded-[20px] bg-white p-2 shadow-[0_40px_80px_-30px_rgb(5_14_28/0.7)]">
                <AdImage src="/images/misc/koleksioni.webp" className="aspect-square w-full rounded-[14px]" />
              </div>
            </div>
            <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 shadow-xl backdrop-blur sm:bottom-7 sm:left-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white">
                <Clock className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[14px] font-bold text-ink">{t('helpCardTitle')}</span>
                <span className="block text-[12.5px] text-muted">{t('helpCardText')}</span>
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
