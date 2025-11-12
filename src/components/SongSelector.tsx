import React, { useState } from 'react'
import LyricsPlayer from './Lyrics'

const SongSelector = () => {
    const [audioSrc, setAudioSrc] = useState<string>()
    const [artist, setArtist] = useState<string>()
    const [song, setSong] = useState<string>()
    const [error, setError] = useState('')
    const [currentTime, setCurrentTime] = useState<number>(0)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const file = files[0]
            try {
                setAudioSrc(URL.createObjectURL(file))
                const { name } = file
                const n = name.split('.')
                const [artist, song] = n[0].split('-')
                if (artist) setArtist(artist)
                if (song) setSong(song)
                setError('')
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
                <input type="file" accept=".mp3,.m4a" onChange={handleFileChange} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <small>artist - song name.mp3/m4a</small>
            <div>
                {audioSrc && (
                    <audio controls onTimeUpdate={handleTimeUpdate}>
                        <source src={audioSrc} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                )}
            </div>
            <LyricsPlayer artist={artist} song={song} currentTime={currentTime} />
        </div>
    )
}

export default SongSelector
