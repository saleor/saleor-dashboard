import { PageTab, PageTabs } from "@saleor/macaw-ui";
import React, { ComponentProps } from "react";
import { useIntl } from "react-intl";

export type AppPageTabValue =
  | "THIRD_PARTY"
  | "WEBHOOKS_AND_EVENTS"
  | "SALEOR_APPS";

type AllProps = ComponentProps<typeof PageTabs>;
type AvailableProps = Omit<AllProps, "children" | "onChange" | "value"> & {
  value: AppPageTabValue;
  showSaleorApps: boolean;
  onChange(newValue: AppPageTabValue): void;
};

export const AppPageTabs = ({ showSaleorApps, ...props }: AvailableProps) => {
  const intl = useIntl();
  return (
    <PageTabs {...props}>
      <PageTab
        value="WEBHOOKS_AND_EVENTS"
        id="WEBHOOKS_AND_EVENTS"
        label={intl.formatMessage({
          defaultMessage: "Webhooks & Events",
          id: "UxTSw7",
        })}
      />
      <PageTab
        value="THIRD_PARTY"
        label={intl.formatMessage({
          defaultMessage: "3rd party apps",
          id: "J8frvS",
        })}
      />
      {showSaleorApps && (
        <PageTab
          value="SALEOR_APPS"
          label={intl.formatMessage({
            defaultMessage: "Saleor Apps",
            id: "+niGip",
          })}
        />
      )}
    </PageTabs>
  );
};
