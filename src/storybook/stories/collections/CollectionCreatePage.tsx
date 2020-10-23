import { Omit } from "@material-ui/core";
import { CollectionErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

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
          code: CollectionErrorCode.REQUIRED,
          field: "name"
        },
        {
          code: CollectionErrorCode.REQUIRED,
          field: "descriptionJson"
        }
      ].map(err => ({
        __typename: "CollectionError",
        ...err
      }))}
    />
  ));
