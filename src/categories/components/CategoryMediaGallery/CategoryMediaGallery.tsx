import { categoryMediaUrl } from "@dashboard/categories/urls";
import { isMainSchema, useCategoryMediaQuery } from "@dashboard/graphql/staging";
import { EntityMediaGallery } from "@dashboard/media/components/EntityMediaGallery/EntityMediaGallery";

interface CategoryMediaGalleryProps {
  categoryId: string;
}

/** `Category.media` landed in 3.24, so the gallery is hidden on main-schema builds. */
export const CategoryMediaGallery = ({ categoryId }: CategoryMediaGalleryProps) => {
  const { data } = useCategoryMediaQuery({
    variables: { id: categoryId },
    skip: isMainSchema(),
  });

  if (isMainSchema()) {
    return null;
  }

  return (
    <EntityMediaGallery
      ownerId={categoryId}
      ownerTypename="Category"
      media={data?.category?.media}
      getMediaEditUrl={mediaId => categoryMediaUrl(categoryId, mediaId)}
    />
  );
};

CategoryMediaGallery.displayName = "CategoryMediaGallery";
