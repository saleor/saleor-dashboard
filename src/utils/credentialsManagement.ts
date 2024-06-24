import { UserFragment } from "@dashboard/graphql";
import { UserDetailsFragment } from "@saleor/sdk/dist/apollo/types";

export const isSupported = !!window.PasswordCredential;

export async function login<T>(
  loginFn: (id: string, password: string) => Promise<T>,
): Promise<T | null> {
  let result: T | null;

  try {
    const credential = await navigator.credentials.get({ password: true });

    if (credential instanceof PasswordCredential) {
      result = await loginFn(credential.id, credential.password ?? "");
    }
  } catch {
    result = null;
  }

  return result!;
}

export async function checkIfCredentialsExist() {
  const credential = await navigator.credentials.get({ password: true });

  if (credential === null) {
    return false;
  }

  return true;
}

export async function saveCredentials(
  user: UserFragment | UserDetailsFragment,
  password: string,
): Promise<CredentialType | null> {
  if (!isSupported) return null;

  try {
    const cred = new PasswordCredential({
      id: user.email,
      name: user.firstName ? `${user.firstName} ${user.lastName}` : undefined,
      password,
    });

    return await navigator.credentials.store(cred);
  } catch {
    return null;
  }
}
