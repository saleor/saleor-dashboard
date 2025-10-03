import { testIntlInstance } from "@test/intl";

import {
  CLOUD_PLUGIN_ID,
  getExternalAuthenticationMethodName,
  getNewPasswordResetRedirectUrl,
  SSO_PLUGIN_ID,
} from "./utils";

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

describe("getExternalAuthenticationMethodName", () => {
  it("returns Saleor Cloud label when cloud plugin is provided", () => {
    const result = getExternalAuthenticationMethodName({
      pluginId: CLOUD_PLUGIN_ID,
      intl: testIntlInstance,
    });

    expect(result).toBe("Continue with Saleor Cloud");
  });

  it("returns SSO label when SSO plugin is provided", () => {
    const result = getExternalAuthenticationMethodName({
      pluginId: SSO_PLUGIN_ID,
      intl: testIntlInstance,
    });

    expect(result).toBe("Continue with SSO");
  });

  it("returns null when plugin is not supported", () => {
    const result = getExternalAuthenticationMethodName({
      pluginId: "unsupported.plugin",
      intl: testIntlInstance,
    });

    expect(result).toBeNull();
  });
});
