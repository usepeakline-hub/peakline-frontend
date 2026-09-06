import QRCode from "react-qr-code";
import { Logo } from "@repo/ui/logo";
import { FAKE_PAYMENT_LINK } from "@/lib/receive";

// TODO: source from the authenticated session once one exists — same
// placeholder used everywhere else (Topbar, GreetingHeader, Profile).
const USER_NAME = "John Doe";

/** Logo-QR-logo-name-caption, matching the mock's boarding-pass-style
 * layout exactly. The QR encodes the same shareable payment link shown as
 * plain text alongside it, so scanning and copying land on the same place. */
function ReceiveQrCard() {
	return (
		<div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background p-6 sm:p-8">
			<Logo size="sm" />
			<div className="rounded-xl bg-white p-3">
				<QRCode value={FAKE_PAYMENT_LINK} size={180} />
			</div>
			<Logo size="sm" />
			<div className="flex flex-col items-center gap-1 text-center">
				<span className="text-b2 font-semibold text-foreground sm:text-b1">
					{USER_NAME}
				</span>
				<span className="text-c1 text-muted-foreground sm:text-b3">Scan to pay</span>
			</div>
		</div>
	);
}

export { ReceiveQrCard };
