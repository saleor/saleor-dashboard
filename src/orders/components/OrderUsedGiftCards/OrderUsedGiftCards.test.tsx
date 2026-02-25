import { type OrderDetailsFragment } from "@dashboard/graphql";
import { ThemeWrapper } from "@test/themeWrapper";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { messages } from "./messages";
import { OrderUsedGiftCards } from "./OrderUsedGiftCards";

const mockGiftCards = [
  {
    __typename: "GiftCardApplied" as const,
    giftCard: { __typename: "GiftCard" as const, id: "1", last4CodeChars: "LTD2" },
    amount: { __typename: "Money" as const, amount: 50, currency: "USD" },
  },
  {
    __typename: "GiftCardApplied" as const,
    giftCard: { __typename: "GiftCard" as const, id: "2", last4CodeChars: "FRTG" },
    amount: { __typename: "Money" as const, amount: 50, currency: "USD" },
  },
] satisfies OrderDetailsFragment["giftCardsApplied"];

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    // @ts-expect-error - legacy provider
    <BrowserRouter>
      <ThemeWrapper>
        <IntlProvider
          locale="EN"
          messages={{
            paidWithGiftCard: messages.usedGiftCard.defaultMessage,
          }}
        >
          {children}
        </IntlProvider>
      </ThemeWrapper>
    </BrowserRouter>
  );
};

describe("OrderUsedGiftCards", () => {
  it("should render single gift card", () => {
    // Arrange & Act
    render(<OrderUsedGiftCards giftCards={[mockGiftCards[0]]} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByText(/paid with gift card/i)).toBeInTheDocument();
    expect(screen.getByText(/{link}/)).toBeInTheDocument();
  });

  it("should render multipe gift cards", () => {
    // Arrange & Act
    render(<OrderUsedGiftCards giftCards={[mockGiftCards[0], mockGiftCards[1]]} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByText(/paid with gift card/i)).toBeInTheDocument();
    expect(screen.getByText(/{link}/)).toBeInTheDocument();
  });
});
