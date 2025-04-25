// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import ControlledSwitch from "@dashboard/components/ControlledSwitch";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import { MetadataFormData } from "@dashboard/components/Metadata/types";
import { Savebar } from "@dashboard/components/Savebar";
import {
  ProductAttributeType,
  ProductTypeDetailsQuery,
  ProductTypeKindEnum,
  TaxClassBaseFragment,
  WeightUnitsEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { maybe } from "@dashboard/misc";
import { handleTaxClassChange } from "@dashboard/productTypes/handlers";
import { productTypeListPath } from "@dashboard/productTypes/urls";
import { FetchMoreProps, ListActions, ReorderEvent, UserError } from "@dashboard/types";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { sprinkles } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import ProductTypeAttributes from "../ProductTypeAttributes/ProductTypeAttributes";
import ProductTypeDetails from "../ProductTypeDetails/ProductTypeDetails";
import ProductTypeShipping from "../ProductTypeShipping/ProductTypeShipping";
import ProductTypeTaxes from "../ProductTypeTaxes/ProductTypeTaxes";
import ProductTypeVariantAttributes from "../ProductTypeVariantAttributes/ProductTypeVariantAttributes";

interface ChoiceType {
  label: string;
  value: string;
}

export interface ProductTypeForm extends MetadataFormData {
  name: string;
  kind: ProductTypeKindEnum;
  hasVariants: boolean;
  isShippingRequired: boolean;
  taxClassId: string;
  productAttributes: ChoiceType[];
  variantAttributes: ChoiceType[];
  weight: number;
}

export interface ProductTypeDetailsPageProps {
  errors: UserError[];
  productType: ProductTypeDetailsQuery["productType"];
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  pageTitle: string;
  productAttributeList: ListActions;
  saveButtonBarState: ConfirmButtonTransitionState;
  taxClasses: TaxClassBaseFragment[];
  variantAttributeList: ListActions;
  onAttributeAdd: (type: ProductAttributeType) => void;
  onAttributeReorder: (event: ReorderEvent, type: ProductAttributeType) => void;
  onAttributeUnassign: (id: string) => void;
  onDelete: () => void;
  onHasVariantsToggle: (hasVariants: boolean) => void;
  onSubmit: (data: ProductTypeForm) => SubmitPromise;
  setSelectedVariantAttributes: (data: string[]) => void;
  selectedVariantAttributes: string[];
  onFetchMoreTaxClasses: FetchMoreProps;
}

const ProductTypeDetailsPage: React.FC<ProductTypeDetailsPageProps> = ({
  defaultWeightUnit,
  disabled,
  errors,
  pageTitle,
  productType,
  productAttributeList,
  saveButtonBarState,
  taxClasses,
  variantAttributeList,
  onAttributeAdd,
  onAttributeUnassign,
  onAttributeReorder,
  onDelete,
  onHasVariantsToggle,
  onSubmit,
  setSelectedVariantAttributes,
  selectedVariantAttributes,
  onFetchMoreTaxClasses,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const productTypeListBackLink = useBackLinkWithState({
    path: productTypeListPath,
  });
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();
  const [taxClassDisplayName, setTaxClassDisplayName] = useStateFromProps(
    productType?.taxClass?.name ?? "",
  );
  const formInitialData: ProductTypeForm = {
    hasVariants:
      maybe(() => productType.hasVariants) !== undefined ? productType.hasVariants : false,
    isShippingRequired:
      maybe(() => productType.isShippingRequired) !== undefined
        ? productType.isShippingRequired
        : false,
    metadata: productType?.metadata?.map(mapMetadataItemToInput),
    name: maybe(() => productType.name) !== undefined ? productType.name : "",
    kind: productType?.kind || ProductTypeKindEnum.NORMAL,
    privateMetadata: productType?.privateMetadata?.map(mapMetadataItemToInput),
    productAttributes:
      maybe(() => productType.productAttributes) !== undefined
        ? productType.productAttributes.map(attribute => ({
            label: attribute.name,
            value: attribute.id,
          }))
        : [],
    taxClassId: productType?.taxClass?.id ?? "",
    variantAttributes:
      maybe(() => productType.variantAttributes) !== undefined
        ? productType.variantAttributes.map(attribute => ({
            label: attribute.name,
            value: attribute.id,
          }))
        : [],
    weight: maybe(() => productType.weight.value),
  };
  const handleSubmit = (data: ProductTypeForm) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified ? data.privateMetadata : undefined;

    return onSubmit({
      ...data,
      metadata,
      privateMetadata,
    });
  };

  return (
    <Form initial={formInitialData} onSubmit={handleSubmit} confirmLeave disabled={disabled}>
      {({ change, data, isSaveDisabled, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <DetailPageLayout>
            <TopNav href={productTypeListBackLink} title={pageTitle} />
            <DetailPageLayout.Content>
              <ProductTypeDetails
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
                onKindChange={change}
              />
              <CardSpacer />
              <ProductTypeTaxes
                disabled={disabled}
                data={data}
                taxClasses={taxClasses}
                taxClassDisplayName={taxClassDisplayName}
                onChange={event =>
                  handleTaxClassChange(event, taxClasses, change, setTaxClassDisplayName)
                }
                onFetchMore={onFetchMoreTaxClasses}
              />
              <CardSpacer />
              <ProductTypeAttributes
                testId="assign-products-attributes"
                attributes={maybe(() => productType.productAttributes)}
                disabled={disabled}
                type={ProductAttributeType.PRODUCT}
                onAttributeAssign={onAttributeAdd}
                onAttributeReorder={(event: ReorderEvent) =>
                  onAttributeReorder(event, ProductAttributeType.PRODUCT)
                }
                onAttributeUnassign={onAttributeUnassign}
                {...productAttributeList}
              />
              <CardSpacer />
              <ControlledSwitch
                checked={data.hasVariants}
                disabled={disabled}
                label={intl.formatMessage({
                  id: "5pHBSU",
                  defaultMessage: "Product type uses Variant Attributes",
                  description: "switch button",
                })}
                name="hasVariants"
                onChange={event => onHasVariantsToggle(event.target.value)}
                className={sprinkles({ paddingLeft: 6 })}
              />
              {data.hasVariants && (
                <>
                  <CardSpacer />
                  <ProductTypeVariantAttributes
                    testId="assign-variants-attributes"
                    assignedVariantAttributes={productType?.assignedVariantAttributes}
                    disabled={disabled}
                    type={ProductAttributeType.VARIANT}
                    onAttributeAssign={onAttributeAdd}
                    onAttributeReorder={(event: ReorderEvent) =>
                      onAttributeReorder(event, ProductAttributeType.VARIANT)
                    }
                    onAttributeUnassign={onAttributeUnassign}
                    setSelectedVariantAttributes={setSelectedVariantAttributes}
                    selectedVariantAttributes={selectedVariantAttributes}
                    {...variantAttributeList}
                  />
                </>
              )}
              <CardSpacer />
              <Metadata data={data} onChange={changeMetadata} />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <ProductTypeShipping
                disabled={disabled}
                data={data}
                weightUnit={productType?.weight?.unit || defaultWeightUnit}
                onChange={change}
              />
            </DetailPageLayout.RightSidebar>
            <Savebar>
              <Savebar.DeleteButton onClick={onDelete} />
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(productTypeListBackLink)} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={isSaveDisabled}
              />
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

ProductTypeDetailsPage.displayName = "ProductTypeDetailsPage";
export default ProductTypeDetailsPage;
