import { AttributeReference } from "@dashboard/attributes/utils/data";
import CardTitle from "@dashboard/components/CardTitle";
import Hr from "@dashboard/components/Hr";
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
import { Card, CardContent, Typography } from "@material-ui/core";
import { ChevronIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

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

const useStyles = makeStyles(
  theme => ({
    attributeSection: {
      "&:last-of-type": {
        paddingBottom: 0,
      },
      padding: theme.spacing(2, 0),
    },
    attributeSectionLabel: {
      alignItems: "center",
      display: "flex",
    },
    card: {
      overflow: "visible",
    },
    cardContent: {
      "&:last-child": {
        paddingBottom: theme.spacing(2),
      },
      paddingTop: theme.spacing(1),
    },
    expansionBar: {
      display: "flex",
    },
    expansionBarButton: {
      padding: 4,
      marginBottom: theme.spacing(1),
    },
    expansionBarButtonIcon: {
      transition: theme.transitions.duration.short + "ms",
    },
    expansionBarLabel: {
      color: theme.palette.text.disabled,
      fontSize: 14,
    },
    expansionBarLabelContainer: {
      alignItems: "center",
      display: "flex",
      flex: 1,
    },
    rotate: {
      transform: "rotate(180deg)",
    },
    uploadFileButton: {
      float: "right",
    },
    uploadFileContent: {
      color: theme.palette.primary.main,
      float: "right",
      fontSize: theme.typography.body1.fontSize,
    },
  }),
  { name: "Attributes" },
);

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

const Attributes: React.FC<AttributesProps> = ({
  attributes,
  attributeValues,
  errors,
  title,
  onAttributeSelectBlur,
  richTextGetters,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [expanded, setExpansionStatus] = React.useState(true);
  const toggleExpansion = () => setExpansionStatus(!expanded);

  return (
    <Card className={classes.card}>
      <CardTitle title={title || intl.formatMessage(messages.header)} />
      <CardContent className={classes.cardContent}>
        <div className={classes.expansionBar}>
          <div className={classes.expansionBarLabelContainer}>
            <Typography className={classes.expansionBarLabel} variant="caption">
              <FormattedMessage
                {...messages.attributesNumber}
                values={{
                  number: attributes.length,
                }}
              />
            </Typography>
          </div>
          <IconButton
            variant="secondary"
            hoverOutline={false}
            className={classes.expansionBarButton}
            onClick={toggleExpansion}
            data-test-id="attributes-expand"
          >
            <ChevronIcon
              className={clsx(classes.expansionBarButtonIcon, {
                [classes.rotate]: expanded,
              })}
            />
          </IconButton>
        </div>
        {expanded && attributes.length > 0 && (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  );
};
Attributes.displayName = "Attributes";
export default Attributes;
