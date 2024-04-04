import { mockResizeObserver } from "@dashboard/components/Datagrid/testUtils";
import {
  TransactionActionEnum,
  TransactionItemFragment,
} from "@dashboard/graphql";
import {
  SavebarProps,
  ThemeProvider as LegacyThemeProvider,
} from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { OrderManualTransationRefundPage } from "./OrderManualTransationRefundPage";

jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn);

jest.mock("@dashboard/components/Savebar", () => {
  const SavebarComponent = ({ onCancel, onSubmit, disabled }: SavebarProps) => (
    <div>
      <button onClick={onCancel}>cancel</button>
      <button disabled={disabled} onClick={onSubmit}>
        save
      </button>
    </div>
  );

  return SavebarComponent;
});

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => (
    <>{defaultMessage}</>
  ),
}));

mockResizeObserver();

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <LegacyThemeProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LegacyThemeProvider>
    </BrowserRouter>
  );
};

describe("OrderManualTransationRefundPage", () => {
  it("should select transaction, set amount and submit form", async () => {
    // Arrange
    const mockSubmit = jest.fn();
    const transactions = [
      {
        id: "1",
        name: "Transaction 1",
        events: [],
        actions: [TransactionActionEnum.REFUND],
      },
      {
        id: "2",
        name: "Transaction 2",
        events: [],
        actions: [TransactionActionEnum.REFUND],
      },
    ] as unknown as TransactionItemFragment[];

    render(
      <OrderManualTransationRefundPage
        currency="USD"
        loading={false}
        onSubmit={mockSubmit}
        orderId="1"
        submitStatus="default"
        transactions={transactions}
      />,
      { wrapper: Wrapper },
    );

    // Act
    await userEvent.click(screen.getByRole("radio", { name: "Transaction 2" }));
    await userEvent.type(screen.getByLabelText(/refund amount/i), "5");
    await userEvent.click(screen.getByRole("button", { name: "save" }));

    // Assert
    expect(mockSubmit).toHaveBeenCalledWith("2", 5);
  });

  it("should display info when not transactions and submit button disabled", async () => {
    // Arrange &&  Act
    render(
      <OrderManualTransationRefundPage
        currency="USD"
        loading={false}
        onSubmit={jest.fn()}
        orderId="1"
        submitStatus="default"
        transactions={[]}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(
      screen.getByText(/there are not transactions to refund/i),
    ).toBeInTheDocument();
  });

  it("should display info when not transactions", async () => {
    // Arrange &&  Act
    render(
      <OrderManualTransationRefundPage
        currency="USD"
        loading={false}
        onSubmit={jest.fn()}
        orderId="1"
        submitStatus="default"
        transactions={[]}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(
      screen.getByText(/there are not transactions to refund/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "save" })).toBeDisabled();
  });

  it("should display skeleton when loading", async () => {
    // Arrange &&  Act
    render(
      <OrderManualTransationRefundPage
        currency="USD"
        loading={true}
        onSubmit={jest.fn()}
        orderId="1"
        submitStatus="default"
        transactions={[]}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "save" })).toBeDisabled();
  });
});
