import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Hr from "@saleor/components/Hr";
import Metadata from "@saleor/components/Metadata/Metadata";
import { MetadataFormData } from "@saleor/components/Metadata/types";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { commonMessages, sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListActions, ReorderEvent, UserError } from "@saleor/types";
import { AttributeTypeEnum } from "@saleor/types/globalTypes";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

// import { PageTypeDetails_pageType } from "../../types/PageTypeDetails";
import PageTypeAttributes from "../PageTypeAttributes/PageTypeAttributes";
import PageTypeDetails from "../PageTypeDetails/PageTypeDetails";

interface ChoiceType {
  label: string;
  value: string;
}

export interface PageTypeForm extends MetadataFormData {
  name: string;
  attributes: ChoiceType[];
}

export interface PageTypeDetailsPageProps {
  errors: UserError[];
  pageType: any; // TODO FIX!!!
  disabled: boolean;
  pageTitle: string;
  attributeList: ListActions;
  saveButtonBarState: ConfirmButtonTransitionState;
  onAttributeAdd: (type: AttributeTypeEnum) => void;
  onAttributeClick: (id: string) => void;
  onAttributeReorder: (event: ReorderEvent, type: AttributeTypeEnum) => void;
  onAttributeUnassign: (id: string) => void;
  onBack: () => void;
  onDelete: () => void;
  onSubmit: (data: PageTypeForm) => void;
}

const useStyles = makeStyles(
  theme => ({
    hr: {
      gridColumnEnd: "span 2",
      margin: theme.spacing(1, 0)
    }
  }),
  {
    name: "PageTypeDetailsPage"
  }
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
    onAttributeClick,
    onBack,
    onDelete,
    onSubmit
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const formInitialData: PageTypeForm = {
    attributes:
      pageType?.attributes?.map(attribute => ({
        label: attribute.name,
        value: attribute.id
      })) || [],
    metadata: pageType?.metadata?.map(mapMetadataItemToInput),
    name: maybe(() => pageType.name) !== undefined ? pageType.name : "",
    privateMetadata: pageType?.privateMetadata?.map(mapMetadataItemToInput)
  };

  const handleSubmit = (data: PageTypeForm) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    onSubmit({
      ...data,
      metadata,
      privateMetadata
    });
  };

  return (
    <Form initial={formInitialData} onSubmit={handleSubmit} confirmLeave>
      {({ change, data, hasChanged, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.pageTypes)}
            </AppHeader>
            <PageHeader title={pageTitle} />
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
                    defaultMessage="Content Attributes"
                    description="section header"
                  />
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage defaultMessage="This list shows all attributes that will be assigned to pages that have this page type assigned." />
                </Typography>
              </div>
              <PageTypeAttributes
                attributes={pageType?.attributes}
                disabled={disabled}
                type={AttributeTypeEnum.PAGE_TYPE}
                onAttributeAssign={onAttributeAdd}
                onAttributeClick={onAttributeClick}
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
                    defaultMessage="Metadata"
                    description="section header"
                  />
                </Typography>
              </div>
              <Metadata data={data} onChange={changeMetadata} />
            </Grid>
            <SaveButtonBar
              onCancel={onBack}
              onDelete={onDelete}
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
PageTypeDetailsPage.displayName = "PageTypeDetailsPage";
export default PageTypeDetailsPage;
