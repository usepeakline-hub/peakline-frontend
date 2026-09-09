"use client";

import { useRef, useState } from "react";
import { QrCode, Camera, Download } from "lucide-react";
import QRCodeSvg from "react-qr-code";
import { Button } from "@repo/ui/button";
import { Logo } from "@repo/ui/logo";
import { toast } from "@repo/ui/sonner";
import { FAKE_BUSINESS_NAME, FAKE_MERCHANT_QR_LINK } from "@/features/merchant/hooks";

/** Renders the `<svg>` a container ref points at onto a padded white canvas
 * and downloads it as a PNG — `react-qr-code` only ever renders a plain
 * SVG, no built-in export, and PNG is the more broadly useful format for
 * "print this and stick it at the counter" than a raw SVG file would be. */
function downloadSvgAsPng(svg: SVGSVGElement, filename: string) {
	const svgString = new XMLSerializer().serializeToString(svg);
	const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
	const svgUrl = URL.createObjectURL(svgBlob);

	const img = new Image();
	img.onload = () => {
		const padding = 32;
		const canvas = document.createElement("canvas");
		canvas.width = img.width + padding * 2;
		canvas.height = img.height + padding * 2;
		const ctx = canvas.getContext("2d");
		URL.revokeObjectURL(svgUrl);
		if (!ctx) {
			toast.error("Couldn't generate the QR image");
			return;
		}
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(img, padding, padding);
		canvas.toBlob((blob) => {
			if (!blob) {
				toast.error("Couldn't generate the QR image");
				return;
			}
			const pngUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = pngUrl;
			link.download = filename;
			link.click();
			URL.revokeObjectURL(pngUrl);
		}, "image/png");
	};
	img.onerror = () => {
		URL.revokeObjectURL(svgUrl);
		toast.error("Couldn't generate the QR image");
	};
	img.src = svgUrl;
}

/**
 * Two states, per the mock: a plain "Generate" prompt, then the actual QR
 * once requested. "Download QR" is real (see `downloadSvgAsPng`) — "Scan
 * QR" has no real camera access (same limitation as `ScanMerchantCard`),
 * and scanning one's own store code has no obvious purpose anyway (the
 * mock doesn't explain who'd use it or for what), so it's a clear toast
 * rather than invented behavior.
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
			<div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-background p-8 text-center sm:p-12">
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
		<div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background p-6 sm:p-8">
			<span className="text-h5 text-foreground">{FAKE_BUSINESS_NAME}</span>
			<div ref={qrContainerRef} className="rounded-xl bg-white p-4">
				<QRCodeSvg value={FAKE_MERCHANT_QR_LINK} size={200} />
			</div>
			<Logo size="sm" />
			<p className="text-b3 text-muted-foreground">Customers can scan this code to pay you</p>

			<div className="flex w-full flex-col gap-3 sm:flex-row">
				<Button
					type="button"
					variant="outline"
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
