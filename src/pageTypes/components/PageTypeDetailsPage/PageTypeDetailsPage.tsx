// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import Hr from "@dashboard/components/Hr";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import { MetadataFormData } from "@dashboard/components/Metadata/types";
import { Savebar } from "@dashboard/components/Savebar";
import { AttributeTypeEnum, PageErrorFragment, PageTypeDetailsFragment } from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { pageTypeListPath } from "@dashboard/pageTypes/urls";
import { ListActions, ReorderEvent } from "@dashboard/types";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Option, sprinkles, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PageTypeAttributes from "../PageTypeAttributes/PageTypeAttributes";
import PageTypeDetails from "../PageTypeDetails/PageTypeDetails";

export interface PageTypeForm extends MetadataFormData {
  name: string;
  attributes: Option[];
}

export interface PageTypeDetailsPageProps {
  errors: PageErrorFragment[];
  pageType: PageTypeDetailsFragment;
  disabled: boolean;
  pageTitle: string;
  attributeList: ListActions;
  saveButtonBarState: ConfirmButtonTransitionState;
  onAttributeAdd: (type: AttributeTypeEnum) => void;
  onAttributeReorder: (event: ReorderEvent, type: AttributeTypeEnum) => void;
  onAttributeUnassign: (id: string) => void;
  onDelete: () => void;
  onSubmit: (data: PageTypeForm) => void;
}

const useStyles = makeStyles(
  theme => ({
    hr: {
      gridColumnEnd: "span 2",
      margin: theme.spacing(1, 0),
    },
  }),
  {
    name: "PageTypeDetailsPage",
  },
);
const PageTypeDetailsPage: React.FC<PageTypeDetailsPageProps> = props => {
  const {
    disabled,
    errors,
    pageTitle,
    pageType,
    attributeList,
    saveButtonBarState,
    onAttributeAdd,
    onAttributeUnassign,
    onAttributeReorder,
    onDelete,
    onSubmit,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const navigate = useNavigator();
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();
  const formInitialData: PageTypeForm = {
    attributes:
      pageType?.attributes?.map(attribute => ({
        label: attribute.name,
        value: attribute.id,
      })) || [],
    metadata: pageType?.metadata?.map(mapMetadataItemToInput),
    name: pageType?.name || "",
    privateMetadata: pageType?.privateMetadata?.map(mapMetadataItemToInput),
  };
  const handleSubmit = (data: PageTypeForm) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified ? data.privateMetadata : undefined;

    onSubmit({
      ...data,
      metadata,
      privateMetadata,
    });
  };

  const pageTypeListBackLink = useBackLinkWithState({
    path: pageTypeListPath,
  });

  return (
    <Form confirmLeave initial={formInitialData} onSubmit={handleSubmit} disabled={disabled}>
      {({ change, data, isSaveDisabled, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav href={pageTypeListBackLink} title={pageTitle} />
            <DetailPageLayout.Content>
              <Grid
                variant="inverted"
                className={sprinkles({
                  paddingLeft: 9,
                  height: "100vh",
                  margin: "auto",
                })}
              >
                <Box paddingTop={6}>
                  <Text>{intl.formatMessage(commonMessages.generalInformations)}</Text>
                  <Text size={3} fontWeight="regular" display="block">
                    <FormattedMessage
                      id="kZfIl/"
                      defaultMessage="These are general information about this Content Type."
                    />
                  </Text>
                </Box>
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
                      id="iQxjow"
                      defaultMessage="Content Attributes"
                      description="section header"
                    />
                  </Text>
                  <Text size={3} fontWeight="regular" display="block">
                    <FormattedMessage
                      id="lct0qd"
                      defaultMessage="This list shows all attributes that will be assigned to pages that have this page type assigned."
                    />
                  </Text>
                </div>
                <PageTypeAttributes
                  attributes={pageType?.attributes}
                  disabled={disabled}
                  type={AttributeTypeEnum.PAGE_TYPE}
                  onAttributeAssign={onAttributeAdd}
                  onAttributeReorder={(event: ReorderEvent) =>
                    onAttributeReorder(event, AttributeTypeEnum.PAGE_TYPE)
                  }
                  onAttributeUnassign={onAttributeUnassign}
                  {...attributeList}
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
              <Savebar.DeleteButton onClick={onDelete} />
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(pageTypeListBackLink)} />
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

PageTypeDetailsPage.displayName = "PageTypeDetailsPage";
export default PageTypeDetailsPage;
