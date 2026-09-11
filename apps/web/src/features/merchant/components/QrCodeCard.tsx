"use client";

import { useRef, useState } from "react";
import { QrCode, Camera, Download } from "lucide-react";
import QRCodeSvg from "react-qr-code";
import { Button } from "@repo/ui/button";
import { Logo } from "@repo/ui/logo";
import { toast } from "@repo/ui/sonner";
import { downloadSvgAsPng } from "@/lib/qrImage";
import { FAKE_BUSINESS_NAME, FAKE_MERCHANT_QR_LINK } from "@/features/merchant/hooks";

/**
 * Two states, per the mock: a plain "Generate" prompt, then the actual QR
 * once requested. Both cards stay at a fixed max width and hug the left
 * edge of the page (not stretched full-width, not centered in the leftover
 * space) — the mock's own card is visibly narrower than the page around
 * it, same treatment either state. "Download QR" is real (see
 * `downloadSvgAsPng`) — "Scan QR" has no real camera access (same
 * limitation as `ScanMerchantCard`), and scanning one's own store code has
 * no obvious purpose anyway (the mock doesn't explain who'd use it or for
 * what), so it's a clear toast rather than invented behavior. Its `primary`
 * variant (vs. "Download QR"'s `outline`) matches the mock's own weighting
 * of the two buttons — Scan is the one likely to be tapped at the counter,
 * Download the occasional one.
 */
function QrCodeCard() {
	const [generated, setGenerated] = useState(false);
	const qrContainerRef = useRef<HTMLDivElement>(null);

	function handleDownload() {
		const svg = qrContainerRef.current?.querySelector("svg");
		if (!svg) {
			toast.error("Couldn't generate the QR image");
			return;
		}
		downloadSvgAsPng(svg, "peakline-store-qr-code.png");
	}

	if (!generated) {
		return (
			<div className="flex max-w-xl flex-col items-center gap-6 rounded-2xl border border-border bg-background p-8 text-center sm:p-12">
				<div className="flex flex-col gap-2">
					<h2 className="text-h5 text-foreground">Generate a QR code for your store</h2>
					<p className="text-b3 text-muted-foreground">
						Your customers can easily scan this to make a payment
					</p>
				</div>
				<Button type="button" size="large" onClick={() => setGenerated(true)}>
					<QrCode className="size-4" aria-hidden="true" />
					Generate QR
				</Button>
			</div>
		);
	}

	return (
		<div className="flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-border bg-background p-6 sm:p-8">
			<span className="text-h5 text-foreground">{FAKE_BUSINESS_NAME}</span>
			<div ref={qrContainerRef} className="rounded-xl bg-white p-4">
				<QRCodeSvg value={FAKE_MERCHANT_QR_LINK} size={200} />
			</div>
			<Logo size="sm" />
			<p className="text-b3 text-muted-foreground">Customers can scan this code to pay you</p>

			<div className="flex w-full flex-col gap-3 sm:flex-row">
				<Button
					type="button"
					className="w-full"
					onClick={() => toast.info("Camera scanning isn't available in this demo")}
				>
					<Camera className="size-4" aria-hidden="true" />
					Scan QR
				</Button>
				<Button type="button" variant="outline" className="w-full" onClick={handleDownload}>
					<Download className="size-4" aria-hidden="true" />
					Download QR
				</Button>
			</div>
		</div>
	);
}

export { QrCodeCard };
