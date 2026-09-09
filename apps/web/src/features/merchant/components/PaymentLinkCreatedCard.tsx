"use client";

import { Copy } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { getShareOptions, copyLink } from "@/lib/share";

const SHARE_OPTIONS = getShareOptions("Payment link");

/**
 * Right-hand panel, per the mock — "No payment link created yet" until
 * `CreatePaymentLinkForm` produces one, then the link + Share via row. No
 * inline QR here (unlike `PaymentRequestCreatedCard`'s), matching the
 * mock's own created-panel screenshot — the dedicated QR Code page covers
 * that need for merchant instead.
 */
function PaymentLinkCreatedCard({ link }: { link: string | null }) {
	if (!link) {
		return (
			<div className="flex min-h-full flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-background p-8 text-center sm:p-12">
				<h2 className="text-b2 font-semibold text-foreground sm:text-b1">
					Payment Link Created
				</h2>
				<p className="text-b3 text-muted-foreground">No payment link created yet</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-5 rounded-2xl border border-border bg-background p-6 sm:p-8">
			<h2 className="text-b2 font-semibold text-foreground sm:text-b1">
				Payment Link Created
			</h2>

			<div className="flex items-center justify-between gap-4 rounded-lg border border-input bg-muted px-3.5 py-2.5">
				<span className="truncate text-b3 text-foreground sm:text-b2">{link}</span>
				<button
					type="button"
					onClick={() => copyLink(link)}
					aria-label="Copy payment link"
					className="shrink-0 text-muted-foreground hover:text-foreground"
				>
					<Copy className="size-5" aria-hidden="true" />
				</button>
			</div>

			<div className="flex flex-col gap-3">
				<span className="text-c1 text-muted-foreground sm:text-b3">Share via</span>
				<div className="grid grid-cols-4 gap-3">
					{SHARE_OPTIONS.map(({ label, icon: Icon, iconClassName, onClick }) => (
						<button
							key={label}
							type="button"
							onClick={() => onClick(link)}
							className="flex flex-col items-center gap-2"
						>
							<span className="flex size-14 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-muted">
								<Icon className={cn("size-5", iconClassName)} aria-hidden="true" />
							</span>
							<span className="text-c2 text-muted-foreground">{label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

export { PaymentLinkCreatedCard };
