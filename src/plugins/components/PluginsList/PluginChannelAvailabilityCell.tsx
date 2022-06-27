import { TableCell } from "@material-ui/core";
import Skeleton from "@saleor/components/Skeleton";
import { PluginBaseFragment } from "@saleor/graphql";
import React, { useRef, useState } from "react";

import PluginAvailabilityStatus from "./PluginAvailabilityStatus";
import PluginAvailabilityStatusPopup from "./PluginAvailabilityStatusPopup";

interface PluginChannelAvailabilityCellProps {
  plugin: PluginBaseFragment;
}

const PluginChannelAvailabilityCell: React.FC<PluginChannelAvailabilityCellProps> = ({
  plugin,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupAnchor = useRef<HTMLTableCellElement>(null);

  const handleMouseOver = () => setIsPopupOpen(true);

  const handleMouseLeave = () => setIsPopupOpen(false);

  return (
    <TableCell
      colSpan={2}
      ref={popupAnchor}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {plugin ? (
        <>
          <PluginAvailabilityStatus plugin={plugin} />
          <PluginAvailabilityStatusPopup
            plugin={plugin}
            isOpen={isPopupOpen}
            anchor={popupAnchor}
          />
        </>
      ) : (
        <Skeleton />
      )}
    </TableCell>
  );
};

export default PluginChannelAvailabilityCell;
