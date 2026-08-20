import { type AttributeReference } from "@dashboard/attributes/utils/data";
import {
  type AttributeEntityTypeEnum,
  type AttributeInputTypeEnum,
  type AttributeValueDetailsFragment,
  type AttributeValueFragment,
  type MeasurementUnitsEnum,
} from "@dashboard/graphql";
import { type FormsetAtomicData } from "@dashboard/hooks/useFormset";
import { type AttributeValuesMetadata } from "@dashboard/products/utils/data";
import { type FetchMoreProps } from "@dashboard/types";
import { type RichTextGetters } from "@dashboard/utils/richText/useMultipleRichText";
import { Accordion, Box, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import { AttributeListItem } from "./AttributeListItem";
import {
  type AttributeFieldError,
  type AttributeRowHandlers,
  type VariantAttributeScope,
} from "./types";

export interface AttributeInputData {
  inputType: AttributeInputTypeEnum;
  entityType?: AttributeEntityTypeEnum;
  unit?: MeasurementUnitsEnum | null;
  variantAttributeScope?: VariantAttributeScope;
  isRequired: boolean;
  values: AttributeValueDetailsFragment[];
  selectedValues?: AttributeValueDetailsFragment[];
  references?: AttributeReference[];
}
export type AttributeInput = FormsetAtomicData<
  AttributeInputData,
  string[],
  AttributeValuesMetadata[]
>;
interface AttributesProps extends AttributeRowHandlers {
  attributes: AttributeInput[];
  attributeValues: AttributeValueFragment[];
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreAttributeValues: FetchMoreProps;
  onAttributeSelectBlur: () => void;
  disabled: boolean;
  loading: boolean;
  errors: AttributeFieldError[];
  title?: React.ReactNode;
  richTextGetters: RichTextGetters<string>;
  /** Skip DashboardCard + accordion so entity-detail pages can wrap in DetailSettingsCard. */
  unwrapped?: boolean;
}

const messages = defineMessages({
  attributesNumber: {
    id: "z0gGP+",
    defaultMessage: "{number} Attributes",
    description: "number of attributes",
  },
  header: {
    id: "3ukd9/",
    defaultMessage: "Attributes",
    description: "attributes, section header",
  },
});

export const Attributes = ({
  attributes,
  attributeValues,
  errors,
  title,
  onAttributeSelectBlur,
  richTextGetters,
  unwrapped = false,
  ...props
}: AttributesProps) => {
  const intl = useIntl();
  const list =
    attributes.length > 0 ? (
      <ul>
        {attributes.map(attribute => (
          <React.Fragment key={attribute.id}>
            <AttributeListItem
              attribute={attribute}
              errors={errors}
              attributeValues={attributeValues}
              onAttributeSelectBlur={onAttributeSelectBlur}
              richTextGetters={richTextGetters}
              {...props}
            />
          </React.Fragment>
        ))}
      </ul>
    ) : null;

  if (unwrapped) {
    return (
      <Box data-test-id="attributes" display="flex" flexDirection="column" gap={1}>
        {list}
      </Box>
    );
  }

  return (
    <DashboardCard paddingTop={6} data-test-id="attributes">
      <DashboardCard.Content>
        <Box display="flex" flexDirection="column" gap={1}>
          <Accordion defaultValue="attributes-accordion">
            <Accordion.Item value="attributes-accordion">
              <Accordion.Trigger
                data-testid="attributes-expand"
                flexWrap="wrap"
                alignItems="flex-start"
              >
                <Box display="flex" flexDirection="column" gap={2}>
                  <Text size={6} fontWeight="medium">
                    {title || intl.formatMessage(messages.header)}
                  </Text>
                  <Text size={2} color="default2">
                    <FormattedMessage
                      {...messages.attributesNumber}
                      values={{
                        number: attributes.length,
                      }}
                    />
                  </Text>
                </Box>
                <Accordion.TriggerButton dataTestId="expand-icon" />
              </Accordion.Trigger>
              <Accordion.Content>{list}</Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
