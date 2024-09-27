import { DashboardCard } from "@dashboard/components/Card";
import RadioGroupField, { RadioGroupFieldChoice } from "@dashboard/components/RadioGroupField";
import { SaleType as SaleTypeEnum } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { IntlShape, useIntl } from "react-intl";

import { SaleDetailsPageFormData } from "../SaleDetailsPage";

interface SaleTypeProps {
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
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "WkxE8/",
            defaultMessage: "Discount Type",
            description: "percentage or fixed, header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content className={classes.root}>
        <RadioGroupField
          choices={choices}
          disabled={disabled}
          name={"type" as keyof SaleDetailsPageFormData}
          value={data.type}
          onChange={onChange}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

SaleType.displayName = "SaleType";
export default SaleType;
