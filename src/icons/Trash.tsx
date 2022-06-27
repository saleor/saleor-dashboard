import { createSvgIcon } from "@material-ui/core/utils";
import { useTheme } from "@saleor/macaw-ui";
import React from "react";

const Trash: React.FC = () => {
  const { themeType } = useTheme();

  const TrashComponent = createSvgIcon(
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0C5.89543 0 5 0.89543 5 2V3H1C0.447715 3 0 3.44772 0 4C0 4.55228 0.447715 5 1 5H17C17.5523 5 18 4.55228 18 4C18 3.44772 17.5523 3 17 3H13V2C13 0.89543 12.1046 0 11 0H7ZM11 3H7V2H11V3ZM4 8C4 7.44772 3.55228 7 3 7C2.44772 7 2 7.44772 2 8V19C2 20.6569 3.34315 22 5 22H13C14.6569 22 16 20.6569 16 19V8C16 7.44772 15.5523 7 15 7C14.4477 7 14 7.44772 14 8V19C14 19.5523 13.5523 20 13 20H5C4.44772 20 4 19.5523 4 19V8ZM7 10C7.55228 10 8 10.4477 8 11V16C8 16.5523 7.55228 17 7 17C6.44772 17 6 16.5523 6 16V11C6 10.4477 6.44772 10 7 10ZM12 11C12 10.4477 11.5523 10 11 10C10.4477 10 10 10.4477 10 11V16C10 16.5523 10.4477 17 11 17C11.5523 17 12 16.5523 12 16V11Z"
        fill={themeType === "dark" ? "#FAFAFA" : "#28234A"}
        fillOpacity="0.6"
      />
    </svg>,
    "Trash",
  );

  return <TrashComponent />;
};

export default Trash;
