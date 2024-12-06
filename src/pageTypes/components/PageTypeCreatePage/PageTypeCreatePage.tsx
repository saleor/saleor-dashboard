// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import Hr from "@dashboard/components/Hr";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata, MetadataFormData } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { PageErrorFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { pageTypeListUrl } from "@dashboard/pageTypes/urls";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { makeStyles } from "@saleor/macaw-ui";
import { sprinkles, Text } from "@saleor/macaw-ui-next";
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
  onSubmit: (data: PageTypeForm) => void;
}

const formInitialData: PageTypeForm = {
  metadata: [],
  name: "",
  privateMetadata: [],
};
const useStyles = makeStyles(
  theme => ({
    hr: {
      gridColumnEnd: "span 2",
      margin: theme.spacing(1, 0),
    },
  }),
  {
    name: "PageTypeCreatePage",
  },
);
const PageTypeCreatePage = (props: PageTypeCreatePageProps) => {
  const { disabled, errors, saveButtonBarState, onSubmit } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const navigate = useNavigator();
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

  return (
    <Form confirmLeave initial={formInitialData} onSubmit={onSubmit} disabled={disabled}>
      {({ change, data, submit, isSaveDisabled }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav
              href={pageTypeListUrl()}
              title={intl.formatMessage({
                id: "caqRmN",
                defaultMessage: "Create Page Type",
                description: "header",
              })}
            />
            <DetailPageLayout.Content>
              <Grid
                variant="inverted"
                className={sprinkles({
                  padding: 9,
                  height: "100vh",
                  marginBottom: "auto",
                })}
              >
                <div>
                  <Text>{intl.formatMessage(commonMessages.generalInformations)}</Text>
                  <Text size={3} fontWeight="regular">
                    <FormattedMessage
                      id="kZfIl/"
                      defaultMessage="These are general information about this Content Type."
                    />
                  </Text>
                </div>
                <PageTypeDetails
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                />
                <Hr className={classes.hr} />
                <div>
                  <Text>
                    <FormattedMessage
                      id="OVOU1z"
                      defaultMessage="Metadata"
                      description="section header"
                    />
                  </Text>
                </div>
                <Metadata data={data} onChange={changeMetadata} />
              </Grid>
            </DetailPageLayout.Content>
            <Savebar>
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(pageTypeListUrl())} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={isSaveDisabled}
              />
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

PageTypeCreatePage.displayName = "PageTypeCreatePage";
export default PageTypeCreatePage;
