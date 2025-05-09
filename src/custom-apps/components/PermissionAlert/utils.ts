import {
  buildClientSchema,
  DocumentNode,
  GraphQLField,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLType,
  IntrospectionQuery,
  Location,
  parse,
  Token,
  visit,
} from "graphql";
import { TypeMap } from "graphql/type/schema";

/**
 * Maps field paths to their required permissions and whether one or all are needed
 */
type SubscriptionQueryPermission = Record<
  string,
  {
    /** Indicates if only one of the listed permissions is required, or if all are. */
    isOneOfRequired: boolean;
    /** List of permission code names (e.g., "MANAGE_ORDERS") required for the field. */
    permissions: string[];
  }
>;

const getStartToken = (documentNode: DocumentNode) => {
  const loc = documentNode.loc as Location | undefined;

  return loc?.startToken;
};

type FlattenedTokenArray = (string | undefined)[];

/**
 * Turns a linked list of tokens into a flat array
 */
const toFlattenedTokenArray = (
  token: Token | undefined,
  tokens: FlattenedTokenArray = [],
): FlattenedTokenArray => {
  if (token && token.next) {
    tokens.push(token.value);

    return toFlattenedTokenArray(token.next, tokens);
  }

  return tokens;
};

const flattenedTokenArray = (token: Token | undefined, tokens: string[] = []): string[] => {
  const flattened = toFlattenedTokenArray(token, tokens);

  return flattened.filter(Boolean) as string[];
};

/**
 * Gets the base type, removing wrappers like List and NonNull
 */
const unwrapType = (type: GraphQLType): GraphQLType => {
  if (type instanceof GraphQLNonNull || type instanceof GraphQLList) {
    return unwrapType(type.ofType);
  }

  return type;
};

/**
 * Finds permission requirements mentioned in a field's description.
 *
 * Looks for text like "Requires one of the following permissions: MANAGE_ORDERS, MANAGE_USERS."
 * and extracts both the permissions and whether only one is needed.
 *
 * It works because description in Saleor Core is auto-generated and follows this pattern.
 */
export const extractPermissions = (description?: string) => {
  const match = (description || "").match(/following permissions(.*): (.*?)\./);
  // We're assuming that if there is no "one of" then all permissions are required
  const isOneOfRequired = (description || "").includes("one of");
  const permissions = match ? match[2].split(",") : [];

  return {
    isOneOfRequired,
    permissions: permissions.map(permission => permission.trim()),
  };
};

/**
 * Main function that analyzes a subscription query to determine required permissions.
 *
 * Takes the query and schema information, returning a map of field paths to
 * their permission requirements.
 */
export const getPermissions = (
  query: string,
  introspectionQuery: IntrospectionQuery,
): SubscriptionQueryPermission => {
  return extractPermissionsFromQuery(query, introspectionQuery);
};

/**
 * Filters subscription types to only those mentioned in the query tokens
 */
const extractSubscriptions = (
  subscriptions: GraphQLObjectType[],
  tokens: string[],
): GraphQLObjectType[] =>
  tokens.reduce((acc, token) => {
    const subscription = subscriptions.find(({ name }) => name === token);

    if (subscription) {
      return [...acc, subscription];
    }

    return acc as GraphQLObjectType[];
  }, [] as GraphQLObjectType[]);

/**
 * Finds all subscription event types in the schema (types implementing "Event" interface)
 */
const getSubscriptions = (typeMap: TypeMap): GraphQLObjectType[] =>
  Object.keys(typeMap).reduce((acc, key) => {
    const type = typeMap[key] as GraphQLObjectType;

    if (type instanceof GraphQLObjectType) {
      const interfaces = type.getInterfaces();
      const hasEvent = interfaces.some(({ name }) => name === "Event");

      if (hasEvent) {
        return [...acc, type];
      }
    }

    return acc;
  }, [] as GraphQLObjectType[]);

/**
 * Maps the query structure to the schema to find descriptions for each field.
 *
 * This is the detective work: for each field in the subscription query,
 * it locates the corresponding definition in the schema and extracts
 * its description, which may contain permission information.
 */
function getDescriptionsFromQuery(query: string, schema: GraphQLSchema): { [key: string]: string } {
  const descriptions: { [key: string]: string } = {};
  // Parse the query into a structure we can traverse
  const ast = parse(query);
  const startToken = getStartToken(ast);
  const tree = flattenedTokenArray(startToken, []);
  // Get subscription types from the schema
  const subscriptions = getSubscriptions(schema.getTypeMap());
  const subscriptionsFromQuery = extractSubscriptions(subscriptions, tree);

  // For each field in the query, find its schema description
  visit(ast, {
    Field(node, _key, _parent, _path, ancestors) {
      for (const _type in subscriptionsFromQuery) {
        // Build path like ["orderCreated", "order", "user"]
        const fieldPath = ancestors
          .filter((ancestor: any) => ancestor.kind === "Field")
          .map((ancestor: any) => ancestor.name.value)
          .concat(node.name.value);

        // Start with the subscription event type
        let type: GraphQLObjectType | undefined = subscriptionsFromQuery[_type];

        // Navigate the schema to follow the query path
        // For path like ["orderCreated", "order", "user"],
        // we navigate from Event → Order → User
        for (const fieldName of fieldPath.slice(1, -1)) {
          if (type) {
            const field: GraphQLField<any, any, any> = (
              unwrapType(type) as GraphQLObjectType
            ).getFields()[fieldName];

            // Some types can have multiple nested fields eg. lists
            type = field && field.type ? (unwrapType(field.type) as GraphQLObjectType) : undefined;
          }
        }

        // We've navigated to the parent type - now get the field definition
        if (type) {
          const field = type.getFields()[node.name.value];

          if (field) {
            // Store the description with a dot-separated path as key
            // Example: ["orderCreated", "order", "user"] -> "orderCreated.order.user"
            descriptions[fieldPath.join(".")] = field.description || "No description available";
          }
        }
      }
    },
  });

  return descriptions;
}

/**
 * Analyzes the collected field descriptions to extract permission requirements.
 *
 * For each field description, it calls extractPermissions() to look for permission
 * text patterns and builds a map of only the fields that require permissions.
 */
const extractSubscriptionQueryPermissions = (descriptions: { [key: string]: string }) => {
  return Object.keys(descriptions).reduce((acc, key) => {
    const { isOneOfRequired, permissions } = extractPermissions(descriptions[key]);

    if (permissions.length > 0) {
      acc[key] = { isOneOfRequired, permissions };
    }

    return acc;
  }, {} as SubscriptionQueryPermission);
};

/**
 * Combines all the steps to analyze a subscription query for permissions.
 *
 * 1. Builds the schema from introspection data
 * 2. Gets descriptions for each field in the query
 * 3. Extracts permission requirements from those descriptions
 */
const extractPermissionsFromQuery = (
  query: string,
  introspectionQuery: IntrospectionQuery,
): SubscriptionQueryPermission => {
  let permissions: SubscriptionQueryPermission = {};

  try {
    const schema = buildClientSchema(introspectionQuery);
    const descriptions = getDescriptionsFromQuery(query, schema);

    permissions = extractSubscriptionQueryPermissions(descriptions);
  } catch (error) {
    // explicit silent
  }

  return permissions;
};
