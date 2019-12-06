import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { maybe } from "../../misc";
import { PageInput } from "../../types/globalTypes";
import PageDetailsPage, { FormData } from "../components/PageDetailsPage";
import { TypedPageRemove, TypedPageUpdate } from "../mutations";
import { TypedPageDetailsQuery } from "../queries";
import { PageRemove } from "../types/PageRemove";
import { pageListUrl, pageUrl, PageUrlQueryParams } from "../urls";

export interface PageDetailsProps {
  id: string;
  params: PageUrlQueryParams;
}

const createPageInput = (data: FormData): PageInput => ({
  contentJson: JSON.stringify(data.content),
  isPublished: data.isPublished,
  publicationDate: data.isPublished
    ? null
    : data.publicationDate === ""
    ? null
    : data.publicationDate,
  seo: {
    description: data.seoDescription,
    title: data.seoTitle
  },
  slug: data.slug === "" ? null : data.slug,
  title: data.title
});

export const PageDetails: React.FC<PageDetailsProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handlePageRemove = (data: PageRemove) => {
    if (data.pageDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Removed page"
        })
      });
      navigate(pageListUrl());
    }
  };
  return (
    <TypedPageRemove variables={{ id }} onCompleted={handlePageRemove}>
      {(pageRemove, pageRemoveOpts) => (
        <TypedPageUpdate>
          {(pageUpdate, pageUpdateOpts) => (
            <TypedPageDetailsQuery variables={{ id }}>
              {pageDetails => (
                <>
                  <WindowTitle
                    title={maybe(() => pageDetails.data.page.title)}
                  />
                  <PageDetailsPage
                    disabled={pageDetails.loading}
                    errors={maybe(
                      () => pageUpdateOpts.data.pageUpdate.errors,
                      []
                    )}
                    saveButtonBarState={pageUpdateOpts.status}
                    page={maybe(() => pageDetails.data.page)}
                    onBack={() => navigate(pageListUrl())}
                    onRemove={() =>
                      navigate(
                        pageUrl(id, {
                          action: "remove"
                        })
                      )
                    }
                    onSubmit={formData =>
                      pageUpdate({
                        variables: {
                          id,
                          input: createPageInput(formData)
                        }
                      })
                    }
                  />
                  <ActionDialog
                    open={params.action === "remove"}
                    confirmButtonState={pageRemoveOpts.status}
                    title={intl.formatMessage({
                      defaultMessage: "Delete Page",
                      description: "dialog header"
                    })}
                    onClose={() => navigate(pageUrl(id))}
                    onConfirm={pageRemove}
                    variant="delete"
                  >
                    <DialogContentText>
                      <FormattedMessage
                        defaultMessage="Are you sure you want to delete {title}?"
                        description="delete page"
                        values={{
                          title: (
                            <strong>
                              {maybe(() => pageDetails.data.page.title, "...")}
                            </strong>
                          )
                        }}
                      />
                    </DialogContentText>
                  </ActionDialog>
                </>
              )}
            </TypedPageDetailsQuery>
          )}
        </TypedPageUpdate>
      )}
    </TypedPageRemove>
  );
};
PageDetails.displayName = "PageDetails";
export default PageDetails;
