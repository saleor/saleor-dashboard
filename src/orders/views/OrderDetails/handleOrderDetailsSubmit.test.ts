import { OrderErrorCode, OrderStatus } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import { type IntlShape } from "react-intl";

import { handleOrderDetailsSubmit } from "./handleOrderDetailsSubmit";

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
} as IntlShape;

describe("handleOrderDetailsSubmit", () => {
  const notify = jest.fn();
  const updateMetadata = jest.fn();
  const updatePrivateMetadata = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    updateMetadata.mockResolvedValue({ data: { updateMetadata: { errors: [] } } });
    updatePrivateMetadata.mockResolvedValue({
      data: { updatePrivateMetadata: { errors: [] } },
    });
  });

  it("confirms unconfirmed orders and returns confirm errors without updating metadata", async () => {
    // Arrange
    const order = OrderFixture.unconfirmed().build();
    const confirmError = {
      __typename: "OrderError" as const,
      code: OrderErrorCode.CANNOT_CANCEL_ORDER,
      field: null,
      message: "Cannot confirm",
      orderLines: null,
    };
    const orderConfirm = jest.fn().mockResolvedValue({
      data: {
        orderConfirm: {
          errors: [confirmError],
          order: null,
        },
      },
    });
    const formData = {
      [order.id]: {
        metadata: order.metadata,
        privateMetadata: order.privateMetadata,
      },
    };

    // Act
    const errors = await handleOrderDetailsSubmit({
      formData,
      intl,
      notify,
      order,
      orderConfirm,
      updateMetadata,
      updatePrivateMetadata,
    });

    // Assert
    expect(orderConfirm).toHaveBeenCalledWith({ variables: { id: order.id } });
    expect(errors).toEqual([confirmError]);
    expect(updateMetadata).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("does not notify about metadata when only confirming an order", async () => {
    // Arrange
    const order = OrderFixture.unconfirmed().build();
    const confirmedOrder = { ...order, status: OrderStatus.UNFULFILLED };
    const orderConfirm = jest.fn().mockResolvedValue({
      data: {
        orderConfirm: {
          errors: [],
          order: confirmedOrder,
        },
      },
    });
    const formData = {
      [order.id]: {
        metadata: order.metadata,
        privateMetadata: order.privateMetadata,
      },
    };

    // Act
    const errors = await handleOrderDetailsSubmit({
      formData,
      intl,
      notify,
      order,
      orderConfirm,
      updateMetadata,
      updatePrivateMetadata,
    });

    // Assert
    expect(errors).toEqual([]);
    expect(notify).not.toHaveBeenCalled();
  });

  it("skips order confirmation for non-unconfirmed orders", async () => {
    // Arrange
    const order = OrderFixture.unfulfilled().build();
    const orderConfirm = jest.fn();
    const formData = {
      [order.id]: {
        metadata: order.metadata,
        privateMetadata: order.privateMetadata,
      },
    };

    // Act
    await handleOrderDetailsSubmit({
      formData,
      intl,
      notify,
      order,
      orderConfirm,
      updateMetadata,
      updatePrivateMetadata,
    });

    // Assert
    expect(orderConfirm).not.toHaveBeenCalled();
  });
});
