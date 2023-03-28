import { Box, DropdownButton } from "@saleor/macaw-ui/next";
import React, { MouseEventHandler } from "react";
import { FormattedMessage } from "react-intl";

interface FilterButtonProps {
  isFilterActive: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  selectedFilterAmount: number;
}

export const FilterButton = ({
  isFilterActive,
  onClick,
  selectedFilterAmount,
}: FilterButtonProps) => (
  <DropdownButton data-test-id="show-filters-button" onClick={onClick}>
    <FormattedMessage
      id="FNpv6K"
      defaultMessage="Filters"
      description="button"
    />
    {isFilterActive && (
      <>
        <Box
          as="span"
          backgroundColor="interactiveNeutralDefault"
          height={6}
          width={1}
          marginX={3}
        />
        {selectedFilterAmount}
      </>
    )}
  </DropdownButton>
);
