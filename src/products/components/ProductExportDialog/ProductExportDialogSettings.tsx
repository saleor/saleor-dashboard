import makeStyles from "@material-ui/core/styles/makeStyles";
import Hr from "@saleor/components/Hr";
import RadioGroupField, {
  RadioGroupFieldChoice
} from "@saleor/components/RadioGroupField";
import { ExportErrorFragment } from "@saleor/fragments/types/ExportErrorFragment";
import { ChangeEvent } from "@saleor/hooks/useForm";
import {
  ExportProductsInput,
  ExportScope,
  FileTypesEnum
} from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import getExportErrorMessage from "@saleor/utils/errors/export";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    hr: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3)
    }
  }),
  {
    name: "ProductExportDialogSettings"
  }
);

export type ProductQuantity = Record<"all" | "filter", number>;
export interface ProductExportDialogSettingsProps {
  data: ExportProductsInput;
  errors: ExportErrorFragment[];
  productQuantity: ProductQuantity;
  selectedProducts: number;
  onChange: (event: ChangeEvent) => void;
}

const formFields: Array<keyof ExportProductsInput> = ["fileType", "scope"];

const ProductExportDialogSettings: React.FC<ProductExportDialogSettingsProps> = ({
  data,
  errors,
  onChange,
  productQuantity,
  selectedProducts
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const formErrors = getFormErrors(formFields, errors);

  const productsToExportChoices: Array<RadioGroupFieldChoice<ExportScope>> = [
    {
      label: intl.formatMessage(
        {
          defaultMessage: "All products ({number})",
          description: "export all products to csv file"
        },
        {
          number: productQuantity.all || "..."
        }
      ),
      value: ExportScope.ALL
    },
    {
      disabled: selectedProducts === 0,
      label: intl.formatMessage(
        {
          defaultMessage: "Selected products ({number})",
          description: "export selected products to csv file"
        },
        {
          number: selectedProducts
        }
      ),
      value: ExportScope.IDS
    },
    {
      label: intl.formatMessage(
        {
          defaultMessage: "Current search ({number})",
          description: "export filtered products to csv file"
        },
        {
          number: productQuantity.filter || "..."
        }
      ),
      value: ExportScope.FILTER
    }
  ];

  const productExportTypeChoices: Array<RadioGroupFieldChoice<
    FileTypesEnum
  >> = [
    {
      label: intl.formatMessage({
        defaultMessage: "Spreadsheet for Excel, Numbers etc.",
        description: "export products as spreadsheet"
      }),
      value: FileTypesEnum.XLSX
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Plain CSV file",
        description: "export products as csv file"
      }),
      value: FileTypesEnum.CSV
    }
  ];

  return (
    <>
      <RadioGroupField
        choices={productsToExportChoices}
        error={!!formErrors.scope}
        hint={getExportErrorMessage(formErrors.scope, intl)}
        label={intl.formatMessage({
          defaultMessage: "Export information for:",
          description: "export products to csv file, choice field label"
        })}
        name={"scope" as keyof ExportProductsInput}
        onChange={onChange}
        value={data.scope}
      />
      <Hr className={classes.hr} />
      <RadioGroupField
        choices={productExportTypeChoices}
        error={!!formErrors.fileType}
        hint={getExportErrorMessage(formErrors.fileType, intl)}
        label={intl.formatMessage({
          defaultMessage: "Export as:",
          description: "export products as csv or spreadsheet file"
        })}
        name={"fileType" as keyof ExportProductsInput}
        onChange={onChange}
        value={data.fileType}
      />
    </>
  );
};

ProductExportDialogSettings.displayName = "ProductExportDialogSettings";
export default ProductExportDialogSettings;
