import { AttributeReference } from "@dashboard/attributes/utils/data";
import { Hr } from "@dashboard/components/Hr";
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
import { FetchMoreProps } from "@dashboard/types";
import { RichTextGetters } from "@dashboard/utils/richText/useMultipleRichText";
import {
  Box,
  Button,
  ChervonDownIcon,
  ChervonUpIcon,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import { DashboardCard } from "../Card";
import AttributeRow from "./AttributeRow";
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
export type AttributeInput = FormsetAtomicData<AttributeInputData, string[]>;
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
  const [expanded, setExpansionStatus] = React.useState(true);
  const toggleExpansion = () => setExpansionStatus(!expanded);

  return (
    <DashboardCard>
      <DashboardCard.Title>
        {title || intl.formatMessage(messages.header)}
      </DashboardCard.Title>
      <DashboardCard.Content>
        <Box display="flex" flexDirection="column" gap={5}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text variant="caption" color="textNeutralSubdued">
              <FormattedMessage
                {...messages.attributesNumber}
                values={{
                  number: attributes.length,
                }}
              />
            </Text>
            <Button
              variant="secondary"
              type="button"
              onClick={toggleExpansion}
              data-test-id="attributes-expand"
              icon={expanded ? <ChervonDownIcon /> : <ChervonUpIcon />}
            />
          </Box>
          {expanded && attributes.length > 0 && (
            <ul>
              <Hr />
              {attributes.map((attribute, attributeIndex) => {
                const error = errors.find(err =>
                  err.attributes?.includes(attribute.id),
                );

                return (
                  <React.Fragment key={attribute.id}>
                    {attributeIndex > 0 && <Hr />}
                    <AttributeRow
                      attribute={attribute}
                      attributeValues={attributeValues}
                      error={error}
                      onAttributeSelectBlur={onAttributeSelectBlur}
                      richTextGetters={richTextGetters}
                      {...props}
                    />
                  </React.Fragment>
                );
              })}
            </ul>
          )}
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
