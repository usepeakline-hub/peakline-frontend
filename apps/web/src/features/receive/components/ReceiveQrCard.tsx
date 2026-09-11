"use client";

import QRCode from "react-qr-code";
import { Skeleton } from "@repo/ui/skeleton";
import { Logo } from "@repo/ui/logo";
import { useMyWallet } from "@/features/wallet/hooks";
import { useProfile } from "@/features/profile/hooks";

/** Logo-QR-logo-name-caption, matching the mock's boarding-pass-style
 * layout — the QR encodes the account's own real Stellar wallet address
 * (the same one `ReceiveInfoCard`'s "Copy Wallet Address" row shows as
 * text), not a fake shareable payment link — there's no real "payment
 * link"/"payment request" concept for an individual account on the
 * backend, only a raw wallet address to receive USDC directly. */
function ReceiveQrCard() {
	const { data: wallet, isLoading } = useMyWallet();
	const { data: profile } = useProfile();

	if (isLoading) {
		return (
			<div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background p-6 sm:p-8">
				<Skeleton className="h-44 w-44" />
				<Skeleton className="h-5 w-32" />
			</div>
		);
	}

	if (!wallet) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-background p-8 text-center sm:p-12">
				<p className="text-b3 text-muted-foreground">Your wallet hasn&apos;t been set up yet</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background p-6 sm:p-8">
			<Logo size="sm" />
			<div className="rounded-xl bg-white p-3">
				<QRCode value={wallet.publicKey} size={180} />
			</div>
			<Logo size="sm" />
			<div className="flex flex-col items-center gap-1 text-center">
				{profile && (
					<span className="text-b2 font-semibold text-foreground sm:text-b1">
						{profile.firstName} {profile.lastName}
					</span>
				)}
				<span className="text-c1 text-muted-foreground sm:text-b3">
					Scan to send USDC to this wallet
				</span>
			</div>
		</div>
	);
}

export { ReceiveQrCard };
