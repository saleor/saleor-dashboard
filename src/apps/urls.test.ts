import { resolveAppIframeUrl } from "@saleor/apps/urls";

jest.mock("@saleor/config", () => ({
  ...jest.requireActual("@saleor/config"),
  getApiUrl: () => "https://shop.saleor.cloud/graphql/",
}));

describe("resolveAppIframeUrl", () => {
  afterAll(() => {
    jest.clearAllMocks();
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
  ])("Generates valid URL from segments", (id, appUrl, params, expectedUrl) => {
    const result = resolveAppIframeUrl(id, appUrl, params);

    expect(result).toEqual(expectedUrl);
  });
});
