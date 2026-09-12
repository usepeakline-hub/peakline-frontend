"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SendStepHeader } from "@/features/send/components/SendStepHeader";
import { SendMoneyFormStep } from "@/features/send/components/SendMoneyFormStep";
import { ResolvedRecipientCard } from "@/features/send/components/ResolvedRecipientCard";
import { useSendMoneyFlowStore } from "@/features/send/store/sendMoneyFlowStore";
import { useWalletLookup } from "@/features/wallet/hooks";
import { WALLET_ADDRESS_REGEX } from "@/lib/wallet";

/**
 * Two ways to arrive here pre-filled — the entire client side of "receive
 * via QR/link/wallet address" (see `lib/wallet.ts`'s own notes):
 *
 * - `?userId=<id>` — someone's Receive QR/link (`buildReceiveLink`).
 *   Resolved via the real `GET /wallets/lookup/{userId}` (`useWalletLookup`)
 *   into a name + wallet address; `ResolvedRecipientCard` shows who's about
 *   to get paid before the amount field even renders.
 * - `?wallet=<address>` — a bare address (from "Copy Wallet Address", or
 *   `/pay`'s own scan-or-paste box recognizing one directly) — no lookup,
 *   no name, just the address pre-filled, same as typing it in manually.
 *
 * Either way, `SendMoneyFormStep` supports arriving with `method`/
 * `recipient` pre-filled, same as resuming an in-progress manual entry from
 * the store — from there it's the exact same `POST /transfers/send`
 * (`mode: "wallet"`) flow either path leads to.
 *
 * The lookup is async, so `linkedRecipient` only exists a render or two
 * after this page's own first paint — react-hook-form's `defaultValues`
 * only ever applies once, at mount, so simply re-rendering with a new
 * `defaultValues` prop later (once the lookup resolves) wouldn't actually
 * update the already-mounted form. `key={formKey}` forces exactly one
 * remount the moment resolution completes (or fails), so the form always
 * mounts fresh with its real, final defaultValues — the same trick, same
 * reason, as `PersonalInformationFields` needing its own `form.reset`
 * effect for the equivalent "server data arrives after mount" gap.
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
	const formKey = userId ? `lookup:${userId}:${linkedRecipient ?? "pending"}` : `wallet:${walletParam ?? "none"}`;

	useEffect(() => {
		if (linkedRecipient) {
			setValues({
				method: "wallet",
				recipient: linkedRecipient,
				amount: "" as unknown as number,
				note: "",
			});
		}
		// Runs once per resolved link — re-seeding on every `values` change
		// would wipe out the amount/note the person is actively typing.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [linkedRecipient]);

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
			{/* While a link's lookup is still in flight, `ResolvedRecipientCard`
			    above is already the loading state — holding the form back too
			    avoids showing its unrelated "Select Transfer Method" placeholder
			    at the same time. */}
			{!(userId && isLookingUp) && (
				<SendMoneyFormStep
					key={formKey}
					defaultValues={
						linkedRecipient
							? {
									method: "wallet",
									recipient: linkedRecipient,
									amount: "" as unknown as number,
									note: "",
								}
							: values
					}
					onContinue={(submitted) => {
						setValues(submitted);
						router.push("/send/review");
					}}
				/>
			)}
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
