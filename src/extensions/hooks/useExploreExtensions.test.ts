import { renderHook } from "@testing-library/react-hooks";

import { useAppStoreExtensions } from "./useAppStoreExtensions";
import { useExploreExtensions } from "./useExploreExtensions";
import { useInstalledExtensions } from "./useInstalledExtensions";

jest.mock("./useAppStoreExtensions");
jest.mock("./useInstalledExtensions");

const mockedAppStoreExtensions = {
  payments: {
    title: "Payments",
    items: [
      {
        id: "app-id-1",
        type: "APP",
        name: "Stripe",
        manifestUrl: "http://example.com/api/manifest",
      },
      {
        id: "app-id-2",
        type: "APP",
        name: "Adyen",
        manifestUrl: "http://example-1.com/api/manifest",
      },
    ],
  },
  cms: {
    title: "CMS",
    items: [
      {
        id: "app-id-3",
        type: "APP",
        name: "Strapi",
        manifestUrl: "http://example-2.com/api/manifest",
      },
    ],
  },
  taxes: {
    title: "Taxes",
    items: [
      {
        id: "app-id-4",
        type: "APP",
        name: "TaxJar",
        manifestUrl: "http://example-3.com/api/manifest",
      },
    ],
  },
  automation: { title: "Automation", items: [] },
};

describe("Extension / hooks / useExploreExtensions", () => {
  it("should return loading state when fetching data", () => {
    // Arrange
    (useAppStoreExtensions as jest.Mock).mockReturnValue({
      data: {},
      loading: true,
      error: null,
    });
    (useInstalledExtensions as jest.Mock).mockReturnValue({ installedApps: [] });

    // Act
    const { result } = renderHook(() => useExploreExtensions());

    // Assert
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.extensions).toEqual({});
  });

  it("should return extensions data when fetched", () => {
    // Arrange
    (useAppStoreExtensions as jest.Mock).mockReturnValue({
      data: mockedAppStoreExtensions,
      loading: false,
      error: null,
    });
    (useInstalledExtensions as jest.Mock).mockReturnValue({
      installedApps: [
        {
          id: "id-1",
          identifier: "app-id-1",
          isActive: true,
          manifestUrl: "http://example.com/api/manifest",
        },
        {
          id: "id-2",
          identifier: "app-id-2",
          isActive: true,
          manifestUrl: "http://something.com/api/manifest",
        },
        {
          id: "id-4",
          identifier: "app-id-4",
          isActive: false,
          manifestUrl: "http://example-3.com/api/manifest",
        },
      ],
    });

    // Act
    const { result } = renderHook(() => useExploreExtensions());

    // Assert
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.extensions).toEqual({
      automation: { title: "Automation", items: [] },
      cms: {
        title: "CMS",
        items: [
          {
            id: "app-id-3",
            type: "APP",
            name: "Strapi",
            manifestUrl: "http://example-2.com/api/manifest",
          },
        ],
      },
      payments: {
        title: "Payments",
        items: [
          {
            id: "app-id-1",
            type: "APP",
            name: "Stripe",
            manifestUrl: "http://example.com/api/manifest",
            installed: true,
            disabled: false,
            isCustomApp: false,
            appId: "id-1",
          },
          {
            appId: "id-2",
            disabled: false,
            id: "app-id-2",
            installed: true,
            isCustomApp: true,
            manifestUrl: "http://example-1.com/api/manifest",
            name: "Adyen",
            type: "APP",
          },
        ],
      },
      taxes: {
        title: "Taxes",
        items: [
          {
            appId: "id-4",
            disabled: true,
            id: "app-id-4",
            installed: true,
            isCustomApp: false,
            manifestUrl: "http://example-3.com/api/manifest",
            name: "TaxJar",
            type: "APP",
          },
        ],
      },
    });
  });
});
