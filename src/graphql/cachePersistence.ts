import { InMemoryCache } from "@apollo/client";
import { APP_VERSION } from "@dashboard/config";
import { persistCache, SessionStorageWrapper } from "apollo3-cache-persist";

import introspectionQueryResultData from "./fragmentTypes.generated";
import introspectionQueryResultDataStaging from "./fragmentTypesStaging.generated";
import { isStagingSchema } from "./schemaVersion";
import { type TypedTypePolicies } from "./typePolicies.generated";

const introspectionData = isStagingSchema()
  ? introspectionQueryResultDataStaging
  : introspectionQueryResultData;

export const cache = new InMemoryCache({
  possibleTypes: introspectionData.possibleTypes,
  typePolicies: {
    CountryDisplay: {
      keyFields: ["code"],
    },
    Money: {
      merge: false,
    },
    TaxedMoney: {
      merge: false,
    },
    Weight: {
      merge: false,
    },
    Shop: {
      keyFields: [],
    },
    AttributeValue: {
      fields: {
        slug: (givenSlug, { readField }) => {
          if (!givenSlug) {
            return readField("name");
          }

          return givenSlug;
        },
      },
    },
    App: {
      keyFields: false,
    },
  } as TypedTypePolicies,
});

const CACHE_KEY_PREFIX = "apollo-cache-persist-";
const CACHE_KEY = `${CACHE_KEY_PREFIX}${APP_VERSION}`;

function clearStaleCacheKeys(): void {
  try {
    for (let i = window.sessionStorage.length - 1; i >= 0; i--) {
      const key = window.sessionStorage.key(i);

      if (key?.startsWith(CACHE_KEY_PREFIX) && key !== CACHE_KEY) {
        window.sessionStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore storage errors
  }
}

export async function initCache(): Promise<void> {
  clearStaleCacheKeys();

  try {
    await persistCache({
      cache,
      storage: new SessionStorageWrapper(window.sessionStorage),
      key: CACHE_KEY,
      maxSize: 2 * 1024 * 1024, // 2MB
    });
  } catch {
    // If cache restoration fails, continue with empty cache
  }
}

export function clearPersistedCache(): void {
  try {
    window.sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
}
