import { User } from "@saleor/fragments/types/User";

export const isSupported = !!(
  navigator?.credentials?.preventSilentAccess && window.PasswordCredential
);

export async function login<T>(
  loginFn: (id: string, password: string) => T
): Promise<T | null> {
  let result: T;

  try {
    const credential = await navigator.credentials.get({ password: true });
    if (credential instanceof PasswordCredential) {
      result = loginFn(credential.id, credential.password);
    }
  } catch {
    result = null;
  }

  return result;
}

export function saveCredentials(
  user: User,
  password: string
): Promise<CredentialType | null> {
  let result: Promise<CredentialType | null>;

  if (isSupported) {
    const cred = new PasswordCredential({
      iconURL: user.avatar ? user.avatar.url : undefined,
      id: user.email,
      name: user.firstName ? `${user.firstName} ${user.lastName}` : undefined,
      password
    });
    try {
      result = navigator.credentials.store(cred);
    } catch {
      result = null;
    }
  } else {
    result = null;
  }

  return result;
}
