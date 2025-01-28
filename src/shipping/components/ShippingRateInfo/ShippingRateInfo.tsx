// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import RichTextEditor from "@dashboard/components/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { ShippingErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getShippingErrorMessage from "@dashboard/utils/errors/shipping";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { OutputData } from "@editorjs/editorjs";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import * as React from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  maxDays: {
    id: "v17Lly",
    defaultMessage: "Max Delivery Time",
    description: "label",
  },
  minDays: {
    id: "GD/bom",
    defaultMessage: "Min Delivery Time",
    description: "label",
  },
  name: {
    id: "FkDObY",
    defaultMessage: "Shipping rate name",
    description: "label",
  },
  description: {
    id: "TLYeo5",
    defaultMessage: "Shipping Rate Description",
    description: "label",
  },
});
const useStyles = makeStyles(
  theme => ({
    deliveryTimeFields: {
      display: "grid",
      gridColumnGap: theme.spacing(1),
      gridRowGap: theme.spacing(1),
      gridTemplateColumns: "1fr 1fr 1fr",
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr 1fr",
      },
      [theme.breakpoints.down("xs")]: {
        gridTemplateColumns: "1fr",
      },
    },
  }),
  { name: "ShippingRateInfo" },
);

export interface ShippingRateInfoProps {
  data: {
    description: OutputData | null;
    name: string;
    maxDays: string;
    minDays: string;
  };
  disabled: boolean;
  errors: ShippingErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ShippingRateInfo = (props: ShippingRateInfoProps) => {
  const { data, disabled, errors, onChange } = props;
  const intl = useIntl();
  const classes = useStyles(props);
  const { defaultValue, editorRef, isReadyForMount, handleChange } = useRichTextContext();
  const formErrors = getFormErrors(["name", "description", "minDays", "maxDays"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <TextField
          disabled={disabled}
          error={!!formErrors.name}
          fullWidth
          helperText={getShippingErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage(messages.name)}
          name="name"
          data-test-id="shipping-rate-name-input"
          value={data.name}
          onChange={onChange}
        />
        <CardSpacer />
        {isReadyForMount ? (
          <RichTextEditor
            defaultValue={defaultValue}
            editorRef={editorRef}
            onChange={handleChange}
            disabled={disabled}
            error={!!formErrors.description}
            helperText={getShippingErrorMessage(formErrors.description, intl)}
            label={intl.formatMessage(messages.description)}
            name="description"
          />
        ) : (
          <RichTextEditorLoading
            label={intl.formatMessage(messages.description)}
            name="description"
          />
        )}
        <CardSpacer />
        <div className={classes.deliveryTimeFields}>
          <TextField
            data-test-id="min-delivery-time-input"
            disabled={disabled}
            error={!!formErrors.minDays}
            fullWidth
            helperText={getShippingErrorMessage(formErrors.minDays, intl)}
            label={intl.formatMessage(messages.minDays)}
            type="number"
            inputProps={{
              min: 0,
              type: "number",
            }}
            InputProps={{ inputProps: { min: 0 } }}
            name="minDays"
            value={data.minDays}
            onChange={onChange}
          />
          <TextField
            data-test-id="max-delivery-time-input"
            disabled={disabled}
            error={!!formErrors.maxDays}
            fullWidth
            helperText={getShippingErrorMessage(formErrors.maxDays, intl)}
            label={intl.formatMessage(messages.maxDays)}
            type="number"
            inputProps={{
              min: 0,
              type: "number",
            }}
            InputProps={{ inputProps: { min: 0 } }}
            name="maxDays"
            value={data.maxDays}
            onChange={onChange}
          />
        </div>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ShippingRateInfo.displayName = "ShippingRateInfo";
export default ShippingRateInfo;
