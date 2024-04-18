// @ts-strict-ignore
import { gql } from "@apollo/client";
import { FieldNode, parse, SelectionNode, visit } from "graphql";

interface IntrospectionNode {
  kind: string;
  name: string;
  description: string;
  fields: Array<{
    name: string;
    description: string;
  }>;
}

interface PermissionChildNode {
  permissions: string[];
  children: string[];
}

interface PermissionNode {
  permissions: string[];
  children: Record<string, PermissionChildNode>;
}

type PermissionMap = Record<string, PermissionNode>;

// cannot be in `queries.ts` as codegen cannot handle `__schema`
export const IntrospectionQuery = gql`
  query PermissionIntrospection {
    __schema {
      types {
        kind
        name
        description
        fields(includeDeprecated: false) {
          name
          description
        }
      }
    }
  }
`;

const uniq = <T>(value: T, index: number, self: T[]) => self.indexOf(value) === index;

// Right now, permissions are appended at the end of `description`
// for each field in the result of the introspection query. The format
// is kept consistent, so it's possible to use a RegEx to extract them
// As we move forward, there will be changes in the core to make it
// separated and independant, yet easily accessible
export const extractPermissions = (description?: string) => {
  const match = (description || "").match(/following permissions(.*): (.*?)\./);
  const permissions = match ? match[2].split(",") : [];

  return permissions;
};

export const getPermissions = (query: string, permissionMapping: PermissionMap) => {
  const cursors = extractCursorsFromQuery(query);
  return cursors.map(findPermission(permissionMapping)).flat().filter(uniq);
};

export const buildPermissionMap = (elements: IntrospectionNode[]): PermissionMap =>
  elements
    .filter(({ kind }) => kind === "OBJECT")
    .filter(({ name }) => !/(Created|Create|Delete|Deleted|Update|Updated)$/.test(name))
    .reduce((saved, { name, description, fields }) => {
      const permissions = extractPermissions(description);
      const children = fields.reduce((prev, { name, description }) => {
        const permissions = extractPermissions(description);

        return {
          ...prev,
          [name.toLowerCase()]: { permissions },
        };
      }, {});

      return {
        ...saved,
        [name.toLowerCase()]: {
          permissions,
          children,
        },
      };
    }, {});

const byKind = (name: string) => (element: SelectionNode) => element.kind === name;
const extractValue = (element: FieldNode) => element.name.value;
const isNotEvent = (value: string) => value !== "event";

export const extractCursorsFromQuery = (query: string) => {
  const cursors: string[][] = [];

  try {
    const ast = parse(query);

    visit(ast, {
      Field(node, _key, _parent, _path, ancestors) {
        if (node.name.value !== "__typename") {
          const cursor = ancestors.filter(byKind("Field")).map(extractValue).filter(isNotEvent);

          if (cursor.length > 0) {
            cursors.push([...cursor, node.name.value]);
          }
        }
      },
    });
  } catch (error) {
    // explicit silent
  }

  return cursors;
};

const groupBy = <T>(list: T[], groupSize = 2) =>
  list.slice(groupSize - 1).map((_, index) => list.slice(index, index + groupSize));

// Permission Map is a tree like nested structure. As we want to
// visit each level, we split the cursor provided by the user
// into chunks (groups) to check if there are permissions for
// each element between root and leafs
// e.g.
//   ['query', 'order', 'invoices', 'name']
// becomes
//   [['query', 'order'], ['order', 'invoices'], ['invoices', 'name']]
// so we can check first ir `order` contains permission, then `invoices`
// and then `name`
export const findPermission = (permissions: PermissionMap) => (cursor: string[]) => {
  const groups = groupBy(["query", ...cursor]);

  return groups.reduce(
    (saved, [parent, child]) => [
      ...saved,
      ...(permissions[parent] && permissions[parent].children[child]
        ? permissions[parent].children[child].permissions
        : []),
    ],
    [],
  );
};
