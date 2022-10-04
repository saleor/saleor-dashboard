import Decorator from "@saleor/storybook/Decorator";
import { mapNodeToChoice } from "@saleor/utils/maps";
import { storiesOf } from "@storybook/react";
import React from "react";

import { pageTypesList } from "../../fixtures";
import PageTypePickerDialog, {
  PageTypePickerDialogProps,
} from "./PageTypePickerDialog";

const pageTypes = mapNodeToChoice(pageTypesList);

const props: PageTypePickerDialogProps = {
  pageTypes,
  confirmButtonState: "default",
  fetchPageTypes: () => undefined,
  fetchMorePageTypes: {
    hasMore: false,
    loading: false,
    onFetchMore: () => undefined,
  },
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
};

storiesOf("Views / Pages / Page type dialog", module)
  .addDecorator(Decorator)
  .add("default", () => <PageTypePickerDialog {...props} />);
