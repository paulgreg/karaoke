import type { FindLyricsResponse } from 'lrclib-api'
import { createContext, useContext } from 'react'

export type SyncLyricType = { time: string; timecode: number; lyric: string }

type DataContextType = {
    fileName?: string
    setFileName: (s?: string) => void
    audioSrc?: string
    setAudioSrc: (s?: string) => void
    currentTime?: number
    setCurrentTime: (n?: number) => void
    metadata?: FindLyricsResponse
    setMetadata: (m?: FindLyricsResponse) => void
    plainLyrics?: string
    syncLyrics?: Array<SyncLyricType>
}

export const DataContext = createContext<DataContextType>({} as DataContextType)

export const useDataContext = () => useContext(DataContext)
