import Decorator from "@saleor/storybook/Decorator";
import { taxClasses } from "@saleor/taxes/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import TaxClassesPage from "./TaxClassesPage";

const props = {
  taxClasses,
  selectedTaxClassId: taxClasses[0].id,
  handleTabChange: () => undefined,
  onSubmit: () => undefined,
  savebarState: "default" as const,
  disabled: false,
};

storiesOf("Views / Taxes / Tax classes view", module)
  .addDecorator(Decorator)
  .add("loading", () => <TaxClassesPage {...props} taxClasses={undefined} />)
  .add("default", () => <TaxClassesPage {...props} />);
