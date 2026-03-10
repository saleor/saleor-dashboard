import { forwardRef, InputHTMLAttributes } from "react";
import { classNames } from "~/utils";
import { Box, PropsWithBox } from "../Box";
import { SearchIcon } from "../Icons";
import {
  InputContainerVariants,
  inputContainer,
  input,
  searchIcon,
} from "./SearchInput.css";

export type SearchInputProps = PropsWithBox<
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "color" | "width" | "height" | "size" | "nonce"
  >
> &
  InputContainerVariants;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ id, className, size, ...props }, ref) => {
    return (
      <Box
        id={id}
        className={classNames(inputContainer({ size }), className)}
        data-macaw-ui-component="SearchInput"
      >
        <SearchIcon size="medium" className={searchIcon()} />
        <Box as="input" className={input()} ref={ref} type="text" {...props} />
      </Box>
    );
  }
);

SearchInput.displayName = "SearchInput";
