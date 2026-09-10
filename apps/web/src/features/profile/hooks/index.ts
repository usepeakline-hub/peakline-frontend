import { useMutation } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import type { ApiSuccessResponse, EnrollTotpData } from "@/lib/api/types";
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

/** Begins TOTP enrollment — `POST /auth/2fa/enroll`. Returns the QR code
 * and recovery codes to show once; the account isn't actually protected
 * until `useConfirm2fa` succeeds with a code from that QR. Calling this
 * again while already enrolled 409s (`TOTP_ALREADY_ENROLLED`) — surfaced
 * as a normal mutation error, not swallowed, since re-enrolling silently
 * would invalidate a QR the user may have already scanned. */
function useEnroll2fa() {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async () => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<EnrollTotpData>>(
				apiRoutes.twoFactor.ENROLL,
			);
			return data.data;
		},
	});
}

/** Activates 2FA with the first code from the authenticator app —
 * `POST /auth/2fa/confirm`. */
function useConfirm2fa() {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async (totpCode: string) => {
			await axiosAuth.post(apiRoutes.twoFactor.CONFIRM, { totpCode });
		},
	});
}

/** Disables 2FA — `DELETE /auth/2fa`, authorised by a current TOTP code
 * (not a password), matching the backend's own requirement. */
function useDisable2fa() {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async (totpCode: string) => {
			await axiosAuth.delete(apiRoutes.twoFactor.DISABLE, { data: { totpCode } });
		},
	});
}

export { useUpdateProfile, useEnroll2fa, useConfirm2fa, useDisable2fa };
