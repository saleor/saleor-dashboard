import { SaleorThrobber } from "@dashboard/components/Throbber";
import { productVariantEditUrl } from "@dashboard/products/urls";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { GripVertical } from "lucide-react";
import { type CSSProperties, memo, type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { messages } from "../messages";
import { type ProductVariantItem, type ProductVariantItemThumbnail } from "../types";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface VariantItemProps {
  variant: ProductVariantItem;
  thumbnail: ProductVariantItemThumbnail | undefined;
  isDefault: boolean;
  isActive: boolean;
  /** Selected in the URL but variant details are still loading. */
  isPending?: boolean;
  productId: string;
  draggable: boolean;
  /**
   * When false, render outside a SortableContext (e.g. sticky pinned current
   * above the scroll list, or while search disables reorder). Defaults to true.
   */
  sortable?: boolean;
  /** When false, omit the drag handle (pinned current is not reorderable). */
  showDragHandle?: boolean;
  /** Optional caption on its own row under the image/name line. */
  caption?: ReactNode;
}

interface VariantItemContentProps {
  variant: ProductVariantItem;
  thumbnail: ProductVariantItemThumbnail | undefined;
  isDefault: boolean;
  isActive: boolean;
  isPending?: boolean;
  draggable: boolean;
  showDragHandle?: boolean;
  caption?: ReactNode;
  rowRef?: (node: HTMLDivElement | null) => void;
  style?: CSSProperties;
  dragHandleProps?: Record<string, unknown>;
}

const VariantItemContent = ({
  variant,
  thumbnail,
  isDefault,
  isActive,
  isPending = false,
  draggable,
  showDragHandle = true,
  caption,
  rowRef,
  style,
  dragHandleProps,
}: VariantItemContentProps) => {
  const intl = useIntl();
  // Active uses the theme accent border; pending uses a neutral gray at the
  // same thickness so the row does not jump when details finish loading.
  const borderLeftColor = isActive
    ? undefined
    : isPending
      ? "var(--mu-colors-border-default1)"
      : "transparent";

  const label = (
    <Box display="flex" alignItems="center" gap={5}>
      {thumbnail?.url ? (
        <Box
          as="img"
          width={10}
          height={10}
          objectFit="cover"
          borderRadius={2}
          borderColor="default1"
          borderStyle="solid"
          borderWidth={1}
          padding={1}
          flexShrink="0"
          src={thumbnail.url}
          alt={variant.name || variant.sku || ""}
        />
      ) : (
        <ImagePlaceholder />
      )}

      <Box __minWidth={0} display="flex" alignItems="center" gap={2}>
        <Box __minWidth={0}>
          <Text wordBreak="break-word" data-test-id="variant-name">
            {variant ? variant.name || variant.sku : <Skeleton />}
          </Text>
          {isDefault && (
            <Text display="block" size={2} color="default2">
              {intl.formatMessage(messages.defaultVariant)}
            </Text>
          )}
        </Box>
        {isPending && (
          <Box flexShrink="0" display="flex" alignItems="center">
            <SaleorThrobber size={16} />
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      ref={rowRef}
      style={style}
      display="block"
      borderLeftStyle="solid"
      // Passing undefined here shows the accent border for the active item
      // that changes color in dark and light mode
      __borderColor={borderLeftColor}
      __borderLeftWidth={2}
      data-variant-id={variant.id}
      data-test-pending={isPending ? "true" : undefined}
      aria-busy={isPending || undefined}
      __opacity={isPending ? 0.72 : undefined}
    >
      <Box maxWidth="100%" paddingX={2} paddingY={2} display="flex" alignItems="center" gap={5}>
        {/*
          Fixed handle column for every row (icon or empty) so pinned
          thumbnails line up with list rows that show a drag grip.
        */}
        <Box
          {...(showDragHandle && !isPending ? dragHandleProps : undefined)}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink="0"
          width={6}
          height={6}
          cursor={showDragHandle && draggable && !isPending ? "grabbing" : "auto"}
          color="default2"
          aria-hidden={!showDragHandle}
        >
          {showDragHandle ? <GripVertical size={16} /> : null}
        </Box>

        <Box __minWidth={0} width="100%">
          {isPending ? (
            <Box style={{ pointerEvents: "none" }} width="100%" tabIndex={-1} aria-disabled="true">
              {label}
            </Box>
          ) : (
            <Link
              to={productVariantEditUrl(variant.id)}
              style={{ display: "block", width: "100%" }}
            >
              {label}
            </Link>
          )}

          {caption ? <Box paddingTop={1}>{caption}</Box> : null}
        </Box>
      </Box>
    </Box>
  );
};

const SortableVariantItem = ({
  variant,
  thumbnail,
  isDefault,
  isActive,
  isPending = false,
  draggable,
  showDragHandle = true,
  caption,
}: Omit<VariantItemProps, "productId" | "sortable">) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: variant.id,
    disabled: isPending || !draggable,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <VariantItemContent
      variant={variant}
      thumbnail={thumbnail}
      isDefault={isDefault}
      isActive={isActive}
      isPending={isPending}
      draggable={draggable}
      showDragHandle={showDragHandle}
      caption={caption}
      rowRef={setNodeRef}
      style={style}
      dragHandleProps={{ ...attributes, ...listeners }}
    />
  );
};

export const VariantItem = memo(function VariantItem({
  variant,
  thumbnail,
  isDefault,
  isActive,
  isPending = false,
  draggable,
  sortable = true,
  showDragHandle = true,
  caption,
}: VariantItemProps) {
  if (!sortable) {
    return (
      <VariantItemContent
        variant={variant}
        thumbnail={thumbnail}
        isDefault={isDefault}
        isActive={isActive}
        isPending={isPending}
        draggable={false}
        showDragHandle={showDragHandle}
        caption={caption}
      />
    );
  }

  return (
    <SortableVariantItem
      variant={variant}
      thumbnail={thumbnail}
      isDefault={isDefault}
      isActive={isActive}
      isPending={isPending}
      draggable={draggable}
      showDragHandle={showDragHandle}
      caption={caption}
    />
  );
});
