import DialogContentText from "@material-ui/core/DialogContentText";
import ActionDialog from "@saleor/components/ActionDialog";
import NotFoundPage from "@saleor/components/NotFoundPage";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ProductImagePage from "../components/ProductImagePage";
import {
  useProductImageDeleteMutation,
  useProductImageUpdateMutation
} from "../mutations";
import { useProductImageQuery } from "../queries";
import {
  productImageUrl,
  ProductImageUrlQueryParams,
  productListUrl,
  productUrl
} from "../urls";

interface ProductImageProps {
  imageId: string;
  productId: string;
  params: ProductImageUrlQueryParams;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  imageId,
  productId,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleBack = () => navigate(productUrl(productId));

  const { data, loading } = useProductImageQuery({
    displayLoader: true,
    variables: {
      imageId,
      productId
    }
  });

  const [updateImage, updateResult] = useProductImageUpdateMutation({
    onCompleted: data => {
      if (data.productImageUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
      }
    }
  });

  const [deleteImage, deleteResult] = useProductImageDeleteMutation({
    onCompleted: handleBack
  });

  const product = data?.product;

  if (product === null) {
    return <NotFoundPage onBack={() => navigate(productListUrl())} />;
  }

  const handleDelete = () => deleteImage({ variables: { id: imageId } });
  const handleImageClick = (id: string) => () =>
    navigate(productImageUrl(productId, id));
  const handleUpdate = (formData: { description: string }) => {
    updateImage({
      variables: {
        alt: formData.description,
        id: imageId
      }
    });
  };
  const image = data?.product?.mainImage;

  return (
    <>
      <ProductImagePage
        disabled={loading}
        product={data?.product?.name}
        image={image || null}
        images={data?.product?.images}
        onBack={handleBack}
        onDelete={() =>
          navigate(
            productImageUrl(productId, imageId, {
              action: "remove"
            })
          )
        }
        onRowClick={handleImageClick}
        onSubmit={handleUpdate}
        saveButtonBarState={updateResult.status}
      />
      <ActionDialog
        onClose={() => navigate(productImageUrl(productId, imageId), true)}
        onConfirm={handleDelete}
        open={params.action === "remove"}
        title={intl.formatMessage({
          defaultMessage: "Delete Image",
          description: "dialog header"
        })}
        variant="delete"
        confirmButtonState={deleteResult.status}
      >
        <DialogContentText>
          <FormattedMessage defaultMessage="Are you sure you want to delete this image?" />
        </DialogContentText>
      </ActionDialog>
    </>
  );
};
export default ProductImage;
