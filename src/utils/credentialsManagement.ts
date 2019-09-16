import { User } from "@saleor/auth/types/User";

export const isSupported =
  navigator.credentials && navigator.credentials.preventSilentAccess;

export function login(loginFn: (id: string, password: string) => void) {
  if (isSupported) {
    navigator.credentials.get({ password: true }).then(credential => {
      if (credential instanceof PasswordCredential) {
        loginFn(credential.id, credential.password);
      }
    });
  }
}

export function saveCredentials(user: User, password: string) {
  if (isSupported) {
    const cred = new PasswordCredential({
      iconURL: user.avatar ? user.avatar.url : undefined,
      id: user.email,
      name: user.firstName ? `${user.firstName} ${user.lastName}` : undefined,
      password
    });
    navigator.credentials.store(cred);
  }
}
