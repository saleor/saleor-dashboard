import { hasPermission } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import { defaultGraphiQLQuery } from "@dashboard/categories/queries";
import {
  categoryListPath,
  categoryUrl,
  type CategoryUrlQueryParams,
} from "@dashboard/categories/urls";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { SeoForm } from "@dashboard/components/SeoForm";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForCategoryDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  type CategoryDetailsQuery,
  PermissionEnum,
  type ProductErrorFragment,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { PaginatorContext, type PaginatorContextValues } from "@dashboard/hooks/usePaginator";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { TranslationsButton } from "@dashboard/translations/components/TranslationsButton/TranslationsButton";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FolderPlus, Trash2 } from "lucide-react";
import { type Dispatch, Fragment, type SetStateAction, useCallback, useMemo } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { type ListProps, type ListViews, type RelayToFlat } from "../../../types";
import { CategoryDetailsForm } from "../CategoryDetailsForm";
import { CategoryProducts } from "../CategoryProducts";
import { CategorySubcategories } from "../CategorySubcategories/CategorySubcategories";
import { CategorySaveCompositionHint } from "./CategorySaveCompositionHint";
import CategoryUpdateForm, { type CategoryUpdateData } from "./form";
import { messages } from "./messages";

interface CategoryUpdatePageProps
  extends Pick<ListProps<ListViews.CATEGORY_LIST>, "onUpdateListSettings" | "settings"> {
  categoryId: string;
  params: CategoryUrlQueryParams;
  errors: ProductErrorFragment[];
  disabled: boolean;
  category: CategoryDetailsQuery["category"] | undefined | null;
  backgroundImageRevision?: number;
  backgroundImageUploadPreview?: string | null;
  isBackgroundImageUploading?: boolean;
  onBackgroundImageUploadPreviewLoaded?: () => void;
  subcategories?: RelayToFlat<NonNullable<CategoryDetailsQuery["category"]>["children"]>;
  subcategoryTotalCount?: number | null;
  subcategoriesPaginator: PaginatorContextValues;
  saveButtonBarState: ConfirmButtonTransitionState;
  onImageDelete: () => void;
  onSubmit: (data: CategoryUpdateData) => SubmitPromise;
  onCategoriesDelete: () => void;
  selectedCategoryIds: string[];
  setSelectedCategoryIds: Dispatch<SetStateAction<string[]>>;
  clearCategoryRowSelection: () => void;
  excludeCategoryFromSelected: (ids: string[]) => void;
  setClearCategoryDatagridRowSelectionCallback: (callback: () => void) => void;
  onImageUpload: (file: File) => void;
  onDelete: () => void;
  onShowMetadata: () => void;
  onCreateSubcategory: () => void;
}

