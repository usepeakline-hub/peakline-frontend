"use client";

import { useRouter } from "next/navigation";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ReceiveQrCard } from "@/features/receive/components/ReceiveQrCard";
import { ReceiveInfoCard } from "@/features/receive/components/ReceiveInfoCard";
import { useMyWallet } from "@/features/wallet/hooks";
import { maskWalletAddress } from "@/lib/wallet";

// No "Share Payment Link"/"Share Payment Request" rows — neither is a real
// concept for an individual account on the backend (no equivalent of
// merchant Payment Links exists for one), so the only real thing to share
// here is the wallet address itself.
export default function ReceivePage() {
	const router = useRouter();
	const { data: wallet } = useMyWallet();
	const walletAddress = wallet?.publicKey ?? "";

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			<MobileStepHeader title="Receive" onBack={() => router.back()} />
			<PageHeader
				title="Receive"
				subtitle="Scan or share your QR code or wallet address to receive payments."
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
				<ReceiveQrCard />
				<ReceiveInfoCard
					label="Copy Wallet Address"
					value={walletAddress ? maskWalletAddress(walletAddress) : "No wallet yet"}
					copyValue={walletAddress}
				/>
			</div>
		</div>
	);
}
