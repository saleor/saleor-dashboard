import { isMainSchema, useModelMediaQuery } from "@dashboard/graphql/staging";
import { EntityMediaGallery } from "@dashboard/media/components/EntityMediaGallery/EntityMediaGallery";
import { pageMediaUrl } from "@dashboard/modeling/urls";

interface ModelMediaGalleryProps {
  modelId: string;
}

/** `Page.media` landed in 3.24, so the gallery is hidden on main-schema builds. */
export const ModelMediaGallery = ({ modelId }: ModelMediaGalleryProps) => {
  const { data } = useModelMediaQuery({
    variables: { id: modelId },
    skip: isMainSchema(),
  });

  if (isMainSchema()) {
    return null;
  }

  return (
    <EntityMediaGallery
      ownerId={modelId}
      ownerTypename="Page"
      media={data?.page?.media}
      getMediaEditUrl={mediaId => pageMediaUrl(modelId, mediaId)}
    />
  );
};

ModelMediaGallery.displayName = "ModelMediaGallery";
