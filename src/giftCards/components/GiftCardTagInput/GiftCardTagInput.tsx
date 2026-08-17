import { Multiselect } from "@dashboard/components/Combobox";
import { DetailSettingsOptionalLabel } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { type GiftCardBulkCreateFormError } from "@dashboard/giftCards/GiftCardBulkCreateDialog/types";
import { getGiftCardErrorMessage } from "@dashboard/giftCards/GiftCardUpdate/messages";
import { type FormChange } from "@dashboard/hooks/useForm";
import useGiftCardTagsSearch from "@dashboard/searches/useGiftCardTagsSearch";
import { mapEdgesToItems, mapMultiValueNodeToChoice } from "@dashboard/utils/maps";
import { Box, type Option, Text } from "@saleor/macaw-ui-next";
import compact from "lodash/compact";
import uniq from "lodash/uniq";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { giftCardTagInputMessages as messages } from "./messages";

interface GiftCardTagInputProps {
  name: string;
  onChange: FormChange;
  values: Option[];
  error?: GiftCardBulkCreateFormError;
  optional?: boolean;
  loading?: boolean;
  /** Secondary copy under the title — matches DetailSettingToggleRow description. */
  description?: ReactNode;
  /** CSS width for the multiselect control only (label stays full width). */
  controlWidth?: string;
}

const GiftCardTagInput = ({
  onChange,
  name,
  values,
  error,
  optional = true,
  loading,
  description,
  controlWidth,
}: GiftCardTagInputProps) => {
  const intl = useIntl();
  const { loadMore, search, result } = useGiftCardTagsSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const choices = mapMultiValueNodeToChoice(
    uniq(compact(mapEdgesToItems(result?.data?.search)?.map(({ name: tagName }) => tagName))),
    "tags",
  );

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="inline-flex" alignItems="baseline" gap={2}>
          <Text size={3} fontWeight="medium">
            {intl.formatMessage(messages.label)}
          </Text>
          {optional ? <DetailSettingsOptionalLabel /> : null}
        </Box>
        {description ? (
          <Text size={2} color="default2">
            {description}
          </Text>
        ) : null}
      </Box>
      <Box __width={controlWidth} __maxWidth="100%">
        <Multiselect
          allowCustomValues
          loading={loading}
          error={!!error}
          helperText={getGiftCardErrorMessage(error, intl)}
          name={name || "giftCardTag"}
          label=""
          placeholder={intl.formatMessage(messages.selectPlaceholder)}
          data-test-id="gift-card-tag-select-field"
          fetchMore={{
            loading: result?.loading,
            onFetchMore: loadMore,
            hasMore: result?.data?.search?.pageInfo?.hasNextPage ?? false,
          }}
          value={values}
          options={choices}
          onChange={onChange}
          fetchOptions={search}
        />
      </Box>
    </Box>
  );
};

export default GiftCardTagInput;
