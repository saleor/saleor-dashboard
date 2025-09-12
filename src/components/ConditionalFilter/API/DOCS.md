# API Providers & Handlers

This document explains how to provide data for filter options using API Providers and Handlers.

## Overview

When a user clicks on a filter, they expect a list of options to choose from (e.g., a list of channels, categories, or simple "Yes/No" options).

**Handlers** are responsible for fetching this data (or simply returning a pre-defined list of options).

**API Provider** is a domain-specific component that determines which `Handler` to use for a given filter field.

## Handlers

Handlers are classes that implement a simple `fetch` method, which returns a promise resolving to an array of `ItemOption`.

| Handler Class                                               | Fetches...                       | Use Case                                      |
| ----------------------------------------------------------- | -------------------------------- | --------------------------------------------- |
| `NoopValuesHandler`                                         | Nothing. Returns an empty array. | Free-text fields like Order ID, search terms. |
| `BooleanValuesHandler`                                      | Static "Yes" and "No" options.   | `isActive`, `isPublished`, etc.               |
| `EnumValuesHandler`                                         | Options from a GraphQL enum.     | `OrderStatus`, `PaymentChargeStatusEnum`.     |
| Custom Handlers (e.g., `ChannelHandler`, `CategoryHandler`) | Dynamic data from the API.       | Lists of channels, categories, products.      |

## How to Add a New Field's Data Provider

### Step 1: Create a Handler (if needed)

If your field requires fetching dynamic data from the API, create a new handler.

```typescript
// src/components/ConditionalFilter/API/handlers/MyEntityHandler.ts

export class MyEntityHandler implements Handler {
  constructor(
    private client: ApolloClient<unknown>,
    private query: string,
  ) {}

  async fetch(): Promise<ItemOption[]> {
    const { data } = await this.client.query<MyQuery, MyQueryVariables>({
      query: MY_ENTITY_QUERY,
      variables: {
        first: 10, // Always paginate
        filter: { search: this.query },
      },
    });

    return data.myEntities.edges.map(({ node }) => ({
      label: node.name,
      value: node.id,
      slug: node.slug,
    }));
  }
}
```

### Step 2: Update the API Provider

Each domain (e.g., Products, Orders) has its own API Provider hook. Update the relevant provider to use your new handler for the corresponding field.

```typescript
// src/components/ConditionalFilter/API/providers/OrderFilterAPIProvider.tsx

function createAPIHandler(
  element: FilterElement,
  inputValue: string,
  client: ApolloClient<unknown>,
): Handler {
  const rowType = element.rowType();

  switch (rowType) {
    // ... existing cases ...

    case "myNewField":
      return new MyEntityHandler(client, inputValue);

    default:
      // Fallback for fields that don't need options
      return new NoopValuesHandler([]);
  }
}
```

Example in orders: `useOrderFilterAPIProvider` uses this `createAPIHandler` function to dispatch to the correct handler.

## Key Patterns & Pitfalls

1.  **Error Handling**: Handlers should catch any errors from API calls and return an empty array `[]` to prevent the UI from crashing. Use optional chaining (`?.`) when accessing nested data from a response.
2.  **Performance**:
    - **Debounce Input**: For handlers that take search input, the input should be debounced in the UI before being passed to the handler to avoid excessive API calls while the user is typing.
    - **Limiting**: Remember to fetch only a few options from API using `limit:` parameter.
3.  **Using resolvers** use a resolver pattern where the `QueryVarsBuilder` for a field is also responsible for creating the `Handler`. This keeps related logic together.
    - Note some olders views might use a simpler `switch` statement in the API Provider to select the `Handler`. This is easier for simpler cases. Choose the pattern that fits the complexity of your domain.
