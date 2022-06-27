import { storiesOf } from "@storybook/react";
import React from "react";

import CustomerAddressDialog, {
  CustomerAddressDialogProps,
} from "../../../customers/components/CustomerAddressDialog";
import { customer } from "../../../customers/fixtures";
import { countries } from "../../../fixtures";
import Decorator from "../../Decorator";

const props: CustomerAddressDialogProps = {
  address: customer.addresses[0],
  confirmButtonState: "default",
  countries: countries.map(c => ({
    __typename: "CountryDisplay",
    code: c.code,
    country: c.name,
  })),
  errors: [],
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  variant: "create",
};

storiesOf("Customers / Address editing dialog", module)
  .addDecorator(Decorator)
  .add("default", () => <CustomerAddressDialog {...props} />)
  .add("edit", () => <CustomerAddressDialog {...props} variant="edit" />);
