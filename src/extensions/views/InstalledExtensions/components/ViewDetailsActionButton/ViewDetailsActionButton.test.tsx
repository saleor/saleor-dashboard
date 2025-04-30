import { AppTypeEnum } from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";
import React from "react";
import { FormattedMessageProps } from "react-intl";

import { ViewDetailsActionButton } from "./ViewDetailsActionButton";

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

describe("ViewDetailsActionButton", () => {
  it("should render disabled view details button when no id which mean app installation in progress", () => {
    // Arrange
    render(<ViewDetailsActionButton name="test" type={AppTypeEnum.THIRDPARTY} />);

    // Assert
    expect(screen.getByRole("button", { name: "View details" })).toBeInTheDocument();
  });

  it("should render disabled view button when is disabled", () => {
    // Arrange
    render(<ViewDetailsActionButton name="test" type={AppTypeEnum.THIRDPARTY} isDisabled />);

    // Assert
    expect(screen.getByRole("button", { name: "View details" })).toBeInTheDocument();
  });

  it("should render link to app details when type is THIRD PARTY and id is provided and is not disabled", () => {
    // Arrange
    render(<ViewDetailsActionButton name="test" type={AppTypeEnum.THIRDPARTY} id="123" />);

    // Assert
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute(
      "href",
      "/apps/123/app?",
    );
  });

  it("should render link to app details when type is LOCAL and id is provided and is not disabled", () => {
    // Arrange
    render(<ViewDetailsActionButton name="test" type={AppTypeEnum.LOCAL} id="123" />);

    // Assert
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute(
      "href",
      "/extensions/custom/123?",
    );
  });
});
