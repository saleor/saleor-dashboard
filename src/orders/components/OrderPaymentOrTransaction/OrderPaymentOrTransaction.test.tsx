// @ts-strict-ignore
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

jest.mock("@saleor/macaw-ui-next", () => ({
  useTheme: jest.fn(() => () => ({})),
  Divider: jest.fn(() => <></>),
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

jest.mock("react-router-dom", () => ({
  Link: jest.fn(({ to, ...props }) => <a href={to} {...props} />),
}));

jest.mock("@dashboard/featureFlags", () => ({
  useFlag: jest.fn(() => ({ enabled: false })),
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
    onRefundAdd: () => undefined,
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
