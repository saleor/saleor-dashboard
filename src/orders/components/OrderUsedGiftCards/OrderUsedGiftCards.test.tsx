import { OrderDetailsFragment } from "@dashboard/graphql";
import { ThemeWrapper } from "@test/themeWrapper";
import { render, screen } from "@testing-library/react";
import React, { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { messages } from "./messages";
import { OrderUsedGiftCards } from "./OrderUsedGiftCards";

const mockGiftCards = [
  {
    id: "1",
    last4CodeChars: "LTD2",
  },
  {
    id: "2",
    last4CodeChars: "FRTG",
  },
] as OrderDetailsFragment["giftCards"];

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
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
    expect(screen.getByRole("link", { name: "LTD2" })).toHaveAttribute("href", "/gift-cards/1");
    expect(screen.getByText(/LTD2/)).toBeInTheDocument();
  });

  it("should render multipe gift cards", () => {
    // Arrange & Act
    render(<OrderUsedGiftCards giftCards={[mockGiftCards[0], mockGiftCards[1]]} />, {
      wrapper: Wrapper,
    });

    // Assert
    expect(screen.getByText(/paid with gift card/i)).toBeInTheDocument();
    expect(screen.getByText(/LTD2/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LTD2," })).toHaveAttribute("href", "/gift-cards/1");
    expect(screen.getByText(/FRTG/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "FRTG" })).toHaveAttribute("href", "/gift-cards/2");
  });
});
