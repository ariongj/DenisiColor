import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Truck } from 'lucide-react';
import type { Cta, HeroSlide } from '@/lib/types';
import { buttonClass, type ButtonVariant } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/brand/Social';
import { useDict, useL } from '@/i18n';
import { site } from '@/i18n/site';
import { common } from '@/i18n/common';
import { useActiveProducts } from '@/store/hooks';
import { Stripes } from '@/site/components/Stripes';
import { AdImage } from '@/site/components/AdImage';
import { cn } from '@/lib/utils';

const DURATION = 7000;
const NAVY = '/images/hero/navy.webp';

/**
 * A slide image is either a backdrop graphic (/images/hero/…) or a product / category picture.
 * Product pictures are square social-media ads with text baked in, so they are never stretched
 * full-bleed: they sit in a framed card next to the copy, over the navy backdrop.
 */
function slideLayout(sl: HeroSlide) {
  const img = sl.image?.trim() ?? '';
  const backdrop = !img || img.includes('/images/hero/');
  return {
    bg: backdrop && img ? img : NAVY,
    card: backdrop ? '' : img,
    light: backdrop && /\/hero\/light/.test(img),
  };
}

/** "*word*" → amber (dark slide) / navy (light slide) highlight with an underline bar. */
function Headline({ text, light }: { text: string; light: boolean }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') ? (
          <em key={i} className={cn('relative not-italic', light ? 'text-brand-600' : 'text-amber-400')}>
            {p.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

const EXTERNAL = /^(?:https?:|mailto:|tel:)/i;

/** Hero button: router link for in-app paths, new tab for WhatsApp / external URLs. */
function CtaButton({ cta, variant, children, icon }: { cta: Cta; variant: ButtonVariant | 'amber'; children: ReactNode; icon?: ReactNode }) {
  const href = cta.href.trim() || '/proizvodi';
  const cls =
    variant === 'amber'
      ? buttonClass({ size: 'lg', className: 'bg-amber-400! text-brand-900! hover:bg-amber-300! shadow-[0_14px_30px_-16px_rgb(245_177_0)]!' })
      : buttonClass({ variant, size: 'lg' });
  const wa = /wa\.me|whatsapp/i.test(href);
  const content = (
    <>
      {wa ? <WhatsAppIcon className="h-[18px] w-[18px]" /> : icon}
      {children}
    </>
  );
  return EXTERNAL.test(href) ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {content}
    </a>
  ) : (
    <Link to={href} className={cls}>
      {content}
    </Link>
  );
}

/** Framed product picture (or a fanned stack of three) on the right of the copy. */
function Visual({ card, light }: { card: string; light: boolean }) {
  const products = useActiveProducts();
  const stack = useMemo(() => {
    const seen = new Set<string>();
    return [...products]
      .filter((p) => p.featured && p.images[0])
      .sort((a, b) => Number(!!a.quoteOnly) - Number(!!b.quoteOnly) || b.sold - a.sold)
      .filter((p) => !seen.has(p.categoryId) && !!seen.add(p.categoryId))
      .slice(0, 3)
      .map((p) => p.images[0]);
  }, [products]);
  const frame = cn('overflow-hidden rounded-[22px] bg-white p-2 shadow-[0_40px_80px_-30px_rgb(5_14_28/0.65)]', light ? 'ring-1 ring-line' : 'ring-1 ring-white/20');
  if (card)
    return (
      <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[440px]">
        <div className="absolute -inset-4 -z-10 rotate-6 rounded-[28px] bg-amber-400/90" />
        <div className={cn(frame, '-rotate-2')}>
          <AdImage src={card} eager className="aspect-square w-full rounded-[16px]" />
        </div>
      </div>
    );
  // No product picture on the slide: a fanned stack of three featured products from different categories
  if (stack.length < 3) return null;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[460px]">
      <div className={cn(frame, 'absolute left-0 top-[14%] w-[58%] -rotate-6')}>
        <AdImage src={stack[1]} eager className="aspect-square w-full rounded-[16px]" />
      </div>
      <div className={cn(frame, 'absolute right-0 top-[4%] w-[52%] rotate-6')}>
        <AdImage src={stack[2]} eager className="aspect-square w-full rounded-[16px]" />
      </div>
      <div className={cn(frame, 'absolute bottom-0 left-[20%] w-[60%]')}>
        <AdImage src={stack[0]} eager className="aspect-square w-full rounded-[16px]" />
      </div>
    </div>
  );
}

