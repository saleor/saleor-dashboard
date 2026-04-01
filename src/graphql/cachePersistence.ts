import { InMemoryCache } from "@apollo/client";
import { APP_VERSION } from "@dashboard/config";
import { persistCache } from "apollo3-cache-persist";

import introspectionQueryResultData from "./fragmentTypes.generated";
import introspectionQueryResultDataStaging from "./fragmentTypesStaging.generated";
import { isStagingSchema } from "./schemaVersion";
import { TTLLocalStorageWrapper } from "./TTLLocalStorageWrapper";
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

const SENSITIVE_TYPE_PREFIXES = ["User:", "Address:"];

export async function piiFilterMapper(data: string): Promise<string> {
  const parsed = JSON.parse(data);

  for (const key of Object.keys(parsed)) {
    if (SENSITIVE_TYPE_PREFIXES.some(prefix => key.startsWith(prefix))) {
      delete parsed[key];
    }
  }

  return JSON.stringify(parsed);
}

const CACHE_KEY_PREFIX = "apollo-cache-persist-";
const CACHE_KEY = `${CACHE_KEY_PREFIX}${APP_VERSION}`;
const CACHE_TIMESTAMP_KEY = `${CACHE_KEY}-timestamp`;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function clearStaleCacheKeys(): void {
  try {
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const key = window.localStorage.key(i);

      if (key?.startsWith(CACHE_KEY_PREFIX) && key !== CACHE_KEY && key !== CACHE_TIMESTAMP_KEY) {
        window.localStorage.removeItem(key);
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
      storage: new TTLLocalStorageWrapper(window.localStorage, CACHE_KEY, CACHE_TTL_MS),
      key: CACHE_KEY,
      maxSize: 2 * 1024 * 1024, // 2MB
      persistenceMapper: piiFilterMapper,
    });
  } catch {
    // If cache restoration fails, continue with empty cache
  }
}

export function clearPersistedCache(): void {
  try {
    window.localStorage.removeItem(CACHE_KEY);
    window.localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch {
    // Ignore storage errors
  }
}
