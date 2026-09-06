"use client";

import { Copy } from "lucide-react";
import { toast } from "@repo/ui/sonner";
import { FAKE_WALLET_ADDRESS, maskWalletAddress } from "@/lib/wallet";

/** Plain outlined card (unlike the wallet-created page's gold-tinted
 * version of the same address) — a persistent, mundane info display rather
 * than a one-time reveal. */
function WalletAddressCard() {
	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(FAKE_WALLET_ADDRESS);
			toast.success("Wallet address copied");
		} catch {
			toast.error("Couldn't copy the address");
		}
	}

	return (
		<div className="flex w-full flex-col gap-1.5 rounded-2xl border border-border bg-background p-5 sm:p-6">
			<span className="text-c1 text-muted-foreground sm:text-b3">
				Your wallet address
			</span>
			<div className="flex items-center justify-between gap-4">
				<span className="truncate text-b3 text-foreground sm:text-b2">
					{maskWalletAddress(FAKE_WALLET_ADDRESS)}
				</span>
				<button
					type="button"
					onClick={handleCopy}
					aria-label="Copy wallet address"
					className="shrink-0 text-muted-foreground hover:text-foreground"
				>
					<Copy className="size-5" aria-hidden="true" />
				</button>
			</div>
		</div>
	);
}

export { WalletAddressCard };
