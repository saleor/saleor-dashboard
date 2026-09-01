// @ts-strict-ignore
import {
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { MediaDeleteDialog } from "@dashboard/components/MediaDeleteDialog/MediaDeleteDialog";
import { MediaDetailPage } from "@dashboard/components/MediaDetailPage/MediaDetailPage";
import { MediaMetadataDialog } from "@dashboard/components/MediaMetadataDialog/MediaMetadataDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage/NotFoundPage";
import {
  ProductMediaByIdDocument,
  ProductMediaType,
  useProductMediaByIdQuery,
  useProductMediaDeleteMutation,
  useProductMediaUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { mediaMessages } from "@dashboard/media/messages";
import { rippleProductMediaMetadata } from "@dashboard/products/ripples/productMediaMetadata";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useIntl } from "react-intl";

import {
  productImageUrl,
  type ProductImageUrlDialog,
  type ProductImageUrlQueryParams,
  productListUrl,
  productUrl,
} from "../urls";

interface ProductMediaProps {
  mediaId: string;
  productId: string;
  params: ProductImageUrlQueryParams;
}

const ProductImage = ({ mediaId, productId, params }: ProductMediaProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const handleBack = () => navigate(productUrl(productId));
  const [openModal, closeModal] = createDialogActionHandlers<
    ProductImageUrlDialog,
    ProductImageUrlQueryParams
  >(navigate, params => productImageUrl(productId, mediaId, params), params);
  const { data, loading } = useProductMediaByIdQuery({
    displayLoader: true,
    variables: {
      mediaId,
      productId,
    },
  });
  const [updateImage, updateResult] = useProductMediaUpdateMutation({
    onCompleted: data => {
      if (data.productMediaUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(mediaMessages.mediaUpdateSuccess),
        });
      }
    },
  });
  const [deleteImage, deleteResult] = useProductMediaDeleteMutation({
    onCompleted: handleBack,
  });
  const product = data?.product;

  if (product === null) {
    return <NotFoundPage onBack={() => navigate(productListUrl())} />;
  }

  const handleDelete = () => deleteImage({ variables: { id: mediaId } });
  const handleImageClick = (id: string) => () => navigate(productImageUrl(productId, id));
  const handleUpdate = async (formData: { alt: string }) => {
    const result = await updateImage({
      variables: {
        alt: formData.alt,
        id: mediaId,
      },
    });

    return result.data?.productMediaUpdate.errors ?? [];
  };
  const mediaObj = data?.product?.mainImage;
  const isVideo = mediaObj?.type === ProductMediaType.VIDEO;

  return (
    <>
      <MediaDetailPage
        ownerUrl={productUrl(productId)}
        ownerIcon={<TopNavDestinationIcon.products />}
        ownerListLabel={intl.formatMessage(topNavDestinationMessages.product)}
        metadataRipple={rippleProductMediaMetadata}
        disabled={loading}
        ownerName={data?.product?.name}
        mediaObj={mediaObj || null}
        media={data?.product?.media}
        onDelete={() =>
          navigate(
            productImageUrl(productId, mediaId, {
              action: "remove",
            }),
          )
        }
        onRowClick={handleImageClick}
        onShowMetadata={() => openModal("view-metadata")}
        onSubmit={handleUpdate}
        saveButtonBarState={updateResult.status}
      />
      <MediaMetadataDialog
        open={params.action === "view-metadata" && !!mediaObj}
        onClose={closeModal}
        media={mediaObj}
        refetchDocument={ProductMediaByIdDocument}
      />
      <MediaDeleteDialog
        onClose={() => navigate(productImageUrl(productId, mediaId), { replace: true })}
        onConfirm={handleDelete}
        open={params.action === "remove"}
        quantity={1}
        isVideo={isVideo}
        confirmButtonState={deleteResult.status}
      />
    </>
  );
};

export default ProductImage;
