import makeStyles from "@material-ui/core/styles/makeStyles";
import Hr from "@saleor/components/Hr";
import RadioGroupField, {
  RadioGroupFieldChoice
} from "@saleor/components/RadioGroupField";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { CsvErrorFragment } from "@saleor/products/types/CsvErrorFragment";
import {
  ExportProductsInput,
  ExportScope,
  FileTypesEnum
} from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import getCsvErrorMessage from "@saleor/utils/errors/csv";
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

export interface ProductExportDialogSettingsProps {
  data: ExportProductsInput;
  errors: CsvErrorFragment[];
  onChange: (event: ChangeEvent) => void;
}

const formFields: Array<keyof ExportProductsInput> = ["fileType", "scope"];

const ProductExportDialogSettings: React.FC<ProductExportDialogSettingsProps> = ({
  data,
  errors,
  onChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const formErrors = getFormErrors(formFields, errors);

  const productsToExportChoices: Array<RadioGroupFieldChoice<ExportScope>> = [
    {
      label: intl.formatMessage({
        defaultMessage: "All products",
        description: "export all products to csv file"
      }),
      value: ExportScope.ALL
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Selected products",
        description: "export selected products to csv file"
      }),
      value: ExportScope.IDS
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Current search",
        description: "export filtered products to csv file"
      }),
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
        hint={getCsvErrorMessage(formErrors.scope, intl)}
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
        hint={getCsvErrorMessage(formErrors.fileType, intl)}
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
