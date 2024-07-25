// @ts-strict-ignore
import {
  buildClientSchema,
  DocumentNode,
  GraphQLObjectType,
  GraphQLSchema,
  IntrospectionQuery,
  parse,
  visit,
} from "graphql";
import { TypeMap } from "graphql/type/schema";

type SubscriptionQueryPermission = Record<
  string,
  {
    isOptional: boolean;
    permissions: string[];
  }
>;

const tokenTree = (token: DocumentNode["loc"]["startToken"], tokens: string[] = []) => {
  if (token.next) {
    tokens.push(token.value);

    return tokenTree(token.next, tokens);
  }

  return tokens;
};

// Right now, permissions are appended at the end of `description`
// for each field in the result of the introspection query. The format
// is kept consistent, so it's possible to use a RegEx to extract them
// As we move forward, there will be changes in the core to make it
// separated and independant, yet easily accessible
export const extractPermissions = (description?: string) => {
  const match = (description || "").match(/following permissions(.*): (.*?)\./);
  const isOptional = (description || "").includes("one of");
  const permissions = match ? match[2].split(",") : [];

  return {
    isOptional,
    permissions: permissions.map(permission => permission.trim()),
  };
};

export const getPermissions = (
  query: string,
  schema: IntrospectionQuery,
): SubscriptionQueryPermission => {
  return extractPermissionsFromQuery(query, schema);
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
  }, []);

const getSubscriptions = (typeMap: TypeMap) => {
  return Object.keys(typeMap).reduce((acc, key) => {
    const type = typeMap[key] as GraphQLObjectType;

    if (type instanceof GraphQLObjectType) {
      const interfaces = type.getInterfaces();
      const hasEvent = interfaces.some(({ name }) => name === "Event");

      if (hasEvent) {
        return [...acc, type];
      }
    }

    return acc;
  }, []);
};

function getDescriptionsFromQuery(query: string, schema: GraphQLSchema) {
  const descriptions: { [key: string]: string } = {};
  const ast = parse(query);
  const tree = tokenTree(ast.loc.startToken, []);
  const subscriptions = getSubscriptions(schema.getTypeMap());
  const subscriptionsFromQuery = extractSubscriptions(subscriptions, tree);

  visit(ast, {
    Field(node, _key, _parent, _path, ancestors) {
      for (const _type in subscriptionsFromQuery) {
        const fieldPath = ancestors
          .filter((ancestor: any) => ancestor.kind === "Field")
          .map((ancestor: any) => ancestor.name.value)
          .concat(node.name.value);
        let type = subscriptionsFromQuery[_type];

        for (const fieldName of fieldPath.slice(1, -1)) {
          if (type) {
            const field = type.getFields()[fieldName];

            type = field ? (field.type as GraphQLObjectType) : undefined;
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
  _schema: IntrospectionQuery,
): SubscriptionQueryPermission => {
  let permissions: SubscriptionQueryPermission;

  try {
    const schema = buildClientSchema(_schema);
    const descriptions = getDescriptionsFromQuery(query, schema);

    const _permissions = Object.keys(descriptions).reduce((acc, key) => {
      const { isOptional, permissions } = extractPermissions(descriptions[key]);

      if (permissions.length > 0) {
        acc[key] = { isOptional, permissions };
      }

      return acc;
    }, {});

    permissions = _permissions;
  } catch (error) {
    // explicit silent
  }

  return permissions;
};
