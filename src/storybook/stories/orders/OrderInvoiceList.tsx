import OrderInvoiceList, {
  OrderInvoiceListProps
} from "@saleor/orders/components/OrderInvoiceList";
import { storiesOf } from "@storybook/react";
import React from "react";

import { invoices } from "../../../orders/fixtures";
import Decorator from "../../Decorator";

const props: OrderInvoiceListProps = {
  invoices: undefined,
  onInvoiceClick: () => undefined,
  onInvoiceGenerate: () => undefined,
  onInvoiceSend: () => undefined
};

storiesOf("Orders / OrderInvoiceList", module)
  .addDecorator(Decorator)
  .add("with invoices", () => (
    <OrderInvoiceList {...props} invoices={invoices} />
  ))
  .add("without invoices", () => <OrderInvoiceList {...props} invoices={[]} />)
  .add("loading", () => <OrderInvoiceList {...props} />);
