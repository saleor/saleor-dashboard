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

describe("Extensions / ExtensionItem / useExtension", () => {
  it("should return correct values for not installed plugin", () => {
    const extension = {
      type: "PLUGIN",
      name: "Braintreee",
      id: "mirumee.braintree",
      logo: {
        light: "plugin-logo.png",
      },
    } as ExtensionData;

    const { result } = renderHook(() => useExtension(extension));

    render(result.current.actions);

    expect(screen.getByRole("link", { name: "Install" })).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toEqual(1);

    expect(result.current).toEqual(
      expect.objectContaining({
        title: "Braintreee",
        subtitle: "Developed by {developer}",
        description: "Plugin built-in to Saleor’s core codebase",
        isInstalled: false,
      }),
    );
  });

  it("should return correct values for installed plugin", () => {
    const extension = {
      type: "PLUGIN",
      name: "Braintreee",
      id: "mirumee.braintree",
      logo: {
        light: "plugin-logo.png",
      },
    } as ExtensionData;

    const { result } = renderHook(() => useExtension(extension, true));

    render(result.current.actions);

    expect(screen.getByRole("link", { name: "View details" })).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toEqual(1);

    expect(result.current).toEqual(
      expect.objectContaining({
        title: "Braintreee",
        subtitle: "Developed by {developer}",
        description: "Plugin built-in to Saleor’s core codebase",
        isInstalled: true,
      }),
    );
  });

  it("should return correct values for not installed extension", () => {
    const extension = {
      type: "APP",
      kind: "OFFICIAL",
      name: "Adyen",
      description: {
        en: "App description",
      },
      logo: {
        light: "other-logo.png",
      },
      manifestUrl: "https://example.com/manifest",
      repositoryUrl: "https://example.com/repository",
    } as ExtensionData;
    const { result } = renderHook(() => useExtension(extension));

    render(result.current.actions);

    expect(screen.getByRole("link", { name: "Install" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View on GitHub" })).toHaveAttribute(
      "href",
      "https://example.com/repository",
    );
    expect(screen.getAllByRole("link").length).toEqual(2);

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
      type: "APP",
      kind: "OFFICIAL",
      name: "Adyen",
      description: {
        en: "App description",
      },
      logo: {
        light: "other-logo.png",
      },
      manifestUrl: "https://example.com/manifest",
      repositoryUrl: "https://example.com/repository",
    } as ExtensionData;
    const { result } = renderHook(() => useExtension(extension, true));

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
