import { getNewPasswordResetRedirectUrl } from "./utils";

describe("getNewPasswordResetRedirectUrl", () => {
  it("should return the correct redirect URL if dashboard is mounted under /", () => {
    const redirectUrl = getNewPasswordResetRedirectUrl();
    expect(redirectUrl).toBe("http://localhost/new-password/");
  });

  it("should return the correct redirect URL if dashboard is mounted under /dashboard", () => {
    window.__SALEOR_CONFIG__ = {
      ...window.__SALEOR_CONFIG__,
      APP_MOUNT_URI: "/dashboard/",
    };

    const redirectUrl = getNewPasswordResetRedirectUrl();
    expect(redirectUrl).toBe("http://localhost/dashboard/new-password/");
  });
});
