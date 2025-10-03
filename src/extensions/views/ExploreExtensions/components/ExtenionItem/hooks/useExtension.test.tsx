import { ExtensionData } from "@dashboard/extensions/types";
import { renderHook } from "@testing-library/react-hooks";
import * as React from "react";

import { useExtension } from "./useExtension";

jest.mock("@dashboard/components/Link", () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("@saleor/macaw-ui-next", () => ({
  ...(jest.requireActual("@saleor/macaw-ui-next") as object),
  useTheme: () => ({ theme: "default" }),
}));

const basePlugin = {
  type: "PLUGIN",
  id: "mirumee.braintree",
  name: {
    en: "Braintreee",
  },
  description: {
    en: "Description",
  },
  logo: {
    light: {
      source: "plugin-logo.png",
    },
    dark: {
      source: "plugin-logo.png",
    },
  },
};

const baseApp = {
  type: "APP",
  kind: "OFFICIAL",
  name: {
    en: "Adyen",
  },
  description: {
    en: "App description",
  },
  logo: {
    light: {
      source: "plugin-logo.png",
    },
    dark: {
      source: "plugin-logo.png",
    },
  },
  manifestUrl: "https://example.com/manifest",
  repositoryUrl: "https://example.com/repository",
};

describe("Extensions / ExtensionItem / useExtension", () => {
  it("should return correct values for not installed plugin", () => {
    // Arrange
    const extension = {
      ...basePlugin,
      installed: false,
      appId: "123",
    } as ExtensionData;

    // Act
    const { result } = renderHook(() => useExtension(extension));

    // Assert
    expect(result.current).toEqual(
      expect.objectContaining({
        title: "Braintreee",
        subtitle: "Developed by {developer}",
        description: "Description",
        isInstalled: false,
      }),
    );
  });

  it("should return correct values for installed plugin", () => {
    // Arrange
    const extension = {
      ...basePlugin,
      installed: true,
      appId: "123",
    } as ExtensionData;

    // Act
    const { result } = renderHook(() => useExtension(extension));

    // Assert
    expect(result.current).toEqual(
      expect.objectContaining({
        title: "Braintreee",
        subtitle: "Developed by {developer}",
        description: "Description",
        isInstalled: true,
      }),
    );
  });

  it("should return correct values for not installed app", () => {
    // Arrange
    const extension = {
      ...baseApp,
      installed: false,
      appId: "123",
    } as ExtensionData;

    // Act
    const { result } = renderHook(() => useExtension(extension));

    // Assert
    expect(result.current).toEqual(
      expect.objectContaining({
        title: "Adyen",
        subtitle: "Developed by {developer}",
        description: "App description",
        isInstalled: false,
      }),
    );
  });

  it("should return correct values for installed app", () => {
    // Arrange
    const extension = {
      ...baseApp,
      installed: true,
      appId: "123",
    } as ExtensionData;

    // Act
    const { result } = renderHook(() => useExtension(extension));

    // Assert
    expect(result.current).toEqual(
      expect.objectContaining({
        title: "Adyen",
        subtitle: "Developed by {developer}",
        description: "App description",
        isInstalled: true,
      }),
    );
  });

  it("should return correct values for official installed custom app", () => {
    // Arrange
    const extension = {
      ...baseApp,
      isCustomApp: true,
      installed: true,
      appId: "123",
    } as ExtensionData;

    // Act
    const { result } = renderHook(() => useExtension(extension));

    // Assert
    expect(result.current).toEqual(
      expect.objectContaining({
        title: "Adyen",
        subtitle: "Custom build",
        description: "App description",
        isInstalled: true,
      }),
    );
  });

  it("should return correct values for oss installed app", () => {
    // Arrange
    const extension = {
      ...baseApp,
      kind: "OSS",
      isCustomApp: true,
      installed: true,
      appId: "123",
    } as ExtensionData;

    // Act
    const { result } = renderHook(() => useExtension(extension));

    // Assert
    expect(result.current).toEqual(
      expect.objectContaining({
        title: "Adyen",
        subtitle: "Developed by {developer}",
        description: "App description",
        isInstalled: true,
      }),
    );
  });
});
