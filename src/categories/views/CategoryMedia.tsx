import { categoryMediaUrl, categoryUrl } from "@dashboard/categories/urls";
import {
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { CategoryMediaStaging, useCategoryMediaQuery } from "@dashboard/graphql/staging";
import { EntityMediaDetailPage } from "@dashboard/media/components/EntityMediaDetailPage/EntityMediaDetailPage";
import { useIntl } from "react-intl";

interface CategoryMediaProps {
  categoryId: string;
  mediaId: string;
}

const CategoryMedia = ({ categoryId, mediaId }: CategoryMediaProps) => {
  const intl = useIntl();
  const { data, loading } = useCategoryMediaQuery({
    displayLoader: true,
    variables: { id: categoryId },
  });

  return (
    <EntityMediaDetailPage
      ownerId={categoryId}
      ownerTypename="Category"
      ownerName={data?.category?.name}
      ownerUrl={categoryUrl(categoryId)}
      ownerIcon={<TopNavDestinationIcon.categories />}
      ownerListLabel={intl.formatMessage(topNavDestinationMessages.category)}
      media={data?.category?.media}
      mediaId={mediaId}
      loading={loading}
      refetchDocument={CategoryMediaStaging}
      getMediaUrl={id => categoryMediaUrl(categoryId, id)}
    />
  );
};

export default CategoryMedia;
