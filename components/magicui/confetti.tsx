"use client"

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import type { CreateTypes as ConfettiInstance, GlobalOptions as ConfettiGlobalOptions, Options as ConfettiOptions } from "canvas-confetti"
import confetti from "canvas-confetti"

export type ConfettiRef = { fire: (options?: ConfettiOptions) => Promise<void> | void }

type ConfettiProps = React.ComponentPropsWithRef<"canvas"> & {
  options?: ConfettiOptions
  globalOptions?: ConfettiGlobalOptions
  manualstart?: boolean
}

// Composant Confetti officiel de Magic UI, conservé localement pour pouvoir
// l'utiliser sans ajouter le reste de la registry Shadcn.
export const Confetti = forwardRef<ConfettiRef, ConfettiProps>((props, ref) => {
  const { options, globalOptions = { resize: true, useWorker: true }, manualstart = false, className, ...rest } = props
  const canvasNodeRef = useRef<HTMLCanvasElement | null>(null)
  const instanceRef = useRef<ConfettiInstance | null>(null)
  const optionsRef = useRef(options)
  const globalOptionsRef = useRef(globalOptions)

  useEffect(() => { optionsRef.current = options }, [options])
  useEffect(() => { globalOptionsRef.current = globalOptions }, [globalOptions])
  useEffect(() => {
    if (canvasNodeRef.current && !instanceRef.current) {
      instanceRef.current = confetti.create(canvasNodeRef.current, { resize: true, useWorker: true, ...globalOptionsRef.current })
    }
    return () => { instanceRef.current?.reset(); instanceRef.current = null }
  }, [])

  const fire = useCallback(async (fireOptions: ConfettiOptions = {}) => {
    try { await instanceRef.current?.({ ...optionsRef.current, ...fireOptions }) }
    catch (error) { console.error("Confetti error:", error) }
  }, [])
  const api = useMemo<ConfettiRef>(() => ({ fire }), [fire])
  useImperativeHandle(ref, () => api, [api])

  useEffect(() => { if (!manualstart) void fire() }, [manualstart, fire])
  return <canvas ref={canvasNodeRef} className={className} {...rest} />
})

Confetti.displayName = "Confetti"
