import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType
} from "@saleor/components/SingleAutocompleteSelectField";
import Skeleton from "@saleor/components/Skeleton";
import { ProductVariant_attributes_attribute_values } from "@saleor/fragments/types/ProductVariant";
import { FormsetAtomicData, FormsetChange } from "@saleor/hooks/useFormset";
import { buttonMessages } from "@saleor/intl";
import { VariantCreate_productVariantCreate_errors } from "@saleor/products/types/VariantCreate";
import { getProductVariantAttributeErrorMessage } from "@saleor/utils/errors/product";
import React from "react";
import { useIntl } from "react-intl";

export interface VariantAttributeInputData {
  isRequired: boolean;
  values: ProductVariant_attributes_attribute_values[];
}
export type VariantAttributeInput = FormsetAtomicData<
  VariantAttributeInputData,
  string
>;

interface ProductVariantAttributesProps {
  attributes: VariantAttributeInput[];
  disabled: boolean;
  errors: VariantCreate_productVariantCreate_errors[];
  onChange: FormsetChange<VariantAttributeInputData>;
  onRemove: (id: string) => void;
  onEdit: () => void;
}

const useStyles = makeStyles(
  theme => ({
    attribute: {
      "&:last-child": {
        "& hr": {
          display: "none"
        }
      }
    },
    option: {
      alignItems: "center",
      padding: theme.spacing(2, 0)
    }
  }),
  {
    name: "ProductVariantAttributes"
  }
);

function getAttributeDisplayValue(
  id: string,
  slug: string,
  attributes: VariantAttributeInput[]
): string {
  const attribute = attributes.find(attr => attr.id === id);
  const attributeValue = attribute.data.values.find(
    value => value.slug === slug
  );
  if (!!attributeValue) {
    return attributeValue.name;
  }

  return slug;
}

function getAttributeValue(
  id: string,
  attributes: VariantAttributeInput[]
): string {
  const attribute = attributes.find(attr => attr.id === id);
  return attribute.value;
}

function getAttributeValueChoices(
  id: string,
  attributes: VariantAttributeInput[]
): SingleAutocompleteChoiceType[] {
  const attribute = attributes.find(attr => attr.id === id);
  return attribute.data.values.map(attributeValue => ({
    label: attributeValue.name,
    value: attributeValue.slug
  }));
}

const ProductVariantAttributes: React.FC<ProductVariantAttributesProps> = ({
  attributes,
  disabled,
  errors,
  onChange,
  onEdit,
  onRemove
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Configurable attributes"
        })}
        toolbar={
          <Button color="primary" onClick={onEdit}>
            {intl.formatMessage(buttonMessages.edit)}
          </Button>
        }
      />
      <CardContent>
        <div>
          {attributes === undefined ? (
            <Skeleton />
          ) : (
            attributes.map(attribute => (
              <div key={attribute.id} className={classes.attribute}>
                <Grid variant="uniform" className={classes.option}>
                  <Typography>{attribute.label}</Typography>
                  <div>
                    <SingleAutocompleteSelectField
                      disabled={disabled}
                      displayValue={getAttributeDisplayValue(
                        attribute.id,
                        attribute.value,
                        attributes
                      )}
                      label={intl.formatMessage(
                        {
                          defaultMessage: "Attribute Value{required}"
                        },
                        {
                          required: attribute.data.isRequired ? "*" : ""
                        }
                      )}
                      name={`attribute:${attribute.id}`}
                      onChange={event =>
                        onChange(attribute.id, event.target.value)
                      }
                      value={getAttributeValue(attribute.id, attributes)}
                      choices={getAttributeValueChoices(
                        attribute.id,
                        attributes
                      )}
                      allowCustomValues
                      data-test="variant-attribute-input"
                    />
                  </div>
                  {!attribute.data.isRequired && (
                    <div>
                      <IconButton
                        color="primary"
                        onClick={() => onRemove(attribute.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  )}
                </Grid>
                <Hr />
              </div>
            ))
          )}
        </div>
        {errors.length > 0 && (
          <>
            <FormSpacer />
            {errors
              .filter(error => error.field === "attributes")
              .map(error => (
                <Typography color="error" key={error.code}>
                  {getProductVariantAttributeErrorMessage(error, intl)}
                </Typography>
              ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};
ProductVariantAttributes.displayName = "ProductVariantAttributes";
export default ProductVariantAttributes;
