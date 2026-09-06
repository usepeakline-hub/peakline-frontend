import { useMutation } from "@tanstack/react-query";
import { FAKE_REQUEST_LINK } from "@/lib/requestPayment";
import type { RequestPaymentValues } from "@/lib/validations/requestPaymentValidations";

// TODO: replace with a real call into the payments API once it exists.
async function fakeRequest<T>(payload: T, delay = 900): Promise<T> {
	await new Promise((resolve) => setTimeout(resolve, delay));
	return payload;
}

interface PaymentRequestResult {
	link: string;
}

function useCreatePaymentRequest() {
	return useMutation({
		mutationFn: (_values: RequestPaymentValues) =>
			fakeRequest<PaymentRequestResult>({ link: FAKE_REQUEST_LINK }),
	});
}

export { useCreatePaymentRequest };
