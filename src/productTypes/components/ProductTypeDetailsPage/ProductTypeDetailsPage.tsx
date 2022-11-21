import { Backlink } from "@saleor/components/Backlink";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import {
  ProductAttributeType,
  ProductTypeDetailsQuery,
  ProductTypeKindEnum,
  WeightUnitsEnum,
} from "@saleor/graphql";
import { ChangeEvent, FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import { productTypeListUrl } from "@saleor/productTypes/urls";
import { ListActions, ReorderEvent, UserError } from "@saleor/types";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
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
  taxType: string;
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
  taxTypes: ProductTypeDetailsQuery["taxTypes"];
  variantAttributeList: ListActions;
  onAttributeAdd: (type: ProductAttributeType) => void;
  onAttributeReorder: (event: ReorderEvent, type: ProductAttributeType) => void;
  onAttributeUnassign: (id: string) => void;
  onDelete: () => void;
  onHasVariantsToggle: (hasVariants: boolean) => void;
  onSubmit: (data: ProductTypeForm) => SubmitPromise;
  setSelectedVariantAttributes: (data: string[]) => void;
  selectedVariantAttributes: string[];
}

function handleTaxTypeChange(
  event: ChangeEvent,
  taxTypes: ProductTypeDetailsQuery["taxTypes"],
  formChange: FormChange,
  displayChange: (name: string) => void,
) {
  formChange(event);
  displayChange(
    taxTypes.find(taxType => taxType.taxCode === event.target.value)
      .description,
  );
}

const ProductTypeDetailsPage: React.FC<ProductTypeDetailsPageProps> = ({
  defaultWeightUnit,
  disabled,
  errors,
  pageTitle,
  productType,
  productAttributeList,
  saveButtonBarState,
  taxTypes,
  variantAttributeList,
  onAttributeAdd,
  onAttributeUnassign,
  onAttributeReorder,
  onDelete,
  onHasVariantsToggle,
  onSubmit,
  setSelectedVariantAttributes,
  selectedVariantAttributes,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();

  const [taxTypeDisplayName, setTaxTypeDisplayName] = useStateFromProps(
    maybe(() => productType.taxType.description, ""),
  );
  const formInitialData: ProductTypeForm = {
    hasVariants:
      maybe(() => productType.hasVariants) !== undefined
        ? productType.hasVariants
        : false,
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
    taxType: maybe(() => productType.taxType.taxCode, ""),
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
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    return onSubmit({
      ...data,
      metadata,
      privateMetadata,
    });
  };

  return (
    <Form
      initial={formInitialData}
      onSubmit={handleSubmit}
      confirmLeave
      disabled={disabled}
    >
      {({ change, data, isSaveDisabled, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <Backlink href={productTypeListUrl()}>
              {intl.formatMessage(sectionNames.productTypes)}
            </Backlink>
            <PageHeader title={pageTitle} />
            <Grid>
              <div>
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
                  taxTypes={taxTypes}
                  taxTypeDisplayName={taxTypeDisplayName}
                  onChange={event =>
                    handleTaxTypeChange(
                      event,
                      taxTypes,
                      change,
                      setTaxTypeDisplayName,
                    )
                  }
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
                />
                {data.hasVariants && (
                  <>
                    <CardSpacer />
                    <ProductTypeVariantAttributes
                      testId="assign-variants-attributes"
                      assignedVariantAttributes={
                        productType?.assignedVariantAttributes
                      }
                      disabled={disabled}
                      type={ProductAttributeType.VARIANT}
                      onAttributeAssign={onAttributeAdd}
                      onAttributeReorder={(event: ReorderEvent) =>
                        onAttributeReorder(event, ProductAttributeType.VARIANT)
                      }
                      onAttributeUnassign={onAttributeUnassign}
                      setSelectedVariantAttributes={
                        setSelectedVariantAttributes
                      }
                      selectedVariantAttributes={selectedVariantAttributes}
                      {...variantAttributeList}
                    />
                  </>
                )}
                <CardSpacer />
                <Metadata data={data} onChange={changeMetadata} />
              </div>
              <div>
                <ProductTypeShipping
                  disabled={disabled}
                  data={data}
                  weightUnit={productType?.weight?.unit || defaultWeightUnit}
                  onChange={change}
                />
              </div>
            </Grid>
            <Savebar
              onCancel={() => navigate(productTypeListUrl())}
              onDelete={onDelete}
              onSubmit={submit}
              disabled={isSaveDisabled}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};
ProductTypeDetailsPage.displayName = "ProductTypeDetailsPage";
export default ProductTypeDetailsPage;
