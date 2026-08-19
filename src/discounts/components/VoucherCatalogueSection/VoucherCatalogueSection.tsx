import { Callout } from "@dashboard/components/Callout/Callout";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { type DiscountErrorFragment, type SearchProductFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { type Node } from "@dashboard/types";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { FolderTree, Layers, Package, Plus, Tags } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DiscountCategories } from "../DiscountCategories/DiscountCategories";
import { DiscountCollections } from "../DiscountCollections/DiscountCollections";
import { DiscountProducts } from "../DiscountProducts/DiscountProducts";
import { DiscountVariants } from "../DiscountVariants/DiscountVariants";
import { VoucherDetailsPageTab, type VoucherTabItemsCount } from "../VoucherDetailsPage";
import { voucherCatalogueMessages as messages } from "./messages";
import { formatVoucherCatalogueErrorMessage } from "./voucherCatalogueErrors";
import styles from "./VoucherCatalogueSection.module.css";

interface VoucherCatalogueSectionProps {
  isChecked: (id: string) => boolean | undefined;
  selected: number;
  toggle: (id: string) => void;
  toggleAll: (items: Node[], selected: number) => void;
  toolbar?: ReactNode;
  disabled: boolean;
  /** Save / catalogue-mutation errors that belong on this section. */
  errors?: DiscountErrorFragment[];
  activeTab: VoucherDetailsPageTab;
  tabItemsCount: VoucherTabItemsCount;
  categories: Parameters<typeof DiscountCategories>[0]["categories"];
  collections: Parameters<typeof DiscountCollections>[0]["collections"];
  products: SearchProductFragment[];
  variants: Parameters<typeof DiscountVariants>[0]["variants"];
  numberOfRows: number;
  onUpdateListSettings: (key: "rowNumber", value: number) => void;
  onTabClick: (tab: VoucherDetailsPageTab) => void;
  onCategoryAssign: () => void;
  onCategoryUnassign: (id: string) => void;
  onCollectionAssign: () => void;
  onCollectionUnassign: (id: string) => void;
  onProductAssign: () => void;
  onProductUnassign: (id: string) => void;
  onVariantAssign: () => void;
  onVariantUnassign: (id: string) => void;
  categoryListToolbar?: ReactNode;
  collectionListToolbar?: ReactNode;
  productListToolbar?: ReactNode;
  variantListToolbar?: ReactNode;
}

interface CatalogueRowConfig {
  tab: VoucherDetailsPageTab;
  testId: string;
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  count: number;
  assignAriaLabel: string;
  onAssign: () => void;
  assignTestId: string;
  panel: ReactNode;
}

