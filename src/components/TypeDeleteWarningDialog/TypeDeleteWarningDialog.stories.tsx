import CentralPlacementDecorator from "@saleor/storybook/CentralPlacementDecorator";
import CommonDecorator from "@saleor/storybook/Decorator";
import React from "react";

import * as messages from "../../pageTypes/hooks/usePageTypeDelete/messages";
import TypeDeleteWarningDialog, {
  TypeBaseData,
  TypeDeleteWarningDialogProps
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
  deleteButtonState: "default"
};

export default {
  title: "TypeDeleteWarningDialog.stories",
  decorators: [CommonDecorator, CentralPlacementDecorator]
};

export const Loading = () => (
  <TypeDeleteWarningDialog {...props} isLoading={true} />
);

Loading.story = {
  name: "loading"
};

export const SingleTypeNoAssignedItems = () => (
  <TypeDeleteWarningDialog {...props} assignedItemsCount={0} />
);

SingleTypeNoAssignedItems.story = {
  name: "single type no assigned items"
};

export const SingleTypeSomeAssignedItems = () => (
  <TypeDeleteWarningDialog {...props} />
);

SingleTypeSomeAssignedItems.story = {
  name: "single type some assigned items"
};

export const MultipleTypeNoAssignedItems = () => (
  <TypeDeleteWarningDialog {...props} assignedItemsCount={0} />
);

MultipleTypeNoAssignedItems.story = {
  name: "multiple type no assigned items"
};

export const MultipleTypesSomeAssignedItems = () => (
  <TypeDeleteWarningDialog {...props} typesToDelete={["id-1", "id-2"]} />
);

MultipleTypesSomeAssignedItems.story = {
  name: "multiple types some assigned items"
};
