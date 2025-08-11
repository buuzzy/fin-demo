import CTA from '@/components/blocks/cta';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('landing');

  const section = {
    name: 'cta',
    title: t('title'),
    description: t('description'),
    buttons: [
      {
        title: t('cta_text'),
        url: '/trade',
      },
    ],
  };

  return (
    <>
      <CTA section={section} />
    </>
  );
}
