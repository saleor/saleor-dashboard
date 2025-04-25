// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import {
  useProductMediaByIdQuery,
  useProductMediaDeleteMutation,
  useProductMediaUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductMediaPage from "../components/ProductMediaPage";
import { productImageUrl, ProductImageUrlQueryParams, productListUrl, productUrl } from "../urls";

interface ProductMediaProps {
  mediaId: string;
  productId: string;
  params: ProductImageUrlQueryParams;
}

export const ProductImage: React.FC<ProductMediaProps> = ({ mediaId, productId, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const handleBack = () => navigate(productUrl(productId));
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
          text: intl.formatMessage(commonMessages.savedChanges),
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
  const handleUpdate = (formData: { description: string }) => {
    updateImage({
      variables: {
        alt: formData.description,
        id: mediaId,
      },
    });
  };
  const mediaObj = data?.product?.mainImage;

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
        onSubmit={handleUpdate}
        saveButtonBarState={updateResult.status}
      />
      <ActionDialog
        onClose={() => navigate(productImageUrl(productId, mediaId), { replace: true })}
        onConfirm={handleDelete}
        open={params.action === "remove"}
        title={intl.formatMessage({
          id: "uCn/rd",
          defaultMessage: "Delete Image",
          description: "dialog header",
        })}
        variant="delete"
        confirmButtonState={deleteResult.status}
      >
        <FormattedMessage
          id="VEext+"
          defaultMessage="Are you sure you want to delete this image?"
        />
      </ActionDialog>
    </>
  );
};
export default ProductImage;
