// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import { MetadataFormData } from "@dashboard/components/Metadata/types";
import { Savebar } from "@dashboard/components/Savebar";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForPageTypeDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { AttributeTypeEnum, PageErrorFragment, PageTypeDetailsFragment } from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import useNavigator from "@dashboard/hooks/useNavigator";
import { modelTypesPath } from "@dashboard/modelTypes/urls";
import { ListActions, ReorderEvent } from "@dashboard/types";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { Option } from "@saleor/macaw-ui-next";

import PageTypeAttributes from "../PageTypeAttributes/PageTypeAttributes";
import PageTypeDetails from "../PageTypeDetails/PageTypeDetails";

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
  onAttributeReorder: (event: ReorderEvent, type: AttributeTypeEnum) => void;
  onAttributeUnassign: (id: string) => void;
  onDelete: () => void;
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
    onAttributeUnassign,
    onAttributeReorder,
    onDelete,
    onSubmit,
  } = props;
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
    path: modelTypesPath,
  });

  const { PAGE_TYPE_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.PAGE_TYPE_DETAILS);
  const extensionMenuItems = getExtensionsItemsForPageTypeDetails(
    PAGE_TYPE_DETAILS_MORE_ACTIONS,
    pageType?.id,
  );

  return (
    <Form confirmLeave initial={formInitialData} onSubmit={handleSubmit} disabled={disabled}>
      {({ change, data, isSaveDisabled, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <DetailPageLayout>
            <TopNav href={pageTypeListBackLink} title={pageTitle}>
              {extensionMenuItems.length > 0 && (
                <TopNav.Menu items={[...extensionMenuItems]} dataTestId="menu" />
              )}
            </TopNav>
            <DetailPageLayout.Content>
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
              <Metadata data={data} onChange={changeMetadata} />
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
        );
      }}
    </Form>
  );
};

PageTypeDetailsPage.displayName = "PageTypeDetailsPage";
export default PageTypeDetailsPage;
