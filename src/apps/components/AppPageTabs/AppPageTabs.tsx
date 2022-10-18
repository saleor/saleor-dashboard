import { PageTab, PageTabs } from "@saleor/macaw-ui";
import React, { ComponentProps } from "react";

export enum AppPageTabValue {
  THIRD_PARTY = "THIRD_PARTY",
  WEBHOOKS_AND_EVENTS = "WEBHOOKS_AND_EVENTS",
  SALEOR_APPS = "SALEOR_APPS",
}

type AllProps = ComponentProps<typeof PageTabs>;
type AvailableProps = Omit<AllProps, "children" | "onChange" | "value"> & {
  value: AppPageTabValue;
  showSaleorApps: boolean;
  onChange(newValue: AppPageTabValue): void;
};

// todo translation
export const AppPageTabs = ({ showSaleorApps, ...props }: AvailableProps) => (
  <PageTabs {...props}>
    <PageTab value={AppPageTabValue.THIRD_PARTY} label="3rd party apps" />
    <PageTab
      value={AppPageTabValue.WEBHOOKS_AND_EVENTS}
      label="Webhooks & Events"
    />
    {showSaleorApps && (
      <PageTab value={AppPageTabValue.SALEOR_APPS} label="Saleor Apps" />
    )}
  </PageTabs>
);
