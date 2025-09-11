import Drag from "@dashboard/icons/Drag";
import { productVariantEditUrl } from "@dashboard/products/urls";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { messages } from "../messages";
import { ProductVariantItem, ProductVariantItemThumbnail } from "../types";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface VariantItemProps {
  variant: ProductVariantItem;
  thumbnail: ProductVariantItemThumbnail | undefined;
  isDefault: boolean;
  isActive: boolean;
  productId: string;
  draggable: boolean;
}

export const VariantItem = ({
  variant,
  thumbnail,
  isDefault,
  isActive,
  draggable,
}: VariantItemProps) => {
  const intl = useIntl();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: variant.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      display="block"
      borderLeftStyle="solid"
      // Passing undefined here shows the border for active item
      // that changes color in dark and light mode
      __borderColor={isActive ? undefined : "transparent"}
      __borderLeftWidth={2}
    >
      <Box maxWidth="100%" paddingX={2} paddingY={1} display="flex" alignItems="center" gap={5}>
        <Box
          {...attributes}
          {...listeners}
          cursor={draggable ? "grabbing" : "auto"}
          paddingTop={1}
          color="default2"
        >
          <Drag />
        </Box>

        <Link to={productVariantEditUrl(variant.id)} style={{ width: "100%" }}>
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

            <Box>
              <Text wordBreak="break-word" data-test-id="variant-name">
                {variant ? variant.name || variant.sku : <Skeleton />}
              </Text>
              {isDefault && (
                <Text display="block" size={2} color="default2">
                  {intl.formatMessage(messages.defaultVariant)}
                </Text>
              )}
            </Box>
          </Box>
        </Link>
      </Box>
    </Box>
  );
};
