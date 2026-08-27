import { collectionMediaUrl, collectionUrl } from "@dashboard/collections/urls";
import {
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { CollectionMediaStaging, useCollectionMediaQuery } from "@dashboard/graphql/staging";
import { EntityMediaDetailPage } from "@dashboard/media/components/EntityMediaDetailPage/EntityMediaDetailPage";
import { useIntl } from "react-intl";

interface CollectionMediaProps {
  collectionId: string;
  mediaId: string;
}

const CollectionMedia = ({ collectionId, mediaId }: CollectionMediaProps) => {
  const intl = useIntl();
  const { data, loading } = useCollectionMediaQuery({
    displayLoader: true,
    variables: { id: collectionId },
  });

  return (
    <EntityMediaDetailPage
      ownerId={collectionId}
      ownerTypename="Collection"
      ownerName={data?.collection?.name}
      ownerUrl={collectionUrl(collectionId)}
      ownerIcon={<TopNavDestinationIcon.categories />}
      ownerListLabel={intl.formatMessage(topNavDestinationMessages.collection)}
      media={data?.collection?.media}
      mediaId={mediaId}
      loading={loading}
      refetchDocument={CollectionMediaStaging}
      getMediaUrl={id => collectionMediaUrl(collectionId, id)}
    />
  );
};

export default CollectionMedia;
