// "Request an offer for these colours" — a compact form that creates a CMS enquiry (type quote) with the
// picked colours attached (`Inquiry.colors`), plus a success state with a WhatsApp follow-up.
import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { Modal } from '@/components/ui/Overlay';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Field';
import { WhatsAppIcon } from '@/components/brand/Social';
import { waHref } from '@/site/components/quote';
import { useDict, useL, useLang } from '@/i18n';
import { useDb, type InquiryInput } from '@/store/db';
import { useSettings } from '@/store/hooks';
import { allCities } from '@/lib/pricing';
import type { Inquiry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CS } from './dict';
import { SURFACES, inkOn, paintName, swatch, type Paints, type SceneId } from './palette';

/** CMS "service" label of the enquiry (data, Albanian like the seeded enquiries). */
const SERVICE: Record<SceneId, string> = { facade: 'Ngjyra & fasada', interior: 'Ngjyra për brendësi' };

/** Surface → colour lines, shared by the enquiry message and the WhatsApp text. */
export function useColorLines() {
  const l = useL();
  const lang = useLang();
  const t = useDict(CS);
  return (scene: SceneId, paints: Paints) =>
    SURFACES[scene].map((s) => {
      const p = paints[s.id];
      const name = paintName(p, lang, t('customLabel'));
      const code = swatch(p.code)?.code;
      return { surface: l(s.name), name, code, hex: p.hex.toUpperCase(), text: `${l(s.name)}: ${name} (${code ? `${code} · ` : ''}${p.hex.toUpperCase()})` };
    });
}

export function useWhatsAppText() {
  const t = useDict(CS);
  const lines = useColorLines();
  return (scene: SceneId, paints: Paints) => {
    const sceneName = t(scene === 'facade' ? 'sceneFacade' : 'sceneInterior');
    return [t('waIntro', { scene: sceneName }), ...lines(scene, paints).map((x) => `• ${x.text}`), t('msgCodes'), '', t('waOutro')].join('\n');
  };
}

export function EnquiryModal({ open, onClose, scene, paints }: { open: boolean; onClose: () => void; scene: SceneId; paints: Record<SceneId, Paints> }) {
  const t = useDict(CS);
  const settings = useSettings();
  const addInquiry = useDb((s) => s.addInquiry);
  const lines = useColorLines();
  const waText = useWhatsAppText();
  const [form, setForm] = useState({ name: '', phone: '', city: '', type: scene as SceneId, area: '', message: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState<Inquiry | null>(null);

  // Follow the scene the visitor is looking at whenever the dialog opens
  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, type: scene }));
      setDone(null);
      setError('');
    }
  }, [open, scene]);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const list = lines(form.type, paints[form.type]);
  const sceneName = (s: SceneId) => t(s === 'facade' ? 'sceneFacade' : 'sceneInterior');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError(t('required'));
      return;
    }
    const area = Number(form.area.replace(',', '.'));
    const message = [
      t('msgHead', { scene: sceneName(form.type) }),
      ...list.map((x) => `• ${x.text}`),
      ...(area > 0 ? [t('msgArea', { m: area })] : []),
      t('msgCodes'),
      ...(form.message.trim() ? ['', form.message.trim()] : []),
    ].join('\n');
    // `colors` is part of Inquiry; built as a variable so it passes through InquiryInput untouched
    const input: InquiryInput & Pick<Inquiry, 'colors'> = {
      type: 'quote',
      name: form.name.trim(),
      phone: form.phone.trim(),
      city: form.city || undefined,
      service: SERVICE[form.type],
      message,
      colors: list.map((x) => ({ hex: x.hex, name: x.code ? `${x.name} (${x.code})` : x.name, surface: x.surface })),
    };
    setDone(addInquiry(input));
  };

  return (
    <Modal open={open} onClose={onClose} title={done ? undefined : t('formTitle')} description={done ? undefined : t('formText')} size="md">
      {done ? (
        <div className="px-6 py-10 text-center sm:px-10">
          <div className="mx-auto grid h-16 w-16 animate-pop place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="display mt-5 text-[26px] text-ink">{t('successTitle')}</h2>
          <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-muted">{t('successText', { name: done.name.split(' ')[0] })}</p>
          <ColorStrip list={list} className="mx-auto mt-6 max-w-sm" />
          <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <a
              href={waHref(settings, waText(form.type, paints[form.type]))}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#1f9d55] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#178246]"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              {t('alsoWa')}
            </a>
            <Button variant="outline" onClick={onClose}>
              {t('close')}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="overflow-y-auto px-6 py-5" noValidate>
          {/* scene choice → which colours are attached */}
          <div className="text-[13px] font-semibold text-ink-soft">{t('f_type')}</div>
          <div className="mt-1.5 grid grid-cols-2 gap-2" role="radiogroup" aria-label={t('f_type')}>
            {(['facade', 'interior'] as SceneId[]).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={form.type === s}
                onClick={() => setForm((f) => ({ ...f, type: s }))}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold transition-colors',
                  form.type === s ? 'border-brand-600 bg-brand-50 text-brand-800' : 'border-line bg-white text-ink-soft hover:border-ink/30',
                )}
              >
                {sceneName(s)}
                <span className="flex -space-x-1">
                  {SURFACES[s].map((x) => (
                    <span key={x.id} className="h-4 w-4 rounded-full ring-2 ring-white" style={{ background: paints[s][x.id].hex }} />
                  ))}
                </span>
              </button>
            ))}
          </div>
          <ColorStrip list={list} className="mt-3" />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input label={t('f_name')} required value={form.name} onChange={set('name')} autoComplete="name" error={error && !form.name.trim() ? error : undefined} />
            <Input label={t('f_phone')} required value={form.phone} onChange={set('phone')} type="tel" autoComplete="tel" placeholder="+383 4x xxx xxx" error={error && !form.phone.trim() ? error : undefined} />
            <Select label={t('f_city')} value={form.city} onChange={set('city')}>
              <option value="">{t('f_cityPick')}</option>
              {allCities(settings).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Input label={t('f_area')} value={form.area} onChange={set('area')} inputMode="decimal" placeholder="120" hint={t('f_optional')} trailing="m²" />
          </div>
          <Textarea wrapClassName="mt-4" label={t('f_message')} rows={3} value={form.message} onChange={set('message')} placeholder={t('f_messagePh')} />
          <p className="mt-3 text-[12px] leading-snug text-muted">{t('fine')}</p>
          <div className="sticky bottom-0 -mx-6 mt-4 border-t border-line bg-white px-6 pb-1 pt-4">
            <Button type="submit" size="lg" className="w-full" icon={<Send className="h-4 w-4" />}>
              {t('send')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

/** Compact list of the picked colours (swatch + surface + name). */
function ColorStrip({ list, className }: { list: { surface: string; name: string; code?: string; hex: string }[]; className?: string }) {
  return (
    <div className={cn('grid gap-1.5 rounded-2xl bg-sand/55 p-2', list.length > 3 ? 'grid-cols-2' : 'grid-cols-3', className)}>
      {list.map((x) => (
        <div key={x.surface} className="flex min-w-0 items-center gap-2 rounded-xl px-2.5 py-2 text-left" style={{ background: x.hex, color: inkOn(x.hex) }}>
          <div className="min-w-0">
            <div className="truncate text-[10.5px] font-semibold uppercase tracking-wide opacity-75">{x.surface}</div>
            <div className="truncate text-[13px] font-bold leading-tight">{x.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
