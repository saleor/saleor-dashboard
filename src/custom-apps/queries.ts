import { gql } from "@apollo/client";

export const webhooksDetails = gql`
  query WebhookDetails($id: ID!) {
    webhook(id: $id) {
      ...WebhookDetails
    }
  }
`;

// TODO As of Feb 15, 2023 GraphQL Codegen is unable to
// handle the introspection queries i.e. queries with the
// `__schema`. Thus, the following query is defined in
// `./utils.ts` as-is, without codegen handling it

// export const introspectionQueryList = gql`
//   query IntrospectionQueryList {
//     __schema {
//       queryType {
//         name
//         fields {
//           name
//           description
//         }
//       }
//     }
//   }
// `;
