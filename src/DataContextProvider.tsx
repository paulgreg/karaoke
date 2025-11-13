import React, { useMemo, useState } from 'react'
import { DataContext } from './DataContext'
import type { FindLyricsResponse } from 'lrclib-api'

interface DataContextProviderPropsType {
    children: React.ReactNode | React.ReactNode[]
}

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
        }),
        [fileName, audioSrc, currentTime, metadata]
    )

    return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
}

export default DataContextProvider
