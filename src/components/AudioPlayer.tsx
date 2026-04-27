import React, { useRef, useImperativeHandle, forwardRef } from 'react'
import { useDataContext } from '../DataContext'
import s from './AudioPlayer.module.css'

interface AudioPlayerRef {
    play: () => Promise<void>
    pause: () => void
}

const AudioPlayer = forwardRef<AudioPlayerRef>((_, ref) => {
    const { audioSrc, setCurrentTime } = useDataContext()
    const audioRef = useRef<HTMLAudioElement>(null)

    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        setCurrentTime(e.currentTarget.currentTime)
    }

    const play = async () => {
        if (audioRef.current) {
            try {
                await audioRef.current.play()
            } catch (error) {
                console.error('Failed to play audio:', error)
                throw error
            }
        }
    }

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause()
        }
    }

    useImperativeHandle(ref, () => ({
        play,
        pause
    }))

    return (
        <div>
            {audioSrc && (
                    <audio 
                    ref={audioRef}
                    className={s.audioPlayer} 
                    controls 
                    onTimeUpdate={handleTimeUpdate}
                >
                    <source src={audioSrc} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            )}
        </div>
    )
})

export default AudioPlayer
