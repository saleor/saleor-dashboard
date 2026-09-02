// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import RichTextEditor from "@dashboard/components/RichTextEditor/RichTextEditor";
import { RichTextEditorLoading } from "@dashboard/components/RichTextEditor/RichTextEditorLoading";
import { type ShippingErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getShippingErrorMessage from "@dashboard/utils/errors/shipping";
import { useRichTextContext } from "@dashboard/utils/richText/context";
import { type OutputData } from "@editorjs/editorjs";
import { makeStyles } from "@saleor/macaw-ui";
import { Input } from "@saleor/macaw-ui-next";
import type * as React from "react";
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

interface ShippingRateInfoProps {
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
        <Input
          disabled={disabled}
          error={!!formErrors.name}
          aria-invalid={!!formErrors.name}
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
          <Input
            data-test-id="min-delivery-time-input"
            disabled={disabled}
            error={!!formErrors.minDays}
            aria-invalid={!!formErrors.minDays}
            helperText={getShippingErrorMessage(formErrors.minDays, intl)}
            label={intl.formatMessage(messages.minDays)}
            type="number"
            min={0}
            name="minDays"
            value={data.minDays}
            onChange={onChange}
          />
          <Input
            data-test-id="max-delivery-time-input"
            disabled={disabled}
            error={!!formErrors.maxDays}
            aria-invalid={!!formErrors.maxDays}
            helperText={getShippingErrorMessage(formErrors.maxDays, intl)}
            label={intl.formatMessage(messages.maxDays)}
            type="number"
            min={0}
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
