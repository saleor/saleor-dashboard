import { AttributeDetails_attribute_choices } from "@saleor/attributes/types/AttributeDetails";
import { ATTRIBUTE_TYPES_WITH_DEDICATED_VALUES } from "@saleor/attributes/utils/data";
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
import { ListSettingsUpdate } from "@saleor/components/TablePagination";
import { AttributeDetailsFragment } from "@saleor/fragments/types/AttributeDetailsFragment";
import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListSettings, ReorderAction } from "@saleor/types";
import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  MeasurementUnitsEnum
} from "@saleor/types/globalTypes";
import { mapEdgesToItems, mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";
import slugify from "slugify";

import AttributeDetails from "../AttributeDetails";
import AttributeOrganization from "../AttributeOrganization";
import AttributeProperties from "../AttributeProperties";
import AttributeValues from "../AttributeValues";

export interface AttributePageProps {
  attribute: AttributeDetailsFragment | null;
  disabled: boolean;
  errors: AttributeErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  values: AttributeDetails_attribute_choices;
  onBack: () => void;
  onDelete: () => void;
  onSubmit: (data: AttributePageFormData) => void;
  onValueAdd: () => void;
  onValueDelete: (id: string) => void;
  onValueReorder: ReorderAction;
  onValueUpdate: (id: string) => void;
  settings?: ListSettings;
  onUpdateListSettings?: ListSettingsUpdate;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export interface AttributePageFormData extends MetadataFormData {
  type: AttributeTypeEnum;
  availableInGrid: boolean;
  filterableInDashboard: boolean;
  inputType: AttributeInputTypeEnum;
  entityType: AttributeEntityTypeEnum;
  filterableInStorefront: boolean;
  name: string;
  slug: string;
  storefrontSearchPosition: string;
  valueRequired: boolean;
  unit: MeasurementUnitsEnum | null | undefined;
  visibleInStorefront: boolean;
}

const AttributePage: React.FC<AttributePageProps> = ({
  attribute,
  disabled,
  errors: apiErrors,
  saveButtonBarState,
  values,
  onBack,
  onDelete,
  onSubmit,
  onValueAdd,
  onValueDelete,
  onValueReorder,
  onValueUpdate,
  settings,
  onUpdateListSettings,
  pageInfo,
  onNextPage,
  onPreviousPage
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
          entityType: null,
          filterableInDashboard: true,
          filterableInStorefront: true,
          inputType: AttributeInputTypeEnum.DROPDOWN,
          metadata: [],
          name: "",
          privateMetadata: [],
          slug: "",
          storefrontSearchPosition: "",
          type: AttributeTypeEnum.PRODUCT_TYPE,
          valueRequired: true,
          visibleInStorefront: true,
          unit: undefined
        }
      : {
          availableInGrid: attribute?.availableInGrid ?? true,
          entityType: attribute?.entityType ?? null,
          filterableInDashboard: attribute?.filterableInDashboard ?? true,
          filterableInStorefront: attribute?.filterableInStorefront ?? true,
          inputType: attribute?.inputType ?? AttributeInputTypeEnum.DROPDOWN,
          metadata: attribute?.metadata?.map(mapMetadataItemToInput),
          name: attribute?.name ?? "",
          privateMetadata: attribute?.privateMetadata?.map(
            mapMetadataItemToInput
          ),
          slug: attribute?.slug ?? "",
          storefrontSearchPosition:
            attribute?.storefrontSearchPosition.toString() ?? "",
          type: attribute?.type || AttributeTypeEnum.PRODUCT_TYPE,
          valueRequired: !!attribute?.valueRequired ?? true,
          visibleInStorefront: attribute?.visibleInStorefront ?? true,
          unit: attribute?.unit || null
        };

  const handleSubmit = (data: AttributePageFormData) => {
    const metadata =
      !attribute || isMetadataModified ? data.metadata : undefined;
    const privateMetadata =
      !attribute || isPrivateMetadataModified
        ? data.privateMetadata
        : undefined;
    const type = attribute === null ? data.type : undefined;

    return onSubmit({
      ...data,
      metadata,
      privateMetadata,
      slug: data.slug || slugify(data.name).toLowerCase(),
      type
    });
  };

  return (
    <Form initial={initialForm} onSubmit={handleSubmit}>
      {({
        change,
        set,
        data,
        hasChanged,
        submit,
        errors,
        setError,
        clearErrors
      }) => {
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
                  apiErrors={apiErrors}
                  onChange={change}
                  set={set}
                  errors={errors}
                  setError={setError}
                  clearErrors={clearErrors}
                />
                {ATTRIBUTE_TYPES_WITH_DEDICATED_VALUES.includes(
                  data.inputType
                ) && (
                  <>
                    <CardSpacer />
                    <AttributeValues
                      disabled={disabled}
                      values={mapEdgesToItems(values)}
                      onValueAdd={onValueAdd}
                      onValueDelete={onValueDelete}
                      onValueReorder={onValueReorder}
                      onValueUpdate={onValueUpdate}
                      settings={settings}
                      onUpdateListSettings={onUpdateListSettings}
                      pageInfo={pageInfo}
                      onNextPage={onNextPage}
                      onPreviousPage={onPreviousPage}
                    />
                  </>
                )}
                <CardSpacer />
                <Metadata data={data} onChange={changeMetadata} />
              </div>
              <div>
                <AttributeOrganization
                  canChangeType={attribute === null}
                  data={data}
                  disabled={disabled}
                  onChange={change}
                />
                <CardSpacer />
                <AttributeProperties
                  data={data}
                  errors={apiErrors}
                  disabled={disabled}
                  onChange={change}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
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