export const CategoryUpdatePage = ({
  categoryId,
  params,
  category,
  backgroundImageRevision = 0,
  backgroundImageUploadPreview = null,
  isBackgroundImageUploading = false,
  onBackgroundImageUploadPreviewLoaded,
  disabled,
  errors,
  saveButtonBarState,
  subcategories,
  subcategoryTotalCount,
  subcategoriesPaginator,
  onDelete,
  onSubmit,
  onImageDelete,
  onImageUpload,
  onCategoriesDelete,
  selectedCategoryIds,
  setSelectedCategoryIds,
  clearCategoryRowSelection,
  excludeCategoryFromSelected,
  setClearCategoryDatagridRowSelectionCallback,
  settings,
  onUpdateListSettings,
  onShowMetadata,
  onCreateSubcategory,
}: CategoryUpdatePageProps): JSX.Element => {
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
  const context = useDevModeContext();
  const openPlaygroundURL = useCallback(() => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${category?.id}" }`);
    context.setDevModeVisibility(true);
  }, [category?.id, context]);

  const menuItems = useMemo((): TopNavMenuItem[] => {
    const items: TopNavMenuItem[] = [...extensionMenuItems];

    if (category?.id) {
      items.push({
        label: intl.formatMessage(messages.createSubcategory),
        onSelect: onCreateSubcategory,
        testId: "create-subcategory-menu",
        icon: <FolderPlus size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
      items.push({
        label: intl.formatMessage(messages.openGraphiQL),
        onSelect: openPlaygroundURL,
        testId: "graphiql-redirect",
        icon: <GraphqlIcon />,
      });
      items.push({
        label: intl.formatMessage(messages.deleteCategory),
        onSelect: onDelete,
        testId: "delete-category",
        color: "critical1",
        icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    return items;
  }, [category, extensionMenuItems, intl, onCreateSubcategory, onDelete, openPlaygroundURL]);

  const ancestors = mapEdgesToItems(category?.ancestors);
  const breadcrumb =
    ancestors && ancestors.length > 0 ? (
      <Box display="flex" alignItems="center" gap={1} overflow="hidden" __lineHeight={1.15}>
        {ancestors.map((ancestor, index) => (
          <Fragment key={ancestor.id}>
            {index > 0 && (
              <Text size={2} color="default2" flexShrink="0" __lineHeight={1.15}>
                /
              </Text>
            )}
            <Link to={categoryUrl(ancestor.id)} style={{ textDecoration: "none", minWidth: 0 }}>
              <Text
                size={2}
                color="default2"
                ellipsis
                textDecoration={{ hover: "underline" }}
                __lineHeight={1.15}
              >
                {ancestor.name}
              </Text>
            </Link>
          </Fragment>
        ))}
      </Box>
    ) : undefined;

  return (
    <CategoryUpdateForm category={category} onSubmit={onSubmit} disabled={disabled}>
      {({ data, change, submit, isSaveDisabled, saveComposition }) => (
        <DetailPageLayout>
          <TopNav
            href={backHref}
            hrefIcon={<TopNavDestinationIcon.categories />}
            hrefTitle={intl.formatMessage(topNavDestinationMessages.allCategories)}
            title={category?.name}
            subtitleTop={breadcrumb}
            actionsGap={3}
          >
            <TopNav.MetadataButton
              onClick={onShowMetadata}
              disabled={disabled || !category}
              data-test-id="show-category-metadata"
              title={intl.formatMessage(messages.editCategoryMetadata)}
            />
            {canTranslate && (
              <TranslationsButton
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
            {menuItems.length > 0 && (
              <TopNav.Menu
                items={
                  disabled || !category
                    ? menuItems.map(item => ({ ...item, disabled: true }))
                    : menuItems
                }
                dataTestId="menu"
              />
            )}
          </TopNav>
          <DetailPageLayout.Content>
            <DetailPageContent>
              <CategoryDetailsForm
                data={data}
                disabled={disabled}
                errors={errors}
                image={category?.backgroundImage}
                backgroundImageRevision={backgroundImageRevision}
                backgroundImageUploadPreview={backgroundImageUploadPreview}
                isBackgroundImageUploading={isBackgroundImageUploading}
                onUploadPreviewLoaded={onBackgroundImageUploadPreviewLoaded}
                onChange={change}
                onImageDelete={onImageDelete}
                onImageUpload={onImageUpload}
              />
              <CategoryProducts
                category={category}
                categoryId={categoryId}
                params={params}
                disabled={disabled}
              />
              <SeoForm
                columnInset={false}
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
            </DetailPageContent>
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar paddingTop={6}>
            <PaginatorContext.Provider value={subcategoriesPaginator}>
              <CategorySubcategories
                disabled={disabled}
                onUpdateListSettings={onUpdateListSettings}
                settings={settings}
                subcategories={subcategories ?? []}
                subcategoryTotalCount={subcategoryTotalCount}
                categoryId={categoryId}
                selectedCategoryIds={selectedCategoryIds}
                setSelectedCategoryIds={setSelectedCategoryIds}
                clearRowSelection={clearCategoryRowSelection}
                excludeFromSelected={excludeCategoryFromSelected}
                setClearDatagridRowSelectionCallback={setClearCategoryDatagridRowSelectionCallback}
                onCategoriesDelete={onCategoriesDelete}
                onCreateSubcategory={onCreateSubcategory}
              />
            </PaginatorContext.Provider>
          </DetailPageLayout.RightSidebar>
          <Savebar>
            <Savebar.Spacer />
            <CategorySaveCompositionHint composition={saveComposition} />
            <Savebar.CancelButton onClick={() => navigate(backHref)} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={submit}
              disabled={!!isSaveDisabled}
            />
          </Savebar>
        </DetailPageLayout>
      )}
    </CategoryUpdateForm>
  );
};
CategoryUpdatePage.displayName = "CategoryUpdatePage";
