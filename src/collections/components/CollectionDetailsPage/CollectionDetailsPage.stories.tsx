// @ts-strict-ignore
import placeholderCollectionImage from "@assets/images/block1.jpg";
import placeholderProductImage from "@assets/images/placeholder60x60.png";
import { createCollectionChannelsData } from "@dashboard/channels/utils";
import { collection as collectionFixture } from "@dashboard/collections/fixtures";
import { listActionsProps, pageListProps } from "@dashboard/fixtures";
import { CollectionErrorCode } from "@dashboard/graphql";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
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

export default {
  title: "Collections / Collection detailsCollection details",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <CollectionDetailsPage {...props} />;

export const Loading = () => (
  <CollectionDetailsPage {...props} collection={undefined} disabled={true} />
);

export const FormErrors = () => (
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
);

export const NoProducts = () => (
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
);
