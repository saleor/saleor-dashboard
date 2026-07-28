import {
  type OrderSettingsChannelsQuery,
  type ShopOrderSettingsFragment,
} from "@dashboard/graphql";
import useForm, {
  type CommonUseFormResult,
  type FormChange,
  type SubmitPromise,
} from "@dashboard/hooks/useForm";
import { type FormEvent, type ReactNode, useCallback, useEffect, useMemo } from "react";

import {
  getDirtyChannelIds,
  getOrderSettingsFormData,
  isOrderSettingsFormPristine,
  mergeOrderSettingsFormData,
} from "./formData";
import {
  type ChannelOrderSettingsFormData,
  type ChannelOrderSettingsMatrixField,
  type OrderSettingsFormData,
} from "./types";

type OrderSettingsChannelRow = NonNullable<OrderSettingsChannelsQuery["channels"]>[number];

type UseOrderSettingsFormResult = CommonUseFormResult<OrderSettingsFormData> & {
  dirtyChannelIds: string[];
  onChannelChange: (
    channelId: string,
    field: ChannelOrderSettingsMatrixField,
    value: boolean | number,
  ) => void;
};

interface OrderSettingsFormProps {
  children: (props: UseOrderSettingsFormResult) => ReactNode;
  shop: ShopOrderSettingsFragment | undefined;
  channels: OrderSettingsChannelRow[];
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
  disabled: boolean;
}

const NUMBER_FIELDS = new Set<keyof OrderSettingsFormData>([
  "reserveStockDurationAnonymousUser",
  "reserveStockDurationAuthenticatedUser",
  "limitQuantityPerCheckout",
]);

function parseNumberFieldValue(value: unknown): number {
  if (value === "" || value === null || value === undefined) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function useOrderSettingsForm(
  shop: ShopOrderSettingsFragment | undefined,
  channels: OrderSettingsChannelRow[],
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise,
  disabled: boolean,
): UseOrderSettingsFormResult {
  const initialData = useMemo(() => getOrderSettingsFormData(shop, channels), [channels, shop]);

  const { data, handleChange, submit, triggerChange, isSaveDisabled, setIsSubmitDisabled, set } =
    useForm(initialData, onSubmit, {
      confirmLeave: true,
      disabled,
      mergeFunc: mergeOrderSettingsFormData,
      checkIfSaveIsDisabled: formData =>
        disabled || isOrderSettingsFormPristine(formData, initialData),
    });

  const dirtyChannelIds = useMemo(
    () => getDirtyChannelIds(data.channels, initialData.channels),
    [data.channels, initialData.channels],
  );

  const onChannelChange = useCallback(
    (channelId: string, field: ChannelOrderSettingsMatrixField, value: boolean | number) => {
      const currentChannel = data.channels[channelId];

      if (!currentChannel) {
        return;
      }

      const nextValue =
        field === "deleteExpiredOrdersAfter" ? parseNumberFieldValue(value) : value === true;

      set({
        channels: {
          ...data.channels,
          [channelId]: {
            ...currentChannel,
            [field]: nextValue,
          } satisfies ChannelOrderSettingsFormData,
        },
      });
      triggerChange(true);
    },
    [data.channels, set, triggerChange],
  );

  const change: FormChange = event => {
    const name = event.target.name as keyof OrderSettingsFormData;

    if (NUMBER_FIELDS.has(name)) {
      handleChange({
        target: {
          name,
          value: parseNumberFieldValue(event.target.value),
        },
      });

      return;
    }

    handleChange(event);
  };

  useEffect(
    function syncExitDialogDirtyWithPristine() {
      if (isOrderSettingsFormPristine(data, initialData)) {
        triggerChange(false);
      }
    },
    [data, initialData, triggerChange],
  );

  useEffect(
    function syncExitDialogSubmitDisabled() {
      setIsSubmitDisabled(!!isSaveDisabled);
    },
    [isSaveDisabled, setIsSubmitDisabled],
  );

  return {
    change,
    data,
    submit,
    isSaveDisabled,
    dirtyChannelIds,
    onChannelChange,
  };
}

const OrderSettingsForm = ({
  children,
  shop,
  channels,
  onSubmit,
  disabled,
}: OrderSettingsFormProps): JSX.Element => {
  const props = useOrderSettingsForm(shop, channels, onSubmit, disabled);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    void props.submit();
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", display: "block" }}>
      {children(props)}
    </form>
  );
};

OrderSettingsForm.displayName = "OrderSettingsForm";
export default OrderSettingsForm;
