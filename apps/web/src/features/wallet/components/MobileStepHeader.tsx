"use client";

import { ChevronLeft } from "lucide-react";

/**
 * Back arrow + centered title — the mobile-page header for each Fund
 * Wallet step (the desktop modal uses `DialogHeader`/`DialogTitle` instead,
 * hence `lg:hidden`). Omit `onBack` for a primary tab-bar destination like
 * /wallet, which has no "back" to go to — just the centered title.
 */
function MobileStepHeader({
	title,
	onBack,
}: {
	title: string;
	onBack?: () => void;
}) {
	return (
		<div className="relative flex items-center justify-center border-b border-border pb-4 lg:hidden">
			{onBack && (
				<button
					type="button"
					onClick={onBack}
					aria-label="Back"
					className="absolute left-0 text-foreground"
				>
					<ChevronLeft className="size-6" aria-hidden="true" />
				</button>
			)}
			<h1 className="text-s1 text-foreground">{title}</h1>
		</div>
	);
}

export { MobileStepHeader };
