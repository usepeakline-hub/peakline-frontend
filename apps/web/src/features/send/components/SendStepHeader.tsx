import { Stepper } from "@repo/ui/stepper";

const STEPS = ["Transfer Details", "Review"];

/**
 * Persistent title + stepper for both Send steps. Unlike the wallet-domain
 * flows (Fund Wallet: mobile-only `MobileStepHeader` + a separate desktop
 * modal), Send is a single full page at every breakpoint per the mock — no
 * modal variant — so this renders everywhere instead of being `lg:hidden`.
 */
function SendStepHeader({ step }: { step: 1 | 2 }) {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-h5 text-foreground sm:text-h4">Send</h1>
				<p className="text-b4 text-muted-foreground sm:text-b3">Send money</p>
			</div>

			<Stepper steps={STEPS} currentStep={step} />
		</div>
	);
}

export { SendStepHeader };
