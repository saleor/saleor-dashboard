import { resolveAppIframeUrl } from "@saleor/apps/urls";
import * as config from "@saleor/config";

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

    it.each<[string, string, Record<string, string>, string]>([
      [
        "XyZ123",
        "https://my-app.vercel.app",
        { param1: "param1" },
        "https://my-app.vercel.app?domain=shop.saleor.cloud&saleorApiUrl=https%3A%2F%2Fshop.saleor.cloud%2Fgraphql%2F&id=XyZ123&param1=param1",
      ],
      [
        "AbC987",
        "https://my-app.vercel.app/configuration",
        { param1: "param1", param2: "param2" },
        "https://my-app.vercel.app/configuration?domain=shop.saleor.cloud&saleorApiUrl=https%3A%2F%2Fshop.saleor.cloud%2Fgraphql%2F&id=AbC987&param1=param1&param2=param2",
      ],
    ])(
      "Generates valid URL from segments",
      (id, appUrl, params, expectedUrl) => {
        const result = resolveAppIframeUrl(id, appUrl, params);

        expect(result).toEqual(expectedUrl);
      },
    );
  });

  /**
   * Test this scenario for cloud deployments where origin is computed.
   *
   * Current jest is not set up for testing location/URL
   */
  test.todo(
    "Test if URL is valid when API_URL in env is absolute path like /graphql/",
  );
});
