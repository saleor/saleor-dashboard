import { useUser } from "@dashboard/auth";
import { hasPermission } from "@dashboard/auth/misc";
import { categoryListPath, categoryUrl } from "@dashboard/categories/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import { Tab, TabContainer } from "@dashboard/components/Tab";
import { CategoryDetailsQuery, PermissionEnum, ProductErrorFragment } from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { TranslationsIcon } from "@dashboard/icons/Translations";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { Button, sprinkles } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ListProps, ListViews, RelayToFlat } from "../../../types";
import CategoryDetailsForm from "../../components/CategoryDetailsForm";
import CategoryBackground from "../CategoryBackground";
import { CategoryProducts } from "../CategoryProducts";
import { CategorySubcategories } from "../CategorySubcategories";
import CategoryUpdateForm, { CategoryUpdateData } from "./form";

/**
 * @enum {string}
 * 分类页面上选项卡的枚举。
 */
export enum CategoryPageTab {
  categories = "categories",
  products = "products",
}

/**
 * @interface CategoryUpdatePageProps
 * @extends {Pick<ListProps<ListViews.CATEGORY_LIST>, "onUpdateListSettings" | "settings">}
 * @property {string} categoryId - 正在更新的分类的 ID。
 * @property {(index: CategoryPageTab) => void} changeTab - 更改选项卡的回调。
 * @property {CategoryPageTab} currentTab - 当前活动的选项卡。
 * @property {ProductErrorFragment[]} errors - 要显示的错误。
 * @property {boolean} disabled - 表单是否被禁用。
 * @property {CategoryDetailsQuery["category"] | undefined | null} category - 正在更新的分类。
 * @property {RelayToFlat<NonNullable<CategoryDetailsQuery["category"]>["products"]>} [products] - 分类中的产品。
 * @property {RelayToFlat<NonNullable<CategoryDetailsQuery["category"]>["children"]>} [subcategories] - 分类的子分类。
 * @property {ConfirmButtonTransitionState} saveButtonBarState - 保存按钮的状态。
 * @property {string} addProductHref - 用于添加新产品的 URL。
 * @property {() => void} onImageDelete - 删除分类图像的回调。
 * @property {(data: CategoryUpdateData) => SubmitPromise} onSubmit - 提交表单的回调。
 * @property {() => void} onCategoriesDelete - 删除子分类的回调。
 * @property {() => void} onProductsDelete - 删除产品的回调。
 * @property {(ids: number[], clearSelection: () => void) => void} onSelectProductsIds - 选择产品 ID 的回调。
 * @property {(ids: number[], clearSelection: () => void) => void} onSelectCategoriesIds - 选择分类 ID 的回调。
 * @property {(file: File | null) => any} onImageUpload - 上传图像的回调。
 * @property {() => any} onDelete - 删除分类的回调。
 *
 * CategoryUpdatePage 组件的属性。
 */
export interface CategoryUpdatePageProps
  extends Pick<ListProps<ListViews.CATEGORY_LIST>, "onUpdateListSettings" | "settings"> {
  categoryId: string;
  changeTab: (index: CategoryPageTab) => void;
  currentTab: CategoryPageTab;
  errors: ProductErrorFragment[];
  disabled: boolean;
  category: CategoryDetailsQuery["category"] | undefined | null;
  products?: RelayToFlat<NonNullable<CategoryDetailsQuery["category"]>["products"]>;
  subcategories?: RelayToFlat<NonNullable<CategoryDetailsQuery["category"]>["children"]>;
  saveButtonBarState: ConfirmButtonTransitionState;
  addProductHref: string;
  onImageDelete: () => void;
  onSubmit: (data: CategoryUpdateData) => SubmitPromise;
  onCategoriesDelete: () => void;
  onProductsDelete: () => void;
  onSelectProductsIds: (ids: number[], clearSelection: () => void) => void;
  onSelectCategoriesIds: (ids: number[], clearSelection: () => void) => void;
  onImageUpload: (file: File | null) => any;
  onDelete: () => any;
}

const CategoriesTab = Tab(CategoryPageTab.categories);
const ProductsTab = Tab(CategoryPageTab.products);

/**
 * CategoryUpdatePage 组件，用于显示更新分类的页面。
 *
 * 此组件是用于编辑分类的所有表单和部分的容器。
 * 它处理整个页面的状态和逻辑，包括获取数据、
 * 处理用户输入和提交表单。它还包括用于管理
 * 分类中的子分类和产品的选项卡。
 *
 * @param {CategoryUpdatePageProps} props - CategoryUpdatePage 组件的属性。
 * @returns {React.ReactElement} 一个显示分类更新页面的 React 元素。
 */
