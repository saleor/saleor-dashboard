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
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForCategoryDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { CategoryDetailsQuery, PermissionEnum, ProductErrorFragment } from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { TranslationsIcon } from "@dashboard/icons/Translations";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { Box, sprinkles } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { ListProps, ListViews, RelayToFlat } from "../../../types";
import CategoryDetailsForm from "../../components/CategoryDetailsForm";
import CategoryBackground from "../CategoryBackground";
import { CategoryProducts } from "../CategoryProducts";
import { CategorySubcategories } from "../CategorySubcategories";
import CategoryUpdateForm, { CategoryUpdateData } from "./form";

export enum CategoryPageTab {
  categories = "categories",
  products = "products",
}

interface CategoryUpdatePageProps
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

export const CategoryUpdatePage = ({
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
  const intl = useIntl();
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const navigate = useNavigator();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);

  const categoryBackListUrl = useBackLinkWithState({
    path: categoryListPath,
  });

  const backHref = category?.parent?.id ? categoryUrl(category?.parent?.id) : categoryBackListUrl;

  const { CATEGORY_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.CATEGORY_DETAILS);
  const extensionMenuItems = getExtensionsItemsForCategoryDetails(
    CATEGORY_DETAILS_MORE_ACTIONS,
    categoryId,
  );

  return (
    <CategoryUpdateForm category={category} onSubmit={onSubmit} disabled={disabled}>
      {({ data, change, handlers, submit, isSaveDisabled }) => (
        <DetailPageLayout gridTemplateColumns={1}>
          <TopNav href={backHref} title={category?.name}>
            {canTranslate && (
              <TranslationsButton
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
            {extensionMenuItems.length > 0 && (
              <Box marginLeft={3}>
                <TopNav.Menu items={[...extensionMenuItems]} dataTestId="menu" />
              </Box>
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
