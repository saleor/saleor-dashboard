import { render, screen } from "@testing-library/react";
import React from "react";
import { FormattedMessageProps } from "react-intl";

import { ExtensionData } from "../../types";
import { ExtensionItem } from "./ExtenionItem";

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

describe("Extensions / Components / ExtensionItem", () => {
  it("should render extension with actions", () => {
    // Arrange
    const extension = {
      type: "APP",
      kind: "OFFICIAL",
      name: "Avatax",
      id: "mirumee.avatax",
      logo: {
        light: "http://example.com",
        dark: "http://example.com",
      },
      repositoryUrl: "https://example.com/repo",
      manifestUrl: "https://example.com/manifest",
      description: {
        en: "Avatax description",
      },
    } as ExtensionData;

    render(<ExtensionItem extension={extension} />);

    // Assert
    expect(screen.getByText("Avatax")).toBeInTheDocument();
    expect(screen.getByText("Avatax description")).toBeInTheDocument();
    expect(screen.getByText("Developed by {developer}")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Install" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View on GitHub" })).toBeInTheDocument();
    expect(screen.queryByText("Installed")).not.toBeInTheDocument();
  });

  // TODO: uncomment when check installed logic will be ready
  // it("should render installed extension with actions", () => {
  //   // Arrange
  //   const extension = {
  //     type: "APP",
  //     kind: "OFFICIAL",
  //     name: "Avatax",
  //     id: "mirumee.avatax",
  //     logo: {
  //       light: "http://example.com",
  //       dark: "http://example.com",
  //     },
  //     repositoryUrl: "https://example.com/repo",
  //     manifestUrl: "https://example.com/manifest",
  //     description: {
  //       en: "Avatax description",
  //     },
  //   } as ExtensionData;
  //
  //   render(<ExtensionItem extension={extension} isInstalled={true} />);
  //
  //   // Assert
  //   expect(screen.getByText("Avatax")).toBeInTheDocument();
  //   expect(screen.getByText("Avatax description")).toBeInTheDocument();
  //   expect(screen.getByText("Developed by Saleor")).toBeInTheDocument();
  //   expect(screen.getByRole("link", { name: "Install" })).toBeInTheDocument();
  //   expect(screen.getByRole("link", { name: "View on GitHub" })).toBeInTheDocument();
  //   expect(screen.getByText("Installed")).toBeInTheDocument();
  // });
});
