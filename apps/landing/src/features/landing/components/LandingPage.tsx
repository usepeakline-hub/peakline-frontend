import { Hero } from "./Hero";
import { PoweredByStrip } from "./PoweredByStrip";
import { AboutSection } from "./AboutSection";
import { HowItWorks } from "./HowItWorks";
import { FaqSection } from "./FaqSection";
import { GlobalReachSection } from "./GlobalReachSection";
import { TrustStats } from "./TrustStats";
import { Footer } from "./Footer";

/**
 * Section order mirrors the Figma "LANDING PAGE" frame (node 418-4606) top to
 * bottom. `Navbar` renders inside `Hero` (it's positioned as a floating pill
 * over the hero background there, not a separate full-width section).
 */
function LandingPage() {
	return (
		<main className="flex flex-col gap-[120px] overflow-x-hidden bg-background">
			<div className="flex flex-col">
				<Hero />
				<PoweredByStrip />
			</div>
			<AboutSection />
			<HowItWorks />
			<FaqSection />
			<GlobalReachSection />
			<TrustStats />
			<Footer />
		</main>
	);
}

export { LandingPage };
