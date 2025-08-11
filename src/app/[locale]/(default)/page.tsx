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

// 签名已更新，以明确处理 params Promise，
// 这是修复构建错误的关键。
export default async function LandingPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await paramsPromise;
  console.log(`[page.tsx] LandingPage: 正在尝试为语言环境获取登陆页面: ${locale}`);

  try {
    const page = await getLandingPage(locale);

    if (!page) {
      console.error(`[page.tsx] LandingPage: 未找到语言环境的页面数据: ${locale}`);
      return <div>Page not found</div>;
    }

    console.log(`[page.tsx] LandingPage: 已成功加载语言环境的页面数据: ${locale}。正在渲染组件。`);
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
  } catch (error) {
    console.error(`[page.tsx] LandingPage: 为语言环境 ${locale} 获取页面数据时发生错误:`, error);
    return <div>An error occurred while loading the page.</div>
  }
}
