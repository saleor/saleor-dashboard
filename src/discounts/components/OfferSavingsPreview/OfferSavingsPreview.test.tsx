import { Locale, RawLocaleProvider } from "@dashboard/components/Locale";
import { ThemeWrapper } from "@test/themeWrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";

import {
  OfferSavingsPreview,
  type OfferSavingsPreviewData,
  OfferSavingsPreviewView,
} from "./OfferSavingsPreview";

const mockLoadPreview = jest.fn();

jest.mock("@dashboard/graphql", () => ({
  usePromotionOfferSavingsPreviewLazyQuery: jest.fn(() => [
    mockLoadPreview,
    {
      called: false,
      loading: false,
      data: undefined,
      error: undefined,
    },
  ]),
}));

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <RawLocaleProvider value={{ locale: Locale.EN, setLocale: () => undefined }}>
    <ThemeWrapper>{children}</ThemeWrapper>
  </RawLocaleProvider>
);

const preview: OfferSavingsPreviewData = {
  __typename: "OfferSavingsPreview",
  offerCount: 1,
  channelCount: 1,
  offers: [
    {
      __typename: "OfferPreviewItem",
      productId: "UHJvZHVjdDox",
      productName: "Senior Backend Engineer - Berlin",
      channelSlug: "germany-jobs-marketplace",
      originalPrice: {
        __typename: "Money",
        amount: 999,
        currency: "EUR",
      },
      promotionalPrice: {
        __typename: "Money",
        amount: 799.2,
        currency: "EUR",
      },
      savingsAmount: {
        __typename: "Money",
        amount: 199.8,
        currency: "EUR",
      },
    },
  ],
  warnings: [],
};

const renderView = (
  props: Partial<React.ComponentProps<typeof OfferSavingsPreviewView>> = {},
): ReturnType<typeof render> => {
  const defaultProps: React.ComponentProps<typeof OfferSavingsPreviewView> = {
    called: true,
    loading: false,
    error: false,
    preview,
    promotionId: "UHJvbW90aW9uOjE=",
    onPreview: jest.fn(),
  };

  return render(<OfferSavingsPreviewView {...defaultProps} {...props} />, {
    wrapper: Wrapper,
  });
};

describe("OfferSavingsPreview", () => {
  it("renders the returned offer and Money values without deriving prices", () => {
    // Arrange & Act
    renderView();

    // Assert
    expect(screen.getByText("Senior Backend Engineer - Berlin")).toBeTruthy();
    expect(screen.getByText("Publication channel: {channelSlug}")).toBeTruthy();
    expect(screen.getByText("Standard listing price")).toBeTruthy();
    expect(screen.getByText("Campaign price")).toBeTruthy();
    expect(screen.getByText("Employer savings")).toBeTruthy();
    expect(screen.getAllByTestId("money-value").map(node => node.textContent)).toEqual([
      "EUR999.00",
      "EUR799.20",
      "EUR199.80",
    ]);
  });

  it("shows a loading state and disables repeated requests while loading", () => {
    // Arrange & Act
    renderView({ loading: true, preview: undefined });

    // Assert
    expect(screen.getByTestId("preview-loading")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Preview offer" })).toHaveProperty("disabled", true);
  });

  it("shows an informative empty state", () => {
    // Arrange
    const emptyPreview: OfferSavingsPreviewData = {
      ...preview,
      offerCount: 0,
      channelCount: 0,
      offers: [],
    };

    // Act
    renderView({ preview: emptyPreview });

    // Assert
    expect(screen.getByText("No matching offers")).toBeTruthy();
    expect(
      screen.getByText("No matching job advertisements are configured for this campaign."),
    ).toBeTruthy();
  });

  it("shows a retryable error state", () => {
    // Arrange & Act
    renderView({ error: true, preview: undefined });

    // Assert
    expect(screen.getByRole("alert").textContent).toContain(
      "We couldn't load the offer preview. Select Preview offer to try again.",
    );
    expect(screen.getByRole("button", { name: "Preview offer" })).toHaveProperty("disabled", false);
  });

  it("requests a fresh preview on every click", async () => {
    // Arrange
    mockLoadPreview.mockClear();
    render(<OfferSavingsPreview promotionId="UHJvbW90aW9uOjE=" />, { wrapper: Wrapper });

    // Act
    const button = screen.getByRole("button", { name: "Preview offer" });

    await userEvent.click(button);
    await userEvent.click(button);

    // Assert
    expect(mockLoadPreview).toHaveBeenCalledTimes(2);
    expect(mockLoadPreview).toHaveBeenNthCalledWith(1, {
      variables: { id: "UHJvbW90aW9uOjE=" },
    });
    expect(mockLoadPreview).toHaveBeenNthCalledWith(2, {
      variables: { id: "UHJvbW90aW9uOjE=" },
    });
  });
});
