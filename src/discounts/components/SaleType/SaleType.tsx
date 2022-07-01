import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import RadioGroupField, {
  RadioGroupFieldChoice,
} from "@saleor/components/RadioGroupField";
import { SaleType as SaleTypeEnum } from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import { SaleDetailsPageFormData } from "../SaleDetailsPage";

export interface SaleTypeProps {
  data: SaleDetailsPageFormData;
  disabled: boolean;
  onChange: FormChange;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      "&&": {
        paddingBottom: theme.spacing(1.5),
      },
    },
  }),
  {
    name: "SaleType",
  },
);

function createChoices(intl: IntlShape): RadioGroupFieldChoice[] {
  return [
    {
      label: intl.formatMessage({
        id: "s17U7u",
        defaultMessage: "Percentage",
        description: "discount type",
      }),
      value: SaleTypeEnum.PERCENTAGE,
    },
    {
      label: intl.formatMessage({
        id: "JnzDrI",
        defaultMessage: "Fixed Amount",
        description: "discount type",
      }),
      value: SaleTypeEnum.FIXED,
    },
  ];
}

const SaleType: React.FC<SaleTypeProps> = props => {
  const { data, disabled, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const choices = createChoices(intl);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "WkxE8/",
          defaultMessage: "Discount Type",
          description: "percentage or fixed, header",
        })}
      />
      <CardContent className={classes.root}>
        <RadioGroupField
          choices={choices}
          disabled={disabled}
          name={"type" as keyof SaleDetailsPageFormData}
          value={data.type}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};

SaleType.displayName = "SaleType";
export default SaleType;
