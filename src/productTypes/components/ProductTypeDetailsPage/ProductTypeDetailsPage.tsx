// @ts-strict-ignore
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form, { FormDirtyStateSync } from "@dashboard/components/Form";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { type MetadataFormData } from "@dashboard/components/Metadata/types";
import { Savebar } from "@dashboard/components/Savebar";
import {
  ProductAttributeType,
  type ProductTypeDetailsQuery,
  ProductTypeKindEnum,
  type TaxClassBaseFragment,
  type WeightUnitsEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { maybe } from "@dashboard/misc";
import { handleTaxClassChange } from "@dashboard/productTypes/handlers";
import { defaultGraphiQLQuery } from "@dashboard/productTypes/queries";
import { productTypeListPath } from "@dashboard/productTypes/urls";
import {
  getVariantSelectionFromAssigned,
  isProductTypeUpdateFormPristine,
} from "@dashboard/productTypes/utils/productTypePageForm";
import {
  type FetchMoreProps,
  type ListActions,
  type ReorderEvent,
  type UserError,
} from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import { LayoutTemplate, Trash2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import ProductTypeAttributes from "../ProductTypeAttributes/ProductTypeAttributes";
import ProductTypeDetails from "../ProductTypeDetails/ProductTypeDetails";
import { ProductTypePdpSchematic } from "../ProductTypePdpSchematic/ProductTypePdpSchematic";
import { useProductTypePdpSchematicDismiss } from "../ProductTypePdpSchematic/useProductTypePdpSchematicDismiss";
import ProductTypeShipping from "../ProductTypeShipping/ProductTypeShipping";
import { ProductTypeTaxes } from "../ProductTypeTaxes/ProductTypeTaxes";
import ProductTypeVariantAttributes from "../ProductTypeVariantAttributes/ProductTypeVariantAttributes";
import { messages } from "./messages";
import { ProductTypeDetailsPageLoading } from "./ProductTypeDetailsPageLoading";
import { ProductTypeSaveCompositionHint } from "./ProductTypeSaveCompositionHint";
import { buildProductTypeSaveComposition } from "./saveComposition";
import { ProductTypeDetailsTitle } from "./Title";

interface ChoiceType {
  label: string;
  value: string;
}

export interface ProductTypeForm extends MetadataFormData {
  name: string;
  kind: ProductTypeKindEnum;
  hasVariants: boolean;
  isShippingRequired: boolean;
  taxClassId: string;
  productAttributes: ChoiceType[];
  variantAttributes: ChoiceType[];
  weight: number;
}

interface ProductTypeDetailsPageProps {
  errors: UserError[];
  productType: ProductTypeDetailsQuery["productType"];
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  productAttributeList: ListActions;
  saveButtonBarState: ConfirmButtonTransitionState;
  taxClasses: TaxClassBaseFragment[];
  variantAttributeList: ListActions;
  onAttributeAdd: (type: ProductAttributeType) => void;
  onAttributeCreate: (type: ProductAttributeType) => void;
  onAttributeReorder: (event: ReorderEvent, type: ProductAttributeType) => void;
  onAttributeUnassign: (id: string) => void;
  onDelete: () => void;
  onShowMetadata: () => void;
  onHasVariantsToggle: (hasVariants: boolean) => void;
  onSubmit: (data: ProductTypeForm) => SubmitPromise;
  setSelectedVariantAttributes: (data: string[]) => void;
  selectedVariantAttributes: string[];
  onFetchMoreTaxClasses: FetchMoreProps;
}

const ProductTypeDetailsPage = ({
  defaultWeightUnit,
  disabled,
  errors,
  productType,
  productAttributeList,
  saveButtonBarState,
  taxClasses,
  variantAttributeList,
  onAttributeAdd,
  onAttributeCreate,
  onAttributeUnassign,
  onAttributeReorder,
  onDelete,
  onShowMetadata,
  onHasVariantsToggle,
  onSubmit,
  setSelectedVariantAttributes,
  selectedVariantAttributes,
  onFetchMoreTaxClasses,
}: ProductTypeDetailsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const {
    isDismissed: schematicDismissed,
    dismiss: dismissSchematic,
    undismiss: undismissSchematic,
  } = useProductTypePdpSchematicDismiss();
  const context = useDevModeContext();
  const openPlaygroundURL = useCallback(() => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${productType?.id}" }`);
    context.setDevModeVisibility(true);
  }, [context, productType?.id]);
  const productTypeListBackLink = useBackLinkWithState({
    path: productTypeListPath,
  });
  const [taxClassDisplayName, setTaxClassDisplayName] = useStateFromProps(
    productType?.taxClass?.name ?? "",
  );
  const formInitialData = useMemo<ProductTypeForm>(
    () => ({
      hasVariants:
        maybe(() => productType.hasVariants) !== undefined ? productType.hasVariants : false,
      isShippingRequired:
        maybe(() => productType.isShippingRequired) !== undefined
          ? productType.isShippingRequired
          : false,
      metadata: [],
      name: maybe(() => productType.name) !== undefined ? productType.name : "",
      kind: productType?.kind || ProductTypeKindEnum.NORMAL,
      privateMetadata: [],
      productAttributes:
        maybe(() => productType.productAttributes) !== undefined
          ? productType.productAttributes.map(attribute => ({
              label: attribute.name,
              value: attribute.id,
            }))
          : [],
      taxClassId: productType?.taxClass?.id ?? "",
      variantAttributes:
        maybe(() => productType.variantAttributes) !== undefined
          ? productType.variantAttributes.map(attribute => ({
              label: attribute.name,
              value: attribute.id,
            }))
          : [],
      weight: maybe(() => productType.weight.value),
    }),
    [productType],
  );
  const initialVariantSelection = useMemo(
    () => getVariantSelectionFromAssigned(productType?.assignedVariantAttributes),
    [productType?.assignedVariantAttributes],
  );
  const checkIfSaveIsDisabled = useCallback(
    (data: ProductTypeForm) => {
      if (disabled) {
        return true;
      }

      if (!productType) {
        return true;
      }

      return isProductTypeUpdateFormPristine(
        data,
        formInitialData,
        selectedVariantAttributes,
        initialVariantSelection,
      );
    },
    [disabled, formInitialData, initialVariantSelection, productType, selectedVariantAttributes],
  );
  const menuItems = useMemo(
    () => [
      ...(schematicDismissed
        ? [
            {
              label: intl.formatMessage(messages.showProductPageLegend),
              onSelect: undismissSchematic,
              testId: "show-product-page-legend",
              icon: (
                <LayoutTemplate size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
              ),
            },
          ]
        : []),
      {
        label: intl.formatMessage(messages.openGraphiQL),
        onSelect: openPlaygroundURL,
        testId: "graphiql-redirect",
        icon: <GraphqlIcon />,
      },
      {
        label: intl.formatMessage(messages.deleteProductType),
        onSelect: onDelete,
        testId: "delete-product-type",
        color: "critical1" as const,
        icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      },
    ],
    [intl, onDelete, openPlaygroundURL, schematicDismissed, undismissSchematic],
  );

  if (!productType) {
    return (
      <ProductTypeDetailsPageLoading
        productTypeListBackLink={productTypeListBackLink}
        schematicDismissed={schematicDismissed}
        onShowMetadata={onShowMetadata}
      />
    );
  }

  return (
    <Form
      key={productType.id}
      initial={formInitialData}
      onSubmit={onSubmit}
      confirmLeave
      disabled={disabled}
      checkIfSaveIsDisabled={checkIfSaveIsDisabled}
    >
      {({ change, data, isSaveDisabled, submit, triggerChange }) => {
        const saveComposition = buildProductTypeSaveComposition(
          data,
          formInitialData,
          selectedVariantAttributes,
          initialVariantSelection,
        );

        return (
          <>
            <FormDirtyStateSync
              enabled={!!productType}
              isSaveDisabled={isSaveDisabled}
              triggerChange={triggerChange}
            />
            <DetailPageLayout>
              <TopNav
                href={productTypeListBackLink}
                hrefIcon={<TopNavDestinationIcon.productTypes />}
                hrefTitle={intl.formatMessage(topNavDestinationMessages.allProductTypes)}
                title={
                  <ProductTypeDetailsTitle
                    productType={productType ? { name: productType.name } : null}
                    loading={disabled}
                  />
                }
                actionsGap={3}
              >
                <TopNav.MetadataButton
                  onClick={onShowMetadata}
                  disabled={!productType}
                  data-test-id="show-product-type-metadata"
                  title={intl.formatMessage(messages.editProductTypeMetadata)}
                />
                <TopNav.Menu
                  items={
                    disabled || !productType
                      ? menuItems.map(item => ({ ...item, disabled: true }))
                      : menuItems
                  }
                  dataTestId="menu"
                />
              </TopNav>
              <DetailPageLayout.Content>
                <DetailPageContent>
                  {!schematicDismissed ? (
                    <Box paddingBottom={6}>
                      <ProductTypePdpSchematic
                        hasVariants={data.hasVariants}
                        productAttributes={productType?.productAttributes}
                        assignedVariantAttributes={productType?.assignedVariantAttributes}
                        selectedVariantAttributeIds={selectedVariantAttributes}
                        onDismiss={dismissSchematic}
                      />
                    </Box>
                  ) : null}
                  <ProductTypeAttributes
                    testId="assign-products-attributes"
                    attributes={maybe(() => productType.productAttributes)}
                    disabled={disabled}
                    type={ProductAttributeType.PRODUCT}
                    onAttributeAssign={onAttributeAdd}
                    onAttributeCreate={onAttributeCreate}
                    onAttributeReorder={(event: ReorderEvent) =>
                      onAttributeReorder(event, ProductAttributeType.PRODUCT)
                    }
                    onAttributeUnassign={onAttributeUnassign}
                    {...productAttributeList}
                  />
                  <ProductTypeVariantAttributes
                    testId="assign-variants-attributes"
                    hasVariants={data.hasVariants}
                    assignedVariantAttributes={productType?.assignedVariantAttributes}
                    disabled={disabled}
                    type={ProductAttributeType.VARIANT}
                    onAttributeAssign={onAttributeAdd}
                    onAttributeCreate={onAttributeCreate}
                    onAttributeReorder={(event: ReorderEvent) =>
                      onAttributeReorder(event, ProductAttributeType.VARIANT)
                    }
                    onAttributeUnassign={onAttributeUnassign}
                    onHasVariantsToggle={onHasVariantsToggle}
                    setSelectedVariantAttributes={setSelectedVariantAttributes}
                    selectedVariantAttributes={selectedVariantAttributes}
                    {...variantAttributeList}
                  />
                </DetailPageContent>
              </DetailPageLayout.Content>
              <DetailPageLayout.RightSidebar paddingTop={6} paddingX={6}>
                <Box display="flex" flexDirection="column" gap={4}>
                  <ProductTypeDetails
                    data={data}
                    disabled={disabled}
                    errors={errors}
                    onChange={change}
                  />
                  <ProductTypeShipping
                    disabled={disabled}
                    data={data}
                    weightUnit={productType?.weight?.unit || defaultWeightUnit}
                    onChange={change}
                  />
                  <ProductTypeTaxes
                    disabled={disabled}
                    data={data}
                    taxClasses={taxClasses}
                    taxClassDisplayName={taxClassDisplayName}
                    onChange={event =>
                      handleTaxClassChange(event, taxClasses, change, setTaxClassDisplayName)
                    }
                    onFetchMore={onFetchMoreTaxClasses}
                  />
                </Box>
              </DetailPageLayout.RightSidebar>
              <Savebar>
                <Savebar.Spacer />
                <ProductTypeSaveCompositionHint composition={saveComposition} />
                <Savebar.CancelButton onClick={() => navigate(productTypeListBackLink)} />
                <Savebar.ConfirmButton
                  transitionState={saveButtonBarState}
                  onClick={submit}
                  disabled={isSaveDisabled}
                />
              </Savebar>
            </DetailPageLayout>
          </>
        );
      }}
    </Form>
  );
};

ProductTypeDetailsPage.displayName = "ProductTypeDetailsPage";
export default ProductTypeDetailsPage;
