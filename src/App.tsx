import { useState, useRef, useCallback } from 'react'
import AudioPlayer from './components/AudioPlayer'
import LyricsPlayer from './components/LyricsPlayer'
import LyricsPrompter from './components/LyricsPrompter'
import SongSelector from './components/SongSelector'
import DataContextProvider from './DataContextProvider'
import type { FindLyricsResponse } from 'lrclib-api'
import s from './App.module.css'

const App = () => {
    const [audioMetadata, setAudioMetadata] = useState<AudioMetadata>()

    const lyricsPlayerRef = useRef<{
        fetchLyricsData: (artist: string, song: string) => Promise<FindLyricsResponse | null>
    } | null>(null)
    const audioPlayerRef = useRef<{ play: () => Promise<void>; pause: () => void } | null>(null)

    const onFileUploaded = useCallback(async (metadata: AudioMetadata) => {
        setAudioMetadata(metadata)

        if (!metadata?.artist || !metadata?.title) return

        try {
            const lyricsResponse = await lyricsPlayerRef.current?.fetchLyricsData(metadata.artist, metadata.title)

            if (lyricsResponse) await audioPlayerRef.current?.play()
        } catch (err) {
            console.error('Auto-playback failed:', err)
        }
    }, [])

    return (
        <DataContextProvider>
            <header>
                <h1>Karaoke</h1>
            </header>
            <main>
                <div className={s.songContainer}>
                    <SongSelector onFileUploaded={onFileUploaded} />
                    <AudioPlayer ref={audioPlayerRef} />
                    <LyricsPlayer ref={lyricsPlayerRef} audioMetadata={audioMetadata} />
                </div>
                <LyricsPrompter />
            </main>
            <footer>
                <a href="https://github.com/paulgreg/karaoke">source code</a>
            </footer>
        </DataContextProvider>
    )
}

export default App
