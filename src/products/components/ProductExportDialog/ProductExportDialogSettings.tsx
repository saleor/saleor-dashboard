import makeStyles from "@material-ui/core/styles/makeStyles";
import Hr from "@saleor/components/Hr";
import RadioGroupField, {
  RadioGroupFieldChoice
} from "@saleor/components/RadioGroupField";
import React from "react";
import { useIntl } from "react-intl";

export enum ProductsToExport {
  ALL,
  SEARCH,
  SELECTED
}
export enum ProductExportType {
  CSV,
  SPREADSHEET
}

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

  const productsToExportChoices: Array<RadioGroupFieldChoice<
    ProductsToExport
  >> = [
    {
      label: intl.formatMessage({
        defaultMessage: "All products",
        description: "export all products to csv file"
      }),
      value: ProductsToExport.ALL
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Selected products",
        description: "export selected products to csv file"
      }),
      value: ProductsToExport.SELECTED
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Current search",
        description: "export filtered products to csv file"
      }),
      value: ProductsToExport.SEARCH
    }
  ];

  const productExportTypeChoices: Array<RadioGroupFieldChoice<
    ProductExportType
  >> = [
    {
      label: intl.formatMessage({
        defaultMessage: "Spreadsheet for Excel, Numbers etc.",
        description: "export products as spreadsheet"
      }),
      value: ProductExportType.SPREADSHEET
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Plain CSV file",
        description: "export products as csv file"
      }),
      value: ProductExportType.CSV
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
