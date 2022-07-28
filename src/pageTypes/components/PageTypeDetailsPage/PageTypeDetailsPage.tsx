import { Typography } from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import {
  AttributeTypeEnum,
  PageErrorFragment,
  PageTypeDetailsFragment,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import { commonMessages, sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { pageTypeListUrl } from "@saleor/pageTypes/urls";
import { ListActions, ReorderEvent } from "@saleor/types";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PageTypeAttributes from "../PageTypeAttributes/PageTypeAttributes";
import PageTypeDetails from "../PageTypeDetails/PageTypeDetails";

export interface PageTypeForm extends MetadataFormData {
  name: string;
  attributes: SingleAutocompleteChoiceType[];
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
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    onSubmit({
      ...data,
      metadata,
      privateMetadata,
    });
  };

  return (
    <Form
      confirmLeave
      initial={formInitialData}
      onSubmit={handleSubmit}
      disabled={disabled}
    >
      {({ change, data, isSaveDisabled, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <Backlink href={pageTypeListUrl()}>
              {intl.formatMessage(sectionNames.pageTypes)}
            </Backlink>
            <PageHeader title={pageTitle} />
            <Grid variant="inverted">
              <div>
                <Typography>
                  {intl.formatMessage(commonMessages.generalInformations)}
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage
                    id="kZfIl/"
                    defaultMessage="These are general information about this Content Type."
                  />
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
                    id="iQxjow"
                    defaultMessage="Content Attributes"
                    description="section header"
                  />
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage
                    id="lct0qd"
                    defaultMessage="This list shows all attributes that will be assigned to pages that have this page type assigned."
                  />
                </Typography>
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
                <Typography>
                  <FormattedMessage
                    id="OVOU1z"
                    defaultMessage="Metadata"
                    description="section header"
                  />
                </Typography>
              </div>
              <Metadata data={data} onChange={changeMetadata} />
            </Grid>
            <Savebar
              onCancel={() => navigate(pageTypeListUrl())}
              onDelete={onDelete}
              onSubmit={submit}
              disabled={isSaveDisabled}
              state={saveButtonBarState}
            />
          </Container>
        );
      }}
    </Form>
  );
};
PageTypeDetailsPage.displayName = "PageTypeDetailsPage";
export default PageTypeDetailsPage;
