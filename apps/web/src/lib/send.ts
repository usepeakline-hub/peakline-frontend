/**
 * Fake recipient resolution — every phone/username/wallet address entered
 * on the Send form "resolves" to the same person, standing in for a real
 * directory lookup that doesn't exist yet. Swap for a real lookup once the
 * backend can look up an account by identifier.
 */
export const FAKE_RECIPIENT_NAME = "John Doe";
