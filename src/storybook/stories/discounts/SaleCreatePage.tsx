import { storiesOf } from "@storybook/react";
import React from "react";

import { DiscountErrorCode } from "@saleor/types/globalTypes";
import SaleCreatePage, {
  SaleCreatePageProps
} from "../../../discounts/components/SaleCreatePage";
import Decorator from "../../Decorator";

const props: SaleCreatePageProps = {
  defaultCurrency: "USD",
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default"
};

storiesOf("Views / Discounts / Sale create", module)
  .addDecorator(Decorator)
  .add("default", () => <SaleCreatePage {...props} />)
  .add("loading", () => <SaleCreatePage {...props} disabled={true} />)
  .add("form errors", () => (
    <SaleCreatePage
      {...props}
      errors={["name", "startDate", "endDate", "value"].map(field => ({
        __typename: "DiscountError",
        code: DiscountErrorCode.INVALID,
        field
      }))}
    />
  ));
