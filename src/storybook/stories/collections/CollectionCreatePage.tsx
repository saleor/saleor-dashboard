import { Omit } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import React from "react";

import { ProductErrorCode } from "@saleor/types/globalTypes";
import CollectionCreatePage, {
  CollectionCreatePageProps
} from "../../../collections/components/CollectionCreatePage";
import Decorator from "../../Decorator";

const props: Omit<CollectionCreatePageProps, "classes"> = {
  disabled: false,
  errors: [],
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default"
};

storiesOf("Views / Collections / Create collection", module)
  .addDecorator(Decorator)
  .add("default", () => <CollectionCreatePage {...props} />)
  .add("loading", () => <CollectionCreatePage {...props} disabled={true} />)
  .add("form errors", () => (
    <CollectionCreatePage
      {...props}
      errors={[
        {
          code: ProductErrorCode.REQUIRED,
          field: "name"
        },
        {
          code: ProductErrorCode.REQUIRED,
          field: "descriptionJson"
        },
        {
          code: ProductErrorCode.INVALID,
          field: "publicationDate"
        },
        {
          code: ProductErrorCode.INVALID,
          field: "isPublished"
        }
      ].map(err => ({
        __typename: "ProductError",
        ...err
      }))}
    />
  ));
