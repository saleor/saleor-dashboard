import React from "react";
import { useIntl } from "react-intl";
import slugify from "slugify";

import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ReorderAction, UserError } from "@saleor/types";
import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";
import {
  AttributeDetailsFragment,
  AttributeDetailsFragment_values
} from "../../types/AttributeDetailsFragment";
import AttributeDetails from "../AttributeDetails";
import AttributeProperties from "../AttributeProperties";
import AttributeValues from "../AttributeValues";

export interface AttributePageProps {
  attribute: AttributeDetailsFragment | null;
  disabled: boolean;
  errors: UserError[];
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

export interface AttributePageFormData {
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
  const initialForm: AttributePageFormData =
    attribute === null
      ? {
          availableInGrid: true,
          filterableInDashboard: true,
          filterableInStorefront: true,
          inputType: AttributeInputTypeEnum.DROPDOWN,
          name: "",
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
          name: maybe(() => attribute.name, ""),
          slug: maybe(() => attribute.slug, ""),
          storefrontSearchPosition: maybe(
            () => attribute.storefrontSearchPosition.toString(),
            ""
          ),
          valueRequired: maybe(() => attribute.valueRequired, true),
          visibleInStorefront: maybe(() => attribute.visibleInStorefront, true)
        };

  const handleSubmit = (data: AttributePageFormData) =>
    onSubmit({
      ...data,
      slug: data.slug || slugify(data.name).toLowerCase()
    });

  return (
    <Form initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, submit }) => (
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
      )}
    </Form>
  );
};
AttributePage.displayName = "AttributePage";
export default AttributePage;
