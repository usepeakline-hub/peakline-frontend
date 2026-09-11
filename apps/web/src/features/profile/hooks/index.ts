import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { apiRoutes } from "@/lib/config/apiRoutes";
import type {
	AccountDeletionStatusData,
	ApiSuccessResponse,
	EnrollTotpData,
	ProfileData,
} from "@/lib/api/types";
import type { ProfileValues } from "@/lib/validations/profileValidations";

const PROFILE_KEY = ["profile", "me"];

/** `GET /users/me` — the real account record `PersonalInformationCard`
 * reads from (previously a hardcoded fake `DEFAULT_VALUES` object). Also
 * carries `deletionRequestedAt`/`deletionScheduledAt` for that same card's
 * pending-deletion banner, and `customerType`/`kycTier`/verification
 * timestamps not used yet but worth having typed for whoever needs them
 * next. */
function useProfile(options?: { enabled?: boolean }) {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: PROFILE_KEY,
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<ProfileData>>(
				apiRoutes.users.ME,
			);
			return data.data;
		},
		enabled: options?.enabled,
	});
}

/** `PATCH /users/me` — only firstName/lastName/otherName/username actually
 * go out (see `profileSchema`'s own note on why email/phone aren't here).
 * Refetches the profile on success rather than trusting the (data: null)
 * response body to reflect the change. */
function useUpdateProfile() {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (values: ProfileValues) =>
			axiosAuth.patch(apiRoutes.users.ME, {
				firstName: values.firstName,
				lastName: values.lastName,
				otherName: values.otherName || undefined,
				username: values.username,
			}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
	});
}

/** Schedules the account for deletion 7 days out — not immediate, per the
 * endpoint's own description. `useCancelAccountDeletion` (`DELETE` on the
 * same path) reverses it any time within that window. Both update the
 * profile cache directly from their own response instead of refetching —
 * `AccountDeletionStatusDto` already has exactly the two fields that
 * changed. */
function useRequestAccountDeletion() {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<AccountDeletionStatusData>>(
				apiRoutes.users.ME_DELETION_REQUEST,
			);
			return data.data;
		},
		onSuccess: (status) => {
			queryClient.setQueryData<ProfileData | undefined>(PROFILE_KEY, (profile) =>
				profile
					? {
							...profile,
							deletionRequestedAt: status.deletionRequestedAt,
							deletionScheduledAt: status.deletionScheduledAt,
						}
					: profile,
			);
		},
	});
}

function useCancelAccountDeletion() {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { data } = await axiosAuth.delete<ApiSuccessResponse<AccountDeletionStatusData>>(
				apiRoutes.users.ME_DELETION_REQUEST,
			);
			return data.data;
		},
		onSuccess: (status) => {
			queryClient.setQueryData<ProfileData | undefined>(PROFILE_KEY, (profile) =>
				profile
					? {
							...profile,
							deletionRequestedAt: status.deletionRequestedAt,
							deletionScheduledAt: status.deletionScheduledAt,
						}
					: profile,
			);
		},
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

export {
	useProfile,
	useUpdateProfile,
	useRequestAccountDeletion,
	useCancelAccountDeletion,
	useEnroll2fa,
	useConfirm2fa,
	useDisable2fa,
};
