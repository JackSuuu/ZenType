import { useRef, useCallback } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

// Using Web Audio API to generate sounds procedurally (no external files needed)

// Use Web Audio API for real-time sound generation
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioCtx
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3,
  decay: number = 0.1
) {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, ctx.currentTime + duration)

    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration + decay)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration + decay)
  } catch (e) {
    // Audio context not available
  }
}

function playNoise(duration: number, volume: number = 0.15, filter?: number) {
  try {
    const ctx = getAudioContext()
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    if (filter) {
      const biquadFilter = ctx.createBiquadFilter()
      biquadFilter.type = 'bandpass'
      biquadFilter.frequency.value = filter
      biquadFilter.Q.value = 0.5
      source.connect(biquadFilter)
      biquadFilter.connect(gainNode)
    } else {
      source.connect(gainNode)
    }

    gainNode.connect(ctx.destination)
    source.start(ctx.currentTime)
  } catch (e) {
    // Audio not available
  }
}

type SoundEvent = 'keypress' | 'error' | 'space' | 'complete'

const soundProfiles: Record<string, Record<SoundEvent, () => void>> = {
  none: {
    keypress: () => {},
    error: () => {},
    space: () => {},
    complete: () => {},
  },
  wood: {
    keypress: () => {
      playNoise(0.04, 0.2, 2000)
      playTone(800, 0.02, 'sine', 0.05)
    },
    error: () => {
      playTone(200, 0.05, 'sawtooth', 0.15, 0.05)
    },
    space: () => {
      playNoise(0.06, 0.15, 1200)
      playTone(600, 0.03, 'sine', 0.04)
    },
    complete: () => {
      playTone(523, 0.15, 'sine', 0.2)
      setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 150)
      setTimeout(() => playTone(784, 0.3, 'sine', 0.2), 300)
    },
  },
  mechanical: {
    keypress: () => {
      playNoise(0.025, 0.3, 3000)
      playTone(1200, 0.015, 'square', 0.04, 0.02)
    },
    error: () => {
      playTone(150, 0.08, 'sawtooth', 0.2, 0.1)
    },
    space: () => {
      playNoise(0.05, 0.25, 1500)
    },
    complete: () => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => playNoise(0.03, 0.2, 2000), i * 80)
      }
      setTimeout(() => playTone(880, 0.2, 'sine', 0.15), 300)
    },
  },
  soft: {
    keypress: () => {
      playTone(600 + Math.random() * 200, 0.05, 'sine', 0.08, 0.08)
    },
    error: () => {
      playTone(250, 0.08, 'sine', 0.12, 0.1)
    },
    space: () => {
      playTone(400, 0.06, 'sine', 0.06, 0.1)
    },
    complete: () => {
      // Wind chime effect
      const notes = [523, 659, 784, 1047]
      notes.forEach((note, i) => {
        setTimeout(() => playTone(note, 0.4, 'sine', 0.15, 0.4), i * 120)
      })
    },
  },
  typewriter: {
    keypress: () => {
      playNoise(0.03, 0.25, 2500)
      playTone(1800, 0.01, 'square', 0.06, 0.01)
    },
    error: () => {
      playTone(180, 0.1, 'sawtooth', 0.25, 0.08)
    },
    space: () => {
      playNoise(0.04, 0.2, 1800)
      playTone(1400, 0.02, 'square', 0.05)
    },
    complete: () => {
      // Typewriter ding
      playTone(1760, 0.4, 'sine', 0.3, 0.5)
    },
  },
}

export function useSound() {
  const { soundProfile, soundVolume } = useSettingsStore()
  const volumeRef = useRef(soundVolume)
  volumeRef.current = soundVolume

  const play = useCallback(
    (event: SoundEvent) => {
      if (soundProfile === 'none' || volumeRef.current === 0) return
      const profile = soundProfiles[soundProfile] || soundProfiles.wood
      profile[event]?.()
    },
    [soundProfile]
  )

  return { play }
}
