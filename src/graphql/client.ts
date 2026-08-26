// DON'T TOUCH THIS
// These are separate clients and do not share configs between themselves
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { ENABLED_SERVICE_NAME_HEADER, getApiUrl } from "@dashboard/config";
import { createFetch, createSaleorClient } from "@dashboard/legacy-sdk";
import { createUploadLink } from "apollo-upload-client";
import { type DocumentNode } from "graphql";

import introspectionQueryResultData from "./fragmentTypes.generated";
import introspectionQueryResultDataStaging from "./fragmentTypesStaging.generated";
import { resolveLockedSchemaFieldsForBuild } from "./lockSchema";
import { isStagingSchema } from "./schemaVersion";
import { type TypedTypePolicies } from "./typePolicies.generated";

// Select the appropriate fragmentTypes and typePolicies based on schema version
const introspectionData = isStagingSchema()
  ? introspectionQueryResultDataStaging
  : introspectionQueryResultData;

const attachVariablesLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const contextHeaders: Record<string, string> = { ...headers };

    if (ENABLED_SERVICE_NAME_HEADER) {
      contextHeaders["source-service-name"] = "saleor.dashboard";
    }

    return {
      headers: contextHeaders,
    };
  });

  return forward(operation).map(data => ({
    ...data,
    extensions: {
      ...data.extensions,
      variables: operation.variables,
    },
  }));
});

const link = attachVariablesLink.concat(
  createUploadLink({
    credentials: "include",
    uri: getApiUrl(),
    // Note this has to be as typeof fetch: ts-expect-error breaks TS in non-strict mode, without it strict mode breaks
    fetch: createFetch() as typeof fetch,
  }) as unknown as ApolloLink, // type mismatch between apollo-upload-client and @apollo/cient
);

/**
 * Resolves `@lockSchema` before anything else touches the document.
 *
 * This has to happen on the cache rather than in a link: Apollo runs links *after* the cache, so
 * a link-level transform would leave InMemoryCache normalising against fields the API was never
 * asked for — every write logs "Missing field ...", every cache-first read misses, and the query
 * refetches on every mount. `transformDocument` feeds both the cache and the link, so stripping
 * here keeps the two in sync.
 *
 * Apollo Client 3.8 has a first-class `documentTransform` option for this; drop the subclass when
 * we get there.
 *
 * ponytail: covers everything that goes through QueryManager, i.e. every hook and every
 * mutation. `cache.readQuery`/`writeQuery`/`readFragment`/`writeFragment` call `read`/`write`
 * directly and would see an unresolved document — no caller does that with a `@lockSchema`
 * document today. Override `read`/`write` (memoised) if one ever needs to.
 */
class SchemaAwareCache extends InMemoryCache {
  transformDocument(document: DocumentNode): DocumentNode {
    return super.transformDocument(resolveLockedSchemaFieldsForBuild(document));
  }
}

export const apolloClient = new ApolloClient({
  connectToDevTools: process.env.NODE_ENV === "development",
  cache: new SchemaAwareCache({
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
          /**
           * Since, API sometimes creates an empty slug,
           * We need to handle that case also on front-end,
           * so after fix that problem in the API, the UI will ablle
           * to handle it.
           *
           * If the slug is empty, use the name
           */
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
  }),
  link,
});

export const saleorClient = createSaleorClient({
  apiUrl: getApiUrl(),
  channel: "",
});
