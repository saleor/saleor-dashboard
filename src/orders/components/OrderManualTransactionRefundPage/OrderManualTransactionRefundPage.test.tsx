import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { mockResizeObserver } from "@dashboard/components/Datagrid/testUtils";
import {
  ModelsOfTypeDocument,
  OrderTransactionRequestActionDocument,
  TransactionActionEnum,
  TransactionItemFragment,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { OrderManualTransactionRefundPage } from "./OrderManualTransactionRefundPage";

jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn);
jest.mock("@dashboard/components/Savebar");

jest.mock("@dashboard/hooks/useNotifier", () => ({
  __esModule: true,
  default: jest.fn(() => () => undefined),
}));
mockResizeObserver();

const getWrapper = (mocks: MockedResponse[] = []) => {
  const WrapperComponent = ({ children }: { children: ReactNode }) => {
    return (
      // @ts-expect-error - old router
      <BrowserRouter>
        <MockedProvider mocks={mocks}>
          {/* @ts-expect-error - LegacyThemeProvider is not typed properly */}
          <LegacyThemeProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </LegacyThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );
  };

  return WrapperComponent;
};

describe("OrderManualTransactionRefundPage", () => {
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
            reason: "",
            reasonReferenceId: undefined,
          },
        },
        result: { data: { transactionRequestAction: { errors: [] } } },
      },
      {
        request: {
          query: ModelsOfTypeDocument,
          variables: {
            pageTypeId: "",
          },
        },
        result: { data: { pages: { edges: [] } } },
      },
    ];

    const transactions = [
      {
        id: "1",
        name: "Transaction 1",
        events: [],
        actions: [TransactionActionEnum.REFUND],
        chargedAmount: {
          amount: 20,
        },
      },
      {
        id: "2",
        name: "Transaction 2",
        events: [],
        actions: [TransactionActionEnum.REFUND],
        chargedAmount: {
          amount: 40,
        },
      },
    ] as unknown as TransactionItemFragment[];

    render(
      <OrderManualTransactionRefundPage
        currency="USD"
        loading={false}
        orderId="1"
        modelForRefundReasonRefId={null}
        transactions={transactions}
      />,
      { wrapper: getWrapper(mocks) },
    );
    // Act
    await userEvent.click(screen.getByRole("radio", { name: /Transaction 2/i }));
    await userEvent.type(screen.getByTestId("refund-amount"), "5");
    await userEvent.click(screen.getByRole("button", { name: "save" }));
    // Assert
    expect(mockNofitication).toHaveBeenCalledWith({
      status: "success",
      text: "Transaction action requested successfully",
    });
  });
  it("should fail validation when refund amount is higher than transaction charged amount", async () => {
    // Arrange
    const transactions = [
      {
        id: "1",
        name: "Transaction 1",
        events: [],
        actions: [TransactionActionEnum.REFUND],
        chargedAmount: {
          amount: 20,
        },
      },
    ] as unknown as TransactionItemFragment[];

    render(
      <OrderManualTransactionRefundPage
        currency="USD"
        modelForRefundReasonRefId={null}
        loading={false}
        orderId="1"
        transactions={transactions}
      />,
      { wrapper: getWrapper() },
    );

    // Act
    await userEvent.click(screen.getByRole("radio", { name: /Transaction 1/i }));
    await userEvent.type(screen.getByTestId("refund-amount"), "25");
    await userEvent.click(screen.getByRole("button", { name: "save" }));

    // Assert
    expect(
      screen.getByText("Provided amount cannot exceed charged amount for the selected transaction"),
    ).toBeInTheDocument();
  });
  it("should display skeleton when loading", async () => {
    // Arrange &&  Act
    render(
      <OrderManualTransactionRefundPage
        currency="USD"
        loading={true}
        modelForRefundReasonRefId={null}
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
