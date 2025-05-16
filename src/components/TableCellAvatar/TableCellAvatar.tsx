import { ImagePlaceholder } from "@dashboard/products/components/ProductVariantNavigation/components/ImagePlaceholder";
// import { TableCellProps } from "@material-ui/core/TableCell";
import { Box, BoxProps, Skeleton, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";

// import { AvatarProps } from "./Avatar";

const IMAGE_SIZE = 10 as const;
const BORDER_RADIUS = 2 as const;

interface TableCellAvatarProps extends BoxProps {
  className?: string;
  avatarClassName?: string;
  badge?: React.ReactNode;
  thumbnail?: string;
}

const TableCellAvatar = (props: TableCellAvatarProps) => {
  const { className, avatarClassName, thumbnail, badge, width, children, style, ...rest } = props;

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showLoading = isLoading && thumbnail;

  const getImage = () => {
    if (hasError || !thumbnail) {
      return <ImagePlaceholder />;
    }

    return (
      <Box
        as="img"
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        objectFit="cover"
        borderRadius={BORDER_RADIUS}
        borderColor="default1"
        borderStyle="solid"
        borderWidth={1}
        flexShrink="0"
        src={thumbnail}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        opacity={isLoading ? "0" : "1"} // Hide the image until it loads
        __transition="opacity 0.2s ease-in-out"
        className={avatarClassName}
        __width={width}
        style={style}
      />
    );
  };

  return (
    <Box
      as="td"
      className={className}
      data-test-id="table-cell-avatar"
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderColor="default1"
      position="relative"
      __display="table-cell"
      textAlign="left"
      {...rest}
    >
      {showLoading && (
        <Skeleton
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          borderRadius={BORDER_RADIUS}
          borderColor="default1"
          borderStyle="solid"
          borderWidth={1}
          padding={1}
          flexShrink="0"
          position="absolute"
          __top="50%"
          __transform="translateY(-50%)"
        />
      )}

      <Box display="flex" flexDirection="row" alignItems="center">
        {badge}

        {getImage()}

        {children && (
          <Text alignSelf="center" marginLeft={2} width="100%" fontSize={3}>
            {children}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default TableCellAvatar;
