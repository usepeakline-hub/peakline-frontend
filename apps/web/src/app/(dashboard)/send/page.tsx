"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SendStepHeader } from "@/features/send/components/SendStepHeader";
import { SendMoneyFormStep } from "@/features/send/components/SendMoneyFormStep";
import { ResolvedSendAmountStep } from "@/features/send/components/ResolvedSendAmountStep";
import { ResolvedRecipientCard } from "@/features/send/components/ResolvedRecipientCard";
import { useSendMoneyFlowStore } from "@/features/send/store/sendMoneyFlowStore";
import { useWalletLookup } from "@/features/wallet/hooks";
import { WALLET_ADDRESS_REGEX } from "@/lib/wallet";
import type { SendMoneyValues } from "@/lib/validations/sendValidations";

/**
 * Two ways to arrive here with the recipient already resolved — the entire
 * client side of "receive via QR/link/wallet address" (see `lib/wallet.ts`'s
 * own notes):
 *
 * - `?userId=<id>` — someone's Receive QR/link (`buildReceiveLink`).
 *   Resolved via the real `GET /wallets/lookup/{userId}` (`useWalletLookup`)
 *   into a name + wallet address; `ResolvedRecipientCard` shows who's about
 *   to get paid.
 * - `?wallet=<address>` — a bare address (from "Copy Wallet Address", or
 *   `/pay`'s own scan-or-paste box recognizing one directly) — no lookup,
 *   no name, just the address.
 *
 * Either way, reported live: arriving with a recipient already known
 * shouldn't still ask "how do you want to identify them" — unlike a
 * regular Send (`SendMoneyFormStep`, still the plain "pick a method, type
 * an identifier" form for a manual entry with no link), this renders
 * `ResolvedSendAmountStep` instead: no method selector, no editable
 * recipient field, just the amount. `linkedRecipient` is a plain prop on
 * that component (not react-hook-form `defaultValues` resolved after
 * mount), so there's no "arrives async" timing gap to work around here —
 * the step itself doesn't render at all until the address is known.
 */
function SendMoneyPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const values = useSendMoneyFlowStore((state) => state.values);
	const setValues = useSendMoneyFlowStore((state) => state.setValues);

	const userId = searchParams.get("userId");
	const walletParam = searchParams.get("wallet");
	const { data: lookup, isLoading: isLookingUp } = useWalletLookup(userId);

	const linkedRecipient = lookup
		? lookup.publicKey
		: walletParam && WALLET_ADDRESS_REGEX.test(walletParam)
			? walletParam
			: null;
	const isResolvingLink = Boolean(userId) && isLookingUp;
	// A `?userId=` that didn't resolve to anything (bad/expired link) still
	// falls through to the regular form below — `ResolvedRecipientCard`'s own
	// `notFound` state already told them why, and manual entry is a
	// reasonable fallback rather than a dead end.

	function handleContinue(submitted: SendMoneyValues) {
		setValues(submitted);
		router.push("/send/review");
	}

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<SendStepHeader step={1} onBack={() => router.back()} />
			{userId && (
				<ResolvedRecipientCard
					isLoading={isLookingUp}
					name={lookup?.name}
					notFound={!isLookingUp && lookup === null}
				/>
			)}
			{!isResolvingLink &&
				(linkedRecipient ? (
					<ResolvedSendAmountStep
						recipientAddress={linkedRecipient}
						recipientName={lookup?.name}
						onContinue={handleContinue}
					/>
				) : (
					<SendMoneyFormStep defaultValues={values} onContinue={handleContinue} />
				))}
		</div>
	);
}

// `useSearchParams()` (for `?userId=`/`?wallet=`, above) requires a
// Suspense boundary — same reason `auth/reset-password/page.tsx` needs one
// for its own token param.
export default function SendMoneyPage() {
	return (
		<Suspense>
			<SendMoneyPageContent />
		</Suspense>
	);
}
