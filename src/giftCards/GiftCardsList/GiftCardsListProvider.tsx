import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings, {
  UseListSettings
} from "@saleor/hooks/useListSettings";
import { PageInfo } from "@saleor/hooks/useLocalPaginator";
import {
  createPaginationState,
  PaginationState
} from "@saleor/hooks/usePaginator";
import faker from "faker";
import capitalize from "lodash-es/capitalize";
import React, { createContext } from "react";

import { ListViews, Node } from "../../types";
import { GiftCardListColummns, GiftCardListUrlQueryParams } from "./types";

// TEMP DATA & HELPERS
const getNumbersString = (num: number) => {
  const numString = num.toString();

  switch (numString.length) {
    case 4:
      return numString;

    case 3:
      return `0${numString}`;
    case 2:
      return `00${numString}`;
    default:
      return `000${numString}`;
  }
};

const displayAtRandom = yes => (faker.datatype.boolean() ? yes : null);

const data = {
  giftCards: new Array(4).fill(null).map(() => ({
    id: faker.datatype.uuid(),
    displayCode: getNumbersString(faker.datatype.number({ min: 0, max: 9999 })),
    usedBy: displayAtRandom({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      id: faker.datatype.uuid()
    }),
    usedByEmail: displayAtRandom(faker.internet.email().toLowerCase()),
    tag: displayAtRandom(capitalize(faker.lorem.words(2))),
    isActive: faker.datatype.boolean(),
    product: displayAtRandom({
      name: faker.commerce.productName(),
      id: faker.datatype.uuid()
    }),
    currentBalance: {
      currency: "USD",
      amount: parseFloat(faker.finance.amount(1, 999))
    }
  }))
};

export interface GiftCardsListConsumerProps
  extends UseListSettings<GiftCardListColummns> {
  isSelected: (id: string) => boolean;
  listElements: string[];
  toggle: (id: string) => void;
  toggleAll: (items: Node[], selected: number) => void;
  reset: () => void;
  selectedItemsCount: number;
  giftCards: GiftCard[];
  pageInfo: PageInfo;
  loading: boolean;
  params: GiftCardListUrlQueryParams;
  paginationState: PaginationState;
}

// ---------------

interface GiftCardsListProviderProps {
  children: React.ReactNode;
  params: GiftCardListUrlQueryParams;
}

export const GiftCardsListContext = createContext<GiftCardsListConsumerProps>(
  null
);

export const GiftCardsListProvider: React.FC<GiftCardsListProviderProps> = ({
  children,
  params
}) => {
  // TEMP
  const initiallySelected = [];

  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    initiallySelected
  );

  const { updateListSettings, settings } = useListSettings<
    GiftCardListColummns
  >(ListViews.GIFT_CARD_LIST);

  // TEMP
  // const filter = getFilterVariables(params);
  // const sort = getSortQueryVariables(params);

  const queryVariables = React.useMemo<GiftCardListVariables>(
    () => ({
      ...paginationState
      // TEMP
      // filter,
      // sort
    }),
    [params, settings?.rowNumber]
  );

  // TEMP
  const loading = false;
  // const { data, loading } = useGiftCardListQuery({
  //   displayLoader: true,
  //   variables: queryVariables
  // });

  const paginationState = createPaginationState(settings?.rowNumber, params);

  const providerValues: GiftCardsListConsumerProps = {
    isSelected,
    listElements,
    reset,
    toggleAll,
    toggle,
    selectedItemsCount: listElements.length,
    settings,
    updateListSettings,
    loading,
    // TEMP
    // giftCards: mapEdgesToItems(data?.giftCards),
    giftCards: data?.giftCards,
    pageInfo: data?.giftCards?.pageInfo,
    params
  };

  return (
    <GiftCardsListContext.Provider value={providerValues}>
      {children}
    </GiftCardsListContext.Provider>
  );
};
