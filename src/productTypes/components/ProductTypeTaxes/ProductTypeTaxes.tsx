import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { TaxClassBaseFragment } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import { FetchMoreProps } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { ProductTypeForm } from "../ProductTypeDetailsPage/ProductTypeDetailsPage";

interface ProductTypeTaxesProps {
  data: {
    taxClassId: string;
  };
  taxClassDisplayName: string;
  taxClasses: TaxClassBaseFragment[];
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  onFetchMore: FetchMoreProps;
}

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible",
    },
  },
  { name: "ProductTypeTaxes" },
);

const ProductTypeTaxes: React.FC<ProductTypeTaxesProps> = props => {
  const {
    data,
    disabled,
    taxClasses,
    taxClassDisplayName,
    onChange,
    onFetchMore,
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card className={classes.root}>
      <CardTitle title={intl.formatMessage(sectionNames.taxes)} />
      <CardContent>
        <SingleAutocompleteSelectField
          emptyOption
          disabled={disabled}
          displayValue={taxClassDisplayName}
          label={intl.formatMessage(taxesMessages.taxClass)}
          name={"taxClassId" as keyof ProductTypeForm}
          onChange={onChange}
          value={data.taxClassId}
          choices={taxClasses.map(choice => ({
            label: choice.name,
            value: choice.id,
          }))}
          InputProps={{
            autoComplete: "off",
          }}
          {...onFetchMore}
        />
      </CardContent>
    </Card>
  );
};
ProductTypeTaxes.displayName = "ProductTypeTaxes";
export default ProductTypeTaxes;
