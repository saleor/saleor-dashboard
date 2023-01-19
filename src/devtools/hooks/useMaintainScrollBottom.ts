import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { usePrevious } from "./usePrevious"

interface IUseMaintainScrollBottomArgs {
  isActive?: boolean
  totalEntries: number
}

const isScrollBottom = (
  scrollableElement: HTMLElement,
  thresholdPixels: number
) => {
  const { scrollHeight, clientHeight, scrollTop } = scrollableElement
  return (
    scrollTop > 0 &&
    Math.ceil(scrollTop + clientHeight) >= scrollHeight - thresholdPixels
  )
}

const isScrollable = (scrollableElement: HTMLElement) => {
  const { scrollHeight, clientHeight } = scrollableElement
  return scrollHeight > clientHeight
}

export const useMaintainScrollBottom = (args: IUseMaintainScrollBottomArgs) => {
  const { totalEntries, isActive } = args
  const previousTotalEntried = usePrevious(totalEntries)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true)
  const isEntriesChanged = previousTotalEntried !== totalEntries

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) {
      return
    }

    const handleScroll = () => {
      if (isScrollable(scrollElement)) {
        setIsAutoScrollEnabled(isScrollBottom(scrollElement, 50))
      }
    }

    scrollElement.addEventListener("scroll", handleScroll)
    return () => scrollElement.removeEventListener("scroll", handleScroll)
  }, [scrollRef, setIsAutoScrollEnabled])

  useLayoutEffect(() => {
    const scrollElement = scrollRef.current
    if (isAutoScrollEnabled && isEntriesChanged && isActive && scrollElement) {
      scrollElement.scrollTop = scrollElement.scrollHeight
    }
  }, [scrollRef, isAutoScrollEnabled, isEntriesChanged, isActive])

  return scrollRef
}
