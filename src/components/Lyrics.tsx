import type { FindLyricsResponse } from 'lrclib-api'
import React, { useRef, useState } from 'react'
import { fetchLyrics } from '../service/LyricsService'
import LyricsPrompter from './LyricsPrompter'

type LyricsProps = {
    artist?: string
    song?: string
    currentTime?: number
}

const LyricsPlayer: React.FC<LyricsProps> = ({ artist, song, currentTime }) => {
    const [metadata, setMetadata] = useState<FindLyricsResponse>()
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
            fetchData(artistValue, songValue)
        }
    }

    if (!metadata) {
        return (
            <div>
                <form onSubmit={onSubmit}>
                    <fieldset>
                        <label>
                            Artist: <input ref={artistRef} defaultValue={artist} />
                        </label>
                        <label>
                            Song: <input ref={songRef} defaultValue={song} />
                        </label>
                    </fieldset>
                    <input type="submit" value="fetch lyrics" />
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
