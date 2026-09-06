/**
 * Fake, fixed Stellar-shaped public key — no real Stellar account exists
 * behind it yet. Fixed rather than randomly generated per-mount, so it
 * stays the same everywhere it's shown (the wallet-created page, the
 * Wallet page, anywhere else later) — a real address obviously wouldn't
 * change on every render.
 */
export const FAKE_WALLET_ADDRESS =
	"GJOKMMTKAEJKOAZ74AXYNDRRZGGE7LAODIYST3DQ7CRB4ATDNEHV4ITK";

export function maskWalletAddress(address: string) {
	return `${address.slice(0, 5)}${"*".repeat(8)}${address.slice(-5)}`;
}
