import makeStyles from "@material-ui/core/styles/makeStyles";
import Hr from "@saleor/components/Hr";
import RadioGroupField, {
  RadioGroupFieldChoice
} from "@saleor/components/RadioGroupField";
import { ExportScope, FileTypesEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { ProductExportType, ProductsToExport } from "./types";

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

export interface ProductExportDialogSettingsProps {}

const ProductExportDialogSettings: React.FC<ProductExportDialogSettingsProps> = () => {
  const classes = useStyles({});
  const intl = useIntl();

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
        label={intl.formatMessage({
          defaultMessage: "Export information for:",
          description: "export products to csv file, choice field label"
        })}
        onChange={() => undefined}
        value={ProductsToExport.ALL}
      />
      <Hr className={classes.hr} />
      <RadioGroupField
        choices={productExportTypeChoices}
        label={intl.formatMessage({
          defaultMessage: "Export as:",
          description: "export products as csv or spreadsheet file"
        })}
        onChange={() => undefined}
        value={ProductExportType.CSV}
      />
    </>
  );
};

ProductExportDialogSettings.displayName = "ProductExportDialogSettings";
export default ProductExportDialogSettings;
