import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  ProductTypeKindEnum,
  useProductTypeCreateDataQuery,
  useProductTypeCreateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import React from "react";
import { useIntl } from "react-intl";

import { getMutationErrors } from "../../misc";
import ProductTypeCreatePage, {
  ProductTypeForm,
} from "../components/ProductTypeCreatePage";
import {
  productTypeAddUrl,
  ProductTypeAddUrlQueryParams,
  productTypeUrl,
} from "../urls";

interface ProductTypeCreateProps {
  params: ProductTypeAddUrlQueryParams;
}

export const ProductTypeCreate: React.FC<ProductTypeCreateProps> = ({
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const handleChangeKind = (kind: ProductTypeKindEnum) =>
    navigate(
      productTypeAddUrl({
        ...params,
        kind,
      }),
    );

  const { data, loading } = useProductTypeCreateDataQuery({
    displayLoader: true,
  });

  const [
    createProductType,
    createProductTypeOpts,
  ] = useProductTypeCreateMutation({
    onCompleted: data => {
      if (data.productTypeCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "paa4m0",
            defaultMessage: "Successfully created product type",
          }),
        });
        navigate(productTypeUrl(data.productTypeCreate.productType.id));
      }
    },
  });

  const handleCreate = async (formData: ProductTypeForm) => {
    const result = await createProductType({
      variables: {
        input: {
          hasVariants: false,
          isShippingRequired: formData.isShippingRequired,
          name: formData.name,
          kind: formData.kind,
          taxCode: formData.taxType,
          weight: formData.weight,
        },
      },
    });

    return {
      id: result.data?.productTypeCreate.productType?.id || null,
      errors: getMutationErrors(result),
    };
  };

  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata,
  );

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "SSWFo8",
          defaultMessage: "Create Product Type",
          description: "window title",
        })}
      />
      <ProductTypeCreatePage
        defaultWeightUnit={data?.shop.defaultWeightUnit}
        disabled={loading}
        errors={createProductTypeOpts.data?.productTypeCreate.errors || []}
        pageTitle={intl.formatMessage({
          id: "bq1eEx",
          defaultMessage: "Create Product Type",
          description: "header",
        })}
        saveButtonBarState={createProductTypeOpts.status}
        taxTypes={data?.taxTypes || []}
        kind={params.kind}
        onChangeKind={handleChangeKind}
        onSubmit={handleSubmit}
      />
    </>
  );
};
export default ProductTypeCreate;
