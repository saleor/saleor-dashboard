import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Accordion from "@saleor/components/Accordion";
import Hr from "@saleor/components/Hr";
import RadioGroupField, {
  RadioGroupFieldChoice
} from "@saleor/components/RadioGroupField";
import { ExportErrorFragment } from "@saleor/fragments/types/ExportErrorFragment";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { buttonMessages } from "@saleor/intl";
import {
  ExportProductsInput,
  ExportScope,
  FileTypesEnum,
  ProductFieldEnum
} from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import getExportErrorMessage from "@saleor/utils/errors/export";
import React from "react";
import { useIntl } from "react-intl";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    checkbox: {
      position: "relative",
      right: -theme.spacing(1.5)
    },
    dialogLabel: {
      marginBottom: theme.spacing(2)
    },
    hr: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3)
    },
    label: {
      "&&": {
        overflow: "visible"
      },
      justifyContent: "space-between",
      margin: theme.spacing(0),
      width: "100%"
    }
  }),
  {
    name: "ProductExportDialogInfo"
  }
);

const Option: React.FC<{ checked: boolean }> = ({ checked, children }) => {
  const classes = useStyles({});

  return (
    <FormControlLabel
      color="primary"
      control={
        <Checkbox
          className={classes.checkbox}
          color="primary"
          checked={checked}
        />
      }
      className={classes.label}
      label={children}
      labelPlacement="start"
    ></FormControlLabel>
  );
};

export interface ProductExportDialogInfoProps {
  data: ExportProductsInput;
  errors: ExportErrorFragment[];
  onChange: (event: ChangeEvent) => void;
}

const formFields: Array<keyof ExportProductsInput> = ["fileType", "scope"];

const ProductExportDialogInfo: React.FC<ProductExportDialogInfoProps> = ({
  data,
  errors,
  onChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const formErrors = getFormErrors(formFields, errors);

  const fields: Record<ProductFieldEnum, string> = {
    [ProductFieldEnum.CATEGORY]: intl.formatMessage({
      defaultMessage: "Category",
      description: "product field"
    }),
    [ProductFieldEnum.CHARGE_TAXES]: intl.formatMessage({
      defaultMessage: "Charge Taxes",
      description: "product field"
    }),
    [ProductFieldEnum.COLLECTIONS]: intl.formatMessage({
      defaultMessage: "Collections",
      description: "product field"
    }),
    [ProductFieldEnum.COST_PRICE]: intl.formatMessage({
      defaultMessage: "Cost Price",
      description: "product field"
    }),
    [ProductFieldEnum.DESCRIPTION]: intl.formatMessage({
      defaultMessage: "Description",
      description: "product field"
    }),
    [ProductFieldEnum.NAME]: intl.formatMessage({
      defaultMessage: "Name",
      description: "product field"
    }),
    [ProductFieldEnum.PRODUCT_IMAGES]: intl.formatMessage({
      defaultMessage: "Product Images",
      description: "product field"
    }),
    [ProductFieldEnum.PRODUCT_TYPE]: intl.formatMessage({
      defaultMessage: "Type",
      description: "product field"
    }),
    [ProductFieldEnum.PRODUCT_WEIGHT]: intl.formatMessage({
      defaultMessage: "Weight",
      description: "product field"
    }),
    [ProductFieldEnum.VARIANT_IMAGES]: intl.formatMessage({
      defaultMessage: "Variant Images",
      description: "product field"
    }),
    [ProductFieldEnum.VARIANT_PRICE]: intl.formatMessage({
      defaultMessage: "Variant Price",
      description: "product field"
    }),
    [ProductFieldEnum.VARIANT_SKU]: intl.formatMessage({
      defaultMessage: "SKU",
      description: "product field"
    }),
    [ProductFieldEnum.VARIANT_WEIGHT]: intl.formatMessage({
      defaultMessage: "Variant Weight",
      description: "product field"
    }),
    [ProductFieldEnum.VISIBLE]: intl.formatMessage({
      defaultMessage: "Visibility",
      description: "product field"
    })
  };

  return (
    <>
      <Typography className={classes.dialogLabel}>
        <FormattedMessage
          defaultMessage="Information exported:"
          description="select product informations to be exported"
        />
      </Typography>
      <Accordion
        title={intl.formatMessage({
          defaultMessage: "Product Organization",
          description: "informations about product organization, header"
        })}
      >
        <Option checked={true}>
          {intl.formatMessage(buttonMessages.selectAll)}
        </Option>
        <Hr className={classes.hr} />
        {Object.keys(fields).map(field => (
          <Option checked={data.exportInfo.fields[field]} key={field}>
            {fields[field]}
          </Option>
        ))}
      </Accordion>
    </>
  );
};

ProductExportDialogInfo.displayName = "ProductExportDialogInfo";
export default ProductExportDialogInfo;
