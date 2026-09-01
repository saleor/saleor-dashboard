import { collectionMediaUrl } from "@dashboard/collections/urls";
import { isMainSchema, useCollectionMediaQuery } from "@dashboard/graphql/staging";
import { EntityMediaGallery } from "@dashboard/media/components/EntityMediaGallery/EntityMediaGallery";

interface CollectionMediaGalleryProps {
  collectionId: string;
}

/** `Collection.media` landed in 3.24, so the gallery is hidden on main-schema builds. */
export const CollectionMediaGallery = ({ collectionId }: CollectionMediaGalleryProps) => {
  const { data } = useCollectionMediaQuery({
    variables: { id: collectionId },
    skip: isMainSchema(),
  });

  if (isMainSchema()) {
    return null;
  }

  return (
    <EntityMediaGallery
      ownerId={collectionId}
      ownerTypename="Collection"
      media={data?.collection?.media}
      getMediaEditUrl={mediaId => collectionMediaUrl(collectionId, mediaId)}
    />
  );
};

CollectionMediaGallery.displayName = "CollectionMediaGallery";
