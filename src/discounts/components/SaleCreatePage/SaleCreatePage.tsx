import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { sectionNames } from "@saleor/intl";
import { UserError } from "../../../types";
import { SaleType as SaleTypeEnum } from "../../../types/globalTypes";
import DiscountDates from "../DiscountDates";
import SaleInfo from "../SaleInfo";
import SaleType from "../SaleType";

export interface FormData {
  endDate: string;
  endTime: string;
  hasEndDate: boolean;
  name: string;
  startDate: string;
  startTime: string;
  type: SaleTypeEnum;
  value: string;
}

export interface SaleCreatePageProps {
  defaultCurrency: string;
  disabled: boolean;
  errors: UserError[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

const SaleCreatePage: React.FC<SaleCreatePageProps> = ({
  defaultCurrency,
  disabled,
  errors,
  onSubmit,
  saveButtonBarState,
  onBack
}) => {
  const intl = useIntl();

  const initialForm: FormData = {
    endDate: "",
    endTime: "",
    hasEndDate: false,
    name: "",
    startDate: "",
    startTime: "",
    type: SaleTypeEnum.FIXED,
    value: ""
  };
  return (
    <Form initial={initialForm} onSubmit={onSubmit}>
      {({ change, data, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.sales)}
          </AppHeader>
          <PageHeader
            title={intl.formatMessage({
              defaultMessage: "Create Sale",
              description: "page header"
            })}
          />
          <Grid>
            <div>
              <SaleInfo
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <SaleType data={data} disabled={disabled} onChange={change} />
              <CardSpacer />
              <DiscountDates
                data={data}
                disabled={disabled}
                defaultCurrency={defaultCurrency}
                errors={errors}
                onChange={change}
              />
            </div>
          </Grid>
          <SaveButtonBar
            disabled={disabled || !hasChanged}
            onCancel={onBack}
            onSave={submit}
            state={saveButtonBarState}
          />
        </Container>
      )}
    </Form>
  );
};
SaleCreatePage.displayName = "SaleCreatePage";
export default SaleCreatePage;
