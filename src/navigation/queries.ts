import {
  menuDetailsFragment,
  menuFragment
} from "@saleor/fragments/navigation";
import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { MenuDetails, MenuDetailsVariables } from "./types/MenuDetails";
import { MenuList, MenuListVariables } from "./types/MenuList";

const menuList = gql`
  ${menuFragment}
  ${pageInfoFragment}
  query MenuList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $sort: MenuSortingInput
  ) {
    menus(
      first: $first
      after: $after
      before: $before
      last: $last
      sortBy: $sort
    ) {
      edges {
        node {
          ...MenuFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;
export const useMenuListQuery = makeQuery<MenuList, MenuListVariables>(
  menuList
);

const menuDetails = gql`
  ${menuDetailsFragment}
  query MenuDetails($id: ID!) {
    menu(id: $id) {
      ...MenuDetailsFragment
    }
  }
`;
export const MenuDetailsQuery = TypedQuery<MenuDetails, MenuDetailsVariables>(
  menuDetails
);
