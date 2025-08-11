// --- Start of commented out original code ---
/*
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
  console.log(`[page.tsx] Attempting to get landing page for locale: ${locale}`);
  const page = await getLandingPage(locale);

  if (!page) {
    console.error(`[page.tsx] Page data not found for locale: ${locale}`);
    return <div>Page not found</div>;
  }

  console.log(`[page.tsx] Page data loaded successfully for locale: ${locale}`);
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
*/
// --- End of commented out original code ---

// Minimal test component with logging, corrected for async params.
console.log('[page.tsx] File loaded. Defining TestLandingPage component.');

export default async function TestLandingPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
  const params = await paramsPromise;
  console.log(`[page.tsx] TestLandingPage component is rendering for locale: ${params.locale}`);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Build and Render Test Page (Async Corrected)</h1>
      <p>If you see this page, the build pipeline and component rendering are working correctly.</p>
      <p>Current locale: <strong>{params.locale}</strong></p>
      <p>Check the server logs in Google Cloud Run for '[page.tsx]' messages to trace execution.</p>
    </div>
  );
}
