import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { ProductTypeKindEnum } from "@saleor/types/globalTypes";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";

import { getMutationErrors, maybe } from "../../misc";
import ProductTypeCreatePage, {
  ProductTypeForm
} from "../components/ProductTypeCreatePage";
import { TypedProductTypeCreateMutation } from "../mutations";
import { TypedProductTypeCreateDataQuery } from "../queries";
import { ProductTypeCreate as ProductTypeCreateMutation } from "../types/ProductTypeCreate";
import {
  productTypeAddUrl,
  ProductTypeAddUrlQueryParams,
  productTypeListUrl,
  productTypeUrl
} from "../urls";

interface ProductTypeCreateProps {
  params: ProductTypeAddUrlQueryParams;
}

export const ProductTypeCreate: React.FC<ProductTypeCreateProps> = ({
  params
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const handleCreateSuccess = (updateData: ProductTypeCreateMutation) => {
    if (updateData.productTypeCreate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Successfully created product type"
        })
      });
      navigate(productTypeUrl(updateData.productTypeCreate.productType.id));
    }
  };

  const handleChangeKind = (kind: ProductTypeKindEnum) =>
    navigate(
      productTypeAddUrl({
        ...params,
        kind
      })
    );

  return (
    <TypedProductTypeCreateMutation onCompleted={handleCreateSuccess}>
      {(createProductType, createProductTypeOpts) => {
        const handleCreate = async (formData: ProductTypeForm) => {
          const result = await createProductType({
            variables: {
              input: {
                hasVariants: false,
                isShippingRequired: formData.isShippingRequired,
                name: formData.name,
                kind: formData.kind,
                taxCode: formData.taxType,
                weight: formData.weight
              }
            }
          });

          return {
            id: result.data?.productTypeCreate.productType?.id || null,
            errors: getMutationErrors(result)
          };
        };

        const handleSubmit = createMetadataCreateHandler(
          handleCreate,
          updateMetadata,
          updatePrivateMetadata
        );

        return (
          <TypedProductTypeCreateDataQuery displayLoader>
            {({ data, loading }) => (
              <>
                <WindowTitle
                  title={intl.formatMessage({
                    defaultMessage: "Create Product Type",
                    description: "window title",
                    id: "productTypeCreateHeader"
                  })}
                />
                <ProductTypeCreatePage
                  defaultWeightUnit={maybe(() => data.shop.defaultWeightUnit)}
                  disabled={loading}
                  errors={
                    createProductTypeOpts.data?.productTypeCreate.errors || []
                  }
                  pageTitle={intl.formatMessage({
                    defaultMessage: "Create Product Type",
                    description: "header",
                    id: "productTypeCreatePageHeader"
                  })}
                  saveButtonBarState={createProductTypeOpts.status}
                  taxTypes={data?.taxTypes || []}
                  kind={params.kind}
                  onChangeKind={handleChangeKind}
                  onBack={() => navigate(productTypeListUrl())}
                  onSubmit={handleSubmit}
                />
              </>
            )}
          </TypedProductTypeCreateDataQuery>
        );
      }}
    </TypedProductTypeCreateMutation>
  );
};
export default ProductTypeCreate;
