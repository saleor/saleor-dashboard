import { MarkAsPaidStrategyEnum } from "@dashboard/graphql";
import {
  order as orderFixture,
  payments,
  shop,
} from "@dashboard/orders/fixtures";
import { render, screen } from "@testing-library/react";
import React from "react";

import {
  OrderPaymentOrTransaction,
  OrderPaymentOrTransactionProps,
} from "./OrderPaymentOrTransaction";

vi.mock("react-intl", () => ({
  useIntl: vi.fn(() => ({
    formatMessage: vi.fn((x: any) => x.defaultMessage),
  })),
  defineMessages: vi.fn(x => x),
  FormattedMessage: vi.fn(({ defaultMessage }) => defaultMessage),
}));

vi.mock("@saleor/macaw-ui", () => ({
  useTheme: vi.fn(() => () => ({})),
  useStyles: vi.fn(() => () => ({})),
  makeStyles: vi.fn(() => () => ({})),
  Pill: vi.fn(() => <></>),
  Button: vi.fn(() => <></>),
  ResponsiveTable: vi.fn(() => <></>),
}));

vi.mock("@saleor/macaw-ui/next", () => ({
  useTheme: vi.fn(() => () => ({})),
  Divider: vi.fn(() => <></>),
  vars: {
    colors: {
      border: {
        naturalPlain: "",
      },
      background: {
        surfaceCriticalDepressed: "",
        surfaceBrandDepressed: "",
        decorativeSurfaceSubdued2: "",
        surfaceBrandSubdued: "",
      },
    },
  },
}));

vi.mock("react-router-dom", () => ({
  Link: vi.fn(({ to, ...props }) => <a href={to} {...props} />),
}));

describe("OrderPaymentOrTransaction", () => {
  const order = orderFixture(undefined);
  const sharedProps = {
    order,
    shop,
    onMarkAsPaid: () => undefined,
    onPaymentRefund: () => undefined,
    onAddManualTransaction: () => undefined,
    onPaymentCapture: () => undefined,
    onTransactionAction: () => undefined,
    onPaymentVoid: () => undefined,
  } as OrderPaymentOrTransactionProps;

  it("renders OrderPayment when transactions are disabled in channel", () => {
    render(
      <OrderPaymentOrTransaction
        {...sharedProps}
        order={{
          ...order,
          transactions: [],
          payments: [],
          channel: {
            ...order.channel,
            orderSettings: {
              markAsPaidStrategy: MarkAsPaidStrategyEnum.PAYMENT_FLOW,
              __typename: "OrderSettings",
            },
          },
        }}
      />,
    );

    expect(screen.queryByTestId("OrderPayment")).toBeInTheDocument();
  });

  it("renders OrderPayment when payments are used in order", () => {
    render(
      <OrderPaymentOrTransaction
        {...sharedProps}
        order={{
          ...order,
          transactions: [],
          payments: [payments.pending],
        }}
      />,
    );

    expect(screen.queryByTestId("OrderPayment")).toBeInTheDocument();
  });

  it("renders OrderTransaction when transactions are enabled in channel", () => {
    render(
      <OrderPaymentOrTransaction
        {...sharedProps}
        order={{
          ...order,
          transactions: [],
        }}
      />,
    );

    expect(screen.queryByTestId("OrderSummaryCard")).toBeInTheDocument();
  });

  it("renders OrderTransaction when transactions are used in order", () => {
    render(<OrderPaymentOrTransaction {...sharedProps} />);

    expect(screen.queryByTestId("OrderSummaryCard")).toBeInTheDocument();
  });
});
