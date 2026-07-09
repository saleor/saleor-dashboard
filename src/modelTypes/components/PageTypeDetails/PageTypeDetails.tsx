// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { type PageErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { Input } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface PageTypeDetailsProps {
  data?: {
    name: string;
  };
  autoFocus?: boolean;
  disabled: boolean;
  errors?: PageErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const PageTypeDetails = ({
  autoFocus = false,
  data,
  disabled,
  errors = [],
  onChange,
}: PageTypeDetailsProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocus || disabled) {
      return;
    }

    nameInputRef.current?.focus();
  }, [autoFocus, disabled]);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Input
          ref={nameInputRef}
          disabled={disabled}
          error={!!formErrors.name}
          width="100%"
          helperText={getPageErrorMessage(formErrors.name, intl)}
          label={intl.formatMessage(messages.modelTypeName)}
          name="name"
          data-test-id="page-type-name"
          onChange={onChange}
          value={data.name}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

PageTypeDetails.displayName = "PageTypeDetails";
export default PageTypeDetails;
