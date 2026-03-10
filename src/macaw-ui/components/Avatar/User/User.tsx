import { DataAttributes } from "~/components/types";
import { classNames } from "~/utils";

import { Box, PropsWithBox } from "../../Box";
import { convertSizeToScale, Text } from "../../Text";

import { userAvatar, UserAvatarVariants } from "./User.css";

export type UserAvatarProps = PropsWithBox<
  DataAttributes & {
    className?: string;
    initials?: string;
    src?: string;
  }
> &
  UserAvatarVariants;

export const User = (props: UserAvatarProps) => {
  if ("src" in props) {
    const { src, size, scheme, className, ...rest } = props;
    return (
      <Box
        as="img"
        src={src}
        alt="User avatar image"
        className={classNames(
          userAvatar({ size, scheme, type: "image" }),
          className
        )}
        data-macaw-ui-component="Avatar.User"
        {...rest}
      />
    );
  }

  const { size, scheme, className, initials, ...rest } = props;
  return (
    <Box
      className={classNames(
        userAvatar({ size, scheme, type: "initials" }),
        className
      )}
      data-macaw-ui-component="Avatar.User"
      {...rest}
    >
      <Text size={convertSizeToScale(size)} color="inherit" fontWeight="medium">
        {initials}
      </Text>
    </Box>
  );
};

User.displayName = "Avatar.User";
