import { Root as Portal } from "@radix-ui/react-portal";
import {
  ForwardedRef,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
} from "react";

import { Box, List, PropsWithBox, Text } from "~/components";
import { HelperText, InputVariants, inputRecipe } from "~/components/BaseInput";
import {
  NoOptions,
  Option,
  SingleChangeHandler,
  getListDisplayMode,
  getListTextSize,
  hasNoOptions,
  listItemStyle,
  listStyle,
  listWrapperRecipe,
} from "~/components/BaseSelect";
import { classNames, isString } from "~/utils";

import { useFloating } from "~/hooks/useFloating";
import { formEventTypeAdapter } from "~/utils/formEventTypeAdapter";
import { ComboboxWrapper } from "../Common";
import { useCombobox } from "../Common/useCombobox";

export type ComboboxProps<T, V> = PropsWithBox<
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "color"
    | "width"
    | "height"
    | "size"
    | "type"
    | "children"
    | "onChange"
    | "value"
    | "nonce"
  > & {
    label?: ReactNode;
    error?: boolean;
    startAdornment?: (inputValue: V | null) => ReactNode;
    endAdornment?: (inputValue: V | null) => ReactNode;
    helperText?: ReactNode;
    children?: ReactNode;
    options: T[];
    onChange?: SingleChangeHandler<V | null>;
    value: V | null;
  }
> &
  InputVariants;

const ComboboxInner = <T extends Option, V extends Option | string>(
  {
    size,
    disabled = false,
    className,
    value,
    label,
    id,
    error = false,
    helperText,
    options,
    onChange,
    onFocus,
    onBlur,
    startAdornment,
    endAdornment,
    children,
    ...props
  }: ComboboxProps<T, V>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const isValuePassedAsString = isString(value);

  const {
    active,
    typed,
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    itemsToSelect,
    hasItemsToSelect,
  } = useCombobox({
    selectedItem: isValuePassedAsString
      ? options.find((option) => option.value === value)
      : value,
    isValuePassedAsString,
    options,
    onChange,
    onFocus,
    onBlur,
  });

  const { refs, floatingStyles } = useFloating<HTMLLabelElement>({
    shouldUpdate: isOpen,
  });

  const inputProps = getInputProps({
    id,
    ref,
  });

  return (
    <Box display="flex" flexDirection="column">
      <ComboboxWrapper
        id={id}
        ref={refs.reference}
        typed={typed}
        active={active}
        disabled={disabled}
        size={size}
        label={label}
        error={error}
        className={className}
        getLabelProps={getLabelProps}
        getToggleButtonProps={getToggleButtonProps}
      >
        <Box display="flex">
          {startAdornment && typed && <Box>{startAdornment(value)}</Box>}

          <Box
            as="input"
            type="text"
            className={classNames(inputRecipe({ size, error }))}
            disabled={disabled}
            alignItems="center"
            textOverflow="ellipsis"
            title={isString(value) ? value : value?.label}
            {...props}
            {...inputProps}
            onChange={
              inputProps.onChange && formEventTypeAdapter(inputProps.onChange)
            }
          />

          {endAdornment && typed && <Box>{endAdornment(value)}</Box>}
        </Box>
      </ComboboxWrapper>

      <Portal asChild style={floatingStyles}>
        <Box
          position="relative"
          display={getListDisplayMode({
            disabled,
            hasItemsToSelect,
            isOpen,
            showEmptyState: hasNoOptions(children),
          })}
          className={listWrapperRecipe({ size })}
          data-portal-for={id}
        >
          <List
            as="ul"
            className={listStyle}
            {...getMenuProps({ ref: refs.floating })}
          >
            {isOpen &&
              itemsToSelect?.map((item, index) => (
                <List.Item
                  data-test-id="select-option"
                  key={`${id}-${item.value}-${index}`}
                  disabled={item.disabled}
                  className={listItemStyle}
                  {...getItemProps({
                    item,
                    index,
                  })}
                  active={highlightedIndex === index}
                >
                  {item?.startAdornment}
                  <Text
                    color={item.disabled ? "defaultDisabled" : undefined}
                    size={getListTextSize(size)}
                  >
                    {item.label}
                  </Text>
                  {item?.endAdornment}
                </List.Item>
              ))}

            {isOpen && !hasItemsToSelect && children}
          </List>
        </Box>
      </Portal>

      {helperText && (
        <HelperText size={size} error={error}>
          {helperText}
        </HelperText>
      )}
    </Box>
  );
};

const ComboboxRoot = forwardRef(ComboboxInner) as <
  T extends Option,
  V extends Option | string,
>(
  props: ComboboxProps<T, V> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof ComboboxInner>;

export const Combobox = Object.assign(ComboboxRoot, {
  NoOptions,
});
