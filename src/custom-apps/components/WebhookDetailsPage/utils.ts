import { gql } from "@apollo/client";

export interface IntrospectionNode {
  name: string;
  interfaces: Array<{
    name: string;
  }> | null;
  description: string;
}

// cannot be in `queries.ts` as codegen cannot handle `__schema`
export const IntrospectionQuery = gql`
  query EventsIntrospection {
    __schema {
      types {
        name
        interfaces {
          name
        }
        description
      }
    }
  }
`;

const isEvent = ({ name }) => name === "Event";

export const buildEventsMap = (elements: IntrospectionNode[]) =>
  elements.filter(({ interfaces }) => (interfaces || []).some(isEvent));