export const CategoryUpdatePage: React.FC<CategoryUpdatePageProps> = ({
  categoryId,
  changeTab,
  currentTab,
  category,
  disabled,
  errors,
  products,
  saveButtonBarState,
  subcategories,
  onDelete,
  onSubmit,
  onImageDelete,
  onImageUpload,
  onSelectCategoriesIds,
  onCategoriesDelete,
  onProductsDelete,
  onSelectProductsIds,
  settings,
  onUpdateListSettings,
}: CategoryUpdatePageProps) => {
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const navigate = useNavigator();
  const intl = useIntl();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);

  const categoryBackListUrl = useBackLinkWithState({
    path: categoryListPath,
  });

  const backHref = category?.parent?.id ? categoryUrl(category?.parent?.id) : categoryBackListUrl;

  return (
    <CategoryUpdateForm category={category} onSubmit={onSubmit} disabled={disabled}>
      {({ data, change, handlers, submit, isSaveDisabled }) => (
        <DetailPageLayout gridTemplateColumns={1}>
          <TopNav href={backHref} title={category?.name}>
            {canTranslate && (
              <Button
                variant="secondary"
                icon={<TranslationsIcon />}
                onClick={() =>
                  navigate(
                    languageEntityUrl(
                      lastUsedLocaleOrFallback,
                      TranslatableEntities.categories,
                      categoryId,
                    ),
                  )
                }
              />
            )}
          </TopNav>
          <DetailPageLayout.Content>
            <CategoryDetailsForm
              data={data}
              disabled={disabled}
              errors={errors}
              onChange={change}
            />

            <CardSpacer />

            <CategoryBackground
              data={data}
              onImageUpload={onImageUpload}
              onImageDelete={onImageDelete}
              image={category?.backgroundImage}
              onChange={change}
            />

            <CardSpacer />

            <SeoForm
              helperText={intl.formatMessage({
                id: "wQdR8M",
                defaultMessage:
                  "Add search engine title and description to make this category easier to find",
              })}
              errors={errors}
              title={data.seoTitle}
              titlePlaceholder={data.name}
              description={data.seoDescription}
              descriptionPlaceholder={data.name}
              slug={data.slug}
              slugPlaceholder={data.name}
              loading={!category}
              onChange={change}
              disabled={disabled}
            />

            <CardSpacer />

            <Metadata data={data} onChange={handlers.changeMetadata} />

            <CardSpacer />

            <TabContainer className={sprinkles({ paddingX: 9 })}>
              <CategoriesTab
                isActive={currentTab === CategoryPageTab.categories}
                changeTab={changeTab}
              >
                <FormattedMessage
                  id="JDz5h8"
                  defaultMessage="Subcategories"
                  description="number of subcategories in category"
                />
              </CategoriesTab>

              <ProductsTab
                testId="products-tab"
                isActive={currentTab === CategoryPageTab.products}
                changeTab={changeTab}
              >
                <FormattedMessage
                  id="V+fkAO"
                  defaultMessage="Products"
                  description="number of products in category"
                />
              </ProductsTab>
            </TabContainer>

            <CardSpacer />

            {currentTab === CategoryPageTab.categories && (
              <CategorySubcategories
                disabled={disabled}
                onUpdateListSettings={onUpdateListSettings}
                settings={settings}
                subcategories={subcategories!}
                onCategoriesDelete={onCategoriesDelete}
                onSelectCategoriesIds={onSelectCategoriesIds}
                categoryId={categoryId}
              />
            )}

            {currentTab === CategoryPageTab.products && (
              <CategoryProducts
                category={category}
                categoryId={categoryId}
                products={products!}
                disabled={disabled}
                onProductsDelete={onProductsDelete}
                onSelectProductsIds={onSelectProductsIds}
              />
            )}

            <Savebar>
              <Savebar.DeleteButton onClick={onDelete} />
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(backHref)} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={!!isSaveDisabled}
              />
            </Savebar>
          </DetailPageLayout.Content>
        </DetailPageLayout>
      )}
    </CategoryUpdateForm>
  );
};
CategoryUpdatePage.displayName = "CategoryUpdatePage";
export default CategoryUpdatePage;
