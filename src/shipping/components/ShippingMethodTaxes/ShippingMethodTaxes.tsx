import { DashboardCard } from "@dashboard/components/Card";
import { MicrocopyLink } from "@dashboard/components/MicrocopyLink";
import { type TaxClassBaseFragment } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { sectionNames } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { taxClassesListUrl } from "@dashboard/taxes/urls";
import { type FetchMoreProps } from "@dashboard/types";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, DynamicCombobox } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

interface ShippingMethodTaxesProps {
  value: string;
  taxClassDisplayName: string;
  taxClasses: TaxClassBaseFragment[];
  disabled: boolean;
  onChange: (event: ChangeEvent) => void;
  onFetchMore: FetchMoreProps;
}

const useStyles = makeStyles(
  {
    root: {
      overflow: "visible",
    },
  },
  { name: "ShippingMethodTaxes" },
);

export const ShippingMethodTaxes = (props: ShippingMethodTaxesProps) => {
  const { value, disabled, taxClasses, taxClassDisplayName, onChange, onFetchMore } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DashboardCard className={classes.root}>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.taxes)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <DynamicCombobox
          autoComplete="off"
          data-test-id="taxes"
          disabled={disabled}
          label={intl.formatMessage(taxesMessages.taxClass)}
          options={taxClasses.map(choice => ({
            label: choice.name,
            value: choice.id,
          }))}
          /**
           * Combobox without "Dynamic" doesnt expose onScrollEnd, when its added to Macaw, we can use simple version of this component (Combobox)
           */
          onScrollEnd={() => {
            if (onFetchMore.hasMore) {
              onFetchMore.onFetchMore();
            }
          }}
          name="taxClassId"
          value={{
            label: taxClassDisplayName,
            value,
          }}
          onChange={v =>
            onChange({
              target: {
                value: v?.value ?? "",
                name: "taxClassId",
              },
            })
          }
        />
        <Box marginTop={2}>
          <DashboardCard.Subtitle
            fontSize={3}
            color="default2"
            data-test-id="tax-class-create-hint"
          >
            <FormattedMessage
              {...taxesMessages.createTaxClassHint}
              values={{
                taxSettingsLink: (
                  <MicrocopyLink to={taxClassesListUrl()}>
                    {intl.formatMessage(taxesMessages.taxSettingsLink)}
                  </MicrocopyLink>
                ),
              }}
            />
          </DashboardCard.Subtitle>
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ShippingMethodTaxes.displayName = "ShippingMethodTaxes";
