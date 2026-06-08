// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import {
  ProductMediaType,
  useProductMediaByIdQuery,
  useProductMediaDeleteMutation,
  useProductMediaUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { ProductMediaMetadataDialog } from "../components/ProductMediaMetadataDialog/ProductMediaMetadataDialog";
import ProductMediaPage from "../components/ProductMediaPage";
import {
  productImageUrl,
  type ProductImageUrlDialog,
  type ProductImageUrlQueryParams,
  productListUrl,
  productUrl,
} from "../urls";

const messages = defineMessages({
  deleteImageTitle: {
    id: "uCn/rd",
    defaultMessage: "Delete Image",
    description: "dialog header",
  },
  deleteVideoTitle: {
    id: "dGlDp6",
    defaultMessage: "Delete Video",
    description: "product media delete dialog header",
  },
  deleteImageConfirmation: {
    id: "VEext+",
    defaultMessage: "Are you sure you want to delete this image?",
  },
  deleteVideoConfirmation: {
    id: "/uu/aV",
    defaultMessage: "Are you sure you want to delete this video?",
    description: "product media delete dialog content",
  },
});

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
          text: intl.formatMessage({
            id: "uOC/uQ",
            defaultMessage: "Image updated",
          }),
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
  const handleUpdate = (formData: { alt: string }) => {
    updateImage({
      variables: {
        alt: formData.alt,
        id: mediaId,
      },
    });
  };
  const mediaObj = data?.product?.mainImage;
  const isVideo = mediaObj?.type === ProductMediaType.VIDEO;

  return (
    <>
      <ProductMediaPage
        productId={productId}
        disabled={loading}
        product={data?.product?.name}
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
      <ProductMediaMetadataDialog
        open={params.action === "view-metadata" && !!mediaObj}
        onClose={closeModal}
        media={mediaObj}
      />
      <ActionDialog
        onClose={() => navigate(productImageUrl(productId, mediaId), { replace: true })}
        onConfirm={handleDelete}
        open={params.action === "remove"}
        title={intl.formatMessage(isVideo ? messages.deleteVideoTitle : messages.deleteImageTitle)}
        variant="delete"
        confirmButtonState={deleteResult.status}
      >
        <FormattedMessage
          {...(isVideo ? messages.deleteVideoConfirmation : messages.deleteImageConfirmation)}
        />
      </ActionDialog>
    </>
  );
};

export default ProductImage;
