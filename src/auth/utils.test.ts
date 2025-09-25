import { intlMock } from "@test/intl";

import { CLOUD_PLUGIN_ID, getExternalAuthenticationMethodName, SSO_PLUGIN_ID } from "./utils";

describe("getExternalAuthenticationMethodName", () => {
  it("returns Saleor Cloud label when cloud plugin is provided", () => {
    const result = getExternalAuthenticationMethodName({
      pluginId: CLOUD_PLUGIN_ID,
      intl: intlMock,
    });

    expect(result).toBe("Continue with Saleor Cloud");
  });

  it("returns SSO label when SSO plugin is provided", () => {
    const result = getExternalAuthenticationMethodName({
      pluginId: SSO_PLUGIN_ID,
      intl: intlMock,
    });

    expect(result).toBe("Continue with SSO");
  });

  it("returns null when plugin is not supported", () => {
    const result = getExternalAuthenticationMethodName({
      pluginId: "unsupported.plugin",
      intl: intlMock,
    });

    expect(result).toBeNull();
  });
});
