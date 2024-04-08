import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { mockResizeObserver } from "@dashboard/components/Datagrid/testUtils";
import {
  OrderTransactionRequestActionDocument,
  TransactionActionEnum,
  TransactionItemFragment,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
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

jest.mock("@dashboard/hooks/useNotifier", () => ({
  __esModule: true,
  default: jest.fn(() => () => undefined),
}));

mockResizeObserver();

const getWrapper = (mocks: MockedResponse[] = []) => {
  const WrapperComponent = ({ children }: { children: ReactNode }) => {
    return (
      <BrowserRouter>
        <MockedProvider mocks={mocks}>
          <LegacyThemeProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </LegacyThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );
  };

  return WrapperComponent;
};

describe("OrderManualTransationRefundPage", () => {
  it("should select transaction, set amount and submit form", async () => {
    // Arrange
    const mockNofitication = jest.fn();
    (useNotifier as jest.Mock).mockImplementation(() => mockNofitication);

    const mocks = [
      {
        request: {
          query: OrderTransactionRequestActionDocument,
          variables: {
            action: "REFUND",
            transactionId: "2",
            amount: 5,
          },
        },
        result: { data: { transactionRequestAction: { errors: [] } } },
      },
    ];

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
        orderId="1"
        transactions={transactions}
      />,
      { wrapper: getWrapper(mocks) },
    );

    // Act
    await userEvent.click(screen.getByRole("radio", { name: "Transaction 2" }));
    await userEvent.type(screen.getByLabelText(/refund amount/i), "5");
    await userEvent.click(screen.getByRole("button", { name: "save" }));

    // Assert
    expect(mockNofitication).toHaveBeenCalledWith({
      status: "success",
      text: "Transaction action requested successfully",
    });
  });

  it("should display skeleton when loading", async () => {
    // Arrange &&  Act
    render(
      <OrderManualTransationRefundPage
        currency="USD"
        loading={true}
        orderId="1"
        transactions={[]}
      />,
      { wrapper: getWrapper() },
    );

    // Assert
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "save" })).toBeDisabled();
  });
});
