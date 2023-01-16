import placeholderCollectionImage from "@assets/images/block1.jpg";
import placeholderProductImage from "@assets/images/placeholder60x60.png";
import { createCollectionChannelsData } from "@dashboard/channels/utils";
import { collection as collectionFixture } from "@dashboard/collections/fixtures";
import { listActionsProps, pageListProps } from "@dashboard/fixtures";
import { CollectionErrorCode } from "@dashboard/graphql";
import Decorator from "@dashboard/storybook/Decorator";
import { PaginatorContextDecorator } from "@dashboard/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import CollectionDetailsPage, {
  CollectionDetailsPageProps,
} from "./CollectionDetailsPage";

const collection = collectionFixture(
  placeholderCollectionImage,
  placeholderProductImage,
);
const channels = createCollectionChannelsData(collection);

const props: Omit<CollectionDetailsPageProps, "classes"> = {
  ...listActionsProps,
  ...pageListProps.default,
  channelsCount: 2,
  channelsErrors: [],
  collection,
  currentChannels: channels,
  disabled: false,
  errors: [],
  onChannelsChange: () => undefined,
  onCollectionRemove: () => undefined,
  onImageDelete: () => undefined,
  onImageUpload: () => undefined,
  onProductUnassign: () => undefined,
  onSubmit: () => undefined,
  openChannelsModal: () => undefined,
  saveButtonBarState: "default",
  selectedChannelId: "123",
};

storiesOf("Collections / Collection detailsCollection details", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <CollectionDetailsPage {...props} />)
  .add("loading", () => (
    <CollectionDetailsPage {...props} collection={undefined} disabled={true} />
  ))
  .add("form errors", () => (
    <CollectionDetailsPage
      {...props}
      errors={[
        {
          code: CollectionErrorCode.REQUIRED,
          field: "name",
          message: "Collection field name required",
        },
        {
          code: CollectionErrorCode.REQUIRED,
          field: "description",
          message: "Collection field description required",
        },
      ].map(err => ({
        __typename: "CollectionError",
        ...err,
      }))}
    />
  ))
  .add("no products", () => (
    <CollectionDetailsPage
      {...props}
      collection={{
        ...collection,
        products: {
          ...collection.products,
          edges: [],
        },
      }}
    />
  ));
