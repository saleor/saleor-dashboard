// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata, MetadataFormData } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { PageErrorFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { pageTypeListUrl } from "@dashboard/modelTypes/urls";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";

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

const PageTypeCreatePage: React.FC<PageTypeCreatePageProps> = props => {
  const { disabled, errors, saveButtonBarState, onSubmit } = props;
  const intl = useIntl();
  const navigate = useNavigator();
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();

  return (
    <Form confirmLeave initial={formInitialData} onSubmit={onSubmit} disabled={disabled}>
      {({ change, data, submit, isSaveDisabled }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <DetailPageLayout>
            <TopNav
              href={pageTypeListUrl()}
              title={intl.formatMessage({
                id: "Gxo/XC",
                defaultMessage: "Create model type",
                description: "header",
              })}
            />
            <DetailPageLayout.Content>
              <Metadata data={data} onChange={changeMetadata} />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <PageTypeDetails data={data} disabled={disabled} errors={errors} onChange={change} />
            </DetailPageLayout.RightSidebar>
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