export const VoucherCatalogueSection = ({
  activeTab,
  tabItemsCount,
  categories,
  collections,
  products,
  variants,
  disabled,
  errors = [],
  onTabClick,
  onCategoryAssign,
  onCategoryUnassign,
  onCollectionAssign,
  onCollectionUnassign,
  onProductAssign,
  onProductUnassign,
  onVariantAssign,
  onVariantUnassign,
  numberOfRows,
  onUpdateListSettings,
  isChecked,
  selected,
  toggle,
  toggleAll,
  toolbar,
  categoryListToolbar,
  collectionListToolbar,
  productListToolbar,
  variantListToolbar,
}: VoucherCatalogueSectionProps): JSX.Element => {
  const intl = useIntl();
  const catalogueErrorMessage = formatVoucherCatalogueErrorMessage(errors, intl);
  const categoriesCount = tabItemsCount.categories ?? 0;
  const collectionsCount = tabItemsCount.collections ?? 0;
  const productsCount = tabItemsCount.products ?? 0;
  const variantsCount = tabItemsCount.variants ?? 0;
  const hasNoAssignments =
    categoriesCount === 0 && collectionsCount === 0 && productsCount === 0 && variantsCount === 0;

  const rows: CatalogueRowConfig[] = [
    {
      tab: VoucherDetailsPageTab.categories,
      testId: "categories-catalogue-group",
      icon: <FolderTree size={16} />,
      title: <FormattedMessage {...messages.categoriesTitle} />,
      description: <FormattedMessage {...messages.categoriesDescription} />,
      count: categoriesCount,
      assignAriaLabel: intl.formatMessage(messages.assignCategoriesAria),
      onAssign: onCategoryAssign,
      assignTestId: "assign-category-button",
      panel:
        activeTab === VoucherDetailsPageTab.categories ? (
          <DiscountCategories
            embedded
            disabled={disabled}
            onCategoryAssign={onCategoryAssign}
            onCategoryUnassign={onCategoryUnassign}
            categories={categories}
            isChecked={isChecked}
            selected={selected}
            toggle={toggle}
            toggleAll={toggleAll}
            toolbar={categoryListToolbar ?? toolbar}
            numberOfRows={numberOfRows}
            onUpdateListSettings={onUpdateListSettings}
          />
        ) : null,
    },
    {
      tab: VoucherDetailsPageTab.collections,
      testId: "collections-catalogue-group",
      icon: <Layers size={16} />,
      title: <FormattedMessage {...messages.collectionsTitle} />,
      description: <FormattedMessage {...messages.collectionsDescription} />,
      count: collectionsCount,
      assignAriaLabel: intl.formatMessage(messages.assignCollectionsAria),
      onAssign: onCollectionAssign,
      assignTestId: "assign-collection-button",
      panel:
        activeTab === VoucherDetailsPageTab.collections ? (
          <DiscountCollections
            embedded
            disabled={disabled}
            onCollectionAssign={onCollectionAssign}
            onCollectionUnassign={onCollectionUnassign}
            collections={collections}
            isChecked={isChecked}
            selected={selected}
            toggle={toggle}
            toggleAll={toggleAll}
            toolbar={collectionListToolbar ?? toolbar}
            numberOfRows={numberOfRows}
            onUpdateListSettings={onUpdateListSettings}
          />
        ) : null,
    },
    {
      tab: VoucherDetailsPageTab.products,
      testId: "products-catalogue-group",
      icon: <Package size={16} />,
      title: <FormattedMessage {...messages.productsTitle} />,
      description: <FormattedMessage {...messages.productsDescription} />,
      count: productsCount,
      assignAriaLabel: intl.formatMessage(messages.assignProductsAria),
      onAssign: onProductAssign,
      assignTestId: "assign-products",
      panel:
        activeTab === VoucherDetailsPageTab.products ? (
          <DiscountProducts
            embedded
            disabled={disabled}
            onProductAssign={onProductAssign}
            onProductUnassign={onProductUnassign}
            products={products}
            isChecked={isChecked}
            selected={selected}
            toggle={toggle}
            toggleAll={toggleAll}
            toolbar={productListToolbar ?? toolbar}
            numberOfRows={numberOfRows}
            onUpdateListSettings={onUpdateListSettings}
          />
        ) : null,
    },
    {
      tab: VoucherDetailsPageTab.variants,
      testId: "variants-catalogue-group",
      icon: <Tags size={16} />,
      title: <FormattedMessage {...messages.variantsTitle} />,
      description: <FormattedMessage {...messages.variantsDescription} />,
      count: variantsCount,
      assignAriaLabel: intl.formatMessage(messages.assignVariantsAria),
      onAssign: onVariantAssign,
      assignTestId: "assign-variant",
      panel:
        activeTab === VoucherDetailsPageTab.variants ? (
          <DiscountVariants
            embedded
            disabled={disabled}
            onVariantAssign={onVariantAssign}
            onVariantUnassign={onVariantUnassign}
            variants={variants}
            isChecked={isChecked}
            selected={selected}
            toggle={toggle}
            toggleAll={toggleAll}
            toolbar={variantListToolbar ?? toolbar}
            numberOfRows={numberOfRows}
            onUpdateListSettings={onUpdateListSettings}
          />
        ) : null,
    },
  ];

  return (
    <DetailSettingsCard
      data-test-id="voucher-catalogue-section"
      title={intl.formatMessage(messages.title)}
      intro={
        <Text size={3} color="default2">
          {hasNoAssignments ? (
            <FormattedMessage {...messages.introEmpty} />
          ) : (
            <FormattedMessage {...messages.intro} />
          )}
        </Text>
      }
      contentFlush
    >
      {catalogueErrorMessage ? (
        <Box paddingX={6} paddingY={4} data-test-id="voucher-catalogue-error">
          <Callout type="error" title={catalogueErrorMessage} />
        </Box>
      ) : null}
      <Box as="ul" className={styles.list}>
        {rows.map(row => {
          const isExpanded = activeTab === row.tab;

          return (
            <Box
              as="li"
              key={row.tab}
              className={isExpanded ? `${styles.row} ${styles.rowExpanded}` : styles.row}
              data-test-id={row.testId}
            >
              <Box
                as="div"
                className={styles.rowHeader}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={() => onTabClick(row.tab)}
                onKeyDown={event => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onTabClick(row.tab);
                  }
                }}
              >
                <Box className={styles.icon} aria-hidden>
                  {row.icon}
                </Box>
                <Box className={styles.content}>
                  <Text size={3} fontWeight="medium">
                    {row.title}
                  </Text>
                  <Text size={2} color="default2">
                    {row.description}
                  </Text>
                </Box>
                <Box className={styles.meta}>
                  <Text size={2} color="default2" className={styles.count}>
                    <FormattedMessage {...messages.assignedCount} values={{ count: row.count }} />
                  </Text>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={disabled}
                    data-test-id={row.assignTestId}
                    aria-label={row.assignAriaLabel}
                    onClick={event => {
                      event.stopPropagation();
                      onTabClick(row.tab);
                      row.onAssign();
                    }}
                  >
                    <Plus size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                    <FormattedMessage {...buttonMessages.assign} />
                  </Button>
                </Box>
              </Box>
              {isExpanded ? (
                <Box className={styles.panel}>
                  <Box className={styles.panelCard}>{row.panel}</Box>
                </Box>
              ) : null}
            </Box>
          );
        })}
      </Box>
    </DetailSettingsCard>
  );
};
