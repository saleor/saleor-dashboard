import { DEFAULT_ICON_SIZE } from "./utils";

/**
 *  Based on `lucide-react/Banknote` icon
 */
export const RefundedIcon = ({
  size = DEFAULT_ICON_SIZE,
  className,
  color = "currentColor",
}: {
  size?: number;
  className?: string;
  color?: string;
}): JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 19 19"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.49998 14.25H3.16665C2.74672 14.25 2.34399 14.0832 2.04706 13.7863C1.75013 13.4893 1.58331 13.0866 1.58331 12.6667V6.33333C1.58331 5.91341 1.75013 5.51068 2.04706 5.21375C2.34399 4.91681 2.74672 4.75 3.16665 4.75H15.8333C16.2532 4.75 16.656 4.91681 16.9529 5.21375C17.2498 5.51068 17.4166 5.91341 17.4166 6.33333V10.2917"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.0417 12.6666L12.6667 15.0416L15.0417 17.4166"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14.25 9.5H14.2579" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M17.4167 15.0416L12.6667 15.0416"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4.75 9.5H4.75792" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M9.50002 11.0833C10.3745 11.0833 11.0834 10.3744 11.0834 9.49996C11.0834 8.62551 10.3745 7.91663 9.50002 7.91663C8.62557 7.91663 7.91669 8.62551 7.91669 9.49996C7.91669 10.3744 8.62557 11.0833 9.50002 11.0833Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
