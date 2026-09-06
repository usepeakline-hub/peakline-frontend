export interface FakeMerchant {
	id: string;
	name: string;
}

/** Every scan resolves to the same fake merchant — there's no real QR
 * decoding or merchant directory yet. */
export const FAKE_MERCHANT: FakeMerchant = {
	id: "ama-fashion-store",
	name: "Ama's Fashion Store",
};
