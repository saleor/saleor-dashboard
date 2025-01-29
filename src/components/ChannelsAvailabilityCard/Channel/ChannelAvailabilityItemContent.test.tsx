import { render, screen } from "@testing-library/react";
import React from "react";

import { ChannelAvailabilityItemContent } from "./ChannelAvailabilityItemContent";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: any }) => <>{defaultMessage}</>,
}));

jest.mock("@dashboard/hooks/useCurrentDate", () => jest.fn(() => new Date("2024-01-01").getTime()));
jest.mock("@dashboard/hooks/useDateLocalize", () => jest.fn(() => jest.fn(date => date)));

const mockData = {
  id: "123",
  name: "Test Channel",
  isPublished: true,
  publishedAt: "2024-01-01",
  visibleInListings: true,
  isAvailableForPurchase: true,
  availableForPurchaseAt: "2024-01-01",
};

const mockMessages = {
  visibleLabel: "Visible",
  hiddenLabel: "Hidden",
  visibleSecondLabel: "Visible since",
  hiddenSecondLabel: "Will become visible on",
  availableLabel: "Available",
  unavailableLabel: "Unavailable",
  availableSecondLabel: "Will become available on",
  setAvailabilityDateLabel: "Set availability date",
};

const defaultProps = {
  data: mockData,
  errors: [],
  messages: mockMessages,
  onChange: jest.fn(),
};

describe("ChannelAvailabilityItemContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows publication date field when isPublished is true", () => {
    // Arrange & Act
    render(<ChannelAvailabilityItemContent {...defaultProps} />);

    // Assert
    const publishedRadio = screen.getByLabelText("Visible");
    const publishedDateInput = screen.getByRole("input", { name: "Date" });

    expect(publishedRadio).toHaveValue("true");
    expect(publishedDateInput).toBeInTheDocument();
  });

  it("hides publication date field when isPublished is false", () => {
    // Arrange & Act
    render(
      <ChannelAvailabilityItemContent
        {...defaultProps}
        data={{ ...mockData, isPublished: false }}
      />,
    );

    // Assert
    const hiddenRadio = screen.getByLabelText("Hidden");

    expect(hiddenRadio).toBeInTheDocument();
    expect(screen.queryByText("Visible since")).not.toBeInTheDocument();
  });

  it("shows availability controls when hasAvailableProps is true", () => {
    // Arrange & Act
    render(<ChannelAvailabilityItemContent {...defaultProps} />);

    // Assert
    expect(screen.getByLabelText("Available")).toBeInTheDocument();
    expect(screen.getByLabelText("Unavailable")).toBeInTheDocument();
  });

  it("hides availability controls when hasAvailableProps is false", () => {
    // Arrange & Act
    render(
      <ChannelAvailabilityItemContent
        {...defaultProps}
        data={{
          ...mockData,
          isAvailableForPurchase: undefined,
          availableForPurchaseAt: undefined,
        }}
      />,
    );

    // Assert
    expect(screen.queryByLabelText("Available")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Unavailable")).not.toBeInTheDocument();
  });

  it("shows visibility in listings controls when visibleInListings is defined", () => {
    // Arrange & Act
    render(<ChannelAvailabilityItemContent {...defaultProps} />);

    // Assert
    expect(screen.getByTestId("channel:visibleInListings:123")).toBeInTheDocument();
  });

  it("hides visibility in listings controls when visibleInListings is undefined", () => {
    // Arrange & Act
    render(
      <ChannelAvailabilityItemContent
        {...defaultProps}
        data={{ ...mockData, visibleInListings: undefined }}
      />,
    );

    // Assert
    expect(screen.queryByTestId("channel:visibleInListings:123")).not.toBeInTheDocument();
  });
});
