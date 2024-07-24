// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { Combobox } from "@dashboard/components/Combobox";
import { PageDetailsFragment, PageErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { FetchMoreProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { Option, Text } from "@saleor/macaw-ui-next";
import React from "react";
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

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "jU9GPX",
            defaultMessage: "Organize Content",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {canChangeType ? (
          <Combobox
            autoComplete="off"
            data-test-id="page-types-autocomplete-select"
            disabled={disabled}
            error={!!formErrors.pageType}
            helperText={getPageErrorMessage(formErrors.pageType, intl)}
            label={intl.formatMessage({
              id: "W5SK5c",
              defaultMessage: "Select content type",
            })}
            options={pageTypes}
            fetchOptions={fetchPageTypes}
            fetchMore={fetchMorePageTypes}
            name="pageType"
            value={{
              label: pageTypeInputDisplayValue,
              value: data.pageType?.id,
            }}
            onChange={onPageTypeChange}
          />
        ) : (
          <>
            <Text size={2} fontWeight="light" display="block">
              <FormattedMessage id="ufD5Jr" defaultMessage="Content type" />
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
