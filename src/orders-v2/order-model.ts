import { OrderDetailsFragment } from "@dashboard/graphql";

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
}
