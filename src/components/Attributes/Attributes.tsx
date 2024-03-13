import { AttributeReference } from "@dashboard/attributes/utils/data";
import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  AttributeValueDetailsFragment,
  AttributeValueFragment,
  MeasurementUnitsEnum,
  PageErrorWithAttributesFragment,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { FormsetAtomicData } from "@dashboard/hooks/useFormset";
import { AttributeValuesMetadata } from "@dashboard/products/utils/data";
import { FetchMoreProps } from "@dashboard/types";
import { RichTextGetters } from "@dashboard/utils/richText/useMultipleRichText";
import { Accordion, Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import { AttributeListItem } from "./AttributeListItem";
import { AttributeRowHandlers, VariantAttributeScope } from "./types";

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
export type AttributeFileInput = FormsetAtomicData<AttributeInputData, File[]>;
export interface AttributesProps extends AttributeRowHandlers {
  attributes: AttributeInput[];
  attributeValues: AttributeValueFragment[];
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreAttributeValues: FetchMoreProps;
  onAttributeSelectBlur: () => void;
  disabled: boolean;
  loading: boolean;
  errors: Array<
    ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment
  >;
  title?: React.ReactNode;
  richTextGetters: RichTextGetters<string>;
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

export const Attributes: React.FC<AttributesProps> = ({
  attributes,
  attributeValues,
  errors,
  title,
  onAttributeSelectBlur,
  richTextGetters,
  ...props
}) => {
  const intl = useIntl();

  return (
    <DashboardCard paddingTop={6}>
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
                  <Text typeSize={5} fontWeight="bold">
                    {title || intl.formatMessage(messages.header)}
                  </Text>
                  <Text typeSize={2} color="default2">
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
              <Accordion.Content>
                {attributes.length > 0 && (
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
                )}
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
