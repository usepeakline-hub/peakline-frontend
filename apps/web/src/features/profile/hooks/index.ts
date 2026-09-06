import { useMutation } from "@tanstack/react-query";
import type { ProfileValues } from "@/lib/validations/profileValidations";

// TODO: replace with a real call into the profile API once it exists.
async function fakeRequest<T>(payload: T, delay = 800): Promise<T> {
	await new Promise((resolve) => setTimeout(resolve, delay));
	return payload;
}

function useUpdateProfile() {
	return useMutation({
		mutationFn: (values: ProfileValues) => fakeRequest(values),
	});
}

export { useUpdateProfile };
