"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface UseTypewriterOptions {
    speed?: number
    startDelay?: number
    start?: boolean
}

export function useTypewriter(text: string, options: UseTypewriterOptions = {}) {
    const { speed = 50, startDelay = 0, start = true } = options
    const [displayedText, setDisplayedText] = useState("")
    const [isComplete, setIsComplete] = useState(false)
    const indexRef = useRef(0)
    const hasStartedRef = useRef(false)

    const reset = useCallback(() => {
        setDisplayedText("")
        setIsComplete(false)
        indexRef.current = 0
        hasStartedRef.current = false
    }, [])

    useEffect(() => {
        if (!start || hasStartedRef.current) return

        hasStartedRef.current = true
        indexRef.current = 0
        setDisplayedText("")

        const startTimeout = setTimeout(() => {
            const intervalId = setInterval(() => {
                if (indexRef.current < text.length) {
                    const char = text[indexRef.current]
                    setDisplayedText((prev) => prev + char)
                    indexRef.current++
                } else {
                    setIsComplete(true)
                    clearInterval(intervalId)
                }
            }, speed)

            return () => clearInterval(intervalId)
        }, startDelay)

        return () => {
            clearTimeout(startTimeout)
        }
    }, [text, speed, startDelay, start])

    return { displayedText, isComplete, reset }
}
