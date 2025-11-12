import type { FindLyricsResponse } from 'lrclib-api'
import React, { useEffect, useRef, useState } from 'react'
import { fetchLyrics } from '../service/LyricsService'
import LyricsPrompter from './LyricsPrompter'

type LyricsProps = {
    fileName?: string
    currentTime?: number
}

const LyricsPlayer: React.FC<LyricsProps> = ({ fileName, currentTime }) => {
    const [metadata, setMetadata] = useState<FindLyricsResponse>()
    const [fetching, setFetching] = useState(false)

    const artistRef = useRef<HTMLInputElement>(null)
    const songRef = useRef<HTMLInputElement>(null)

    const fetchData = async (artistValue: string, songValue: string) => {
        if (artistValue && songValue) {
            const metadata = await fetchLyrics(artistValue, songValue)
            if (metadata) setMetadata(metadata)
        }
    }
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const artistValue = artistRef.current?.value
        const songValue = songRef.current?.value
        if (artistValue && songValue) {
            setFetching(true)
            fetchData(artistValue, songValue)
        }
    }

    useEffect(() => {
        if (!fileName) return
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMetadata(undefined)
        setFetching(false)

        if (!artistRef.current || !songRef.current) return
        if (fileName.includes('-')) {
            const [artist, song] = fileName.split('-')
            if (artist) artistRef.current.value = artist
            if (song) songRef.current.value = song
        } else {
            artistRef.current.value = ''
            songRef.current.value = fileName
        }
    }, [fileName])

    if (!metadata) {
        return (
            <div>
                <form onSubmit={onSubmit}>
                    <fieldset>
                        <label>
                            Artist: <input ref={artistRef} />
                        </label>
                        <label>
                            Song: <input ref={songRef} />
                        </label>
                    </fieldset>
                    <input type="submit" value="fetch lyrics" disabled={fetching} />
                </form>
            </div>
        )
    }

    return (
        <div>
            <h2>{metadata?.artistName}</h2>
            <h3>
                {metadata?.albumName} - {metadata?.trackName}
            </h3>
            <LyricsPrompter metadata={metadata} currentTime={currentTime} />
        </div>
    )
}

export default LyricsPlayer
