import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata, { MetadataFormData } from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ChangeEvent, FormChange } from "@saleor/hooks/useForm";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { ProductTypeDetails_taxTypes } from "@saleor/productTypes/types/ProductTypeDetails";
import { UserError } from "@saleor/types";
import { WeightUnitsEnum } from "@saleor/types/globalTypes";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";

import ProductTypeDetails from "../ProductTypeDetails/ProductTypeDetails";
import ProductTypeShipping from "../ProductTypeShipping/ProductTypeShipping";
import ProductTypeTaxes from "../ProductTypeTaxes/ProductTypeTaxes";

export interface ProductTypeForm extends MetadataFormData {
  name: string;
  isShippingRequired: boolean;
  taxType: string;
  weight: number;
}

export interface ProductTypeCreatePageProps {
  errors: UserError[];
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  pageTitle: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  taxTypes: ProductTypeDetails_taxTypes[];
  onBack: () => void;
  onSubmit: (data: ProductTypeForm) => void;
}

const formInitialData: ProductTypeForm = {
  isShippingRequired: false,
  metadata: [],
  name: "",
  privateMetadata: [],
  taxType: "",
  weight: 0
};

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

const ProductTypeCreatePage: React.FC<ProductTypeCreatePageProps> = ({
  defaultWeightUnit,
  disabled,
  errors,
  pageTitle,
  saveButtonBarState,
  taxTypes,
  onBack,
  onSubmit
}: ProductTypeCreatePageProps) => {
  const intl = useIntl();
  const [taxTypeDisplayName, setTaxTypeDisplayName] = useStateFromProps("");
  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  return (
    <Form initial={formInitialData} onSubmit={onSubmit} confirmLeave>
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
                <Metadata data={data} onChange={changeMetadata} />
              </div>
              <div>
                <ProductTypeShipping
                  disabled={disabled}
                  data={data}
                  weightUnit={defaultWeightUnit}
                  onChange={change}
                />
              </div>
            </Grid>
            <SaveButtonBar
              onCancel={onBack}
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
ProductTypeCreatePage.displayName = "ProductTypeCreatePage";
export default ProductTypeCreatePage;
