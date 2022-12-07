import { AppPagePathSegment } from "@saleor/apps/hooks/useAppsPageNavigation";
import { PageTab, PageTabs } from "@saleor/macaw-ui";
import React, { ComponentProps } from "react";
import { useIntl } from "react-intl";

/**
 * Bind tab value to path segment to avoid unnecessary mapping
 */
const TabValue: Record<string, AppPagePathSegment> = {
  SALEOR_APPS: "saleor-apps",
  THIRD_PARTY: "third-party",
};

type AllProps = ComponentProps<typeof PageTabs>;
type AvailableProps = Omit<AllProps, "children" | "onChange" | "value"> & {
  value: AppPagePathSegment;
  showSaleorApps: boolean;
  onChange(newValue: AppPagePathSegment): void;
};

export const AppPageTabs = ({ showSaleorApps, ...props }: AvailableProps) => {
  const intl = useIntl();
  return (
    <PageTabs {...props}>
      <PageTab
        value={TabValue.THIRD_PARTY}
        label={intl.formatMessage({
          defaultMessage: "3rd party apps",
          id: "J8frvS",
        })}
      />
      {showSaleorApps && (
        <PageTab
          value={TabValue.SALEOR_APPS}
          label={intl.formatMessage({
            defaultMessage: "Saleor Apps",
            id: "+niGip",
          })}
        />
      )}
    </PageTabs>
  );
};
