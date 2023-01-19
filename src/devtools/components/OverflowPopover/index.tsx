import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "../Button"
import { ChevronIcon } from "../Icons/ChevronIcon"
import { Popover } from "../Popover"

interface IOverflowPopoverProps {
  className?: string
  items: React.ReactNode[]
}

interface IItemProps {
  isVisible?: boolean
  children?: React.ReactNode
}

export const Item = React.forwardRef<HTMLDivElement, IItemProps>(
  (props, ref) => {
    const { children, isVisible = true } = props

    return (
      <div
        ref={ref}
        className={isVisible ? "" : "invisible pointer-events-none"}
      >
        {children}
      </div>
    )
  }
)

const useVisibilityObserver = (
  refs: React.MutableRefObject<(HTMLDivElement | null)[]>
) => {
  const [itemsOnScreen, setItemOnScreen] = useState<boolean[]>([])

  const handleResize = useCallback(() => {
    const windowWidth = window.innerWidth - 30
    const elementVisibility = refs.current.map((element) => {
      const dims = element?.getBoundingClientRect()
      const elementRightEdge = dims?.right || 0

      return elementRightEdge < windowWidth
    })
    setItemOnScreen(elementVisibility)
  }, [refs])

  // Noticed when loaded as an extension the delay was
  // required otherwise items would not align correctly
  useEffect(() => {
    handleResize()
    const timer = setTimeout(() => {
      handleResize()
    }, 300)
    return () => clearTimeout(timer)
  }, [handleResize])

  useEffect(() => {
    window.addEventListener("resize", handleResize, false)
    return () => {
      window.removeEventListener("resize", handleResize, false)
    }
  }, [handleResize])

  return itemsOnScreen
}

export const OverflowPopover = (props: IOverflowPopoverProps) => {
  const { items, className } = props
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const itemsOnScreen = useVisibilityObserver(itemRefs)
  const isAnyItemOffScreen = itemsOnScreen.some((isOnScreen) => !isOnScreen)

  return (
    <div className={`flex items-center ${className}`}>
      {items.map((item, index) => {
        const isOnScreen = itemsOnScreen[index] ?? true

        return (
          <Item
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            isVisible={isOnScreen}
          >
            {item}
          </Item>
        )
      })}

      {isAnyItemOffScreen && (
        <div className="absolute top-0 bottom-0 right-0 flex items-center">
          <div className="justify-center h-fit pr-2">
            <Popover button={<Button icon={<ChevronIcon />} />}>
              <div className="p-4 flex flex-col space-y-2">
                {items.map((item, index) => {
                  const isOnScreen = itemsOnScreen[index]
                  if (isOnScreen) {
                    return null
                  }

                  return <Item key={index}>{item}</Item>
                })}
              </div>
            </Popover>
          </div>
        </div>
      )}
    </div>
  )
}
