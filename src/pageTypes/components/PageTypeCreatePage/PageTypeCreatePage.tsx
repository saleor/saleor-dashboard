import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import Metadata, { MetadataFormData } from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { PageErrorFragment } from "@saleor/fragments/types/PageErrorFragment";
import { commonMessages, sectionNames } from "@saleor/intl";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PageTypeDetails from "../PageTypeDetails/PageTypeDetails";

export interface PageTypeForm extends MetadataFormData {
  name: string;
}

export interface PageTypeCreatePageProps {
  errors: PageErrorFragment[];
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: PageTypeForm) => void;
}

const formInitialData: PageTypeForm = {
  metadata: [],
  name: "",
  privateMetadata: []
};

const useStyles = makeStyles(
  theme => ({
    hr: {
      gridColumnEnd: "span 2",
      margin: theme.spacing(1, 0)
    }
  }),
  {
    name: "PageTypeCreatePage"
  }
);

const PageTypeCreatePage: React.FC<PageTypeCreatePageProps> = props => {
  const { disabled, errors, saveButtonBarState, onBack, onSubmit } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  return (
    <Form initial={formInitialData} onSubmit={onSubmit} confirmLeave>
      {({ change, data, hasChanged, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.pageTypes)}
            </AppHeader>
            <PageHeader
              title={intl.formatMessage({
                defaultMessage: "Create Page Type",
                description: "header"
              })}
            />
            <Grid variant="inverted">
              <div>
                <Typography>
                  {intl.formatMessage(commonMessages.generalInformations)}
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage defaultMessage="These are general information about this Content Type." />
                </Typography>
              </div>
              <PageTypeDetails
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <Hr className={classes.hr} />
              <div>
                <Typography>
                  <FormattedMessage
                    defaultMessage="Metadata"
                    description="section header"
                  />
                </Typography>
              </div>
              <Metadata data={data} onChange={changeMetadata} />
              <div></div>
            </Grid>
            <SaveButtonBar
              onCancel={onBack}
              onSave={submit}
              disabled={disabled || !hasChanged}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};
PageTypeCreatePage.displayName = "PageTypeCreatePage";
export default PageTypeCreatePage;
