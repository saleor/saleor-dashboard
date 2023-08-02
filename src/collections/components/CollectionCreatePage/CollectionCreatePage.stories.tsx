// @ts-strict-ignore
import { channelsList } from "@dashboard/channels/fixtures";
import { createCollectionChannels } from "@dashboard/channels/utils";
import { CollectionErrorCode } from "@dashboard/graphql";
import React from "react";

import CollectionCreatePage, {
  CollectionCreatePageProps,
} from "./CollectionCreatePage";

const channels = createCollectionChannels(channelsList);

const props: Omit<CollectionCreatePageProps, "classes"> = {
  channelsCount: 2,
  channelsErrors: [],
  currentChannels: channels,
  disabled: false,
  errors: [],
  onChannelsChange: () => undefined,
  onSubmit: () => undefined,
  openChannelsModal: () => undefined,
  saveButtonBarState: "default",
};

export default {
  title: "Collections / Create collection",
};

export const Default = () => <CollectionCreatePage {...props} />;

export const Loading = () => (
  <CollectionCreatePage {...props} disabled={true} />
);

export const FormErrors = () => (
  <CollectionCreatePage
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
