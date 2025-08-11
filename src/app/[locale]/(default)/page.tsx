import Branding from '@/components/blocks/branding';
import CTA from '@/components/blocks/cta';
import FAQ from '@/components/blocks/faq';
import Feature from '@/components/blocks/feature';
import Feature1 from '@/components/blocks/feature1';
import Feature2 from '@/components/blocks/feature2';
import Feature3 from '@/components/blocks/feature3';
import Hero from '@/components/blocks/hero';
import Pricing from '@/components/blocks/pricing';
import Showcase from '@/components/blocks/showcase';
import Stats from '@/components/blocks/stats';
import Testimonial from '@/components/blocks/testimonial';
import { getLandingPage } from '@/services/page';

// This is the correct way to type the props for a page in the App Router.
// It avoids conflicts with other potential 'PageProps' types.
export default async function LandingPage({ 
  params: { locale },
}: {
  params: { locale: string };
}) {
  const page = await getLandingPage(locale);

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <>
      {page.hero && <Hero hero={page.hero} />}
      {page.branding && <Branding section={page.branding} />}
      {page.introduce && <Feature1 section={page.introduce} />}
      {page.benefit && <Feature2 section={page.benefit} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.feature && <Feature section={page.feature} />}
      {page.showcase && <Showcase section={page.showcase} />}
      {page.stats && <Stats section={page.stats} />}
      {page.pricing && <Pricing pricing={page.pricing} />}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
