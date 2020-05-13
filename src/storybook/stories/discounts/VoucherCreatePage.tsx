import { DiscountErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import VoucherCreatePage, {
  FormData,
  VoucherCreatePageProps
} from "../../../discounts/components/VoucherCreatePage";
import Decorator from "../../Decorator";

const props: VoucherCreatePageProps = {
  defaultCurrency: "USD",
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default"
};

storiesOf("Views / Discounts / Voucher create", module)
  .addDecorator(Decorator)
  .add("default", () => <VoucherCreatePage {...props} />)
  .add("form errors", () => (
    <VoucherCreatePage
      {...props}
      errors={([
        "applyOncePerOrder",
        "code",
        "discountType",
        "endDate",
        "minSpent",
        "name",
        "startDate",
        "type",
        "usageLimit",
        "value"
      ] as Array<keyof FormData>).map(field => ({
        __typename: "DiscountError",
        code: DiscountErrorCode.INVALID,
        field
      }))}
    />
  ));
