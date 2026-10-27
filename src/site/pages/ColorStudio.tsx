import { FacadeScene } from '@/site/components/color/FacadeScene';
import { InteriorScene } from '@/site/components/color/InteriorScene';
import { DEFAULT_SCHEME } from '@/site/components/color/palette';
export default function ColorStudio() {
  return <div className="container-x py-6"><InteriorScene paints={DEFAULT_SCHEME.paints.interior} selected="accent" onSelect={() => {}} className="w-full rounded-3xl" /><FacadeScene paints={DEFAULT_SCHEME.paints.facade} selected="accent" onSelect={() => {}} className="w-full rounded-3xl" /></div>;
}
