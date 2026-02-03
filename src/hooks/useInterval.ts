import { useEffect, useRef } from 'react'

const useInterval = (callback: () => void, delay: number, init?: boolean) => {
  const savedCallback = useRef<() => void>()
  const initTick = useRef<boolean>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => savedCallback?.current?.()

    if (init && !initTick.current) {
      tick()

      initTick.current = true
    }

    if (delay !== null) {
      const intervalId = setInterval(tick, delay)

      return () => clearInterval(intervalId)
    }
  }, [delay])
}

export { useInterval }
