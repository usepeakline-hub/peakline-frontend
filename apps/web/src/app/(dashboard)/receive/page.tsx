"use client";

import { useRouter } from "next/navigation";
import { MobileStepHeader } from "@/features/wallet/components/MobileStepHeader";
import { PageHeader } from "@/components/layouts/PageHeader";
import { ReceiveQrCard } from "@/features/receive/components/ReceiveQrCard";
import { ReceiveInfoCard } from "@/features/receive/components/ReceiveInfoCard";
import { useMyWallet } from "@/features/wallet/hooks";
import { maskWalletAddress } from "@/lib/wallet";
import { FAKE_PAYMENT_LINK } from "@/lib/receive";

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
				<div className="flex flex-col gap-4">
					<ReceiveInfoCard
						label="Share Payment Link"
						value={FAKE_PAYMENT_LINK}
						copyValue={FAKE_PAYMENT_LINK}
					/>
					<ReceiveInfoCard
						label="Copy Wallet Address"
						value={walletAddress ? maskWalletAddress(walletAddress) : "No wallet yet"}
						copyValue={walletAddress}
					/>
					<ReceiveInfoCard
						label="Share Payment Request"
						value="Request payment from anyone"
						copyValue={FAKE_PAYMENT_LINK}
					/>
				</div>
			</div>
		</div>
	);
}
