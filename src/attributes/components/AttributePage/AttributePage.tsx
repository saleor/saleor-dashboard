import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import {
  AttributeDetailsFragment,
  AttributeDetailsFragment_values
} from "@saleor/fragments/types/AttributeDetailsFragment";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ReorderAction } from "@saleor/types";
import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";
import slugify from "slugify";

import AttributeDetails from "../AttributeDetails";
import AttributeProperties from "../AttributeProperties";
import AttributeValues from "../AttributeValues";

export interface AttributePageProps {
  attribute: AttributeDetailsFragment | null;
  disabled: boolean;
  errors: ProductErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  values: AttributeDetailsFragment_values[];
  onBack: () => void;
  onDelete: () => void;
  onSubmit: (data: AttributePageFormData) => void;
  onValueAdd: () => void;
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
  onValueUpdate: (id: string) => void;
}

export interface AttributePageFormData extends MetadataFormData {
  availableInGrid: boolean;
  filterableInDashboard: boolean;
  inputType: AttributeInputTypeEnum;
  filterableInStorefront: boolean;
  name: string;
  slug: string;
  storefrontSearchPosition: string;
  valueRequired: boolean;
  visibleInStorefront: boolean;
}

const AttributePage: React.FC<AttributePageProps> = ({
  attribute,
  disabled,
  errors,
  saveButtonBarState,
  values,
  onBack,
  onDelete,
  onSubmit,
  onValueAdd,
  onValueDelete,
  onValueReorder,
  onValueUpdate
}) => {
  const intl = useIntl();
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const initialForm: AttributePageFormData =
    attribute === null
      ? {
          availableInGrid: true,
          filterableInDashboard: true,
          filterableInStorefront: true,
          inputType: AttributeInputTypeEnum.DROPDOWN,
          metadata: undefined,
          name: "",
          privateMetadata: undefined,
          slug: "",
          storefrontSearchPosition: "",
          valueRequired: true,
          visibleInStorefront: true
        }
      : {
          availableInGrid: maybe(() => attribute.availableInGrid, true),
          filterableInDashboard: maybe(
            () => attribute.filterableInDashboard,
            true
          ),
          filterableInStorefront: maybe(
            () => attribute.filterableInStorefront,
            true
          ),
          inputType: maybe(
            () => attribute.inputType,
            AttributeInputTypeEnum.DROPDOWN
          ),
          metadata: attribute?.metadata?.map(mapMetadataItemToInput),
          name: maybe(() => attribute.name, ""),
          privateMetadata: attribute?.privateMetadata?.map(
            mapMetadataItemToInput
          ),
          slug: maybe(() => attribute.slug, ""),
          storefrontSearchPosition: maybe(
            () => attribute.storefrontSearchPosition.toString(),
            ""
          ),
          valueRequired: maybe(() => attribute.valueRequired, true),
          visibleInStorefront: maybe(() => attribute.visibleInStorefront, true)
        };

  const handleSubmit = (data: AttributePageFormData) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    onSubmit({
      ...data,
      metadata,
      privateMetadata,
      slug: data.slug || slugify(data.name).toLowerCase()
    });
  };

  return (
    <Form initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.attributes)}
            </AppHeader>
            <PageHeader
              title={
                attribute === null
                  ? intl.formatMessage({
                      defaultMessage: "Create New Attribute",
                      description: "page title"
                    })
                  : maybe(() => attribute.name)
              }
            />
            <Grid>
              <div>
                <AttributeDetails
                  canChangeType={attribute === null}
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <CardSpacer />
                <AttributeValues
                  disabled={disabled}
                  values={values}
                  onValueAdd={onValueAdd}
                  onValueDelete={onValueDelete}
                  onValueReorder={onValueReorder}
                  onValueUpdate={onValueUpdate}
                />
                {!!attribute && (
                  <>
                    <CardSpacer />
                    <Metadata data={data} onChange={changeMetadata} />
                  </>
                )}
              </div>
              <div>
                <AttributeProperties
                  data={data}
                  errors={errors}
                  disabled={disabled}
                  onChange={change}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled}
              state={saveButtonBarState}
              onCancel={onBack}
              onSave={submit}
              onDelete={attribute === null ? undefined : onDelete}
            />
          </Container>
        );
      }}
    </Form>
  );
};
AttributePage.displayName = "AttributePage";
export default AttributePage;
