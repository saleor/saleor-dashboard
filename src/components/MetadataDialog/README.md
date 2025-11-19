# Metadata Dialog Components

Reusable components and hooks for creating metadata editing dialogs in Saleor Dashboard.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Implementation Guide](#implementation-guide)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Overview

Metadata dialogs allow users to add, edit, and delete custom key-value metadata associated with various entities in Saleor (orders, products, fulfillments, etc.). The metadata system provides a standardized way to manage both public and private metadata with built-in validation and error handling.

### When to Use

Use these components when you need to:

- Add metadata editing capability to any entity that supports metadata
- Provide a consistent UX across different metadata dialogs
- Handle both simple (flat) and complex (nested) form structures
- Validate metadata keys for duplicates and empty values

## Architecture

The metadata dialog system consists of three main parts:

- **Your Dialog Component** - Orchestrates the dialog
  - **useHandleMetadataSubmit** - Handles mutations & refetch
  - **useMetadataFormControls** - Manages field arrays & validation
  - **MetadataDialog UI** - Renders form with cards

### Components & Hooks

| Component/Hook            | Purpose                                                                       |
| ------------------------- | ----------------------------------------------------------------------------- |
| `useHandleMetadataSubmit` | Manages GraphQL mutations, loading states, and refetch logic                  |
| `useMetadataFormControls` | Manages React Hook Form field arrays, change handlers, and validation         |
| `MetadataDialog`          | Pre-built dialog UI component with metadata cards                             |
| `MetadataCard`            | Individual card for public or private metadata (optional, for custom layouts) |

### Helper Functions

| Function                       | Purpose                                                                     |
| ------------------------------ | --------------------------------------------------------------------------- |
| `mapMetadataItemToInput`       | Converts GraphQL metadata items to form inputs (removes `__typename`)       |
| `mapFieldArrayToMetadataInput` | Converts field array entries back to `MetadataInput[]` (removes `id` field) |
| `getValidateMetadata`          | Creates validation function for duplicate/empty key checks                  |

## Quick Start

Minimal example for a simple entity:

```tsx
import { MetadataFormData } from "@dashboard/components/Metadata";
import { MetadataDialog, useHandleMetadataSubmit } from "@dashboard/components/MetadataDialog";
import { useMetadataFormControls } from "@dashboard/components/MetadataDialog/useMetadataFormControls";
import { mapFieldArrayToMetadataInput } from "@dashboard/components/MetadataDialog/validation";
import { ProductDetailsDocument, ProductDetailsQuery } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

type ProductData = NonNullable<ProductDetailsQuery["product"]>;

interface ProductMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  product: ProductData | undefined;
}

export const ProductMetadataDialog = ({ open, onClose, product }: ProductMetadataDialogProps) => {
  const intl = useIntl();

  // 1. Setup submit handler
  const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
    initialData: product,
    onClose,
    refetchDocument: ProductDetailsDocument,
  });

  // 2. Setup form
  const formMethods = useForm<MetadataFormData>({
    values: submitInProgress
      ? lastSubmittedData
      : {
          metadata: (product?.metadata ?? []).map(mapMetadataItemToInput),
          privateMetadata: (product?.privateMetadata ?? []).map(mapMetadataItemToInput),
        },
  });

  const { control, getValues, formState, trigger, reset } = formMethods;

  // 3. Setup form controls
  const {
    metadataFields,
    privateMetadataFields,
    handleMetadataChange,
    handlePrivateMetadataChange,
    metadataErrors,
    privateMetadataErrors,
  } = useMetadataFormControls({
    control,
    trigger,
    getValues,
    formState,
  });

  // 4. Unified change handler
  const handleChange = (event: ChangeEvent, isPrivate: boolean): void => {
    if (isPrivate) {
      handlePrivateMetadataChange(event);
    } else {
      handleMetadataChange(event);
    }
  };

  // 5. Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  // 6. Save handler
  const handleSave = async () => {
    await onSubmit(getValues());
  };

  // 7. Render dialog
  return (
    <MetadataDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title={intl.formatMessage({ defaultMessage: "Product Metadata" })}
      data={{
        metadata: mapFieldArrayToMetadataInput(metadataFields),
        privateMetadata: mapFieldArrayToMetadataInput(privateMetadataFields),
      }}
      onChange={handleChange}
      loading={submitInProgress}
      errors={{
        metadata: metadataErrors.length ? metadataErrors.join(", ") : undefined,
        privateMetadata: privateMetadataErrors.length
          ? privateMetadataErrors.join(", ")
          : undefined,
      }}
      formIsDirty={formState.isDirty}
    />
  );
};
```

## Implementation Guide

### Step 1: Define Your Data Type

Extract the data type from your GraphQL query:

```tsx
import { ProductDetailsQuery } from "@dashboard/graphql";

export type ProductMetadataDialogData = NonNullable<ProductDetailsQuery["product"]>;
```

### Step 2: Create Props Interface

```tsx
interface ProductMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  product: ProductMetadataDialogData | undefined;
}
```

### Step 3: Setup Submit Handler

Use `useHandleMetadataSubmit` to manage mutations and refetch:

```tsx
const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
  initialData: product,
  onClose,
  refetchDocument: ProductDetailsDocument, // The query to refetch after save
});
```

**What it does:**

- Calls `updateMetadata` and `updatePrivateMetadata` mutations
- Handles loading states
- Refetches the specified document after successful update
- Shows success notification
- Closes dialog on success
- Tracks last submitted data to avoid UI flicker during refetch

### Step 4: Setup React Hook Form

```tsx
const formMethods = useForm<MetadataFormData>({
  values: submitInProgress
    ? lastSubmittedData // Show last submitted data during refetch
    : {
        metadata: (product?.metadata ?? []).map(mapMetadataItemToInput),
        privateMetadata: (product?.privateMetadata ?? []).map(mapMetadataItemToInput),
      },
});

const { control, getValues, formState, trigger, reset } = formMethods;
```

**Important notes:**

- Use `values` (not `defaultValues`) for controlled form updates
- Use `mapMetadataItemToInput` to remove GraphQL `__typename` field
- Display `lastSubmittedData` during submission to prevent UI flicker

### Step 5: Setup Form Controls

For **flat structure** (single metadata object):

```tsx
const {
  metadataFields,
  privateMetadataFields,
  handleMetadataChange,
  handlePrivateMetadataChange,
  metadataErrors,
  privateMetadataErrors,
} = useMetadataFormControls({
  control,
  trigger,
  getValues,
  formState,
  // No pathPrefix needed for flat structure
});
```

For **nested structure** (multiple metadata objects):

```tsx
// Form data structure
interface OrderLineAndVariantMetadataFormData {
  orderLine: MetadataFormData;
  variant: MetadataFormData;
}

// Order line metadata controls
const {
  metadataFields: orderLineMetadataFields,
  privateMetadataFields: orderLinePrivateMetadataFields,
  handleMetadataChange: handleOrderLineMetadataChange,
  handlePrivateMetadataChange: handleOrderLinePrivateMetadataChange,
  metadataErrors: orderLineMetadataErrors,
  privateMetadataErrors: orderLinePrivateMetadataErrors,
} = useMetadataFormControls({
  control,
  trigger,
  getValues,
  formState,
  pathPrefix: "orderLine", // Access orderLine.metadata
});

// Variant metadata controls
const {
  metadataFields: variantMetadataFields,
  privateMetadataFields: variantPrivateMetadataFields,
  handleMetadataChange: handleVariantMetadataChange,
  handlePrivateMetadataChange: handleVariantPrivateMetadataChange,
  metadataErrors: variantMetadataErrors,
  privateMetadataErrors: variantPrivateMetadataErrors,
} = useMetadataFormControls({
  control,
  trigger,
  getValues,
  formState,
  pathPrefix: "variant", // Access variant.metadata
});
```

### Step 6: Create Change Handler

For `MetadataDialog` component:

```tsx
const handleChange = (event: ChangeEvent, isPrivate: boolean): void => {
  if (isPrivate) {
    handlePrivateMetadataChange(event);
  } else {
    handleMetadataChange(event);
  }
};
```

For custom layouts with `MetadataCard`:

```tsx
// Public metadata card
<MetadataCard
  data={mapFieldArrayToMetadataInput(metadataFields)}
  isPrivate={false}
  onChange={handleMetadataChange}
  error={metadataErrors.length ? metadataErrors.join(", ") : undefined}
/>

// Private metadata card
<MetadataCard
  data={mapFieldArrayToMetadataInput(privateMetadataFields)}
  isPrivate={true}
  onChange={handlePrivateMetadataChange}
  error={privateMetadataErrors.length ? privateMetadataErrors.join(", ") : undefined}
/>
```

### Step 7: Reset Form on Close

```tsx
useEffect(() => {
  if (!open) {
    reset();
  }
}, [open, reset]);
```

This ensures the form is cleared when the dialog closes.

### Step 8: Render Dialog

```tsx
return (
  <MetadataDialog
    open={open}
    onClose={onClose}
    onSave={async () => await onSubmit(getValues())}
    title={intl.formatMessage({ defaultMessage: "Product Metadata" })}
    data={{
      metadata: mapFieldArrayToMetadataInput(metadataFields),
      privateMetadata: mapFieldArrayToMetadataInput(privateMetadataFields),
    }}
    onChange={handleChange}
    loading={submitInProgress}
    errors={{
      metadata: metadataErrors.length ? metadataErrors.join(", ") : undefined,
      privateMetadata: privateMetadataErrors.length ? privateMetadataErrors.join(", ") : undefined,
    }}
    formIsDirty={formState.isDirty}
  />
);
```

## API Reference

### `useHandleMetadataSubmit<T>`

Manages GraphQL mutations and refetch logic for metadata submission.

**Type Parameters:**

- `T extends { id: string; metadata: any; privateMetadata: any }` - The entity type

**Parameters:**

```tsx
{
  initialData: T | undefined;      // Entity with metadata
  onClose: () => void;              // Callback when dialog closes
  refetchDocument: DocumentNode;    // GraphQL document to refetch after save
}
```

**Returns:**

```tsx
{
  onSubmit: (data: MetadataFormData) => Promise<void>; // Submit handler
  lastSubmittedData: MetadataFormData | undefined; // Last submitted data
  submitInProgress: boolean; // Loading state
}
```

**Example:**

```tsx
const { onSubmit, lastSubmittedData, submitInProgress } = useHandleMetadataSubmit({
  initialData: order,
  onClose,
  refetchDocument: OrderDetailsDocument,
});
```

---

### `useMetadataFormControls<TFormData>`

Manages React Hook Form field arrays, change handlers, and validation for metadata forms.

**Type Parameters:**

- `TFormData extends FieldValues` - The form data structure

**Parameters:**

```tsx
{
  control: Control<TFormData>;           // React Hook Form control
  trigger: UseFormTrigger<TFormData>;    // Validation trigger function
  getValues: UseFormGetValues<TFormData>; // Get form values function
  formState: FormState<TFormData>;       // Form state
  pathPrefix?: string;                    // Optional prefix for nested structures
}
```

**Returns:**

```tsx
{
  metadataFields: Array<{ id: string; key: string; value: string }>;
  privateMetadataFields: Array<{ id: string; key: string; value: string }>;
  handleMetadataChange: (event: ChangeEvent) => void;
  handlePrivateMetadataChange: (event: ChangeEvent) => void;
  metadataErrors: string[];
  privateMetadataErrors: string[];
}
```

**Example (Flat Structure):**

```tsx
const {
  metadataFields,
  privateMetadataFields,
  handleMetadataChange,
  handlePrivateMetadataChange,
  metadataErrors,
  privateMetadataErrors,
} = useMetadataFormControls({
  control: formMethods.control,
  trigger: formMethods.trigger,
  getValues: formMethods.getValues,
  formState: formMethods.formState,
});
```

**Example (Nested Structure):**

```tsx
const orderLineControls = useMetadataFormControls({
  control: formMethods.control,
  trigger: formMethods.trigger,
  getValues: formMethods.getValues,
  formState: formMethods.formState,
  pathPrefix: "orderLine", // Accesses orderLine.metadata
});
```

---

### `MetadataDialog`

Pre-built dialog component for editing metadata.

**Props:**

```tsx
{
  open: boolean;                          // Dialog open state
  onClose: () => void;                    // Close handler
  onSave: () => void;                     // Save handler
  title?: string;                         // Dialog title
  data: {                                 // Metadata to display
    metadata: MetadataInput[];
    privateMetadata: MetadataInput[];
  };
  onChange: (event: ChangeEvent, isPrivate: boolean) => void;  // Change handler
  loading?: boolean;                      // Loading state
  disabled?: boolean;                     // Disable all inputs
  errors?: {                              // Validation errors
    metadata?: string;
    privateMetadata?: string;
  };
  formIsDirty?: boolean;                  // Disable save if form is pristine
}
```

**Example:**

```tsx
<MetadataDialog
  open={open}
  onClose={onClose}
  onSave={handleSave}
  title="Order Metadata"
  data={{
    metadata: mapFieldArrayToMetadataInput(metadataFields),
    privateMetadata: mapFieldArrayToMetadataInput(privateMetadataFields),
  }}
  onChange={handleChange}
  loading={submitInProgress}
  errors={{
    metadata: metadataErrors.join(", "),
    privateMetadata: privateMetadataErrors.join(", "),
  }}
  formIsDirty={formState.isDirty}
/>
```

---

### Helper Functions

#### `mapMetadataItemToInput(item: MetadataItem): MetadataInput`

Converts GraphQL metadata items to form input format (removes `__typename`).

**Example:**

```tsx
const metadata = order.metadata.map(mapMetadataItemToInput);
```

#### `mapFieldArrayToMetadataInput(fields: Array<{ id: string } & MetadataInput>): MetadataInput[]`

Converts React Hook Form field array entries back to `MetadataInput[]` (removes `id` field).

**Example:**

```tsx
const metadata = mapFieldArrayToMetadataInput(metadataFields);
```

#### `getValidateMetadata(intl: IntlShape): (metadata: MetadataInput[]) => true | string`

Creates a validation function for metadata that checks for duplicate and empty keys.

**Example:**

```tsx
// Used internally by useMetadataFormControls
const validate = getValidateMetadata(intl);
const result = validate([
  { key: "color", value: "blue" },
  { key: "size", value: "large" },
]);
// Returns true if valid, or error message string if invalid
```

## Examples

### Example 1: Simple Entity (Order)

See [OrderMetadataDialog.tsx](./../../orders/components/OrderMetadataDialog/OrderMetadataDialog.tsx)

**Features:**

- Flat structure (single metadata object)
- Standard MetadataDialog component
- Reset form on close

### Example 2: Fulfillment

See [OrderFulfillmentMetadataDialog.tsx](./../../orders/components/OrderFulfillmentMetadataDialog/OrderFulfillmentMetadataDialog.tsx)

**Features:**

- Flat structure
- Same pattern as Order
- Different refetch document

### Example 3: Nested Structure (Order Line + Variant)

See [OrderLineMetadataDialog.tsx](./../../orders/components/OrderLineMetadataDialog/OrderLineMetadataDialog.tsx)

**Features:**

- Nested form structure with two metadata objects
- Custom dialog layout using `DashboardModal` and `MetadataCard`
- Permission-based field disabling
- Separate form controls for each metadata object using `pathPrefix`

**Key differences:**

```tsx
// Nested form data structure
interface OrderLineAndVariantMetadataFormData {
  orderLine: MetadataFormData;
  variant: MetadataFormData;
}

// Two separate calls to useMetadataFormControls
const orderLineControls = useMetadataFormControls({
  ...formMethods,
  pathPrefix: "orderLine",
});

const variantControls = useMetadataFormControls({
  ...formMethods,
  pathPrefix: "variant",
});
```

## Testing

### Testing Your Dialog Component

1. **Test form initialization:**

```tsx
it("displays metadata from entity", () => {
  const product = {
    id: "1",
    metadata: [{ key: "color", value: "blue" }],
    privateMetadata: [],
  };

  render(<ProductMetadataDialog open={true} onClose={vi.fn()} product={product} />);

  expect(screen.getByDisplayValue("color")).toBeInTheDocument();
  expect(screen.getByDisplayValue("blue")).toBeInTheDocument();
});
```

2. **Test validation:**

```tsx
it("shows error for duplicate keys", async () => {
  // Arrange
  render(<ProductMetadataDialog open={true} onClose={vi.fn()} product={mockProduct} />);

  // Act - Add duplicate key
  const addButton = screen.getByTestId("add-metadata");
  await userEvent.click(addButton);

  const keyInputs = screen.getAllByLabelText("Key");
  await userEvent.type(keyInputs[0], "color");
  await userEvent.type(keyInputs[1], "color");

  // Assert
  expect(screen.getByText(/keys must be unique/i)).toBeInTheDocument();
});
```

3. **Test submission:**

```tsx
it("submits metadata on save", async () => {
  // Arrange
  const onSubmit = vi.fn();
  render(<ProductMetadataDialog open={true} onClose={vi.fn()} product={mockProduct} />);

  // Act
  const saveButton = screen.getByRole("button", { name: /save/i });
  await userEvent.click(saveButton);

  // Assert
  await waitFor(() => {
    expect(mockUpdateMetadata).toHaveBeenCalled();
  });
});
```

### Testing the Hook Directly

See [useMetadataFormControls.test.ts](./useMetadataFormControls.test.ts) for examples of testing the hook in isolation.

## Troubleshooting

### Issue: Form doesn't update when entity data changes

**Solution:** Use `values` instead of `defaultValues` in `useForm`:

```tsx
// ❌ Wrong - only sets initial values
useForm({ defaultValues: { metadata: product?.metadata } });

// ✅ Correct - updates when data changes
useForm({ values: { metadata: product?.metadata } });
```

### Issue: UI flickers during refetch

**Solution:** Use `lastSubmittedData` from `useHandleMetadataSubmit`:

```tsx
useForm({
  values: submitInProgress
    ? lastSubmittedData  // Show last submitted data during refetch
    : { metadata: product?.metadata, ... }
});
```

### Issue: Save button doesn't disable when form is pristine

**Solution:** Pass `formIsDirty` to the dialog:

```tsx
<MetadataDialog
  formIsDirty={formState.isDirty}
  // ...
/>
```

### Issue: Form doesn't clear when dialog closes

**Solution:** Add reset effect:

```tsx
useEffect(() => {
  if (!open) {
    reset();
  }
}, [open, reset]);
```

### Issue: TypeScript errors with nested structure

**Solution:** Define explicit form data interface:

```tsx
interface NestedFormData {
  orderLine: MetadataFormData;
  variant: MetadataFormData;
}

const formMethods = useForm<NestedFormData>({ ... });
```

### Issue: Validation not triggering

**Solution:** Ensure you pass all required props to `useMetadataFormControls`:

```tsx
useMetadataFormControls({
  control, // Required
  trigger, // Required - triggers validation
  getValues, // Required
  formState, // Required - for error tracking
});
```

## Advanced Patterns

### Custom Dialog Layout

If `MetadataDialog` doesn't fit your needs, use `MetadataCard` directly:

```tsx
import { MetadataCard } from "@dashboard/components/Metadata/MetadataCard";

<DashboardModal open={open} onChange={onClose}>
  <DashboardModal.Content>
    <DashboardModal.Header>Custom Title</DashboardModal.Header>

    <Box>
      <Text>Public Metadata</Text>
      <MetadataCard
        data={mapFieldArrayToMetadataInput(metadataFields)}
        isPrivate={false}
        onChange={handleMetadataChange}
        error={metadataErrors.join(", ")}
      />

      <Text>Private Metadata</Text>
      <MetadataCard
        data={mapFieldArrayToMetadataInput(privateMetadataFields)}
        isPrivate={true}
        onChange={handlePrivateMetadataChange}
        error={privateMetadataErrors.join(", ")}
      />
    </Box>

    <DashboardModal.Actions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
    </DashboardModal.Actions>
  </DashboardModal.Content>
</DashboardModal>;
```

### Conditional Field Disabling

For permission-based or conditional disabling:

```tsx
const hasManageProducts = useHasManageProductsPermission();

<MetadataCard
  data={mapFieldArrayToMetadataInput(variantMetadataFields)}
  isPrivate={false}
  disabled={!hasManageProducts} // Disable based on permission
  onChange={handleVariantMetadataChange}
/>;
```

### Custom Validation

To add custom validation beyond duplicate/empty checks, add rules to the form field:

```tsx
const formMethods = useForm<MetadataFormData>({
  values: { ... },
  resolver: async (data) => {
    // Custom validation logic
    const errors = {};

    if (data.metadata.some(m => m.key.includes("invalid"))) {
      errors.metadata = { message: "Invalid key pattern" };
    }

    return { values: data, errors };
  }
});
```

## Migration Guide

### Migrating from Old Metadata Dialog Pattern

If you have an old metadata dialog using `useForm` + custom handlers:

**Before:**

```tsx
const form = useForm();
const [metadata, setMetadata] = useState(order?.metadata);

const handleMetadataChange = data => {
  setMetadata(data);
};

const handleSave = () => {
  updateMetadata({ variables: { id: order.id, metadata } });
};
```

**After:**

```tsx
const { onSubmit, submitInProgress } = useHandleMetadataSubmit({
  initialData: order,
  onClose,
  refetchDocument: OrderDetailsDocument,
});

const formMethods = useForm<MetadataFormData>({
  values: {
    metadata: order?.metadata.map(mapMetadataItemToInput) ?? [],
    privateMetadata: order?.privateMetadata.map(mapMetadataItemToInput) ?? [],
  },
});

const { metadataFields, handleMetadataChange, metadataErrors } =
  useMetadataFormControls(formMethods);

const handleSave = async () => {
  await onSubmit(formMethods.getValues());
};
```

## Related Documentation

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Saleor Metadata API](https://docs.saleor.io/docs/3.x/api-reference/objects/metadata)
- [MetadataCard Component](../Metadata/MetadataCard.tsx)
