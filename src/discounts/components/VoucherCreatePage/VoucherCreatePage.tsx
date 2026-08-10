import { type ChannelVoucherData } from "@dashboard/channels/utils";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import AssignCategoriesDialog from "@dashboard/components/AssignCategoryDialog/AssignCategoryDialog";
import AssignCollectionDialog from "@dashboard/components/AssignCollectionDialog";
import AssignProductDialog from "@dashboard/components/AssignProductDialog";
import AssignVariantDialog from "@dashboard/components/AssignVariantDialog/AssignVariantDialog";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { CountryList } from "@dashboard/components/CountryList";
import { DetailPageSectionLayout } from "@dashboard/components/DetailPageSectionLayout/DetailPageSectionLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { VOUCHER_CATALOGUE_PAGINATE_BY } from "@dashboard/config";
import DiscountCountrySelectDialog from "@dashboard/discounts/components/DiscountCountrySelectDialog";
import { VoucherCatalogueSection } from "@dashboard/discounts/components/VoucherCatalogueSection/VoucherCatalogueSection";
import { VoucherChannelAvailabilityCard } from "@dashboard/discounts/components/VoucherChannelAvailabilityCard/VoucherChannelAvailabilityCard";
import { VoucherCodesCard } from "@dashboard/discounts/components/VoucherCodesCard/VoucherCodesCard";
import { formatVoucherCountriesErrorMessage } from "@dashboard/discounts/components/VoucherCountriesErrors/voucherCountriesErrors";
import { useSpecificItemsAssign } from "@dashboard/discounts/components/VoucherCreatePage/hooks/useSpecificItemsAssign";
import { useSpecificItemsPagination } from "@dashboard/discounts/components/VoucherCreatePage/hooks/useSpecificItemsPagination";
import { type VoucherDetailsPageTab } from "@dashboard/discounts/components/VoucherDetailsPage/VoucherDetailsPage";
import { VoucherDiscountSection } from "@dashboard/discounts/components/VoucherDiscountSection/VoucherDiscountSection";
import { VoucherScheduleCard } from "@dashboard/discounts/components/VoucherScheduleCard/VoucherScheduleCard";
import {
  getVoucherSectionIds,
  resolveVoucherSectionVisibility,
  useVoucherSectionNavItems,
} from "@dashboard/discounts/components/VoucherSectionNav/useVoucherSectionNavItems";
import { useVoucherSectionScrollSpy } from "@dashboard/discounts/components/VoucherSectionNav/useVoucherSectionScrollSpy";
import { voucherSectionIds } from "@dashboard/discounts/components/VoucherSectionNav/voucherSectionIds";
import {
  VoucherSection,
  VoucherSectionNav,
} from "@dashboard/discounts/components/VoucherSectionNav/VoucherSectionNav";
import { getVoucherSetupReadiness } from "@dashboard/discounts/components/VoucherSetupCard/getVoucherSetupReadiness";
import { VoucherSetupCard } from "@dashboard/discounts/components/VoucherSetupCard/VoucherSetupCard";
import { createChannelsChangeHandler } from "@dashboard/discounts/handlers";
import { type VoucherCreateUrlQueryParams, voucherListUrl } from "@dashboard/discounts/urls";
import { VOUCHER_CREATE_FORM_ID } from "@dashboard/discounts/views/VoucherCreate/types";
import {
  type CategoryFilterInput,
  type CategoryWithTotalProductsFragment,
  type CollectionFilterInput,
  type CollectionWithTotalProductsFragment,
  type CountryWithCodeFragment,
  type DiscountErrorFragment,
  PermissionEnum,
  type ProductWhereInput,
  type SearchCollectionsWithTotalProductsQuery,
  type SearchCollectionsWithTotalProductsQueryVariables,
  type SearchProductFragment,
  type SearchProductsQuery,
  type SearchProductsQueryVariables,
  type SearchProductVariantFragment,
  type VoucherCatalogueFragment,
} from "@dashboard/graphql";
import { type UseSearchResult } from "@dashboard/hooks/makeSearch";
import useForm, { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { buttonMessages } from "@dashboard/intl";
import { validatePrice } from "@dashboard/products/utils/validation";
import { type useCategoryWithTotalProductsSearch } from "@dashboard/searches/useCategorySearch";
import { type ListActionsWithoutToolbar } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Button } from "@saleor/macaw-ui-next";
import isEqual from "lodash/isEqual";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { RequirementsPicker } from "../../types";
import { type GenerateMultipleVoucherCodeFormData } from "../VoucherCodesGenerateDialog";
import VoucherInfo from "../VoucherInfo";
import VoucherLimits from "../VoucherLimits";
import { VoucherRequirements } from "../VoucherRequirements/VoucherRequirements";
import { initialForm } from "./const";
import { useActiveTab } from "./hooks/useActiveTab";
import { useVoucherCodesPagination } from "./hooks/useVoucherCodesPagination";
import { useVoucherCodesSelection } from "./hooks/useVoucherCodesSelection";
import { type FormData, VoucherCreatePageTab, type VoucherCreateProductVariant } from "./types";
import {
  generateDraftVoucherCode,
  generateMultipleVoucherCodes,
  getAssignedVariantIdsFromForm,
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
  onVariantFilterChange?: (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => void;
  onCategoryFilterChange?: (filterVariables: CategoryFilterInput, query: string) => void;
  onCollectionFilterChange?: (
    filterVariables: CollectionFilterInput,
    channel: string | undefined,
    query: string,
  ) => void;
  categoriesSearch: ReturnType<typeof useCategoryWithTotalProductsSearch>;
  collectionsSearch: UseSearchResult<
    SearchCollectionsWithTotalProductsQuery,
    SearchCollectionsWithTotalProductsQueryVariables
  >;
  productsSearch: UseSearchResult<SearchProductsQuery, SearchProductsQueryVariables>;
  variantsSearch: UseSearchResult<SearchProductsQuery, SearchProductsQueryVariables>;
  selected: string[];
  resetSelected: () => void;
}

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
  onVariantFilterChange,
  onCategoryFilterChange,
  onCollectionFilterChange,
  countries,
  resetSelected,
}: VoucherCreatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { activeTab, changeTab } = useActiveTab();
  const countriesErrorMessage = formatVoucherCountriesErrorMessage(errors, intl);

  // Bumped on every new search so the pickers' backfill budget starts over.
  const [searchGeneration, setSearchGeneration] = useState(0);
  const startNewSearch = () => setSearchGeneration(generation => generation + 1);
  const handleProductFilterChange = (
    filterVariables: ProductWhereInput,
    channel: string | undefined,
    query: string,
  ) => {
    startNewSearch();
    onProductFilterChange?.(filterVariables, channel, query);
  };
  const handleCategoryFilterChange = (filterVariables: CategoryFilterInput, query: string) => {
    startNewSearch();
    onCategoryFilterChange?.(filterVariables, query);
  };
  const handleCollectionFilterChange = (
    filterVariables: CollectionFilterInput,
    channel: string | undefined,
    query: string,
  ) => {
    startNewSearch();
    onCollectionFilterChange?.(filterVariables, channel, query);
  };

  const checkIfSaveIsDisabled = (data: FormData) => {
    if (disabled) {
      return true;
    }

    // Same redeem blockers as the setup checklist — Save stays off until create is viable.
    const readiness = getVoucherSetupReadiness({
      voucher: null,
      formData: data,
      voucherCodes: data.codes,
      tabItemsCount: {
        categories: data.categories.length,
        collections: data.collections.length,
        products: data.products.length,
        variants: data.variants.length,
      },
      countriesCount: data.countries.length,
    });

    if (!readiness.coreReady) {
      return true;
    }

    const hasInvalidMinSpent =
      data.requirementsPicker === RequirementsPicker.ORDER &&
      data.channelListings.some(channel => validatePrice(channel.minSpent));

    const minQuantity = Number(data.minCheckoutItemsQuantity);
    const hasInvalidMinQuantity =
      data.requirementsPicker === RequirementsPicker.ITEM &&
      (!Number.isFinite(minQuantity) || minQuantity < 1);

    return !!(hasInvalidMinSpent || hasInvalidMinQuantity);
  };

  const { change, data, triggerChange, set, submit, isSaveDisabled } = useForm<FormData, unknown>(
    { ...initialForm, channelListings },
    formData => onSubmit({ ...formData, channelListings }),
    {
      confirmLeave: true,
      formId: VOUCHER_CREATE_FORM_ID,
      checkIfSaveIsDisabled,
      disabled,
    },
  );

  // Keep form channel drafts aligned with the view after channel-modal confirm
  // (modal writes parent state only; price/paste already dual-write).
  useEffect(() => {
    if (!isEqual(data.channelListings, channelListings)) {
      set({ channelListings });
    }
  }, [channelListings, data.channelListings, set]);

  const { clearRowSelection, setSelectedVoucherCodesIds, selectedRowIds } =
    useVoucherCodesSelection();

  const handleChannelsChange = (channels: ChannelVoucherData[]) => {
    set({ channelListings: channels });
    onChannelsChange(channels);
    triggerChange();
  };

  // Must update form state in the same tick — controlled price inputs bind to
  // `data.channelListings`, not parent channel state alone.
  const handleChannelChange = createChannelsChangeHandler(
    data.channelListings,
    channels => {
      set({ channelListings: channels });
      onChannelsChange(channels);
    },
    triggerChange,
  );

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

  const handleDeleteVoucherCodes = async (): Promise<boolean> => {
    clearRowSelection();
    set({
      codes: data.codes.filter(({ code }) => !selectedRowIds.includes(code)),
    });

    return true;
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

  const [catalogueNumberOfRows, setCatalogueNumberOfRows] = useState(VOUCHER_CATALOGUE_PAGINATE_BY);
  const handleCatalogueListSettingsUpdate = (key: "rowNumber", value: number) => {
    if (key === "rowNumber") {
      setCatalogueNumberOfRows(value);
    }
  };
  const { paginatedSpecificItems, specificItemsPagination, resetSpecificItemsPagination } =
    useSpecificItemsPagination({
      type: activeTab,
      paginateBy: catalogueNumberOfRows,
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

  // The picked items live in form state, so this exclusion set is complete and grows as the
  // user assigns. Handing the pickers a predicate rather than a pre-filtered list lets them
  // pull in the next page once a page has been filtered down to nothing.
  const isCategoryAssigned = useMemo(() => {
    const assigned = new Set(data.categories.map(category => category.id));

    return (category: { id: string }) => assigned.has(category.id);
  }, [data.categories]);
  const isCollectionAssigned = useMemo(() => {
    const assigned = new Set(data.collections.map(collection => collection.id));

    return (collection: { id: string }) => assigned.has(collection.id);
  }, [data.collections]);
  const isProductAssigned = useMemo(() => {
    const assigned = new Set(data.products.map(product => product.id));

    return (product: { id: string }) => assigned.has(product.id);
  }, [data.products]);

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

  const mapCreateTabToDetailsTab = (tab: VoucherCreatePageTab): VoucherDetailsPageTab =>
    tab as unknown as VoucherDetailsPageTab;
  const { showCatalogue, showCountries } = resolveVoucherSectionVisibility(data);
  const sectionNavItems = useVoucherSectionNavItems({ showCatalogue, showCountries });
  const sectionIds = getVoucherSectionIds({ showCatalogue, showCountries });
  const { activeId, selectSection } = useVoucherSectionScrollSpy({ sectionIds });
  const tabItemsCount = {
    categories: data.categories.length,
    collections: data.collections.length,
    products: data.products.length,
    variants: data.variants.length,
  };
  const setupReadiness = getVoucherSetupReadiness({
    voucher: null,
    formData: data,
    voucherCodes: data.codes,
    tabItemsCount,
    countriesCount: data.countries.length,
  });
  const showSetupCard = !setupReadiness.coreReady;

  return (
    <PaginatorContext.Provider value={{ ...specificItemsPagination, paginatorType: "click" }}>
      <form onSubmit={submit}>
        <DetailPageLayout>
          <TopNav
            href={voucherListUrl()}
            hrefIcon={<TopNavDestinationIcon.discounts />}
            hrefTitle={intl.formatMessage(topNavDestinationMessages.allVouchers)}
            title={intl.formatMessage({
              id: "PsclSa",
              defaultMessage: "Create Voucher",
              description: "page header",
            })}
          />
          <DetailPageLayout.Content>
            {showSetupCard ? (
              <VoucherSetupCard
                variant="create"
                readiness={setupReadiness}
                disabled={disabled}
                onManageChannels={openChannelsModal}
              />
            ) : null}
            <DetailPageSectionLayout
              nav={
                <VoucherSectionNav
                  items={sectionNavItems}
                  activeId={activeId}
                  onSelect={selectSection}
                />
              }
            >
              <VoucherSection id={voucherSectionIds.details}>
                <VoucherInfo data={data} errors={errors} disabled={disabled} onChange={change} />
              </VoucherSection>
              <VoucherSection id={voucherSectionIds.codes}>
                <VoucherCodesCard
                  codes={paginatedCodes}
                  onDeleteCodes={handleDeleteVoucherCodes}
                  deleteCodesTransitionState="default"
                  onMultiCodesGenerate={handleGenerateMultipleCodes}
                  onSelectedCodesChange={setSelectedVoucherCodesIds}
                  onSettingsChange={onSettingsChange}
                  onCustomCodeGenerate={handleGenerateCustomCode}
                  selectedCodesIds={selectedRowIds}
                  settings={settings}
                  voucherCodesPagination={pagination}
                  errors={errors}
                />
              </VoucherSection>
              <VoucherSection id={voucherSectionIds.discount}>
                <VoucherDiscountSection
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                  onChannelChange={handleChannelChange}
                  onChannelsChange={handleChannelsChange}
                />
              </VoucherSection>
              {showCatalogue && (
                <VoucherSection id={voucherSectionIds.catalogue}>
                  <VoucherCatalogueSection
                    activeTab={mapCreateTabToDetailsTab(activeTab)}
                    tabItemsCount={tabItemsCount}
                    disabled={disabled}
                    errors={errors}
                    onTabClick={tab => onTabClick(tab as unknown as VoucherCreatePageTab)}
                    categories={paginatedSpecificItems as CategoryWithTotalProductsFragment[]}
                    collections={paginatedSpecificItems as CollectionWithTotalProductsFragment[]}
                    products={paginatedSpecificItems as SearchProductFragment[]}
                    variants={
                      mapLocalVariantsToSavedVariants(
                        paginatedSpecificItems as VoucherCreateProductVariant[],
                      ) as unknown as VoucherCatalogueFragment["variants"]
                    }
                    onCategoryAssign={() => openModal("assign-category")}
                    onCategoryUnassign={id => unassignItem(id, VoucherCreatePageTab.categories)}
                    onCollectionAssign={() => openModal("assign-collection")}
                    onCollectionUnassign={id => unassignItem(id, VoucherCreatePageTab.collections)}
                    onProductAssign={() => openModal("assign-product")}
                    onProductUnassign={id => unassignItem(id, VoucherCreatePageTab.products)}
                    onVariantAssign={() => openModal("assign-variant")}
                    onVariantUnassign={id => unassignItem(id, VoucherCreatePageTab.variants)}
                    numberOfRows={catalogueNumberOfRows}
                    onUpdateListSettings={handleCatalogueListSettingsUpdate}
                    isChecked={isChecked}
                    selected={selected.length}
                    toggle={toggle}
                    toggleAll={toggleAll}
                    categoryListToolbar={
                      <BulkUnassignButton type={VoucherCreatePageTab.categories} />
                    }
                    collectionListToolbar={
                      <BulkUnassignButton type={VoucherCreatePageTab.collections} />
                    }
                    productListToolbar={<BulkUnassignButton type={VoucherCreatePageTab.products} />}
                    variantListToolbar={<BulkUnassignButton type={VoucherCreatePageTab.variants} />}
                  />
                </VoucherSection>
              )}
              {showCountries && (
                <VoucherSection id={voucherSectionIds.countries}>
                  <CountryList
                    countries={data.countries}
                    disabled={disabled}
                    emptyText={intl.formatMessage({
                      id: "jd/LWa",
                      defaultMessage: "Voucher applies to all countries",
                    })}
                    summaryContext="voucher"
                    title={intl.formatMessage({
                      id: "ibnmEd",
                      defaultMessage: "Countries",
                      description: "voucher country range",
                    })}
                    description={
                      <FormattedMessage
                        id="glT6fm"
                        defaultMessage="Voucher is limited to these countries"
                      />
                    }
                    errorMessage={countriesErrorMessage}
                    onCountryAssign={() => openModal("assign-country")}
                    onCountryUnassign={id => unassignItem(id, "countries")}
                  />
                </VoucherSection>
              )}
              <VoucherSection id={voucherSectionIds.requirements}>
                <VoucherRequirements
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  onChannelChange={handleChannelChange}
                  onChannelsChange={handleChannelsChange}
                  onChange={change}
                />
              </VoucherSection>
              <VoucherSection id={voucherSectionIds.limits}>
                <VoucherLimits
                  data={data}
                  initialUsageLimit={initialForm.usageLimit}
                  disabled={disabled}
                  errors={errors}
                  onChange={change}
                  setData={set}
                  isNewVoucher
                />
              </VoucherSection>
            </DetailPageSectionLayout>
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar paddingTop={6}>
            <Box display="flex" flexDirection="column" gap={4}>
              <VoucherScheduleCard
                data={{
                  startDate: data.startDate,
                  startTime: data.startTime,
                  hasEndDate: data.hasEndDate,
                  endDate: data.endDate,
                  endTime: data.endTime,
                }}
                errors={errors}
                disabled={disabled}
                onChange={change}
              />
              <VoucherChannelAvailabilityCard
                channels={data.channelListings}
                totalChannelsCount={allChannelsCount}
                disabled={disabled}
                managePermissions={[PermissionEnum.MANAGE_DISCOUNTS]}
                onManageClick={openChannelsModal}
                scheduleData={{
                  startDate: data.startDate,
                  startTime: data.startTime,
                  hasEndDate: data.hasEndDate,
                  endDate: data.endDate,
                  endTime: data.endTime,
                }}
              />
            </Box>
          </DetailPageLayout.RightSidebar>
          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(voucherListUrl())} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={submit}
              disabled={isSaveDisabled}
            />
          </Savebar>
        </DetailPageLayout>

        {/* Modal state needs to reset when the modal is closed */}
        {action === "assign-category" && (
          <AssignCategoriesDialog
            categories={mapEdgesToItems(categoriesSearch.result?.data?.search) ?? []}
            excludeContainer={isCategoryAssigned}
            backfillResetKey={String(searchGeneration)}
            confirmButtonState="default"
            hasMore={categoriesSearch.result?.data?.search?.pageInfo?.hasNextPage ?? false}
            open={action === "assign-category"}
            onFetch={categoriesSearch.search}
            onFilterChange={handleCategoryFilterChange}
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
            collections={mapEdgesToItems(collectionsSearch.result?.data?.search) ?? []}
            excludeContainer={isCollectionAssigned}
            backfillResetKey={String(searchGeneration)}
            confirmButtonState="default"
            hasMore={collectionsSearch?.result?.data?.search?.pageInfo?.hasNextPage ?? false}
            open={action === "assign-collection"}
            onFetch={collectionsSearch.search}
            onFilterChange={handleCollectionFilterChange}
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
            onFilterChange={onVariantFilterChange}
            onFetchMore={variantsSearch.loadMore}
            loading={variantsSearch.result.loading}
            onClose={closeModal}
            onSubmit={(variants: unknown) => {
              assignItem(
                variants as SearchProductVariantFragment[],
                VoucherCreatePageTab.variants,
                onModalClose,
              );
            }}
            products={mapEdgesToItems(variantsSearch.result?.data?.search) ?? []}
            selectedIds={getAssignedVariantIdsFromForm(data)}
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
          onFilterChange={handleProductFilterChange}
          onSubmit={data =>
            assignItem(data as SearchProductFragment[], VoucherCreatePageTab.products, onModalClose)
          }
          products={mapEdgesToItems(productsSearch.result?.data?.search) ?? []}
          excludeProduct={isProductAssigned}
          backfillResetKey={String(searchGeneration)}
          selectAllMode="when-scoped"
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
