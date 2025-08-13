import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "./happy-users";
import HeroBg from "./bg";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";

export default function Hero({ hero }: { hero: HeroType }) {
  if (hero.disabled) {
    return null;
  }

  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className="container">
          <div className="text-center">
            <h1 className="mx-auto mb-3 mt-4 max-w-6xl text-balance text-4xl font-bold lg:mb-7 lg:text-7xl">
              掌握市场脉搏，洞悉价格行为
            </h1>

            <p
              className="m mx-auto max-w-3xl text-muted-foreground lg:text-xl"
            >
              基于价格行为交易理念，我们的工具为您提供精准的技术分析和智能的交易决策辅助。
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href='/trade'
                  className="flex items-center"
                >
                  <Button
                    className="w-full"
                    size="lg"
                  >
                    Get Started
                  </Button>
                </Link>
            </div>
            {/* {hero.show_happy_users && <HappyUsers />} */}
          </div>
        </div>
      </section>
    </>
  );
}
