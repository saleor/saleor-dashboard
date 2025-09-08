import { FulfillmentFragment, OrderDetailsFragment } from "@dashboard/graphql";

export class OrderModel {
  private order: OrderDetailsFragment;

  constructor(order: OrderDetailsFragment) {
    this.order = order;
  }

  shouldShowInvoiceList(): boolean {
    return this.order.status !== "UNCONFIRMED";
  }

  shouldShowCustomerNote(): boolean {
    return !!this.order.customerNote;
  }

  shouldShowFulfillments(): boolean {
    return this.order.fulfillments.length > 0;
  }

  shouldShowFulfillButton(): boolean {
    return this.order.status === "UNFULFILLED";
  }

  shouldShowFulfillmentTrackingNumberButton(fulfillment: FulfillmentFragment): boolean {
    return fulfillment.status === "FULFILLED";
  }
}
