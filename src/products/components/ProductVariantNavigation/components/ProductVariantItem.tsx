import Drag from "@dashboard/icons/Drag";
import { productVariantEditUrl } from "@dashboard/products/urls";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { messages } from "../messages";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface VariantItemProps {
  variant: any;
  thumbnail: any;
  isDefault: boolean;
  isActive: boolean;
  productId: string;
  draggable: boolean;
}

export const VariantItem: React.FC<VariantItemProps> = ({
  variant,
  thumbnail,
  isDefault,
  isActive,
  productId,
  draggable,
}) => {
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
      __borderLeftWidth={2}
      __marginBottom="-3px"
      __borderColor={isActive ? undefined : "transparent"}
    >
      <Box maxWidth="100%" paddingX={2} paddingY={1} display="flex" alignItems="center" gap={5}>
        <Box
          {...attributes}
          {...listeners}
          cursor={draggable ? "grabbing" : "auto"}
          __marginBottom="-2px"
          color="default2"
        >
          <Drag />
        </Box>

        <Link to={productVariantEditUrl(productId, variant.id)} style={{ width: "100%" }}>
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
                alt={variant.name || variant.sku}
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
