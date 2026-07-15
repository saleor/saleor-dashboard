// @ts-strict-ignore
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
import { useIntl } from "react-intl";

import { ProductMediaDeleteDialog } from "../components/ProductMediaDeleteDialog/ProductMediaDeleteDialog";
import { ProductMediaMetadataDialog } from "../components/ProductMediaMetadataDialog/ProductMediaMetadataDialog";
import ProductMediaPage from "../components/ProductMediaPage";
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
      <ProductMediaDeleteDialog
        onClose={() => navigate(productImageUrl(productId, mediaId), { replace: true })}
        onConfirm={handleDelete}
        open={params.action === "remove"}
        isVideo={isVideo}
        confirmButtonState={deleteResult.status}
      />
    </>
  );
};

export default ProductImage;
