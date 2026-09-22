/**
 * Saleor global IDs are base64 of `<Type>:<pk>`, so an app ID always decodes to
 * `App:...`. Manifest identifiers (`saleor.app.adyen`, `stripe`) do not, which
 * makes decoding a cheap way to tell the two apart in the URL.
 */
export const isAppGlobalId = (value: string): boolean => {
  try {
    return atob(value).startsWith("App:");
  } catch {
    return false;
  }
};
