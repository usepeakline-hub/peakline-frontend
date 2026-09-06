"use client";

import { Camera } from "lucide-react";
import { Button } from "@repo/ui/button";

interface ScanMerchantCardProps {
	onScan: () => void;
	loading: boolean;
}

/** The camera-viewfinder frame from the mock — no real camera access here
 * (a device-permission feature well beyond this fake-backend app), so this
 * is a static frame and "Open camera to scan" just triggers the fake scan
 * directly. */
function ScanMerchantCard({ onScan, loading }: ScanMerchantCardProps) {
	return (
		<div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 sm:p-8">
			<div className="flex flex-col gap-1">
				<h2 className="text-b2 font-semibold text-foreground sm:text-b1">
					Scan Merchant QR to pay
				</h2>
				<p className="text-c1 text-muted-foreground sm:text-b3">
					Align QR code within the frame
				</p>
			</div>

			<div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-900">
				<span
					className="absolute top-6 left-6 size-10 rounded-tl-lg border-t-2 border-l-2 border-primary-400"
					aria-hidden="true"
				/>
				<span
					className="absolute top-6 right-6 size-10 rounded-tr-lg border-t-2 border-r-2 border-primary-400"
					aria-hidden="true"
				/>
				<span
					className="absolute bottom-6 left-6 size-10 rounded-bl-lg border-b-2 border-l-2 border-primary-400"
					aria-hidden="true"
				/>
				<span
					className="absolute right-6 bottom-6 size-10 rounded-br-lg border-r-2 border-b-2 border-primary-400"
					aria-hidden="true"
				/>
			</div>

			<Button type="button" size="large" className="w-full" onClick={onScan} loading={loading}>
				<Camera className="size-4" aria-hidden="true" />
				Open camera to scan
			</Button>
		</div>
	);
}

export { ScanMerchantCard };
