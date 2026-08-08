// @ts-strict-ignore
import { hasPermission } from "@dashboard/auth/misc";
import { useUser } from "@dashboard/auth/useUser";
import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form from "@dashboard/components/Form";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { type MetadataFormData } from "@dashboard/components/Metadata";
import { createVoucherUpdateHandler } from "@dashboard/discounts/handlers";
import { voucherGraphiQLQuery } from "@dashboard/discounts/queries";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { voucherListPath } from "@dashboard/discounts/urls";
import { VOUCHER_UPDATE_FORM_ID } from "@dashboard/discounts/views/VoucherDetails/types";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForVoucherDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  type DiscountErrorFragment,
  DiscountValueTypeEnum,
  PermissionEnum,
  type VoucherCatalogueFragment,
  type VoucherDetailsFragment,
  VoucherTypeEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { type UseListSettings } from "@dashboard/hooks/useListSettings";
import { type LocalPagination } from "@dashboard/hooks/useLocalPaginator";
import useNavigator from "@dashboard/hooks/useNavigator";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";
import { useCachedLocales } from "@dashboard/translations/useCachedLocales";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { ListChecks, Trash2 } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { splitDateTime } from "../../../misc";
import { type ChannelProps, type ListProps, type TabListActions } from "../../../types";
import { type VoucherCode } from "../VoucherCodesDatagrid/types";
import { type GenerateMultipleVoucherCodeFormData } from "../VoucherCodesGenerateDialog";
import { voucherDetailsPageMessages as messages } from "./messages";
import { VoucherDetailsPageFormContent } from "./VoucherDetailsPageFormContent";
import { VoucherDetailsPageLoading } from "./VoucherDetailsPageLoading";

export enum VoucherDetailsPageTab {
  categories = "categories",
  collections = "collections",
  products = "products",
  variants = "variants",
}

export type VoucherTabItemsCount = Partial<Record<VoucherDetailsPageTab, number>>;

export interface VoucherDetailsPageFormData extends MetadataFormData {
  applyOncePerCustomer: boolean;
  applyOncePerOrder: boolean;
  onlyForStaff: boolean;
  channelListings: ChannelVoucherData[];
  name: string;
  discountType: DiscountTypeEnum;
  /**
   * Legacy form field — kept for create handlers / API shape.
   * Percentage drafts live on `channelListings[].percentageDiscountValue`.
   */
  percentageDiscountValue: string;
  endDate: string;
  endTime: string;
  hasEndDate: boolean;
  hasUsageLimit: boolean;
  minCheckoutItemsQuantity: string;
  requirementsPicker: RequirementsPicker;
  startDate: string;
  startTime: string;
  type: VoucherTypeEnum;
  codes: VoucherCode[];
  usageLimit: number;
  used: number;
  singleUse: boolean;
}

/** Details form entity plus optional catalogue accordion lists (fetched separately). */
export type VoucherDetailsPageVoucher = VoucherDetailsFragment & Partial<VoucherCatalogueFragment>;

