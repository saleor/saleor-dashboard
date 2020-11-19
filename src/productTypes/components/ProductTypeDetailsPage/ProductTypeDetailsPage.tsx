import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ChangeEvent, FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListActions, ReorderEvent, UserError } from "@saleor/types";
import {
  ProductAttributeType,
  WeightUnitsEnum
} from "@saleor/types/globalTypes";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";

import {
  ProductTypeDetails_productType,
  ProductTypeDetails_taxTypes
} from "../../types/ProductTypeDetails";
import ProductTypeAttributes from "../ProductTypeAttributes/ProductTypeAttributes";
import ProductTypeDetails from "../ProductTypeDetails/ProductTypeDetails";
import ProductTypeShipping from "../ProductTypeShipping/ProductTypeShipping";
import ProductTypeTaxes from "../ProductTypeTaxes/ProductTypeTaxes";

interface ChoiceType {
  label: string;
  value: string;
}

export interface ProductTypeForm extends MetadataFormData {
  name: string;
  hasVariants: boolean;
  isShippingRequired: boolean;
  taxType: string;
  productAttributes: ChoiceType[];
  variantAttributes: ChoiceType[];
  weight: number;
}

export interface ProductTypeDetailsPageProps {
  errors: UserError[];
  productType: ProductTypeDetails_productType;
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  pageTitle: string;
  productAttributeList: ListActions;
  saveButtonBarState: ConfirmButtonTransitionState;
  taxTypes: ProductTypeDetails_taxTypes[];
  variantAttributeList: ListActions;
  onAttributeAdd: (type: ProductAttributeType) => void;
  onAttributeClick: (id: string) => void;
  onAttributeReorder: (event: ReorderEvent, type: ProductAttributeType) => void;
  onAttributeUnassign: (id: string) => void;
  onBack: () => void;
  onDelete: () => void;
  onHasVariantsToggle: (hasVariants: boolean) => void;
  onSubmit: (data: ProductTypeForm) => SubmitPromise;
}

function handleTaxTypeChange(
  event: ChangeEvent,
  taxTypes: ProductTypeDetails_taxTypes[],
  formChange: FormChange,
  displayChange: (name: string) => void
) {
  formChange(event);
  displayChange(
    taxTypes.find(taxType => taxType.taxCode === event.target.value).description
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
  onAttributeClick,
  onBack,
  onDelete,
  onHasVariantsToggle,
  onSubmit
}) => {
  const intl = useIntl();
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const [taxTypeDisplayName, setTaxTypeDisplayName] = useStateFromProps(
    maybe(() => productType.taxType.description, "")
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
    privateMetadata: productType?.privateMetadata?.map(mapMetadataItemToInput),
    productAttributes:
      maybe(() => productType.productAttributes) !== undefined
        ? productType.productAttributes.map(attribute => ({
            label: attribute.name,
            value: attribute.id
          }))
        : [],
    taxType: maybe(() => productType.taxType.taxCode, ""),
    variantAttributes:
      maybe(() => productType.variantAttributes) !== undefined
        ? productType.variantAttributes.map(attribute => ({
            label: attribute.name,
            value: attribute.id
          }))
        : [],
    weight: maybe(() => productType.weight.value)
  };

  const handleSubmit = (data: ProductTypeForm) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    return onSubmit({
      ...data,
      metadata,
      privateMetadata
    });
  };

  return (
    <Form initial={formInitialData} onSubmit={handleSubmit} confirmLeave>
      {({ change, data, hasChanged, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.productTypes)}
            </AppHeader>
            <PageHeader title={pageTitle} />
            <Grid>
              <div>
                <ProductTypeDetails
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
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
                      setTaxTypeDisplayName
                    )
                  }
                />
                <CardSpacer />
                <ProductTypeAttributes
                  attributes={maybe(() => productType.productAttributes)}
                  disabled={disabled}
                  type={ProductAttributeType.PRODUCT}
                  onAttributeAssign={onAttributeAdd}
                  onAttributeClick={onAttributeClick}
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
                    defaultMessage: "Product type uses Variant Attributes",
                    description: "switch button"
                  })}
                  name="hasVariants"
                  onChange={event => onHasVariantsToggle(event.target.value)}
                />
                {data.hasVariants && (
                  <>
                    <CardSpacer />
                    <ProductTypeAttributes
                      attributes={maybe(() => productType.variantAttributes)}
                      disabled={disabled}
                      type={ProductAttributeType.VARIANT}
                      onAttributeAssign={onAttributeAdd}
                      onAttributeClick={onAttributeClick}
                      onAttributeReorder={(event: ReorderEvent) =>
                        onAttributeReorder(event, ProductAttributeType.VARIANT)
                      }
                      onAttributeUnassign={onAttributeUnassign}
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
            <SaveButtonBar
              onCancel={onBack}
              onDelete={onDelete}
              onSave={submit}
              disabled={disabled || !hasChanged}
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
