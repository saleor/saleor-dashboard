import { renderHook } from "@testing-library/react-hooks";

import { useAppStoreExtensions } from "./useAppStoreExtensions";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

const mockExtensionsResponse = {
  extensionCategories: [
    {
      name: { en: "Payments" },
      extensions: [{ id: "1", name: "Stripe" }],
    },
    {
      name: { en: "CMS" },
      extensions: [{ id: "2", name: "WordPress" }],
    },
    {
      name: { en: "Taxes" },
      extensions: [],
    },
    {
      name: { en: "Automation" },
      extensions: [],
    },
  ],
};

global.fetch = jest.fn();

describe("Extensions / hooks / useAppStoreExtensions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error message when appStoreUrl is not provided", () => {
    // Act
    const { result } = renderHook(() => useAppStoreExtensions());

    // Assert
    expect(result.current.error).toBe("No extensions API URL provided");
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual({
      payments: { title: "", items: [] },
      cms: { title: "", items: [] },
      taxes: { title: "", items: [] },
      automation: { title: "", items: [] },
    });
  });

  it("should fetch and set data when appStoreUrl is provided", async () => {
    // Arrange
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockExtensionsResponse),
    });

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useAppStoreExtensions("https://mockapi.com"),
    );

    // Assert
    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual({
      payments: { title: "Payments", items: [{ id: "1", name: "Stripe" }] },
      cms: { title: "CMS", items: [{ id: "2", name: "WordPress" }] },
      taxes: { title: "Taxes", items: [] },
      automation: { title: "Automation", items: [] },
    });
  });

  it("should handle API errors", async () => {
    // Arrange
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    // Act
    const { result, waitForNextUpdate } = renderHook(() =>
      useAppStoreExtensions("https://mockapi.com"),
    );

    // Assert
    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Network Error");
    expect(result.current.data).toEqual({
      payments: { title: "", items: [] },
      cms: { title: "", items: [] },
      taxes: { title: "", items: [] },
      automation: { title: "", items: [] },
    });
  });
});
