import type { FindLyricsResponse } from 'lrclib-api'
import { createContext, useContext } from 'react'

type DataContextType = {
    fileName?: string
    setFileName: (s?: string) => void
    audioSrc?: string
    setAudioSrc: (s?: string) => void
    currentTime?: number
    setCurrentTime: (n?: number) => void
    metadata?: FindLyricsResponse
    setMetadata: (m?: FindLyricsResponse) => void
}

export const DataContext = createContext<DataContextType>({} as DataContextType)

export const useDataContext = () => useContext(DataContext)
