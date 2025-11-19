import { DEFAULT_ICON_SIZE } from "./utils";

/**
 *  Based on `lucide-react/Package` icon
 */
export const ReturnedIcon = ({
  size = DEFAULT_ICON_SIZE,
  className,
  color = "currentColor",
}: {
  size?: number;
  className?: string;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M14.875 8.5V5.66664C14.8747 5.41821 14.8092 5.17421 14.6848 4.95913C14.5605 4.74405 14.3818 4.56544 14.1667 4.44122L9.20833 1.60789C8.99297 1.48355 8.74868 1.41809 8.5 1.41809C8.25132 1.41809 8.00703 1.48355 7.79167 1.60789L2.83333 4.44122C2.61819 4.56544 2.43949 4.74405 2.31516 4.95913C2.19083 5.17421 2.12525 5.41821 2.125 5.66664V11.3333C2.12525 11.5817 2.19083 11.8257 2.31516 12.0408C2.43949 12.2559 2.61819 12.4345 2.83333 12.5587L7.79167 15.3921C8.00703 15.5164 8.25132 15.5819 8.5 15.5819C8.74868 15.5819 8.99297 15.5164 9.20833 15.3921L11 14"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8.5 15.5833V8.5" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M2.33044 4.95831L8.50003 8.49998L14.6696 4.95831"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.3125 3.0246L11.6875 6.67251"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.875 12.75L11 10.875L12.875 9"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 10.875H14.9375C15.2084 10.875 15.4766 10.9283 15.7268 11.032C15.977 11.1356 16.2044 11.2876 16.3959 11.4791C16.5874 11.6706 16.7394 11.898 16.843 12.1482C16.9467 12.3984 17 12.6666 17 12.9375C17 13.2084 16.9467 13.4766 16.843 13.7268C16.7394 13.977 16.5874 14.2044 16.3959 14.3959C16.2044 14.5874 15.977 14.7394 15.7268 14.843C15.4766 14.9467 15.2084 15 14.9375 15H13.625"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
