import { SVGAttributes } from "react"

interface ICodeIconProps extends SVGAttributes<{}> {}

export const CodeIcon = (props: ICodeIconProps) => {
  const { width = "1.5rem", height = "1.5rem", className } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-6 w-6 ${className}`}
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
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  )
}
