import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormattedMessageProps } from "react-intl";

import { ExtensionData } from "../../../types";
import { useExtension } from "./useExtension";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: FormattedMessageProps) => <>{defaultMessage}</>,
}));

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
    const extension = {
      ...basePlugin,
      installed: false,
      appId: "123",
    } as ExtensionData;

    const { result } = renderHook(() => useExtension(extension));

    render(result.current.actions);

    expect(screen.getByRole("link", { name: "Install" })).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toEqual(1);

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
    const extension = {
      ...basePlugin,
      installed: true,
      appId: "123",
    } as ExtensionData;

    const { result } = renderHook(() => useExtension(extension));

    render(result.current.actions);

    expect(screen.getByRole("link", { name: "View details" })).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toEqual(1);

    expect(result.current).toEqual(
      expect.objectContaining({
        title: "Braintreee",
        subtitle: "Developed by {developer}",
        description: "Description",
        isInstalled: true,
      }),
    );
  });

  it("should return correct values for not installed extension", () => {
    const extension = {
      ...baseApp,
      installed: false,
      appId: "123",
    } as ExtensionData;
    const { result } = renderHook(() => useExtension(extension));

    render(result.current.actions);

    expect(screen.getByRole("button", { name: "Install" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View on GitHub" })).toHaveAttribute(
      "href",
      "https://example.com/repository",
    );

    expect(result.current).toEqual(
      expect.objectContaining({
        title: "Adyen",
        subtitle: "Developed by {developer}",
        description: "App description",
        isInstalled: false,
      }),
    );
  });

  it("should return correct values for installed extension", () => {
    const extension = {
      ...baseApp,
      installed: true,
      appId: "123",
    } as ExtensionData;
    const { result } = renderHook(() => useExtension(extension));

    render(result.current.actions);

    expect(screen.getByRole("link", { name: "View details" })).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toEqual(1);

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
