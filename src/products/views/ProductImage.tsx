import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getMutationState, maybe } from "../../misc";
import ProductImagePage from "../components/ProductImagePage";
import {
  TypedProductImageDeleteMutation,
  TypedProductImageUpdateMutation
} from "../mutations";
import { TypedProductImageQuery } from "../queries";
import { ProductImageUpdate } from "../types/ProductImageUpdate";
import {
  productImageUrl,
  ProductImageUrlQueryParams,
  productUrl
} from "../urls";

interface ProductImageProps {
  imageId: string;
  productId: string;
  params: ProductImageUrlQueryParams;
}

export const ProductImage: React.StatelessComponent<ProductImageProps> = ({
  imageId,
  productId,
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleBack = () => navigate(productUrl(productId));
  const handleUpdateSuccess = (data: ProductImageUpdate) => {
    if (data.productImageUpdate.errors.length === 0) {
      notify({ text: "Saved changes" });
    }
  };
  return (
    <TypedProductImageQuery
      displayLoader
      variables={{
        imageId,
        productId
      }}
      require={["product"]}
    >
      {({ data, loading }) => {
        return (
          <TypedProductImageUpdateMutation onCompleted={handleUpdateSuccess}>
            {(updateImage, updateResult) => (
              <TypedProductImageDeleteMutation onCompleted={handleBack}>
                {(deleteImage, deleteResult) => {
                  const handleDelete = () =>
                    deleteImage({ variables: { id: imageId } });
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
                  const image = data && data.product && data.product.mainImage;

                  const formTransitionState = getMutationState(
                    updateResult.called,
                    updateResult.loading,
                    maybe(() => updateResult.data.productImageUpdate.errors)
                  );
                  const deleteTransitionState = getMutationState(
                    deleteResult.called,
                    deleteResult.loading,
                    []
                  );
                  return (
                    <>
                      <ProductImagePage
                        disabled={loading}
                        product={maybe(() => data.product.name)}
                        image={image || null}
                        images={maybe(() => data.product.images)}
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
                        saveButtonBarState={formTransitionState}
                      />
                      <ActionDialog
                        onClose={() =>
                          navigate(productImageUrl(productId, imageId), true)
                        }
                        onConfirm={handleDelete}
                        open={params.action === "remove"}
                        title={intl.formatMessage({
                          defaultMessage: "Remove Image",
                          description: "dialog header"
                        })}
                        variant="delete"
                        confirmButtonState={deleteTransitionState}
                      >
                        <DialogContentText>
                          <FormattedMessage defaultMessage="Are you sure you want to remove this image?" />
                        </DialogContentText>
                      </ActionDialog>
                    </>
                  );
                }}
              </TypedProductImageDeleteMutation>
            )}
          </TypedProductImageUpdateMutation>
        );
      }}
    </TypedProductImageQuery>
  );
};
export default ProductImage;
