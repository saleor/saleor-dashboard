import {
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { ModelMediaStaging, useModelMediaQuery } from "@dashboard/graphql/staging";
import { EntityMediaDetailPage } from "@dashboard/media/components/EntityMediaDetailPage/EntityMediaDetailPage";
import { pageMediaUrl, pageUrl } from "@dashboard/modeling/urls";
import { useIntl } from "react-intl";

interface ModelMediaProps {
  modelId: string;
  mediaId: string;
}

const ModelMedia = ({ modelId, mediaId }: ModelMediaProps) => {
  const intl = useIntl();
  const { data, loading } = useModelMediaQuery({
    displayLoader: true,
    variables: { id: modelId },
  });

  return (
    <EntityMediaDetailPage
      ownerId={modelId}
      ownerTypename="Page"
      ownerName={data?.page?.title}
      ownerUrl={pageUrl(modelId)}
      ownerIcon={<TopNavDestinationIcon.modeling />}
      ownerListLabel={intl.formatMessage(topNavDestinationMessages.model)}
      media={data?.page?.media}
      mediaId={mediaId}
      loading={loading}
      refetchDocument={ModelMediaStaging}
      getMediaUrl={id => pageMediaUrl(modelId, id)}
    />
  );
};

export default ModelMedia;
