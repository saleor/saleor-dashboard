import { SVGAttributes } from "react"

interface IChevronIconProps extends SVGAttributes<{}> {}

export const ChevronIcon = (props: IChevronIconProps) => {
  const { width = "1.5rem", height = "1.5rem" } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 5l7 7-7 7M5 5l7 7-7 7"
      />
    </svg>
  )
}
