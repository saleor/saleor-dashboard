// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { PageDetailsFragment, PageErrorFragment } from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { FetchMoreProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { DynamicCombobox, Option, Text } from "@saleor/macaw-ui-next";
import React, { useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageFormData } from "../PageDetailsPage/form";

export interface PageOrganizeContentProps {
  canChangeType: boolean;
  data: PageFormData;
  pageType?: PageDetailsFragment["pageType"];
  pageTypeInputDisplayValue?: string;
  errors: PageErrorFragment[];
  disabled: boolean;
  pageTypes: Option[];
  onPageTypeChange?: FormChange;
  fetchPageTypes?: (data: string) => void;
  fetchMorePageTypes?: FetchMoreProps;
}

const PageOrganizeContent: React.FC<PageOrganizeContentProps> = props => {
  const {
    canChangeType,
    data,
    pageType,
    pageTypeInputDisplayValue,
    errors,
    disabled,
    pageTypes,
    onPageTypeChange,
    fetchPageTypes,
    fetchMorePageTypes,
  } = props;
  const intl = useIntl();
  const formErrors = getFormErrors(["pageType"], errors);
  const mounted = useRef(false);
  const debouncedFetch = useDebounce(fetchPageTypes, 500);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "TPP7j+",
            defaultMessage: "Organize Model",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {canChangeType ? (
          <DynamicCombobox
            autoComplete="off"
            data-test-id="page-types-autocomplete-select"
            disabled={disabled}
            error={!!formErrors.pageType}
            helperText={getPageErrorMessage(formErrors.pageType, intl)}
            label={intl.formatMessage({
              id: "WVrHXL",
              defaultMessage: "Select model type",
            })}
            options={pageTypes ?? []}
            name="pageType"
            value={
              data.pageType?.id
                ? {
                    label: pageTypeInputDisplayValue,
                    value: data.pageType?.id,
                  }
                : null
            }
            onChange={(option: Option | null) => {
              onPageTypeChange?.({
                target: { name: "pageType", value: option?.value ?? null },
              });
            }}
            onInputValueChange={debouncedFetch}
            onFocus={() => {
              if (!mounted.current) {
                mounted.current = true;
                fetchPageTypes?.("");
              }
            }}
            onScrollEnd={() => {
              if (fetchMorePageTypes?.hasMore) {
                fetchMorePageTypes.onFetchMore();
              }
            }}
            loading={fetchMorePageTypes?.loading || fetchMorePageTypes?.hasMore}
            locale={{
              loadingText: intl.formatMessage(commonMessages.loading),
            }}
            size="small"
          />
        ) : (
          <>
            <Text size={2} fontWeight="light" display="block">
              <FormattedMessage id="9FCrIN" defaultMessage="Model type" />
            </Text>
            <Text>{pageType?.name}</Text>
          </>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

PageOrganizeContent.displayName = "PageOrganizeContent";
export default PageOrganizeContent;