interface VoucherDetailsPageProps
  extends Pick<ListProps, Exclude<keyof ListProps, "getRowHref">>,
    TabListActions<
      "categoryListToolbar" | "collectionListToolbar" | "productListToolbar" | "variantListToolbar"
    >,
    ChannelProps {
  activeTab: VoucherDetailsPageTab;
  tabItemsCount: VoucherTabItemsCount;
  errors: DiscountErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  /** Undefined/null until the details query resolves — page shows a loading shell. */
  voucher: VoucherDetailsPageVoucher | null | undefined;
  allChannelsCount: number;
  channelListings: ChannelVoucherData[];
  savedChannelListings: ChannelVoucherData[];
  selectedVoucherCodesIds: string[];
  voucherCodes: VoucherCode[];
  /** Draft codes pending save — synced into form `codes` for submit + dirty state. */
  addedVoucherCodes: VoucherCode[];
  /** Server code node ids staged for delete on Save. */
  pendingRemovedCodeIds?: string[];
  /** Staged catalogue / country membership pending Savebar save. */
  hasCatalogueDraftChanges?: boolean;
  hasCountriesDraftChanges?: boolean;
  voucherCodesLoading: boolean;
  onSelectedCodesChange: (ids: string[]) => void;
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
  onCollectionAssign: () => void;
  onCollectionUnassign: (id: string) => void;
  onCountryAssign: () => void;
  onCountryUnassign: (code: string) => void;
  onProductAssign: () => void;
  onProductUnassign: (id: string) => void;
  onVariantAssign: () => void;
  onVariantUnassign: (id: string) => void;
  catalogueNumberOfRows: number;
  onCatalogueListSettingsUpdate: (key: "rowNumber", value: number) => void;
  onRemove: () => void;
  onSubmit: (data: VoucherDetailsPageFormData) => void;
  onTabClick: (index: VoucherDetailsPageTab) => void;
  onChannelsChange: (data: ChannelVoucherData[]) => void;
  openChannelsModal: () => void;
  onShowMetadata: () => void;
  /**
   * Reopens the setup checklist (clears local dismiss + emphasizes setup).
   * Shown in the cogs menu when the card is currently hidden.
   */
  onShowSetupChecklist?: () => void;
  /** URL `?action=setup` — forces the checklist visible even if dismissed. */
  setupEmphasized?: boolean;
  setupCardDismissed?: boolean;
  setupCardDisplayReady?: boolean;
  onDismissSetupCard?: () => void;
  onMultipleVoucherCodesGenerate: (data: GenerateMultipleVoucherCodeFormData) => void;
  onCustomVoucherCodeGenerate: (code: string) => void;
  deleteVoucherCodesTransitionState: ConfirmButtonTransitionState;
  onDeleteVoucherCodes: () => Promise<boolean>;
  onVoucherCodesSettingsChange: UseListSettings["updateListSettings"];
  voucherCodesPagination: LocalPagination;
  voucherCodesSettings: UseListSettings["settings"];
}

