// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { type MetadataFormData } from "@dashboard/components/Metadata/types";
import { Savebar } from "@dashboard/components/Savebar";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForPageTypeDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  AttributeTypeEnum,
  type PageErrorFragment,
  type PageTypeDetailsFragment,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { defaultGraphiQLQuery } from "@dashboard/modelTypes/queries";
import { modelTypesPath } from "@dashboard/modelTypes/urls";
import { type ListActions, type ReorderEvent } from "@dashboard/types";
import { type Option } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import PageTypeAttributes from "../PageTypeAttributes/PageTypeAttributes";
import PageTypeDetails from "../PageTypeDetails/PageTypeDetails";
import { messages } from "./messages";

export interface PageTypeForm extends MetadataFormData {
  name: string;
  attributes: Option[];
}

interface PageTypeDetailsPageProps {
  errors: PageErrorFragment[];
  pageType: PageTypeDetailsFragment;
  disabled: boolean;
  pageTitle: string;
  attributeList: ListActions;
  saveButtonBarState: ConfirmButtonTransitionState;
  onAttributeAdd: (type: AttributeTypeEnum) => void;
  onAttributeCreate: (type: AttributeTypeEnum) => void;
  onAttributeReorder: (event: ReorderEvent, type: AttributeTypeEnum) => void;
  onAttributeUnassign: (id: string) => void;
  onDelete: () => void;
  onShowMetadata: () => void;
  onSubmit: (data: PageTypeForm) => void;
}

const PageTypeDetailsPage = (props: PageTypeDetailsPageProps) => {
  const {
    disabled,
    errors,
    pageTitle,
    pageType,
    attributeList,
    saveButtonBarState,
    onAttributeAdd,
    onAttributeCreate,
    onAttributeUnassign,
    onAttributeReorder,
    onDelete,
    onShowMetadata,
    onSubmit,
  } = props;
  const intl = useIntl();
  const navigate = useNavigator();
  const context = useDevModeContext();
  const openPlaygroundURL = () => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${pageType?.id}" }`);
    context.setDevModeVisibility(true);
  };
  const formInitialData: PageTypeForm = {
    attributes:
      pageType?.attributes?.map(attribute => ({
        label: attribute.name,
        value: attribute.id,
      })) || [],
    metadata: [],
    name: pageType?.name || "",
    privateMetadata: [],
  };

  const pageTypeListBackLink = useBackLinkWithState({
    path: modelTypesPath,
  });

  const { PAGE_TYPE_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.PAGE_TYPE_DETAILS);
  const extensionMenuItems = getExtensionsItemsForPageTypeDetails(
    PAGE_TYPE_DETAILS_MORE_ACTIONS,
    pageType?.id,
  );

  return (
    <Form confirmLeave initial={formInitialData} onSubmit={onSubmit} disabled={disabled}>
      {({ change, data, isSaveDisabled, submit }) => (
        <DetailPageLayout>
          <TopNav href={pageTypeListBackLink} title={pageTitle} actionsGap={3}>
            <TopNav.MetadataButton
              onClick={onShowMetadata}
              disabled={!pageType}
              data-test-id="show-model-type-metadata"
              title={intl.formatMessage(messages.editModelTypeMetadata)}
            />
            <TopNav.Menu
              items={[
                ...extensionMenuItems,
                {
                  label: intl.formatMessage(messages.openGraphiQL),
                  onSelect: openPlaygroundURL,
                  testId: "graphiql-redirect",
                },
              ]}
              dataTestId="menu"
            />
          </TopNav>
          <DetailPageLayout.Content>
            <PageTypeAttributes
              attributes={pageType?.attributes}
              disabled={disabled}
              type={AttributeTypeEnum.PAGE_TYPE}
              onAttributeAssign={onAttributeAdd}
              onAttributeCreate={onAttributeCreate}
              onAttributeReorder={(event: ReorderEvent) =>
                onAttributeReorder(event, AttributeTypeEnum.PAGE_TYPE)
              }
              onAttributeUnassign={onAttributeUnassign}
              {...attributeList}
            />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <PageTypeDetails data={data} disabled={disabled} errors={errors} onChange={change} />
          </DetailPageLayout.RightSidebar>
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
      )}
    </Form>
  );
};

PageTypeDetailsPage.displayName = "PageTypeDetailsPage";
export default PageTypeDetailsPage;
