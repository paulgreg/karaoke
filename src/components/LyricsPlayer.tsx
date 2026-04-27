import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { fetchLyrics } from '../service/LyricsService'
import { useDataContext } from '../DataContext'
import { fetchArtistAndSongNames } from '../service/Store'
import type { FindLyricsResponse } from 'lrclib-api'

interface LyricsPlayerProps {
    audioMetadata?: AudioMetadata
}

interface LyricsPlayerRef {
    fetchLyricsData: (artistValue: string, songValue: string) => Promise<FindLyricsResponse | null>
}

const LyricsPlayer = forwardRef<LyricsPlayerRef, LyricsPlayerProps>((props, ref) => {
    const { audioMetadata } = props
    const { fileName, metadata, setMetadata } = useDataContext()
    const [fetching, setFetching] = useState(false)
    const [error, setError] = useState<string>()

    const artistRef = useRef<HTMLInputElement>(null)
    const songRef = useRef<HTMLInputElement>(null)

    const fetchData = async (fileName: string, artistValue: string, songValue: string) => {
        setError(undefined)
        setFetching(true)
        try {
            const meta = await fetchLyrics(fileName, artistValue, songValue, audioMetadata)
            if (meta) setMetadata(meta)
            return meta
        } catch (e) {
            setError('no lyrics')
            console.error(e)
            throw e
        } finally {
            setFetching(false)
        }
    }

    const fetchLyricsData = async (artistValue: string, songValue: string) => {
        if (fileName) {
            return fetchData(fileName, artistValue, songValue)
        }
        throw new Error('No file selected')
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
        setTimeout(() => {
            setMetadata(undefined)
            if (!artistRef.current || !songRef.current) return

            artistRef.current.value = ''
            songRef.current.value = fileName.trim()

            const { artist: storedArtist, song: storedSong } = fetchArtistAndSongNames(fileName) ?? {}

            if (audioMetadata?.artist) {
                artistRef.current.value = audioMetadata.artist
            } else if (storedArtist) {
                artistRef.current.value = storedArtist
            }

            if (audioMetadata?.title) {
                songRef.current.value = audioMetadata.title
            } else if (storedSong) {
                songRef.current.value = storedSong
            }
        }, 0)
    }, [fileName, setMetadata, audioMetadata])

    useImperativeHandle(ref, () => ({
        fetchLyricsData,
    }))

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
                <input type="submit" value={fetching ? 'Fetching...' : 'fetch lyrics'} disabled={fetching} />
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
})

export default LyricsPlayer
