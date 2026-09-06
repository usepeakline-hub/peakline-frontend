import { cn } from "@repo/ui/lib/utils";

const STEPS = [
	{ number: 1, label: "Transfer Details" },
	{ number: 2, label: "Review" },
] as const;

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

			<div className="flex items-start">
				{STEPS.map(({ number, label }, i) => (
					<div key={number} className="flex items-start">
						{i > 0 && (
							<div
								className={cn(
									"mt-4 h-px w-12 shrink-0 sm:w-20",
									step >= number ? "bg-primary-500" : "bg-border",
								)}
							/>
						)}
						<div className="flex flex-col items-center gap-2">
							<span
								className={cn(
									"flex size-8 shrink-0 items-center justify-center rounded-full text-b4 font-semibold",
									step >= number
										? "bg-primary-500 text-primary-foreground"
										: "border border-border bg-background text-muted-foreground",
								)}
							>
								{number}
							</span>
							<span
								className={cn(
									"text-c2 whitespace-nowrap sm:text-b4",
									step >= number
										? "font-medium text-primary-600"
										: "text-muted-foreground",
								)}
							>
								{label}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export { SendStepHeader };
