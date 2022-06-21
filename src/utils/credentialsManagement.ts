import { LoginData } from "@saleor/sdk";

export const isSupported = !!(
  navigator?.credentials?.preventSilentAccess && window.PasswordCredential
);

export async function login<T>(
  loginFn: (id: string, password: string) => Promise<T>,
): Promise<T | null> {
  let result: T;

  try {
    const credential = await navigator.credentials.get({ password: true });
    if (credential instanceof PasswordCredential) {
      result = await loginFn(credential.id, credential.password);
    }
  } catch {
    result = null;
  }

  return result;
}

export function saveCredentials(
  user: LoginData["user"],
  password: string,
): Promise<CredentialType | null> {
  let result: Promise<CredentialType | null>;

  if (isSupported) {
    const cred = new PasswordCredential({
      id: user.email,
      name: user.firstName ? `${user.firstName} ${user.lastName}` : undefined,
      password,
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
