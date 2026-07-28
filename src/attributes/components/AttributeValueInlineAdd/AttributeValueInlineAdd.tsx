import AttributeSwatchField from "@dashboard/attributes/components/AttributeSwatchField";
import { SwatchPreview } from "@dashboard/attributes/components/SwatchPreview/SwatchPreview";
import { getAttributeValueErrorMessage } from "@dashboard/attributes/errors";
import { type AttributeValueEditDialogFormData } from "@dashboard/attributes/utils/data";
import { tableStyles } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { type AttributeErrorFragment, AttributeInputTypeEnum } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import { TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import styles from "./AttributeValueInlineAdd.module.css";

const messages = defineMessages({
  addValue: {
    id: "LaoZt4",
    defaultMessage: "Add",
    description: "inline add attribute value button",
  },
  placeholder: {
    id: "NYwJyM",
    defaultMessage: "Type a value and press Enter",
    description: "inline add attribute value placeholder",
  },
  swatchNameLabel: {
    id: "4iKFi1",
    defaultMessage: "Name",
    description: "inline add swatch attribute value name field label",
  },
  swatchNamePlaceholder: {
    id: "BJGTFV",
    defaultMessage: "e.g. Navy",
    description: "inline add swatch attribute value name placeholder",
  },
  swatchNameHelper: {
    id: "SyRul5",
    defaultMessage: "Enter a name, choose a color or image below, then click Add.",
    description: "inline add swatch attribute value instructions",
  },
});

export type AttributeValueInlineAddVariant = "tableFooter" | "section";

interface AttributeValueInlineAddProps {
  columnSpan: number;
  disabled: boolean;
  error: AttributeErrorFragment | null;
  hasRowsAbove: boolean;
  inputType: AttributeInputTypeEnum;
  onAdd: (data: AttributeValueEditDialogFormData) => void;
  variant?: AttributeValueInlineAddVariant;
}

const emptyForm: AttributeValueEditDialogFormData = { name: "" };

export const AttributeValueInlineAdd = ({
  columnSpan,
  disabled,
  error,
  hasRowsAbove,
  inputType,
  onAdd,
  variant = "tableFooter",
}: AttributeValueInlineAddProps) => {
  const intl = useIntl();
  const [form, setForm] = useState<AttributeValueEditDialogFormData>(emptyForm);
  const isSwatch = inputType === AttributeInputTypeEnum.SWATCH;
  const formErrors = getFormErrors(["name"], error ? [error] : []);
  const canAdd = form.name.trim().length > 0 && !disabled;
  const nameError = getAttributeValueErrorMessage(formErrors.name, intl);

  const handleAdd = () => {
    if (!canAdd) {
      return;
    }

    onAdd(form);
    setForm(emptyForm);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isSwatch) {
      event.preventDefault();
      handleAdd();
    }
  };

  const addButton = (
    <Button
      data-test-id="attribute-value-inline-add-button"
      disabled={!canAdd}
      icon={<Plus size={16} />}
      onClick={handleAdd}
      variant="secondary"
    >
      <FormattedMessage {...messages.addValue} />
    </Button>
  );

  const swatchContent = (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Input
          autoComplete="off"
          autoFocus
          className={styles.swatchNameInput}
          data-test-id="value-name"
          disabled={disabled}
          endAdornment={<SwatchPreview color={form.value} imageUrl={form.fileUrl} size={32} />}
          error={!!formErrors.name}
          label={intl.formatMessage(messages.swatchNameLabel)}
          name="name"
          onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
          placeholder={intl.formatMessage(messages.swatchNamePlaceholder)}
          value={form.name}
          width="100%"
        />
        {nameError ? (
          <Text size={2} color="critical1">
            {nameError}
          </Text>
        ) : (
          <Text size={2} color="default2">
            {intl.formatMessage(messages.swatchNameHelper)}
          </Text>
        )}
      </Box>
      <AttributeSwatchField
        clearErrors={() => undefined}
        data={form}
        errors={{}}
        hidePreview
        set={updates => setForm(current => ({ ...current, ...updates }))}
        setError={() => undefined}
      />
      <Box display="flex" justifyContent="flex-end">
        {addButton}
      </Box>
    </Box>
  );

  const defaultContent = (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" alignItems="center" gap={3}>
        <Box flexGrow="1" __minWidth={0}>
          <Input
            autoComplete="off"
            autoFocus
            data-test-id="value-name"
            disabled={disabled}
            error={!!formErrors.name}
            name="name"
            onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder={intl.formatMessage(messages.placeholder)}
            value={form.name}
            width="100%"
          />
        </Box>
        <Box flexShrink="0">{addButton}</Box>
      </Box>
      {nameError ? (
        <Text size={2} color="critical1">
          {nameError}
        </Text>
      ) : null}
    </Box>
  );

  const content = (
    <Box padding={3} display="flex" flexDirection="column">
      {isSwatch ? swatchContent : defaultContent}
    </Box>
  );

  if (variant === "section") {
    return (
      <Box
        className={clsx(styles.section, hasRowsAbove && styles.sectionWithTableAbove)}
        data-test-id="attribute-value-inline-add"
      >
        {content}
      </Box>
    );
  }

  return (
    <TableFooter data-test-id="attribute-value-inline-add">
      <TableRow>
        <TableCell
          className={clsx(hasRowsAbove && styles.footerCell, tableStyles.cellFlush)}
          colSpan={columnSpan}
        >
          {content}
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};
