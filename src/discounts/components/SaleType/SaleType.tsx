import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import RadioGroupField, {
  RadioGroupFieldChoice
} from "@saleor/components/RadioGroupField";
import { FormChange } from "@saleor/hooks/useForm";
import { SaleType as SaleTypeEnum } from "@saleor/types/globalTypes";
import { FormData } from "../SaleDetailsPage";

export interface SaleTypeProps {
  data: FormData;
  disabled: boolean;
  onChange: FormChange;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      "&&": {
        paddingBottom: theme.spacing(1.5)
      }
    }
  }),
  {
    name: "SaleType"
  }
);

function createChoices(intl: IntlShape): RadioGroupFieldChoice[] {
  return [
    {
      label: intl.formatMessage({
        defaultMessage: "Percentage",
        description: "discount type"
      }),
      value: SaleTypeEnum.PERCENTAGE
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Fixed Amount",
        description: "discount type"
      }),
      value: SaleTypeEnum.FIXED
    }
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
          defaultMessage: "Discount Type",
          description: "percentage or fixed, header"
        })}
      />
      <CardContent className={classes.root}>
        <RadioGroupField
          choices={choices}
          disabled={disabled}
          name={"type" as keyof FormData}
          value={data.type}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};

SaleType.displayName = "SaleType";
export default SaleType;
