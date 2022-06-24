import CentralPlacementDecorator from "@saleor/storybook/CentralPlacementDecorator";
import CommonDecorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import * as messages from "../../pageTypes/hooks/usePageTypeDelete/messages";
import TypeDeleteWarningDialog, {
  TypeBaseData,
  TypeDeleteWarningDialogProps,
} from "./TypeDeleteWarningDialog";

const props: TypeDeleteWarningDialogProps<TypeBaseData> = {
  ...messages,
  isOpen: true,
  onClose: () => undefined,
  onDelete: () => undefined,
  typesData: [{ id: "id-1", name: "Interesting Pages" }],
  isLoading: false,
  assignedItemsCount: 4,
  typesToDelete: ["id-1"],
  viewAssignedItemsUrl: "some-url",
  deleteButtonState: "default",
};

storiesOf("TypeDeleteWarningDialog.stories", module)
  .addDecorator(CommonDecorator)
  .addDecorator(CentralPlacementDecorator)
  .add("loading", () => <TypeDeleteWarningDialog {...props} isLoading={true} />)
  .add("single type no assigned items", () => (
    <TypeDeleteWarningDialog {...props} assignedItemsCount={0} />
  ))
  .add("single type some assigned items", () => (
    <TypeDeleteWarningDialog {...props} />
  ))
  .add("multiple type no assigned items", () => (
    <TypeDeleteWarningDialog {...props} assignedItemsCount={0} />
  ))
  .add("multiple types some assigned items", () => (
    <TypeDeleteWarningDialog {...props} typesToDelete={["id-1", "id-2"]} />
  ));
