import { Root as Portal } from "@radix-ui/react-portal";
import {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from "react";

import { Box, List, PropsWithBox, Text } from "~/components";
import { HelperText, InputVariants } from "~/components/BaseInput";
import {
  getListDisplayMode,
  getListTextSize,
  hasNoOptions,
  listItemStyle,
  listStyle,
  listWrapperRecipe,
  LoadingListItem,
  MultiChangeHandler,
  NoOptions,
  Option,
} from "~/components/BaseSelect";

import { useFloating } from "~/hooks/useFloating";
import { useInfinityScroll } from "~/hooks/useInfinityScroll";
import { formEventTypeAdapter } from "~/utils/formEventTypeAdapter";
import {
  multiselectInputRecipe,
  MultiselectWrapper,
  RenderEndAdornmentType,
  useMultiselect,
} from "../Common";

export type DynamicMultiselectProps<T> = PropsWithBox<
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
    helperText?: ReactNode;
    options: T[];
    onChange?: MultiChangeHandler<T>;
    value: T[];
    renderEndAdornment?: RenderEndAdornmentType;
    onInputValueChange?: (value: string) => void;
    loading?: boolean;
    children?: ReactNode;
    locale?: {
      loadingText?: string;
      placeholderText?: string;
    };
    onScrollEnd?: () => void;
  }
> &
  InputVariants;

const DynamicMultiselectInner = <T extends Option>(
  {
    size,
    disabled = false,
    className,
    label,
    id,
    error = false,
    helperText,
    options,
    onChange,
    renderEndAdornment,
    value = [],
    onInputValueChange,
    loading,
    onFocus,
    onBlur,
    locale,
    children,
    onScrollEnd,
    ...props
  }: DynamicMultiselectProps<T>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const {
    active,
    typed,
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    itemsToSelect,
    selectedItems,
    getSelectedItemProps,
    inputValue,
    removeSelectedItem,
    getToggleButtonProps,
    hasItemsToSelect,
    showInput,
  } = useMultiselect<T, T>({
    selectedValues: value,
    showEmptyState: hasNoOptions(children),
    onInputValueChange,
    options,
    onChange,
    onFocus,
    onBlur,
  });

  const { refs, floatingStyles } = useFloating<HTMLLabelElement>({
    shouldUpdate: isOpen,
  });

  const scrollRef = useInfinityScroll(onScrollEnd);

  const inputProps = getInputProps({
    id,
    ref,
    value: inputValue,
  });

  return (
    <Box display="flex" flexDirection="column">
      <MultiselectWrapper
        ref={refs.reference}
        id={id}
        typed={typed}
        active={active}
        disabled={disabled}
        size={size}
        label={label}
        error={error}
        className={className}
        getLabelProps={getLabelProps}
        getToggleButtonProps={getToggleButtonProps}
        renderEndAdornment={renderEndAdornment}
        hasItemsToSelect={hasItemsToSelect}
      >
        {selectedItems.map((item, idx) => (
          <Box
            key={`selected-option-${item.value}-${idx}`}
            data-test-id={`selected-option-${item.value}-${idx}`}
            paddingX={1.5}
            paddingY="px"
            backgroundColor="default1"
            borderColor="default1"
            borderWidth={1}
            borderStyle="solid"
            borderRadius={3}
            display="flex"
            gap={1}
            alignItems="center"
            {...getSelectedItemProps({
              selectedItem: item,
              index: idx,
            })}
          >
            <Text size={1}>{item.label}</Text>
            {!disabled && (
              <Text
                cursor="pointer"
                size={1}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  removeSelectedItem(item);
                }}
              >
                &#10005;
              </Text>
            )}
          </Box>
        ))}

        <Box
          as="input"
          className={multiselectInputRecipe({ size, error })}
          placeholder={locale?.placeholderText || "Add item"}
          disabled={disabled}
          width={0}
          __flex={1}
          minWidth={7}
          visibility={showInput ? "visible" : "hidden"}
          {...inputProps}
          {...props}
          onChange={
            inputProps.onChange && formEventTypeAdapter(inputProps.onChange)
          }
        />
      </MultiselectWrapper>

      <Portal asChild style={floatingStyles}>
        <Box
          position="relative"
          display={getListDisplayMode({
            isOpen,
            loading,
            hasItemsToSelect,
            disabled,
            showEmptyState: hasNoOptions(children),
          })}
          className={listWrapperRecipe({ size })}
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
                  key={`to-select-${id}-${item.value}-${index}`}
                  className={listItemStyle}
                  active={highlightedIndex === index}
                  {...getItemProps({
                    item,
                    index,
                    disabled: item.disabled,
                  })}
                >
                  <Text
                    color={item.disabled ? "defaultDisabled" : undefined}
                    size={getListTextSize(size)}
                  >
                    {item.label}
                  </Text>
                </List.Item>
              ))}

            {isOpen && !loading && !hasItemsToSelect && children}

            {loading && (
              <LoadingListItem size={size}>
                {locale?.loadingText || "Loading"}
              </LoadingListItem>
            )}
            <div
              ref={(ref) => {
                scrollRef.current = ref;
              }}
            />
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

const DynamicMultiselectRoot = forwardRef(DynamicMultiselectInner) as <
  T extends Option,
>(
  props: DynamicMultiselectProps<T> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  }
) => ReturnType<typeof DynamicMultiselectInner>;

export const DynamicMultiselect = Object.assign(DynamicMultiselectRoot, {
  NoOptions,
});