const VoucherDetailsPage: React.FC<VoucherDetailsPageProps> = ({
  activeTab,
  tabItemsCount = {},
  allChannelsCount,
  channelListings = [],
  savedChannelListings = [],
  disabled,
  errors,
  saveButtonBarState,
  voucher,
  onCategoryAssign,
  onCategoryUnassign,
  onChannelsChange,
  onCountryAssign,
  onCountryUnassign,
  onCollectionAssign,
  onCollectionUnassign,
  onProductAssign,
  onProductUnassign,
  onVariantAssign,
  onVariantUnassign,
  catalogueNumberOfRows,
  onCatalogueListSettingsUpdate,
  onTabClick,
  openChannelsModal,
  onRemove,
  onShowMetadata,
  onShowSetupChecklist,
  setupEmphasized = false,
  setupCardDismissed = false,
  setupCardDisplayReady = true,
  onDismissSetupCard,
  onMultipleVoucherCodesGenerate,
  onCustomVoucherCodeGenerate,
  deleteVoucherCodesTransitionState,
  onDeleteVoucherCodes,
  onSubmit,
  toggle,
  toggleAll,
  selected,
  selectedChannelId,
  isChecked,
  categoryListToolbar,
  collectionListToolbar,
  productListToolbar,
  variantListToolbar,
  selectedVoucherCodesIds,
  onSelectedCodesChange,
  voucherCodes,
  addedVoucherCodes,
  pendingRemovedCodeIds = [],
  hasCatalogueDraftChanges = false,
  hasCountriesDraftChanges = false,
  voucherCodesLoading,
  voucherCodesPagination,
  onVoucherCodesSettingsChange,
  voucherCodesSettings,
}) => {
  const intl = useIntl();
  const context = useDevModeContext();
  const navigate = useNavigator();
  const { lastUsedLocaleOrFallback } = useCachedLocales();
  const { user } = useUser();
  const canTranslate = user && hasPermission(PermissionEnum.MANAGE_TRANSLATIONS, user);
  const [localErrors, setLocalErrors] = React.useState<DiscountErrorFragment[]>([]);
  // Keep the layout shell until the first codes fetch settles so we don't flash
  // half-loaded UI. Keyed by voucher id so refetches after reveal stay on the form.
  const [revealedForVoucherId, setRevealedForVoucherId] = React.useState<string | null>(null);

  React.useEffect(
    function revealWhenPrimaryQueriesSettle() {
      if (voucher && !voucherCodesLoading) {
        setRevealedForVoucherId(voucher.id);
      }
    },
    [voucher, voucherCodesLoading],
  );

  const hasRevealedContent = !!voucher && revealedForVoucherId === voucher.id;

  const openPlaygroundURL = () => {
    context.setDevModeContent(voucherGraphiQLQuery);
    context.setVariables(`{ "id": "${voucher?.id}" }`);
    context.setDevModeVisibility(true);
  };

  const hasMinimalOrderValueRequirement = voucher?.channelListings?.some(
    listing => listing.minSpent?.amount > 0,
  );

  let requirementsPickerInitValue;

  if (voucher?.minCheckoutItemsQuantity > 0) {
    requirementsPickerInitValue = RequirementsPicker.ITEM;
  } else if (hasMinimalOrderValueRequirement) {
    requirementsPickerInitValue = RequirementsPicker.ORDER;
  } else {
    requirementsPickerInitValue = RequirementsPicker.NONE;
  }

  const discountType =
    voucher?.type === VoucherTypeEnum.SHIPPING
      ? DiscountTypeEnum.SHIPPING
      : voucher?.discountValueType === DiscountValueTypeEnum.PERCENTAGE
        ? DiscountTypeEnum.VALUE_PERCENTAGE
        : DiscountTypeEnum.VALUE_FIXED;

  const initialForm: VoucherDetailsPageFormData = useMemo(
    () => ({
      applyOncePerCustomer: voucher?.applyOncePerCustomer || false,
      applyOncePerOrder: voucher?.applyOncePerOrder || false,
      onlyForStaff: voucher?.onlyForStaff || false,
      channelListings,
      name: voucher?.name || "",
      discountType,
      // Unused legacy field — percentages live on `channelListings[].percentageDiscountValue`.
      percentageDiscountValue: "",
      codes: addedVoucherCodes,
      endDate: splitDateTime(voucher?.endDate ?? "").date,
      endTime: splitDateTime(voucher?.endDate ?? "").time,
      hasEndDate: !!voucher?.endDate,
      hasUsageLimit: !!voucher?.usageLimit,
      minCheckoutItemsQuantity: voucher?.minCheckoutItemsQuantity?.toString() ?? "0",
      requirementsPicker: requirementsPickerInitValue,
      startDate: splitDateTime(voucher?.startDate ?? "").date,
      startTime: splitDateTime(voucher?.startDate ?? "").time,
      type: voucher?.type ?? VoucherTypeEnum.ENTIRE_ORDER,
      usageLimit: voucher?.usageLimit ?? 1,
      used: voucher?.used ?? 0,
      singleUse: voucher?.singleUse ?? false,
      metadata: voucher?.metadata.map(mapMetadataItemToInput),
      privateMetadata: voucher?.privateMetadata.map(mapMetadataItemToInput),
    }),
    [
      voucher,
      channelListings,
      savedChannelListings,
      addedVoucherCodes,
      discountType,
      requirementsPickerInitValue,
    ],
  );

  const voucherListBackLink = useBackLinkWithState({
    path: voucherListPath,
  });

  const { VOUCHER_DETAILS_MORE_ACTIONS, VOUCHER_DETAILS_WIDGETS } = useExtensions(
    extensionMountPoints.VOUCHER_DETAILS,
  );
  const extensionMenuItems = getExtensionsItemsForVoucherDetails(
    VOUCHER_DETAILS_MORE_ACTIONS,
    voucher?.id,
  );

  const menuItems = useMemo((): TopNavMenuItem[] => {
    const items: TopNavMenuItem[] = extensionMenuItems.map(item => ({
      ...item,
      disabled,
    }));

    if (onShowSetupChecklist) {
      items.push({
        label: intl.formatMessage(messages.showSetupChecklist),
        onSelect: onShowSetupChecklist,
        testId: "show-setup-checklist",
        icon: <ListChecks size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    items.push({
      label: intl.formatMessage(messages.openGraphiQL),
      onSelect: openPlaygroundURL,
      testId: "graphiql-redirect",
      icon: <GraphqlIcon />,
    });
    items.push({
      label: intl.formatMessage(messages.deleteVoucher),
      onSelect: onRemove,
      testId: "delete-voucher",
      color: "critical1",
      icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
    });

    return items;
  }, [disabled, extensionMenuItems, intl, onRemove, onShowSetupChecklist]);

  // Do not mount Form with invented ENTIRE_ORDER / VALUE_FIXED defaults — that flashes
  // the wrong discount selection before voucher syncs (Geist: no fake selected state).
  // Also wait for the initial codes query so the page doesn't reveal in half-loaded frames.
  if (!voucher || !hasRevealedContent) {
    return <VoucherDetailsPageLoading voucher={voucher} />;
  }

  return (
    <Form
      key={voucher.id}
      confirmLeave
      formId={VOUCHER_UPDATE_FORM_ID}
      initial={initialForm}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {form => {
        const handleSubmit = createVoucherUpdateHandler(form.submit, setLocalErrors);

        return (
          <VoucherDetailsPageFormContent
            form={form}
            activeTab={activeTab}
            tabItemsCount={tabItemsCount}
            errors={errors}
            localErrors={localErrors}
            saveButtonBarState={saveButtonBarState}
            voucher={voucher}
            allChannelsCount={allChannelsCount}
            channelListings={channelListings}
            savedChannelListings={savedChannelListings}
            initialUsageLimit={initialForm.usageLimit}
            selectedVoucherCodesIds={selectedVoucherCodesIds}
            voucherCodes={voucherCodes}
            addedVoucherCodes={addedVoucherCodes}
            pendingRemovedCodeIds={pendingRemovedCodeIds}
            hasCatalogueDraftChanges={hasCatalogueDraftChanges}
            hasCountriesDraftChanges={hasCountriesDraftChanges}
            voucherCodesLoading={voucherCodesLoading}
            voucherCodesPagination={voucherCodesPagination}
            voucherCodesSettings={voucherCodesSettings}
            deleteVoucherCodesTransitionState={deleteVoucherCodesTransitionState}
            voucherListBackLink={voucherListBackLink}
            menuItems={menuItems}
            canTranslate={!!canTranslate}
            onTranslate={() =>
              navigate(
                languageEntityUrl(
                  lastUsedLocaleOrFallback,
                  TranslatableEntities.vouchers,
                  voucher?.id,
                ),
              )
            }
            onShowMetadata={onShowMetadata}
            onRemove={onRemove}
            setupEmphasized={setupEmphasized}
            setupCardDismissed={setupCardDismissed}
            setupCardDisplayReady={setupCardDisplayReady}
            onDismissSetupCard={onDismissSetupCard}
            onCancel={() => navigate(voucherListBackLink)}
            onSubmit={data => handleSubmit(data)}
            onTabClick={onTabClick}
            onChannelsChange={onChannelsChange}
            openChannelsModal={openChannelsModal}
            onCategoryAssign={onCategoryAssign}
            onCategoryUnassign={onCategoryUnassign}
            onCollectionAssign={onCollectionAssign}
            onCollectionUnassign={onCollectionUnassign}
            onCountryAssign={onCountryAssign}
            onCountryUnassign={onCountryUnassign}
            onProductAssign={onProductAssign}
            onProductUnassign={onProductUnassign}
            onVariantAssign={onVariantAssign}
            onVariantUnassign={onVariantUnassign}
            catalogueNumberOfRows={catalogueNumberOfRows}
            onCatalogueListSettingsUpdate={onCatalogueListSettingsUpdate}
            onMultipleVoucherCodesGenerate={onMultipleVoucherCodesGenerate}
            onCustomVoucherCodeGenerate={onCustomVoucherCodeGenerate}
            onDeleteVoucherCodes={onDeleteVoucherCodes}
            onSelectedCodesChange={onSelectedCodesChange}
            onVoucherCodesSettingsChange={onVoucherCodesSettingsChange}
            voucherWidgets={VOUCHER_DETAILS_WIDGETS}
            disabled={disabled}
            selectedChannelId={selectedChannelId}
            isChecked={isChecked}
            selected={selected}
            toggle={toggle}
            toggleAll={toggleAll}
            categoryListToolbar={categoryListToolbar}
            collectionListToolbar={collectionListToolbar}
            productListToolbar={productListToolbar}
            variantListToolbar={variantListToolbar}
          />
        );
      }}
    </Form>
  );
};

VoucherDetailsPage.displayName = "VoucherDetailsPage";

export default VoucherDetailsPage;
