import { countries } from "@saleor/orders/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { taxClasses } from "@saleor/taxes/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import TaxClassesPage from "./TaxClassesPage";

const props = {
  taxClasses,
  countryNames: countries,
  selectedTaxClassId: taxClasses[0].id,
  handleTabChange: () => undefined
};

storiesOf("Views / Taxes / Tax classes view", module)
  .addDecorator(Decorator)
  .add("loading", () => <TaxClassesPage {...props} taxClasses={undefined} />)
  .add("default", () => <TaxClassesPage {...props} />);
