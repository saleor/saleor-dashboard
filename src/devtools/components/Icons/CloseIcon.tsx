import { SVGAttributes } from "react"

interface ICloseIconProps extends SVGAttributes<{}> {}

export const CloseIcon = (props: ICloseIconProps) => {
  const { width = "1.5rem", height = "1.5rem" } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  )
}
