// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import { PageDetailsFragment, PageErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { pageTypeUrl } from "@dashboard/modelTypes/urls";
import { FetchMoreProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { Box, DynamicCombobox, Option, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { PageFormData } from "../PageDetailsPage/form";

interface PageOrganizeContentProps {
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

export const PageOrganizeContent = (props: PageOrganizeContentProps) => {
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
            options={pageTypes}
            onFocus={() => fetchPageTypes("")}
            onScrollEnd={() => {
              if (fetchMorePageTypes?.hasMore) {
                fetchMorePageTypes?.onFetchMore();
              }
            }}
            name="pageType"
            value={{
              label: pageTypeInputDisplayValue,
              value: data.pageType?.id,
            }}
            onChange={v =>
              onPageTypeChange({
                target: {
                  name: "pageType",
                  value: v?.value ?? "",
                },
              })
            }
          />
        ) : (
          <Box display="flex" flexDirection="column">
            <Text size={4} fontWeight="bold">
              <FormattedMessage id="9FCrIN" defaultMessage="Model type" />
            </Text>
            <Text size={2}>
              {pageType && pageType.id ? (
                <Link href={pageTypeUrl(pageType.id)}>{pageType.name}</Link>
              ) : (
                (pageType?.name ?? "-")
              )}
            </Text>
          </Box>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

PageOrganizeContent.displayName = "PageOrganizeContent";
