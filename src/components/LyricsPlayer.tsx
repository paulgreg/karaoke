import React, { useEffect, useRef, useState } from 'react'
import { fetchLyrics } from '../service/LyricsService'
import { useDataContext } from '../DataContext'

const LyricsPlayer = () => {
    const { fileName, metadata, setMetadata } = useDataContext()
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState<string>()

    const artistRef = useRef<HTMLInputElement>(null)
    const songRef = useRef<HTMLInputElement>(null)

    const fetchData = async (artistValue: string, songValue: string) => {
        setError(undefined)
        setFetching(true)
        try {
            const meta = await fetchLyrics(artistValue, songValue)
            if (meta) setMetadata(meta)
        } catch (e) {
            setError('no lyrics')
            console.error(e)
        } finally {
            setFetching(false)
        }
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const artistValue = artistRef.current?.value
        const songValue = songRef.current?.value
        if (artistValue && songValue) {
            fetchData(artistValue.trim(), songValue.trim())
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
        }, 0)
    }, [fileName, setMetadata])

    if (!metadata) {
        return (
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
