import { Typography } from "@material-ui/core";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { sectionNames } from "@saleor/intl";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import GiftCardSettingsList from "./GiftCardSettingsList";
import { giftCardSettingsMessages } from "./messages";

interface GiftCardSettingsPageProps {
  onBack: () => void;
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
}

const GiftCardSettingsPage: React.FC<GiftCardSettingsPageProps> = ({
  onBack,
  disabled,
  saveButtonBarState
}) => {
  const intl = useIntl();

  return (
    <Form
      initial={{
        setGiftCardExpirationPeriod: false
      }}
    >
      {({ data, submit, hasChanged, change }) => (
        <Container>
          <Backlink onClick={onBack}>
            {intl.formatMessage(sectionNames.giftCards)}
          </Backlink>
          <PageHeader
            title={intl.formatMessage(giftCardSettingsMessages.title)}
            underline={true}
          />
          <Grid variant="inverted">
            <div>
              <Typography>
                <FormattedMessage
                  {...giftCardSettingsMessages.expiryDateSectionDescription}
                />
              </Typography>
            </div>
            <GiftCardSettingsList
              data={data}
              disabled={disabled}
              onChange={change}
            />
          </Grid>
          <Savebar
            onCancel={onBack}
            onSubmit={submit}
            disabled={disabled || !hasChanged}
            state={saveButtonBarState}
          />
        </Container>
      )}
    </Form>
  );
};

export default GiftCardSettingsPage;
