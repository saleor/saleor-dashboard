import { channelsList } from "@dashboard/channels/fixtures";
import { channelUsabilityData, order } from "@dashboard/orders/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import * as React from "react";

import OrderDraftAlert, { OrderDraftAlertProps } from "./OrderDraftAlert";

describe("OrderDraftAlert", () => {
  const alertProps: OrderDraftAlertProps = {
    order: order("--url--"),
    channelUsabilityData: channelUsabilityData,
  };

  it("doesn't render when there are no alerts", () => {
    render(
      <Wrapper>
        <OrderDraftAlert {...alertProps} data-test-id="draft-alert" />
      </Wrapper>,
    );

    expect(screen.queryByTestId("draft-alert")).toBeNull();
  });

  it("renders inactive channel alert", () => {
    render(
      <Wrapper>
        <OrderDraftAlert
          {...alertProps}
          order={{ ...order("--url--"), channel: { ...channelsList[0], isActive: false } }}
          data-test-id="draft-alert"
        />
      </Wrapper>,
    );

    expect(screen.getByText("Orders cannot be placed in an inactive channel.")).toBeInTheDocument();
  });

  it("renders no products in channel alert", () => {
    render(
      <Wrapper>
        <OrderDraftAlert
          {...alertProps}
          channelUsabilityData={{
            ...channelUsabilityData,
            products: { totalCount: 0, __typename: "ProductCountableConnection" },
          }}
          data-test-id="draft-alert"
        />
      </Wrapper>,
    );

    expect(
      screen.getByText("There are no available products in this channel."),
    ).toBeInTheDocument();
  });

  it("renders no shipping methods in channel alert", () => {
    render(
      <Wrapper>
        <OrderDraftAlert
          {...alertProps}
          order={{
            ...order("--url--"),
            shippingMethods: [],
          }}
          data-test-id="draft-alert"
        />
      </Wrapper>,
    );

    expect(
      screen.getByText(
        /Wyspy Salomona is not available as a shipping destination for this channel, check/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "shipping zones configuration" })).toBeInTheDocument();
  });
});
