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

type SubscriptionQueryPermission = Record<
  string,
  {
    isOneOfRequired: boolean;
    permissions: string[];
  }
>;

const getStartToken = (documentNode: DocumentNode) => {
  const loc = documentNode.loc as Location | undefined;

  return loc?.startToken;
};

const tokenTree = (token: Token | undefined, tokens: string[] = []): string[] => {
  if (token && token.next) {
    if (typeof token.value === "string") {
      tokens.push(token.value);
    }

    return tokenTree(token.next, tokens);
  }

  return tokens;
};

const unwrapType = (type: GraphQLType): GraphQLType => {
  if (type instanceof GraphQLNonNull || type instanceof GraphQLList) {
    return unwrapType(type.ofType);
  }

  return type;
};

// Right now, permissions are appended at the end of `description`
// for each field in the result of the introspection query. The format
// is kept consistent, so it's possible to use a RegEx to extract them
// As we move forward, there will be changes in the core to make it
// separated and independant, yet easily accessible
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

export const getPermissions = (
  query: string,
  introspectionQuery: IntrospectionQuery,
): SubscriptionQueryPermission => {
  return extractPermissionsFromQuery(query, introspectionQuery);
};

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

function getDescriptionsFromQuery(query: string, schema: GraphQLSchema) {
  const descriptions: { [key: string]: string } = {};
  const ast = parse(query);
  const startToken = getStartToken(ast);
  const tree = tokenTree(startToken, []);
  const subscriptions = getSubscriptions(schema.getTypeMap());
  const subscriptionsFromQuery = extractSubscriptions(subscriptions, tree);

  visit(ast, {
    Field(node, _key, _parent, _path, ancestors) {
      for (const _type in subscriptionsFromQuery) {
        const fieldPath = ancestors
          .filter((ancestor: any) => ancestor.kind === "Field")
          .map((ancestor: any) => ancestor.name.value)
          .concat(node.name.value);
        let type: GraphQLObjectType | undefined = subscriptionsFromQuery[_type];

        for (const fieldName of fieldPath.slice(1, -1)) {
          if (type) {
            const field: GraphQLField<any, any, any> = (
              unwrapType(type) as GraphQLObjectType
            ).getFields()[fieldName];

            // Some types can have multiple nested fields eg. lists
            type = field && field.type ? (unwrapType(field.type) as GraphQLObjectType) : undefined;
          }
        }

        if (type) {
          const field = type.getFields()[node.name.value];

          if (field) {
            descriptions[fieldPath.join(".")] = field.description || "No description available";
          }
        }
      }
    },
  });

  return descriptions;
}

const extractPermissionsFromQuery = (
  query: string,
  introspectionQuery: IntrospectionQuery,
): SubscriptionQueryPermission => {
  let permissions: SubscriptionQueryPermission = {};

  try {
    const schema = buildClientSchema(introspectionQuery);
    const descriptions = getDescriptionsFromQuery(query, schema);

    const _permissions = Object.keys(descriptions).reduce((acc, key) => {
      const { isOneOfRequired, permissions } = extractPermissions(descriptions[key]);

      if (permissions.length > 0) {
        acc[key] = { isOneOfRequired, permissions };
      }

      return acc;
    }, {} as SubscriptionQueryPermission);

    permissions = _permissions;
  } catch (error) {
    // explicit silent
  }

  return permissions;
};
