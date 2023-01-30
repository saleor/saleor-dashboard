import { useFlags } from "@dashboard/hooks/useFlags";
import {
  order,
  orderWithTransactions,
  shop,
  shopWithTransactions,
} from "@dashboard/orders/fixtures";
import { render, screen } from "@testing-library/react";
import React from "react";

import { OrderPaymentOrTransaction } from "./OrderPaymentOrTransaction";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn((x: any) => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: jest.fn(({ defaultMessage }) => defaultMessage),
}));

jest.mock("@saleor/macaw-ui", () => ({
  useTheme: jest.fn(() => () => ({})),
  useStyles: jest.fn(() => () => ({})),
  makeStyles: jest.fn(() => () => ({})),
  Pill: jest.fn(() => <></>),
  Button: jest.fn(() => <></>),
  ResponsiveTable: jest.fn(() => <></>),
}));

jest.mock("@dashboard/hooks/useFlags", () => ({
  useFlags: jest.fn(() => ({ orderTransactions: { enabled: false } })),
}));

jest.mock("react-router-dom", () => ({
  Link: jest.fn(({ to, ...props }) => <a href={to} {...props} />),
}));

const mockedUseFlags = useFlags as jest.MockedFunction<typeof useFlags>;

describe("OrderPaymentOrTransaction", () => {
  it("renders OrderPayment when transactions are disabled", () => {
    render(
      <OrderPaymentOrTransaction
        order={order(undefined)}
        shop={shop}
        onMarkAsPaid={() => undefined}
        onPaymentRefund={() => undefined}
        onAddManualTransaction={() => undefined}
        onPaymentPaid={() => undefined}
        onPaymentCapture={() => undefined}
        onTransactionAction={() => undefined}
        onPaymentVoid={() => undefined}
      />,
    );

    expect(screen.queryByTestId("OrderPayment")).toBeInTheDocument();
  });

  it("renders OrderTransaction when transactions are enabled", () => {
    mockedUseFlags.mockImplementationOnce(() => ({
      orderTransactions: { enabled: true, value: "true" },
    }));

    render(
      <OrderPaymentOrTransaction
        order={orderWithTransactions}
        shop={shopWithTransactions}
        onMarkAsPaid={() => undefined}
        onPaymentRefund={() => undefined}
        onAddManualTransaction={() => undefined}
        onPaymentPaid={() => undefined}
        onPaymentCapture={() => undefined}
        onTransactionAction={() => undefined}
        onPaymentVoid={() => undefined}
      />,
    );

    expect(screen.queryByTestId("OrderSummaryCard")).toBeInTheDocument();
  });
});
