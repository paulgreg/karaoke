import React, { useState } from 'react'
import LyricsPlayer from './LyricsPlayer'

const SongSelector = () => {
    const [audioSrc, setAudioSrc] = useState<string>()
    const [fileName, setFileName] = useState<string>()
    const [error, setError] = useState('')
    const [currentTime, setCurrentTime] = useState<number>(0)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setAudioSrc(undefined)

        const files = e.target.files
        if (files?.length) {
            const file = files[0]
            try {
                const { name } = file
                const [n] = name.split('.')
                setFileName(n)
                setError('')

                const src = URL.createObjectURL(file)
                setTimeout(() => {
                    // Add a slight delay to ensure the component fully resets
                    setAudioSrc(src)
                }, 0)
            } catch (err) {
                setError('Failed to extract metadata')
                console.error(err)
            }
        }
    }

    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
        setCurrentTime(e.currentTarget.currentTime)
    }

    return (
        <div>
            <div>
                <input type="file" accept=".mp3,.m4a,ogg" onChange={handleFileChange} />
            </div>
            <p>
                {error && <strong style={{ color: 'red' }}>{error}</strong>}
                {!error && <small>artist - song name.mp3/m4a/ogg</small>}
            </p>
            <div>
                {audioSrc && (
                    <audio controls onTimeUpdate={handleTimeUpdate}>
                        <source src={audioSrc} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                )}
            </div>
            <LyricsPlayer fileName={fileName} currentTime={currentTime} />
        </div>
    )
}

export default SongSelector
