import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { maybe } from "../../misc";
import PageDetailsPage from "../components/PageDetailsPage";
import { TypedPageCreate } from "../mutations";
import { PageCreate as PageCreateData } from "../types/PageCreate";
import { pageListUrl, pageUrl } from "../urls";

export interface PageCreateProps {
  id: string;
}

export const PageCreate: React.FC<PageCreateProps> = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handlePageCreate = (data: PageCreateData) => {
    if (data.pageCreate.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Successfully created new page"
        })
      });
      navigate(pageUrl(data.pageCreate.page.id));
    }
  };

  return (
    <TypedPageCreate onCompleted={handlePageCreate}>
      {(pageCreate, pageCreateOpts) => (
        <>
          <WindowTitle
            title={intl.formatMessage({
              defaultMessage: "Create Page",
              description: "header"
            })}
          />
          <PageDetailsPage
            disabled={pageCreateOpts.loading}
            errors={maybe(() => pageCreateOpts.data.pageCreate.errors, [])}
            saveButtonBarState={pageCreateOpts.status}
            page={null}
            onBack={() => navigate(pageListUrl())}
            onRemove={() => undefined}
            onSubmit={formData =>
              pageCreate({
                variables: {
                  input: {
                    contentJson: JSON.stringify(formData.content),
                    isPublished: formData.isPublished,
                    publicationDate: formData.isPublished
                      ? null
                      : formData.publicationDate === ""
                      ? null
                      : formData.publicationDate,
                    seo: {
                      description: formData.seoDescription,
                      title: formData.seoTitle
                    },
                    slug: formData.slug === "" ? null : formData.slug,
                    title: formData.title
                  }
                }
              })
            }
          />
        </>
      )}
    </TypedPageCreate>
  );
};
PageCreate.displayName = "PageCreate";
export default PageCreate;
