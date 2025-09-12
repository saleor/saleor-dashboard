# Value Provider & URL Sync

This document explains how the filter state is synchronized with the URL.

## Overview

The **Value Provider** is the bridge between the filter's UI state (`FilterContainer`) and the browser's URL. It ensures that any change in the filters is reflected in the URL, and any filters in the URL are parsed and displayed in the UI on page load.

This is primarily handled by the `useUrlValueProvider` hook.

## How It Works

1.  **Serialization (State to URL)**:
    - When the user modifies a filter, the `FilterContainer` (the array representing the filter state) is updated.
    - Calling `provider.persist()` serializes the `FilterContainer` into a URL-friendly query string.
    - This string is then pushed to the browser's history, updating the URL.

2.  **Deserialization (URL to State)**:
    - On page load, `useUrlValueProvider` reads the query string from the URL.
    - It parses the string into a `TokenArray`, a structured representation of the filters.
    - This `TokenArray` is then transformed into a `FilterContainer`, which is used to build the UI state.
    - During this process, it also triggers the **Initial State** system to fetch any necessary data for rehydration (see `API/initialState/DOCS.md`).

## URL Structure

Filters are encoded into the URL using a specific pattern. Here are some examples:

- **Simple single filter**: `?0[status][eq][]=FULFILLED`
  - A single filter at position `0` where `status` equals `FULFILLED`.

- **Multi-select**: `?0[channels][oneOf][]=channel-1&0[channels][oneOf][]=channel-2`
  - A single filter where `channels` is one of `channel-1` OR `channel-2`.

- **Range**: `?0[created][range][gte]=2024-01-01&0[created][range][lte]=2024-12-31`
  - A single filter for a date range.

- **Multiple filters**: `?0[status][eq][]=FULFILLED&1[customer][eq][]=test@test.com`
  - Two separate filters joined by an `AND` condition.

## How to Use

The `useUrlValueProvider` returns a `provider` object that you pass to the `<ConditionalFilters />` component.

```typescript
// In your list view component

const MyFilteredList = () => {
  const { location } = useRouter();
  // The initial state hook for the domain (e.g., products, orders)
  const initialAPIState = useProductInitialAPIState();

  const provider = useUrlValueProvider(
    location.search,
    "product", // The filter domain
    initialAPIState
  );

  const handleFilterChange = (value: FilterContainer) => {
    provider.setValue(value);
    provider.persist();
  };

  return (
    <ConditionalFilters
      valueProvider={provider}
      onStateChange={handleFilterChange}
      // ...
    />
  );
};
```

## Key Patterns & Pitfalls

1.  **Persist Changes**: After updating the filter state with `provider.setValue()`, you **must** call `provider.persist()` to update the URL.
2.  **Debounce Persistence**: To avoid excessive URL updates while the user is actively changing filters, you should debounce the call to `provider.persist()`.
3.  **URL Length**: Be mindful of URL length limitations in browsers (~2000 characters). Very complex filters with many values can exceed this limit. `FilterContainer` has a limit of filters it can have
