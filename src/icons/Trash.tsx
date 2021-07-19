import createSvgIcon from "@material-ui/icons/utils/createSvgIcon";
import useTheme from "@saleor/hooks/useTheme";
import React from "react";

const Trash: React.FC = () => {
  const { isDark } = useTheme();

  const TrashComponent = createSvgIcon(
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 1C8.89543 1 8 1.89543 8 3V4H4C3.44772 4 3 4.44772 3 5C3 5.55228 3.44772 6 4 6H20C20.5523 6 21 5.55228 21 5C21 4.44772 20.5523 4 20 4H16V3C16 1.89543 15.1046 1 14 1H10ZM14 4H10V3H14V4ZM7 9C7 8.44772 6.55228 8 6 8C5.44772 8 5 8.44772 5 9V20C5 21.6569 6.34315 23 8 23H16C17.6569 23 19 21.6569 19 20V9C19 8.44772 18.5523 8 18 8C17.4477 8 17 8.44772 17 9V20C17 20.5523 16.5523 21 16 21H8C7.44772 21 7 20.5523 7 20V9ZM10 11C10.5523 11 11 11.4477 11 12V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V12C9 11.4477 9.44772 11 10 11ZM15 12C15 11.4477 14.5523 11 14 11C13.4477 11 13 11.4477 13 12V17C13 17.5523 13.4477 18 14 18C14.5523 18 15 17.5523 15 17V12Z"
        fill="#28234A"
        fill-opacity="0.6"
      />
    </svg>,
    "Trash"
  );

  return <TrashComponent />;
};

export default Trash;
