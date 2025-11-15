import React, { useMemo, useState } from 'react'
import { DataContext, type SyncLyricType } from './DataContext'
import type { FindLyricsResponse } from 'lrclib-api'

interface DataContextProviderPropsType {
    children: React.ReactNode | React.ReactNode[]
}

const timecodedLyricsRegEx = /\[(\d{2}):(\d{2}\.\d{2})\]\s*(.+)/

const DataContextProvider: React.FC<DataContextProviderPropsType> = ({ children }) => {
    const [fileName, setFileName] = useState<string>()
    const [audioSrc, setAudioSrc] = useState<string>()
    const [currentTime, setCurrentTime] = useState<number>()
    const [metadata, setMetadata] = useState<FindLyricsResponse>()

    const contextValue = useMemo(
        () => ({
            fileName,
            setFileName,
            audioSrc,
            setAudioSrc,
            currentTime,
            setCurrentTime,
            metadata,
            setMetadata,
            plainLyrics: metadata?.plainLyrics || undefined,
            syncLyrics: metadata?.syncedLyrics?.length
                ? metadata.syncedLyrics.split('\n').map((s) => {
                      const match = timecodedLyricsRegEx.exec(s)
                      if (match) {
                          const minuteStr = match[1]
                          const secondStr = match[2]
                          const lyric = match[3].trim()

                          const min = Number.parseInt(minuteStr, 10) * 60
                          const sec = Number.parseFloat(secondStr)

                          return {
                              time: `${minuteStr}:${secondStr.split('.')[0]}`,
                              timecode: min + sec,
                              lyric,
                          } as SyncLyricType
                      } else {
                          return { time: '', timecode: 0, lyric: 'error' } as SyncLyricType
                      }
                  })
                : ([] as SyncLyricType[]),
        }),
        [fileName, audioSrc, currentTime, metadata]
    )

    return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
}

export default DataContextProvider
