import ErrorPage, { ErrorPageProps } from "@saleor/components/ErrorPage";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../Decorator";

const props: Omit<ErrorPageProps, "classes"> = {
  onBack: () => undefined,
  onRefresh: () => undefined,
};

storiesOf("Views / Error page", module)
  .addDecorator(Decorator)
  .add("default", () => <ErrorPage {...props} />)
  .add("with error id", () => (
    <ErrorPage {...props} id="LS5E4RahA4Dc+mNICEUKXPaVkOR1ChT=" />
  ));
