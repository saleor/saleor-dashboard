import { AppUrls } from "@dashboard/apps/urls";
import * as config from "@dashboard/config";
import { ThemeType } from "@saleor/app-sdk/app-bridge";

jest.mock("@dashboard/config", () => {
  const actualModule = jest.requireActual("@dashboard/config");
  return {
    __esModule: true,
    ...actualModule,
  };
});
describe("AppUrls (apps/urls.ts)", () => {
  describe("isAppDeepUrlChange", () => {
    it("Returns true if only nested app path changes", () => {
      expect(
        AppUrls.isAppDeepUrlChange("XYZ", "/apps/XYZ/app/configuration", "/apps/XYZ/app/error"),
      ).toBe(true);
    });
    it("Returns false if dashboard path changes outside of app path", () => {
      expect(AppUrls.isAppDeepUrlChange("XYZ", "/apps/XYZ/configuration", "/orders")).toBe(false);
    });
  });
  describe("resolveAppIframeUrl", () => {
    afterAll(() => {
      jest.clearAllMocks();
    });
    describe("For full URL provided in env", () => {
      beforeEach(() => {
        jest
          .spyOn(config, "getApiUrl")
          .mockImplementation(() => "https://shop.saleor.cloud/graphql/");
      });
      it.each<[string, string, Record<string, string> & { theme: ThemeType }, string]>([
        [
          "XyZ123",
          "https://my-app.vercel.app",
          { param1: "param1", theme: "light" },
          "https://my-app.vercel.app?domain=shop.saleor.cloud&saleorApiUrl=https%3A%2F%2Fshop.saleor.cloud%2Fgraphql%2F&id=XyZ123&param1=param1&theme=light",
        ],
        [
          "AbC987",
          "https://my-app.vercel.app/configuration",
          { param1: "param1", param2: "param2", theme: "light" },
          "https://my-app.vercel.app/configuration?domain=shop.saleor.cloud&saleorApiUrl=https%3A%2F%2Fshop.saleor.cloud%2Fgraphql%2F&id=AbC987&param1=param1&param2=param2&theme=light",
        ],
      ])("Generates valid URL from segments", (id, appUrl, params, expectedUrl) => {
        const result = AppUrls.resolveAppIframeUrl(id, appUrl, params);

        expect(result).toEqual(expectedUrl);
      });
    });
    /**
     * Test this scenario for cloud deployments where origin is computed.
     *
     * Current jest is not set up for testing location/URL
     */
    test.todo("Test if URL is valid when API_URL in env is absolute path like /graphql/");
  });
});
