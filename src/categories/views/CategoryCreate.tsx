import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";

import CategoryCreatePage from "../components/CategoryCreatePage";
import { CategoryCreateData } from "../components/CategoryCreatePage/form";
import { useCategoryCreateMutation } from "../mutations";
import { CategoryCreate } from "../types/CategoryCreate";
import { categoryListUrl, categoryUrl } from "../urls";

interface CategoryCreateViewProps {
  parentId: string;
}

export const CategoryCreateView: React.FC<CategoryCreateViewProps> = ({
  parentId
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const handleSuccess = (data: CategoryCreate) => {
    if (data.categoryCreate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Category created"
        })
      });
      navigate(categoryUrl(data.categoryCreate.category.id));
    }
  };

  const [createCategory, createCategoryResult] = useCategoryCreateMutation({
    onCompleted: handleSuccess
  });

  const handleCreate = async (formData: CategoryCreateData) => {
    const result = await createCategory({
      variables: {
        input: {
          descriptionJson: JSON.stringify(formData.description),
          name: formData.name,
          seo: {
            description: formData.seoDescription,
            title: formData.seoTitle
          },
          slug: formData.slug
        },
        parent: parentId || null
      }
    });

    return result.data?.categoryCreate.category?.id || null;
  };
  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata
  );

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Create category",
          description: "window title"
        })}
      />
      <CategoryCreatePage
        saveButtonBarState={createCategoryResult.status}
        errors={createCategoryResult.data?.categoryCreate.errors || []}
        disabled={createCategoryResult.loading}
        onBack={() =>
          navigate(parentId ? categoryUrl(parentId) : categoryListUrl())
        }
        onSubmit={handleSubmit}
      />
    </>
  );
};
export default CategoryCreateView;
