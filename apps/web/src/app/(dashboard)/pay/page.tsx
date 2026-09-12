"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { PaymentCodeCard } from "@/features/pay/components/PaymentCodeCard";
import { PaymentLinkPreviewCard } from "@/features/pay/components/PaymentLinkPreviewCard";
import { usePaymentLinkLookup } from "@/features/pay/hooks";
import { usePayFlowStore } from "@/features/pay/store/payFlowStore";
import { getApiErrorMessage } from "@/lib/api/errorMessage";
import { parseReceiveLink, WALLET_ADDRESS_REGEX } from "@/lib/wallet";
import type { PublicPaymentLinkData } from "@/lib/api/types";

export default function PayPage() {
	const router = useRouter();
	const [link, setLink] = useState<PublicPaymentLinkData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const lookup = usePaymentLinkLookup();
	const setStoreLink = usePayFlowStore((state) => state.setLink);

	function handleLookup(input: string) {
		setError(null);

		// A merchant Payment Link's own code/URL is the only thing
		// `usePaymentLinkLookup` actually knows how to resolve — but this same
		// scan-or-paste box is also the obvious place someone lands after
		// scanning a *person's* Receive QR (a `buildReceiveLink` URL carrying
		// their user id, or a bare wallet address pasted directly from "Copy
		// Wallet Address"), which is a different flow entirely (straight to
		// `/send`, see `lib/wallet.ts`'s own notes). Both checked first so
		// neither ever gets treated as an unrecognized payment code.
		const userId = parseReceiveLink(input);
		if (userId) {
			router.push(`/send?userId=${encodeURIComponent(userId)}`);
			return;
		}
		const trimmed = input.trim();
		if (WALLET_ADDRESS_REGEX.test(trimmed)) {
			router.push(`/send?wallet=${encodeURIComponent(trimmed)}`);
			return;
		}

		lookup.mutate(input, {
			onSuccess: (result) => setLink(result),
			onError: (err) => {
				setLink(null);
				setError(getApiErrorMessage(err, "Payment link not found"));
			},
		});
	}

	function handleChangeCode() {
		setLink(null);
		setError(null);
	}

	function handleContinue() {
		if (!link) return;
		setStoreLink(link);
		router.push("/pay/confirm");
	}

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			{/* No back arrow — primary bottom-tab destination (the elevated
			    center action), same as /wallet. */}
			<MobileStepHeader title="Pay" />
			<PageHeader title="Pay" subtitle="Pay a merchant using their payment link." />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
				{/* Desktop: code-entry card always visible alongside the payment
				    link preview. Mobile: replaced entirely once a link is found —
				    same space constraint as the old scan-based version, with a
				    "Look up a different link" way back in if needed. */}
				<div className={link ? "hidden lg:block" : ""}>
					<PaymentCodeCard onLookup={handleLookup} loading={lookup.isPending} error={error} />
				</div>
				<div className={!link ? "hidden lg:block" : ""}>
					<PaymentLinkPreviewCard
						link={link}
						onContinue={handleContinue}
						onChangeCode={handleChangeCode}
					/>
				</div>
			</div>
		</div>
	);
}
