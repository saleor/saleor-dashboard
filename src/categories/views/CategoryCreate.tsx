import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { maybe } from "../../misc";
import CategoryCreatePage from "../components/CategoryCreatePage";
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

  const handleSuccess = (data: CategoryCreate) => {
    if (data.categoryCreate.errors.length === 0) {
      notify({
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

  const errors = maybe(
    () => createCategoryResult.data.categoryCreate.errors,
    []
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
        errors={errors}
        disabled={createCategoryResult.loading}
        onBack={() =>
          navigate(parentId ? categoryUrl(parentId) : categoryListUrl())
        }
        onSubmit={formData =>
          createCategory({
            variables: {
              input: {
                descriptionJson: JSON.stringify(formData.description),
                name: formData.name,
                seo: {
                  description: formData.seoDescription,
                  title: formData.seoTitle
                }
              },
              parent: parentId || null
            }
          })
        }
      />
    </>
  );
};
export default CategoryCreateView;
