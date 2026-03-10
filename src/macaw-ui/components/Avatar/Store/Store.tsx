import { DataAttributes } from "~/components/types";
import { classNames } from "~/utils";

import { Box, PropsWithBox } from "../../Box";
import { convertSizeToScale, Text } from "../../Text";

import { storeAvatar, StoreAvatarVariants } from "./Store.css";

export type StoreAvatarProps = PropsWithBox<
  DataAttributes & {
    className?: string;
    initials?: string;
    src?: string;
  }
> &
  StoreAvatarVariants;

export const Store = (props: StoreAvatarProps) => {
  if ("src" in props) {
    const { src, size, scheme, className, ...rest } = props;
    return (
      <Box
        as="img"
        src={src}
        alt="Store avatar image"
        className={classNames(
          storeAvatar({ size, scheme, type: "image" }),
          className
        )}
        data-macaw-ui-component="Avatar.Store"
        {...rest}
      />
    );
  }

  const { size, scheme, className, initials, ...rest } = props;
  return (
    <Box
      className={classNames(
        storeAvatar({ size, scheme, type: "initials" }),
        className
      )}
      data-macaw-ui-component="Avatar.Store"
      {...rest}
    >
      <Text size={convertSizeToScale(size)} color="inherit" fontWeight="medium">
        {initials}
      </Text>
    </Box>
  );
};

Store.displayName = "Avatar.Store";
