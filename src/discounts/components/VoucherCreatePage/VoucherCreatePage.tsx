import { ChannelVoucherData } from "@dashboard/channels/utils";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import AssignCategoriesDialog from "@dashboard/components/AssignCategoryDialog/AssignCategoryDialog";
import AssignCollectionDialog from "@dashboard/components/AssignCollectionDialog";
import AssignProductDialog from "@dashboard/components/AssignProductDialog";
import AssignVariantDialog from "@dashboard/components/AssignVariantDialog/AssignVariantDialog";
import CardSpacer from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import CountryList from "@dashboard/components/CountryList";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { Tab, TabContainer } from "@dashboard/components/Tab";
import DiscountCategories from "@dashboard/discounts/components/DiscountCategories";
import DiscountCollections from "@dashboard/discounts/components/DiscountCollections";
import DiscountCountrySelectDialog from "@dashboard/discounts/components/DiscountCountrySelectDialog";
import DiscountProducts from "@dashboard/discounts/components/DiscountProducts";
import { useSpecificItemsAssign } from "@dashboard/discounts/components/VoucherCreatePage/hooks/useSpecificItemsAssign";
import { useSpecificItemsPagination } from "@dashboard/discounts/components/VoucherCreatePage/hooks/useSpecificItemsPagination";
import {
  createChannelsChangeHandler,
  createDiscountTypeChangeHandler,
} from "@dashboard/discounts/handlers";
import { itemsQuantityMessages } from "@dashboard/discounts/translations";
import { VoucherCreateUrlQueryParams, voucherListUrl } from "@dashboard/discounts/urls";
import { VOUCHER_CREATE_FORM_ID } from "@dashboard/discounts/views/VoucherCreate/types";
import {
  CategoryWithTotalProductsFragment,
  CollectionWithTotalProductsFragment,
  CountryWithCodeFragment,
  DiscountErrorFragment,
  PermissionEnum,
  ProductWhereInput,
  SearchCategoriesWithTotalProductsQuery,
  SearchCategoriesWithTotalProductsQueryVariables,
  SearchCollectionsWithTotalProductsQuery,
  SearchCollectionsWithTotalProductsQueryVariables,
  SearchProductFragment,
  SearchProductsQuery,
  SearchProductsQueryVariables,
  VoucherDetailsFragment,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import { UseSearchResult } from "@dashboard/hooks/makeSearch";
import useForm, { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { buttonMessages } from "@dashboard/intl";
import { validatePrice } from "@dashboard/products/utils/validation";
import { ListActionsWithoutToolbar } from "@dashboard/types";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { RequirementsPicker } from "../../types";
import DiscountVariants from "../DiscountVariants/DiscountVariants";
import { VoucherCodes } from "../VoucherCodes";
import { GenerateMultipleVoucherCodeFormData } from "../VoucherCodesGenerateDialog";
import VoucherDates from "../VoucherDates";
import VoucherInfo from "../VoucherInfo";
import VoucherLimits from "../VoucherLimits";
import VoucherRequirements from "../VoucherRequirements";
import VoucherTypes from "../VoucherTypes";
import VoucherValue from "../VoucherValue";
import { initialForm } from "./const";
import { useActiveTab } from "./hooks/useActiveTab";
import { useVoucherCodesPagination } from "./hooks/useVoucherCodesPagination";
import { useVoucherCodesSelection } from "./hooks/useVoucherCodesSelection";
import { FormData, VoucherCreatePageTab, VoucherCreateProductVariant } from "./types";
import {
  generateDraftVoucherCode,
  generateMultipleVoucherCodes,
  getFilteredCategories,
  getFilteredCollections,
  getFilteredProducts,
  getFilteredProductVariants,
  mapLocalVariantsToSavedVariants,
  voucherCodeExists,
} from "./utils";

interface VoucherCreatePageProps extends Omit<ListActionsWithoutToolbar, "selected"> {
  countries: CountryWithCodeFragment[];
  allChannelsCount: number;
  channelListings: ChannelVoucherData[];
  disabled: boolean;
  errors: DiscountErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onChannelsChange: (data: ChannelVoucherData[]) => void;
  openChannelsModal: () => void;
  onSubmit: (data: FormData) => SubmitPromise;
  action: VoucherCreateUrlQueryParams["action"];
  openModal: (action: VoucherCreateUrlQueryParams["action"]) => void;
  closeModal: () => void;
  onProductFilterChange?: (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => void;
  categoriesSearch: UseSearchResult<
    SearchCategoriesWithTotalProductsQuery,
    SearchCategoriesWithTotalProductsQueryVariables
  >;
  collectionsSearch: UseSearchResult<
    SearchCollectionsWithTotalProductsQuery,
    SearchCollectionsWithTotalProductsQueryVariables
  >;
  productsSearch: UseSearchResult<SearchProductsQuery, SearchProductsQueryVariables>;
  variantsSearch: UseSearchResult<SearchProductsQuery, SearchProductsQueryVariables>;
  selected: string[];
  resetSelected: () => void;
}

const CategoriesTab = Tab(VoucherCreatePageTab.categories);
const CollectionsTab = Tab(VoucherCreatePageTab.collections);
const ProductsTab = Tab(VoucherCreatePageTab.products);
const VariantsTab = Tab(VoucherCreatePageTab.variants);
const VoucherCreatePage = ({
  allChannelsCount,
  channelListings = [],
  disabled,
  errors,
  saveButtonBarState,
  onChannelsChange,
  onSubmit,
  openChannelsModal,
  selected,
  isChecked,
  action,
  openModal,
  closeModal,
  toggle,
  toggleAll,
  productsSearch,
  categoriesSearch,
  collectionsSearch,
  variantsSearch,
  onProductFilterChange,
  countries,
  resetSelected,
}: VoucherCreatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { makeChangeHandler: makeMetadataChangeHandler } = useMetadataChangeTrigger();
  const { activeTab, changeTab } = useActiveTab();

  const checkIfSaveIsDisabled = (data: FormData) =>
    (data.discountType.toString() !== "SHIPPING" &&
      data.channelListings?.some(
        channel =>
          validatePrice(channel.discountValue) ||
          (data.requirementsPicker === RequirementsPicker.ORDER && validatePrice(channel.minSpent)),
      )) ||
    disabled;

  const { change, data, triggerChange, set, submit } = useForm<FormData, unknown>(
    { ...initialForm, channelListings },
    onSubmit,
    {
      confirmLeave: true,
      formId: VOUCHER_CREATE_FORM_ID,
      checkIfSaveIsDisabled,
    },
  );

  const { clearRowSelection, setSelectedVoucherCodesIds, selectedRowIds } =
    useVoucherCodesSelection(data.codes);

  const handleDiscountTypeChange = createDiscountTypeChangeHandler(change);

  const handleChannelChange = createChannelsChangeHandler(
    data.channelListings,
    onChannelsChange,
    triggerChange,
  );

  const changeMetadata = makeMetadataChangeHandler(change);

  const handleGenerateMultipleCodes = ({
    quantity,
    prefix,
  }: GenerateMultipleVoucherCodeFormData) => {
    clearRowSelection();
    triggerChange(true);
    set({
      codes: [...generateMultipleVoucherCodes(quantity, prefix), ...data.codes],
    });
  };

  const handleDeleteVoucherCodes = () => {
    clearRowSelection();
    set({
      codes: data.codes.filter(({ code }) => !selectedRowIds.includes(code)),
    });
  };

  const handleGenerateCustomCode = (code: string) => {
    if (voucherCodeExists(code, data.codes)) {
      throw new Error("Code already exists");
    }

    triggerChange(true);
    set({
      codes: [generateDraftVoucherCode(code), ...data.codes],
    });
  };

  const { pagination, paginatedCodes, settings, onSettingsChange } = useVoucherCodesPagination(
    data.codes,
  );

  const { paginatedSpecificItems, specificItemsPagination, resetSpecificItemsPagination } =
    useSpecificItemsPagination({
      type: activeTab,
      data: {
        categories: data.categories,
        collections: data.collections,
        products: data.products,
        variants: data.variants,
      },
    });

  const { bulkUnassign, unassignItem, assignItem } = useSpecificItemsAssign({
    data: {
      categories: data.categories,
      collections: data.collections,
      products: data.products,
      countries: data.countries,
      variants: data.variants,
    },
    countries,
    onChange: change,
  });

  const onTabClick = (tab: VoucherCreatePageTab) =>
    changeTab(tab, () => {
      resetSelected();
      resetSpecificItemsPagination();
    });

  const onModalClose = () => {
    closeModal();
    resetSelected();
  };

  const BulkUnassignButton = ({ type }: { type: VoucherCreatePageTab | "countries" }) => (
    <Button
      onClick={() => {
        bulkUnassign(type, selected);
        resetSelected();
      }}
      variant="secondary"
    >
      <FormattedMessage id="Gkip05" defaultMessage="Unassign" description="button" />
    </Button>
  );

  return (
    <PaginatorContext.Provider value={{ ...specificItemsPagination, paginatorType: "click" }}>
      <form onSubmit={submit}>
        <DetailPageLayout>
          <TopNav
            href={voucherListUrl()}
            title={intl.formatMessage({
              id: "PsclSa",
              defaultMessage: "Create Voucher",
              description: "page header",
            })}
          />
          <DetailPageLayout.Content>
            <VoucherInfo
              data={data}
              errors={errors}
              disabled={disabled}
              onChange={event => handleDiscountTypeChange(data, event)}
            />
            <VoucherCodes
              codes={paginatedCodes}
              onDeleteCodes={handleDeleteVoucherCodes}
              onMultiCodesGenerate={handleGenerateMultipleCodes}
              onSelectVoucherCodesIds={setSelectedVoucherCodesIds}
              onSettingsChange={onSettingsChange}
              onCustomCodeGenerate={handleGenerateCustomCode}
              selectedCodesIds={selectedRowIds}
              settings={settings}
              voucherCodesPagination={pagination}
            />
            <VoucherTypes data={data} disabled={disabled} errors={errors} onChange={change} />
            {data.discountType.toString() !== "SHIPPING" ? (
              <VoucherValue
                data={data}
                disabled={disabled}
                errors={errors}
                onChannelChange={handleChannelChange}
                onChange={change}
              />
            ) : null}
            {data.type === VoucherTypeEnum.SPECIFIC_PRODUCT &&
            data.discountType.toString() !== "SHIPPING" ? (
              <>
                <TabContainer>
                  <CategoriesTab
                    isActive={activeTab === VoucherCreatePageTab.categories}
                    changeTab={onTabClick}
                    testId="categories-tab"
                  >
                    {intl.formatMessage(itemsQuantityMessages.categories, {
                      quantity: data.categories.length,
                    })}
                  </CategoriesTab>
                  <CollectionsTab
                    testId="collections-tab"
                    isActive={activeTab === VoucherCreatePageTab.collections}
                    changeTab={onTabClick}
                  >
                    {intl.formatMessage(itemsQuantityMessages.collections, {
                      quantity: data.collections.length,
                    })}
                  </CollectionsTab>
                  <ProductsTab
                    testId="products-tab"
                    isActive={activeTab === VoucherCreatePageTab.products}
                    changeTab={onTabClick}
                  >
                    {intl.formatMessage(itemsQuantityMessages.products, {
                      quantity: data.products.length,
                    })}
                  </ProductsTab>
                  <VariantsTab
                    testId="variants-tab"
                    isActive={activeTab === VoucherCreatePageTab.variants}
                    changeTab={onTabClick}
                  >
                    {intl.formatMessage(itemsQuantityMessages.variants, {
                      quantity: data.variants.length,
                    })}
                  </VariantsTab>
                </TabContainer>
                <CardSpacer />
                {activeTab === VoucherCreatePageTab.categories ? (
                  <DiscountCategories
                    disabled={disabled}
                    onCategoryAssign={() => openModal("assign-category")}
                    onCategoryUnassign={id => unassignItem(id, VoucherCreatePageTab.categories)}
                    categories={paginatedSpecificItems as CategoryWithTotalProductsFragment[]}
                    isChecked={isChecked}
                    selected={selected.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={<BulkUnassignButton type={VoucherCreatePageTab.categories} />}
                  />
                ) : activeTab === VoucherCreatePageTab.collections ? (
                  <DiscountCollections
                    disabled={disabled}
                    onCollectionAssign={() => openModal("assign-collection")}
                    onCollectionUnassign={id => unassignItem(id, VoucherCreatePageTab.collections)}
                    collections={paginatedSpecificItems as CollectionWithTotalProductsFragment[]}
                    isChecked={isChecked}
                    selected={selected.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={<BulkUnassignButton type={VoucherCreatePageTab.collections} />}
                  />
                ) : activeTab === VoucherCreatePageTab.products ? (
                  <DiscountProducts
                    disabled={disabled}
                    onProductAssign={() => openModal("assign-product")}
                    onProductUnassign={id => unassignItem(id, VoucherCreatePageTab.products)}
                    products={paginatedSpecificItems as SearchProductFragment[]}
                    isChecked={isChecked}
                    selected={selected.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={<BulkUnassignButton type={VoucherCreatePageTab.products} />}
                  />
                ) : (
                  <DiscountVariants
                    disabled={disabled}
                    onVariantAssign={() => openModal("assign-variant")}
                    onVariantUnassign={id => unassignItem(id, VoucherCreatePageTab.variants)}
                    variants={
                      // Types here are problematic as this component expects a graphql object,
                      // but we are passing a set of data
                      mapLocalVariantsToSavedVariants(
                        paginatedSpecificItems as VoucherCreateProductVariant[],
                      ) as unknown as VoucherDetailsFragment["variants"]
                    }
                    isChecked={isChecked}
                    selected={selected.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    toolbar={<BulkUnassignButton type={VoucherCreatePageTab.variants} />}
                  />
                )}
              </>
            ) : null}
            {data.discountType.toString() === "SHIPPING" ? (
              <CountryList
                countries={data.countries}
                disabled={disabled}
                emptyText={intl.formatMessage({
                  id: "jd/LWa",
                  defaultMessage: "Voucher applies to all countries",
                })}
                title={
                  <>
                    {intl.formatMessage({
                      id: "ibnmEd",
                      defaultMessage: "Countries",
                      description: "voucher country range",
                    })}
                    <Text size={2} fontWeight="light" display="block">
                      <FormattedMessage
                        id="glT6fm"
                        defaultMessage="Voucher is limited to these countries"
                      />
                    </Text>
                  </>
                }
                onCountryAssign={() => openModal("assign-country")}
                onCountryUnassign={id => unassignItem(id, "countries")}
              />
            ) : null}
            <VoucherRequirements
              data={data}
              disabled={disabled}
              errors={errors}
              onChannelChange={handleChannelChange}
              onChange={change}
            />
            <VoucherLimits
              data={data}
              initialUsageLimit={initialForm.usageLimit}
              disabled={disabled}
              errors={errors}
              onChange={change}
              setData={set}
              isNewVoucher
            />
            <VoucherDates data={data} disabled={disabled} errors={errors} onChange={change} />
            <Metadata data={data} onChange={changeMetadata} />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <ChannelsAvailabilityCard
              managePermissions={[PermissionEnum.MANAGE_DISCOUNTS]}
              allChannelsCount={allChannelsCount}
              channelsList={data.channelListings.map(channel => ({
                id: channel.id,
                name: channel.name,
              }))}
              disabled={disabled}
              openModal={openChannelsModal}
            />
          </DetailPageLayout.RightSidebar>
          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(voucherListUrl())} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={submit}
              disabled={disabled}
            />
          </Savebar>
        </DetailPageLayout>

        {/* Modal state needs to reset when the modal is closed */}
        {action === "assign-category" && (
          <AssignCategoriesDialog
            categories={getFilteredCategories(data, categoriesSearch.result)}
            confirmButtonState="default"
            hasMore={categoriesSearch.result?.data?.search?.pageInfo?.hasNextPage ?? false}
            open={action === "assign-category"}
            onFetch={categoriesSearch.search}
            onFetchMore={categoriesSearch.loadMore}
            loading={categoriesSearch.result?.loading}
            onClose={closeModal}
            onSubmit={data =>
              assignItem(
                data as CategoryWithTotalProductsFragment[],
                VoucherCreatePageTab.categories,
                onModalClose,
              )
            }
            labels={{
              confirmBtn: intl.formatMessage(buttonMessages.assign),
            }}
          />
        )}
        {/* Modal state needs to reset when the modal is closed */}
        {action === "assign-collection" && (
          <AssignCollectionDialog
            collections={getFilteredCollections(data, collectionsSearch.result)}
            confirmButtonState="default"
            hasMore={collectionsSearch?.result?.data?.search?.pageInfo?.hasNextPage ?? false}
            open={action === "assign-collection"}
            onFetch={collectionsSearch.search}
            onFetchMore={collectionsSearch.loadMore}
            loading={collectionsSearch.result.loading}
            onClose={closeModal}
            onSubmit={data =>
              assignItem(
                data as CollectionWithTotalProductsFragment[],
                VoucherCreatePageTab.collections,
                onModalClose,
              )
            }
            labels={{
              confirmBtn: intl.formatMessage(buttonMessages.assign),
            }}
          />
        )}
        {/* Modal state needs to reset when the modal is closed */}
        {action === "assign-variant" && (
          <AssignVariantDialog
            confirmButtonState="default"
            hasMore={variantsSearch?.result?.data?.search?.pageInfo?.hasNextPage ?? false}
            open={action === "assign-variant"}
            onFilterChange={onProductFilterChange}
            onFetchMore={variantsSearch.loadMore}
            loading={variantsSearch.result.loading}
            onClose={closeModal}
            onSubmit={(variants: unknown) => {
              assignItem(
                variants as SearchProductFragment[],
                VoucherCreatePageTab.variants,
                onModalClose,
              );
            }}
            products={getFilteredProductVariants(data, variantsSearch.result) || []}
            labels={{
              confirmBtn: intl.formatMessage(buttonMessages.assign),
            }}
          />
        )}
        <DiscountCountrySelectDialog
          confirmButtonState="default"
          countries={countries}
          onClose={closeModal}
          onConfirm={async ({ countries }) => assignItem(countries, "countries", onModalClose)}
          open={action === "assign-country"}
          initial={data.countries.map(country => country.code)}
          labels={{
            confirmBtn: intl.formatMessage(buttonMessages.assign),
          }}
        />
        <AssignProductDialog
          selectedChannels={channelListings}
          productUnavailableText={intl.formatMessage({
            id: "XOkUxQ",
            defaultMessage: "Product unavailable in voucher channels",
          })}
          confirmButtonState="default"
          hasMore={productsSearch?.result.data?.search?.pageInfo?.hasNextPage ?? false}
          onFetchMore={productsSearch.loadMore}
          loading={productsSearch.result.loading}
          open={action === "assign-product"}
          onClose={closeModal}
          onSubmit={data =>
            assignItem(data as SearchProductFragment[], VoucherCreatePageTab.products, onModalClose)
          }
          products={getFilteredProducts(data, productsSearch.result)}
          labels={{
            confirmBtn: intl.formatMessage(buttonMessages.assign),
          }}
        />
      </form>
    </PaginatorContext.Provider>
  );
};

VoucherCreatePage.displayName = "VoucherCreatePage";
export default VoucherCreatePage;
