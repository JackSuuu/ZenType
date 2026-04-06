import { useEffect, useRef } from 'react'
import { useTypingStore } from '../stores/typingStore'

export function useTimer() {
  const { testState, tick, mode, timeRemaining } = useTypingStore()
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (testState === 'running') {
      intervalRef.current = window.setInterval(() => {
        tick()
      }, 1000)
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [testState, tick])

  // Stop timer when time runs out (time mode)
  useEffect(() => {
    if (mode === 'time' && timeRemaining === 0) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [mode, timeRemaining])
}
