import React, { useEffect, useRef, useState } from 'react'
import { fetchLyrics } from '../service/LyricsService'
import { useDataContext } from '../DataContext'
import { fetchArtistAndSongNames } from '../service/Store'

const LyricsPlayer = () => {
    const { fileName, metadata, setMetadata } = useDataContext()
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState<string>()

    const artistRef = useRef<HTMLInputElement>(null)
    const songRef = useRef<HTMLInputElement>(null)

    const fetchData = async (fileName: string, artistValue: string, songValue: string) => {
        setError(undefined)
        setFetching(true)
        try {
            const meta = await fetchLyrics(fileName, artistValue, songValue)
            if (meta) setMetadata(meta)
        } catch (e) {
            setError('no lyrics')
            console.error(e)
        } finally {
            setFetching(false)
        }
    }

    const onSubmit = (e: React.SubmitEvent) => {
        e.preventDefault()
        const artistValue = artistRef.current?.value
        const songValue = songRef.current?.value
        if (fileName && artistValue && songValue) {
            fetchData(fileName.trim(), artistValue.trim(), songValue.trim())
        }
    }

    useEffect(() => {
        if (!fileName) return
        setFetching(false)
        setMetadata(undefined)
        setTimeout(() => {
            if (!artistRef.current || !songRef.current) return
            artistRef.current.value = ''
            songRef.current.value = fileName.trim()
            const { artist, song } = fetchArtistAndSongNames(fileName) ?? {}
            if (artist) artistRef.current.value = artist
            if (song) songRef.current.value = song
        }, 0)
    }, [fileName, setMetadata])

    if (!metadata) {
        return (
            <form onSubmit={onSubmit}>
                <fieldset>
                    <label>
                        Artist: <input name="artist" ref={artistRef} autoComplete="on" />
                    </label>
                    <label>
                        Song: <input name="song" ref={songRef} autoComplete="on" />
                    </label>
                </fieldset>
                <input type="submit" value="fetch lyrics" disabled={fetching} />
                {error && <strong className="error">{error}</strong>}
            </form>
        )
    }

    return (
        <>
            <h3>{metadata?.artistName}</h3>
            <h3>{metadata?.albumName}</h3>
            <h2>{metadata?.trackName}</h2>
        </>
    )
}

export default LyricsPlayer
