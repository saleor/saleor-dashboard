import { SearchQueryVariables } from "./containers/BaseSearch";

export const APP_MOUNT_URI = process.env.APP_MOUNT_URI || "/";
export const API_URI = process.env.API_URI || "/graphql/";

export const DEFAULT_INITIAL_SEARCH_DATA: SearchQueryVariables = {
  after: null,
  first: 5,
  query: ""
};

export const PAGINATE_BY = 20;