export function HeroSection({ slides, autoplay }: { slides: HeroSlide[]; autoplay: boolean }) {
  const l = useL();
  const t = useDict(site);
  const tc = useDict(common);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const go = useCallback((n: number) => setI(((n % count) + count) % count), [count]);

  useEffect(() => {
    if (i >= count) setI(0);
  }, [count, i]);

  if (!count) return null;
  const s = slides[Math.min(i, count - 1)];
  const { card, light } = slideLayout(s);
  const ctrl = light ? 'border-ink/20 text-ink hover:bg-ink hover:text-white' : 'border-white/30 text-white hover:bg-white hover:text-ink';

  return (
    <section
      className={cn('relative isolate overflow-hidden transition-colors duration-700', light ? 'bg-paper' : 'bg-brand-900')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backdrops */}
      {slides.map((sl, k) => (
        <div key={sl.id} className={cn('absolute inset-0 -z-20 transition-opacity duration-[1200ms] ease-out', k === i ? 'opacity-100' : 'opacity-0')} aria-hidden>
          <img
            src={slideLayout(sl).bg}
            alt=""
            loading={k === 0 ? 'eager' : 'lazy'}
            onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
      {!light && <div className="bg-stripes absolute inset-0 -z-10 opacity-60" />}
      <Stripes className="absolute -bottom-6 left-[-60px] -z-10 h-40 w-56 opacity-80 max-lg:hidden" tone={light ? 'navy' : 'light'} />

      <div className="container-x grid items-center gap-10 pb-36 pt-12 sm:pt-16 lg:min-h-[640px] lg:grid-cols-12 lg:gap-8 lg:pb-36 lg:pt-14">
        <AnimatePresence mode="wait">
          <motion.div key={s.id} initial="hidden" animate="show" exit="exit" className="lg:col-span-7">
            <motion.div
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.05 } }, exit: { opacity: 0, y: -8, transition: { duration: 0.2 } } }}
              className={cn(
                'mb-5 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.2em]',
                light ? 'bg-brand-600 text-white' : 'bg-amber-400 text-brand-900',
              )}
            >
              {l(s.eyebrow)}
            </motion.div>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] } }, exit: { opacity: 0, y: -10, transition: { duration: 0.2 } } }}
              className={cn('display max-w-[15ch] text-[40px] uppercase leading-[1.02] sm:text-6xl lg:text-[68px]', light ? 'text-brand-900' : 'text-white')}
            >
              <Headline text={l(s.title)} light={light} />
            </motion.h1>
            <motion.div
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.6, delay: 0.3 } }, exit: { opacity: 0 } }}
              className={cn('mt-6 h-1 w-20 origin-left rounded-full', light ? 'bg-brand-600' : 'bg-amber-400')}
            />
            <motion.p
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.25 } }, exit: { opacity: 0, transition: { duration: 0.2 } } }}
              className={cn('mt-6 max-w-xl text-[16.5px] leading-relaxed sm:text-lg', light ? 'text-ink-soft' : 'text-white/80')}
            >
              {l(s.subtitle)}
            </motion.p>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.35 } }, exit: { opacity: 0, transition: { duration: 0.2 } } }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {s.primary.href.trim() && l(s.primary.label) && (
                <CtaButton cta={s.primary} variant={light ? 'primary' : 'amber'} icon={undefined}>
                  {l(s.primary.label)}
                  <ArrowRight className="h-4 w-4" />
                </CtaButton>
              )}
              {s.secondary.href.trim() && l(s.secondary.label) && (
                <CtaButton cta={s.secondary} variant={light ? 'outline' : 'outlineLight'}>
                  {l(s.secondary.label)}
                </CtaButton>
              )}
            </motion.div>
            <motion.p
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, delay: 0.5 } }, exit: { opacity: 0 } }}
              className={cn('mt-7 flex items-center gap-2 text-[13px] font-semibold', light ? 'text-muted' : 'text-white/60')}
            >
              <Truck className="h-4 w-4" /> {t('heroNote')}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <div className="relative lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            >
              <Visual card={card} light={light} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      {count > 1 && (
        <div className="absolute bottom-[86px] w-full">
          <div className="container-x flex items-center gap-5">
            <span className={cn('font-display text-sm font-bold tabular-nums', light ? 'text-muted' : 'text-white/70')}>
              <span className={light ? 'text-ink' : 'text-white'}>{String(i + 1).padStart(2, '0')}</span> / {String(count).padStart(2, '0')}
            </span>
            <div className="flex gap-2">
              {slides.map((sl, k) => (
                <button key={sl.id} onClick={() => go(k)} className={cn('group relative h-[3px] w-12 overflow-hidden rounded-full', light ? 'bg-ink/15' : 'bg-white/25')} aria-label={tc('slideN', { n: k + 1 })}>
                  <span
                    className={cn('absolute inset-y-0 left-0 rounded-full', light ? 'bg-brand-600' : 'bg-amber-400', k < i || (k === i && !autoplay) ? 'w-full' : 'w-0')}
                    style={k === i && autoplay ? { animation: `heroprogress ${DURATION}ms linear forwards`, animationPlayState: paused ? 'paused' : 'running' } : undefined}
                    onAnimationEnd={k === i && autoplay ? () => go(i + 1) : undefined}
                  />
                </button>
              ))}
            </div>
            <div className="ml-auto hidden gap-2 md:flex">
              <button onClick={() => go(i - 1)} className={cn('grid h-10 w-10 place-items-center rounded-full border transition', ctrl)} aria-label={tc('prev')}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => go(i + 1)} className={cn('grid h-10 w-10 place-items-center rounded-full border transition', ctrl)} aria-label={tc('next')}>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Link to="/proizvodi" className="sr-only">
        {t('allProducts')}
      </Link>
    </section>
  );
}
